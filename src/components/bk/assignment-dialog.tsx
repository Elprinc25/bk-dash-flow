import { Bike, Gauge, MapPin, Timer } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourierStatusBadge } from "@/components/bk/primitives";
import { dispatchSuggestions, type Course } from "@/lib/bk-data";

/**
 * AssignmentModal — suggestion intelligente de dispatch.
 * Le score est calculé côté frontend à partir des données mockées
 * (distance, disponibilité, charge du jour, zone, temps estimé).
 */
export function AssignmentDialog({
  course,
  onClose,
  onAssign,
}: {
  course: Course | null;
  onClose: () => void;
  onAssign: (courseId: string, courierId: string) => void;
}) {
  const suggestions = course ? dispatchSuggestions(course.id).slice(0, 4) : [];
  const best = suggestions[0];

  return (
    <Dialog open={!!course} onOpenChange={(o) => (o ? undefined : onClose())}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Trouver le meilleur livreur</DialogTitle>
          <DialogDescription>
            {course
              ? `Course ${course.id} — récupération ${course.pickup.label}, destination ${course.dropoff.label}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {suggestions.map((s, i) => (
            <div
              key={s.courier.id}
              className="flex flex-wrap items-center gap-3 rounded-lg p-3 ring-1 ring-border"
            >
              <span className="num w-5 text-sm text-muted-foreground">{i + 1}.</span>
              <div className="grid size-9 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {s.courier.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{s.courier.name}</p>
                <CourierStatusBadge
                  status={s.courier.status}
                  className="text-muted-foreground"
                />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  <span className="num">{s.distance} km</span>
                </span>
                <span className="flex items-center gap-1">
                  <Timer className="size-3.5" />
                  <span className="num">{s.etaMin} min</span>
                </span>
                <span className="flex items-center gap-1">
                  <Gauge className="size-3.5" />
                  <span className="num">Score {s.score}%</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => course && onAssign(course.id, s.courier.id)}
                className="rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-border transition-colors hover:bg-accent"
              >
                Assigner
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-accent/60 p-3 text-xs text-muted-foreground">
          <p className="label-caps mb-1.5">Raisonnement du dispatch</p>
          <ul className="grid gap-1 sm:grid-cols-2">
            <li>Distance au point de récupération</li>
            <li>Disponibilité actuelle du livreur</li>
            <li>Charge de courses du jour</li>
            <li>Correspondance de zone et temps estimé</li>
          </ul>
          <p className="mt-2">
            Suggestion indicative : aucun calcul d'itinéraire réel n'est connecté dans ce
            prototype.
          </p>
        </div>

        {best ? (
          <button
            type="button"
            onClick={() => course && onAssign(course.id, best.courier.id)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Bike className="size-4" />
            Assigner à {best.courier.name.split(" ")[0]}
          </button>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
