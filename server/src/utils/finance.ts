/**
 * Calculate the commission a coach receives for completing a single session.
 * By default, the commission rate is 60%.
 *
 * @param packagePrice - Total price of the patient package.
 * @param totalSessions - Total number of sessions in the package.
 * @param commissionRate - The percentage rate for the commission (default: 0.60).
 * @returns The commission amount for a single session.
 */
export function calculateCommission(
  packagePrice: number,
  totalSessions: number,
  commissionRate: number = 0.60
): number {
  if (totalSessions <= 0) {
    return 0; // Prevent division by zero or negative sessions
  }
  return (packagePrice * commissionRate) / totalSessions;
}

/**
 * Calculate the final amount to be paid after applying a discount.
 *
 * @param baseAmount - The base price of the item or package.
 * @param discountType - The type of discount ('PERCENTAGE' or 'FIXED').
 * @param discountValue - The value of the discount.
 * @returns The final amount to be paid.
 */
export function calculateFinalAmount(
  baseAmount: number,
  discountType: 'PERCENTAGE' | 'FIXED',
  discountValue: number
): number {
  if (baseAmount < 0 || discountValue < 0) {
      return Math.max(0, baseAmount); // Return base if invalid input
  }

  if (discountType === 'PERCENTAGE') {
    return Math.max(0, baseAmount - (baseAmount * (discountValue / 100)));
  } else if (discountType === 'FIXED') {
    return Math.max(0, baseAmount - discountValue);
  }

  return baseAmount;
}
