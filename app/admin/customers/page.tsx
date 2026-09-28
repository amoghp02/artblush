import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/session";
import { formatINR } from "@/lib/orders";
import { getAdminCustomers } from "@/lib/admin/customers";
import { updateCustomerRoleAction, sendCustomerResetAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Customers — ArtBlush Studio",
  description: "ArtBlush studio — registered customers.",
};

interface PageProps {
  searchParams: Promise<{ q?: string; sent?: string; error?: string }>;
}

const selectClasses =
  "flex h-9 rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export default async function AdminCustomersPage({ searchParams }: PageProps) {
  await requireAdmin();
  const { q, sent, error } = await searchParams;

  const customers = await getAdminCustomers(q?.trim() || undefined);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Customers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {customers.length} registered account
            {customers.length === 1 ? "" : "s"}.
          </p>
        </div>

        <form className="flex items-center gap-2" action="/admin/customers" method="get">
          <Input
            name="q"
            type="search"
            placeholder="Search name or email…"
            defaultValue={q ?? ""}
            className="h-9 w-64 max-w-full"
          />
          <Button type="submit" variant="outline" size="sm" className="h-9">
            Search
          </Button>
        </form>
      </div>

      {(sent || error) && (
        <div
          className={
            error
              ? "rounded-md border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300"
              : "rounded-md border border-green-900 bg-green-950/40 px-4 py-3 text-sm text-green-300"
          }
        >
          {error ??
            "Password reset email sent — the customer will get a one-time link in their inbox."}
        </div>
      )}

      <div className="overflow-x-auto">
        <Table className="min-w-[820px]">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Customer</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="text-right">Paid revenue</TableHead>
              <TableHead>Last order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="max-w-[260px]">
                  <p className="truncate font-medium text-foreground">
                    {customer.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {customer.email}
                  </p>
                  {customer.phone && (
                    <p className="truncate text-xs text-muted-foreground/70">
                      {customer.phone}
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={customer.role === "admin" ? "default" : "outline"}
                  >
                    {customer.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {customer.orderCount}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatINR(customer.paidRevenuePaise)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {customer.lastOrderAt
                    ? new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(
                        customer.lastOrderAt,
                      )
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <form action={updateCustomerRoleAction} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={customer.id} />
                      <select
                        name="role"
                        defaultValue={customer.role}
                        disabled={customer.role === "admin"}
                        className={selectClasses}
                        aria-label={`Role for ${customer.name}`}
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                      {customer.role !== "admin" && (
                        <Button type="submit" variant="ghost" size="sm">
                          Save
                        </Button>
                      )}
                    </form>
                    <form action={sendCustomerResetAction}>
                      <input type="hidden" name="id" value={customer.id} />
                      <Button type="submit" variant="outline" size="sm">
                        Send reset
                      </Button>
                    </form>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/customers/${customer.id}`}>Open</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  No customers match.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}