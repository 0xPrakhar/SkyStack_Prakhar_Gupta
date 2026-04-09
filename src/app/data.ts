<<<<<<< HEAD
<<<<<<< HEAD
export const CITIES = [
  "New Delhi",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Jaipur",
  "Lucknow",
  "Bhopal",
  "Patna",
  "Thiruvananthapuram",
  "Gandhinagar",
  "Chandigarh",
  "Bhubaneswar",
  "Dehradun",
  "Dispur",
  "Ranchi",
  "Raipur",
  "Amaravati",
  "Panaji",
  "Shimla",
  "Srinagar",
  "Jammu",
  "Gangtok",
  "Agartala",
  "Aizawl",
  "Imphal",
  "Shillong",
  "Kohima",
  "Itanagar",
];

export const CATEGORIES = [
  { id: "all", name: "All Events", icon: "🌐" },
  { id: "college", name: "College Events", icon: "🎓" },
  { id: "concerts", name: "Concerts", icon: "🎵" },
  { id: "tech", name: "Tech & Hackathons", icon: "💻" },
  { id: "workshops", name: "Workshops", icon: "🛠️" },
  { id: "sports", name: "Sports", icon: "⚽" },
  { id: "comedy", name: "Comedy", icon: "😂" },
  { id: "cultural", name: "Cultural", icon: "🎭" },
  { id: "business", name: "Business", icon: "🚀" },
  { id: "exhibitions", name: "Exhibitions", icon: "🏛️" },
];

export const HERO_BANNERS = [
  {
    id: "b1",
    title: "NEON NIGHTS MUSIC FESTIVAL",
    category: "Concerts",
    date: "12 Aug • New Delhi",
    image:
      "https://images.unsplash.com/photo-1639323250828-8dc3d4386661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY29uY2VydCUyMGNyb3dkfGVufDF8fHx8MTc3NTY1MTA0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    link: "/event/1",
  },
  {
    id: "b2",
    title: "GLOBAL TECH HACKATHON '26",
    category: "Tech & Hackathons",
    date: "25 Sep • Bengaluru",
    image:
      "https://images.unsplash.com/flagged/photo-1564445477052-8a3787406bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWNrYXRob24lMjBjb2RpbmclMjBuaWdodHxlbnwxfHx8fDE3NzU2NTEwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    link: "/event/2",
  },
  {
    id: "b3",
    title: "LAUGH RIOT STANDUP TOUR",
    category: "Comedy",
    date: "05 Oct • Mumbai",
    image:
      "https://images.unsplash.com/photo-1762537132884-cc6bbde0667a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZHVwJTIwY29tZWR5JTIwc3RhZ2V8ZW58MXx8fHwxNzc1NjUxMDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    link: "/event/3",
  },
];

export const EVENTS = [
  {
    id: "1",
    title: "Neon Nights Music Festival",
    categoryId: "concerts",
    categoryName: "Concerts",
    date: "Aug 12, 2026",
    time: "19:00 - 23:30",
    city: "New Delhi",
    venue: "JLN Stadium",
    price: 1500,
    image: HERO_BANNERS[0].image,
    description:
      "Experience the ultimate audio-visual spectacle with top international DJs and glowing neon installations. Don't miss the most anticipated concert of the year.",
    lat: 28.5828,
    lng: 77.2343,
  },
  {
    id: "2",
    title: "Global Tech Hackathon '26",
    categoryId: "tech",
    categoryName: "Tech & Hackathons",
    date: "Sep 25, 2026",
    time: "48-Hour Event",
    city: "Bengaluru",
    venue: "BIEC Tech Park",
    price: 500,
    image: HERO_BANNERS[1].image,
    description:
      "Build the future in 48 hours. Compete with top developers, meet industry leaders, and win prizes worth ₹10 Lakhs.",
    lat: 13.045,
    lng: 77.4646,
  },
  {
    id: "3",
    title: "Laugh Riot Standup Tour",
    categoryId: "comedy",
    categoryName: "Comedy",
    date: "Oct 05, 2026",
    time: "20:00 - 22:00",
    city: "Mumbai",
    venue: "NCPA Auditorium",
    price: 999,
    image: HERO_BANNERS[2].image,
    description:
      "An evening of non-stop laughter featuring the finest stand-up comics in the country. Book early, seats fill fast!",
    lat: 18.9256,
    lng: 72.8242,
  },
  {
    id: "4",
    title: "Oasis Cultural Fest",
    categoryId: "cultural",
    categoryName: "Cultural",
    date: "Nov 15, 2026",
    time: "All Day",
    city: "Jaipur",
    venue: "BITS Pilani Campus",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1657822240797-c59f69090bf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY3VsdHVyYWwlMjBmZXN0fGVufDF8fHx8MTc3NTY1MTA0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "India's largest college cultural festival. Dance, music, drama, and endless memories.",
    lat: 26.9124,
    lng: 75.7873,
  },
  {
    id: "5",
    title: "Future of AI Conference",
    categoryId: "business",
    categoryName: "Business",
    date: "Dec 10, 2026",
    time: "09:00 - 18:00",
    city: "Hyderabad",
    venue: "HICC",
    price: 2500,
    image:
      "https://images.unsplash.com/photo-1775050151218-00683cb2e6b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGNvbmZlcmVuY2UlMjBtb2Rlcm58ZW58MXx8fHwxNzc1NjUxMDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Join leading minds in Artificial Intelligence discussing enterprise adoption, ethics, and future trends.",
    lat: 17.4727,
    lng: 78.3735,
  },
  {
    id: "6",
    title: "Indie Music Showcase",
    categoryId: "concerts",
    categoryName: "Concerts",
    date: "Aug 20, 2026",
    time: "18:00 - 22:00",
    city: "Chennai",
    venue: "Phoenix Marketcity Courtyard",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1639323250828-8dc3d4386661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY29uY2VydCUyMGNyb3dkfGVufDF8fHx8MTc3NTY1MTA0NHww&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Discover fresh sounds from upcoming indie bands across the country.",
    lat: 12.9915,
    lng: 80.2166,
  },
  {
    id: "7",
    title: "UI/UX Masterclass",
    categoryId: "workshops",
    categoryName: "Workshops",
    date: "Sep 05, 2026",
    time: "10:00 - 16:00",
    city: "Bengaluru",
    venue: "WeWork Galaxy",
    price: 1200,
    image:
      "https://images.unsplash.com/flagged/photo-1564445477052-8a3787406bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWNrYXRob24lMjBjb2RpbmclMjBuaWdodHxlbnwxfHx8fDE3NzU2NTEwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description:
      "Hands-on workshop on designing modern, minimal interfaces for web and mobile.",
    lat: 12.9723,
    lng: 77.6083,
  },
];
=======
=======
>>>>>>> e91372e (initial commit)
import { INDIA_CITY_LOCATIONS } from "./lib/india-locations";

export const CITIES = INDIA_CITY_LOCATIONS.map((location) => location.city);

export const CATEGORIES = [
  { id: "all", name: "All Events", icon: "*" },
  { id: "college", name: "College Events", icon: "U" },
  { id: "concerts", name: "Concerts", icon: "M" },
  { id: "tech", name: "Tech & Hackathons", icon: "T" },
  { id: "workshops", name: "Workshops", icon: "W" },
  { id: "sports", name: "Sports", icon: "S" },
  { id: "comedy", name: "Comedy", icon: "J" },
  { id: "cultural", name: "Cultural", icon: "A" },
  { id: "business", name: "Business", icon: "B" },
  { id: "exhibitions", name: "Exhibitions", icon: "E" },
];
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
