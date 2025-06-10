import { ReactNode } from "react";

import clsx from "clsx";

type ChipVariant = "default";

interface ChipProps {
  children: ReactNode;
  className?: string;
  variant?: ChipVariant;
  onClick?: () => void;
}

const Chip = (props: ChipProps) => {
  const { children, variant = "default", className = "", onClick } = props;

  return (
    <div
      className={clsx(
        "w-max px-3 py-1 text-sm font-medium rounded-sm",
        {
          "bg-primary text-white": variant === "default",
          "cursor-pointer": !!onClick,
        },
        className
      )}
      onClick={() => {
        onClick?.();
      }}
    >
      {children}
    </div>
  );
};

export default Chip;
