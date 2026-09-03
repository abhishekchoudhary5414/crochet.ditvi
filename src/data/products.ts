

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  images: string[];
  description: string;
  details: string[];
  materials: string[];
  careInstructions: string[];
  sizes: string[];
  colors: ProductColor[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  reviews: Review[];
}

export const products: Product[] = [
  {
    id: "prod-hair-clip",
    name: "Blossom Crochet Tote Bag",
    slug: "blossom-crochet-tote-bag",
    price: 1,
    originalPrice: 49.99,
    rating: 4.8,
    reviewCount: 34,
    category: "crochet-bags",
    images: [
      "/products/hair/clip/yellow.png",
    ],
    description: "Our signature blossom tote bag is tightly hand-stitched for maximum durability and strength. Featuring a delicate floral granny square pattern, it adds a touch of bohemian elegance to any outfit. Roomy enough for your tablet, wallet, book, and daily essentials.",
    details: [
      "Dimensions: 14\" x 12\" (Strap drop: 11\")",
      "Features a soft inner fabric lining to prevent stretching",
      "Includes an inner pocket with a wooden button closure",
      "100% handmade with tight double-crochet stitches"
    ],
    materials: ["100% Organic Premium Cotton Yarn", "Breathable Linen Lining", "Eco-friendly Wooden Button"],
    careInstructions: [
      "Hand wash gently in lukewarm water with mild detergent",
      "Do not wring or twist; lay flat on a clean dry towel to dry",
      "Reshape while damp if necessary",
      "Avoid direct bleach or tumble dryers"
    ],
    sizes: ["Standard"],
    colors: [
      { name: "Yellow", hex: "#F9B900", image: "/products/hair/clip/yellow.png" },
      { name: "Red", hex: "#D9162C", image: "/products/hair/clip/red.png" },
    ],
    isBestSeller: true,
    isNewArrival: false,
    stockStatus: "in_stock",
    reviews: [
      { id: "r1", name: "Aisha M.", rating: 5, date: "2026-08-15", comment: "Absolutely gorgeous bag! The craftsmanship is incredible and the lining is very sturdy. I get compliments everywhere I go!" },
      { id: "r2", name: "Meera K.", rating: 4, date: "2026-08-02", comment: "Very cute bag, perfect for summer outings. The color is exactly as pictured." }
    ]
  },
  {
    id: "prod-daisy-bouquet",
    name: "Classic Daisy & Tulip Bouquet",
    slug: "classic-daisy-tulip-bouquet",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.9,
    reviewCount: 42,
    category: "crochet-flowers",
    images: [
      "/products/hair/clip/4clip.png",
    ],
    description: "An everlasting bouquet of handmade daisies and tulips. Crafted with vibrant milk cotton yarn, these flowers will never fade or wither. They are wrapped in lovely premium craft paper, ready to be gifted to someone special.",
    details: [
      "Includes 3 Daisies, 2 Tulips, and 2 Eucalyptus leaf stems",
      "Length: Approximately 12 inches per stem",
      "Flexible metal wire inside the stems allows you to bend and arrange them easily",
      "Beautifully pre-wrapped in premium wrapping paper with a pink ribbon"
    ],
    materials: ["80% Milk Cotton Yarn", "20% Acrylic Fibers", "Flexible Florist Wire Stems"],
    careInstructions: [
      "Use a soft brush or hairdryer on a cool/low setting to gently blow off dust",
      "Keep away from water and damp places to preserve shape",
      "Do not wash"
    ],
    sizes: ["Standard"],
    colors: [
      // { name: "Sunset Pastel", hex: "#FFE0B2" },
    ],
    isBestSeller: true,
    isNewArrival: false,
    stockStatus: "in_stock",
    reviews: [
      { id: "r3", name: "Priya R.", rating: 5, date: "2026-08-20", comment: "Bought this as a birthday gift for my mother. She loved it! They look so cozy on her coffee table." },
      { id: "r4", name: "Rohan T.", rating: 5, date: "2026-08-11", comment: "Amazing quality. Stitches are neat, and wrapping was beautiful. Highly recommend." }
    ]
  },
  {
    id: "prod-bee-keychain",
    name: "Happy Bumblebee Keychain",
    slug: "happy-bumblebee-keychain",
    price: 8.99,
    rating: 4.7,
    reviewCount: 56,
    category: "crochet-keychains",
    images: [
      "/products/flower/mariegold.png",
    ],
    description: "Say hello to your new pocket companion! This chubby little bumblebee is crocheted by hand using super-soft chenille yarn, giving it a fluffy, velvet-like texture. Equipped with a sturdy silver keyring.",
    details: [
      "Size: 2.5\" wide x 2\" high",
      "Made with safety eyes securely fastened (adult supervision advised for kids under 3)",
      "Filled with premium hypoallergenic polyester fiberfill",
      "Includes a sturdy, rust-resistant metal keychain ring"
    ],
    materials: ["Super-soft Velvet Chenille Yarn", "Safety Eyes", "Hypoallergenic Polyester Fiberfill", "Stainless Steel Keyring"],
    careInstructions: [
      "Spot clean only with a damp cloth and mild soap",
      "Let air dry completely",
      "Do not machine wash"
    ],
    sizes: ["Mini (2.5 inches)"],
    colors: [
      { name: "Classic Yellow & Black", hex: "#FDD835" },
      { name: "Honey Pink & White", hex: "#F8BBD0" }
    ],
    isBestSeller: true,
    isNewArrival: false,
    stockStatus: "in_stock",
    reviews: [
      { id: "r5", name: "Ananya P.", rating: 5, date: "2026-08-22", comment: "So squishy and cute! Perfect size for my backpack zipper." }
    ]
  },
  {
    id: "prod-bunny-doll",
    name: "Bella the Bunny Doll",
    slug: "bella-the-bunny-doll",
    price: 29.99,
    originalPrice: 34.99,
    rating: 4.9,
    reviewCount: 28,
    category: "crochet-dolls",
    images: [
      "/products/flower/sunflower.png",
    ],
    description: "Meet Bella! She is a cute amigurumi bunny wearing a hand-knit pastel pinafore dress. With her long floppy ears and gentle blush cheeks, she makes a perfect keepsake gift for baby showers, nurseries, or collectors.",
    details: [
      "Height: 10 inches tall (including ears)",
      "Features embroidered nose and mouth, and safety eyes",
      "The pinafore dress is completely removable for dress-up play",
      "Handmade with love in a pet-free, smoke-free home"
    ],
    materials: ["100% Organic Milk Cotton Yarn", "Hypoallergenic Polyester Stuffing", "Safety Locking Eyes"],
    careInstructions: [
      "Place in a mesh laundry bag, wash on a delicate cycle in cold water",
      "Lay flat to dry; do not hang to dry as it might stretch",
      "Gently massage and reshape once dry"
    ],
    sizes: ["10 inches"],
    colors: [
      { name: "Snow White & Blush Dress", hex: "#FFF9FB" },
      { name: "Oatmeal Beige & Sage Dress", hex: "#E1D5D9" }
    ],
    isBestSeller: true,
    isNewArrival: false,
    stockStatus: "low_stock",
    reviews: [
      { id: "r6", name: "Kavya G.", rating: 5, date: "2026-07-28", comment: "Bella is even cuter in person! Stitches are so uniform and tight. My daughter won't go to sleep without her." }
    ]
  },
  {
    id: "prod-hair-scrunchies",
    name: "Floral Hair Claw & Scrunchie Set",
    slug: "floral-hair-claw-scrunchie-set",
    price: 14.99,
    rating: 4.6,
    reviewCount: 19,
    category: "crochet-accessories",
    images: [
      "/products/home/butterfly.png",
    ],
    description: "An elegant, feminine, and practical hair accessory bundle. The set includes a beautiful crochet flower hair claw clip and two matching ruffled pastel hair scrunchies. Soft on hair, avoiding snagging or headaches.",
    details: [
      "Includes 1 Flower Claw Clip and 2 Crochet Ruffle Scrunchies",
      "Flower size: 3\" wide on a heavy-duty matte pink hair claw",
      "Scrunchies are made over strong, high-elasticity hair bands",
      "Provides a cozy, vintage 90s aesthetic to your hairdos"
    ],
    materials: ["Soft Milk Cotton Yarn", "Durable Matte Plastic Claw Clip", "Heavy-duty Elastic Bands"],
    careInstructions: [
      "Gently hand wash scrunchies in cold water; dry flat",
      "For the claw clip, spot clean the crochet detailing with a damp cloth"
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Cherry Blossom Mix", hex: "#FCE4EC" },
      { name: "Lavender & Mint Mix", hex: "#E8F5E9" }
    ],
    isBestSeller: false,
    isNewArrival: true,
    stockStatus: "in_stock",
    reviews: [
      { id: "r7", name: "Simran H.", rating: 4, date: "2026-08-18", comment: "Really nice set! The scrunchies are thick and hold my thick hair up well. The flower clip is super adorable." }
    ]
  },
  {
    id: "prod-cable-cushion",
    name: "Cozy Cable Knit Cushion Cover",
    slug: "cozy-cable-knit-cushion-cover",
    price: 34.99,
    rating: 4.7,
    reviewCount: 15,
    category: "crochet-home-decor",
    images: [
      "/products/hair/clip/red.png"
    ],
    description: "Wrap your cushions in warmth! This cushion cover features a classic thick cable knit texture on the front and a durable canvas back with an invisible zipper. Brings a warm, rustic, and handmade look to your living room sofa or bed.",
    details: [
      "Dimensions: 18\" x 18\" (Fits standard insert cushions)",
      "Backing: Premium soft cream canvas fabric",
      "Invisible zipper closure for a clean, seamless look",
      "Please note: Insert cushion is not included"
    ],
    materials: ["Thick Acrylic Yarn blend", "Premium Cotton Canvas back", "YKK Invisible Zipper"],
    careInstructions: [
      "Turn inside out, hand wash or machine wash on a cold, gentle cycle",
      "Lay flat to dry; do not iron"
    ],
    sizes: ["18\" x 18\"", "20\" x 20\""],
    colors: [
      { name: "Creamy Ivory", hex: "#FFFDF9" },
      { name: "Oatmeal Melange", hex: "#ECE0D1" },
      { name: "Soft Mauve", hex: "#D7CCC8" }
    ],
    isBestSeller: false,
    isNewArrival: true,
    stockStatus: "in_stock",
    reviews: [
      { id: "r8", name: "Neha T.", rating: 5, date: "2026-08-05", comment: "Gorgeous stitch work. It is very thick and feels like an expensive sweater for my throw pillows. I will buy another!" }
    ]
  },
  {
    id: "prod-baby-giftbox",
    name: "Welcome Baby Gift Bundle",
    slug: "welcome-baby-gift-bundle",
    price: 49.99,
    originalPrice: 59.99,
    rating: 5.0,
    reviewCount: 12,
    category: "crochet-gifts",
    images: [
      "/products/hair/1.png"
    ],
    description: "The ultimate handcrafted welcome kit for newborns. This gift set is thoughtfully curated with items designed for delicate baby skin. Perfect for baby showers, gender reveals, or new parent gifts.",
    details: [
      "Includes: 1 Crochet Deer Rattle Toy, 1 Soft Baby Bonnet (0-3m), 1 Pair of Baby Booties, and 1 Wooden teething ring",
      "Deer rattle contains a soft, pleasing bell sound to stimulate baby's senses",
      "Bonnet and booties are soft, stretchy, and breathable",
      "Shipped in an eco-friendly gift box with wood wool and a hand-written greeting card"
    ],
    materials: ["100% Organic Bamboo-Cotton Yarn", "Natural Beechwood Teething Ring", "Hypoallergenic filling"],
    careInstructions: [
      "Deer Rattle: Hand wash and air dry only",
      "Bonnet & Booties: Hand wash or machine wash cold in a delicates bag; lay flat to dry",
      "Teething ring: Wipe with a damp cloth; do not submerge beechwood in water"
    ],
    sizes: ["0-3 Months", "3-6 Months"],
    colors: [
      { name: "Sweet Peach & Fawn", hex: "#FFD8B3" },
      { name: "Sage Green & Bunny", hex: "#E8F5E9" }
    ],
    isBestSeller: false,
    isNewArrival: true,
    stockStatus: "in_stock",
    reviews: [
      { id: "r9", name: "Ishita P.", rating: 5, date: "2026-08-25", comment: "Every piece is absolutely perfect. The bonnet is super soft and the deer rattle is adorable. The packaging was beautiful too!" }
    ]
  },
  {
    id: "prod-custom-pet",
    name: "Custom Crochet Pet Portrait (Amigurumi)",
    slug: "custom-crochet-pet-portrait",
    price: 45.00,
    rating: 5.0,
    reviewCount: 38,
    category: "custom-crochet",
    images: [
      "/products/hair/hairdecorate.png",
    ],
    description: "Turn your beloved furry friend into a cute pocket-sized crochet buddy! Provide us with a few pictures of your pet, and our master makers will design a custom amigurumi figure capturing their unique spots, collar, and posture.",
    details: [
      "Height: 4.5\" to 5.5\" tall depending on the animal",
      "Includes customized details: spots, markings, breed characteristics, and collar",
      "Process: After ordering, you will upload/email pictures of your pet. Production takes 5-7 days before dispatch.",
      "Comes with a tiny customizable name plate"
    ],
    materials: ["Premium Milk Cotton Yarn", "Secured Safety Eyes", "Polyester fiberfill", "Love and patience"],
    careInstructions: [
      "Spot clean with cold water and mild soap when dirty",
      "Do not submerge in water"
    ],
    sizes: ["Standard Portrait (approx. 5 inches)"],
    colors: [
      { name: "Custom Mix (Based on Photos)", hex: "#D7CCC8" }
    ],
    isBestSeller: false,
    isNewArrival: true,
    stockStatus: "in_stock",
    reviews: [
      { id: "r10", name: "Arjun D.", rating: 5, date: "2026-08-10", comment: "I am amazed by the resemblance! They captured my pug Waffles' cute little black ears and curly tail perfectly. Thank you!" }
    ]
  },
  {
    id: "prod-granny-sling",
    name: "Granny Square Sling Bag",
    slug: "granny-square-sling-bag",
    price: 32.50,
    originalPrice: 38.00,
    rating: 4.7,
    reviewCount: 22,
    category: "crochet-bags",
    images: [
      "/products/hand/balla.png"
    ],
    description: "Add a retro touch to your wardrobe with our vintage-inspired Granny Square Sling Bag. Hand-crocheted using earthy pastel shades, it is lightweight, comfortable, and perfect for carrying your phone, cards, lip balm, and keys.",
    details: [
      "Dimensions: 8.5\" x 8\" (Strap length: 44\" crossbody)",
      "Secure zipper closure across the top",
      "Lined with a thick cream canvas fabric to protect items and maintain shape",
      "Features a sweet tassel charm detail on the side"
    ],
    materials: ["100% Mercerized Cotton Yarn", "Canvas Fabric Lining", "Brass Zip Closure"],
    careInstructions: [
      "Hand wash cold, reshape, and flat dry.",
      "Do not dry clean or tumble dry."
    ],
    sizes: ["One Size (Crossbody)"],
    colors: [
      { name: "Retro Earth", hex: "#D7CCC8" },
      { name: "Pastel Meadow", hex: "#FFF9FB" }
    ],
    isBestSeller: false,
    isNewArrival: true,
    stockStatus: "in_stock",
    reviews: [
      { id: "r11", name: "Diya S.", rating: 5, date: "2026-08-14", comment: "Perfect crossbody bag for festivals and daily errands. The colors are beautiful and the strap is the perfect length." }
    ]
  },
  {
    id: "prod-tulip-lamp",
    name: "Enchanted Tulip Night Light",
    slug: "enchanted-tulip-night-light",
    price: 27.99,
    rating: 4.9,
    reviewCount: 31,
    category: "crochet-flowers",
    images: [
      "/products/home/homeflower.png"
    ],
    description: "A gorgeous handmade crochet tulip night light. The stems feature tiny integrated warm LED string lights that shine softly through the knit petals, creating an enchanted, fairy-tale glow on your nightstand. Batteries are included.",
    details: [
      "Includes 2 Crochet Tulips with built-in warm fairy LED lights",
      "Height: 8.5 inches",
      "Mounted on a rustic natural round wooden base under a acrylic dome",
      "Powered by 3 AAA batteries (included) with an on/off switch at the base"
    ],
    materials: ["Soft Milk Cotton Yarn", "LED Copper Fairy Lights", "Natural Wood Base", "Acrylic Protection Dome"],
    careInstructions: [
      "Wipe the outer dome with a microfibre cloth",
      "Keep away from water or high humidity"
    ],
    sizes: ["Standard Dome (8.5\" x 4.5\")"],
    colors: [
      { name: "Warm Yellow Tulip", hex: "#FFF59D" },
      { name: "Blush Pink Tulip", hex: "#F8BBD0" },
      { name: "Soft Lilac Tulip", hex: "#E1BEE7" }
    ],
    isBestSeller: true,
    isNewArrival: false,
    stockStatus: "in_stock",
    reviews: [
      { id: "r12", name: "Sanjana M.", rating: 5, date: "2026-08-20", comment: "I am absolutely in love with this lamp! It looks so dreamy on my desk at night. The glow is very soft and warm." }
    ]
  },
  {
    id: "prod-sprout-keychain",
    name: "Leafy Sprout Headphone Organizer",
    slug: "leafy-sprout-headphone-organizer",
    price: 6.99,
    rating: 4.8,
    reviewCount: 45,
    category: "crochet-keychains",
    images: [
      "/products/hand/balla.png"
    ],
    description: "A cute little sprout leaf that wraps around your headphones, charging cables, or bags. Inspired by anime 'little green sprouts', it is a quick and simple way to keep your cords tidy or add a charming, playful green touch to your daily accessories.",
    details: [
      "Length: 6 inches total",
      "Features a simple loop and leaf tie closure",
      "Multi-purpose: works as a cable organizer, bookmark, car mirror hanger, or plant tie"
    ],
    materials: ["Eco-cotton Yarn"],
    careInstructions: ["Machine wash cold in a mesh bag; air dry."],
    sizes: ["Standard (6 inches)"],
    colors: [
      { name: "Fresh Grass Green", hex: "#81C784" },
      { name: "Matcha Sage Green", hex: "#C8E6C9" }
    ],
    isBestSeller: false,
    isNewArrival: true,
    stockStatus: "in_stock",
    reviews: [
      { id: "r13", name: "Vedant L.", rating: 5, date: "2026-08-24", comment: "Bought this for my workspace. It wraps around my monitor stand and makes me smile when I look at it!" }
    ]
  },
  {
    id: "prod-moon-mobile",
    name: "Dreamy Moon & Stars Baby Mobile",
    slug: "dreamy-moon-stars-baby-mobile",
    price: 42.50,
    originalPrice: 48.00,
    rating: 4.9,
    reviewCount: 16,
    category: "crochet-home-decor",
    images: [
      "/products/flower/root.png"
    ],
    description: "Help your little one drift into sweet dreams with this baby mobile. Features a central sleepy crescent moon, surrounded by 4 soft stars and fluffy white clouds hanging from a light bamboo ring. Entirely handcrafted with organic cotton.",
    details: [
      "Features: 1 Sleepy Moon, 4 Stars, 3 Clouds, and 12 wooden felt ball accents",
      "Hangs from a 9\" natural bamboo circular frame",
      "Total hanging length: Approximately 18 inches from loop to lowest star",
      "Hanging loop is pre-made. Crib attachment arm is not included"
    ],
    materials: ["100% Organic Cotton Yarn", "Felt and Wool balls", "Hypoallergenic fiberfill", "Natural Bamboo Ring"],
    careInstructions: [
      "Dust lightly with a soft brush",
      "Do not wash; avoid high moisture/damp rooms"
    ],
    sizes: ["Standard (9\" x 18\")"],
    colors: [
      { name: "Dreamy Neutral Pastel", hex: "#FFF9FB" },
      { name: "Night Sky Blue & Silver", hex: "#ECEFF1" }
    ],
    isBestSeller: false,
    isNewArrival: true,
    stockStatus: "low_stock",
    reviews: [
      { id: "r14", name: "Pooja T.", rating: 5, date: "2026-08-11", comment: "Absolutely beautiful work. It coordinates perfectly with our neutral nursery theme. Very delicate and gorgeous." }
    ]
  }
];
