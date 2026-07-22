import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { seedImoveis } from '../data/seedImoveis';

export function useImoveis() {
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(!isSupabaseConfigured);

  const fetchImoveis = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setImoveis(seedImoveis);
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('imoveis')
      .select(`
        *,
        inquilino:inquilinos(nome, telefone),
        contrato:contratos(data_inicio, data_fim, status_assinatura),
        reparos(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar imóveis do Supabase:', error.message);
      setImoveis(seedImoveis);
      setIsDemoMode(true);
    } else {
      const normalizado = data.map((item) => ({
        ...item,
        inquilino: item.inquilino?.[0] || null,
        contrato: item.contrato?.[0] || null,
      }));
      setImoveis(normalizado);
      setIsDemoMode(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImoveis();
  }, [fetchImoveis]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('imoveis-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'imoveis' }, () => {
        fetchImoveis();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contratos' }, () => {
        fetchImoveis();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reparos' }, () => {
        fetchImoveis();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchImoveis]);

  async function criarImovel({ tipo, endereco, valor_aluguel, imobiliaria, ocupado, inquilino, contrato }) {
    if (isDemoMode) {
      setImoveis((prev) => [
        {
          id: `demo-${Date.now()}`,
          tipo,
          endereco,
          valor_aluguel,
          imobiliaria,
          inquilino: ocupado ? inquilino : null,
          contrato: ocupado ? contrato : null,
          reparos: [],
        },
        ...prev,
      ]);
      return;
    }

    const { data: imovelCriado, error: erroImovel } = await supabase
      .from('imoveis')
      .insert([{ tipo, endereco, valor_aluguel, imobiliaria }])
      .select()
      .single();

    if (erroImovel) {
      console.error('Erro ao criar imóvel:', erroImovel.message);
      return;
    }

    if (!ocupado) return;

    const { data: inquilinoCriado, error: erroInquilino } = await supabase
      .from('inquilinos')
      .insert([{ imovel_id: imovelCriado.id, nome: inquilino.nome, telefone: inquilino.telefone }])
      .select()
      .single();

    if (erroInquilino) {
      console.error('Erro ao criar inquilino:', erroInquilino.message);
      return;
    }

    const { error: erroContrato } = await supabase.from('contratos').insert([
      {
        imovel_id: imovelCriado.id,
        inquilino_id: inquilinoCriado.id,
        data_inicio: contrato.data_inicio,
        data_fim: contrato.data_fim,
        status_assinatura: contrato.status_assinatura,
      },
    ]);

    if (erroContrato) {
      console.error('Erro ao criar contrato:', erroContrato.message);
    }
  }

  async function adicionarReparo(imovelId, { data_inicio, data_fim, valor, descricao }) {
    if (isDemoMode) {
      setImoveis((prev) =>
        prev.map((im) =>
          im.id === imovelId
            ? { ...im, reparos: [...(im.reparos || []), { id: `r-${Date.now()}`, data_inicio, data_fim, valor, descricao }] }
            : im
        )
      );
      return;
    }

    const { error } = await supabase.from('reparos').insert([{ imovel_id: imovelId, data_inicio, data_fim, valor, descricao }]);
    if (error) console.error('Erro ao adicionar reparo:', error.message);
  }

  async function excluirImovel(id) {
    if (isDemoMode) {
      setImoveis((prev) => prev.filter((im) => im.id !== id));
      return;
    }

    const { error } = await supabase.from('imoveis').delete().eq('id', id);
    if (error) console.error('Erro ao excluir imóvel:', error.message);
  }

  return { imoveis, loading, isDemoMode, criarImovel, adicionarReparo, excluirImovel };
}