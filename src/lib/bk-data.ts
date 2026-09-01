/**
 * BK Delivery — données mockées réalistes (Lomé, Togo — septembre 2026).
 * Aucun backend : toutes les vues consomment ce module.
 * Les positions sont exprimées en coordonnées "carte" normalisées (0-100)
 * ainsi qu'en lat/lng réelles, pour permettre le remplacement futur par
 * Google Maps Platform ou Mapbox sans changer la structure des composants.
 */

export type CourseStatus =
  | "brouillon"
  | "attente"
  | "assignee"
  | "en_cours"
  | "livree"
  | "annulee"
  | "litige";

export type CourierStatus = "disponible" | "livraison" | "pause" | "incident" | "hors_ligne";

export type PaymentMethod = "especes" | "tmoney" | "flooz";
export type PaymentStatus = "attente" | "paye" | "echoue" | "rembourse";

export interface GeoPoint {
  /** latitude réelle (prête pour Google Maps / Mapbox) */
  lat: number;
  /** longitude réelle */
  lng: number;
  /** position normalisée sur la carte mock (0-100) */
  x: number;
  y: number;
  label: string;
}

export interface Agency {
  id: string;
  name: string;
  zone: string;
  address: string;
  manager: string;
  phone: string;
  couriers: number;
  coursesToday: number;
  revenue: number;
  active: boolean;
  point: GeoPoint;
}

export interface Courier {
  id: string;
  name: string;
  initials: string;
  phone: string;
  agencyId: string;
  status: CourierStatus;
  currentCourseId?: string;
  zone: string;
  battery: number;
  speed: number;
  lastPing: string;
  joinedAt: string;
  coursesToday: number;
  coursesMonth: number;
  delivered: number;
  late: number;
  revenue: number;
  commission: number;
  due: number;
  onTimeRate: number;
  performance: number;
  point: GeoPoint;
}

export interface Partner {
  id: string;
  company: string;
  contact: string;
  phone: string;
  zone: string;
  salesRepId: string;
  courses: number;
  revenue: number;
  due: number;
  active: boolean;
  since: string;
}

export interface SalesRep {
  id: string;
  name: string;
  phone: string;
  partners: number;
  courses: number;
  revenue: number;
  commission: number;
  commissionDue: number;
  zone: string;
}

export interface TimelineStep {
  label: string;
  at: string | null;
  note?: string;
}

export interface Course {
  id: string;
  createdAt: string;
  time: string;
  partnerId: string;
  clientName: string;
  clientPhone: string;
  quantity: number;
  parcelValue: number;
  fee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  pickup: GeoPoint;
  dropoff: GeoPoint;
  courierId: string | null;
  agencyId: string;
  status: CourseStatus;
  distanceKm: number;
  travelledKm: number;
  durationMin: number;
  eta: string;
  timeline: TimelineStep[];
}

export const ZONES = [
  "Lomé Centre",
  "Agoè",
  "Adidogomé",
  "Tokoin",
  "Bè",
  "Nyékonakpoè",
  "Hedzranawoé",
  "Kodjoviakopé",
  "Amoutivé",
  "Aéroport",
] as const;

const P = (label: string, lat: number, lng: number, x: number, y: number): GeoPoint => ({
  label,
  lat,
  lng,
  x,
  y,
});

export const POINTS = {
  centre: P("Lomé Centre", 6.1319, 1.2228, 48, 74),
  agoe: P("Agoè", 6.2136, 1.1786, 26, 18),
  adidogome: P("Adidogomé", 6.1806, 1.152, 14, 38),
  tokoin: P("Tokoin", 6.1622, 1.2119, 42, 52),
  be: P("Bè", 6.1355, 1.2492, 65, 70),
  nyekonakpoe: P("Nyékonakpoè", 6.1268, 1.2072, 40, 80),
  hedzranawoe: P("Hedzranawoé", 6.1755, 1.2493, 66, 44),
  kodjoviakope: P("Kodjoviakopé", 6.1258, 1.1926, 32, 84),
  amoutive: P("Amoutivé", 6.1327, 1.2338, 56, 76),
  aeroport: P("Aéroport", 6.1656, 1.2547, 72, 50),
} satisfies Record<string, GeoPoint>;

export const agencies: Agency[] = [
  {
    id: "AG-01",
    name: "Agence Lomé Centre",
    zone: "Lomé Centre",
    address: "Rue du Commerce, Lomé Centre",
    manager: "Ayélé Dogbé",
    phone: "+228 90 12 34 56",
    couriers: 6,
    coursesToday: 24,
    revenue: 218000,
    active: true,
    point: POINTS.centre,
  },
  {
    id: "AG-02",
    name: "Point relais Agoè",
    zone: "Agoè",
    address: "Carrefour Agoè-Assiyéyé",
    manager: "Kossi Amouzou",
    phone: "+228 91 45 67 89",
    couriers: 4,
    coursesToday: 15,
    revenue: 142500,
    active: true,
    point: POINTS.agoe,
  },
  {
    id: "AG-03",
    name: "Point relais Adidogomé",
    zone: "Adidogomé",
    address: "Route de Kpalimé, Adidogomé",
    manager: "Akouvi Tetteh",
    phone: "+228 92 78 10 22",
    couriers: 2,
    coursesToday: 9,
    revenue: 78500,
    active: true,
    point: POINTS.adidogome,
  },
  {
    id: "AG-04",
    name: "Point relais Bè",
    zone: "Bè",
    address: "Marché de Bè, Lomé",
    manager: "Sena Lawson",
    phone: "+228 93 22 41 07",
    couriers: 0,
    coursesToday: 4,
    revenue: 46000,
    active: false,
    point: POINTS.be,
  },
];

export const salesReps: SalesRep[] = [
  {
    id: "CM-01",
    name: "Essossinam Bodjona",
    phone: "+228 90 55 21 14",
    partners: 8,
    courses: 214,
    revenue: 1840000,
    commission: 92000,
    commissionDue: 28000,
    zone: "Lomé Centre",
  },
  {
    id: "CM-02",
    name: "Rachidatou Sama",
    phone: "+228 91 08 76 33",
    partners: 5,
    courses: 132,
    revenue: 1105000,
    commission: 55250,
    commissionDue: 19500,
    zone: "Agoè",
  },
  {
    id: "CM-03",
    name: "Yao Adjaho",
    phone: "+228 92 61 40 88",
    partners: 4,
    courses: 96,
    revenue: 742000,
    commission: 37100,
    commissionDue: 14500,
    zone: "Adidogomé",
  },
];

export const partners: Partner[] = [
  {
    id: "PT-01",
    company: "Restaurant Le Palais",
    contact: "Didier Ekoué",
    phone: "+228 90 11 22 33",
    zone: "Lomé Centre",
    salesRepId: "CM-01",
    courses: 84,
    revenue: 612000,
    due: 68500,
    active: true,
    since: "12/02/2026",
  },
  {
    id: "PT-02",
    company: "Boulangerie Hedzra",
    contact: "Afiwa Kpodar",
    phone: "+228 91 33 44 55",
    zone: "Hedzranawoé",
    salesRepId: "CM-01",
    courses: 61,
    revenue: 428000,
    due: 42000,
    active: true,
    since: "03/03/2026",
  },
  {
    id: "PT-03",
    company: "Pharmacie Nyékona",
    contact: "Dr. Kofi Mensah",
    phone: "+228 92 55 66 77",
    zone: "Nyékonakpoè",
    salesRepId: "CM-02",
    courses: 47,
    revenue: 388000,
    due: 31500,
    active: true,
    since: "21/03/2026",
  },
  {
    id: "PT-04",
    company: "Gâteaux Adidogomé",
    contact: "Bénédicta Aziablé",
    phone: "+228 93 77 88 99",
    zone: "Adidogomé",
    salesRepId: "CM-03",
    courses: 38,
    revenue: 254000,
    due: 22000,
    active: true,
    since: "08/05/2026",
  },
  {
    id: "PT-05",
    company: "Express Kodjovi",
    contact: "Kodjovi Agbeko",
    phone: "+228 90 44 55 66",
    zone: "Kodjoviakopé",
    salesRepId: "CM-02",
    courses: 22,
    revenue: 168000,
    due: 12000,
    active: true,
    since: "17/06/2026",
  },
  {
    id: "PT-06",
    company: "Épicerie Amoutivé",
    contact: "Grâce Sodji",
    phone: "+228 91 66 77 88",
    zone: "Amoutivé",
    salesRepId: "CM-03",
    courses: 14,
    revenue: 96000,
    due: 9000,
    active: false,
    since: "02/08/2026",
  },
];

export const couriers: Courier[] = [
  {
    id: "LV-01",
    name: "Koffi Amégnran",
    initials: "KA",
    phone: "+228 90 21 43 65",
    agencyId: "AG-01",
    status: "livraison",
    currentCourseId: "BK-00125",
    zone: "Agoè",
    battery: 76,
    speed: 28,
    lastPing: "14:42:18",
    joinedAt: "14/01/2026",
    coursesToday: 9,
    coursesMonth: 168,
    delivered: 8,
    late: 1,
    revenue: 68400,
    commission: 47880,
    due: 32400,
    onTimeRate: 94,
    performance: 96,
    point: POINTS.agoe,
  },
  {
    id: "LV-02",
    name: "Mensah Kodjo",
    initials: "MK",
    phone: "+228 91 55 12 09",
    agencyId: "AG-01",
    status: "livraison",
    currentCourseId: "BK-00124",
    zone: "Bè",
    battery: 54,
    speed: 22,
    lastPing: "14:41:52",
    joinedAt: "27/01/2026",
    coursesToday: 7,
    coursesMonth: 141,
    delivered: 6,
    late: 1,
    revenue: 52100,
    commission: 36470,
    due: 25100,
    onTimeRate: 88,
    performance: 89,
    point: POINTS.be,
  },
  {
    id: "LV-03",
    name: "Komlan Ame",
    initials: "CA",
    phone: "+228 92 74 30 41",
    agencyId: "AG-02",
    status: "pause",
    zone: "Tokoin",
    battery: 41,
    speed: 0,
    lastPing: "14:38:04",
    joinedAt: "02/02/2026",
    coursesToday: 5,
    coursesMonth: 112,
    delivered: 4,
    late: 1,
    revenue: 38900,
    commission: 27230,
    due: 18900,
    onTimeRate: 79,
    performance: 72,
    point: POINTS.tokoin,
  },
  {
    id: "LV-04",
    name: "Afi Sossou",
    initials: "AS",
    phone: "+228 93 12 87 60",
    agencyId: "AG-01",
    status: "disponible",
    zone: "Lomé Centre",
    battery: 92,
    speed: 0,
    lastPing: "14:42:31",
    joinedAt: "19/02/2026",
    coursesToday: 6,
    coursesMonth: 128,
    delivered: 6,
    late: 0,
    revenue: 45600,
    commission: 31920,
    due: 21600,
    onTimeRate: 98,
    performance: 98,
    point: POINTS.centre,
  },
  {
    id: "LV-05",
    name: "Kodjo Tchalla",
    initials: "KT",
    phone: "+228 90 66 22 18",
    agencyId: "AG-02",
    status: "incident",
    currentCourseId: "BK-00121",
    zone: "Adidogomé",
    battery: 18,
    speed: 0,
    lastPing: "14:19:47",
    joinedAt: "05/03/2026",
    coursesToday: 4,
    coursesMonth: 97,
    delivered: 2,
    late: 2,
    revenue: 24500,
    commission: 17150,
    due: 14500,
    onTimeRate: 64,
    performance: 58,
    point: POINTS.adidogome,
  },
  {
    id: "LV-06",
    name: "Abra Gnassingbé",
    initials: "AG",
    phone: "+228 91 90 41 25",
    agencyId: "AG-03",
    status: "disponible",
    zone: "Hedzranawoé",
    battery: 68,
    speed: 0,
    lastPing: "14:42:02",
    joinedAt: "11/04/2026",
    coursesToday: 5,
    coursesMonth: 88,
    delivered: 5,
    late: 0,
    revenue: 36200,
    commission: 25340,
    due: 16200,
    onTimeRate: 96,
    performance: 93,
    point: POINTS.hedzranawoe,
  },
  {
    id: "LV-07",
    name: "Sylvain Dossou",
    initials: "SD",
    phone: "+228 92 31 09 74",
    agencyId: "AG-01",
    status: "livraison",
    currentCourseId: "BK-00123",
    zone: "Aéroport",
    battery: 83,
    speed: 34,
    lastPing: "14:42:11",
    joinedAt: "23/04/2026",
    coursesToday: 6,
    coursesMonth: 104,
    delivered: 5,
    late: 0,
    revenue: 41800,
    commission: 29260,
    due: 19800,
    onTimeRate: 91,
    performance: 90,
    point: POINTS.aeroport,
  },
  {
    id: "LV-08",
    name: "Yawa Klutsé",
    initials: "YK",
    phone: "+228 93 55 60 12",
    agencyId: "AG-03",
    status: "hors_ligne",
    zone: "Amoutivé",
    battery: 0,
    speed: 0,
    lastPing: "11:04:39",
    joinedAt: "06/05/2026",
    coursesToday: 2,
    coursesMonth: 61,
    delivered: 2,
    late: 0,
    revenue: 14200,
    commission: 9940,
    due: 6200,
    onTimeRate: 90,
    performance: 84,
    point: POINTS.amoutive,
  },
  {
    id: "LV-09",
    name: "Emmanuel Atsu",
    initials: "EA",
    phone: "+228 90 78 34 55",
    agencyId: "AG-02",
    status: "disponible",
    zone: "Nyékonakpoè",
    battery: 60,
    speed: 0,
    lastPing: "14:41:20",
    joinedAt: "14/06/2026",
    coursesToday: 4,
    coursesMonth: 52,
    delivered: 4,
    late: 0,
    revenue: 28900,
    commission: 20230,
    due: 12900,
    onTimeRate: 95,
    performance: 91,
    point: POINTS.nyekonakpoe,
  },
  {
    id: "LV-10",
    name: "Prosper Nyametso",
    initials: "PN",
    phone: "+228 91 20 88 47",
    agencyId: "AG-01",
    status: "pause",
    zone: "Kodjoviakopé",
    battery: 47,
    speed: 0,
    lastPing: "14:30:15",
    joinedAt: "29/06/2026",
    coursesToday: 3,
    coursesMonth: 44,
    delivered: 3,
    late: 0,
    revenue: 21400,
    commission: 14980,
    due: 9400,
    onTimeRate: 93,
    performance: 87,
    point: POINTS.kodjoviakope,
  },
];

const tl = (steps: Array<[string, string | null]>): TimelineStep[] =>
  steps.map(([label, at]) => ({ label, at }));

const fullTimeline = (base: string): TimelineStep[] =>
  tl([
    ["Commande créée", `${base} 14:12`],
    ["Course enregistrée", `${base} 14:15`],
    ["Livreur assigné", `${base} 14:21`],
    ["Course prise en charge", `${base} 14:27`],
    ["En cours de livraison", `${base} 14:35`],
    ["Livrée", `${base} 14:56`],
  ]);

export const courses: Course[] = [
  {
    id: "BK-00125",
    createdAt: "01/09/2026",
    time: "14:32",
    partnerId: "PT-01",
    clientName: "Mme Adjo Kounté",
    clientPhone: "+228 90 88 77 66",
    quantity: 2,
    parcelValue: 12000,
    fee: 1800,
    paymentMethod: "tmoney",
    paymentStatus: "attente",
    pickup: POINTS.agoe,
    dropoff: POINTS.tokoin,
    courierId: "LV-01",
    agencyId: "AG-01",
    status: "en_cours",
    distanceKm: 8.4,
    travelledKm: 5.2,
    durationMin: 24,
    eta: "14:55",
    timeline: tl([
      ["Commande créée", "01/09/2026 14:12"],
      ["Course enregistrée", "01/09/2026 14:15"],
      ["Livreur assigné", "01/09/2026 14:21"],
      ["Course prise en charge", "01/09/2026 14:27"],
      ["En cours de livraison", "01/09/2026 14:35"],
      ["Livrée", null],
    ]),
  },
  {
    id: "BK-00124",
    createdAt: "01/09/2026",
    time: "13:58",
    partnerId: "PT-02",
    clientName: "M. Elom Ahiabu",
    clientPhone: "+228 91 44 33 22",
    quantity: 1,
    parcelValue: 8500,
    fee: 2200,
    paymentMethod: "especes",
    paymentStatus: "paye",
    pickup: POINTS.be,
    dropoff: POINTS.amoutive,
    courierId: "LV-02",
    agencyId: "AG-01",
    status: "livree",
    distanceKm: 4.1,
    travelledKm: 4.1,
    durationMin: 15,
    eta: "14:18",
    timeline: fullTimeline("01/09/2026"),
  },
  {
    id: "BK-00123",
    createdAt: "01/09/2026",
    time: "13:41",
    partnerId: "PT-03",
    clientName: "Clinique Saint-Joseph",
    clientPhone: "+228 92 10 20 30",
    quantity: 3,
    parcelValue: 45000,
    fee: 3500,
    paymentMethod: "flooz",
    paymentStatus: "paye",
    pickup: POINTS.aeroport,
    dropoff: POINTS.be,
    courierId: "LV-07",
    agencyId: "AG-01",
    status: "en_cours",
    distanceKm: 6.8,
    travelledKm: 2.4,
    durationMin: 21,
    eta: "15:02",
    timeline: tl([
      ["Commande créée", "01/09/2026 13:30"],
      ["Course enregistrée", "01/09/2026 13:35"],
      ["Livreur assigné", "01/09/2026 13:41"],
      ["Course prise en charge", "01/09/2026 13:52"],
      ["En cours de livraison", "01/09/2026 14:04"],
      ["Livrée", null],
    ]),
  },
  {
    id: "BK-00122",
    createdAt: "01/09/2026",
    time: "13:20",
    partnerId: "PT-04",
    clientName: "Mlle Sika Amégan",
    clientPhone: "+228 93 60 70 80",
    quantity: 1,
    parcelValue: 15000,
    fee: 1500,
    paymentMethod: "tmoney",
    paymentStatus: "paye",
    pickup: POINTS.adidogome,
    dropoff: POINTS.centre,
    courierId: "LV-06",
    agencyId: "AG-03",
    status: "livree",
    distanceKm: 7.2,
    travelledKm: 7.2,
    durationMin: 22,
    eta: "13:52",
    timeline: fullTimeline("01/09/2026"),
  },
  {
    id: "BK-00121",
    createdAt: "01/09/2026",
    time: "12:55",
    partnerId: "PT-04",
    clientName: "M. Bruno Kanyi",
    clientPhone: "+228 90 33 55 77",
    quantity: 2,
    parcelValue: 22000,
    fee: 1500,
    paymentMethod: "especes",
    paymentStatus: "attente",
    pickup: POINTS.tokoin,
    dropoff: POINTS.centre,
    courierId: "LV-05",
    agencyId: "AG-02",
    status: "litige",
    distanceKm: 5.4,
    travelledKm: 3.1,
    durationMin: 18,
    eta: "13:28",
    timeline: tl([
      ["Commande créée", "01/09/2026 12:40"],
      ["Course enregistrée", "01/09/2026 12:44"],
      ["Livreur assigné", "01/09/2026 12:55"],
      ["Course prise en charge", "01/09/2026 13:06"],
      ["En cours de livraison", "01/09/2026 13:12"],
      ["Livrée", null],
    ]),
  },
  {
    id: "BK-00120",
    createdAt: "01/09/2026",
    time: "12:32",
    partnerId: "PT-05",
    clientName: "Boutique Vivi",
    clientPhone: "+228 91 77 12 45",
    quantity: 4,
    parcelValue: 30000,
    fee: 1200,
    paymentMethod: "flooz",
    paymentStatus: "attente",
    pickup: POINTS.hedzranawoe,
    dropoff: POINTS.be,
    courierId: null,
    agencyId: "AG-01",
    status: "attente",
    distanceKm: 4.6,
    travelledKm: 0,
    durationMin: 16,
    eta: "—",
    timeline: tl([
      ["Commande créée", "01/09/2026 12:28"],
      ["Course enregistrée", "01/09/2026 12:32"],
      ["Livreur assigné", null],
      ["Course prise en charge", null],
      ["En cours de livraison", null],
      ["Livrée", null],
    ]),
  },
  {
    id: "BK-00119",
    createdAt: "01/09/2026",
    time: "11:58",
    partnerId: "PT-01",
    clientName: "M. Rodrigue Sowu",
    clientPhone: "+228 92 55 41 30",
    quantity: 1,
    parcelValue: 9000,
    fee: 1000,
    paymentMethod: "especes",
    paymentStatus: "paye",
    pickup: POINTS.centre,
    dropoff: POINTS.nyekonakpoe,
    courierId: "LV-04",
    agencyId: "AG-01",
    status: "livree",
    distanceKm: 2.9,
    travelledKm: 2.9,
    durationMin: 11,
    eta: "12:18",
    timeline: fullTimeline("01/09/2026"),
  },
  {
    id: "BK-00118",
    createdAt: "01/09/2026",
    time: "11:40",
    partnerId: "PT-06",
    clientName: "Mme Léa Bokovi",
    clientPhone: "+228 93 21 66 09",
    quantity: 1,
    parcelValue: 6000,
    fee: 1200,
    paymentMethod: "tmoney",
    paymentStatus: "echoue",
    pickup: POINTS.amoutive,
    dropoff: POINTS.kodjoviakope,
    courierId: "LV-10",
    agencyId: "AG-01",
    status: "assignee",
    distanceKm: 3.4,
    travelledKm: 0,
    durationMin: 13,
    eta: "12:10",
    timeline: tl([
      ["Commande créée", "01/09/2026 11:32"],
      ["Course enregistrée", "01/09/2026 11:36"],
      ["Livreur assigné", "01/09/2026 11:40"],
      ["Course prise en charge", null],
      ["En cours de livraison", null],
      ["Livrée", null],
    ]),
  },
  {
    id: "BK-00117",
    createdAt: "01/09/2026",
    time: "11:12",
    partnerId: "PT-03",
    clientName: "M. Sébastien Ali",
    clientPhone: "+228 90 12 78 44",
    quantity: 2,
    parcelValue: 18000,
    fee: 2500,
    paymentMethod: "flooz",
    paymentStatus: "paye",
    pickup: POINTS.nyekonakpoe,
    dropoff: POINTS.agoe,
    courierId: "LV-09",
    agencyId: "AG-02",
    status: "livree",
    distanceKm: 11.2,
    travelledKm: 11.2,
    durationMin: 32,
    eta: "11:52",
    timeline: fullTimeline("01/09/2026"),
  },
  {
    id: "BK-00116",
    createdAt: "01/09/2026",
    time: "10:47",
    partnerId: "PT-02",
    clientName: "Hôtel Lagune",
    clientPhone: "+228 91 30 55 12",
    quantity: 6,
    parcelValue: 52000,
    fee: 2800,
    paymentMethod: "especes",
    paymentStatus: "paye",
    pickup: POINTS.hedzranawoe,
    dropoff: POINTS.centre,
    courierId: "LV-03",
    agencyId: "AG-02",
    status: "livree",
    distanceKm: 6.1,
    travelledKm: 6.1,
    durationMin: 19,
    eta: "11:14",
    timeline: fullTimeline("01/09/2026"),
  },
  {
    id: "BK-00115",
    createdAt: "01/09/2026",
    time: "10:15",
    partnerId: "PT-05",
    clientName: "M. Aristide Kpade",
    clientPhone: "+228 92 44 66 88",
    quantity: 1,
    parcelValue: 4500,
    fee: 900,
    paymentMethod: "tmoney",
    paymentStatus: "rembourse",
    pickup: POINTS.kodjoviakope,
    dropoff: POINTS.tokoin,
    courierId: null,
    agencyId: "AG-01",
    status: "annulee",
    distanceKm: 4.9,
    travelledKm: 0,
    durationMin: 17,
    eta: "—",
    timeline: tl([
      ["Commande créée", "01/09/2026 10:08"],
      ["Course enregistrée", "01/09/2026 10:15"],
      ["Livreur assigné", null],
      ["Annulée par le partenaire", "01/09/2026 10:22"],
    ]),
  },
  {
    id: "BK-00114",
    createdAt: "01/09/2026",
    time: "09:52",
    partnerId: "PT-01",
    clientName: "Mme Rose Kabissa",
    clientPhone: "+228 93 90 11 20",
    quantity: 3,
    parcelValue: 26000,
    fee: 3200,
    paymentMethod: "especes",
    paymentStatus: "paye",
    pickup: POINTS.centre,
    dropoff: POINTS.aeroport,
    courierId: "LV-08",
    agencyId: "AG-01",
    status: "livree",
    distanceKm: 9.7,
    travelledKm: 9.7,
    durationMin: 28,
    eta: "10:34",
    timeline: fullTimeline("01/09/2026"),
  },
  {
    id: "BK-00113",
    createdAt: "01/09/2026",
    time: "09:20",
    partnerId: "PT-06",
    clientName: "M. Franck Amétépé",
    clientPhone: "+228 90 55 30 41",
    quantity: 1,
    parcelValue: 7500,
    fee: 1000,
    paymentMethod: "flooz",
    paymentStatus: "attente",
    pickup: POINTS.amoutive,
    dropoff: POINTS.be,
    courierId: null,
    agencyId: "AG-04",
    status: "brouillon",
    distanceKm: 2.2,
    travelledKm: 0,
    durationMin: 9,
    eta: "—",
    timeline: tl([["Commande créée", "01/09/2026 09:20"]]),
  },
];

export interface Payment {
  id: string;
  ref: string;
  courseId: string;
  type: "client" | "partenaire";
  payer: string;
  method: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  date: string;
}

export const payments: Payment[] = [
  { id: "PY-1041", ref: "TM-8842190", courseId: "BK-00124", type: "client", payer: "M. Elom Ahiabu", method: "especes", amount: 2200, status: "paye", date: "01/09/2026 14:18" },
  { id: "PY-1040", ref: "TM-8842177", courseId: "BK-00125", type: "client", payer: "Mme Adjo Kounté", method: "tmoney", amount: 1800, status: "attente", date: "01/09/2026 14:12" },
  { id: "PY-1039", ref: "FL-5520084", courseId: "BK-00123", type: "partenaire", payer: "Pharmacie Nyékona", method: "flooz", amount: 3500, status: "paye", date: "01/09/2026 13:44" },
  { id: "PY-1038", ref: "TM-8841903", courseId: "BK-00122", type: "client", payer: "Mlle Sika Amégan", method: "tmoney", amount: 1500, status: "paye", date: "01/09/2026 13:52" },
  { id: "PY-1037", ref: "ESP-00921", courseId: "BK-00121", type: "client", payer: "M. Bruno Kanyi", method: "especes", amount: 1500, status: "attente", date: "01/09/2026 13:28" },
  { id: "PY-1036", ref: "ESP-00918", courseId: "BK-00119", type: "client", payer: "M. Rodrigue Sowu", method: "especes", amount: 1000, status: "paye", date: "01/09/2026 12:18" },
  { id: "PY-1035", ref: "TM-8841440", courseId: "BK-00118", type: "client", payer: "Mme Léa Bokovi", method: "tmoney", amount: 1200, status: "echoue", date: "01/09/2026 11:44" },
  { id: "PY-1034", ref: "FL-5519802", courseId: "BK-00117", type: "partenaire", payer: "Pharmacie Nyékona", method: "flooz", amount: 2500, status: "paye", date: "01/09/2026 11:52" },
  { id: "PY-1033", ref: "ESP-00910", courseId: "BK-00116", type: "partenaire", payer: "Boulangerie Hedzra", method: "especes", amount: 2800, status: "paye", date: "01/09/2026 11:14" },
  { id: "PY-1032", ref: "TM-8841002", courseId: "BK-00115", type: "client", payer: "M. Aristide Kpade", method: "tmoney", amount: 900, status: "rembourse", date: "01/09/2026 10:26" },
  { id: "PY-1031", ref: "ESP-00904", courseId: "BK-00114", type: "client", payer: "Mme Rose Kabissa", method: "especes", amount: 3200, status: "paye", date: "01/09/2026 10:34" },
];

export interface Notification {
  id: string;
  category: "courses" | "livreurs" | "paiements" | "incidents" | "systeme";
  title: string;
  detail: string;
  at: string;
  read: boolean;
}

export const notifications: Notification[] = [
  { id: "N-90", category: "courses", title: "Course #BK-00125 assignée à Koffi", detail: "Dispatch automatique — score 96%", at: "14:21", read: false },
  { id: "N-89", category: "livreurs", title: "Le livreur Mensah est en retard de 15 minutes", detail: "Course #BK-00124 — zone Bè", at: "14:12", read: false },
  { id: "N-88", category: "paiements", title: "Paiement de 5 000 FCFA reçu", detail: "TMoney — réf. TM-8842177", at: "14:05", read: false },
  { id: "N-87", category: "incidents", title: "Incident signalé par Kodjo Tchalla", detail: "Panne moto — Adidogomé, course #BK-00121", at: "13:47", read: false },
  { id: "N-86", category: "courses", title: "Course #BK-00124 livrée", detail: "Encaissement espèces confirmé", at: "13:30", read: true },
  { id: "N-85", category: "systeme", title: "Nouvelle grille tarifaire appliquée", detail: "Zone Aéroport : 2 500 FCFA", at: "12:10", read: true },
  { id: "N-84", category: "livreurs", title: "Batterie faible — Kodjo Tchalla (18%)", detail: "Suivi GPS potentiellement interrompu", at: "11:55", read: true },
  { id: "N-83", category: "paiements", title: "Échec paiement TMoney", detail: "Course #BK-00118 — 1 200 FCFA", at: "11:44", read: true },
];

export interface Feedback {
  id: string;
  author: string;
  role: string;
  subject: string;
  courseId?: string;
  message: string;
  date: string;
  status: "nouveau" | "en_cours" | "repondu" | "ferme";
  reply?: string;
}

export const feedbacks: Feedback[] = [
  { id: "FB-31", author: "Didier Ekoué", role: "Partenaire", subject: "Retard récurrent sur la zone Tokoin", courseId: "BK-00121", message: "Les livraisons vers Tokoin arrivent souvent après 30 minutes en fin de journée.", date: "01/09/2026 13:10", status: "nouveau" },
  { id: "FB-30", author: "Afiwa Kpodar", role: "Partenaire", subject: "Demande de facture mensuelle PDF", message: "Serait-il possible de recevoir un récapitulatif mensuel automatique ?", date: "31/08/2026 17:42", status: "en_cours" },
  { id: "FB-29", author: "Koffi Amégnran", role: "Livreur", subject: "Ajouter un bouton colis récupéré", message: "Un raccourci sur mobile éviterait des appels au dispatch.", date: "30/08/2026 09:20", status: "repondu", reply: "Prévu dans la version mobile 1.2." },
  { id: "FB-28", author: "Dr. Kofi Mensah", role: "Partenaire", subject: "Livraison réfrigérée", message: "Possibilité de transporter des produits sensibles au froid ?", date: "28/08/2026 11:05", status: "ferme", reply: "Non couvert pour le moment." },
  { id: "FB-27", author: "Rachidatou Sama", role: "Commercial", subject: "Suivi des commissions", message: "Le détail par partenaire serait utile en fin de mois.", date: "27/08/2026 15:33", status: "repondu", reply: "Disponible dans Dus & Commissions." },
];

export interface AuditEntry {
  id: string;
  user: string;
  role: string;
  action: string;
  target: string;
  field: string;
  before: string;
  after: string;
  date: string;
  time: string;
}

export const auditLog: AuditEntry[] = [
  { id: "A-5120", user: "Admin B&K", role: "Administrateur", action: "a assigné la course", target: "BK-00125", field: "livreur", before: "—", after: "Koffi Amégnran", date: "01/09/2026", time: "14:21" },
  { id: "A-5119", user: "Ayélé Dogbé", role: "Gestionnaire", action: "a modifié le statut", target: "BK-00124", field: "statut", before: "En cours", after: "Livrée", date: "01/09/2026", time: "14:18" },
  { id: "A-5118", user: "Admin B&K", role: "Administrateur", action: "a mis à jour la tarification", target: "Zone Aéroport", field: "tarif", before: "2 200 FCFA", after: "2 500 FCFA", date: "01/09/2026", time: "12:10" },
  { id: "A-5117", user: "Kossi Amouzou", role: "Gestionnaire", action: "a créé la course", target: "BK-00120", field: "course", before: "—", after: "Brouillon", date: "01/09/2026", time: "12:32" },
  { id: "A-5116", user: "Admin B&K", role: "Administrateur", action: "a ajouté un partenaire", target: "Épicerie Amoutivé", field: "partenaire", before: "—", after: "Actif", date: "01/09/2026", time: "11:02" },
  { id: "A-5115", user: "Système", role: "Automatique", action: "a signalé un retard", target: "BK-00121", field: "alerte", before: "—", after: "Retard 15 min", date: "01/09/2026", time: "13:30" },
  { id: "A-5114", user: "Ayélé Dogbé", role: "Gestionnaire", action: "a validé un paiement", target: "PY-1033", field: "statut", before: "En attente", after: "Payé", date: "01/09/2026", time: "11:14" },
];

/* ---------- Séries pour graphiques ---------- */

export const weeklyCourses = [
  { day: "Lun", creees: 41, livrees: 36 },
  { day: "Mar", creees: 52, livrees: 46 },
  { day: "Mer", creees: 45, livrees: 41 },
  { day: "Jeu", creees: 63, livrees: 58 },
  { day: "Ven", creees: 71, livrees: 65 },
  { day: "Sam", creees: 74, livrees: 68 },
  { day: "Dim", creees: 34, livrees: 30 },
];

export const statusSplit = [
  { name: "En attente", value: 6, color: "var(--neutral)" },
  { name: "Assignées", value: 12, color: "var(--warning)" },
  { name: "En cours", value: 14, color: "var(--brand)" },
  { name: "Livrées", value: 34, color: "var(--success)" },
  { name: "Annulées", value: 4, color: "var(--muted-foreground)" },
  { name: "Litiges", value: 2, color: "var(--danger)" },
];

export const revenueSeries = [
  { day: "Lun", ca: 312000 },
  { day: "Mar", ca: 398000 },
  { day: "Mer", ca: 341000 },
  { day: "Jeu", ca: 482000 },
  { day: "Ven", ca: 561000 },
  { day: "Sam", ca: 604000 },
  { day: "Dim", ca: 248000 },
];

export const zoneVolumes = [
  { zone: "Agoè", courses: 62 },
  { zone: "Tokoin", courses: 54 },
  { zone: "Bè", courses: 48 },
  { zone: "Lomé Centre", courses: 71 },
  { zone: "Adidogomé", courses: 39 },
  { zone: "Hedzranawoé", courses: 31 },
  { zone: "Aéroport", courses: 24 },
];

export const kmPricing = [
  { range: "1 – 5 km", formula: "300 FCFA + km × 100 FCFA", example: "3 km → 600 FCFA" },
  { range: "5 – 10 km", formula: "Forfait 1 000 FCFA", example: "8 km → 1 000 FCFA" },
  { range: "> 10 km", formula: "1 000 FCFA + km suppl. × 100 FCFA", example: "14 km → 1 400 FCFA" },
];

export const zonePricing = [
  { zone: "Lomé Centre", price: 1000, active: true },
  { zone: "Agoè", price: 1800, active: true },
  { zone: "Adidogomé", price: 1600, active: true },
  { zone: "Tokoin", price: 1200, active: true },
  { zone: "Bè", price: 1300, active: true },
  { zone: "Nyékonakpoè", price: 1100, active: true },
  { zone: "Hedzranawoé", price: 1500, active: true },
  { zone: "Kodjoviakopé", price: 1100, active: false },
  { zone: "Amoutivé", price: 1200, active: true },
  { zone: "Aéroport", price: 2500, active: true },
];

export const gpsHistory = [
  { at: "14:20", label: "Course acceptée", place: "Agoè-Assiyéyé", km: 0 },
  { at: "14:24", label: "Arrivée au pickup", place: "Restaurant Le Palais", km: 0.8 },
  { at: "14:27", label: "Colis récupéré", place: "Restaurant Le Palais", km: 0.8 },
  { at: "14:35", label: "En route", place: "Boulevard du 30 Août", km: 3.1 },
  { at: "14:42", label: "Position actuelle", place: "Rond-point Tokoin", km: 5.2 },
];

export const closing = {
  date: "01 septembre 2026",
  courses: 52,
  delivered: 47,
  cancelled: 3,
  disputes: 2,
  revenue: 785500,
  agencyShare: 157100,
  courierShare: 628400,
  commissions: 62000,
};

export const dues = {
  couriers: 320500,
  partners: 185000,
  commissions: 62000,
};

/* ---------- Helpers ---------- */

export const fcfa = (n: number) => `${n.toLocaleString("fr-FR").replace(/\u202f|,/g, " ")} FCFA`;
export const num = (n: number) => n.toLocaleString("fr-FR").replace(/\u202f|,/g, " ");

export const courseStatusLabel: Record<CourseStatus, string> = {
  brouillon: "Brouillon",
  attente: "En attente",
  assignee: "Assignée",
  en_cours: "En cours",
  livree: "Livrée",
  annulee: "Annulée",
  litige: "Litige",
};

export const courierStatusLabel: Record<CourierStatus, string> = {
  disponible: "Disponible",
  livraison: "En livraison",
  pause: "En pause",
  incident: "Incident",
  hors_ligne: "Hors ligne",
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  attente: "En attente",
  paye: "Payé",
  echoue: "Échoué",
  rembourse: "Remboursé",
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  especes: "Espèces",
  tmoney: "TMoney",
  flooz: "Flooz",
};

export const getPartner = (id: string) => partners.find((p) => p.id === id);
export const getCourier = (id?: string | null) =>
  id ? couriers.find((c) => c.id === id) : undefined;
export const getAgency = (id: string) => agencies.find((a) => a.id === id);
export const getCourse = (id: string) => courses.find((c) => c.id === id);
export const getSalesRep = (id: string) => salesReps.find((s) => s.id === id);

/** Suggestions de dispatch (score = distance + disponibilité + charge + zone). */
export const dispatchSuggestions = (courseId: string) => {
  const course = getCourse(courseId);
  const pool = couriers.filter((c) => c.status !== "hors_ligne");
  return pool
    .map((c) => {
      const dx = (c.point.x - (course?.pickup.x ?? 50)) / 10;
      const dy = (c.point.y - (course?.pickup.y ?? 50)) / 10;
      const distance = Math.max(0.6, Math.round(Math.hypot(dx, dy) * 12) / 10);
      const availability = c.status === "disponible" ? 40 : c.status === "pause" ? 22 : 12;
      const load = Math.max(0, 20 - c.coursesToday * 2);
      const zone = c.zone === course?.pickup.label ? 20 : 8;
      const proximity = Math.max(0, 20 - distance * 2);
      return {
        courier: c,
        distance,
        etaMin: Math.max(3, Math.round(distance * 3.4)),
        score: Math.min(99, Math.round(availability + load + zone + proximity)),
        reasons: { distance, availability, load, zone },
      };
    })
    .sort((a, b) => b.score - a.score);
};
