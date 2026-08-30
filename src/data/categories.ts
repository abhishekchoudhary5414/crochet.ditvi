export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "cat-bags",
    name: "Crochet Bags",
    slug: "crochet-bags",
    description: "Chic, durable, and stylish handmade bags for your everyday essentials.",
    image: "https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-flowers",
    name: "Crochet Flowers",
    slug: "crochet-flowers",
    description: "Everlasting blooms that add warmth and color to any space, requiring no watering.",
    image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-keychains",
    name: "Crochet Keychains",
    slug: "crochet-keychains",
    description: "Adorable, bite-sized companions to carry your keys or adorn your backpacks.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-dolls",
    name: "Crochet Dolls",
    slug: "crochet-dolls",
    description: "Cute and cuddly amigurumi toys crafted with hypoallergenic yarn.",
    image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-accessories",
    name: "Crochet Accessories",
    slug: "crochet-accessories",
    description: "Cozy headbands, scrunchies, hats, and scarves to elevate your style.",
    image: "https://images.unsplash.com/photo-1575413829029-1bb393595e52?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-decor",
    name: "Crochet Home Decor",
    slug: "crochet-home-decor",
    description: "Coasters, table runners, and wall hangings that make a house feel like a home.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-gifts",
    name: "Crochet Gifts",
    slug: "crochet-gifts",
    description: "Thoughtfully packaged, custom gift bundles for baby showers, birthdays, and anniversaries.",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "cat-custom",
    name: "Custom Crochet",
    slug: "custom-crochet",
    description: "Have a unique design in mind? Share your dream and let's bring it to life stitch by stitch.",
    image: "https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?auto=format&fit=crop&w=600&q=80"
  }
];
