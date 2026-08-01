/**
 * Environment configuration exposed to the browser.
 *
 * Every frontend module should import values from here instead
 * of reading process.env directly.
 */

function requireEnvironmentVariable(name: string): string{
    const value = process.env[name]

    if(!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }

    return value
}

export const environment = {
    apiBaseUrl: requireEnvironmentVariable (
        "NEXT_PUBLIC_API_BASE_URL"
    ),
}