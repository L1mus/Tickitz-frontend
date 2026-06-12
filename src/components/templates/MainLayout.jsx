import { Outlet } from "react-router";
import Header from "../organism/Header.jsx";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <main>
            <Outlet />
        </main>
    </div>
  )
}

export default MainLayout;