import { Bike, Building2, Flag, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { courierDot } from "@/components/bk/primitives";
import type { Agency, Courier, GeoPoint } from "@/lib/bk-data";

/**
 * MapView — carte mock de Lomé.
 *
 * Architecture prévue pour un remplacement direct par Google Maps Platform
 * ou Mapbox : chaque marqueur est positionné à partir d'un GeoPoint qui
 * contient déjà `lat` / `lng` réels (les coordonnées `x` / `y` normalisées
 * ne servent qu'au rendu de la carte mock). Aucun suivi GPS réel n'est
 * connecté à ce prototype.
 */

export interface MapRoute {
  pickup: GeoPoint;
  current?: GeoPoint | undefined;
  dropoff: GeoPoint;
}

export function MapView({
  couriers,
  agencies,
  route,
  selectedCourierId,
  onSelectCourier,
  className,
}: {
  couriers: Courier[];
  agencies?: Agency[] | undefined;
  route?: MapRoute | undefined;
  selectedCourierId?: string | null | undefined;
  onSelectCourier?: (id: string) => void | undefined;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-map-land ring-1 ring-border",
        className,
      )}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {/* blocs urbains */}
        <g fill="var(--map-block)">
          <rect x="6" y="8" width="24" height="18" rx="1.5" />
          <rect x="34" y="12" width="20" height="14" rx="1.5" />
          <rect x="58" y="6" width="30" height="20" rx="1.5" />
          <rect x="10" y="32" width="26" height="20" rx="1.5" />
          <rect x="40" y="34" width="18" height="16" rx="1.5" />
          <rect x="62" y="32" width="26" height="22" rx="1.5" />
          <rect x="8" y="58" width="30" height="18" rx="1.5" />
          <rect x="42" y="58" width="22" height="16" rx="1.5" />
          <rect x="68" y="60" width="22" height="16" rx="1.5" />
        </g>
        {/* lagune + océan (sud) */}
        <path d="M0 84 Q28 78 52 83 T100 78 L100 100 L0 100 Z" fill="var(--map-water)" />
        <path d="M0 55 Q26 50 44 56 T72 52" fill="none" stroke="var(--map-water)" strokeWidth="1.4" />
        {/* axes routiers */}
        <g stroke="var(--map-road)" strokeLinecap="round" fill="none">
          <path d="M0 29 H100" strokeWidth="2.4" />
          <path d="M0 55 H100" strokeWidth="2" />
          <path d="M0 78 H100" strokeWidth="2.6" />
          <path d="M31 0 V100" strokeWidth="2.2" />
          <path d="M60 0 V100" strokeWidth="1.8" />
          <path d="M85 0 V84" strokeWidth="1.6" />
          <path d="M8 0 Q16 40 6 100" strokeWidth="1.4" />
        </g>
        <g stroke="var(--border)" strokeWidth="0.25" fill="none">
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={`h${i}`} d={`M0 ${(i + 1) * 10} H100`} />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <path key={`v${i}`} d={`M${(i + 1) * 10} 0 V100`} />
          ))}
        </g>
        {/* itinéraire */}
        {route ? (
          <>
            <path
              d={`M ${route.pickup.x} ${route.pickup.y} Q ${(route.pickup.x + route.dropoff.x) / 2} ${
                Math.min(route.pickup.y, route.dropoff.y) - 8
              } ${route.dropoff.x} ${route.dropoff.y}`}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="1"
              strokeOpacity="0.35"
            />
            <path
              className="route-dash"
              d={`M ${route.pickup.x} ${route.pickup.y} Q ${(route.pickup.x + route.dropoff.x) / 2} ${
                Math.min(route.pickup.y, route.dropoff.y) - 8
              } ${route.dropoff.x} ${route.dropoff.y}`}
              fill="none"
              stroke="var(--brand-deep)"
              strokeWidth="0.7"
            />
          </>
        ) : null}
      </svg>

      {/* Marqueurs agences */}
      {agencies?.map((a) => (
        <Marker key={a.id} point={a.point} title={a.name}>
          <span className="flex items-center gap-1 rounded-md bg-primary px-1.5 py-1 text-[10px] font-medium text-primary-foreground shadow-sm">
            <Building2 className="size-3" />
            {a.zone}
          </span>
        </Marker>
      ))}

      {/* Pickup / destination */}
      {route ? (
        <>
          <Marker point={route.pickup} title={`Récupération — ${route.pickup.label}`}>
            <span className="flex items-center gap-1 rounded-md bg-card px-1.5 py-1 text-[10px] font-medium ring-1 ring-border">
              <MapPin className="size-3 text-brand-deep" />
              {route.pickup.label}
            </span>
          </Marker>
          <Marker point={route.dropoff} title={`Destination — ${route.dropoff.label}`}>
            <span className="flex items-center gap-1 rounded-md bg-card px-1.5 py-1 text-[10px] font-medium ring-1 ring-border">
              <Flag className="size-3 text-danger" />
              {route.dropoff.label}
            </span>
          </Marker>
        </>
      ) : null}

      {/* Livreurs */}
      {couriers.map((c) => {
        const selected = selectedCourierId === c.id;
        return (
          <Marker key={c.id} point={c.point} title={`${c.name} — ${c.zone}`}>
            <button
              type="button"
              onClick={() => onSelectCourier?.(c.id)}
              className={cn(
                "flex items-center gap-1 rounded-full px-1.5 py-1 text-[10px] font-medium shadow-sm ring-1 transition-colors",
                selected
                  ? "bg-primary text-primary-foreground ring-primary"
                  : "bg-card ring-border hover:bg-accent",
              )}
            >
              <Bike className="size-3" />
              {c.name.split(" ")[0]}
              <span className={cn("size-1.5 rounded-full", courierDot[c.status])} />
            </button>
          </Marker>
        );
      })}

      {/* Légende */}
      <div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md bg-card/90 px-2 py-1.5 text-[10px] ring-1 ring-border backdrop-blur">
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-success" />
          Disponible
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-brand" />
          En livraison
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-warning" />
          Pause
        </span>
        <span className="flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-danger" />
          Incident
        </span>
        <span className="text-muted-foreground">Carte mock — Lomé, Togo</span>
      </div>
    </div>
  );
}

function Marker({
  point,
  title,
  children,
}: {
  point: GeoPoint;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      title={title}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${point.x}%`, top: `${point.y}%` }}
    >
      {children}
    </div>
  );
}
