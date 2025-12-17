"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateCustomerContact } from "@/hooks/useCustomers";
import { Loader2 } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(1, "Fornavn må fylles ut"),
  lastName: z.string().min(1, "Etternavn må fylles ut"),
  title: z.string().optional(),
  email: z.string().email("Ugyldig e-postadresse").optional().or(z.literal("")),
  phone: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface AddCustomerContactModalProps {
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCustomerContactModal({
  customerId,
  open,
  onOpenChange,
}: AddCustomerContactModalProps) {
  const createContact = useCreateCustomerContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    try {
      await createContact.mutateAsync({
        customerId,
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          title: values.title || undefined,
          email: values.email || undefined,
          phone: values.phone || undefined,
          // We could set primaryCustomerId here if needed, but the API endpoint /customers/{id}/contacts usually implies it.
        },
      });
      form.reset();
      onOpenChange(false);
    } catch {
      // Error handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ny kontaktperson</DialogTitle>
          <DialogDescription>
            Legg til en ny kontaktperson for kunden.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornavn</FormLabel>
                    <FormControl>
                      <Input placeholder="Ole" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Etternavn</FormLabel>
                    <FormControl>
                      <Input placeholder="Nordmann" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tittel / Rolle</FormLabel>
                  <FormControl>
                    <Input placeholder="Daglig leder" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-post</FormLabel>
                  <FormControl>
                    <Input placeholder="ole@bedrift.no" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefon</FormLabel>
                  <FormControl>
                    <Input placeholder="98765432" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Avbryt
              </Button>
              <Button type="submit" disabled={createContact.isPending}>
                {createContact.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lagre kontakt
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
