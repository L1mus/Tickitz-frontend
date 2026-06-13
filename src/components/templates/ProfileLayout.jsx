import Header from "../organism/Header.jsx"

function ProfileLayout({children}) {
  return (
    <div>
        <Header/>

        <main>
            {children}
        </main>
    </div>
  )
}

export default ProfileLayout