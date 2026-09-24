import { requireAdmin } from "@/lib/auth/session";
import { getCommissions } from "@/lib/admin/commissions";
import { updateCommissionAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const selectClasses =
  "border border-foreground/15 bg-transparent px-2.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none";
const inputClasses =
  "w-full border border-foreground/15 bg-transparent px-2.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none";
const buttonClasses =
  "inline-flex items-center justify-center px-4 py-2 text-[12px] font-medium uppercase tracking-[0.15em] text-background bg-foreground hover:bg-[#3a352c] transition-colors";

export default async function AdminCommissionsPage() {
  await requireAdmin();
  const list = await getCommissions();

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-relaxed text-foreground/60">
        Enquiries from the contact page — commissions, originals and general
        questions. Mark a conversation as you work through it.
      </p>

      <div className="overflow-x-auto border border-foreground/10 bg-[#f7f3ea]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-foreground/10 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
            <tr>
              <th className="px-5 py-3.5 font-medium">Enquiry</th>
              <th className="px-5 py-3.5 font-medium">Message</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {list.map((comm) => (
              <tr key={comm.id} className="align-top">
                <td className="px-5 py-4 whitespace-nowrap">
                  <p className="font-medium text-foreground">{comm.name}</p>
                  <p className="mt-1 text-xs text-foreground/55">{comm.email}</p>
                  {comm.phone && (
                    <p className="text-xs text-foreground/55">{comm.phone}</p>
                  )}
                  <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-accent">
                    {comm.enquiryType}
                  </p>
                  <p className="mt-1 text-xs text-foreground/45">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                    }).format(new Date(comm.createdAt))}
                  </p>
                </td>
                <td className="max-w-md px-5 py-4 text-foreground/75">
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {comm.message}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <form action={updateCommissionAction} className="space-y-3">
                    <input type="hidden" name="id" value={comm.id} />
                    <select
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
                    <input
                      name="note"
                      type="text"
                      placeholder="Internal note"
                      defaultValue={comm.note ?? ""}
                      className={inputClasses}
                    />
                    <button type="submit" className={buttonClasses}>
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-foreground/50">
                  No enquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}