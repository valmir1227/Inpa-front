import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const store = (set) => ({
  /* days: [],
  setDays: (item) => set({ days: item }, false, "setDays"), */
  cart: [],

  setCart: (item) => set({ cart: item }, false, "setCart"),

  cartRaw: [],

  filterCartRaw: (item) =>
    set(
      ({ cartRaw }) => {
        const filtered = cartRaw.filter(
          (hour) => hour.selectedHour.id !== item.id
        );
        //remove o item do carrinho
        return { cartRaw: filtered };
      },
      false,
      "filterCartRaw"
    ),

  setCartRaw: (item) =>
    set(
      ({ cartRaw }) => {
        //verifica se o item já está no carrinho, se estiver, remove
        if (cartRaw.some((i) => i.selectedHour.id === item.selectedHour.id)) {
          return {
            cartRaw: cartRaw.filter(
              (hour) => hour.selectedHour.id !== item.selectedHour.id
            ),
          };
        }
        //se não estiver, adiciona
        return { cartRaw: [...cartRaw, item] };
      },
      false,
      "setCartRaw"
    ),

  addToCart: (newItem) =>
    set((state) => ({ cart: [...state.cart, newItem] }), false, "addToCart"),
  reset: () => set({ cart: [], cartRaw: [] }, false, "reset"),
});

export const useCart = create(persist(devtools(store), { name: "INPA_CART" }));
