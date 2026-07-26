import { Outlet } from "react-router-dom"
import Navbar from "../organisms/Navbar"
import Footer from "../organisms/Footer"

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
