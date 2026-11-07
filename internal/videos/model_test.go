package videos

import (
	"reflect"
	"testing"
)

func TestRenditionListValueAndScan(t *testing.T) {
	want := RenditionList{
		{
			Name:           "720p",
			Height:         720,
			VideoBitrateKb: 2500,
			AudioBitrateKb: 128,
		},
	}

	value, err := want.Value()
	if err != nil {
		t.Fatalf("Value() error = %v", err)
	}

	var got RenditionList
	if err := got.Scan(value); err != nil {
		t.Fatalf("Scan() error = %v", err)
	}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("Scan() = %#v, want %#v", got, want)
	}
}

func TestRenditionListScanNull(t *testing.T) {
	var got RenditionList

	if err := got.Scan(nil); err != nil {
		t.Fatalf("Scan(nil) error = %v", err)
	}

	if got != nil {
		t.Errorf("Scan(nil) = %#v, want nil", got)
	}
}
