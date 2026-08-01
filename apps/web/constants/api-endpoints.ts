export const apiEndpoints = {
	auth: {
		login: "/auth/login",
		register: "/auth/register",
		refresh: "/auth/refresh",
	},

	users: {
		me: "/users/me",
	},

	videos: {
		upload: "/videos",
		list: "/videos",

		details: (id: string) => `/videos/${id}`,
		delete: (id: string) => `/videos/${id}`,
		status: (id: string) =>
			`/videos/${id}/status`,
	},
}