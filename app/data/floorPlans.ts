export interface FloorPlanRoom {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  fontSize: number;
}

export interface FloorPlan {
  title: string;
  price: string;
  badge: string;
  badgeColor: string;
  beds: number;
  baths: number;
  sqft: string;
  meta: string;
  svgRooms: FloorPlanRoom[];
}

export const floorPlans: FloorPlan[] = [
  {
    title: "The Terrace",
    price: "₹85L",
    badge: "Popular",
    badgeColor: "border-sage/50 bg-sage/10 text-sage",
    beds: 2,
    baths: 2,
    sqft: "1,250",
    meta: "2 Bed · 2 Bath · 1,250 sqft",
    svgRooms: [
      { x: 6,   y: 6,   w: 138, h: 98,  label: "Living & Dining", fontSize: 8 },
      { x: 6,   y: 104, w: 72,  h: 50,  label: "Kitchen",         fontSize: 7 },
      { x: 78,  y: 104, w: 66,  h: 50,  label: "Foyer",           fontSize: 7 },
      { x: 144, y: 6,   w: 90,  h: 78,  label: "Master Bed",      fontSize: 7.5 },
      { x: 144, y: 84,  w: 44,  h: 70,  label: "En-Suite",        fontSize: 6.5 },
      { x: 188, y: 84,  w: 46,  h: 70,  label: "Bedroom 2",       fontSize: 6.5 },
    ],
  },
  {
    title: "The Courtyard",
    price: "₹1.2Cr",
    badge: "Best Value",
    badgeColor: "border-clay/50 bg-clay/10 text-clay",
    beds: 3,
    baths: 2,
    sqft: "1,680",
    meta: "3 Bed · 2 Bath · 1,680 sqft",
    svgRooms: [
      { x: 6,   y: 6,   w: 126, h: 84,  label: "Living & Dining", fontSize: 8 },
      { x: 6,   y: 90,  w: 68,  h: 64,  label: "Kitchen",         fontSize: 7 },
      { x: 74,  y: 90,  w: 58,  h: 64,  label: "Utility",         fontSize: 7 },
      { x: 132, y: 6,   w: 102, h: 58,  label: "Master Bed",      fontSize: 7.5 },
      { x: 132, y: 64,  w: 52,  h: 90,  label: "Bedroom 2",       fontSize: 7 },
      { x: 184, y: 64,  w: 50,  h: 50,  label: "Bedroom 3",       fontSize: 7 },
      { x: 184, y: 114, w: 50,  h: 40,  label: "Bath",            fontSize: 6.5 },
    ],
  },
  {
    title: "The Penthouse",
    price: "₹2.1Cr",
    badge: "Premium",
    badgeColor: "border-terracotta/50 bg-terracotta/10 text-terracotta",
    beds: 4,
    baths: 3,
    sqft: "2,400",
    meta: "4 Bed · 3 Bath · 2,400 sqft",
    svgRooms: [
      { x: 6,   y: 6,   w: 112, h: 74,  label: "Living Area",     fontSize: 7.5 },
      { x: 6,   y: 80,  w: 64,  h: 56,  label: "Kitchen",         fontSize: 7 },
      { x: 70,  y: 80,  w: 48,  h: 56,  label: "Study",           fontSize: 7 },
      { x: 6,   y: 136, w: 112, h: 18,  label: "Dining",          fontSize: 6 },
      { x: 118, y: 6,   w: 116, h: 58,  label: "Master Bed",      fontSize: 7.5 },
      { x: 118, y: 64,  w: 44,  h: 90,  label: "Master Bath",     fontSize: 6.5 },
      { x: 162, y: 64,  w: 72,  h: 48,  label: "Bedroom 2",       fontSize: 7 },
      { x: 162, y: 112, w: 72,  h: 42,  label: "Bedroom 3",       fontSize: 7 },
      { x: 118, y: 136, w: 44,  h: 18,  label: "WC",              fontSize: 5.5 },
      { x: 118, y: 112, w: 44,  h: 24,  label: "Bed 4",           fontSize: 6.5 },
    ],
  },
];
