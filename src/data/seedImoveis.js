// Dados de demonstração. Usados automaticamente quando o Supabase
// ainda não está configurado, para o app nunca aparecer vazio/quebrado.

export const seedImoveis = [
  {
    id: 'demo-1',
    tipo: 'casa',
    endereco: 'Rua das Palmeiras, 120',
    valor_aluguel: 1800,
    imobiliaria: null,
    inquilino: { nome: 'Marcos Ferreira', telefone: '(19) 99123-4567' },
    contrato: { data_inicio: '2025-01-10', data_fim: '2026-08-10', status_assinatura: 'assinado' },
    reparos: [
      { id: 'r1', data_inicio: '2026-02-28', data_fim: '2026-03-02', valor: 250, descricao: 'Conserto de vazamento no banheiro' },
    ],
  },
  {
    id: 'demo-2',
    tipo: 'casa',
    endereco: 'Av. Brasil, 450',
    valor_aluguel: 2200,
    imobiliaria: 'Imob. Campinas Center',
    inquilino: { nome: 'Juliana Santos', telefone: '(19) 98877-1122' },
    contrato: { data_inicio: '2024-07-01', data_fim: '2026-07-20', status_assinatura: 'assinado' },
    reparos: [],
  },
  {
    id: 'demo-3',
    tipo: 'ponto_comercial',
    endereco: 'Rua Comércio, 88 - Loja 2',
    valor_aluguel: 3500,
    imobiliaria: null,
    inquilino: { nome: 'Padaria Bom Pão Ltda', telefone: '(19) 3234-5678' },
    contrato: { data_inicio: '2023-05-15', data_fim: '2026-06-15', status_assinatura: 'pendente' },
    reparos: [
      { id: 'r2', data_inicio: '2025-11-18', data_fim: '2025-11-20', valor: 480, descricao: 'Pintura da fachada' },
      { id: 'r3', data_inicio: '2026-02-10', data_fim: '2026-02-10', valor: 150, descricao: 'Troca de fechadura' },
    ],
  },
  {
    id: 'demo-4',
    tipo: 'casa',
    endereco: 'Rua Girassol, 300',
    valor_aluguel: 1600,
    imobiliaria: null,
    inquilino: { nome: 'Roberto Lima', telefone: '(19) 99456-7890' },
    contrato: { data_inicio: '2025-09-01', data_fim: '2027-03-01', status_assinatura: 'assinado' },
    reparos: [],
  },
  {
    id: 'demo-5',
    tipo: 'casa',
    endereco: 'Rua das Acácias, 77',
    valor_aluguel: 1500,
    imobiliaria: null,
    inquilino: null,
    contrato: null,
    reparos: [],
  },
];