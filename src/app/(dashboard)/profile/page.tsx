import ProfilePage from '@/components/home/ProfilePage'
import useUser from '@/hooks/useUser'

const Page = () => {
    const { user } = useUser();

    return (
        <>
            <ProfilePage
                user={user!}
            />
        </>
    )
}

export default Page