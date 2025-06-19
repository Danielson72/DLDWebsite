export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'prod_SWolJKphw42y5s',
    priceId: 'price_1Rbl89GKbDbFMYBRsREfZpNY',
    name: 'The Tru Witnesses Music Download',
    description: 'Genre/Style: "A high-energy Gospel Hip Hop track with a powerful message."',
    mode: 'payment',
  },
  {
    id: 'prod_SWoLQvnRZngsFO',
    priceId: 'price_1RbkifGKbDbFMYBRZwSx6c4b',
    name: 'DLD Music downloads',
    description: 'Genre/Style: "A high-energy Gospel Hip Hop track with a powerful message."',
    mode: 'payment',
  },
];