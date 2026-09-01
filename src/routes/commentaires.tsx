import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/bk/primitives";
import { feedbacks } from "@/lib/bk-data";

export const Route = createFileRoute("/commentaires")({
  head: () => ({
    meta: [
      { title: "Commentaires & suggestions — BK Delivery" },
      {
        name: "description",
        content:
          "Retours des partenaires, livreurs et commerciaux de B&K Delivery avec suivi des réponses et statuts de traitement.",
      },
      { property: "og:title", content: "Commentaires & suggestions — BK Delivery" },
      {
        property: "og:description",
        content: "Boîte à retours et suggestions d'amélioration de B&K Delivery.",
      },
    ],
  }),
  component: FeedbackPage,
});

const STATUS: Record<string, { label: string; cls: string }> = {
  nouveau: { label: "Nouveau", cls: "bg-brand/12 text-brand" },
  en_cours: { label: "En cours", cls: "bg-warning/15 text-warning" },
  repondu: { label: "Répondu", cls: "bg-success/15 text-success" },
  ferme: { label: "Fermé", cls: "bg-muted text-muted-foreground" },
};

function FeedbackPage() {
  const [filter, setFilter] = useState("tous");
  const list = feedbacks.filter((f) => filter === "tous" || f.status === filter);

  return (
    <>
      <PageHeader
        title="Commentaires & Suggestions"
        subtitle="Retours terrain des partenaires, livreurs et commerciaux"
      />

      <div className="card-console mb-3 flex flex-wrap gap-1.5 p-2">
        {[["tous", "Tous"], ...Object.entries(STATUS).map(([k, v]) => [k, v.label] as const)].map(
          ([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k as string)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === k ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              {label}
            </button>
          ),
        )}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {list.map((f) => (
          <Panel key={f.id} title={f.subject}>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="font-medium text-foreground">{f.author}</span>
              <span>· {f.role}</span>
              <span className="num">· {f.date}</span>
              <span className={`ml-auto rounded-full px-2 py-0.5 font-medium ${STATUS[f.status]?.cls}`}>
                {STATUS[f.status]?.label}
              </span>
            </div>
            <p className="mt-3 text-sm">{f.message}</p>
            {f.courseId && (
              <Link
                to="/courses/$id"
                params={{ id: f.courseId }}
                className="num mt-2 inline-block text-xs text-brand hover:underline"
              >
                Course associée : {f.courseId}
              </Link>
            )}
            {f.reply && (
              <div className="mt-3 rounded-md bg-accent p-3 text-accent-foreground">
                <p className="label-caps">Réponse B&K</p>
                <p className="mt-1 text-[13px]">{f.reply}</p>
              </div>
            )}
          </Panel>
        ))}
      </div>
    </>
  );
}
