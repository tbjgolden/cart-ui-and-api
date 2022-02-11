import { useState } from "react";

export default ({
  quantity,
  stockLevel = Infinity,
  setQuantity,
}: {
  quantity: number;
  stockLevel?: number;
  setQuantity: (quantity: number) => void;
}): JSX.Element => {
  return (
    <div className="q">
      <button
        className="q-minus"
        disabled={quantity <= 1}
        onClick={() => {
          if (quantity > 1) {
            setQuantity(quantity - 1);
          }
        }}
      >
        &ndash;
      </button>
      <div className="q-value">{quantity}</div>
      <button
        className="q-plus"
        disabled={quantity >= stockLevel}
        onClick={() => {
          if (quantity < stockLevel) {
            setQuantity(quantity + 1);
          }
        }}
      >
        +
      </button>
    </div>
  );
};
