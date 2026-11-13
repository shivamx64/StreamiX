package storage

import (
	"context"
	"errors"
	"fmt"
	"io"
	"strings"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/s3/transfermanager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
	"github.com/aws/smithy-go"
)

// S3Options contains connection settings for an S3-compatible endpoint.
type S3Options struct {
	Endpoint        string
	Region          string
	Bucket          string
	AccessKeyID     string
	SecretAccessKey string
	UseSSL          bool
	ForcePathStyle  bool
}

type s3ObjectStore interface {
	GetObject(
		ctx context.Context,
		params *s3.GetObjectInput,
		optFns ...func(*s3.Options),
	) (*s3.GetObjectOutput, error)

	DeleteObject(
		ctx context.Context,
		params *s3.DeleteObjectInput,
		optFns ...func(*s3.Options),
	) (*s3.DeleteObjectOutput, error)
}

type s3Uploader interface {
	UploadObject(
		ctx context.Context,
		input *transfermanager.UploadObjectInput,
		optFns ...func(*transfermanager.Options),
	) (*transfermanager.UploadObjectOutput, error)
}

// S3Storage stores objects in an S3-compatible bucket.
type S3Storage struct {
	objects  s3ObjectStore
	uploader s3Uploader
	bucket   string
}

// NewS3Storage creates an S3-compatible storage backend.
func NewS3Storage(
	ctx context.Context,
	options S3Options,
) (*S3Storage, error) {

	bucket := strings.TrimSpace(options.Bucket)
	if bucket == "" {
		return nil, fmt.Errorf(
			"configuration error: S3_BUCKET is required when STORAGE_DRIVER=s3",
		)
	}

	region := strings.TrimSpace(options.Region)
	if region == "" {
		region = "us-east-1"
	}

	loadOptions := []func(*awsconfig.LoadOptions) error{
		awsconfig.WithRegion(region),
	}

	if options.AccessKeyID != "" || options.SecretAccessKey != "" {
		loadOptions = append(
			loadOptions,
			awsconfig.WithCredentialsProvider(
				credentials.NewStaticCredentialsProvider(
					options.AccessKeyID,
					options.SecretAccessKey,
					"",
				),
			),
		)
	}

	awsConfig, err := awsconfig.LoadDefaultConfig(ctx, loadOptions...)
	if err != nil {
		return nil, fmt.Errorf("load S3 configuration: %w", err)
	}

	endpoint, err := s3Endpoint(options.Endpoint, options.UseSSL)
	if err != nil {
		return nil, err
	}

	client := s3.NewFromConfig(awsConfig, func(clientOptions *s3.Options) {
		clientOptions.UsePathStyle = options.ForcePathStyle

		if endpoint != "" {
			clientOptions.BaseEndpoint = aws.String(endpoint)
		}
	})

	return newS3Storage(client, transfermanager.New(client), bucket), nil
}

func newS3Storage(
	objects s3ObjectStore,
	uploader s3Uploader,
	bucket string,
) *S3Storage {
	return &S3Storage{
		objects:  objects,
		uploader: uploader,
		bucket:   bucket,
	}
}

// Save uploads an object to the bucket.
func (s *S3Storage) Save(
	ctx context.Context,
	key string,
	reader io.Reader,
) (*File, error) {

	counting := &countingReader{reader: reader}

	_, err := s.uploader.UploadObject(
		ctx,
		&transfermanager.UploadObjectInput{
			Bucket: aws.String(s.bucket),
			Key:    aws.String(key),
			Body:   counting,
		},
	)
	if err != nil {
		return nil, fmt.Errorf("%w: %v", ErrSaveFailed, err)
	}

	return &File{
		Key:  key,
		Size: counting.size,
	}, nil
}

// Open downloads an object from the bucket.
func (s *S3Storage) Open(
	ctx context.Context,
	key string,
) (io.ReadCloser, error) {

	output, err := s.objects.GetObject(
		ctx,
		&s3.GetObjectInput{
			Bucket: aws.String(s.bucket),
			Key:    aws.String(key),
		},
	)
	if err != nil {
		if isS3NotFound(err) {
			return nil, ErrFileNotFound
		}

		return nil, fmt.Errorf("%w: %v", ErrOpenFailed, err)
	}

	return output.Body, nil
}

// Delete removes an object from the bucket. S3 deletes are idempotent,
// so deleting a missing object succeeds.
func (s *S3Storage) Delete(
	ctx context.Context,
	key string,
) error {

	_, err := s.objects.DeleteObject(
		ctx,
		&s3.DeleteObjectInput{
			Bucket: aws.String(s.bucket),
			Key:    aws.String(key),
		},
	)
	if err != nil && !isS3NotFound(err) {
		return fmt.Errorf("%w: %v", ErrDeleteFailed, err)
	}

	return nil
}

type countingReader struct {
	reader io.Reader
	size   int64
}

func (r *countingReader) Read(buffer []byte) (int, error) {
	read, err := r.reader.Read(buffer)
	r.size += int64(read)

	return read, err
}

// isS3NotFound reports whether an S3 error represents a missing object
// or bucket.
func isS3NotFound(err error) bool {
	var noSuchKey *types.NoSuchKey
	if errors.As(err, &noSuchKey) {
		return true
	}

	var noSuchBucket *types.NoSuchBucket
	if errors.As(err, &noSuchBucket) {
		return true
	}

	var apiErr smithy.APIError
	if errors.As(err, &apiErr) {
		switch apiErr.ErrorCode() {
		case "NoSuchKey", "NotFound", "NoSuchBucket":
			return true
		}
	}

	return false
}

// s3Endpoint normalizes a custom endpoint into a URL.
func s3Endpoint(endpoint string, useSSL bool) (string, error) {
	endpoint = strings.TrimSpace(endpoint)
	if endpoint == "" {
		return "", nil
	}

	if strings.Contains(endpoint, "://") {
		return strings.TrimRight(endpoint, "/"), nil
	}

	scheme := "https"
	if !useSSL {
		scheme = "http"
	}

	return scheme + "://" + strings.TrimRight(endpoint, "/"), nil
}
