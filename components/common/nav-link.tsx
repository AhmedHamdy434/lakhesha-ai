"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
export default function NavLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
    const pathName = usePathname();
    const isActive = pathName === href || (pathName.startsWith(href) && pathName !== href);
  return (
    <div>
      <Link
        href={href}
        className={cn(
          "transition-colors duration-200 ease-in-out text-sm text-gray-600 hover:text-rose-500 dark:text-gray-300 dark:hover:text-rose-500",
          isActive && "text-rose-500",
          className
        )}
      >
        {children}
      </Link>
    </div>
  );
}
