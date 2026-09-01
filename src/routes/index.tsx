import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CartesianGrid,
  Cell,
  Legend,
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
  Meter,
  PageHeader,
  Panel,
  Segmented,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { couriers, num, statusSplit, weeklyCourses } from "@/lib/bk-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — BK Delivery" },
      {
        name: "description",
        content:
          "Vue globale de l'activité de livraison B&K Delivery à Lomé : volumes, revenus, livreurs actifs et incidents.",
      },
      { property: "og:title", content: "Tableau de bord — BK Delivery" },
      {
        property: "og:description",
        content: "Volumes de courses, chiffre d'affaires et performance des livreurs en temps réel.",
      },
    ],
  }),
  component: Dashboard,
});

const PERIODS = [
  { value: "jour", label: "Aujourd'hui" },
  { value: "semaine", label: "Cette semaine" },
  { value: "mois", label: "Ce mois" },
  { value: "perso", label: "Personnalisé" },
] as const;

const ACTIVITY = [
  { text: "Course BK-00125 assignée à Koffi", at: "14:21:08", tone: "bg-brand" },
  { text: "Course BK-00124 livrée", at: "14:18:42", tone: "bg-success" },
  { text: "Nouveau partenaire ajouté — Épicerie Amoutivé", at: "14:02:11", tone: "bg-border" },
  { text: "Paiement reçu — 5 000 FCFA", at: "13:47:30", tone: "bg-success" },
  { text: "Course BK-00121 signalée en retard", at: "13:30:05", tone: "bg-danger" },
];

function Dashboard() {
  const [period, setPeriod] = useState<(typeof PERIODS)[number]["value"]>("jour");
  const top = [...couriers].sort((a, b) => b.performance - a.performance).slice(0, 6);

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle="Vue globale de l'activité de livraison — Lomé"
        actions={<Segmented options={PERIODS} value={period} onChange={setPeriod} />}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatCard label="Courses aujourd'hui" value="52" hint="+12,5% vs hier" tone="positive" />
        <StatCard label="En cours" value="14" hint="temps réel" live />
        <StatCard label="Livrées" value="34" hint="65% du total" tone="positive" />
        <StatCard label="En retard" value="4" hint="sous surveillance" tone="danger" />
        <StatCard label="Chiffre d'affaires" value="485 000" unit="FCFA" hint="part agence 97 000" />
        <StatCard label="Livreurs actifs" value="9" unit="/ 12" hint="3 en pause" />
        <StatCard label="Montants dus" value="126 500" unit="FCFA" hint="clôture non effectuée" />
        <StatCard label="Incidents" value="2" hint="à traiter" tone="danger" />
      </div>

      <div className="mb-5 grid gap-3 xl:grid-cols-3">
        <Panel
          title="Évolution des courses"
          className="xl:col-span-2"
          aside={
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-primary" />
                Créées
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-brand" />
                Livrées
              </span>
            </div>
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyCourses} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="creees"
                  name="Créées"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                />
                <Line
                  type="monotone"
                  dataKey="livrees"
                  name="Livrées"
                  stroke="var(--brand)"
                  strokeWidth={2}
                  dot={{ r: 2.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Répartition des courses">
          <div className="flex items-center gap-4">
            <div className="h-40 w-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusSplit}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={38}
                    outerRadius={62}
                    paddingAngle={1.5}
                    stroke="var(--card)"
                  >
                    {statusSplit.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      fontSize: 12,
                    }}
                  />
                  <Legend content={() => null} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex-1 space-y-1.5 text-xs">
              {statusSplit.map((s) => (
                <li key={s.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: s.color }}
                    />
                    {s.name}
                  </span>
                  <span className="num text-muted-foreground">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <Panel
          title="Performance des livreurs"
          className="xl:col-span-2"
          bodyClassName=""
          aside={
            <Link to="/livreurs" className="text-xs font-medium text-brand-deep hover:underline">
              Voir tous
            </Link>
          }
        >
          <TableWrap>
            <thead>
              <tr>
                <Th>Livreur</Th>
                <Th align="right">Courses</Th>
                <Th align="right">Livrées</Th>
                <Th align="right">En retard</Th>
                <Th align="right">CA généré</Th>
                <Th>Performance</Th>
              </tr>
            </thead>
            <tbody>
              {top.map((c) => (
                <Tr key={c.id}>
                  <Td className="font-medium">{c.name}</Td>
                  <Td align="right" mono>
                    {c.coursesToday}
                  </Td>
                  <Td align="right" mono>
                    {c.delivered}
                  </Td>
                  <Td align="right" mono>
                    {c.late}
                  </Td>
                  <Td align="right" mono>
                    {num(c.revenue)}
                  </Td>
                  <Td>
                    <Meter
                      value={c.performance}
                      tone={c.performance < 65 ? "bad" : c.performance < 80 ? "warn" : undefined}
                    />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </Panel>

        <Panel title="Activité récente">
          <ol className="relative space-y-4 pl-5">
            <span className="absolute top-1 bottom-1 left-[5px] w-px bg-border" />
            {ACTIVITY.map((a) => (
              <li key={a.at} className="relative">
                <span
                  className={`absolute top-1 -left-5 size-2.5 rounded-full ring-4 ring-accent ${a.tone}`}
                />
                <p className="text-[13px] leading-tight">{a.text}</p>
                <p className="num mt-0.5 text-[11px] text-muted-foreground">{a.at}</p>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </>
  );
}
