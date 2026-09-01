import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PageHeader,
  Panel,
  Segmented,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import {
  agencies,
  couriers,
  num,
  revenueSeries,
  statusSplit,
  weeklyCourses,
  zoneVolumes,
} from "@/lib/bk-data";

export const Route = createFileRoute("/rapports")({
  head: () => ({
    meta: [
      { title: "Rapports & analytics — BK Delivery" },
      {
        name: "description",
        content:
          "Analyses B&K Delivery : évolution des courses, chiffre d'affaires, performance livreurs, volumes par zone et par agence.",
      },
      { property: "og:title", content: "Rapports & analytics — BK Delivery" },
      {
        property: "og:description",
        content: "Tableaux de bord analytiques et exports de l'activité de livraison.",
      },
    ],
  }),
  component: ReportsPage,
});

const tick = { fontSize: 11, fill: "var(--muted-foreground)" };

function ReportsPage() {
  const [period, setPeriod] = useState("semaine");

  return (
    <>
      <PageHeader
        title="Rapports & Analytics"
        subtitle="Analyse de l'activité de livraison — données mockées"
        actions={
          <>
            <button
              type="button"
              onClick={() => toast.info("Export PDF simulé")}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm ring-1 ring-border transition-colors hover:bg-accent"
            >
              <FileText className="size-4" />
              Exporter PDF
            </button>
            <button
              type="button"
              onClick={() => toast.info("Export Excel simulé")}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm ring-1 ring-border transition-colors hover:bg-accent"
            >
              <FileSpreadsheet className="size-4" />
              Exporter Excel
            </button>
          </>
        }
      />

      <div className="mb-3">
        <Segmented
          value={period}
          onChange={setPeriod}
          options={[
            { value: "jour", label: "Aujourd'hui" },
            { value: "semaine", label: "Cette semaine" },
            { value: "mois", label: "Ce mois" },
            { value: "perso", label: "Personnalisé" },
          ]}
        />
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Courses" value={num(380)} hint="+8,4% vs période précédente" tone="positive" />
        <StatCard label="Chiffre d'affaires" value={num(2946000)} unit="FCFA" tone="positive" />
        <StatCard label="Taux de livraison à temps" value="91%" hint="objectif 93%" />
        <StatCard label="Panier moyen" value={num(1755)} unit="FCFA" />
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        <Panel title="Évolution des courses" className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyCourses}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={28} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="creees" stroke="var(--brand)" strokeWidth={2} dot={false} name="Créées" />
                <Line type="monotone" dataKey="livrees" stroke="var(--success)" strokeWidth={2} dot={false} name="Livrées" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Répartition des statuts">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusSplit} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={2}>
                  {statusSplit.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Chiffre d'affaires">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueSeries}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={tick} axisLine={false} tickLine={false} />
                <YAxis tick={tick} axisLine={false} tickLine={false} width={44} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} />
                <Bar dataKey="ca" fill="var(--brand)" radius={[4, 4, 0, 0]} name="CA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Courses par zone">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneVolumes} layout="vertical">
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={tick} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="zone" tick={tick} axisLine={false} tickLine={false} width={92} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} />
                <Bar dataKey="courses" fill="var(--success)" radius={[0, 4, 4, 0]} name="Courses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Courses par agence" bodyClassName="">
          <TableWrap>
            <thead>
              <tr>
                <Th>Agence</Th>
                <Th align="right">Courses</Th>
                <Th align="right">CA</Th>
              </tr>
            </thead>
            <tbody>
              {agencies.map((a) => (
                <Tr key={a.id}>
                  <Td>{a.name}</Td>
                  <Td align="right" mono>
                    {a.coursesToday}
                  </Td>
                  <Td align="right" mono>
                    {num(a.revenue)}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>

        <Panel title="Performance des livreurs" className="lg:col-span-3" bodyClassName="">
          <TableWrap>
            <thead>
              <tr>
                <Th>Livreur</Th>
                <Th align="right">Courses</Th>
                <Th align="right">Livrées</Th>
                <Th align="right">En retard</Th>
                <Th align="right">À temps</Th>
                <Th align="right">CA généré</Th>
              </tr>
            </thead>
            <tbody>
              {couriers.map((c) => (
                <Tr key={c.id}>
                  <Td className="font-medium">{c.name}</Td>
                  <Td align="right" mono>
                    {c.coursesMonth}
                  </Td>
                  <Td align="right" mono>
                    {c.delivered}
                  </Td>
                  <Td align="right" mono>
                    {c.late}
                  </Td>
                  <Td align="right" mono>
                    {c.onTimeRate}%
                  </Td>
                  <Td align="right" mono>
                    {num(c.revenue)}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>
      </div>
    </>
  );
}
