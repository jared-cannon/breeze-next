import Navigation from '@/app/(app)/Navigation'
import Loading from '@/app/(app)/Loading'
import { getUserAction } from '@/actions/actions'
import UserRefresh from '@/app/(app)/UserRefresh'
import { PropsWithChildren } from 'react'

const AppLayout = async ({ children }: PropsWithChildren) => {

    const user = await getUserAction()

    if (!user) {
        return <Loading />
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation user={user} />

            <main>{children}</main>

            <UserRefresh />
        </div>
    )
}

export default AppLayout
