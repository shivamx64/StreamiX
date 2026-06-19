export function Footer() {
  return (
    <footer className="border-t border-stone-200 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-4">

        <div>
          <h3 className="font-semibold text-lg">
            StreamiX
          </h3>

          <p className="text-sm text-stone-500 mt-2">
            Cloud-native video processing platform.
          </p>
        </div>

        <div className="text-sm text-stone-500">
          Built with Go, Redis Streams, FFmpeg,
          PostgreSQL, S3 and Kubernetes.
        </div>

      </div>
    </footer>
  );
}