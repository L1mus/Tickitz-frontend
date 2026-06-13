import CardSettingChoice from "../components/organism/CardSettingChoice"
import ProfileCard from "../components/organism/ProfileCard"
import ProfileLayout from "../components/templates/ProfileLayout"



function ProfilePage() {
  return (
    <ProfileLayout>
        <main className="bg-white md:bg-[#F5F7F8] flex flex-col py-4 px-10 md:p-10 gap-10 justify-center items-center md:flex-row md:items-start">
            <ProfileCard/>
            <CardSettingChoice/>
        </main>
    </ProfileLayout>
  )
}

export default ProfilePage