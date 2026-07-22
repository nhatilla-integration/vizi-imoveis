import { useState } from 'react';

export function RepairModal({ imovel, totalReparos, onClose, onAddReparo }) {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!dataInicio || !dataFim || !valor || !descricao) return;
    onAddReparo(imovel.id, { data_inicio: dataInicio, data_fim: dataFim, valor: Number(valor), descricao });
    setDataInicio('');
    setDataFim('');
    setValor('');
    setDescricao('');
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Reparos — {imovel.endereco}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          Total investido: <span className="text-white font-medium">R$ {totalReparos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </p>

        <div className="max-h-48 overflow-y-auto mb-4 space-y-2">
          {(imovel.reparos || []).length === 0 && (
            <p className="text-gray-500 text-sm">Nenhum reparo registrado ainda.</p>
          )}
          {(imovel.reparos || []).map((r) => (
            <div key={r.id} className="flex justify-between text-sm bg-gray-800/50 rounded-lg px-3 py-2">
              <span className="text-gray-300">{r.descricao}</span>
              <span className="text-gray-400 text-right">
                {new Date(r.data_inicio).toLocaleDateString('pt-BR')} → {new Date(r.data_fim).toLocaleDateString('pt-BR')}
                <br />
                R$ {Number(r.valor).toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 border-t border-gray-800 pt-4">
          <p className="text-xs uppercase text-gray-500 font-semibold">Registrar novo reparo</p>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500">Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500">Término</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
              />
            </div>
          </div>

          <input
            type="number"
            placeholder="Valor gasto (R$)"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
          />
          <input
            type="text"
            placeholder="Descrição (ex: troca de torneira)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg py-2 transition-colors"
          >
            Adicionar reparo
          </button>
        </form>
      </div>
    </div>
  );
}