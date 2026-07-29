export interface Blog {
  objectId: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  created: number;
}

export interface Product {
  objectId: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  created: number;
}
