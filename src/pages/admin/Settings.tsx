import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Backendless from '../../lib/backendless';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function Settings() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      setError(null);
      setSuccess(false);
      
      const currentUser = await Backendless.UserService.getCurrentUser();
      if (!currentUser) throw new Error("No authenticated user found.");
      
      const identity = currentUser.email; // Assuming email is the identity
      
      // Backendless doesn't have a direct "change password" if we don't know the identity for sure,
      // but typically we can use `Backendless.UserService.login` to verify the current password,
      // then update the password field and save the user.
      await Backendless.UserService.login(identity, data.currentPassword, true);
      
      currentUser.password = data.newPassword;
      await Backendless.UserService.update(currentUser);
      
      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message || "Failed to update password. Please check your current password.");
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm">
            Password updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Current Password</label>
            <input 
              {...register('currentPassword')}
              type="password"
              className="w-full px-4 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 transition-colors"
            />
            {errors.currentPassword && <p className="mt-1 text-xs text-red-400">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">New Password</label>
            <input 
              {...register('newPassword')}
              type="password"
              className="w-full px-4 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 transition-colors"
            />
            {errors.newPassword && <p className="mt-1 text-xs text-red-400">{errors.newPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Confirm New Password</label>
            <input 
              {...register('confirmPassword')}
              type="password"
              className="w-full px-4 py-2 bg-zinc-950 border border-white/10 rounded-lg focus:outline-none focus:border-white/50 transition-colors"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
