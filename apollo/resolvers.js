import { products as _products } from "apollo/staticData";

const products = Object.entries(_products).map(([sku, fields]) => ({
  id: `sku:${sku}`,
  sku,
  ...fields,
}));

export const resolvers = {
  Query: {
    products(_parent, _args, _context, _info) {
      return products;
    },
  },
};
