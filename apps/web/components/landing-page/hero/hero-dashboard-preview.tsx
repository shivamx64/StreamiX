import { Card } from "@/components/ui/card";

export function HeroDashboardPreview() {
  return (
    <Card className="mx-auto w-full max-w-5xl rounded-3xl border bg-background p-8 shadow-sm">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold">
            Upload Queue
          </h3>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span>launch-video.mp4</span>
            <span>72%</span>
          </div>

          <div className="h-2 rounded-full bg-muted">
            <div className="h-full w-[72%] rounded-full bg-blue-600" />
          </div>

          <div className="flex items-center justify-between">
            <span>tutorial.mov</span>
            <span>Completed</span>
          </div>

          <div className="flex items-center justify-between">
            <span>podcast.mp4</span>
            <span>31%</span>
          </div>

          <div className="h-2 rounded-full bg-muted">
            <div className="h-full w-[31%] rounded-full bg-blue-600" />
          </div>
        </div>

        <div className="border-t pt-6">
          <h4 className="mb-4 font-semibold">
            Generated Outputs
          </h4>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <span>✓ HLS Playlist</span>
            <span>✓ 1080p</span>
            <span>✓ 720p</span>
            <span>✓ 480p</span>
          </div>
        </div>
      </div>
    </Card>
  );
}