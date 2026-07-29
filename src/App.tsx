import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import Layout from "./components/templates/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import Products from "./pages/Products"
import Teams from "./pages/Teams"
import BlogList from "./pages/BlogList"
import BlogDetail from "./pages/BlogDetail"
import Login from "./pages/Login"
import ProtectedRoute from "./components/layout/ProtectedRoute"
import AdminLayout from "./components/layout/AdminLayout"
import Settings from "./pages/admin/Settings"
import BlogAdminList from "./pages/admin/BlogAdminList"
import BlogAdminForm from "./pages/admin/BlogAdminForm"
import ProductAdminList from "./pages/admin/ProductAdminList"
import ProductAdminForm from "./pages/admin/ProductAdminForm"
import DashboardOverview from "./pages/admin/DashboardOverview"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="teams" element={<Teams />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:id" element={<BlogDetail />} />
        </Route>

        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="blogs" element={<BlogAdminList />} />
            <Route path="blogs/create" element={<BlogAdminForm />} />
            <Route path="blogs/edit/:id" element={<BlogAdminForm />} />
            <Route path="products" element={<ProductAdminList />} />
            <Route path="products/create" element={<ProductAdminForm />} />
            <Route path="products/edit/:id" element={<ProductAdminForm />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
