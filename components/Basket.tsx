import { useMemo, useState } from "react";
import { CartItem, Product } from "types";
import BinIcon from "./BinIcon";

const penniesToPrice = (pennies: number): string => {
  return pennies < 100
    ? `${pennies}p`
    : `£${Math.floor(pennies / 100)}.${pennies % 100}`;
};

export default ({
  products,
  cartItems,
  setCartItems,
}: {
  products: Product[];
  cartItems: CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
}): JSX.Element => {
  return (
    <div>
      <h1>Your Basket</h1>
      <p>
        Items you have added to your basket are shown below. Adjust the
        quantities or remove items before continuing purchase.
      </p>
      <div className="checkout-row header">
        <div className="checkout-product">Product</div>
        <div className="checkout-price">Price</div>
        <div className="checkout-quantity">Quantity</div>
        <div className="checkout-cost">Cost</div>
        <div className="checkout-remove">Remove</div>
      </div>
      {cartItems.map(({ sku, count }) => {
        const product = products.find((p) => p.sku === sku);
        return product === undefined ? null : (
          <div className="checkout-row" key={sku}>
            <div className="checkout-product">{product.name}</div>
            <div className="checkout-price">
              {penniesToPrice(product.pennies)}
            </div>
            <div className="checkout-quantity">{count}</div>
            <div className="checkout-cost">
              {penniesToPrice(product.pennies * count)}
            </div>
            <div className="checkout-remove">
              <button
                onClick={() => {
                  window.alert(`${product.sku} delete`);
                  console.log(cartItems);
                }}
              >
                <BinIcon />
              </button>
            </div>
          </div>
        );
      })}
      <div className="checkout-row subtotal">
        <div className="checkout-product">Subtotal</div>
        <div className="checkout-price" />
        <div className="checkout-quantity" />
        <div className="checkout-cost">£{222}</div>
        <div className="checkout-remove" />
      </div>
      <div className="checkout-row vat">
        <div className="checkout-product">VAT at 20%</div>
        <div className="checkout-price" />
        <div className="checkout-quantity" />
        <div className="checkout-cost">£{111}</div>
        <div className="checkout-remove" />
      </div>
      <div className="checkout-row total">
        <div className="checkout-product">Total cost</div>
        <div className="checkout-price" />
        <div className="checkout-quantity" />
        <div className="checkout-cost">£{333}</div>
        <div className="checkout-remove" />
      </div>
      <div className="checkout-row buy-now">
        <div className="checkout-product" />
        <div className="checkout-price" />
        <div className="checkout-quantity" />
        <div className="checkout-cost">
          <button>Buy Now</button>
        </div>
        <div className="checkout-remove" />
      </div>
    </div>
  );
};
