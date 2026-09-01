import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BatteryMedium,
  Crosshair,
  Navigation,
  Phone,
  RefreshCw,
  Search,
  Timer,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { CourierStatusBadge, PageHeader, Panel, courierDot } from "@/components/bk/primitives";
import { MapView } from "@/components/bk/map-view";
import { AssignmentDialog } from "@/components/bk/assignment-dialog";
import {
  agencies,
  courierStatusLabel,
  courses,
  couriers,
  getAgency,
  getCourse,
  type Course,
} from "@/lib/bk-data";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dispatch")({
  head: () => ({
    meta: [
      { title: "Dispatch & Carte — BK Delivery" },
      {
        name: "description",
        content:
          "Supervision logistique en direct : positions des livreurs à Lomé, courses actives, itinéraires et ETA.",
      },
      { property: "og:title", content: "Dispatch & Carte — BK Delivery" },
      {
        property: "og:description",
        content: "Console de dispatch B&K Delivery : livreurs, itinéraires et temps estimés.",
      },
    ],
  }),
  component: DispatchPage,
});

const FILTERS = ["tous", "disponible", "livraison", "pause", "incident", "hors_ligne"] as const;

function DispatchPage() {
  const [selectedCourier, setSelectedCourier] = useState<string>("LV-01");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("tous");
  const [q, setQ] = useState("");
  const [assigning, setAssigning] = useState<Course | null>(null);

  const courier = couriers.find((c) => c.id === selectedCourier);
  const activeCourse = courier?.currentCourseId ? getCourse(courier.currentCourseId) : undefined;
  const list = couriers.filter(
    (c) =>
      (filter === "tous" || c.status === filter) &&
      c.name.toLowerCase().includes(q.toLowerCase()),
  );
  const pending = courses.filter((c) => c.status === "attente" || c.status === "brouillon");
  const remaining = activeCourse
    ? Math.max(0, Math.round((activeCourse.distanceKm - activeCourse.travelledKm) * 10) / 10)
    : 0;

  return (
    <>
      <PageHeader
        title="Dispatch & Carte"
        subtitle="Supervision temps réel des livreurs et des courses actives — Lomé"
        actions={
          <>
            <span className="num flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] text-brand-deep">
              <span className="pulse-dot size-1.5 rounded-full bg-brand" />
              Flux live (mock)
            </span>
            <button
              type="button"
              onClick={() => toast.success("Positions actualisées")}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm ring-1 ring-border transition-colors hover:bg-accent"
            >
              <RefreshCw className="size-4" />
              Actualiser
            </button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        {/* Liste des livreurs */}
        <Panel
          title="Livreurs"
          bodyClassName=""
          aside={<span className="num text-xs text-muted-foreground">{list.length}</span>}
        >
          <div className="space-y-2 border-b border-border p-3">
            <div className="flex items-center gap-2 rounded-md px-2 py-1.5 ring-1 ring-border">
              <Search className="size-3.5 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filtrer un livreur"
                className="w-full bg-transparent text-xs outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "rounded-full px-2 py-1 text-[11px] transition-colors",
                    filter === f
                      ? "bg-primary font-medium text-primary-foreground"
                      : "text-muted-foreground ring-1 ring-border hover:bg-accent",
                  )}
                >
                  {f === "tous"
                    ? "Tous"
                    : courierStatusLabel[f as keyof typeof courierStatusLabel]}
                </button>
              ))}
            </div>
          </div>
          <ul className="max-h-[520px] divide-y divide-border overflow-y-auto">
            {list.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedCourier(c.id)}
                  className={cn(
                    "flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors",
                    selectedCourier === c.id ? "bg-accent" : "hover:bg-accent/60",
                  )}
                >
                  <div className="relative">
                    <div className="grid size-9 place-items-center rounded-full bg-muted text-xs font-semibold">
                      {c.initials}
                    </div>
                    <span
                      className={cn(
                        "absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full ring-2 ring-card",
                        courierDot[c.status],
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{c.name}</p>
                    <CourierStatusBadge
                      status={c.status}
                      className="text-[11px] text-muted-foreground"
                    />
                    <p className="num mt-1 text-[11px] text-muted-foreground">
                      {c.currentCourseId ?? "aucune course"} · {c.zone} · {c.battery}% ·{" "}
                      {c.lastPing}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {getAgency(c.agencyId)?.name}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Carte */}
        <div className="space-y-3">
          <MapView
            couriers={couriers}
            agencies={agencies}
            {...(activeCourse
              ? {
                  route: {
                    pickup: activeCourse.pickup,
                    ...(courier ? { current: courier.point } : {}),
                    dropoff: activeCourse.dropoff,
                  },
                }
              : {})}
            selectedCourierId={selectedCourier}
            onSelectCourier={setSelectedCourier}
            className="h-[420px] xl:h-[560px]"
          />
          <Panel
            title="Courses à assigner"
            bodyClassName=""
            aside={<span className="num text-xs text-muted-foreground">{pending.length}</span>}
          >
            <ul className="divide-y divide-border">
              {pending.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                  <span className="num text-sm font-medium">{c.id}</span>
                  <span className="text-xs text-muted-foreground">
                    {c.pickup.label} → {c.dropoff.label}
                  </span>
                  <span className="num ml-auto text-xs">{c.distanceKm} km</span>
                  <button
                    type="button"
                    onClick={() => setAssigning(c)}
                    className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90"
                  >
                    Trouver un livreur
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Panneau de suivi */}
        <div className="space-y-3">
          {courier ? (
            <Panel title="Suivi du livreur">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                  {courier.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{courier.name}</p>
                  <CourierStatusBadge status={courier.status} className="text-muted-foreground" />
                </div>
              </div>

              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Course" value={courier.currentCourseId ?? "—"} mono />
                <Row label="Position actuelle" value={courier.point.label} />
                <Row label="Destination" value={activeCourse?.dropoff.label ?? "—"} />
                <Row label="Distance restante" value={`${remaining} km`} mono />
                <Row label="ETA" value={activeCourse?.eta ?? "—"} mono />
                <Row label="Vitesse" value={`${courier.speed} km/h`} mono />
                <Row label="Dernière position" value={courier.lastPing} mono />
                <Row label="Batterie" value={`${courier.battery}%`} mono />
                <Row label="Agence" value={getAgency(courier.agencyId)?.name ?? "—"} />
              </dl>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link
                  to="/livreurs/$id"
                  params={{ id: courier.id }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                >
                  <User className="size-3.5" /> Voir profil
                </Link>
                <button
                  type="button"
                  onClick={() => toast.info(`Appel de ${courier.name}`)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                >
                  <Phone className="size-3.5" /> Contacter
                </button>
                {activeCourse ? (
                  <Link
                    to="/courses/$id"
                    params={{ id: activeCourse.id }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                  >
                    <Navigation className="size-3.5" /> Voir course
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => toast.success("Carte recentrée sur le livreur")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                >
                  <Crosshair className="size-3.5" /> Recentrer
                </button>
              </div>
            </Panel>
          ) : null}

          {activeCourse ? (
            <Panel title="Itinéraire actif">
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Distance totale" value={`${activeCourse.distanceKm} km`} />
                <Metric label="Parcourue" value={`${activeCourse.travelledKm} km`} />
                <Metric label="Restante" value={`${remaining} km`} />
                <Metric label="Durée estimée" value={`${activeCourse.durationMin} min`} />
              </div>
              <div className="mt-3 space-y-2 text-xs">
                <p className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-brand-deep" />
                  Départ : {activeCourse.pickup.label}
                </p>
                <p className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-primary" />
                  Position livreur : {courier?.point.label}
                </p>
                <p className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-danger" />
                  Destination : {activeCourse.dropoff.label}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Timer className="size-3.5" /> ETA {activeCourse.eta}
                  <BatteryMedium className="ml-2 size-3.5" /> {courier?.battery}%
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Itinéraire recalculé (mock)")}
                className="mt-3 w-full rounded-md px-3 py-2 text-xs ring-1 ring-border transition-colors hover:bg-accent"
              >
                Recalculer l'itinéraire
              </button>
            </Panel>
          ) : null}
        </div>
      </div>

      <AssignmentDialog
        course={assigning}
        onClose={() => setAssigning(null)}
        onAssign={(courseId, courierId) => {
          const name = couriers.find((c) => c.id === courierId)?.name ?? "livreur";
          toast.success(`Course ${courseId} assignée à ${name}`);
          setSelectedCourier(courierId);
          setAssigning(null);
        }}
      />
    </>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? "num text-sm" : "text-sm"}>{value}</dd>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md p-2.5 ring-1 ring-border">
      <p className="label-caps">{label}</p>
      <p className="num mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
