import Backendless from "../lib/backendless";
import type { Blog } from "../types";

export const blogService = {
  async getAllBlogs(): Promise<Blog[]> {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setSortBy(['created DESC']);
    const result = await Backendless.Data.of('Blogs').find(queryBuilder);
    return result as Blog[];
  },

  async getBlogById(id: string): Promise<Blog> {
    const blog = await Backendless.Data.of('Blogs').findById(id);
    return blog as Blog;
  },

  async createBlog(data: Partial<Blog>): Promise<Blog> {
    const result = await Backendless.Data.of('Blogs').save(data);
    return result as Blog;
  },

  async updateBlog(id: string, data: Partial<Blog>): Promise<Blog> {
    const result = await Backendless.Data.of('Blogs').save({ ...data, objectId: id });
    return result as Blog;
  },

  async deleteBlog(id: string): Promise<void> {
    await Backendless.Data.of('Blogs').remove({ objectId: id });
  }
};
