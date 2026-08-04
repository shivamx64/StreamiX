import axios from "axios"

import { environment } from "./environment"

const TOKEN_STORAGE_KEY = "streamix-auth-tokens"

export const apiClient = axios.create({
	baseURL: environment.apiBaseUrl,

	headers: {
		"Content-Type": "application/json",
	},
})

apiClient.interceptors.request.use((config) => {
	if (typeof window === "undefined") return config

	try {
		const raw = window.localStorage.getItem(TOKEN_STORAGE_KEY)
		if (!raw) return config

		const tokens = JSON.parse(raw) as { accessToken?: string }
		if (tokens.accessToken) {
			config.headers.set("Authorization", `Bearer ${tokens.accessToken}`)
		}
	} catch {
		// ignore malformed stored tokens
	}

	return config
})