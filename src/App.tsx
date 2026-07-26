import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./components/templates/Layout"
import Home from "./pages/Home"
import About from "./pages/About"
import Products from "./pages/Products"
import Teams from "./pages/Teams"
import BlogList from "./pages/BlogList"

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
          {/* Dashboard routes will be added in Phase 4 & 5 */}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
