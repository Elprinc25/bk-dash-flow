import { useMemo, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  POINTS,
  courses,
  fcfa,
  partners,
  zonePricing,
  type Course,
  type PaymentMethod,
} from "@/lib/bk-data";

const ZONE_KEYS = Object.keys(POINTS) as Array<keyof typeof POINTS>;

/** Tarif kilométrique : 1-5 km → 300 + km×100 ; 5-10 km → 1 000 ; >10 km → 1 000 + suppl.×100 */
export function kmPrice(km: number) {
  if (km <= 5) return 300 + Math.round(km) * 100;
  if (km <= 10) return 1000;
  return 1000 + Math.round(km - 10) * 100;
}

function distanceBetween(a: keyof typeof POINTS, b: keyof typeof POINTS) {
  const p1 = POINTS[a];
  const p2 = POINTS[b];
  const d = Math.hypot(p1.x - p2.x, p1.y - p2.y) * 0.16;
  return Math.round(d * 10) / 10;
}

export function NewCourseDialog({
  trigger,
  onCreate,
}: {
  trigger: ReactNode;
  onCreate: (course: Course) => void;
}) {
  const [open, setOpen] = useState(false);
  const [partnerId, setPartnerId] = useState(partners[0]!.id);
  const [pickup, setPickup] = useState<keyof typeof POINTS>("agoe");
  const [dropoff, setDropoff] = useState<keyof typeof POINTS>("tokoin");
  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [value, setValue] = useState("10000");
  const [method, setMethod] = useState<PaymentMethod>("especes");
  const [mode, setMode] = useState<"km" | "zone">("km");

  const distance = useMemo(() => distanceBetween(pickup, dropoff), [pickup, dropoff]);
  const zoneFee =
    zonePricing.find((z) => z.zone === POINTS[dropoff].label)?.price ?? 1000;
  const fee = mode === "km" ? kmPrice(distance) : zoneFee;

  const submit = () => {
    const nextNumber = 126 + courses.length - 13;
    const course: Course = {
      id: `BK-${String(nextNumber).padStart(5, "0")}`,
      createdAt: "01/09/2026",
      time: "15:04",
      partnerId,
      clientName: client || "Client non renseigné",
      clientPhone: phone || "+228 90 00 00 00",
      quantity: Number(quantity) || 1,
      parcelValue: Number(value) || 0,
      fee,
      paymentMethod: method,
      paymentStatus: "attente",
      pickup: POINTS[pickup],
      dropoff: POINTS[dropoff],
      courierId: null,
      agencyId: "AG-01",
      status: "attente",
      distanceKm: distance,
      travelledKm: 0,
      durationMin: Math.max(6, Math.round(distance * 3)),
      eta: "—",
      timeline: [
        { label: "Commande créée", at: "01/09/2026 15:02" },
        { label: "Course enregistrée", at: "01/09/2026 15:04" },
        { label: "Livreur assigné", at: null },
        { label: "Course prise en charge", at: null },
        { label: "En cours de livraison", at: null },
        { label: "Livrée", at: null },
      ],
    };
    onCreate(course);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nouvelle course</DialogTitle>
          <DialogDescription>
            Le tarif est calculé automatiquement selon la grille kilométrique ou la grille par
            zone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Partenaire">
            <Select value={partnerId} onValueChange={setPartnerId}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {partners.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Moyen de paiement">
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="tmoney">TMoney</SelectItem>
                <SelectItem value="flooz">Flooz</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Zone de départ">
            <Select value={pickup} onValueChange={(v) => setPickup(v as keyof typeof POINTS)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ZONE_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {POINTS[k].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Zone de destination">
            <Select value={dropoff} onValueChange={(v) => setDropoff(v as keyof typeof POINTS)}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ZONE_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {POINTS[k].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Nom du client">
            <Input
              className="h-9"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Mme Adjo Kounté"
            />
          </Field>
          <Field label="Téléphone">
            <Input
              className="h-9"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+228 90 00 00 00"
            />
          </Field>
          <Field label="Quantité">
            <Input
              className="h-9"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputMode="numeric"
            />
          </Field>
          <Field label="Valeur du colis (FCFA)">
            <Input
              className="h-9"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputMode="numeric"
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-accent/60 p-3">
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setMode("km")}
              className={`rounded-md px-2.5 py-1.5 transition-colors ${
                mode === "km"
                  ? "bg-primary font-medium text-primary-foreground"
                  : "ring-1 ring-border hover:bg-card"
              }`}
            >
              Tarif kilométrique
            </button>
            <button
              type="button"
              onClick={() => setMode("zone")}
              className={`rounded-md px-2.5 py-1.5 transition-colors ${
                mode === "zone"
                  ? "bg-primary font-medium text-primary-foreground"
                  : "ring-1 ring-border hover:bg-card"
              }`}
            >
              Tarif par zone
            </button>
          </div>
          <div className="text-right">
            <p className="label-caps">
              Distance estimée <span className="num">{distance} km</span>
            </p>
            <p className="num text-lg font-semibold">{fcfa(fee)}</p>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md px-4 py-2 text-sm ring-1 ring-border transition-colors hover:bg-accent"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Enregistrer la course
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="label-caps">{label}</Label>
      {children}
    </div>
  );
}
