import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { RepairModal } from './RepairModal';

const TIPO_LABEL = {
  casa: 'Casa',
  ponto_comercial: 'Ponto Comercial',
};

const ASSINATURA_ESTILO = {
  assinado: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  pendente: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
};

export function ImovelRow({ imovel, onDelete, onAddReparo }) {
  const [modalOpen, setModalOpen] = useState(false);
  const reparos = imovel.reparos || [];
  const totalReparos = reparos.reduce((soma, r) => soma + Number(r.valor), 0);
  const ultimoReparo = reparos.length > 0
    ? reparos.reduce((mais, r) => (new Date(r.data_fim) > new Date(mais.data_fim) ? r : mais))
    : null;
  const vago = !imovel.contrato;

  return (
    <>
      <tr className="border-b border-gray-800 hover:bg-gray-900/40 transition-colors">
        <td className="py-3 px-4 text-sm text-gray-300">{TIPO_LABEL[imovel.tipo]}</td>
        <td className="py-3 px-4 text-sm text-white font-medium">{imovel.endereco}</td>
        <td className="py-3 px-4 text-sm text-gray-300">{imovel.inquilino?.nome || '—'}</td>
        <td className="py-3 px-4 text-sm text-gray-300">
          R$ {Number(imovel.valor_aluguel).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </td>
        <td className="py-3 px-4">
          {vago ? (
            <span className="text-xs font-medium px-2 py-1 rounded-full border whitespace-nowrap bg-gray-700/40 text-gray-400 border-gray-600">
              Vago
            </span>
          ) : (
            <StatusBadge dataFim={imovel.contrato.data_fim} />
          )}
        </td>
        <td className="py-3 px-4">
          {!vago && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full border whitespace-nowrap ${ASSINATURA_ESTILO[imovel.contrato.status_assinatura]}`}>
              {imovel.contrato.status_assinatura === 'assinado' ? 'Assinado' : 'Pendente'}
            </span>
          )}
        </td>
        <td className="py-3 px-4 text-sm text-gray-400">{imovel.imobiliaria || '—'}</td>
        <td className="py-3 px-4 text-sm text-gray-300">
          {totalReparos > 0 ? `R$ ${totalReparos.toLocaleString('pt-BR')}` : '—'}
        </td>
        <td className="py-3 px-4 text-sm text-gray-400">
          {ultimoReparo ? new Date(ultimoReparo.data_fim).toLocaleDateString('pt-BR') : '—'}
        </td>
        <td className="py-3 px-4 text-sm">
          <button
            onClick={() => setModalOpen(true)}
            className="text-blue-400 hover:text-blue-300 text-xs font-medium"
          >
            Ver reparos ({reparos.length})
          </button>
        </td>
        <td className="py-3 px-4">
          <button
            onClick={() => onDelete(imovel.id)}
            className="text-gray-500 hover:text-red-400 text-xs"
          >
            Excluir
          </button>
        </td>
      </tr>

      {modalOpen && (
        <RepairModal
          imovel={imovel}
          totalReparos={totalReparos}
          onClose={() => setModalOpen(false)}
          onAddReparo={onAddReparo}
        />
      )}
    </>
  );
}