export default function UserProfile({ params }: any) {
    return (
        <div className="flex flex-col items-center justify-center max-h-screen py-2">
            <h1>Profile</h1>
            <hr />
            <p>Profile page</p>
            <p className="text-2xl text-black rounded bg-orange-500 p-3">{params.id}</p>
        </div>
    )
}