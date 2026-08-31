import type { StaticImageData } from "next/image";
import FlowerCategory from "../../public/products/flower/1.png"
import HairCategory from '../../public/products/hair/1.png'
import HandCategory from '../../public/products/hand/1.png'
import HomeCategory from '../../public/products/home/1.png'


export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | StaticImageData;
}

export const categories: Category[] = [
  {
    id: "cat-hair",
    name: "Crochet Hair Accessories",
    slug: "crochet-hair-accessories",
    description: "Chic, durable, and stylish handmade bags for your everyday essentials.",
    image: HairCategory
  },
  {
    id: "cat-flowers",
    name: "Crochet Flowers",
    slug: "crochet-flowers",
    description: "Everlasting blooms that add warmth and color to any space, requiring no watering.",
    image: FlowerCategory
  },
  {
    id: "cat-hand",
    name: "Crochet Hand Accessories",
    slug: "crochet-hand-accessories",
    description: "Adorable, bite-sized companions to carry your keys or adorn your backpacks.",
    image: HandCategory
  },
  {
    id: "cat-home",
    name: "Crochet Home Decor",
    slug: "crochet-home-decor",
    description: "Coasters, table runners, and wall hangings that make a house feel like a home.",
    image: HomeCategory
  },
  {
    id: "cat-accessories",
    name: "Crochet Accessories",
    slug: "crochet-accessories",
    description: "Cozy headbands, scrunchies, hats, and scarves to elevate your style.",
    image: "https://images.unsplash.com/photo-1575413829029-1bb393595e52?auto=format&fit=crop&w=600&q=80"
  }
];
