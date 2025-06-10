import { useRouter } from "next/navigation";
import clsx from "clsx";

import { CategoryResponse } from "@/models/Category";

import Chip from "../Chip";

interface Props {
  category: CategoryResponse | null;
  containerClassname?: string;
}

const CategoryChip = (props: Props) => {
  const { category, containerClassname } = props;

  const router = useRouter();

  if (!category) return;

  return (
    <Chip
      className={clsx("flex gap-x-2 items-center", containerClassname)}
      onClick={() => {
        router.push(
          `/products/category/${category.slug}?categoryId=${category.id}`
        );
      }}
    >
      <span>{category.name}</span>
    </Chip>
  );
};

export default CategoryChip;
