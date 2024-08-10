import { useDisclosure } from "@chakra-ui/react";
import { useFetch } from "hooks/useFetch";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
const Context = createContext({} as any);

interface SidebarDrawerProvider {
  children: ReactNode;
}

type ContextProviderProps = {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function ContextProvider({ children }: SidebarDrawerProvider) {
  const [user, setUser] = useState();
  const [dataGetMe, errorGetMe, isFetchingGetMe, getMe] =
    useFetch("/v1/users/me");

  useEffect(() => {
    if (dataGetMe) {
      setUser(dataGetMe);
    }
  }, [dataGetMe]);

  // const [cart, setCart] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    onOpen: onOpenAgendamentoConcluido,
    isOpen: isOpenAgendamentoConcluido,
    onClose: onCloseAgendamentoConcluido,
  } = useDisclosure();
  const {
    onOpen: onOpenPagamentoComPix,
    isOpen: isOpenPagamentoComPix,
    onClose: onClosePagamentoComPix,
  } = useDisclosure();
  const [firstDay, setFirstDay] = useState(new Date());
  return (
    <Context.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        onOpenAgendamentoConcluido,
        isOpenAgendamentoConcluido,
        onCloseAgendamentoConcluido,
        onOpenPagamentoComPix,
        isOpenPagamentoComPix,
        onClosePagamentoComPix,
        user,
        setUser,
        // cart,
        // setCart,
        getMe,
        firstDay,
        setFirstDay,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMyContext = () => useContext(Context);
