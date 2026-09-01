import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Navigation, Phone, RefreshCw, User } from "lucide-react";
import { toast } from "sonner";
import {
  CourierStatusBadge,
  DefinitionList,
  PageHeader,
  Panel,
  StatusBadge,
  PaymentBadge,
} from "@/components/bk/primitives";
import { MapView } from "@/components/bk/map-view";
import {
  agencies,
  fcfa,
  getCourier,
  getPartner,
  getCourse,
  gpsHistory,
  paymentMethodLabel,
} from "@/lib/bk-data";

export const Route = createFileRoute("/courses/$id")({
  loader: ({ params }) => {
    const course = getCourse(params.id);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Course introuvable — BK Delivery" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `Course ${loaderData.course.id} — BK Delivery`;
    const description = `Suivi de la course ${loaderData.course.id} : ${loaderData.course.pickup.label} → ${loaderData.course.dropoff.label}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CourseDetail,
});

function CourseDetail() {
  const { course } = Route.useLoaderData();
  const partner = getPartner(course.partnerId);
  const courier = getCourier(course.courierId);
  const remaining = Math.max(0, Math.round((course.distanceKm - course.travelledKm) * 10) / 10);

  return (
    <>
      <Link
        to="/courses"
        className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Retour aux courses
      </Link>

      <PageHeader
        title={`Course ${course.id}`}
        subtitle={`${partner?.company ?? "Partenaire inconnu"} — ${course.createdAt} à ${course.time}`}
        actions={
          <>
            <StatusBadge status={course.status} />
            <button
              type="button"
              onClick={() => toast.success("Itinéraire recalculé (mock)")}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm ring-1 ring-border transition-colors hover:bg-accent"
            >
              <RefreshCw className="size-4" />
              Recalculer l'itinéraire
            </button>
          </>
        }
      />

      <div className="grid gap-3 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          <Panel title="Informations générales">
            <DefinitionList
              items={[
                ["Date", <span className="num">{course.createdAt}</span>],
                ["Heure", <span className="num">{course.time}</span>],
                ["Partenaire", partner?.company ?? "—"],
                ["Client", course.clientName],
                ["Téléphone", <span className="num">{course.clientPhone}</span>],
                ["Quantité", <span className="num">{course.quantity} colis</span>],
                ["Valeur du colis", <span className="num">{fcfa(course.parcelValue)}</span>],
                ["Frais de livraison", <span className="num">{fcfa(course.fee)}</span>],
                [
                  "Moyen de paiement",
                  <span className="flex items-center gap-2">
                    {paymentMethodLabel[course.paymentMethod]}
                    <PaymentBadge status={course.paymentStatus} />
                  </span>,
                ],
                ["Agence", agencies.find((a) => a.id === course.agencyId)?.name ?? "—"],
              ]}
            />
          </Panel>

          <div className="grid gap-3 sm:grid-cols-2">
            <Panel title="Départ">
              <p className="text-sm font-medium">{course.pickup.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Point de récupération partenaire — {course.pickup.label}, Lomé
              </p>
              <p className="num mt-2 text-[11px] text-muted-foreground">
                lat {course.pickup.lat} · lng {course.pickup.lng}
              </p>
            </Panel>
            <Panel title="Destination">
              <p className="text-sm font-medium">{course.dropoff.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Adresse client — {course.dropoff.label}, Lomé
              </p>
              <p className="num mt-2 text-[11px] text-muted-foreground">
                lat {course.dropoff.lat} · lng {course.dropoff.lng}
              </p>
            </Panel>
          </div>

          <Panel title="Itinéraire de livraison">
            <MapView
              couriers={courier ? [courier] : []}
              route={
                courier
                  ? { pickup: course.pickup, current: courier.point, dropoff: course.dropoff }
                  : { pickup: course.pickup, dropoff: course.dropoff }
              }
              className="h-64"
            />
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric label="Distance totale" value={`${course.distanceKm} km`} />
              <Metric label="Parcourue" value={`${course.travelledKm} km`} />
              <Metric label="Restante" value={`${remaining} km`} />
              <Metric label="ETA" value={course.eta} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Carte mock — prête pour Google Maps Platform ou Mapbox (lat/lng, marqueurs,
              itinéraires, géocodage). Aucun suivi GPS réel n'est connecté.
            </p>
          </Panel>

          <Panel title="Historique GPS du trajet">
            <ol className="relative space-y-4 pl-5">
              <span className="absolute top-1 bottom-1 left-[5px] w-px bg-border" />
              {gpsHistory.map((g) => (
                <li key={g.at} className="relative">
                  <span className="absolute top-1 -left-5 size-2.5 rounded-full bg-brand ring-4 ring-accent" />
                  <p className="text-[13px]">
                    <span className="num mr-2 text-muted-foreground">{g.at}</span>
                    {g.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {g.place} · <span className="num">{g.km} km</span>
                  </p>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="space-y-3">
          <Panel title="Livreur">
            {courier ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                    {courier.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{courier.name}</p>
                    <CourierStatusBadge status={courier.status} className="text-muted-foreground" />
                  </div>
                </div>
                <dl className="mt-4 space-y-2 text-sm">
                  <Row label="Téléphone" value={courier.phone} mono />
                  <Row label="Zone actuelle" value={courier.zone} />
                  <Row label="Distance restante" value={`${remaining} km`} mono />
                  <Row label="Vitesse" value={`${courier.speed} km/h`} mono />
                  <Row label="Batterie" value={`${courier.battery}%`} mono />
                  <Row label="Dernière position" value={courier.lastPing} mono />
                </dl>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/livreurs/$id"
                    params={{ id: courier.id }}
                    className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                  >
                    <User className="size-3.5" /> Voir profil
                  </Link>
                  <button
                    type="button"
                    onClick={() => toast.info(`Appel de ${courier.name} (${courier.phone})`)}
                    className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                  >
                    <Phone className="size-3.5" /> Contacter
                  </button>
                  <Link
                    to="/dispatch"
                    className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                  >
                    <Navigation className="size-3.5" /> Suivre sur la carte
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun livreur assigné pour le moment.
              </p>
            )}
          </Panel>

          <Panel title="Timeline de la course">
            <ol className="relative space-y-4 pl-5">
              <span className="absolute top-1 bottom-1 left-[5px] w-px bg-border" />
              {course.timeline.map((step) => (
                <li key={step.label} className="relative">
                  <span
                    className={`absolute top-1 -left-5 grid size-2.5 place-items-center rounded-full ring-4 ring-accent ${
                      step.at ? "bg-brand" : "bg-border"
                    }`}
                  />
                  <p
                    className={`text-[13px] leading-tight ${
                      step.at ? "font-medium" : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="num mt-0.5 text-[11px] text-muted-foreground">
                    {step.at ?? "En attente"}
                  </p>
                </li>
              ))}
            </ol>
            {course.status === "livree" ? (
              <p className="mt-4 flex items-center gap-1.5 rounded-md bg-success/10 px-3 py-2 text-xs text-success">
                <Check className="size-3.5" /> Course clôturée et encaissée
              </p>
            ) : null}
          </Panel>
        </div>
      </div>
    </>
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

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? "num text-sm" : "text-sm"}>{value}</dd>
    </div>
  );
}
