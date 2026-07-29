import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Backendless from '../../lib/backendless';
import { uploadToCloudinary } from '../../lib/cloudinary';
import TiptapEditor from '../../components/organisms/TiptapEditor';
import { toast } from "sonner";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function BlogAdminForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema)
  });
  
  const contentValue = watch("content") || "";

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const blog: any = await Backendless.Data.of('Blogs').findById(id as string);
      setValue('title', blog.title);
      setValue('excerpt', blog.excerpt);
      setValue('content', blog.content);
      if (blog.thumbnailUrl) {
        setThumbnailPreview(blog.thumbnailUrl);
      }
    } catch (err: any) {
      setError("Failed to fetch blog details");
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      setError(null);
      let thumbnailUrl = thumbnailPreview; // keep existing if not changed

      if (thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(thumbnailFile);
      }

      const blogData = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        thumbnailUrl: thumbnailUrl || "",
      };

      if (isEditing) {
        await Backendless.Data.of('Blogs').save({ ...blogData, objectId: id });
        toast.success("Blog updated successfully");
      } else {
        await Backendless.Data.of('Blogs').save(blogData);
        toast.success("Blog created successfully");
      }

      navigate('/admin/blogs');
    } catch (err: any) {
      setError(err.message || "Failed to save blog");
      toast.error(err.message || "Failed to save blog");
    }
  };

  if (loading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
          {isEditing ? "Edit Blog" : "Create New Blog"}
        </h1>
        <button 
          onClick={() => navigate('/admin/blogs')}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          Back to List
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Title</label>
          <input 
            {...register('title')}
            className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 text-white"
            placeholder="Blog Title"
          />
          {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Excerpt (Short Description)</label>
          <textarea 
            {...register('excerpt')}
            className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 text-white h-24 resize-none"
            placeholder="A brief summary of the post..."
          />
          {errors.excerpt && <p className="mt-1 text-xs text-red-400">{errors.excerpt.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Thumbnail Image</label>
          {thumbnailPreview && (
            <div className="mb-4">
              <img src={thumbnailPreview} alt="Thumbnail preview" className="h-48 object-cover rounded-lg border border-white/10" />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={handleThumbnailChange}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Content</label>
          <TiptapEditor 
            content={contentValue} 
            onChange={(html) => setValue('content', html, { shouldValidate: true })} 
          />
          {errors.content && <p className="mt-1 text-xs text-red-400">{errors.content.message}</p>}
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Blog" : "Publish Blog"}
          </button>
        </div>
      </form>
    </div>
  );
}
