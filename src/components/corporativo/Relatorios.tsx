import { Box, Flex, Heading, useDisclosure, Wrap } from "@chakra-ui/react";
import { addDays, startOfDay, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { watch } from "fs";
import { useForm } from "react-hook-form";
import { BsCalendar } from "react-icons/bs";
import { STATUS, STATUS_OBJ } from "utils/STATUS";
import DatePicker from "react-datepicker";
import { Input, Select } from "components/global/Select";
import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export function Relatorios() {
  const { isOpen, onToggle } = useDisclosure();
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: null,
    },
  } as any);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const data = {
    labels: ["Ansiedade", "Anorexia", "Depressão"],
    datasets: [
      {
        label: "Cid's mais frequentes",
        data: [100, 50, 150],
        backgroundColor: ["#FFA61A", "#00B5B8", "#EB5757"],
      },
    ],
  };

  return (
    <Flex
      bg="#f5f5f5"
      flexDir="column"
      as="section"
      justify="center"
      align="center"
      w="100%"
      gap={0}
      pb={6}
    >
      <Flex
        p={{ base: "1rem", md: "2rem" }}
        bg="white"
        borderTopRadius={20}
        borderWidth={1}
        borderColor="cinza"
        align="start"
        maxW={1100}
        w="full"
        justify="space-between"
        flexDir="column"
        gap={6}
        mt={4}
      >
        <Flex w="full" justify="space-between">
          <Heading fontSize={28}>Relatórios</Heading>
          <Input
            zIndex={5}
            maxW={250}
            title="Período"
            id="date"
            bg="white"
            // color="amarelo"
            borderColor="cinzaclaro"
            _focus={{ bg: "amarelo" }}
            // placeholderText="Data de nascimento"
            as={DatePicker}
            // selected={getValues("date")}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            autoComplete="off"
            selected={watch("date") ? new Date(watch("date")) : null}
            // placeholderText="I have been cleared!"
            // selected={getValues("date")}
            // onChange={(date: any) => {
            //
            //   setValue("date", date ? date.toISOString() : null);
            // }}
            onChange={onChange}
            locale={ptBR}
            dateFormat="dd/MM/yyyy"
            icon={<BsCalendar color="white" />}
            register={{ ...register("date") }}
            labelColor="cinza"
            excludeDateIntervals={[
              { start: subDays(new Date(), 30), end: addDays(new Date(), 30) },
            ]}
          />
        </Flex>
        <Box w="full" maxW={500}>
          <Doughnut
            options={{
              plugins: {
                legend: {
                  position: "right",
                  align: "center",
                },
                title: {
                  display: true,
                  text: "Custom Chart Title",
                  padding: {
                    top: 10,
                    bottom: 30,
                  },
                },
              },
            }}
            data={data}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
