import React, { useState } from "react";
import { BsCalendar } from "react-icons/bs";
import DatePicker from "react-datepicker";
import ptBR from "date-fns/locale/pt-BR";
import { Input } from "./Select";

export function DatePickerInput({
  title,
  setState,
  selected,
  children,
  ...rest
}: any) {
  const [dataDeNascimento, setDataDeNascimento] = useState();
  return (
    <Input
      title={title}
      as={DatePicker}
      placeholderText={"__/__/____"}
      selected={selected || dataDeNascimento}
      onChange={(date: any) =>
        setState ? setState(date) : setDataDeNascimento(date)
      }
      locale={ptBR}
      dateFormat="dd/MM/yyyy"
      icon={<BsCalendar color="#777" />}
      maxW={200}
      variant="outline"
      labelColor="cinzaescuro"
      {...rest}
    >
      {children}
    </Input>
  );
}
