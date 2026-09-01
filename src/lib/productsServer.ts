import { products, Product } from '@/data/products';

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function resolveOrderItems(items: { productId: string; quantity: number; color?: string; size?: string }[]) {
  const resolved: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    color?: string;
    size?: string;
  }[] = [];

  let subtotal = 0;

  for (const it of items) {
    const prod = getProductById(it.productId);
    if (!prod) throw new Error(`Product not found: ${it.productId}`);
    if (prod.stockStatus === 'out_of_stock') throw new Error(`${prod.name} is out of stock`);
    const qty = Math.max(1, Number(it.quantity) || 1);
    const unitPrice = prod.price;
    const totalPrice = unitPrice * qty;
    subtotal += totalPrice;
    resolved.push({
      productId: prod.id,
      productName: prod.name,
      quantity: qty,
      unitPrice,
      totalPrice,
      color: it.color,
      size: it.size,
    });
  }

  return { resolved, subtotal };
}
