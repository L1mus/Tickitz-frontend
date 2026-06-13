import { useDispatch } from 'react-redux';
import CardSettingChoice from '../components/organism/CardSettingChoice';
import ProfileCard from '../components/organism/ProfileCard';
import { useEffect } from 'react';
import { getProfilSlice } from '../redux/slices/userSlice';
// import ProfileLayout from "../components/templates/ProfileLayout"

function ProfilePage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProfilSlice())
  }, [dispatch])
  return (
    <>
      <main className="flex flex-col items-center justify-center gap-10 bg-white px-10 py-4 md:flex-row md:items-start md:bg-[#F5F7F8] md:p-10">
        <ProfileCard />
        <CardSettingChoice />
      </main>
    </>
  );
}

export default ProfilePage;
