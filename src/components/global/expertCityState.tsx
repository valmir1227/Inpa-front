export function expertCityState(expert: any) {
  const [address1] = expert?.addresses || [];
  const { city, state } = address1 || {};
  if (city) return `${city}, ${state}`;
}
