import { gql } from "@apollo/client";

export const typeDefs = gql`
  type Product {
    id: ID!
    sku: String!
    name: String!
    pennies: Int!
    stockLevel: Int!
    size: String
  }

  type Query {
    products: [Product]!
  }
`;
