"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterField {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface AdminFiltersProps {
  fields?: FilterField[];
  sortKey?: string;
  sortOptions?: { value: string; label: string }[];
}

const selectClasses =
  "h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

/**
 * Lightweight filter/sort toolbar for admin list pages. Pushes changes into the
 * URL query string, so filtering stays SSR-friendly (server components read
 * searchParams) and results are shareable / back-button friendly.
 */
export function AdminFilters({
  fields = [],
  sortKey,
  sortOptions,
}: AdminFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function apply(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  const tracked = [
    ...fields.map((f) => f.key),
    ...(sortKey ? [sortKey] : []),
  ];
  const activeCount = tracked.filter((key) => searchParams.get(key)).length;

  return (
    <div className="flex flex-wrap items-end gap-3">
      {fields.map((field) => (
        <label key={field.key} className="space-y-1">
          <span className="block text-xs text-muted-foreground">{field.label}</span>
          <select
            value={searchParams.get(field.key) ?? ""}
            onChange={(e) => apply(field.key, e.target.value)}
            className={cn(selectClasses, "w-44")}
            aria-label={field.label}
          >
            <option value="">All</option>
            {field.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      {sortKey && sortOptions && (
        <label className="space-y-1">
          <span className="block text-xs text-muted-foreground">Sort by</span>
          <select
            value={searchParams.get(sortKey) ?? ""}
            onChange={(e) => apply(sortKey, e.target.value)}
            className={cn(selectClasses, "w-44")}
            aria-label="Sort by"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      )}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-transparent px-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      )}
    </div>
  );
}