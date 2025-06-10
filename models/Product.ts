import { CategoryResponse } from "./Category";

export interface ProductResponse {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: CategoryResponse;
  images: string[];
  creationAt: string;
  updatedAt: string;
}

export type ProductListResponse = ProductResponse[];

export interface ProductListParams {
  limit: number;
  offset: number;
  title: string;
  categoryId?: string;
  price_min?: string;
  price_max?: string;
}
