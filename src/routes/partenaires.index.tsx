import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
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
import { getSalesRep, num, partners } from "@/lib/bk-data";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/partenaires/")({
  head: () => ({
    meta: [
      { title: "Partenaires — BK Delivery" },
      {
        name: "description",
        content:
          "Portefeuille de partenaires B&K Delivery : restaurants, pâtisseries, pharmacies et commerces de Lomé.",
      },
      { property: "og:title", content: "Partenaires — BK Delivery" },
      {
        property: "og:description",
        content: "Volumes, chiffre d'affaires et montants dus par partenaire.",
      },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const [q, setQ] = useState("");
  const list = partners.filter((p) =>
    `${p.company} ${p.contact} ${p.zone}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Partenaires"
        subtitle="Comptes professionnels générant les courses"
        actions={
          <button
            type="button"
            onClick={() => toast.info("Création d'un partenaire (prototype)")}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            <Plus className="size-4" />
            Nouveau partenaire
          </button>
        }
      />

      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Partenaires" value={String(partners.length)} hint="1 inactif" />
        <StatCard
          label="Courses générées"
          value={num(partners.reduce((s, p) => s + p.courses, 0))}
        />
        <StatCard
          label="CA partenaires"
          value={num(partners.reduce((s, p) => s + p.revenue, 0))}
          unit="FCFA"
        />
        <StatCard
          label="Montants dus"
          value={num(partners.reduce((s, p) => s + p.due, 0))}
          unit="FCFA"
          tone="danger"
        />
      </div>

      <div className="card-console mb-3 p-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une entreprise, un contact, une zone"
          className="h-9 w-full sm:w-80"
        />
      </div>

      <Panel bodyClassName="">
        <TableWrap>
          <thead>
            <tr>
              <Th>Entreprise</Th>
              <Th>Contact</Th>
              <Th>Téléphone</Th>
              <Th>Commercial</Th>
              <Th align="right">Courses</Th>
              <Th align="right">CA (FCFA)</Th>
              <Th align="right">Montant dû</Th>
              <Th>Statut</Th>
              <Th align="right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <Tr key={p.id}>
                <Td className="font-medium">{p.company}</Td>
                <Td>{p.contact}</Td>
                <Td mono>{p.phone}</Td>
                <Td className="text-muted-foreground">{getSalesRep(p.salesRepId)?.name}</Td>
                <Td align="right" mono>
                  {p.courses}
                </Td>
                <Td align="right" mono>
                  {num(p.revenue)}
                </Td>
                <Td align="right" mono>
                  {num(p.due)}
                </Td>
                <Td>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      p.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.active ? "Actif" : "Inactif"}
                  </span>
                </Td>
                <Td align="right">
                  <Link
                    to="/partenaires/$id"
                    params={{ id: p.id }}
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
