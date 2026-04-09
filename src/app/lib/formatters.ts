export function formatPrice(price: number) {
  if (price === 0) {
    return "FREE";
  }

  return `INR ${new Intl.NumberFormat("en-IN").format(price)}`;
}
