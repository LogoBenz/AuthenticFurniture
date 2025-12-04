import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="overflow-hidden">
      <ol className="flex items-center space-x-2 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center flex-shrink-0">
              {index > 0 && (
                <ChevronRight
                  className="w-4 h-4 text-gray-400 mx-2 flex-shrink-0"
                  aria-hidden="true"
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={`Navigate to ${item.label}`}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`${isLast
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                    }`}
                  aria-current={isLast ? "page" : undefined}
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
}
