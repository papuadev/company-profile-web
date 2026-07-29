import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Backendless from '../../lib/backendless';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Blog {
  objectId: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  created: number;
}

export default function BlogAdminList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const queryBuilder = Backendless.DataQueryBuilder.create();
      queryBuilder.setSortBy(['created DESC']);
      const result = await Backendless.Data.of('Blogs').find(queryBuilder);
      setBlogs(result as Blog[]);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      // Might be because table doesn't exist yet, which is fine
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (objectId: string) => {
    try {
      await Backendless.Data.of('Blogs').remove({ objectId });
      setBlogs(blogs.filter(b => b.objectId !== objectId));
      toast.success("Blog deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete blog", error);
      toast.error(error.message || "Failed to delete blog");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Blogs</h1>
        <Link 
          to="/admin/blogs/create"
          className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Write Blog</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-white/20 rounded-xl">
          <p className="text-zinc-400">No blogs found. Start writing your first post!</p>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-zinc-900/80">
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Post Details</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Published Date</th>
                  <th className="py-4 px-6 text-xs font-semibold text-zinc-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {blogs.map(blog => (
                  <tr key={blog.objectId} className="group hover:bg-zinc-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden flex-shrink-0 border border-white/5">
                          {blog.thumbnailUrl ? (
                            <img src={blog.thumbnailUrl} alt={blog.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No img</div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{blog.title}</h3>
                          <p className="text-xs text-zinc-500 line-clamp-1 mt-1 max-w-md">{blog.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-zinc-400">
                        {new Date(blog.created).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/admin/blogs/edit/${blog.objectId}`}
                          className="p-2 bg-white/5 rounded-lg text-zinc-300 hover:text-white hover:bg-blue-500/20 transition-all"
                          title="Edit Blog"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button 
                              className="p-2 bg-white/5 rounded-lg text-zinc-300 hover:text-red-400 hover:bg-red-500/20 transition-all"
                              title="Delete Blog"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-zinc-950 text-white border-white/10">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription className="text-zinc-400">
                                This action cannot be undone. This will permanently delete the blog post
                                from the database.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-zinc-800 text-white border-transparent hover:bg-zinc-700 hover:text-white">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(blog.objectId)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
