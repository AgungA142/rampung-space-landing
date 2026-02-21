"use client";

import { FileText, Bell, FolderOpen, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { DashboardStats } from "@/types/admin";

interface DashboardCardsProps {
  stats: DashboardStats;
}

const cards = [
  {
    key: "total_submissions",
    label: "Total Submissions",
    icon: FileText,
    borderColor: "border-l-pistachio",
    iconColor: "text-pistachio",
  },
  {
    key: "new_submissions",
    label: "Submission Baru",
    icon: Bell,
    borderColor: "border-l-yellow-400",
    iconColor: "text-yellow-400",
  },
  {
    key: "total_portfolios",
    label: "Portfolio Items",
    icon: FolderOpen,
    borderColor: "border-l-blue-400",
    iconColor: "text-blue-400",
  },
  {
    key: "total_testimonials",
    label: "Testimonials",
    icon: MessageSquare,
    borderColor: "border-l-purple-400",
    iconColor: "text-purple-400",
  },
] as const;

export default function DashboardCards({ stats }: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];
        return (
          <Card key={card.key} variant="elevated" padding="md" className={`border-l-4 ${card.borderColor}`}>
            <div className="flex items-start justify-between">
              <div>
                <p className={`font-[family-name:var(--font-sora)] text-3xl font-bold text-white ${
                  card.key === "new_submissions" && value > 0 ? "text-yellow-400" : ""
                }`}>
                  {value}
                </p>
                <p className="text-slate-grey text-sm mt-1">{card.label}</p>
              </div>
              <Icon size={24} className={card.iconColor} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
