import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  CourierStatusBadge,
  Meter,
  PageHeader,
  Panel,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { agencies, couriers, courierStatusLabel, getAgency, num } from "@/lib/bk-data";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/livreurs/")({
  head: () => ({
    meta: [
      { title: "Livreurs — BK Delivery" },
      {
        name: "description",
        content:
          "Gestion des livreurs B&K Delivery : statuts, agences, volumes de courses, performance et localisation.",
      },
      { property: "og:title", content: "Livreurs — BK Delivery" },
      {
        property: "og:description",
        content: "Suivi de l'équipe de livreurs à moto de B&K Delivery à Lomé.",
      },
    ],
  }),
  component: CouriersPage,
});

function CouriersPage() {
  const [q, setQ] = useState("");
  const [agency, setAgency] = useState("toutes");
  const [status, setStatus] = useState("tous");

  const list = couriers.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) &&
      (agency === "toutes" || c.agencyId === agency) &&
      (status === "tous" || c.status === status),
  );

  const actifs = couriers.filter((c) => c.status !== "hors_ligne").length;

  return (
    <>
      <PageHeader
        title="Livreurs"
        subtitle="Équipe de livraison à moto — statuts, performance et localisation"
        actions={
          <button
            type="button"
            onClick={() => toast.info("Formulaire d'ajout de livreur (prototype)")}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Plus className="size-4" />
            Ajouter un livreur
          </button>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Livreurs" value={String(couriers.length)} hint="dont 3 nouveaux ce mois" />
        <StatCard label="Actifs" value={`${actifs}`} unit={`/ ${couriers.length}`} hint="temps réel" live />
        <StatCard
          label="Courses du jour"
          value={num(couriers.reduce((s, c) => s + c.coursesToday, 0))}
          hint="toutes agences"
        />
        <StatCard
          label="Dus livreurs"
          value={num(couriers.reduce((s, c) => s + c.due, 0))}
          unit="FCFA"
          hint="avant clôture"
        />
      </div>

      <div className="card-console mb-3 flex flex-wrap items-center gap-2 p-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un livreur"
          className="h-9 w-full sm:w-64"
        />
        <Select value={agency} onValueChange={setAgency}>
          <SelectTrigger className="h-9 w-[200px]">
            <SelectValue placeholder="Agence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes">Toutes les agences</SelectItem>
            {agencies.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-[170px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            {Object.entries(courierStatusLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Panel bodyClassName="">
        <TableWrap>
          <thead>
            <tr>
              <Th>Livreur</Th>
              <Th>Téléphone</Th>
              <Th>Agence</Th>
              <Th>Statut</Th>
              <Th align="right">Courses</Th>
              <Th>Performance</Th>
              <Th>Localisation</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <Tr key={c.id}>
                <Td>
                  <div className="flex items-center gap-2.5">
                    <div className="grid size-8 place-items-center rounded-full bg-muted text-[11px] font-semibold">
                      {c.initials}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="num text-[11px] text-muted-foreground">{c.id}</p>
                    </div>
                  </div>
                </Td>
                <Td mono>{c.phone}</Td>
                <Td className="text-muted-foreground">{getAgency(c.agencyId)?.name}</Td>
                <Td>
                  <CourierStatusBadge status={c.status} />
                </Td>
                <Td align="right" mono>
                  {c.coursesToday}
                </Td>
                <Td>
                  <Meter
                    value={c.performance}
                    tone={c.performance < 65 ? "bad" : c.performance < 80 ? "warn" : undefined}
                  />
                </Td>
                <Td>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5" />
                    {c.zone}
                  </span>
                </Td>
                <Td align="right">
                  <Link
                    to="/livreurs/$id"
                    params={{ id: c.id }}
                    className="rounded-md px-2.5 py-1.5 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                  >
                    Voir la fiche
                  </Link>
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>
    </>
  );
}
