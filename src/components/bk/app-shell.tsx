import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Bike,
  Building2,
  ChevronsLeft,
  ChevronsRight,
  ClipboardList,
  Coins,
  FileBarChart,
  Handshake,
  History,
  LayoutDashboard,
  LogOut,
  Map,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Tags,
  UserRound,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { agencies } from "@/lib/bk-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string | undefined;
};

const NAV: Array<{ group: string; items: NavItem[] }> = [
  {
    group: "Opérations",
    items: [
      { to: "/", label: "Tableau de bord", icon: LayoutDashboard },
      { to: "/courses", label: "Courses", icon: ClipboardList, badge: "52" },
      { to: "/dispatch", label: "Dispatch & Carte", icon: Map },
      { to: "/livreurs", label: "Livreurs", icon: Bike },
      { to: "/agences", label: "Agences", icon: Building2 },
      { to: "/partenaires", label: "Partenaires", icon: Handshake },
      { to: "/commerciaux", label: "Commerciaux", icon: UserRound },
    ],
  },
  {
    group: "Finance",
    items: [
      { to: "/tarification", label: "Tarification", icon: Tags },
      { to: "/paiements", label: "Paiements", icon: Wallet },
      { to: "/dus", label: "Dus & Commissions", icon: Coins },
    ],
  },
  {
    group: "Système",
    items: [
      { to: "/notifications", label: "Notifications", icon: Bell, badge: "4" },
      { to: "/rapports", label: "Rapports", icon: FileBarChart },
      { to: "/commentaires", label: "Commentaires", icon: MessageSquare },
      { to: "/historique", label: "Historique / Audit", icon: History },
      { to: "/parametres", label: "Paramètres", icon: Settings },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [agency, setAgency] = useState(agencies[0]!.name);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex",
          collapsed ? "w-[68px]" : "w-[236px]",
        )}
      >
        <SidebarBody collapsed={collapsed} />
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-2 border-t border-sidebar-border px-4 py-2.5 text-[11px] text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? (
            <ChevronsRight className="size-4" />
          ) : (
            <>
              <ChevronsLeft className="size-4" />
              Réduire le menu
            </>
          )}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar agency={agency} onAgencyChange={setAgency} />
        <main className="flex-1 p-4 lg:p-5">{children}</main>
      </div>
    </div>
  );
}

function SidebarBody({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      <div className="flex items-center gap-2.5 border-b border-sidebar-border px-4 py-4">
        <div className="brand-glow grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
          BK
        </div>
        {!collapsed ? (
          <div className="leading-tight">
            <p className="text-sm font-semibold text-sidebar-accent-foreground">BK Delivery</p>
            <p className="text-[11px] text-sidebar-foreground/60">Dispatch OS</p>
          </div>
        ) : null}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2.5 py-4 text-sm">
        {NAV.map((section) => (
          <div key={section.group} className="pb-3">
            {!collapsed ? (
              <p className="px-3 pb-1.5 text-[10px] tracking-[0.18em] text-sidebar-foreground/40 uppercase">
                {section.group}
              </p>
            ) : null}
            {section.items.map((item) => {
              const active =
                item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  title={item.label}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
                    active
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed ? (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={cn(
                            "num ml-auto text-[11px]",
                            item.to === "/notifications"
                              ? "grid size-4 place-items-center rounded-full bg-warning text-[10px] font-semibold text-sidebar-primary-foreground"
                              : "text-sidebar-foreground/60",
                          )}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3.5">
        <div className="flex items-center gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            AB
          </div>
          {!collapsed ? (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-[13px] font-medium text-sidebar-accent-foreground">
                Admin B&amp;K
              </p>
              <p className="text-[11px] text-sidebar-foreground/50">Administrateur</p>
            </div>
          ) : null}
          {!collapsed ? (
            <button
              type="button"
              title="Déconnexion"
              className="text-sidebar-foreground/50 transition-colors hover:text-sidebar-accent-foreground"
            >
              <LogOut className="size-4" />
            </button>
          ) : null}
        </div>
        {!collapsed ? (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-sidebar-foreground/50">
            <span className="pulse-dot size-1.5 rounded-full bg-sidebar-primary" />
            Agence Lomé Centre · connecté
          </div>
        ) : null}
      </div>
    </>
  );
}

function Topbar({
  agency,
  onAgencyChange,
}: {
  agency: string;
  onAgencyChange: (v: string) => void;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:px-5">
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-md text-muted-foreground ring-1 ring-border transition-colors hover:bg-accent lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="size-4" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[260px] bg-sidebar p-0 text-sidebar-foreground">
          <SheetTitle className="sr-only">Navigation BK Delivery</SheetTitle>
          <div className="flex h-full flex-col">
            <SidebarBody />
          </div>
        </SheetContent>
      </Sheet>

      <label className="flex min-w-0 flex-1 items-center gap-2 lg:max-w-md">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          placeholder="Rechercher course, livreur, partenaire…"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="num hidden rounded px-1.5 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border sm:block">
          ⌘K
        </kbd>
      </label>

      <div className="ml-auto flex items-center gap-2 lg:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="hidden items-center gap-2 rounded-md px-3 py-1.5 text-sm ring-1 ring-border transition-colors hover:bg-accent md:flex"
            >
              <span className="size-1.5 rounded-full bg-brand" />
              <span className="max-w-[160px] truncate">{agency}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Changer d'agence</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {agencies.map((a) => (
              <DropdownMenuItem key={a.id} onClick={() => onAgencyChange(a.name)}>
                {a.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="num hidden items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11px] text-brand-deep sm:flex">
          <span className="pulse-dot size-1.5 rounded-full bg-brand" />
          En ligne
        </span>

        <Link
          to="/notifications"
          className="relative grid size-8 place-items-center rounded-md text-muted-foreground ring-1 ring-border transition-colors hover:bg-accent"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-warning" />
        </Link>

        <div className="flex items-center gap-2">
          <div className="grid size-8 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            AB
          </div>
          <div className="hidden leading-tight lg:block">
            <p className="text-[13px] font-medium">Admin B&amp;K</p>
            <p className="text-[11px] text-muted-foreground">Administrateur</p>
          </div>
        </div>
      </div>
    </header>
  );
}
