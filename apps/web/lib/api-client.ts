import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios"

import { apiEndpoints } from "@/constants/api-endpoints"
import { environment } from "./environment"

const TOKEN_STORAGE_KEY = "streamix-auth-tokens"

type StoredTokens = {
	accessToken: string
	refreshToken: string
}

type RetriableRequestConfig = InternalAxiosRequestConfig & {
	_retried?: boolean
}

function readStoredTokens(): StoredTokens | null {
	if (typeof window === "undefined") return null

	try {
		const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY)
		return raw ? (JSON.parse(raw) as StoredTokens) : null
	} catch {
		return null
	}
}

function writeStoredTokens(tokens: StoredTokens) {
	window.localStorage.setItem(
		TOKEN_STORAGE_KEY,
		JSON.stringify(tokens),
	)
}

function clearStoredTokens() {
	window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

function redirectToLogin() {
	if (
		typeof window !== "undefined" &&
		!window.location.pathname.startsWith("/login")
	) {
		window.location.assign("/login")
	}
}

// Single-flight refresh: concurrent 401s share one in-flight refresh
// request instead of stampeding the API with duplicates.
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
	if (refreshPromise) {
		return refreshPromise
	}

	refreshPromise = (async () => {
		const stored = readStoredTokens()
		if (!stored?.refreshToken) {
			throw new Error("no refresh token available")
		}

		const { data } = await axios.post<{
			data?: {
				access_token?: string
				refresh_token?: string
			}
		}>(
			`${environment.apiBaseUrl}${apiEndpoints.auth.refresh}`,
			{ refresh_token: stored.refreshToken },
		)

		const next = data?.data
		if (!next?.access_token || !next?.refresh_token) {
			throw new Error("invalid refresh response")
		}

		writeStoredTokens({
			accessToken: next.access_token,
			refreshToken: next.refresh_token,
		})

		return next.access_token
	})().finally(() => {
		refreshPromise = null
	})

	return refreshPromise
}

export const apiClient = axios.create({
	baseURL: environment.apiBaseUrl,

	headers: {
		"Content-Type": "application/json",
	},
})

apiClient.interceptors.request.use((config) => {
	if (typeof window === "undefined") return config

	const stored = readStoredTokens()
	if (stored?.accessToken) {
		config.headers.set(
			"Authorization",
			`Bearer ${stored.accessToken}`,
		)
	}

	return config
})

apiClient.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const original = error.config as RetriableRequestConfig | undefined
		if (!original) {
			return Promise.reject(error)
		}

		if (error.response?.status !== 401 || original._retried) {
			return Promise.reject(error)
		}

		// Never attempt to refresh through a request that itself targets
		// the refresh endpoint; the refresh call bypasses apiClient.
		if (original.url?.includes(apiEndpoints.auth.refresh)) {
			clearStoredTokens()
			redirectToLogin()
			return Promise.reject(error)
		}

		try {
			await refreshAccessToken()
			original._retried = true
			return apiClient(original)
		} catch {
			clearStoredTokens()
			redirectToLogin()
			return Promise.reject(error)
		}
	},
)