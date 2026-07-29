import { Link } from "react-router-dom";
import { Package, FileText, Settings, ArrowRight } from "lucide-react";
import { useAuthStore } from "../../lib/store";

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const email = user?.email || "Admin";

  const quickLinks = [
    {
      title: "Manage Products",
      description: "Add, edit, or remove perfumes from your catalog.",
      icon: <Package className="w-8 h-8 text-blue-400" />,
      href: "/admin/products",
      color: "from-blue-500/20 to-transparent",
    },
    {
      title: "Write a Blog Post",
      description: "Share new stories, guides, and news with your audience.",
      icon: <FileText className="w-8 h-8 text-emerald-400" />,
      href: "/admin/blogs",
      color: "from-emerald-500/20 to-transparent",
    },
    {
      title: "Account Settings",
      description: "Change your admin password and security preferences.",
      icon: <Settings className="w-8 h-8 text-purple-400" />,
      href: "/admin/settings",
      color: "from-purple-500/20 to-transparent",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="p-8 rounded-2xl bg-zinc-900 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-2xl md:text-2xl font-bold text-white mb-2">
            Welcome back, <span className="text-zinc-400">{email}</span>
          </h1>
          <p className="text-zinc-400 max-w-xl text-lg">
            This is your HMNS command center. Manage your scent catalog, publish
            new stories, and control your website's content seamlessly.
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              to={link.href}
              className={`group flex flex-col p-6 rounded-xl bg-gradient-to-br ${link.color} bg-zinc-900 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1`}
            >
              <div className="mb-4 bg-zinc-950/50 w-16 h-16 rounded-lg flex items-center justify-center border border-white/5">
                {link.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-between">
                {link.title}
                <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-white" />
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed flex-1">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 flex flex-col md:flex-row items-center gap-6 mt-8">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
          <img src="/logo.webp" alt="HMNS Logo" className=" opacity-50" />
        </div>
        <div>
          <h4 className="text-white font-medium mb-1">System Status: Online</h4>
          <p className="text-sm text-zinc-500">
            Backendless API and Cloudinary services are connected and
            operational. Your website is running at optimal performance.
          </p>
        </div>
      </div>
    </div>
  );
}
