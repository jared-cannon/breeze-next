'use client'

import { useAuth } from '@/templates/js/src/hooks/auth'

function UserRefresh() {

    useAuth({
        middleware: 'auth'
    })

    return <></>
}

export default UserRefresh
