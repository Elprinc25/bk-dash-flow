import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import {
  DefinitionList,
  PageHeader,
  Panel,
  PaymentBadge,
  StatCard,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courses,
  feedback,
  getSalesRep,
  num,
  partners,
  payments,
} from "@/lib/bk-data";

export const Route = createFileRoute("/partenaires/$id")({
  loader: ({ params }) => {
    const partner = partners.find((p) => p.id === params.id);
    if (!partner) throw notFound();
    return { partner };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Partenaire introuvable — BK Delivery" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.partner.company} — Partenaire BK Delivery`;
    const description = `Fiche partenaire ${loaderData.partner.company} : courses, paiements, statistiques et commentaires.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: PartnerDetail,
});

function PartnerDetail() {
  const { partner } = Route.useLoaderData();
  const own = courses.filter((c) => c.partnerId === partner.id);
  const pays = payments.filter((p) => own.some((c) => c.id === p.courseId));
  const notes = feedback.filter((f) => f.author.includes(partner.contact.split(" ")[0] ?? "###"));

  return (
    <>
      <Link
        to="/partenaires"
        className="mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Retour aux partenaires
      </Link>

      <PageHeader
        title={partner.company}
        subtitle={`${partner.type} · ${partner.zone} · partenaire depuis ${partner.since}`}
      />

      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Courses générées" value={num(partner.courses)} />
        <StatCard label="CA généré" value={num(partner.revenue)} unit="FCFA" />
        <StatCard label="Montant dû" value={num(partner.due)} unit="FCFA" tone="danger" />
        <StatCard label="Panier moyen" value={num(Math.round(partner.revenue / Math.max(partner.courses, 1)))} unit="FCFA" />
      </div>

      <Tabs defaultValue="infos">
        <TabsList>
          <TabsTrigger value="infos">Informations</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
          <TabsTrigger value="commentaires">Commentaires</TabsTrigger>
        </TabsList>

        <TabsContent value="infos" className="mt-3">
          <Panel title="Coordonnées">
            <DefinitionList
              items={[
                ["Identifiant", <span className="num">{partner.id}</span>],
                ["Contact principal", partner.contact],
                ["Téléphone", <span className="num">{partner.phone}</span>],
                ["Type d'activité", partner.type],
                ["Zone", partner.zone],
                ["Commercial rattaché", getSalesRep(partner.salesRepId)?.name ?? "—"],
                ["Client depuis", <span className="num">{partner.since}</span>],
                [
                  "Statut",
                  partner.active ? (
                    <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
                      Actif
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      Inactif
                    </span>
                  ),
                ],
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
                  <Th>Date</Th>
                  <Th>Trajet</Th>
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
                    <Td mono>
                      {c.date} {c.time}
                    </Td>
                    <Td className="text-muted-foreground">
                      {c.pickup.label} → {c.dropoff.label}
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

        <TabsContent value="paiements" className="mt-3">
          <Panel bodyClassName="">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Référence</Th>
                  <Th>Course</Th>
                  <Th>Moyen</Th>
                  <Th align="right">Montant</Th>
                  <Th>Statut</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {pays.map((p) => (
                  <Tr key={p.id}>
                    <Td mono>{p.reference}</Td>
                    <Td mono>{p.courseId}</Td>
                    <Td>{p.method}</Td>
                    <Td align="right" mono>
                      {num(p.amount)}
                    </Td>
                    <Td>
                      <PaymentBadge status={p.status} />
                    </Td>
                    <Td mono>
                      {p.date} {p.time}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </TabsContent>

        <TabsContent value="commentaires" className="mt-3">
          <Panel title="Retours du partenaire">
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun commentaire enregistré.</p>
            ) : (
              <ul className="space-y-3">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-md p-3 ring-1 ring-border">
                    <p className="text-sm font-medium">{n.subject}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                    <p className="num mt-2 text-[11px] text-muted-foreground">
                      {n.author} · {n.date}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}
