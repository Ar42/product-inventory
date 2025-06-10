import Image from "next/image";

import { ColumnDef } from "@tanstack/react-table";

import { ProductResponse } from "@/models/Product";

import { formatDate, formatPrice, getValidImageUrl } from "@/utils/common";

export const getProductColumn = (): ColumnDef<ProductResponse>[] => [
  {
    header: "Name",
    size: 350,
    cell: ({ row }) => {
      return (
        <div className="flex gap-x-2 items-center">
          {row?.original?.images?.[0] && (
            <Image
              src={getValidImageUrl(row?.original?.images?.[0])}
              alt={row.original.title}
              width={100}
              height={100}
              className="rounded-sm shadow-md h-6 w-6 object-cover hidden lg:block"
            />
          )}
          <p className="min-w-48">{row.original.title}</p>
        </div>
      );
    },
  },
  {
    header: "Price",
    size: 350,
    cell: ({ row }) => {
      return <p>{formatPrice(row.original.price)}</p>;
    },
    meta: {
      align: "center",
    },
  },
  {
    header: "Published At",
    size: 350,
    cell: ({ row }) => {
      return (
        <p>
          {formatDate(row.original.creationAt, {
            showTime: true,
          })}
        </p>
      );
    },

    meta: {
      align: "center",
    },
  },
];
