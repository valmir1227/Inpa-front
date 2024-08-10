export const PERMISSOES_OBJ = [
  { value: "admin", label: "Admin" },
  { value: "patient", label: "Paciente" },
  { value: "expert", label: "Expert" },
  { value: "colaborador", label: "Colaborador" },
  { value: "enterprise", label: "Enterprise" },
];

export const PERMISSOES = PERMISSOES_OBJ.map((perm) => perm.label);
