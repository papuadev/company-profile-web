import { useState, useEffect } from "react";
import type { Blog } from "../types";
import { blogService } from "../services/blogService";
import { toast } from "sonner";

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const deleteBlog = async (id: string) => {
    try {
      await blogService.deleteBlog(id);
      setBlogs(blogs.filter(b => b.objectId !== id));
      toast.success("Blog deleted successfully");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete blog");
    }
  };

  return { blogs, loading, error, refetch: fetchBlogs, deleteBlog };
}
