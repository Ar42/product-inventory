import clsx from "clsx";
import { JSX } from "react";

interface Props {
  message?: string | JSX.Element;
  containerClassname?: string;
}

const Error = (props: Props) => {
  const { message, containerClassname } = props;

  const ErrorText = () => {
    return (
      <p className={clsx("text-red-600", containerClassname)}>
        {message ?? "No data found!"}
      </p>
    );
  };

  return (
    <div>
      {typeof message === "string" || typeof message === "undefined" ? (
        <ErrorText />
      ) : (
        message
      )}
    </div>
  );
};

export default Error;
