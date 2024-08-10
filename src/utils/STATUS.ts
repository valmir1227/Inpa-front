export const STATUS_OBJ = [
  { value: "Scheduled", label: "Agendado" },
  { value: "Canceled", label: "Cancelado" },
  { value: "Finished", label: "Finalizado" },
  { value: "inProgress", label: "Em andamento" },
  { value: "Absent", label: "Falta" },
];

export const COUNCIL_STATUS_OBJ = [
  { value: "Approved", label: "Aprovado" },
  { value: "Pending", label: "Pendente" },
  { value: "Expired", label: "Vencido" },
  { value: "Suspended", label: "Suspenso" },
  { value: "In Review", label: "Em análise" },
];
export const WITHDRAW_STATUS_OBJ = [
  { value: "Paid", label: "Pago" },
  { value: "Pending", label: "Pendente" },
  { value: "Denied", label: "Negado" },
  { value: "Chargeback", label: "Estornado" },
  { value: "Canceled", label: "Cancelado" },
];

export const STATUS_VALUE = STATUS_OBJ.map((estado) => estado.value);
export const STATUS = STATUS_OBJ.map((estado) => estado.label);
