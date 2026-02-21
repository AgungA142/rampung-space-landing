"use client";

import { useState, useMemo, type ReactNode } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, Inbox } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (row: T) => ReactNode;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: { value: string; label: string }[];
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: string[];
  filters?: FilterConfig[];
  sortable?: boolean;
  defaultSort?: { column: string; direction: "asc" | "desc" };
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  toolbar?: ReactNode;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
  searchable = false,
  searchPlaceholder = "Search...",
  searchKeys = [],
  filters = [],
  sortable = true,
  defaultSort,
  pagination = true,
  pageSize = 20,
  onRowClick,
  emptyMessage = "No data found.",
  emptyIcon,
  toolbar,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(
    defaultSort ?? null
  );
  const [page, setPage] = useState(0);

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[key] ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
    setPage(0);
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchable && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        searchKeys.length > 0
          ? searchKeys.some((k) => String(row[k] ?? "").toLowerCase().includes(q))
          : columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(q))
      );
    }

    for (const [key, values] of Object.entries(activeFilters)) {
      if (values.length > 0) {
        result = result.filter((row) => values.includes(String(row[key])));
      }
    }

    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.column];
        const bVal = b[sort.column];
        const aStr = String(aVal ?? "");
        const bStr = String(bVal ?? "");
        const cmp = aStr.localeCompare(bStr, undefined, { numeric: true });
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [data, search, searchable, searchKeys, activeFilters, sort, columns]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = pagination
    ? filteredData.slice(page * pageSize, (page + 1) * pageSize)
    : filteredData;

  const handleSort = (col: string) => {
    if (!sortable) return;
    setSort((prev) => {
      if (prev?.column === col) {
        return prev.direction === "asc"
          ? { column: col, direction: "desc" }
          : null;
      }
      return { column: col, direction: "asc" };
    });
  };

  if (isLoading) {
    return (
      <div className="bg-navy-light rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 space-y-3">
          <Skeleton variant="text" className="w-64" />
          <Skeleton variant="text" count={5} className="w-full h-12 mt-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-light rounded-xl border border-white/10 overflow-hidden">
      {/* Toolbar */}
      {(searchable || filters.length > 0 || toolbar) && (
        <div className="p-4 border-b border-white/5 flex flex-wrap items-center gap-3">
          {searchable && (
            <div className="w-full sm:w-64">
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                prefix={<Search size={16} />}
              />
            </div>
          )}
          {filters.map((f) => (
            <div key={f.key} className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-grey">{f.label}:</span>
              {f.options.map((opt) => {
                const isActive = (activeFilters[f.key] ?? []).includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleFilter(f.key, opt.value)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                      isActive
                        ? "border-pistachio bg-pistachio/10 text-pistachio"
                        : "border-white/10 text-slate-grey hover:border-white/20"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ))}
          {toolbar}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-navy text-slate-grey text-xs uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left font-medium ${
                    col.sortable !== false && sortable ? "cursor-pointer select-none hover:text-white" : ""
                  }`}
                  style={col.width ? { width: col.width } : undefined}
                  onClick={col.sortable !== false && sortable ? () => handleSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {sortable && col.sortable !== false && sort?.column === col.key && (
                      sort.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-slate-grey">
                    {emptyIcon ?? <Inbox size={40} />}
                    <p className="text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => (
                <tr
                  key={(row.id as string) ?? i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-b border-white/5 text-sm text-white transition-colors ${
                    onRowClick ? "cursor-pointer hover:bg-navy/50" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render ? col.render(row) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && filteredData.length > pageSize && (
        <div className="border-t border-white/10 py-3 px-4 flex items-center justify-between">
          <span className="text-xs text-slate-grey">
            Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, filteredData.length)} of{" "}
            {filteredData.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg text-slate-grey hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                  i === page
                    ? "bg-pistachio/20 text-pistachio"
                    : "text-slate-grey hover:text-white hover:bg-white/5"
                }`}
              >
                {i + 1}
              </button>
            )).slice(Math.max(0, page - 2), page + 3)}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg text-slate-grey hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
