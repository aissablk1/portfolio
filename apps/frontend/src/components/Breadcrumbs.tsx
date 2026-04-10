"use client";

import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      className="px-container pt-24 pb-0"
    >
      <ol className="max-w-7xl mx-auto flex items-center gap-1.5 text-xs">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && (
                <span className="text-site-text-light/50" aria-hidden="true">
                  ›
                </span>
              )}
              {isLast || !item.href ? (
                <span className="text-site-text font-medium">{item.label}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-site-text-light hover:text-site-text transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
