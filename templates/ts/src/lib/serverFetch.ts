import { z } from 'zod'

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
}

// Overloads for serverFetch
export function serverFetch(
    route: string,
    requestInit?: RequestInit
): Promise<unknown>;
export function serverFetch<T>(
    route: string,
    requestInit: RequestInit | undefined,
    schema: z.ZodSchema<T>
): Promise<T>;

/**
 * Forwards cookies from the client to the server if run on the server, adds base URL, and adds additional headers.
 * Optionally allows the user to provide a zod schema to parse the response data
 */
export async function serverFetch<T>(
    route: string,
    requestInit: RequestInit = {},
    schema?: z.ZodSchema<T>
): Promise<T> {

    const options: RequestInit = {
        ...requestInit,
        credentials: 'include',
        cache: 'no-cache',
        headers: {
            ...DEFAULT_HEADERS,
            ...(await getHeaders()),
            ...requestInit.headers,
        },
    }

    const normalizedRoute = route.startsWith('/') ? route.slice(1) : route
    const url = new URL(normalizedRoute, process.env.NEXT_PUBLIC_BACKEND_URL)

    const response = await fetch(url, options)

    if (!response.ok)
        throw new Error(await response.text())

    const data = await response.json()

    // If a schema is provided, parse the response data
    return schema ? schema.parse(data) : data
}

const getHeaders = async () => {
    // 💡 If running on server, include the headers of the current request.
    return typeof window === 'undefined' ? getServerHeaders() : {}
}

const getServerHeaders = async () => {
    const { headers, cookies } = await import('next/headers')
    const headerStore = headers()
    const Referer = headerStore.get('host')
    const cookie = headerStore.get('cookie')

    const cookieStore = cookies()
    const csrf = cookieStore.get(process.env.LARAVEL_CSRF_COOKIE_NAME || 'XSRF-TOKEN')?.value

    return {
        ...(Referer && { Referer }),
        ...(cookie && { cookie }),
        ...(csrf && { 'X-XSRF-TOKEN': decodeURIComponent(csrf) }),
    }
}
