"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import type { AdminProfile } from "@/types/admin";

interface AdminHeaderProps {
  user: AdminProfile;
  onMenuClick: () => void;
}

function getBreadcrumb(pathname: string): string {
  const segments = pathname.replace("/admin", "").split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";

  const labels: Record<string, string> = {
    submissions: "Submissions",
    portfolio: "Portfolio",
    testimonials: "Testimonials",
    users: "Users",
    new: "New",
    edit: "Edit",
  };

  return segments
    .map((seg) => labels[seg] || (seg.length > 8 ? "Detail" : seg))
    .join(" > ");
}

export default function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const breadcrumb = getBreadcrumb(pathname);
  const initials = user.full_name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-navy-light border-b border-white/10 px-4 md:px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-grey hover:text-white hover:bg-white/5"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-[family-name:var(--font-sora)] text-lg text-white">
          {breadcrumb}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-grey hidden sm:block">{user.full_name}</span>
        <div className="w-8 h-8 rounded-full bg-pistachio/20 text-pistachio flex items-center justify-center text-xs font-bold">
          {initials}
        </div>
      </div>
    </header>
  );
}
