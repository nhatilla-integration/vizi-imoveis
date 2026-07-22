import { calcularStatusContrato } from '../lib/statusContrato';

const ESTILOS = {
  em_dia: 'bg-green-500/20 text-green-400 border-green-500/40',
  a_vencer: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  vencido: 'bg-red-500/20 text-red-400 border-red-500/40',
};

export function StatusBadge({ dataFim }) {
  const { status, label, diffDias } = calcularStatusContrato(dataFim);

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full border whitespace-nowrap ${ESTILOS[status]}`}>
      {label}
      {status !== 'vencido' && ` · ${diffDias}d`}
    </span>
  );
}