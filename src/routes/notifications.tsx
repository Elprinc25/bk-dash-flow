import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bike,
  CheckCheck,
  Package,
  Settings2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageHeader, Panel } from "@/components/bk/primitives";
import { notifications, type Notification } from "@/lib/bk-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — BK Delivery" },
      {
        name: "description",
        content:
          "Centre de notifications B&K Delivery : courses, livreurs, paiements, incidents et alertes système.",
      },
      { property: "og:title", content: "Notifications — BK Delivery" },
      {
        property: "og:description",
        content: "Alertes opérationnelles en temps réel du dispatch B&K Delivery.",
      },
    ],
  }),
  component: NotificationsPage,
});

const CATS = [
  { key: "toutes", label: "Toutes" },
  { key: "courses", label: "Courses" },
  { key: "livreurs", label: "Livreurs" },
  { key: "paiements", label: "Paiements" },
  { key: "incidents", label: "Incidents" },
  { key: "systeme", label: "Système" },
] as const;

const ICONS: Record<Notification["category"], typeof Package> = {
  courses: Package,
  livreurs: Bike,
  paiements: Wallet,
  incidents: AlertTriangle,
  systeme: Settings2,
};

const TONES: Record<Notification["category"], string> = {
  courses: "bg-brand/12 text-brand",
  livreurs: "bg-accent text-accent-foreground",
  paiements: "bg-success/15 text-success",
  incidents: "bg-danger/15 text-danger",
  systeme: "bg-muted text-muted-foreground",
};

function NotificationsPage() {
  const [cat, setCat] = useState<string>("toutes");
  const [items, setItems] = useState(notifications);

  const list = items.filter((n) => cat === "toutes" || n.category === cat);
  const unread = items.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} alerte(s) non lue(s) — flux opérationnel du jour`}
        actions={
          <button
            type="button"
            onClick={() => {
              setItems((prev) => prev.map((n) => ({ ...n, read: true })));
              toast.success("Toutes les notifications sont marquées comme lues");
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm ring-1 ring-border transition-colors hover:bg-accent"
          >
            <CheckCheck className="size-4" />
            Tout marquer comme lu
          </button>
        }
      />

      <div className="card-console mb-3 flex flex-wrap gap-1.5 p-2">
        {CATS.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCat(c.key)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              cat === c.key ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <Panel bodyClassName="p-0">
        {list.length === 0 ? (
          <div className="p-6">
            <EmptyState title="Aucune notification" description="Rien à signaler pour ce filtre." />
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {list.map((n) => {
              const Icon = ICONS[n.category];
              return (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 p-4 transition-colors hover:bg-accent/50 ${
                    n.read ? "" : "bg-accent/30"
                  }`}
                >
                  <span className={`grid size-8 shrink-0 place-items-center rounded-md ${TONES[n.category]}`}>
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="num text-[11px] text-muted-foreground">{n.at}</span>
                    {!n.read && <span className="size-2 rounded-full bg-brand" />}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </>
  );
}
