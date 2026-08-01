import { environment } from "@/lib/environment";

/**
 * Static application configuration.
 *
 * These values rarely change and are consumed throughout
 * the frontend.
 */

export const applicationConfiguration = {
    name: "StreamiX",
    description: "A Distributed Video Transcoding & Streaming Platform",
    apiBaseUrl: environment.apiBaseUrl,
    defaultTheme: "system" as const,
    supportEmail: "support@streamix.dev",
}