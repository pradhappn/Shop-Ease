export const formatPrice = (amount) =>
    `₹${Number(amount).toLocaleString('en-IN')}`;
