import { InputHTMLAttributes } from "react";
import clsx from "clsx";

const Input = (props: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className={clsx(
        "border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-500",
        props.className
      )}
    />
  );
};

export default Input;
