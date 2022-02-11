import { useMemo, useState } from "react";
import { CartItem, Product } from "types";
import BinIcon from "./BinIcon";
import QuantityPicker from "./QuantityPicker";

const penniesToPrice = (pennies: number): string => {
  return pennies < 100
    ? `${pennies}p`
    : `£${Math.floor(pennies / 100)}.${`${pennies % 100}`.padStart(2, "0")}`;
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
  const subtotal = cartItems.reduce((sum, { sku, count }) => {
    const product = products.find((p) => p.sku === sku);
    if (product === undefined) {
      return sum;
    } else {
      return sum + product.pennies * count;
    }
  }, 0);
  const vat = Math.ceil(subtotal * 0.2);

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
            <div className="checkout-quantity">
              <QuantityPicker
                quantity={count}
                setQuantity={(newCount) => {
                  setCartItems(
                    cartItems.map((cartItem) => {
                      if (cartItem.sku === sku) {
                        return {
                          ...cartItem,
                          count: newCount,
                        };
                      } else {
                        return cartItem;
                      }
                    })
                  );
                }}
                stockLevel={product.stockLevel ?? Infinity}
              />
            </div>
            <div className="checkout-cost">
              {penniesToPrice(product.pennies * count)}
            </div>
            <div className="checkout-remove">
              <button
                onClick={() => {
                  setCartItems(
                    cartItems.filter((cartItem) => cartItem.sku !== sku)
                  );
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
        <div className="checkout-cost">{penniesToPrice(subtotal)}</div>
        <div className="checkout-remove" />
      </div>
      <div className="checkout-row vat">
        <div className="checkout-product">VAT at 20%</div>
        <div className="checkout-price" />
        <div className="checkout-quantity" />
        <div className="checkout-cost">{penniesToPrice(vat)}</div>
        <div className="checkout-remove" />
      </div>
      <div className="checkout-row total">
        <div className="checkout-product">Total cost</div>
        <div className="checkout-price" />
        <div className="checkout-quantity" />
        <div className="checkout-cost">{penniesToPrice(subtotal + vat)}</div>
        <div className="checkout-remove" />
      </div>
      <div className="checkout-row buy-now">
        <div className="checkout-product" />
        <div className="checkout-price" />
        <div className="checkout-quantity" />
        <div className="checkout-cost">
          <button
            onClick={() => {
              window.alert(
                `Order Summary:\n\n${penniesToPrice(
                  subtotal + vat
                )}\n\n${cartItems
                  .map(({ sku, count }) => `${count} x ${sku}`)
                  .join("\n")}`
              );
            }}
          >
            Buy Now
          </button>
        </div>
        <div className="checkout-remove" />
      </div>
    </div>
  );
};
