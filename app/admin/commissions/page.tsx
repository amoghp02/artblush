import { requireAdmin } from "@/lib/auth/session";
import { getCommissions } from "@/lib/admin/commissions";
import { updateCommissionAction } from "@/app/admin/actions";
import { AdminFilters } from "@/app/admin/AdminFilters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = "force-dynamic";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  new: "default",
  contacted: "secondary",
  in_progress: "secondary",
  completed: "outline",
  declined: "destructive",
};

const selectClasses =
  "h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

interface PageProps {
  searchParams: Promise<{ status?: string; type?: string; sort?: string }>;
}

const STATUS_KEYS = ["new", "contacted", "in_progress", "completed", "declined"];
const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In progress",
  completed: "Completed",
  declined: "Declined",
};

export default async function AdminCommissionsPage({ searchParams }: PageProps) {
  await requireAdmin();
  const { status, type, sort } = await searchParams;

  const list = await getCommissions();
  const typeOptions = [...new Set(list.map((c) => c.enquiryType))]
    .sort((a, b) => a.localeCompare(b));

  let rows = list;
  if (STATUS_KEYS.includes(status ?? "")) {
    rows = rows.filter((c) => c.status === status);
  }
  if (type) {
    rows = rows.filter((c) => c.enquiryType === type);
  }
  rows =
    sort === "oldest"
      ? [...rows].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      : [...rows].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Commissions
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Enquiries from the contact page — commissions, originals and general
          questions. {rows.length} of {list.length} shown.
        </p>
      </div>

      <AdminFilters
        fields={[
          {
            key: "status",
            label: "Workflow status",
            options: STATUS_KEYS.map((key) => ({
              value: key,
              label: STATUS_LABELS[key],
            })),
          },
          ...(typeOptions.length > 1
            ? [
                {
                  key: "type",
                  label: "Enquiry type",
                  options: typeOptions.map((t) => ({ value: t, label: t })),
                },
              ]
            : []),
        ]}
        sortKey="sort"
        sortOptions={[
          { value: "", label: "Newest first" },
          { value: "oldest", label: "Oldest first" },
        ]}
      />

      {rows.length === 0 && (
        <p className="rounded-md border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          {status || type
            ? "No enquiries match these filters."
            : "No enquiries yet. They’ll appear here when someone uses the contact form."}
        </p>
      )}

      <div className="space-y-3">
        {rows.map((comm) => (
          <div
            key={comm.id}
            className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{comm.name}</p>
                  <Badge variant={statusVariant[comm.status] ?? "secondary"}>
                    {comm.status.replace("_", " ")}
                  </Badge>
                  <Badge variant="outline">{comm.enquiryType}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {comm.email}
                  {comm.phone ? ` · ${comm.phone}` : ""} ·{" "}
                  {new Intl.DateTimeFormat("en-IN", {
                    dateStyle: "medium",
                  }).format(new Date(comm.createdAt))}
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                  {comm.message}
                </p>
              </div>

              <form action={updateCommissionAction} className="flex w-64 shrink-0 flex-col gap-3 sm:w-72">
                <input type="hidden" name="id" value={comm.id} />
                <div className="space-y-1">
                  <Label htmlFor={`status-${comm.id}`} className="text-xs text-muted-foreground">
                    Status
                  </Label>
                  <select
                    id={`status-${comm.id}`}
                    name="status"
                    defaultValue={comm.status}
                    className={selectClasses}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In progress</option>
                    <option value="completed">Completed</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`note-${comm.id}`} className="text-xs text-muted-foreground">
                    Internal note
                  </Label>
                  <Input
                    id={`note-${comm.id}`}
                    name="note"
                    type="text"
                    placeholder="e.g. called them today"
                    defaultValue={comm.note ?? ""}
                  />
                </div>
                <Button type="submit" size="sm" className="self-start">
                  Save
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}