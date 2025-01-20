const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
}

/**
 * Forwards cookies from the client to the server if run on the server, adds base URL, and adds additional headers.
 */
export async function serverFetch(route, requestInit = {}) {

    const options = {
        ...requestInit,
        credentials: 'include',
        cache: 'no-cache',
        headers: {
            ...DEFAULT_HEADERS,
            ...(await getHeaders()),
            ...requestInit.headers,
        },
    }

    // Strip leading slash from route.
    const normalizedRoute = route.startsWith('/') ? route.slice(1) : route
    const url = new URL(normalizedRoute, process.env.NEXT_PUBLIC_BACKEND_URL)

    const response = await fetch(url, options)

    if (!response.ok) {
        throw new Error(`Failed to fetch ${route}. Status: ${response.status}`)
    }

    return await response.json()
}

const getHeaders = async () => {
    // 💡 If running on server, include the headers of the current request.
    return typeof window === 'undefined' ? getServerHeaders() : {}
}

const getServerHeaders = async () => {
    const { headers, cookies } = await import('next/headers')
    const headerStore = await headers()
    const Referer = headerStore.get('host')
    const cookie = headerStore.get('cookie')

    const cookieStore = await cookies()
    const csrf = cookieStore.get(process.env.LARAVEL_CSRF_COOKIE_NAME || 'XSRF-TOKEN')?.value

    return {
        ...(Referer && { Referer }),
        ...(cookie && { cookie }),
        ...(csrf && { 'X-XSRF-TOKEN': decodeURIComponent(csrf) }),
    };
};
