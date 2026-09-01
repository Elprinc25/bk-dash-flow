import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel, TableWrap, Td, Th, Tr } from "@/components/bk/primitives";
import { agencies, num, zonePricing } from "@/lib/bk-data";

export const Route = createFileRoute("/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — BK Delivery" },
      {
        name: "description",
        content:
          "Configuration de la plateforme B&K Delivery : utilisateurs, rôles, agences, tarification, notifications, paiements et cartographie.",
      },
      { property: "og:title", content: "Paramètres — BK Delivery" },
      {
        property: "og:description",
        content: "Réglages généraux, sécurité et intégrations de B&K Delivery.",
      },
    ],
  }),
  component: SettingsPage,
});

const SECTIONS = [
  "Général",
  "Utilisateurs",
  "Rôles & permissions",
  "Agences",
  "Tarification",
  "Notifications",
  "Paiements",
  "Cartographie",
  "Sécurité",
  "Audit",
] as const;

const USERS = [
  { name: "Admin B&K", role: "Administrateur", agency: "Toutes", status: "Actif" },
  { name: "Ayélé Dogbé", role: "Gestionnaire", agency: "Lomé Centre", status: "Actif" },
  { name: "Kossi Amouzou", role: "Gestionnaire", agency: "Agoè", status: "Actif" },
  { name: "Rachidatou Sama", role: "Commercial", agency: "Lomé Centre", status: "Actif" },
  { name: "Koffi Amégnran", role: "Livreur", agency: "Agoè", status: "Actif" },
];

const PERMS = [
  { perm: "Voir toutes les agences", admin: true, gest: false, com: false, liv: false },
  { perm: "Créer / modifier une course", admin: true, gest: true, com: true, liv: false },
  { perm: "Assigner un livreur", admin: true, gest: true, com: false, liv: false },
  { perm: "Modifier la tarification", admin: true, gest: false, com: false, liv: false },
  { perm: "Clôturer la journée", admin: true, gest: true, com: false, liv: false },
  { perm: "Voir ses propres courses", admin: true, gest: true, com: true, liv: true },
];

function SettingsPage() {
  const [section, setSection] = useState<string>("Général");

  return (
    <>
      <PageHeader title="Paramètres" subtitle="Configuration de la plateforme B&K Delivery" />

      <div className="grid gap-3 lg:grid-cols-[220px_1fr]">
        <nav className="card-console h-fit p-2">
          {SECTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`block w-full rounded-md px-3 py-2 text-left text-[13px] transition-colors ${
                section === s ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </nav>

        <div className="space-y-3">
          {section === "Utilisateurs" ? (
            <Panel title="Utilisateurs de la plateforme" bodyClassName="">
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Nom</Th>
                    <Th>Rôle</Th>
                    <Th>Agence</Th>
                    <Th>Statut</Th>
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u) => (
                    <Tr key={u.name}>
                      <Td className="font-medium">{u.name}</Td>
                      <Td>{u.role}</Td>
                      <Td className="text-muted-foreground">{u.agency}</Td>
                      <Td>{u.status}</Td>
                    </Tr>
                  ))}
                </tbody>
              </TableWrap>
            </Panel>
          ) : section === "Rôles & permissions" ? (
            <Panel title="Matrice des permissions" bodyClassName="">
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Permission</Th>
                    <Th align="right">Admin</Th>
                    <Th align="right">Gestionnaire</Th>
                    <Th align="right">Commercial</Th>
                    <Th align="right">Livreur</Th>
                  </tr>
                </thead>
                <tbody>
                  {PERMS.map((p) => (
                    <Tr key={p.perm}>
                      <Td>{p.perm}</Td>
                      {[p.admin, p.gest, p.com, p.liv].map((v, i) => (
                        <Td key={i} align="right">
                          <span className={v ? "text-success" : "text-muted-foreground"}>
                            {v ? "Oui" : "—"}
                          </span>
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </tbody>
              </TableWrap>
            </Panel>
          ) : section === "Agences" ? (
            <Panel title="Agences configurées" bodyClassName="">
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Agence</Th>
                    <Th>Gestionnaire</Th>
                    <Th align="right">Livreurs</Th>
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
                      <Td>{a.active ? "Active" : "Inactive"}</Td>
                    </Tr>
                  ))}
                </tbody>
              </TableWrap>
            </Panel>
          ) : section === "Tarification" ? (
            <Panel title="Forfaits par zone" bodyClassName="">
              <TableWrap>
                <thead>
                  <tr>
                    <Th>Zone</Th>
                    <Th align="right">Tarif (FCFA)</Th>
                    <Th>Statut</Th>
                  </tr>
                </thead>
                <tbody>
                  {zonePricing.map((z) => (
                    <Tr key={z.zone}>
                      <Td>{z.zone}</Td>
                      <Td align="right" mono>
                        {num(z.price)}
                      </Td>
                      <Td>{z.active ? "Active" : "Désactivée"}</Td>
                    </Tr>
                  ))}
                </tbody>
              </TableWrap>
            </Panel>
          ) : section === "Cartographie" ? (
            <Panel title="Intégration cartographique">
              <p className="text-sm text-muted-foreground">
                La carte utilisée dans le module Dispatch est une carte <strong>mock</strong>. Aucun
                suivi GPS réel n'est connecté. L'architecture prévoit le branchement de Google Maps
                Platform ou Mapbox : chaque point expose déjà latitude, longitude, marqueurs,
                itinéraires, distance et ETA.
              </p>
              <ul className="mt-3 space-y-1 text-[13px] text-muted-foreground">
                <li>· Clé API cartographique — non configurée</li>
                <li>· Géocodage des adresses — à brancher</li>
                <li>· Fréquence de rafraîchissement GPS — 15 s (prévu)</li>
              </ul>
            </Panel>
          ) : (
            <Panel title={section}>
              <p className="text-sm text-muted-foreground">
                Section « {section} » du prototype : les réglages seront branchés lors de la
                connexion au backend.
              </p>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
