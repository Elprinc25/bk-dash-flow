import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  PageHeader,
  Panel,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { Input } from "@/components/ui/input";
import { auditLog } from "@/lib/bk-data";

export const Route = createFileRoute("/historique")({
  head: () => ({
    meta: [
      { title: "Historique & audit — BK Delivery" },
      {
        name: "description",
        content:
          "Journal d'audit B&K Delivery : traçabilité des actions utilisateurs, valeurs avant/après, dates et objets modifiés.",
      },
      { property: "og:title", content: "Historique & audit — BK Delivery" },
      {
        property: "og:description",
        content: "Traçabilité complète des modifications réalisées dans la plateforme.",
      },
    ],
  }),
  component: AuditPage,
});

function AuditPage() {
  const [q, setQ] = useState("");
  const list = auditLog.filter((a) =>
    `${a.user} ${a.action} ${a.target} ${a.field}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Historique / Audit"
        subtitle="Recherche multicritère sur toutes les actions de la plateforme"
      />

      <div className="card-console mb-3 p-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Utilisateur, action, numéro de course, champ modifié"
          className="h-9 w-full sm:w-96"
        />
      </div>

      <Panel bodyClassName="">
        <TableWrap>
          <thead>
            <tr>
              <Th>Utilisateur</Th>
              <Th>Rôle</Th>
              <Th>Action</Th>
              <Th>Objet</Th>
              <Th>Champ</Th>
              <Th>Ancienne valeur</Th>
              <Th>Nouvelle valeur</Th>
              <Th>Date</Th>
              <Th>Heure</Th>
            </tr>
          </thead>
          <tbody>
            {list.map((a) => (
              <Tr key={a.id}>
                <Td className="font-medium">{a.user}</Td>
                <Td className="text-muted-foreground">{a.role}</Td>
                <Td>{a.action}</Td>
                <Td mono>{a.target}</Td>
                <Td className="text-muted-foreground">{a.field}</Td>
                <Td className="text-muted-foreground">{a.before}</Td>
                <Td>{a.after}</Td>
                <Td mono>{a.date}</Td>
                <Td mono>{a.time}</Td>
              </Tr>
            ))}
          </tbody>
        </TableWrap>
      </Panel>
    </>
  );
}
