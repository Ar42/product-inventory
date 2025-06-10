import clsx from "clsx";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  containerClassName?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = (props: BreadcrumbProps) => {
  const { items, containerClassName } = props;
  return (
    <nav
      aria-label="breadcrumb"
      className={clsx("text-sm text-gray-600", containerClassName)}
    >
      <ol className="flex space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-start">
              {!isLast && item.href ? (
                <>
                  <Link href={item.href} className="text-black hover:underline">
                    {item.label}
                  </Link>
                  <span className="mx-2 select-none text-gray-400">{">"}</span>
                </>
              ) : (
                <span
                  aria-current="page"
                  className="font-semibold text-primary"
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
