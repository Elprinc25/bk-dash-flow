import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { closing, couriers, dues, fcfa, num, partners, salesReps } from "@/lib/bk-data";

export const Route = createFileRoute("/dus")({
  head: () => ({
    meta: [
      { title: "Dus & commissions — BK Delivery" },
      {
        name: "description",
        content:
          "Soldes dus aux livreurs et partenaires, commissions commerciales et clôture journalière B&K Delivery.",
      },
      { property: "og:title", content: "Dus & commissions — BK Delivery" },
      {
        property: "og:description",
        content: "Suivi des soldes, commissions et clôture de journée en FCFA.",
      },
    ],
  }),
  component: DuesPage,
});

function DuesPage() {
  const [open, setOpen] = useState(false);
  const [closed, setClosed] = useState(false);

  return (
    <>
      <PageHeader
        title="Dus & Commissions"
        subtitle="Soldes à régler et clôture de la journée du 01/09/2026"
        actions={
          <button
            type="button"
            disabled={closed}
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
          >
            {closed ? <CheckCircle2 className="size-4" /> : <Lock className="size-4" />}
            {closed ? "Journée clôturée" : "Clôturer la journée"}
          </button>
        }
      />

      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        <StatCard label="Dus livreurs" value={num(dues.couriers)} unit="FCFA" tone="danger" />
        <StatCard label="Dus partenaires" value={num(dues.partners)} unit="FCFA" tone="danger" />
        <StatCard label="Commissions commerciaux" value={num(dues.commissions)} unit="FCFA" />
      </div>

      <Tabs defaultValue="livreurs">
        <TabsList>
          <TabsTrigger value="livreurs">Livreurs</TabsTrigger>
          <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
          <TabsTrigger value="commerciaux">Commerciaux</TabsTrigger>
          <TabsTrigger value="cloture">Clôture journalière</TabsTrigger>
        </TabsList>

        <TabsContent value="livreurs" className="mt-3">
          <Panel bodyClassName="">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Livreur</Th>
                  <Th align="right">Courses</Th>
                  <Th align="right">CA généré</Th>
                  <Th align="right">Part livreur</Th>
                  <Th align="right">Montant dû</Th>
                  <Th align="right">Action</Th>
                </tr>
              </thead>
              <tbody>
                {couriers.map((c) => (
                  <Tr key={c.id}>
                    <Td className="font-medium">{c.name}</Td>
                    <Td align="right" mono>
                      {c.coursesToday}
                    </Td>
                    <Td align="right" mono>
                      {num(c.revenue)}
                    </Td>
                    <Td align="right" mono>
                      {num(c.commission)}
                    </Td>
                    <Td align="right" mono>
                      {num(c.due)}
                    </Td>
                    <Td align="right">
                      <button
                        type="button"
                        onClick={() => toast.success(`Règlement enregistré pour ${c.name}`)}
                        className="rounded-md px-2.5 py-1.5 text-xs ring-1 ring-border transition-colors hover:bg-accent"
                      >
                        Marquer réglé
                      </button>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </TabsContent>

        <TabsContent value="partenaires" className="mt-3">
          <Panel bodyClassName="">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Partenaire</Th>
                  <Th align="right">Courses</Th>
                  <Th align="right">CA</Th>
                  <Th align="right">Montant dû</Th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <Tr key={p.id}>
                    <Td className="font-medium">{p.company}</Td>
                    <Td align="right" mono>
                      {p.courses}
                    </Td>
                    <Td align="right" mono>
                      {num(p.revenue)}
                    </Td>
                    <Td align="right" mono>
                      {num(p.due)}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </Panel>
        </TabsContent>

        <TabsContent value="commerciaux" className="mt-3">
          <Panel bodyClassName="">
            <TableWrap>
              <thead>
                <tr>
                  <Th>Commercial</Th>
                  <Th align="right">Partenaires</Th>
                  <Th align="right">CA généré</Th>
                  <Th align="right">Commissions</Th>
                  <Th align="right">Dues</Th>
                </tr>
              </thead>
              <tbody>
                {salesReps.map((r) => (
                  <Tr key={r.id}>
                    <Td className="font-medium">{r.name}</Td>
                    <Td align="right" mono>
                      {r.partners}
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
        </TabsContent>

        <TabsContent value="cloture" className="mt-3">
          <Panel title={`Clôture du ${closing.date}`}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Line label="Courses" value={num(closing.courses)} />
              <Line label="Livrées" value={num(closing.delivered)} />
              <Line label="Annulées" value={num(closing.cancelled)} />
              <Line label="Litiges" value={num(closing.disputes)} />
              <Line label="Chiffre d'affaires" value={fcfa(closing.revenue)} />
              <Line label="Part agence" value={fcfa(closing.agencyShare)} />
              <Line label="Part livreurs" value={fcfa(closing.courierShare)} />
              <Line label="Commissions" value={fcfa(closing.commissions)} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              La clôture verrouille les courses de la journée et figes les soldes dus. Action
              simulée dans ce prototype.
            </p>
          </Panel>
        </TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Clôture du {closing.date}</DialogTitle>
            <DialogDescription>
              Vérifiez le résumé avant de confirmer. Les soldes seront figés.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            <Line label="Courses" value={num(closing.courses)} />
            <Line label="Livrées" value={num(closing.delivered)} />
            <Line label="Annulées" value={num(closing.cancelled)} />
            <Line label="Litiges" value={num(closing.disputes)} />
            <Line label="CA" value={fcfa(closing.revenue)} />
            <Line label="Part agence" value={fcfa(closing.agencyShare)} />
            <Line label="Part livreurs" value={fcfa(closing.courierShare)} />
            <Line label="Commissions" value={fcfa(closing.commissions)} />
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm ring-1 ring-border transition-colors hover:bg-accent"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                setClosed(true);
                setOpen(false);
                toast.success("Journée du 01/09/2026 clôturée");
              }}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Confirmer la clôture
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md p-3 ring-1 ring-border">
      <p className="label-caps">{label}</p>
      <p className="num mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}
