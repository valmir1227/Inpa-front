export function toReal(value: any, user?: any) {
  const valor = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  if (typeof value === "number") {
    if (user?.from_id) {
      return +value?.toFixed(0);
    } else {
      return valor.format(value);
    }
  } else {
    if (user?.from_id) {
      if (+value?.credit_value?.toFixed(0) > 1)
        return +value?.credit_value?.toFixed(0) + " créditos";
      return +value?.credit_value?.toFixed(0) + " crédito";
    } else {
      return valor.format(+value?.price || +value || 0);
    }
  }
}
