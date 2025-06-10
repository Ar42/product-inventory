"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Filter, X } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Button from "@/components/Button";
import Search from "@/components/Search";
import Pagination from "@/components/pagination";
import Breadcrumb from "@/components/Breadcrumb";
import SimpleTable from "@/components/Table";

import {
  ProductListParams,
  ProductListResponse,
  ProductResponse,
} from "@/models/Product";

import { URLS } from "@/utils/urls";
import { beautifyText, CONFIG, updateOffset } from "@/utils/common";

import { useFetch } from "@/hooks/useFetch";
import useDebounce from "@/hooks/useDebounce";

import Filters from "./filters";
import { getProductColumn } from "./config";

const PAGINATION_MAX_SIZE = CONFIG.pagination_max_size;

interface Props {
  categorySlug?: string;
  categoryId?: string | null;
}

const ProductList = ({ categorySlug, categoryId = "" }: Props) => {
  const router = useRouter();

  const [currentPageNo, setCurrentPageNo] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  const debounceSearch = useDebounce(searchValue);

  const [params, setParams] = useState<ProductListParams>({
    limit: PAGINATION_MAX_SIZE,
    offset: updateOffset(currentPageNo),
    title: debounceSearch,
    categoryId: categoryId ?? "",
  });
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  useEffect(() => {
    setParams((prev) => {
      const pageNo = 1;
      setCurrentPageNo(pageNo);
      return {
        ...prev,
        title: debounceSearch,
        offset: updateOffset(pageNo),
      };
    });
  }, [debounceSearch]);

  const { data, isLoading, isError, isFetching } = useFetch<
    ProductListResponse,
    ProductListParams
  >({
    url: URLS.getAllProducts(),
    params,
  });

  const handleRowClick = (row: ProductResponse) => {
    router.push(`/products/${row.slug}`);
  };

  return (
    <div className="w-full mx-auto my-10 px-4 lg:px-40">
      {!!categorySlug && (
        <Breadcrumb
          items={[
            { label: "Products", href: "/products" },
            { label: beautifyText(categorySlug) },
          ]}
          containerClassName="mb-10"
        />
      )}
      <div className="flex flex-wrap gap-2 justify-between items-center mb-10">
        <h2 className="text-4xl font-semibold">
          {categorySlug ? beautifyText(categorySlug) : "Product List"}
        </h2>

        <div className="flex justify-between items-center gap-x-4">
          <Search onSearch={(value) => setSearchValue(value)} />
          <Drawer direction="right">
            <DrawerTrigger asChild>
              <Button className="bg-primary text-white font-semibold px-8 py-1.5 rounded-sm flex gap-x-2 items-center">
                <Filter className="h-5 w-5" />
                Filters
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 bg-white min-h-full">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-semibold">Apply Filters</h4>
                  <DrawerClose asChild>
                    <Button>
                      <X />
                    </Button>
                  </DrawerClose>
                </div>
                <Filters
                  setParams={setParams}
                  setCurrentPageNo={setCurrentPageNo}
                  selectedPriceRanges={selectedPriceRanges}
                  setSelectedPriceRanges={setSelectedPriceRanges}
                  selectedCategoryIds={selectedCategoryIds}
                  setSelectedCategoryIds={setSelectedCategoryIds}
                  categorySlug={categorySlug}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <SimpleTable
        data={data ?? []}
        columns={getProductColumn()}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRowClick={handleRowClick}
        containerClassName="mb-4"
      />

      <Pagination
        currentPageNo={currentPageNo}
        lastPage={6} // hard coded as API is not providing any count
        onPageChange={(pageNo) => {
          setParams((prev) => {
            return {
              ...prev,
              offset: updateOffset(pageNo),
            };
          });
          setCurrentPageNo(pageNo);
        }}
        containerClassName="ml-auto w-max"
      />
    </div>
  );
};

export default ProductList;
