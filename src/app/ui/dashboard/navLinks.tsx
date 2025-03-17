"use client";
import Link from "next/link";
import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  {
    name: "Accueil",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Factures",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  {
    name: "Client",
    href: "/dashboard/customers",
    icon: UserGroupIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((item) => {
        const IconComponent = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={clsx(
              `flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3`,

              {
                "bg-sky-100 text-blue-600": pathname === item.href,
              }
            )}
          >
            <IconComponent className="h-5 w-5" />
            <p className="hidden md:block">{item.name}</p>
          </Link>
        );
      })}
    </>
  );
}
