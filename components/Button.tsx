import { ButtonHTMLAttributes } from "react";

import clsx from "clsx";

type ButtonVariants = "text" | "primary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
}

const Button = (props: ButtonProps) => {
  const { variant = "default", ...restProps } = props;

  return (
    <button
      {...restProps}
      className={clsx(
        "cursor-pointer transform transition-all duration-300",
        {
          "bg-primary text-white hover:opacity-85": variant === "primary",
        },
        props.className
      )}
    >
      {props.children}
    </button>
  );
};

export default Button;
