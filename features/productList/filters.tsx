import { Dispatch, SetStateAction, useMemo } from "react";

import Select, { KeyValueData } from "@/components/Select";

import { ProductListParams } from "@/models/Product";
import { CategoryListResponse } from "@/models/Category";

import { useFetch } from "@/hooks/useFetch";

import { URLS } from "@/utils/urls";
import { arrayToParam, updateOffset } from "@/utils/common";

interface Props {
  setParams: Dispatch<SetStateAction<ProductListParams>>;
  setCurrentPageNo: Dispatch<SetStateAction<number>>;
  selectedPriceRanges: string[];
  setSelectedPriceRanges: Dispatch<SetStateAction<string[]>>;
  selectedCategoryIds: number[];
  setSelectedCategoryIds: Dispatch<SetStateAction<number[]>>;
  categorySlug: string | undefined;
}

const PRICE_RANGES = [
  "0-20",
  "20-50",
  "50-100",
  "100-200",
  "200-1000",
  "1000-100000000",
];

const options: KeyValueData<string>[] = PRICE_RANGES.map((range) => ({
  label: range,
  value: range,
}));

const Filters = (props: Props) => {
  const {
    setParams,
    setCurrentPageNo,
    selectedPriceRanges,
    setSelectedPriceRanges,
    selectedCategoryIds,
    setSelectedCategoryIds,
    categorySlug,
  } = props;

  const { data: categoryListData, isLoading: categoryListIsLoading } =
    useFetch<CategoryListResponse>({
      url: URLS.getAllCategories(),
    });

  const categoryOptions: KeyValueData<number>[] = useMemo(() => {
    return (
      categoryListData?.map((category) => ({
        label: category.name,
        value: category.id,
      })) ?? []
    );
  }, [categoryListData]);

  return (
    <section>
      <Select
        label="Select Price Range"
        options={options}
        value={selectedPriceRanges}
        onChange={(selectedValues) => {
          setSelectedPriceRanges(selectedValues);
          setParams((prev) => {
            const copyPrev = { ...prev };

            if (!selectedValues.length) {
              delete copyPrev?.price_min;
              delete copyPrev?.price_max;
            } else {
              const [min, max] = selectedValues?.[0].split("-");
              copyPrev.price_min = min;
              copyPrev.price_max = max;
            }

            copyPrev.offset = updateOffset(1);

            setCurrentPageNo(1);
            return copyPrev;
          });
        }}
        placeholder="Select an option"
        type="single"
        containerClassName="mb-4"
        isClearable
      />

      {!categorySlug && (
        <Select
          label="Select Categories"
          options={categoryOptions}
          isLoading={categoryListIsLoading}
          value={selectedCategoryIds}
          onChange={(selectedValues) => {
            setSelectedCategoryIds(selectedValues);
            setParams((prev) => {
              const copyPrev = { ...prev };
              const formattedValues = arrayToParam(selectedValues);

              if (formattedValues) copyPrev.categoryId = formattedValues;
              else delete copyPrev?.categoryId;

              copyPrev.offset = updateOffset(1);

              setCurrentPageNo(1);

              return copyPrev;
            });
          }}
          placeholder="Select options"
          type="multi"
          isClearable
        />
      )}
    </section>
  );
};

export default Filters;
