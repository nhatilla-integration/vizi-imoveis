import { useState, useMemo } from 'react';
import { useImoveis } from './hooks/useImoveis';
import { ImovelRow } from './components/ImovelRow';
import { NewImovelModal } from './components/NewImovelModal';
import { calcularStatusContrato } from './lib/statusContrato';

const ABAS = [
  { id: 'todos', label: 'Todos' },
  { id: 'assinado', label: 'Assinados' },
  { id: 'pendente', label: 'Pendentes de assinatura' },
  { id: 'vago', label: 'Vagos' },
];

function HouseIcon({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Telhado */}
      <path d="M4 28L32 6L60 28L56 28L32 10L8 28Z" fill="#b45309" />
      {/* Corpo da casa */}
      <rect x="12" y="27" width="40" height="28" fill="#d97706" />
      {/* Sombra lateral do corpo (dá volume) */}
      <rect x="44" y="27" width="8" height="28" fill="#92400e" opacity="0.5" />
      {/* Chaminé */}
      <rect x="41" y="12" width="5" height="12" fill="#78350f" />
      {/* Porta */}
      <rect x="28" y="39" width="9" height="16" rx="0.5" fill="#451a03" />
      <circle cx="35" cy="47" r="0.8" fill="#fbbf24" />
      {/* Janela esquerda */}
      <rect x="16" y="33" width="8" height="8" fill="#fef3c7" stroke="#451a03" strokeWidth="0.8" />
      <line x1="20" y1="33" x2="20" y2="41" stroke="#451a03" strokeWidth="0.8" />
      <line x1="16" y1="37" x2="24" y2="37" stroke="#451a03" strokeWidth="0.8" />
      {/* Janela direita */}
      <rect x="40" y="33" width="8" height="8" fill="#fef3c7" stroke="#451a03" strokeWidth="0.8" />
      <line x1="44" y1="33" x2="44" y2="41" stroke="#451a03" strokeWidth="0.8" />
      <line x1="40" y1="37" x2="48" y2="37" stroke="#451a03" strokeWidth="0.8" />
    </svg>
  );
}

function App() {
  const { imoveis, loading, isDemoMode, criarImovel, adicionarReparo, excluirImovel } = useImoveis();
  const [modalOpen, setModalOpen] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('todos');

  const metrics = useMemo(() => {
    const alugados = imoveis.filter((im) => im.contrato).length;
    const vagos = imoveis.filter((im) => !im.contrato).length;
    const vencendoOuVencidos = imoveis.filter((im) => {
      if (!im.contrato) return false;
      const { status } = calcularStatusContrato(im.contrato.data_fim);
      return status === 'a_vencer' || status === 'vencido';
    }).length;
    const receitaMensal = imoveis
      .filter((im) => im.contrato)
      .reduce((soma, im) => soma + Number(im.valor_aluguel), 0);

    return { alugados, vagos, vencendoOuVencidos, receitaMensal };
  }, [imoveis]);

  const imoveisFiltrados = useMemo(() => {
    if (abaAtiva === 'todos') return imoveis;
    if (abaAtiva === 'vago') return imoveis.filter((im) => !im.contrato);
    return imoveis.filter((im) => im.contrato?.status_assinatura === abaAtiva);
  }, [imoveis, abaAtiva]);

  return (
    <div className="min-h-screen bg-[#1b1611] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-3">
            <HouseIcon className="w-11 h-11" />
            <h1 style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl font-bold tracking-tight">
              Vizi Imóveis
            </h1>
          </div>
          {isDemoMode && (
            <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-full px-3 py-1">
              Modo demonstração
            </span>
          )}
        </div>
        <p
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="text-sm text-amber-200/70 italic mb-6 ml-14 tracking-wide"
        >
          Família Gabionetta
        </p>

        {/* Dashboard */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <MetricCard label="Imóveis Alugados" value={metrics.alugados} />
          <MetricCard label="Imóveis Vagos" value={metrics.vagos} valueColor="text-stone-400" />
          <MetricCard label="Contratos a Vencer/Vencidos" value={metrics.vencendoOuVencidos} valueColor="text-yellow-400" />
          <MetricCard
            label="Receita Mensal Ativa"
            value={`R$ ${metrics.receitaMensal.toLocaleString('pt-BR')}`}
            valueColor="text-green-400"
          />
        </div>

        {/* Abas + botão novo */}
        <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
          <div className="flex gap-2">
            {ABAS.map((aba) => (
              <button
                key={aba.id}
                onClick={() => setAbaAtiva(aba.id)}
                className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                  abaAtiva === aba.id
                    ? 'bg-amber-600 border-amber-600 text-white'
                    : 'bg-[#2a231c] border-[#3a3128] text-stone-400 hover:text-white'
                }`}
              >
                {aba.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-500 transition-colors text-white text-sm font-medium rounded-lg px-4 py-2"
          >
            + Novo imóvel
          </button>
        </div>

        {/* Tabela */}
        {loading ? (
          <p className="text-stone-500 text-sm">Carregando imóveis...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[#3a3128]">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase text-stone-500 border-b border-[#3a3128] bg-[#221c17]">
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Endereço</th>
                  <th className="py-3 px-4">Inquilino</th>
                  <th className="py-3 px-4">Valor</th>
                  <th className="py-3 px-4">Contrato</th>
                  <th className="py-3 px-4">Assinatura</th>
                  <th className="py-3 px-4">Imobiliária</th>
                  <th className="py-3 px-4">Valor Reparos</th>
                  <th className="py-3 px-4">Última Data</th>
                  <th className="py-3 px-4">Reparos</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {imoveisFiltrados.map((imovel) => (
                  <ImovelRow
                    key={imovel.id}
                    imovel={imovel}
                    onDelete={excluirImovel}
                    onAddReparo={adicionarReparo}
                  />
                ))}
              </tbody>
            </table>
            {imoveisFiltrados.length === 0 && (
              <p className="text-stone-500 text-sm p-4">Nenhum imóvel encontrado nesse filtro.</p>
            )}
          </div>
        )}

        <NewImovelModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={criarImovel} />

        <p className="text-stone-700 text-xs mt-12">Feito com carinho para a família Gabionetta 🏠</p>
      </div>
    </div>
  );
}

function MetricCard({ label, value, valueColor = 'text-white' }) {
  return (
    <div className="bg-[#221c17] border border-[#3a3128] rounded-xl px-5 py-4 min-w-[180px]">
      <p className="text-xs uppercase text-stone-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

export default App;