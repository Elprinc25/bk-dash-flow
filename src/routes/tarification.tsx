import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calculator, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  PageHeader,
  Panel,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { fcfa, kmPricing, num, zonePricing } from "@/lib/bk-data";

export const Route = createFileRoute("/tarification")({
  head: () => ({
    meta: [
      { title: "Tarification — BK Delivery" },
      {
        name: "description",
        content:
          "Configuration des tarifs B&K Delivery : grille kilométrique, forfaits par zone et simulateur de prix en FCFA.",
      },
      { property: "og:title", content: "Tarification — BK Delivery" },
      {
        property: "og:description",
        content: "Grille kilométrique et forfaits par zone de livraison à Lomé.",
      },
    ],
  }),
  component: PricingPage,
});

function computeKmPrice(km: number) {
  if (km <= 0) return 0;
  if (km <= 5) return 300 + Math.round(km) * 100;
  if (km <= 10) return 1000;
  return 1000 + Math.round(km - 10) * 100;
}

function PricingPage() {
  const [km, setKm] = useState(3);
  const [zones, setZones] = useState(zonePricing);

  return (
    <>
      <PageHeader
        title="Tarification"
        subtitle="Grille kilométrique et forfaits par zone — appliqués à la création de course"
      />

      <Tabs defaultValue="km">
        <TabsList>
          <TabsTrigger value="km">Tarification kilométrique</TabsTrigger>
          <TabsTrigger value="zone">Tarification par zone</TabsTrigger>
        </TabsList>

        <TabsContent value="km" className="mt-3 grid gap-3 lg:grid-cols-3">
          <Panel title="Grille en vigueur" className="lg:col-span-2" bodyClassName="">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Distance</Th>
                  <Th>Formule</Th>
                  <Th align="right">Exemple</Th>
                </tr>
              </thead>
              <tbody>
                {kmPricing.map((k) => (
                  <Tr key={k.range}>
                    <Td className="font-medium">{k.range}</Td>
                    <Td className="text-muted-foreground">{k.formula}</Td>
                    <Td align="right" mono>
                      {k.example}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
            <div className="p-4">
              <p className="label-caps mb-2">Formule appliquée</p>
              <ul className="num space-y-1 text-[13px] text-muted-foreground">
                <li>1 à 5 km : 300 FCFA + km × 100 FCFA</li>
                <li>5 à 10 km : forfait 1 000 FCFA</li>
                <li>&gt; 10 km : 1 000 FCFA + km supplémentaires × 100 FCFA</li>
              </ul>
            </div>
          </Panel>

          <Panel title="Simulateur">
            <label className="label-caps">Distance (km)</label>
            <Input
              type="number"
              min={0}
              step={0.5}
              value={km}
              onChange={(e) => setKm(Number(e.target.value))}
              className="mt-1.5 h-9"
            />
            <div className="mt-4 rounded-md bg-accent p-4 text-accent-foreground">
              <p className="label-caps">Tarif calculé</p>
              <p className="num mt-1 text-2xl font-semibold">{fcfa(computeKmPrice(km))}</p>
            </div>
            <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <Calculator className="mt-0.5 size-3.5 shrink-0" />
              Calcul frontend identique à celui utilisé dans le formulaire de nouvelle course.
            </p>
          </Panel>
        </TabsContent>

        <TabsContent value="zone" className="mt-3">
          <Panel
            title="Forfaits par zone"
            actions={
              <button
                type="button"
                onClick={() => toast.info("Ajout d'une zone tarifaire (prototype)")}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs ring-1 ring-border transition-colors hover:bg-accent"
              >
                <Plus className="size-3.5" />
                Nouvelle zone
              </button>
            }
            bodyClassName=""
          >
            <TableWrap>
              <thead>
                <tr>
                  <Th>Zone</Th>
                  <Th align="right">Tarif (FCFA)</Th>
                  <Th>Statut</Th>
                  <Th align="right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z) => (
                  <Tr key={z.zone}>
                    <Td className="font-medium">{z.zone}</Td>
                    <Td align="right" mono>
                      {num(z.price)}
                    </Td>
                    <Td>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          z.active
                            ? "bg-success/15 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {z.active ? "Active" : "Désactivée"}
                      </span>
                    </Td>
                    <Td align="right">
                      <button
                        type="button"
                        onClick={() =>
                          setZones((prev) =>
                            prev.map((p) =>
                              p.zone === z.zone ? { ...p, active: !p.active } : p,
                            ),
                          )
                        }
                        className="rounded-md px-2.5 py-1.5 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                      >
                        {z.active ? "Désactiver" : "Activer"}
                      </button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}
