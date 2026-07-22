import { useState } from 'react';

export function NewImovelModal({ open, onClose, onCreate }) {
  const [tipo, setTipo] = useState('casa');
  const [endereco, setEndereco] = useState('');
  const [valorAluguel, setValorAluguel] = useState('');
  const [imobiliaria, setImobiliaria] = useState('');
  const [ocupado, setOcupado] = useState(true);
  const [nomeInquilino, setNomeInquilino] = useState('');
  const [telefoneInquilino, setTelefoneInquilino] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [statusAssinatura, setStatusAssinatura] = useState('assinado');

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!endereco || !valorAluguel) return;
    if (ocupado && (!nomeInquilino || !dataInicio || !dataFim)) return;

    onCreate({
      tipo,
      endereco,
      valor_aluguel: Number(valorAluguel),
      imobiliaria: imobiliaria || null,
      ocupado,
      inquilino: ocupado ? { nome: nomeInquilino, telefone: telefoneInquilino } : null,
      contrato: ocupado
        ? { data_inicio: dataInicio, data_fim: dataFim, status_assinatura: statusAssinatura }
        : null,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold">Novo imóvel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
          >
            <option value="casa">Casa</option>
            <option value="ponto_comercial">Ponto Comercial</option>
          </select>

          <input
            type="text" placeholder="Endereço" value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
          />

          <input
            type="number" placeholder="Valor do aluguel (R$)" value={valorAluguel}
            onChange={(e) => setValorAluguel(e.target.value)}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
          />

          <input
            type="text" placeholder="Imobiliária responsável (opcional)" value={imobiliaria}
            onChange={(e) => setImobiliaria(e.target.value)}
            className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
          />

          <div className="border-t border-gray-800 pt-3">
            <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Situação do imóvel</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOcupado(true)}
                className={`flex-1 text-sm rounded-lg py-2 border ${ocupado ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
              >
                Alugado
              </button>
              <button
                type="button"
                onClick={() => setOcupado(false)}
                className={`flex-1 text-sm rounded-lg py-2 border ${!ocupado ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
              >
                Vago
              </button>
            </div>
          </div>

          {ocupado && (
            <>
              <div className="border-t border-gray-800 pt-3">
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Inquilino</p>
                <input
                  type="text" placeholder="Nome" value={nomeInquilino}
                  onChange={(e) => setNomeInquilino(e.target.value)}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700 mb-2"
                />
                <input
                  type="text" placeholder="Telefone (opcional)" value={telefoneInquilino}
                  onChange={(e) => setTelefoneInquilino(e.target.value)}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
                />
              </div>

              <div className="border-t border-gray-800 pt-3">
                <p className="text-xs uppercase text-gray-500 font-semibold mb-2">Contrato</p>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Início</label>
                    <input
                      type="date" value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                      className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-500">Término</label>
                    <input
                      type="date" value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                      className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
                    />
                  </div>
                </div>

                <label className="text-xs text-gray-500">Assinatura do contrato</label>
                <select
                  value={statusAssinatura}
                  onChange={(e) => setStatusAssinatura(e.target.value)}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
                >
                  <option value="assinado">Assinado</option>
                  <option value="pendente">Pendente de assinatura</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg py-2 mt-2 transition-colors"
          >
            Cadastrar imóvel
          </button>
        </form>
      </div>
    </div>
  );
}