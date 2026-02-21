"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  Users,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import type { AdminProfile } from "@/types/admin";

interface AdminSidebarProps {
  user: AdminProfile;
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: FileText, label: "Submissions", href: "/admin/submissions" },
  { icon: FolderOpen, label: "Portfolio", href: "/admin/portfolio" },
  { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials" },
  { icon: Users, label: "Users", href: "/admin/users" },
];

export default function AdminSidebar({ user, isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_sidebar_collapsed");
    if (stored === "true") setCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      localStorage.setItem("admin_sidebar_collapsed", String(!prev));
      return !prev;
    });
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="border-b border-white/10 pb-4 mb-4 px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className={collapsed ? "hidden" : ""}>
            <p className="font-[family-name:var(--font-space-mono)] text-pistachio text-lg font-bold">
              rampung.space
            </p>
            <p className="text-slate-grey text-xs">Admin</p>
          </div>
          {collapsed && (
            <p className="font-[family-name:var(--font-space-mono)] text-pistachio text-lg font-bold mx-auto">
              r.
            </p>
          )}
          {/* Mobile close */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1 text-slate-grey hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-pistachio/10 text-pistachio border-l-2 border-pistachio"
                  : "text-slate-grey hover:bg-navy hover:text-white"
              }`}
            >
              <Icon size={20} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.label === "Submissions" && (
                <Badge variant="error" size="sm" className="ml-auto">
                  new
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 pt-4 pb-4 px-2 space-y-2">
        {!collapsed && (
          <div className="px-3 mb-2">
            <p className="text-xs text-slate-grey truncate">{user.full_name}</p>
            <p className="text-xs text-slate-grey/50 truncate">{user.role}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-slate-grey hover:text-red-400 transition-colors w-full"
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden md:flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-slate-grey hover:text-white transition-colors w-full"
        >
          {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block ${
          collapsed ? "w-16" : "w-[250px]"
        } bg-navy-light border-r border-white/10 transition-all duration-200 shrink-0`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-midnight/80" onClick={onClose} />
          <aside className="relative w-[250px] h-full bg-navy-light z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
