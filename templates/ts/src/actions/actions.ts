'use server'

import { serverFetch } from '@/templates/js/src/lib/serverFetch'

export const getUserAction = async () => {

    const response = await serverFetch('/api/user');

    return response?.json();
}
