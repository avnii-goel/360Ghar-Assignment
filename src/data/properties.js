const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop",  // modern apartment living room
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop",  // apartment interior
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop",  // bright apartment
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=500&fit=crop",  // kitchen interior
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop",  // bedroom
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop",  // living room
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=500&fit=crop",  // modern kitchen
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=500&fit=crop",  // house exterior
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop",  // house front
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop",  // luxury apartment
];

const RAW_PROPERTIES = [
  {
    id: "prop_1",
    title: "Luxury 3BHK in DLF Phase 1",
    bhk: 3,
    area: 2100,
    sector: "DLF Phase 1",
    locality: "DLF Phase 1, Gurgaon",
    price: 320,
    priceLabel: "₹3.20 Cr",
    amenities: ["gym", "pool", "security", "park", "clubhouse", "power_backup"],
    facing: "East",
    floor: 4,
    totalFloors: 12,
    imageIndex: 1,
    tags: ["Ready to Move", "Premium", "Vastu Compliant"],
    matchScore: 0,
    matchReasons: []
  },
  {
    id: "prop_2",
    title: "Spacious 2BHK in Sector 50",
    bhk: 2,
    area: 1250,
    sector: "Sector 50",
    locality: "Sector 50, Gurgaon",
    price: 115,
    priceLabel: "₹1.15 Cr",
    amenities: ["park", "security", "school_nearby", "market_nearby"],
    facing: "North",
    floor: 2,
    totalFloors: 4,
    imageIndex: 2,
    tags: ["Resale", "Gated Society"],
    matchScore: 0,
    matchReasons: []
  },
  {
    id: "prop_3",
    title: "Modern 1BHK Studio in Sector 82",
    bhk: 1,
    area: 650,
    sector: "Sector 82",
    locality: "Vatika India Next, Sector 82, Gurgaon",
    price: 48,
    priceLabel: "₹48 Lakhs",
    amenities: ["gym", "security", "pool", "market_nearby"],
    facing: "West",
    floor: 8,
    totalFloors: 14,
    imageIndex: 3,
    tags: ["Under Construction", "RERA Registered", "Investment Property"],
    matchScore: 0,
    matchReasons: []
  },
  {
    id: "prop_4",
    title: "Premium 3BHK in DLF Phase 4",
    bhk: 3,
    area: 1850,
    sector: "DLF Phase 4",
    locality: "DLF Phase 4, Gurgaon",
    price: 245,
    priceLabel: "₹2.45 Cr",
    amenities: ["metro", "gym", "security", "sunlight", "clubhouse"],
    facing: "South",
    floor: 5,
    totalFloors: 10,
    imageIndex: 4,
    tags: ["Ready to Move", "Near Metro", "Vastu Compliant"],
    matchScore: 0,
    matchReasons: []
  },
  {
    id: "prop_5",
    title: "Affordable 2BHK in Sector 56",
    bhk: 2,
    area: 1100,
    sector: "Sector 56",
    locality: "Sector 56, Gurgaon",
    price: 85,
    priceLabel: "₹85 Lakhs",
    amenities: ["security", "park", "sunlight", "market_nearby"],
    facing: "East",
    floor: 1,
    totalFloors: 3,
    imageIndex: 5,
    tags: ["Ready to Move", "Budget Friendly"],
    matchScore: 0,
    matchReasons: []
  },
  {
    id: "prop_6",
    title: "Luxury Builder Floor 3BHK in Sector 57",
    bhk: 3,
    area: 1600,
    sector: "Sector 57",
    locality: "Sector 57, Gurgaon",
    price: 155,
    priceLabel: "₹1.55 Cr",
    amenities: ["park", "security", "power_backup", "sunlight"],
    facing: "North",
    floor: 2,
    totalFloors: 4,
    imageIndex: 1,
    tags: ["New Property", "Builder Floor", "Corner Property"],
    matchScore: 0,
    matchReasons: []
  },
  {
    id: "prop_7",
    title: "Cozy 2BHK in DLF Phase 3",
    bhk: 2,
    area: 1200,
    sector: "DLF Phase 3",
    locality: "DLF Phase 3, Gurgaon",
    price: 95,
    priceLabel: "₹95 Lakhs",
    amenities: ["metro", "security", "sunlight", "park"],
    facing: "West",
    floor: 3,
    totalFloors: 5,
    imageIndex: 2,
    tags: ["Ready to Move", "Near Cyber City"],
    matchScore: 0,
    matchReasons: []
  },
  {
    id: "prop_8",
    title: "Spacious 3BHK Appt in Sector 52",
    bhk: 3,
    area: 1750,
    sector: "Sector 52",
    locality: "Sector 52, Gurgaon",
    price: 185,
    priceLabel: "₹1.85 Cr",
    amenities: ["gym", "pool", "security", "park", "power_backup", "school_nearby"],
    facing: "East",
    floor: 6,
    totalFloors: 15,
    imageIndex: 3,
    tags: ["Gated Society", "Premium", "Ready to Move"],
    matchScore: 0,
    matchReasons: []
  },
  {
    id: "prop_9",
    title: "Well-Maintained 1BHK in Sector 48",
    bhk: 1,
    area: 750,
    sector: "Sector 48",
    locality: "Sohna Road, Sector 48, Gurgaon",
    price: 55,
    priceLabel: "₹55 Lakhs",
    amenities: ["security", "park", "market_nearby", "gym"],
    facing: "North",
    floor: 4,
    totalFloors: 8,
    imageIndex: 4,
    tags: ["Resale", "Prime Location"],
    matchScore: 0,
    matchReasons: []
  },
  {
    id: "prop_10",
    title: "Luxury 3BHK Penthouse in Sector 83",
    bhk: 3,
    area: 2500,
    sector: "Sector 83",
    locality: "Sector 83, Gurgaon",
    price: 220,
    priceLabel: "₹2.20 Cr",
    amenities: ["gym", "pool", "security", "park", "clubhouse", "power_backup", "sunlight"],
    facing: "East",
    floor: 20,
    totalFloors: 20,
    imageIndex: 5,
    tags: ["Penthouse", "Luxury", "Top Floor", "RERA Registered"],
    matchScore: 0,
    matchReasons: []
  }
];

export const PROPERTIES = RAW_PROPERTIES.map((prop, i) => ({
  ...prop,
  image: PROPERTY_IMAGES[i % PROPERTY_IMAGES.length],
  images: [
    PROPERTY_IMAGES[i % PROPERTY_IMAGES.length],
    PROPERTY_IMAGES[(i + 1) % PROPERTY_IMAGES.length],
    PROPERTY_IMAGES[(i + 2) % PROPERTY_IMAGES.length],
  ]
}));
