// @ts-check
import {
  DiscountClass,
  ProductDiscountSelectionStrategy,
} from "../generated/api";

/**
 * @param {import("../generated/api").CartInput} input
 * @returns {import("../generated/api").CartLinesDiscountsGenerateRunResult}
 */
export function cartLinesDiscountsGenerateRun(input) {
  const NO_DISCOUNT = { operations: [] };

  const DISCOUNT_PERCENT = "20";

  const isVIP =
    input.cart.buyerIdentity?.customer?.hasAnyTag === true;

  if (!isVIP) return NO_DISCOUNT;

  // Block POS
  const isOnline =
    Array.isArray(input.cart.deliveryGroups) &&
    input.cart.deliveryGroups.length > 0;

  if (!isOnline) return NO_DISCOUNT;

  const eligibleTargets = input.cart.lines
    .filter((line) => {
      const merch = line.merchandise;

      return (
        merch.__typename === "ProductVariant" &&
        merch.product?.inAnyCollection === true
      );
    })
    .map((line) => ({
      cartLine: { id: line.id },
    }));

  if (!eligibleTargets.length) return NO_DISCOUNT;

  if (!input.discount.discountClasses.includes(DiscountClass.Product)) {
    return NO_DISCOUNT;
  }

  return {
    operations: [
      {
        productDiscountsAdd: {
          selectionStrategy:
            ProductDiscountSelectionStrategy.All,
          candidates: [
            {
              message: "VIP TEST",
              targets: eligibleTargets,
              value: {
                percentage: {
                  value: DISCOUNT_PERCENT,
                },
              },
            },
          ],
        },
      },
    ],
  };
}