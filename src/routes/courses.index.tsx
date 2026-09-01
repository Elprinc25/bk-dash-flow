import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Map as MapIcon, MoreHorizontal, Pencil, Plus, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatusBadge,
  TableWrap,
  Td,
  Th,
  Tr,
} from "@/components/bk/primitives";
import { NewCourseDialog } from "@/components/bk/new-course-dialog";
import { AssignmentDialog } from "@/components/bk/assignment-dialog";
import {
  courseStatusLabel,
  courses as allCourses,
  couriers,
  getCourier,
  getPartner,
  num,
  partners,
  ZONES,
  type Course,
  type CourseStatus,
} from "@/lib/bk-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses — BK Delivery" },
      {
        name: "description",
        content:
          "Registre des courses B&K Delivery : filtres par statut, zone, livreur et partenaire, assignation et suivi.",
      },
      { property: "og:title", content: "Courses — BK Delivery" },
      {
        property: "og:description",
        content: "Suivi complet des courses de livraison à Lomé, avec statuts et assignation.",
      },
    ],
  }),
  component: CoursesPage,
});

const STATUSES: CourseStatus[] = [
  "brouillon",
  "attente",
  "assignee",
  "en_cours",
  "livree",
  "annulee",
  "litige",
];

function CoursesPage() {
  const [rows, setRows] = useState<Course[]>(allCourses);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("tous");
  const [courier, setCourier] = useState("tous");
  const [zone, setZone] = useState("toutes");
  const [partner, setPartner] = useState("tous");
  const [assigning, setAssigning] = useState<Course | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter((c) => {
        const p = getPartner(c.partnerId);
        const text = `${c.id} ${c.clientName} ${p?.company ?? ""} ${c.pickup.label} ${c.dropoff.label}`.toLowerCase();
        if (q && !text.includes(q.toLowerCase())) return false;
        if (status !== "tous" && c.status !== status) return false;
        if (courier !== "tous" && c.courierId !== courier) return false;
        if (zone !== "toutes" && c.pickup.label !== zone && c.dropoff.label !== zone) return false;
        if (partner !== "tous" && c.partnerId !== partner) return false;
        return true;
      }),
    [rows, q, status, courier, zone, partner],
  );

  const assign = (courseId: string, courierId: string) => {
    setRows((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, courierId, status: "assignee" as CourseStatus } : c,
      ),
    );
    const name = getCourier(courierId)?.name ?? "livreur";
    toast.success(`Course ${courseId} assignée à ${name}`);
    setAssigning(null);
  };

  const changeStatus = (courseId: string, next: CourseStatus) => {
    setRows((prev) => prev.map((c) => (c.id === courseId ? { ...c, status: next } : c)));
    toast.success(`Course ${courseId} → ${courseStatusLabel[next]}`);
  };

  return (
    <>
      <PageHeader
        title="Courses"
        subtitle={`${filtered.length} course(s) affichée(s) sur ${rows.length}`}
        actions={
          <NewCourseDialog
            onCreate={(course) => {
              setRows((prev) => [course, ...prev]);
              toast.success(`Course ${course.id} enregistrée`);
            }}
            trigger={
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                <Plus className="size-4" />
                Nouvelle course
              </button>
            }
          />
        }
      />

      <div className="card-console mb-3 flex flex-wrap items-center gap-2 p-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un ID, un client, un partenaire…"
          className="h-9 w-full sm:w-72"
        />
        <Filter value={status} onChange={setStatus} placeholder="Statut" width="w-[150px]">
          <SelectItem value="tous">Tous les statuts</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {courseStatusLabel[s]}
            </SelectItem>
          ))}
        </Filter>
        <Filter value={courier} onChange={setCourier} placeholder="Livreur" width="w-[170px]">
          <SelectItem value="tous">Tous les livreurs</SelectItem>
          {couriers.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </Filter>
        <Filter value={zone} onChange={setZone} placeholder="Zone" width="w-[160px]">
          <SelectItem value="toutes">Toutes les zones</SelectItem>
          {ZONES.map((z) => (
            <SelectItem key={z} value={z}>
              {z}
            </SelectItem>
          ))}
        </Filter>
        <Filter value={partner} onChange={setPartner} placeholder="Partenaire" width="w-[180px]">
          <SelectItem value="tous">Tous les partenaires</SelectItem>
          {partners.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.company}
            </SelectItem>
          ))}
        </Filter>
        <button
          type="button"
          onClick={() => {
            setQ("");
            setStatus("tous");
            setCourier("tous");
            setZone("toutes");
            setPartner("tous");
          }}
          className="ml-auto rounded-md px-3 py-2 text-xs text-muted-foreground ring-1 ring-border transition-colors hover:bg-accent"
        >
          Réinitialiser les filtres
        </button>
      </div>

      <Panel bodyClassName="">
        {filtered.length === 0 ? (
          <EmptyState
            title="Aucune course ne correspond aux filtres"
            hint="Modifiez la recherche ou réinitialisez les filtres pour retrouver l'ensemble du registre."
          />
        ) : (
          <TableWrap>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>Date</Th>
                <Th>Partenaire</Th>
                <Th>Départ</Th>
                <Th>Destination</Th>
                <Th>Livreur</Th>
                <Th align="right">Tarif</Th>
                <Th>Statut</Th>
                <Th align="right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <Tr key={c.id}>
                  <Td mono className="font-medium">
                    <Link to="/courses/$id" params={{ id: c.id }} className="hover:underline">
                      {c.id}
                    </Link>
                  </Td>
                  <Td className="whitespace-nowrap text-muted-foreground">
                    <span className="num">
                      {c.createdAt} {c.time}
                    </span>
                  </Td>
                  <Td>{getPartner(c.partnerId)?.company ?? "—"}</Td>
                  <Td>{c.pickup.label}</Td>
                  <Td>{c.dropoff.label}</Td>
                  <Td>{getCourier(c.courierId)?.name ?? "—"}</Td>
                  <Td align="right" mono>
                    {num(c.fee)}
                  </Td>
                  <Td>
                    <StatusBadge status={c.status} />
                  </Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/courses/$id"
                        params={{ id: c.id }}
                        title="Voir"
                        className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
                      >
                        <Eye className="size-4" />
                      </Link>
                      <button
                        type="button"
                        title="Assigner"
                        onClick={() => setAssigning(c)}
                        className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
                      >
                        <UserPlus className="size-4" />
                      </button>
                      <Link
                        to="/dispatch"
                        title="Voir sur la carte"
                        className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
                      >
                        <MapIcon className="size-4" />
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
                          >
                            <MoreHorizontal className="size-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info(`Édition de ${c.id}`)}>
                            <Pencil className="size-3.5" /> Modifier
                          </DropdownMenuItem>
                          {STATUSES.filter((s) => s !== c.status).map((s) => (
                            <DropdownMenuItem key={s} onClick={() => changeStatus(c.id, s)}>
                              Marquer « {courseStatusLabel[s]} »
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        )}
      </Panel>

      <AssignmentDialog
        course={assigning}
        onClose={() => setAssigning(null)}
        onAssign={assign}
      />
    </>
  );
}

function Filter({
  value,
  onChange,
  placeholder,
  width,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  width: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`h-9 ${width}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
}
