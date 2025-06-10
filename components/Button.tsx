import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

const Button = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button {...props} className={clsx("cursor-pointer", props.className)}>
      {props.children}
    </button>
  );
};

export default Button;
