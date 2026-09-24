import Image from "next/image";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminArtworks } from "@/lib/admin/artworks";
import { updateArtworkAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const selectClasses =
  "border border-foreground/15 bg-transparent px-2.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none";
const inputClasses =
  "w-24 border border-foreground/15 bg-transparent px-2.5 py-2 text-sm text-foreground focus:border-accent focus:outline-none";
const buttonClasses =
  "inline-flex items-center justify-center px-4 py-2 text-[12px] font-medium uppercase tracking-[0.15em] text-background bg-foreground hover:bg-[#3a352c] transition-colors";

export default async function AdminArtworksPage() {
  await requireAdmin();
  const pieces = await getAdminArtworks();

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm leading-relaxed text-foreground/60">
        Edit the shop state of each piece. Setting status to{" "}
        <span className="text-foreground">Available</span> releases it for
        purchase (and relists it if it was marked sold); Committed / Private
        Collection takes it off sale.
      </p>

      <div className="overflow-x-auto border border-foreground/10 bg-[#f7f3ea]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-foreground/10 text-[11px] uppercase tracking-[0.18em] text-foreground/45">
            <tr>
              <th className="px-5 py-3.5 font-medium">Piece</th>
              <th className="px-5 py-3.5 font-medium">Shop details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/10">
            {pieces.map((art) => (
              <tr key={art.id}>
                <td className="px-5 py-4 align-top">
                  <div className="flex items-center gap-4">
                    <Image
                      src={art.image}
                      alt={art.imageAlt}
                      width={48}
                      height={60}
                      className="h-15 w-12 object-cover"
                    />
                    <div>
                      <p className="font-medium text-foreground">{art.title}</p>
                      <p className="text-xs text-foreground/50">{art.medium}</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-foreground/45">
                        {art.sold ? "Sold" : art.status}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 align-middle">
                  <form
                    action={updateArtworkAction}
                    className="flex flex-wrap items-center gap-3"
                  >
                    <input type="hidden" name="id" value={art.id} />
                    <select
                      name="status"
                      defaultValue={art.status}
                      className={selectClasses}
                    >
                      <option value="Available">Available</option>
                      <option value="Commissioned">Commissioned</option>
                      <option value="Private Collection">
                        Private Collection
                      </option>
                    </select>
                    <label className="flex items-center gap-2 text-xs text-foreground/60">
                      ₹
                      <input
                        name="priceRupees"
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={
                          art.price != null ? String(art.price / 100) : ""
                        }
                        placeholder="—"
                        className={inputClasses}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-xs text-foreground/60">
                      <input
                        name="saleable"
                        type="checkbox"
                        defaultChecked={art.saleable}
                        className="h-4 w-4 accent-[#9b6b43]"
                      />
                      For sale
                    </label>
                    <button type="submit" className={buttonClasses}>
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}