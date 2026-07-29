import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { NAVIGATION_LINKS } from "../../data/constants";
import { useAuthStore } from "../../lib/store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 md:px-6 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 z-50">
          <img src="/logo.webp" alt="HMNS Logo" className="h-6" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {NAVIGATION_LINKS.map((link) => (
            link.href.startsWith("/#") ? (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            )
          ))}
          {user ? (
            <Link 
              to="/admin"
              className="px-4 py-2 text-sm font-medium bg-transparent text-white border border-white rounded hover:bg-white hover:text-black transition-colors flex items-center space-x-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link 
              to="/login"
              className="px-4 py-2 text-sm font-medium bg-transparent text-white border border-white rounded hover:bg-white hover:text-black transition-colors"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden absolute top-0 left-0 w-full h-screen bg-background/95 backdrop-blur flex flex-col items-center justify-center space-y-8 transition-all duration-500 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {NAVIGATION_LINKS.map((link) => (
          link.href.startsWith("/#") ? (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          )
        ))}
        {user ? (
          <Link 
            to="/admin"
            onClick={() => setIsOpen(false)}
            className="mt-4 px-8 py-3 text-xl font-medium bg-transparent text-white border border-white rounded-lg hover:bg-white hover:text-black transition-colors flex items-center space-x-2"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
        ) : (
          <Link 
            to="/login"
            onClick={() => setIsOpen(false)}
            className="mt-4 px-8 py-3 text-xl font-medium bg-transparent text-white border border-white rounded-lg hover:bg-white hover:text-black transition-colors"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
