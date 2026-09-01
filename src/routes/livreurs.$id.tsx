import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone } from "lucide-react";
import { toast } from "sonner";
import {
  CourierStatusBadge,
  DefinitionList,
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { MapView } from "@/components/bk/map-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  agencies,
  couriers,
  courses,
  fcfa,
  getAgency,
  getPartner,
  gpsHistory,
  num,
} from "@/lib/bk-data";

export const Route = createFileRoute("/livreurs/$id")({
  loader: ({ params }) => {
    const courier = couriers.find((c) => c.id === params.id);
    if (!courier) throw notFound();
    return { courier };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Livreur introuvable — BK Delivery" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.courier.name} — Livreur BK Delivery`;
    const description = `Fiche livreur ${loaderData.courier.name} : courses, revenus, commissions et localisation.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: CourierDetail,
});

function CourierDetail() {
  const { courier } = Route.useLoaderData();
  const own = courses.filter((c) => c.courierId === courier.id);

  return (
    <>
      <Link
        to="/livreurs"
        className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Retour aux livreurs
      </Link>

      <PageHeader
        title={courier.name}
        subtitle={`${getAgency(courier.agencyId)?.name} · inscrit le ${courier.joinedAt}`}
        actions={
          <>
            <CourierStatusBadge status={courier.status} />
            <button
              type="button"
              onClick={() => toast.info(`Appel de ${courier.name}`)}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm ring-1 ring-border transition-colors hover:bg-accent"
            >
              <Phone className="size-4" />
              Contacter
            </button>
          </>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Courses du jour" value={String(courier.coursesToday)} hint={`${courier.delivered} livrées`} />
        <StatCard label="Courses du mois" value={num(courier.coursesMonth)} hint="cumul septembre" />
        <StatCard label="Revenus générés" value={num(courier.revenue)} unit="FCFA" />
        <StatCard label="Livraison à temps" value={`${courier.onTimeRate}%`} tone={courier.onTimeRate < 80 ? "danger" : "positive"} />
      </div>

      <Tabs defaultValue="infos">
        <TabsList>
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="localisation">Localisation</TabsTrigger>
          <TabsTrigger value="revenus">Revenus</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="infos" className="mt-3">
          <Panel title="Fiche livreur">
            <DefinitionList
              items={[
                ["Identifiant", <span className="num">{courier.id}</span>],
                ["Téléphone", <span className="num">{courier.phone}</span>],
                ["Agence de rattachement", getAgency(courier.agencyId)?.name ?? "—"],
                ["Date d'inscription", <span className="num">{courier.joinedAt}</span>],
                ["Statut", <CourierStatusBadge status={courier.status} />],
                ["Zone actuelle", courier.zone],
                ["Batterie du terminal", <span className="num">{courier.battery}%</span>],
                ["Dernière position", <span className="num">{courier.lastPing}</span>],
              ]}
            />
          </Panel>
        </TabsContent>

        <TabsContent value="courses" className="mt-3">
          <Panel bodyClassName="">
            <TableWrap>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Partenaire</Th>
                  <Th>Trajet</Th>
                  <Th align="right">Distance</Th>
                  <Th align="right">Tarif</Th>
                  <Th>Statut</Th>
                </tr>
              </thead>
              <tbody>
                {own.map((c) => (
                  <Tr key={c.id}>
                    <Td mono>
                      <Link to="/courses/$id" params={{ id: c.id }} className="hover:underline">
                        {c.id}
                      </Link>
                    </Td>
                    <Td>{getPartner(c.partnerId)?.company}</Td>
                    <Td className="text-muted-foreground">
                      {c.pickup.label} → {c.dropoff.label}
                    </Td>
                    <Td align="right" mono>
                      {c.distanceKm} km
                    </Td>
                    <Td align="right" mono>
                      {num(c.fee)}
                    </Td>
                    <Td>
                      <StatusBadge status={c.status} />
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </TabsContent>

        <TabsContent value="localisation" className="mt-3">
          <Panel title="Position actuelle">
            <MapView couriers={[courier]} agencies={agencies} selectedCourierId={courier.id} className="h-80" />
            <p className="num mt-2 text-[11px] text-muted-foreground">
              lat {courier.point.lat} · lng {courier.point.lng} · dernière mise à jour{" "}
              {courier.lastPing} — carte mock, aucun GPS réel connecté.
            </p>
          </Panel>
        </TabsContent>

        <TabsContent value="revenus" className="mt-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Revenus du mois" value={num(courier.revenue)} unit="FCFA" />
            <StatCard label="Commissions (70%)" value={num(courier.commission)} unit="FCFA" />
            <StatCard label="Montant dû" value={num(courier.due)} unit="FCFA" hint="avant clôture" />
          </div>
          <Panel title="Détail du calcul" className="mt-3">
            <p className="text-sm text-muted-foreground">
              Part livreur : 70% des frais de livraison encaissés, soit{" "}
              <span className="num">{fcfa(courier.commission)}</span>. Le solde dû correspond aux
              courses non encore clôturées de la journée.
            </p>
          </Panel>
        </TabsContent>

        <TabsContent value="historique" className="mt-3">
          <Panel title="Historique GPS du jour">
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
        </TabsContent>
      </Tabs>
    </>
  );
}
