import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import Backendless from '../lib/backendless';
import { ArrowLeft } from 'lucide-react';

interface Blog {
  objectId: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  created: number;
}

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const data = await Backendless.Data.of('Blogs').findById(id as string);
      setBlog(data as Blog);
    } catch (err) {
      console.error("Failed to fetch blog", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="inline-flex items-center space-x-2 border border-black px-6 py-3 hover:bg-black hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>
      </div>
    );
  }

  // Sanitize the HTML content from Tiptap before rendering it safely
  const cleanHTML = DOMPurify.sanitize(blog.content);
  const formattedDate = new Date(blog.created).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <article className="min-h-screen bg-white text-black py-20">
      <Helmet>
        <title>{blog.title} | HMNS Blog</title>
        <meta name="description" content={blog.excerpt} />
        {blog.thumbnailUrl && <meta property="og:image" content={blog.thumbnailUrl} />}
      </Helmet>

      <div className="container max-w-4xl mx-auto px-4">
        <Link to="/blog" className="inline-flex items-center space-x-2 text-zinc-500 hover:text-black transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all posts</span>
        </Link>

        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">{blog.title}</h1>
          <p className="text-zinc-500">{formattedDate}</p>
        </header>

        {blog.thumbnailUrl && (
          <div className="w-full aspect-video rounded-xl overflow-hidden mb-12 bg-zinc-100">
            <img 
              src={blog.thumbnailUrl} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500"
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />
      </div>
    </article>
  );
}
