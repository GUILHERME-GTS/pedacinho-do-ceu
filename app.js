// ============================================================
//  app.js — Ponto de entrada principal
//  Pedacinho do Céu
// ============================================================

import { auth, db }     from './firebase.js';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import { renderInicio }   from './pages/inicio.js';
import { renderTarefas }  from './pages/tarefas.js';
import { renderMercado }  from './pages/mercado.js';
import { renderMais }     from './pages/mais.js';

// ── Membros da família ────────────────────────────────────
// Adicione aqui os e-mails de cada membro após criar as contas no Firebase Auth
export const MEMBROS = {
  "Gx3LWCTFVPRAlW74QBX3y2O4SkE2": { nome: "Você", emoji: "🌿", cor: "#F59E0B" },
  "RvRqrodB5jNCVAb0tXmz7bnMVGX2":   { nome: "Arthur", emoji: "🎮", cor: "#8B5CF6" },
  "UgOSSA0XTMeGwTXCEp5I435tDKs2":      { nome: "Mãe", emoji: "🌸", cor: "#EF4444" },
  "ei8TgmYUCscci4M1qqWSFvd5D633":      { nome: "Pai", emoji: "🔧", cor: "#3B82F6" },
};

// ── Estado global ─────────────────────────────────────────
export let usuarioAtual = null;
let paginaAtual = 'inicio';

// ── Roteador ──────────────────────────────────────────────
const rotas = {
  inicio:  { titulo: 'Início',  render: renderInicio  },
  tarefas: { titulo: 'Tarefas', render: renderTarefas },
  mercado: { titulo: 'Mercado', render: renderMercado },
  mais:    { titulo: 'Mais',    render: renderMais    },
};

export function navegarPara(pagina) {
  paginaAtual = pagina;

  // Atualiza nav
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('ativo', btn.dataset.pagina === pagina);
  });

  // Atualiza título
  const rota = rotas[pagina] || rotas['inicio'];
  document.getElementById('titulo-pagina').textContent = rota.titulo;

  // Renderiza conteúdo
  const container = document.getElementById('conteudo-principal');
  container.innerHTML = '<div class="spinner"></div>';
  rota.render(container);
}

// ── Toast ─────────────────────────────────────────────────
export function mostrarToast(msg, duracao = 2500) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('escondido');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.add('escondido'), duracao);
}

// ── Login ─────────────────────────────────────────────────
async function tentarLogin() {
  const email = document.getElementById('login-email').value.trim();
  const senha  = document.getElementById('login-senha').value;
  const erro   = document.getElementById('login-erro');

  if (!email || !senha) {
    erro.textContent = 'Preencha e-mail e senha.';
    erro.classList.remove('escondido');
    return;
  }

  const btn = document.getElementById('btn-login');
  btn.textContent = 'Entrando…';
  btn.disabled = true;

  try {
    await signInWithEmailAndPassword(auth, email, senha);
    erro.classList.add('escondido');
  } catch (e) {
    const msgs = {
      'auth/user-not-found':   'E-mail não encontrado.',
      'auth/wrong-password':   'Senha incorreta.',
      'auth/invalid-email':    'E-mail inválido.',
      'auth/too-many-requests':'Muitas tentativas. Tente mais tarde.',
    };
    erro.textContent = msgs[e.code] || 'Erro ao entrar. Tente novamente.';
    erro.classList.remove('escondido');
  } finally {
    btn.textContent = 'Entrar';
    btn.disabled = false;
  }
}

// ── Inicialização ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Botão login
  document.getElementById('btn-login')?.addEventListener('click', tentarLogin);
  document.getElementById('login-senha')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') tentarLogin();
  });

  // Botão logout
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await signOut(auth);
  });

  // Navegação bottom
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navegarPara(btn.dataset.pagina));
  });

  // Observador de autenticação
  onAuthStateChanged(auth, (usuario) => {
    usuarioAtual = usuario;

    if (usuario) {
      // Usuário logado — mostra app
      document.getElementById('tela-login').classList.add('escondido');
      document.getElementById('app').classList.remove('escondido');

      // Avatar
      const membro = MEMBROS[usuario.uid];
      const avatarEl = document.getElementById('avatar-usuario');
      avatarEl.textContent = membro?.emoji || usuario.email[0].toUpperCase();

      navegarPara('inicio');
    } else {
      // Não logado — mostra login
      document.getElementById('app').classList.add('escondido');
      document.getElementById('tela-login').classList.remove('escondido');
    }
  });

});
