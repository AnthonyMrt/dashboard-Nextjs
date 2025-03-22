import Form from "@/app/ui/invoices/create-form";
import Breadcrumbs from "../../../ui/invoices/breadcrumbs";
import { fetchCustomers } from "@/app/lib/data";

export default async function page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Facture", href: "dashbooard/invoices" },

          {
            label: "Créer une facture",
            href: "dashbooard/invoices/create",
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
