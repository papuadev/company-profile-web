import Backendless from "../lib/backendless";
import type { Product } from "../types";

export const productService = {
  async getAllProducts(): Promise<Product[]> {
    const queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setSortBy(['created DESC']);
    const result = await Backendless.Data.of('Products').find(queryBuilder);
    return result as Product[];
  },

  async getProductById(id: string): Promise<Product> {
    const product = await Backendless.Data.of('Products').findById(id);
    return product as Product;
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const result = await Backendless.Data.of('Products').save(data);
    return result as Product;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const result = await Backendless.Data.of('Products').save({ ...data, objectId: id });
    return result as Product;
  },

  async deleteProduct(id: string): Promise<void> {
    await Backendless.Data.of('Products').remove({ objectId: id });
  }
};
