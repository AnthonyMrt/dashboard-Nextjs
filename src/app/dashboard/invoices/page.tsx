import { fetchInvoicesPages } from "@/app/lib/data";
import { lusitana } from "@/app/ui/font";
import { CreateInvoice } from "../../ui/invoices/buttons";
import Pagination from "@/app/ui/invoices/pagination";
import Table from "@/app/ui/invoices/table";
import Search from "@/app/ui/search";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Factures",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchInvoicesPages(query);
  console.log(totalPages);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Factures</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Recherche des factures ..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
