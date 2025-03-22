"use server";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

const formSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce
    .number()
    .gt(0, { message: "Veuillez entre un montant supérieur à $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Veuillez sélectionner le status de la facture",
  }),
  date: z.string(),
});

const CreateInvoices = formSchema.omit({ id: true, date: true });
const UpdateInvoice = formSchema.omit({ id: true, date: true });

export async function createInvoices(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoices.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants. Échec de la création de la facture.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  const date = new Date().toISOString().split("T")[0];

  try {
    // Enregistrer la facture en BDD
    await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `;
  } catch (error) {
    return {
      message:
        "Erreur base de données: échec lors de la création de la facture." +
        error,
    };
  }

  // Revalider le path (vider le cache de route côté client et le mettre à jour)
  revalidatePath("/dashboard/invoices");

  // Redirection vers dashboard/invoices après enregistrement en BDD.
  redirect("/dashboard/invoices");
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants. Échec de la création de la facture.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;

  const amountInCents = amount * 100;

  try {
    // Modifier la facture en BDD avec un ID spécifique
    await sql`
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `;
  } catch (error) {
    return {
      message:
        "Erreur base de données: échec lors de la mise à jour de la facture. :" +
        error,
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  // throw new Error("Échec de la suppression de la facture");

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    return {
      message:
        "Erreur base de données: échec lors de la suppression de la facture." +
        error,
    };
  }
}
