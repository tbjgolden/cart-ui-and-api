import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import Layout from "components/Layout";
import { useCallback, useMemo, useState } from "react";
import { CartItem } from "types";
import Basket from "components/Basket";

const ProductQuery = gql`
  query ProductQuery {
    products {
      id
      sku
      name
      size
      pennies
      stockLevel
    }
  }
`;

const initialCartItems: CartItem[] = [
  {
    sku: "AWDT0001-M",
    count: 1,
  },
  {
    sku: "AWDT0002",
    count: 2,
  },
  {
    sku: "AWDT0003-M",
    count: 1,
  },
];
const initialCartItemsJSON = JSON.stringify(initialCartItems);

export default () => {
  const [cartItemsJSON, setCartItemsJSON] = useState(initialCartItemsJSON);
  const { data, loading } = useQuery(ProductQuery);
  const cartItems = useMemo(() => JSON.parse(cartItemsJSON), [cartItemsJSON]);
  const setCartItems = useCallback(
    (cartItems: CartItem[]) => {
      setCartItemsJSON(JSON.stringify(cartItems));
    },
    [cartItemsJSON]
  );

  return (
    <Layout>
      <div className="checkout">
        {loading ? null : (
          <Basket
            products={data.products}
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}
      </div>
    </Layout>
  );
};
