export function useReal(float) {
  const valor = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  return valor.format(float);
}
