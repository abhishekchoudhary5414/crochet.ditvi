import React from "react";
import ProductDetailsClient from "./ProductDetailsClient";
import { products } from "@/data/products";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  
  return {
    title: product ? `${product.name} - Ditvi Crochet` : "Product Details - Ditvi Crochet",
    description: product ? product.description : "View details of this beautiful handmade crochet product.",
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  return <ProductDetailsClient id={id} />;
}
