import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  courierStatusLabel,
  courseStatusLabel,
  paymentStatusLabel,
  type CourierStatus,
  type CourseStatus,
  type PaymentStatus,
} from "@/lib/bk-data";

/* ---------------- Page header ---------------- */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string | undefined;
  actions?: ReactNode | undefined;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/* ---------------- Segmented control ---------------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string | undefined;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg bg-card p-0.5 text-sm ring-1 ring-border",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-3 py-1.5 transition-colors",
            value === o.value
              ? "bg-primary font-medium text-primary-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Cards ---------------- */

export function Panel({
  title,
  aside,
  className,
  bodyClassName,
  children,
}: {
  title?: string | undefined;
  aside?: ReactNode | undefined;
  className?: string | undefined;
  bodyClassName?: string | undefined;
  children: ReactNode;
}) {
  return (
    <section className={cn("card-console overflow-hidden", className)}>
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">{title}</h2>
          {aside}
        </header>
      ) : null}
      <div className={cn(title ? "" : "", bodyClassName ?? "p-4")}>{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  unit,
  hint,
  tone = "default",
  live,
}: {
  label: string;
  value: string;
  unit?: string | undefined;
  hint?: string | undefined;
  tone?: "default" | "positive" | "danger" | undefined;
  live?: boolean | undefined;
}) {
  return (
    <div className="card-console p-4">
      <p className="label-caps">{label}</p>
      <p
        className={cn(
          "num mt-2 text-2xl font-semibold",
          tone === "danger" && "text-danger",
          tone === "positive" && "text-success",
        )}
      >
        {value}
        {unit ? <span className="ml-1 text-base text-muted-foreground">{unit}</span> : null}
      </p>
      {hint ? (
        <p
          className={cn(
            "mt-1 flex items-center gap-1.5 text-xs",
            tone === "positive" ? "text-success" : "text-muted-foreground",
          )}
        >
          {live ? <span className="pulse-dot size-1.5 rounded-full bg-brand" /> : null}
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------- Badges ---------------- */

const courseTone: Record<CourseStatus, string> = {
  brouillon: "bg-muted text-muted-foreground",
  attente: "bg-neutral/15 text-foreground/70",
  assignee: "bg-warning/15 text-warning",
  en_cours: "bg-brand/15 text-brand-deep",
  livree: "bg-success/15 text-success",
  annulee: "bg-muted text-muted-foreground",
  litige: "bg-danger/12 text-danger",
};

export function StatusBadge({ status }: { status: CourseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        courseTone[status],
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {courseStatusLabel[status]}
    </span>
  );
}

const paymentTone: Record<PaymentStatus, string> = {
  attente: "bg-warning/15 text-warning",
  paye: "bg-success/15 text-success",
  echoue: "bg-danger/12 text-danger",
  rembourse: "bg-muted text-muted-foreground",
};

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
        paymentTone[status],
      )}
    >
      {paymentStatusLabel[status]}
    </span>
  );
}

export const courierDot: Record<CourierStatus, string> = {
  disponible: "bg-success",
  livraison: "bg-brand",
  pause: "bg-warning",
  incident: "bg-danger",
  hors_ligne: "bg-muted-foreground",
};

export function CourierStatusBadge({
  status,
  className,
}: {
  status: CourierStatus;
  className?: string | undefined;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", className)}>
      <span
        className={cn(
          "size-2 rounded-full",
          courierDot[status],
          status === "livraison" && "pulse-dot",
        )}
      />
      {courierStatusLabel[status]}
    </span>
  );
}

/* ---------------- Table primitives ---------------- */

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">{children}</table>
    </div>
  );
}

export function Th({
  children,
  align = "left",
  className,
}: {
  children?: ReactNode | undefined;
  align?: "left" | "right" | undefined;
  className?: string | undefined;
}) {
  return (
    <th
      className={cn(
        "label-caps border-b border-border px-3 py-2 font-medium",
        align === "right" ? "text-right" : "text-left",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  align = "left",
  mono,
  className,
}: {
  children?: ReactNode | undefined;
  align?: "left" | "right" | undefined;
  mono?: boolean | undefined;
  className?: string | undefined;
}) {
  return (
    <td
      className={cn(
        "border-b border-border/60 px-3 py-2.5",
        align === "right" ? "text-right" : "text-left",
        mono && "num",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function Tr({
  children,
  onClick,
  active,
}: {
  children: ReactNode;
  onClick?: () => void | undefined;
  active?: boolean | undefined;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "transition-colors",
        onClick && "cursor-pointer",
        active ? "bg-accent" : "hover:bg-accent/60",
      )}
    >
      {children}
    </tr>
  );
}

export function Meter({
  value,
  tone,
}: {
  value: number;
  tone?: "warn" | "bad" | undefined;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="block h-1.5 w-14 overflow-hidden rounded-full bg-border">
        <span
          className={cn(
            "block h-full rounded-full",
            tone === "bad" ? "bg-danger" : tone === "warn" ? "bg-warning" : "bg-brand",
          )}
          style={{ width: `${value}%` }}
        />
      </span>
      <span className="num text-xs">{value}%</span>
    </div>
  );
}

/* ---------------- States ---------------- */

export function EmptyState({
  title,
  hint,
  icon,
}: {
  title: string;
  hint?: string | undefined;
  icon?: ReactNode | undefined;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      <p className="text-sm font-medium">{title}</p>
      {hint ? <p className="max-w-sm text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-md bg-muted" />
      ))}
    </div>
  );
}

export function DefinitionList({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map(([k, v]) => (
        <div key={k}>
          <dt className="label-caps">{k}</dt>
          <dd className="mt-0.5 text-sm">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
