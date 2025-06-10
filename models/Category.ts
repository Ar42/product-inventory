export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

export type CategoryListResponse = CategoryResponse[];
