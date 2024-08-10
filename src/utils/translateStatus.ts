export function translateStatus(status: string) {
  switch (status) {
    case "scheduled":
    case "Scheduled":
      return "Agendado";
    case "Reserved":
      return "Processando";
    case "Canceled":
      return "Cancelado";
    case "inProgress":
    case "InProgress":
      return "Em andamento";
    case "Finished":
    case "Finished(auto)":
      return "Finalizada";
    case "Paid with Pagarme":
      return "Pago (pagarme)";
    case "Paid":
    case "paid":
      return "Pago";
    case "pending":
    case "Pending":
      return "Pendente";
    case "Withdraw in progress":
      return "$ Solicitado";
    case "Withdrawn completed":
      return "$ Recebido";
    case "Approved":
      return "Aprovado";
    case "Suspended":
      return "Suspenso";
    case "Disabled":
      return "Bloqueado";
    case "Expired":
      return "Vencido";
    case "In Review":
      return "Em análise";
    case "Denied":
      return "Reprovado";
    case "Absent(auto)":
      return "Falta";
    case "credit":
      return "Saldo";
    case "credit_card":
      return "Cartão de crédito";
    case "school_level":
      return "Escolaridade";
    case "ie":
      return "Inscrição estadual";
    case "patient":
      return "Paciente";
    case "expert":
      return "Especialista";
    case "enterprise":
      return "Corporativo";
    case "admin":
      return "Administrador";

    default:
      return status;
  }
}

export function colorStatus(status: string) {
  switch (status) {
    case "Scheduled":
    case "Approved":
    case "Paid":
      return "whatsapp.300";
    case "Reserved":
      return "azul";
    case "inProgress":
    case "Withdraw in progress":
      return "azul";
    case "Canceled":
    case "Denied":
      return "vermelho";
    case "Paid with Pagarme":
      return "whatsapp.300";
    default:
      return "cinza";
  }
}

export function translateUser(data: string) {
  switch (data) {
    case "id":
      return "Identificador";
    case "name":
      return "Nome";
    case "social_name":
      return "Quer ser chamado de";
    case "doc":
      return "Documento";
    case "email":
      return "E-mail";
    case "phone":
      return "Telefone";
    case "gender":
      return "Gênero";
    case "civil_status":
      return "Estado civil";
    case "ethnicity":
      return "Etnia ou raça ou cor";
    case "from":
      return "Indicação";
    case "status":
      return "Situação";
    case "show_gender":
      return "Exibir gênero";
    case "show_age":
      return "Exibir idade";
    case "newsletter_accepted":
      return "Aceita receber comunicados";
    case "birthday":
      return "Data de nascimento";
    case "terms_accepted_at":
      return "Aceitou os termos dia";
    case "created_at":
      return "Criado dia";
    case "updated_at":
      return "Atualizado dia";
    case "slug":
      return "URL personalizada";
    case "phone2":
      return "Telefone alternativo";
    case "pagarme_id":
      return "Identificador no Pagarme";
    case "country_code":
      return "Código telefônico do país";
    case "area_code":
      return "Código telefônico do estado";
    case "pagarme_email":
      return "E-mail no Pagarme";
    case "tax":
      return "Taxa de serviço";
    case "is_company":
      return "É empresa";
    case "last_login":
      return "Último login";
    case "profile_updated_at":
      return "Atualizou o perfil dia";
    case "enterprise":
      return "É Enterprise";
    case "availableCredits":
      return "Créditos disponíveis";
    case "usedCredits":
      return "Créditos usados";
    case "appointmentsCount":
      return "Total de agendamentos";
    case "lostCredits":
      return "Créditos perdidos";
    case "company_name":
      return "Nome da empresa";
    case "company_cnpj":
      return "CNPJ da empresa";
    case "company_ie":
      return "IE da empresa";
    case "company_country_code":
      return "Cód telefônico do país da empresa";
    case "company_area_code":
      return "Cód telefônico do estado da empresa";
    case "company_phone":
      return "Telefone da empresa";
    case "company_email":
      return "Email da empresa";
    case "company_address":
      return "Endereço da empresa";
    case "company_address_number":
      return "Número da empresa";
    case "company_neighborhood":
      return "Bairro da empresa";
    case "company_city":
      return "Cidade da empresa";
    case "company_state":
      return "Estado da empresa";
    case "company_zip":
      return "CEP da empresa";
    case "from_id":
      return "Colaborador do usuario";
    case "user_id":
      return "Identificador do usuario";
    case "title":
      return "Título";
    case "zip_code":
      return "CEP";
    case "street":
      return "Rua";
    case "number":
      return "Número";
    case "complement":
      return "Complemento";
    case "reference":
      return "Referência";
    case "neighborhood":
      return "Bairro";
    case "city":
      return "Cidade";
    case "state":
      return "Estado";
    case "country":
      return "País";

    default:
      return data;
  }
}
