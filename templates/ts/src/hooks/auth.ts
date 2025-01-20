'use client'

import useSWR from 'swr'
import axios from '@/lib/axios'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { FormError, LaravelValidationError, User } from '@/types/types'
import { AxiosError } from 'axios'

interface UseAuthProps {
    middleware?: 'auth' | 'guest'
    redirectIfAuthenticated?: string
}

export const useAuth = ({
    middleware,
    redirectIfAuthenticated,
}: UseAuthProps = {}) => {
    const router = useRouter()
    const pathName = usePathname()
    const params = useParams()

    const {
        data: user,
        error,
        mutate,
    } = useSWR<User | void>('/api/user', () =>
        axios
            .get<User>('/api/user')
            .then(res => res.data)
            .catch((error: AxiosError) => {
                if (error.response?.status !== 409) throw error

                router.push('/verify-email')
            }),
    )

    const csrf = () => axios.get('/sanctum/csrf-cookie')

    const register = async ({
        setErrors,
        ...props
    }: {
        setErrors: Dispatch<SetStateAction<FormError>>
        name: string
        email: string
        password: string
        password_confirmation: string
    }) => {
        await csrf()

        setErrors({})

        axios
            .post('/register', props)
            .then(() => mutate())
            .catch((error: AxiosError<LaravelValidationError>) => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response?.data?.errors ?? {})
            })
    }

    const login = async ({
        setErrors,
        setStatus,
        ...props
    }: {
        setErrors: Dispatch<SetStateAction<FormError>>
        setStatus: Dispatch<SetStateAction<string | null>>
        email: string
        password: string
        remember: boolean
    }) => {
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/login', props)
            .then(() => mutate())
            .catch((error: AxiosError<LaravelValidationError>) => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response?.data?.errors ?? {})
            })
    }

    const forgotPassword = async ({
        setErrors,
        setStatus,
        email,
    }: {
        setErrors: Dispatch<SetStateAction<FormError>>
        setStatus: Dispatch<SetStateAction<string | null>>
        email: string
    }) => {
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/forgot-password', { email })
            .then(response => setStatus(response.data.status))
            .catch((error: AxiosError<LaravelValidationError>) => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response?.data?.errors ?? {})
            })
    }

    const resetPassword = async ({
        setErrors,
        setStatus,
        ...props
    }: {
        setErrors: Dispatch<SetStateAction<FormError>>
        setStatus: Dispatch<SetStateAction<string | null>>
        email: string
        password: string
        password_confirmation: string
    }) => {
        await csrf()

        setErrors({})
        setStatus(null)

        axios
            .post('/reset-password', { token: params.token, ...props })
            .then(response =>
                router.push('/login?reset=' + btoa(response.data.status)),
            )
            .catch((error: AxiosError<LaravelValidationError>) => {
                if (error.response?.status !== 422) throw error

                setErrors(error.response?.data?.errors ?? {})
            })
    }

    const resendEmailVerification = ({
        setStatus,
    }: {
        setStatus: Dispatch<SetStateAction<string | null>>
    }) => {
        axios
            .post('/email/verification-notification')
            .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        if (!error) {
            await axios.post('/logout').then(() => mutate())
        }

        router.push('/login')
    }

    useEffect(() => {
        if (middleware === 'guest' && redirectIfAuthenticated && user)
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && user && !user?.email_verified_at)
            router.push('/verify-email')

        if (
            pathName === '/verify-email' &&
            user &&
            user?.email_verified_at &&
            redirectIfAuthenticated
        )
            router.push(redirectIfAuthenticated)

        if (middleware === 'auth' && error) logout()
    }, [user, error])

    return {
        user,
        register,
        login,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        logout,
    }
}
