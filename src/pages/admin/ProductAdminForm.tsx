import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Backendless from '../../lib/backendless';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { toast } from "sonner";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductAdminForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema)
  });

  useEffect(() => {
    if (isEditing) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const product: any = await Backendless.Data.of('Products').findById(id as string);
      setValue('name', product.name);
      setValue('price', product.price);
      setValue('category', product.category || '');
      setValue('description', product.description || '');
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
    } catch (err: any) {
      setError("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setError(null);
      let imageUrl = imagePreview;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const productData = {
        name: data.name,
        price: data.price,
        category: data.category,
        description: data.description,
        imageUrl: imageUrl || "",
      };

      if (isEditing) {
        await Backendless.Data.of('Products').save({ ...productData, objectId: id });
        toast.success("Product updated successfully");
      } else {
        await Backendless.Data.of('Products').save(productData);
        toast.success("Product created successfully");
      }

      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message || "Failed to save product");
      toast.error(err.message || "Failed to save product");
    }
  };

  if (loading) {
    return <div className="text-white text-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">
          {isEditing ? "Edit Product" : "Add New Product"}
        </h1>
        <button 
          onClick={() => navigate('/admin/products')}
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
          <label className="block text-sm font-medium text-zinc-300 mb-1">Product Name</label>
          <input 
            {...register('name')}
            className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 text-white"
            placeholder="e.g. HMNS Alpha"
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Price (IDR)</label>
            <input 
              {...register('price', { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 text-white"
              placeholder="e.g. 350000"
            />
            {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Category</label>
            <select 
              {...register('category')}
              className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 text-white"
            >
              <option value="">Select Category...</option>
              <option value="Perfume">Perfume</option>
              <option value="Body Care">Body Care</option>
              <option value="Home Fragrance">Home Fragrance</option>
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Product Image</label>
          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="Preview" className="h-48 w-48 object-cover rounded-lg border border-white/10" />
            </div>
          )}
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
          <textarea 
            {...register('description')}
            className="w-full px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 text-white h-32 resize-none"
            placeholder="Detailed description of the product..."
          />
          {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>}
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
