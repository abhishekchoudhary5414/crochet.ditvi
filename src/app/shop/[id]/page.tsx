import React from "react";
import ProductDetailsClient from "./ProductDetailsClient";
import { products } from "@/data/products";
import { Metadata } from "next";
import siteConfig from "@/data/siteConfig.json";

interface Props {
  params: Promise<{ id: string }>;
}

const defaultProductImage = "/logo/logo.png";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.slug || product.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.slug === id || p.id === id);
  const title = product ? `${product.name} - Ditvi Crochet` : "Product Details - Ditvi Crochet";
  const description = product ? product.description : "View details of this beautiful handmade crochet product.";
  const productImagePath = product?.images?.[0] || defaultProductImage;
  const productImageUrl = new URL(productImagePath, siteConfig.siteUrl).toString();
  const canonicalUrl = `${siteConfig.siteUrl}/shop/${product?.slug || id}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/shop/${product?.slug || id}`,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "Ditvi Crochet",
      images: [
        {
          url: productImageUrl,
          width: 512,
          height: 512,
          alt: product ? `${product.name} by Ditvi Crochet` : "Ditvi Crochet product image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [productImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailsClient id={id} />;
}
