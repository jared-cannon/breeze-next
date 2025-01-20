import Link from 'next/link'
import AuthCard from '@/templates/js/src/app/(auth)/AuthCard'
import ApplicationLogo from '@/templates/js/src/components/ApplicationLogo'

export const metadata = {
    title: 'Laravel',
}

const Layout = ({ children }) => {
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
