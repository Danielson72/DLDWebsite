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
    priceId: 'price_1MlFZQGKbDbFMYBRKOBe8Kf4',
    name: 'The Tru Witnesses Music Download',
    description: 'Genre/Style: "A high-energy Gospel Hip Hop track with a powerful message."',
    mode: 'payment',
  },
  {
    id: 'prod_SWoLQvnRZngsFO',
    priceId: 'price_1HrPOlH8dMk6gl8emTUpWGH8',
    name: 'DLD Music downloads',
    description: 'Genre/Style: "A high-energy Gospel Hip Hop track with a powerful message."',
    mode: 'payment',
  },
];