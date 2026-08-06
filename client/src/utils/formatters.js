/**
 * Indian Rupee (INR) Formatter Utility
 * Formats numbers into Indian currency format (e.g. ₹50,000, ₹1,25,000, ₹12,50,000)
 */
export function formatINR(val) {
  const num = Number(val) || 0;
  return '₹' + num.toLocaleString('en-IN');
}
