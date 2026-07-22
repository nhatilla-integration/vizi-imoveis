import { useState } from 'react';

const SITE_PASSWORD = process.env.REACT_APP_SITE_PASSWORD;

export function PasswordGate({ children }) {
  const [unlocked, setUnlocked] = useState(
    !SITE_PASSWORD || localStorage.getItem('vizi_unlocked') === 'true'
  );
  const [input, setInput] = useState('');
  const [erro, setErro] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    if (input === SITE_PASSWORD) {
      localStorage.setItem('vizi_unlocked', 'true');
      setUnlocked(true);
    } else {
      setErro(true);
    }
  }

  if (unlocked) return children;

  return (
    <div className="min-h-screen bg-[#1b1611] flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-[#221c17] border border-[#3a3128] rounded-xl p-8 w-full max-w-sm text-center">
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-2xl font-bold text-white mb-1">
          Vizi Imóveis
        </p>
        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-sm text-amber-200/70 italic mb-6">
          Família Gabionetta
        </p>
        <input
          type="password"
          placeholder="Senha de acesso"
          value={input}
          onChange={(e) => { setInput(e.target.value); setErro(false); }}
          className="w-full bg-[#2a231c] text-white text-sm rounded-lg px-3 py-2 border border-[#3a3128] mb-3"
          autoFocus
        />
        {erro && <p className="text-red-400 text-xs mb-3">Senha incorreta, tente novamente.</p>}
        <button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg py-2 transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}