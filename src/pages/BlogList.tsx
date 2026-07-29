import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Backendless from '../lib/backendless';

interface Blog {
  objectId: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  created: number;
}

export default function BlogList() {
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
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">The Scent Journal</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our latest thoughts, perfume guides, and behind-the-scenes stories from the world of HMNS.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No articles published yet. Check back soon!
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {blogs.map((blog) => (
              <Link 
                key={blog.objectId} 
                to={`/blog/${blog.objectId}`}
                className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-full aspect-[4/3] bg-zinc-100 overflow-hidden relative">
                  {blog.thumbnailUrl ? (
                    <img 
                      src={blog.thumbnailUrl} 
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground mb-3">
                    {new Date(blog.created).toLocaleDateString('en-US', {
                      month: 'long', day: 'numeric', year: 'numeric'
                    })}
                  </p>
                  <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-zinc-400 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-muted-foreground line-clamp-3 text-sm flex-1">
                    {blog.excerpt}
                  </p>
                  <div className="mt-6 text-sm font-medium uppercase tracking-widest border-b border-white/50 group-hover:border-white transition-colors inline-block self-start pb-1">
                    Read More
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
