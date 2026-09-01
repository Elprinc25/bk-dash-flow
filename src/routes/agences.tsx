import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Plus, UserRound } from "lucide-react";
import { toast } from "sonner";
import {
  PageHeader,
  Panel,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { MapView } from "@/components/bk/map-view";
import { agencies, couriers, num } from "@/lib/bk-data";

export const Route = createFileRoute("/agences")({
  head: () => ({
    meta: [
      { title: "Agences & points relais — BK Delivery" },
      {
        name: "description",
        content:
          "Réseau d'agences et points relais B&K Delivery à Lomé : gestionnaires, livreurs rattachés, volumes et chiffre d'affaires.",
      },
      { property: "og:title", content: "Agences & points relais — BK Delivery" },
      {
        property: "og:description",
        content: "Cartographie et performance des points relais de B&K Delivery.",
      },
    ],
  }),
  component: AgenciesPage,
});

function AgenciesPage() {
  return (
    <>
      <PageHeader
        title="Agences / Points relais"
        subtitle="Réseau de proximité B&K Delivery à Lomé"
        actions={
          <button
            type="button"
            onClick={() => toast.info("Création d'une agence (prototype)")}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Plus className="size-4" />
            Nouvelle agence
          </button>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Agences" value={String(agencies.length)} hint="1 inactive" />
        <StatCard label="Livreurs rattachés" value={String(couriers.length)} />
        <StatCard
          label="Courses du jour"
          value={num(agencies.reduce((s, a) => s + a.coursesToday, 0))}
        />
        <StatCard
          label="CA cumulé"
          value={num(agencies.reduce((s, a) => s + a.revenue, 0))}
          unit="FCFA"
        />
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <div className="space-y-3 xl:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2">
            {agencies.map((a) => (
              <div key={a.id} className="card-console p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-9 place-items-center rounded-md bg-accent text-accent-foreground">
                      <Building2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{a.name}</p>
                      <p className="text-[11px] text-muted-foreground">{a.zone}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      a.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {a.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {a.address}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserRound className="size-3.5" />
                  {a.manager} · <span className="num">{a.phone}</span>
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Cell label="Livreurs" value={String(a.couriers)} />
                  <Cell label="Courses" value={String(a.coursesToday)} />
                  <Cell label="CA" value={num(a.revenue)} />
                </div>
              </div>
            ))}
          </div>

          <Panel title="Comparatif des agences" bodyClassName="">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Agence</Th>
                  <Th>Gestionnaire</Th>
                  <Th align="right">Livreurs</Th>
                  <Th align="right">Courses du jour</Th>
                  <Th align="right">CA (FCFA)</Th>
                  <Th>Statut</Th>
                </tr>
              </thead>
              <tbody>
                {agencies.map((a) => (
                  <Tr key={a.id}>
                    <Td className="font-medium">{a.name}</Td>
                    <Td className="text-muted-foreground">{a.manager}</Td>
                    <Td align="right" mono>
                      {a.couriers}
                    </Td>
                    <Td align="right" mono>
                      {a.coursesToday}
                    </Td>
                    <Td align="right" mono>
                      {num(a.revenue)}
                    </Td>
                    <Td>{a.active ? "Active" : "Inactive"}</Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </div>

        <Panel title="Implantation sur Lomé">
          <MapView couriers={[]} agencies={agencies} className="h-[420px]" />
        </Panel>
      </div>
    </>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md p-2 ring-1 ring-border">
      <p className="label-caps">{label}</p>
      <p className="num mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
