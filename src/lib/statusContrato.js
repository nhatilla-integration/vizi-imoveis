// Calcula o status do contrato automaticamente, sem ninguém precisar
// atualizar isso manualmente. Regra combinada: 30 dias para "a vencer".

const DIAS_LIMITE_A_VENCER = 30;

export function calcularStatusContrato(dataFim) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const fim = new Date(dataFim);
  fim.setHours(0, 0, 0, 0);

  const diffDias = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    return { status: 'vencido', label: 'Vencido', diffDias };
  }
  if (diffDias <= DIAS_LIMITE_A_VENCER) {
    return { status: 'a_vencer', label: 'A vencer', diffDias };
  }
  return { status: 'em_dia', label: 'Em dia', diffDias };
}