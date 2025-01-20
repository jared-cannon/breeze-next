import Link from 'next/link'
import AuthCard from '@/app/(auth)/AuthCard'
import ApplicationLogo from '@/components/ApplicationLogo'
import { PropsWithChildren } from 'react'

export const metadata = {
    title: 'Laravel',
}

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div>
            <div className="text-gray-900 antialiased">
                <AuthCard
                    logo={
                        <Link href="/public">
                            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                        </Link>
                    }>
                    {children}
                </AuthCard>
            </div>
        </div>
    )
}

export default Layout
