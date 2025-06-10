"use client";
import { ProductResponse } from "@/models/Product";
import { useFetch } from "../hooks/useFetch";
import Error from "@/components/Error";

export default function Home() {
  const { data, isLoading, isError } = useFetch<ProductResponse>({
    url: "https://jsonplaceholder.typicode.com/posts/1",
  });
  // return <p className="text-sm">{JSON.stringify(data)}</p>;

  if (isLoading) {
    return <section className="text-center">Loading...</section>;
  }
  if (isError) {
    return (
      <section className="text-center text-red-500">
        Error loading data.
      </section>
    );
  }
  if (!data) {
    return <Error />;
  }

  // export interface ProductResponse {
  //   id: number;
  //   title: string;
  //   slug: string;
  //   price: number;
  //   description: string;
  //   category: CategoryResponse;
  //   images: string[];
  //   creationAt: string;
  //   updatedAt: string;
  // }

  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">{data.title}</h2>
        <p className="text-gray-700 mt-2">ID: {data.id}</p>
        <p className="text-gray-700 mt-2">Price: ${data.price}</p>
        <p className="text-gray-700 mt-2">Description: {data.description}</p>
        <p className="text-gray-700 mt-2">Category: {data.category.name}</p>
        <p className="text-gray-700 mt-2">Created At: {data.creationAt}</p>
      </div>
    </section>
  );
}
