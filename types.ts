export type CartItem = {
  sku: string;
  count: number;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  pennies: number;
  stockLevel: number;
  size?: string;
};
