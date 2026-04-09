function buildSeedRating(userId, userName, rating, comment, createdAt) {
  return {
    id: `rating-${userId}`,
    userId,
    userName,
    rating,
    comment,
    createdAt,
    updatedAt: createdAt,
  };
}

function getSeedRatings(eventId) {
  switch (eventId) {
    case "evt-afterglow-live":
      return [
        buildSeedRating(
          "seed-user-anaya",
          "Anaya",
          5,
          "Sound was excellent and the whole night felt well run. I would absolutely go again.",
          "2026-03-14T19:00:00.000Z",
        ),
        buildSeedRating(
          "seed-user-vir",
          "Vir",
          4,
          "Big crowd and a really fun set. Check-in was a little slow, but the show itself was worth it.",
          "2026-03-20T12:30:00.000Z",
        ),
      ];
    case "evt-founder-forge":
      return [
        buildSeedRating(
          "seed-user-riya",
          "Riya",
          5,
          "Good speakers, useful conversations, and enough time to actually meet people instead of rushing between sessions.",
          "2026-03-19T10:45:00.000Z",
        ),
      ];
    case "evt-sunset-food-market":
      return [
        buildSeedRating(
          "seed-user-kabir",
          "Kabir",
          4,
          "Nice mix of stalls, good music, and enough options for a group with different tastes.",
          "2026-03-28T17:15:00.000Z",
        ),
      ];
    default:
      return [];
  }
}

export const seedEvents = [
  {
    id: "evt-afterglow-live",
    title: "Afterglow Arena Live",
    categoryId: "concerts",
    categoryName: "Concerts",
    date: "Jul 19, 2026",
    time: "18:30 - 23:00",
    city: "Mumbai",
    venue: "NSCI Dome",
    price: 2199,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80",
    description:
      "A big electronic music night with guest sets, strong visuals, and the kind of crowd that shows up early and stays late.",
    lat: 19.0186,
    lng: 72.8295,
  },
  {
    id: "evt-founder-forge",
    title: "Founder Forge Summit",
    categoryId: "business",
    categoryName: "Business",
    date: "Aug 08, 2026",
    time: "09:00 - 18:30",
    city: "Bengaluru",
    venue: "KTPO Convention Centre",
    price: 3400,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    description:
      "A full-day founder gathering with product demos, investor sessions, and plenty of room for real conversations between talks.",
    lat: 12.9958,
    lng: 77.6963,
  },
  {
    id: "evt-sunset-food-market",
    title: "Sunset Street Food Market",
    categoryId: "exhibitions",
    categoryName: "Exhibitions",
    date: "Aug 24, 2026",
    time: "16:00 - 22:30",
    city: "Panaji",
    venue: "Miramar Beachfront Promenade",
    price: 499,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    description:
      "A beachfront evening with food stalls, chef pop-ups, acoustic sets, and enough variety to make wandering around part of the fun.",
    lat: 15.4845,
    lng: 73.807,
  },
  {
    id: "evt-midnight-design-week",
    title: "Midnight Design Week",
    categoryId: "workshops",
    categoryName: "Workshops",
    date: "Sep 12, 2026",
    time: "11:00 - 20:00",
    city: "New Delhi",
    venue: "Pragati Maidan Creative Hall",
    price: 1499,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    description:
      "A design-heavy day with talks, live critiques, installations, and a crowd that actually wants to discuss the work.",
    lat: 28.6177,
    lng: 77.2431,
  },
  {
    id: "evt-stadium-night-run",
    title: "City Lights 10K Night Run",
    categoryId: "sports",
    categoryName: "Sports",
    date: "Oct 03, 2026",
    time: "19:30 - 23:00",
    city: "Hyderabad",
    venue: "Outer Ring Road Race Village",
    price: 899,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=1600&q=80",
    description:
      "A night run through the city with pace groups, post-run recovery zones, and a lively finish area.",
    lat: 17.385,
    lng: 78.4867,
  },
  {
    id: "evt-neon-nights",
    title: "Neon Nights Music Festival",
    categoryId: "concerts",
    categoryName: "Concerts",
    date: "Aug 12, 2026",
    time: "19:00 - 23:30",
    city: "New Delhi",
    venue: "JLN Stadium",
    price: 1500,
    image:
      "https://images.unsplash.com/photo-1639323250828-8dc3d4386661?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwY29uY2VydCUyMGNyb3dkfGVufDF8fHx8MTc3NTY1MTA0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "A late-night music festival with DJs, lights, and a crowd that wants a full evening out.",
    lat: 28.5828,
    lng: 77.2343,
  },
  {
    id: "evt-global-hackathon",
    title: "Global Tech Hackathon '26",
    categoryId: "tech",
    categoryName: "Tech & Hackathons",
    date: "Sep 25, 2026",
    time: "48-Hour Event",
    city: "Bengaluru",
    venue: "BIEC Tech Park",
    price: 500,
    image:
      "https://images.unsplash.com/flagged/photo-1564445477052-8a3787406bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWNrYXRob24lMjBjb2RpbmclMjBuaWdodHxlbnwxfHx8fDE3NzU2NTEwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "Build for 48 hours, meet mentors, and see how far a good idea can go with the right team around it.",
    lat: 13.045,
    lng: 77.4646,
  },
  {
    id: "evt-laugh-riot",
    title: "Laugh Riot Standup Tour",
    categoryId: "comedy",
    categoryName: "Comedy",
    date: "Oct 05, 2026",
    time: "20:00 - 22:00",
    city: "Mumbai",
    venue: "NCPA Auditorium",
    price: 999,
    image:
      "https://images.unsplash.com/photo-1762537132884-cc6bbde0667a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZHVwJTIwY29tZWR5JTIwc3RhZ2V8ZW58MXx8fHwxNzc1NjUxMDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description:
      "A stand-up night with touring comics, short sets, and the kind of room where every laugh carries.",
    lat: 18.9256,
    lng: 72.8242,
  },
  {
    id: "evt-oasis-fest",
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
      "A college fest with performances, competitions, food, and enough going on that you can stay the whole day.",
    lat: 26.9124,
    lng: 75.7873,
  },
  {
    id: "evt-future-ai",
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
      "A practical conference focused on how AI is being used in real teams, products, and companies right now.",
    lat: 17.4727,
    lng: 78.3735,
  },
  {
    id: "evt-indie-showcase",
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
      "A smaller live music night built around independent artists and a crowd that actually listens.",
    lat: 12.9915,
    lng: 80.2166,
  },
  {
    id: "evt-uiux-masterclass",
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
      "A practical workshop on product design, from research and structure to cleaner interface decisions.",
    lat: 12.9723,
    lng: 77.6083,
  },
  {
    id: "evt-campus-creator-fair",
    title: "Campus Creator Fair",
    categoryId: "college",
    categoryName: "College Events",
    date: "Sep 18, 2026",
    time: "11:00 - 19:00",
    city: "Pune",
    venue: "Fergusson College Grounds",
    price: 299,
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    description:
      "A campus event with creator booths, short workshops, music corners, and plenty to wander through between sessions.",
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: "evt-makers-expo",
    title: "Makers and Robotics Expo",
    categoryId: "tech",
    categoryName: "Tech & Hackathons",
    date: "Oct 21, 2026",
    time: "10:00 - 18:00",
    city: "Chennai",
    venue: "Chennai Trade Centre",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
    description:
      "A robotics and maker expo with student builds, hardware demos, and tables where people actually explain what they made.",
    lat: 13.0103,
    lng: 80.1996,
  },
  {
    id: "evt-open-air-cinema",
    title: "Open Air Cinema Weekend",
    categoryId: "cultural",
    categoryName: "Cultural",
    date: "Nov 07, 2026",
    time: "17:30 - 23:00",
    city: "Jaipur",
    venue: "Amer Fort Lawns",
    price: 750,
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80",
    description:
      "An outdoor film night with food stalls, lawn seating, and the sort of easy pace that works well with friends.",
    lat: 26.9855,
    lng: 75.8513,
  },
].map((event) => ({
  ...event,
  ratings: getSeedRatings(event.id),
}));

export function buildSeedStore() {
  const timestamp = new Date().toISOString();

  return {
    users: [],
    events: seedEvents.map((event) => ({
      ...event,
      createdAt: timestamp,
      updatedAt: timestamp,
    })),
    meta: {
      initializedAt: timestamp,
      version: 4,
    },
  };
}
