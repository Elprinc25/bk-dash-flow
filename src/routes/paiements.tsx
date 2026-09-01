import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PageHeader,
  Panel,
  PaymentBadge,
  StatCard,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  num,
  paymentMethodLabel,
  paymentStatusLabel,
  payments,
} from "@/lib/bk-data";

export const Route = createFileRoute("/paiements")({
  head: () => ({
    meta: [
      { title: "Paiements — BK Delivery" },
      {
        name: "description",
        content:
          "Encaissements B&K Delivery : espèces, TMoney et Flooz, avec références, statuts et totaux journaliers en FCFA.",
      },
      { property: "og:title", content: "Paiements — BK Delivery" },
      {
        property: "og:description",
        content: "Suivi des encaissements clients et partenaires de B&K Delivery.",
      },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("tous");
  const [status, setStatus] = useState("tous");
  const [type, setType] = useState("tous");

  const list = payments.filter(
    (p) =>
      `${p.ref} ${p.payer} ${p.courseId}`.toLowerCase().includes(q.toLowerCase()) &&
      (method === "tous" || p.method === method) &&
      (status === "tous" || p.status === status) &&
      (type === "tous" || p.type === type),
  );

  const paid = payments.filter((p) => p.status === "paye");
  const total = (m: string) =>
    paid.filter((p) => p.method === m).reduce((s, p) => s + p.amount, 0);

  return (
    <>
      <PageHeader
        title="Paiements"
        subtitle="Encaissements clients et partenaires — 01/09/2026"
      />

      <div className="mb-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total encaissé aujourd'hui"
          value={num(paid.reduce((s, p) => s + p.amount, 0))}
          unit="FCFA"
          tone="positive"
        />
        <StatCard label="Espèces" value={num(total("especes"))} unit="FCFA" />
        <StatCard label="TMoney" value={num(total("tmoney"))} unit="FCFA" />
        <StatCard label="Flooz" value={num(total("flooz"))} unit="FCFA" />
      </div>

      <div className="card-console mb-3 flex flex-wrap items-center gap-2 p-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Référence, payeur, course"
          className="h-9 w-full sm:w-64"
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les types</SelectItem>
            <SelectItem value="client">Paiement client</SelectItem>
            <SelectItem value="partenaire">Paiement partenaire</SelectItem>
          </SelectContent>
        </Select>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Moyen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les moyens</SelectItem>
            {Object.entries(paymentMethodLabel).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            {Object.entries(paymentStatusLabel).map(([k, v]) => (
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
              <Th>Référence</Th>
              <Th>Course</Th>
              <Th>Type</Th>
              <Th>Payeur</Th>
              <Th>Moyen</Th>
              <Th align="right">Montant</Th>
              <Th>Statut</Th>
              <Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <Tr key={p.id}>
                <Td mono>{p.ref}</Td>
                <Td mono>
                  <Link to="/courses/$id" params={{ id: p.courseId }} className="hover:underline">
                    {p.courseId}
                  </Link>
                </Td>
                <Td className="capitalize text-muted-foreground">{p.type}</Td>
                <Td>{p.payer}</Td>
                <Td>{paymentMethodLabel[p.method]}</Td>
                <Td align="right" mono>
                  {num(p.amount)}
                </Td>
                <Td>
                  <PaymentBadge status={p.status} />
                </Td>
                <Td mono>{p.date}</Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>
    </>
  );
}
