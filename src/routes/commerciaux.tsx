import { createFileRoute } from "@tanstack/react-router";
import {
  PageHeader,
  Panel,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { num, partners, salesReps } from "@/lib/bk-data";

export const Route = createFileRoute("/commerciaux")({
  head: () => ({
    meta: [
      { title: "Commerciaux — BK Delivery" },
      {
        name: "description",
        content:
          "Suivi des commerciaux B&K Delivery : portefeuille de partenaires, courses générées, CA et commissions dues.",
      },
      { property: "og:title", content: "Commerciaux — BK Delivery" },
      {
        property: "og:description",
        content: "Performance commerciale et commissions de l'équipe B&K Delivery.",
      },
    ],
  }),
  component: SalesPage,
});

function SalesPage() {
  return (
    <>
      <PageHeader
        title="Commerciaux"
        subtitle="Apporteurs d'affaires et commissions associées"
      />

      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Commerciaux" value={String(salesReps.length)} />
        <StatCard
          label="Courses générées"
          value={num(salesReps.reduce((s, r) => s + r.courses, 0))}
        />
        <StatCard
          label="CA généré"
          value={num(salesReps.reduce((s, r) => s + r.revenue, 0))}
          unit="FCFA"
        />
        <StatCard
          label="Commissions dues"
          value={num(salesReps.reduce((s, r) => s + r.commissionDue, 0))}
          unit="FCFA"
          tone="danger"
        />
      </div>

      <Panel title="Équipe commerciale" bodyClassName="">
        <TableWrap>
          <thead>
            <tr>
              <Th>Commercial</Th>
              <Th>Téléphone</Th>
              <Th>Zone</Th>
              <Th align="right">Partenaires</Th>
              <Th align="right">Courses</Th>
              <Th align="right">CA généré</Th>
              <Th align="right">Commissions</Th>
              <Th align="right">Commissions dues</Th>
            </tr>
          </thead>
          <tbody>
            {salesReps.map((r) => (
              <Tr key={r.id}>
                <Td className="font-medium">{r.name}</Td>
                <Td mono>{r.phone}</Td>
                <Td className="text-muted-foreground">{r.zone}</Td>
                <Td align="right" mono>
                  {r.partners}
                </Td>
                <Td align="right" mono>
                  {r.courses}
                </Td>
                <Td align="right" mono>
                  {num(r.revenue)}
                </Td>
                <Td align="right" mono>
                  {num(r.commission)}
                </Td>
                <Td align="right" mono>
                  {num(r.commissionDue)}
                </Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {salesReps.map((r) => {
          const own = partners.filter((p) => p.salesRepId === r.id);
          return (
            <Panel key={r.id} title={`Portefeuille — ${r.name}`} bodyClassName="">
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Partenaire</Th>
                    <Th>Zone</Th>
                    <Th align="right">Courses</Th>
                    <Th align="right">CA</Th>
                  </tr>
                </thead>
                <tbody>
                  {own.map((p) => (
                    <Tr key={p.id}>
                      <Td>{p.company}</Td>
                      <Td className="text-muted-foreground">{p.zone}</Td>
                      <Td align="right" mono>
                        {p.courses}
                      </Td>
                      <Td align="right" mono>
                        {num(p.revenue)}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </TableWrap>
            </Panel>
          );
        })}
      </div>
    </>
  );
}
