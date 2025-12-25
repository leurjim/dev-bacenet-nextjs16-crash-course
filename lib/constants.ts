export type Event = {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string; // ISO date (YYYY-MM-DD)
  time: string; // HH:mm
};

export const events: Event[] = [
  {
    title: "Café Aurora",
    image: "/images/event1.png",
    slug: "cafe-aurora",
    location: "València, España",
    date: "2026-02-14",
    time: "19:30",
  },
  {
    title: "Estudio Lúmina",
    image: "/images/event2.png",
    slug: "estudio-lumina",
    location: "Madrid, España",
    date: "2026-03-05",
    time: "09:00",
  },
  {
    title: "Mercado Central",
    image: "/images/event3.png",
    slug: "mercado-central",
    location: "Sevilla, España",
    date: "2026-04-18",
    time: "11:00",
  },
  {
    title: "Taller Verde",
    image: "/images/event4.png",
    slug: "taller-verde",
    location: "Bilbao, España",
    date: "2026-05-09",
    time: "16:00",
  },
  {
    title: "Agencia Nube",
    image: "/images/event5.png",
    slug: "agencia-nube",
    location: "Barcelona, España",
    date: "2026-06-21",
    time: "10:00",
  },
  {
    title: "Hotel Solaz",
    image: "/images/event6.png",
    slug: "hotel-solaz",
    location: "Mallorca, España",
    date: "2026-07-15",
    time: "20:00",
  },
];

export default events;
