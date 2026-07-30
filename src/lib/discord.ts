import type { DiagnosticSubmission } from "@/types/diagnostic";
import { SITE_URL } from "@/lib/seo";

const DISCORD_API_BASE = "https://discord.com/api/v10";

const platformLabels: Record<string, string> = {
  web_app: "Web App",
  mobile_android: "Mobile Android",
  other: "Lainnya",
};

const targetUserLabels: Record<string, string> = {
  internal: "Internal / Operasional",
  public: "Publik / Customer",
  unknown: "Belum yakin",
};

const timelineLabels: Record<string, string> = {
  urgent: "Urgent",
  normal: "Normal",
  flexible: "Fleksibel",
  long_term: "Jangka panjang",
  undecided: "Belum ditentukan",
};

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
}

function formatFeatures(features: string[]) {
  if (features.length === 0) return "-";
  return truncate(features.join(", "), 900);
}

export async function notifyDiagnosticSubmission(submission: DiagnosticSubmission) {
  const token = process.env.DISCORD_TOKEN;
  const channelId = process.env.CH_BOT;

  if (!token || !channelId) {
    console.warn("Discord notification skipped: missing DISCORD_TOKEN or CH_BOT");
    return;
  }

  const detailUrl = `${SITE_URL}/admin/submissions/${submission.id}`;

  const response = await fetch(`${DISCORD_API_BASE}/channels/${channelId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: "Diagnosa proyek baru masuk.",
      embeds: [
        {
          title: `${submission.name} - ${submission.complexity_level}`,
          url: detailUrl,
          color: 11069038,
          fields: [
            {
              name: "Kontak",
              value: `${submission.phone}${submission.company ? `\n${submission.company}` : ""}`,
              inline: true,
            },
            {
              name: "Skor",
              value: `${submission.total_score} / Enterprise scale`,
              inline: true,
            },
            {
              name: "Platform",
              value: platformLabels[submission.platform] ?? submission.platform,
              inline: true,
            },
            {
              name: "Target User",
              value: targetUserLabels[submission.target_user] ?? submission.target_user,
              inline: true,
            },
            {
              name: "Timeline",
              value: timelineLabels[submission.timeline] ?? submission.timeline,
              inline: true,
            },
            {
              name: "Fitur",
              value: formatFeatures(submission.features),
            },
            {
              name: "Detail Admin",
              value: detailUrl,
            },
          ],
          timestamp: submission.created_at,
        },
      ],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Discord notification failed: ${response.status} ${message}`);
  }
}
