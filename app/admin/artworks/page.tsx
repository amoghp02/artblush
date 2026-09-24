import Image from "next/image";
import { requireAdmin } from "@/lib/auth/session";
import { getAdminArtworks } from "@/lib/admin/artworks";
import { updateArtworkAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const selectClasses =
  "h-9 w-44 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export default async function AdminArtworksPage() {
  await requireAdmin();
  const pieces = await getAdminArtworks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Artworks
        </h1>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Shop state per piece. Setting status to{" "}
          <span className="font-medium text-foreground">Available</span> releases
          it for purchase (and relists it if it was marked sold); Committed /
          Private Collection takes it off sale.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Piece</TableHead>
            <TableHead>Shop details</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {pieces.map((art) => (
            <TableRow key={art.id} className="align-top">
              <TableCell>
                <div className="flex items-center gap-4">
                  <Image
                    src={art.image}
                    alt={art.imageAlt}
                    width={48}
                    height={60}
                    className="h-15 w-12 rounded-sm object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">{art.title}</p>
                    <p className="text-xs text-muted-foreground">{art.medium}</p>
                    <p className="mt-1">
                      <Badge variant={art.sold ? "destructive" : "secondary"}>
                        {art.sold ? "Sold" : art.status}
                      </Badge>
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <form
                  action={updateArtworkAction}
                  className="flex flex-wrap items-end gap-3"
                >
                  <input type="hidden" name="id" value={art.id} />
                  <div className="space-y-1.5">
                    <Label htmlFor={`status-${art.id}`} className="text-xs text-muted-foreground">
                      Status
                    </Label>
                    <select
                      id={`status-${art.id}`}
                      name="status"
                      defaultValue={art.status}
                      className={selectClasses}
                    >
                      <option value="Available">Available</option>
                      <option value="Commissioned">Commissioned</option>
                      <option value="Private Collection">Private Collection</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`price-${art.id}`} className="text-xs text-muted-foreground">
                      Price (₹)
                    </Label>
                    <Input
                      id={`price-${art.id}`}
                      name="priceRupees"
                      type="number"
                      min="0"
                      step="1"
                      className="w-28"
                      defaultValue={
                        art.price != null ? String(art.price / 100) : ""
                      }
                      placeholder="—"
                    />
                  </div>
                  <Label
                    htmlFor={`saleable-${art.id}`}
                    className="flex h-9 items-center gap-2 pb-1 text-xs text-foreground"
                  >
                    <input
                      id={`saleable-${art.id}`}
                      name="saleable"
                      type="checkbox"
                      defaultChecked={art.saleable}
                      className="h-4 w-4 accent-[#9b6b43]"
                    />
                    For sale
                  </Label>
                  <Button type="submit" size="sm">
                    Save
                  </Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
          {pieces.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="py-10 text-center text-muted-foreground">
                No artworks.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}