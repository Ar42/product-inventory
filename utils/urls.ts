import { ApiVersion, versioningApiUrl } from "./apiVersion";

export const URLS = {
  getAllProducts: () =>
    versioningApiUrl({ version: ApiVersion.V1, endpoint: "products" }),
  getProductBySlug: (slug: string) =>
    versioningApiUrl({
      version: ApiVersion.V1,
      endpoint: `products/slug/${slug}`,
    }),
  getAllCategories: () =>
    versioningApiUrl({ version: ApiVersion.V1, endpoint: "categories" }),
};
