'use server'

import { serverFetch } from '@/lib/serverFetch'
import { UserSchema } from '@/types/schemas'

export const getUserAction = async () => {

    // UserSchema ensures that our server response's shape is what we expect
    return await serverFetch('/api/user', undefined, UserSchema)
}
