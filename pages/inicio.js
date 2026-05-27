// ============================================================
//  pages/inicio.js — Página inicial / Dashboard
//  Pedacinho do Céu
// ============================================================

import { db } from '../firebase.js';
import { usuarioAtual, MEMBROS, navegarPara } from '../app.js';
import {
  collection, onSnapshot, query,
  where, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function renderInicio(container) {
  const membro = MEMBROS[usuarioAtual?.uid];
  const saudacao = saudacaoHora();
  const nome = membro?.nome || 'Família';

  container.innerHTML = `
    <div class="pagina">

      <!-- Boas-vindas -->
      <div style="margin-bottom:24px">
        <h2 style="font-family:'Nunito',sans-serif;font-weight:800;font-size:24px;line-height:1.2">
          ${saudacao},<br>${membro?.emoji || '🌿'} ${nome}!
        </h2>
        <p style="color:var(--texto-sec);margin-top:4px;font-size:15px">
          ${dataHoje()}
        </p>
      </div>

      <!-- Cards de resumo -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px">
        <div class="card" id="resumo-tarefas" style="cursor:pointer;background:var(--amarelo-claro);border-color:var(--amarelo)">
          <div style="font-size:28px;margin-bottom:4px">📋</div>
          <div id="count-tarefas" style="font-family:'Nunito',sans-serif;font-weight:800;font-size:28px;color:var(--amarelo-escuro)">–</div>
          <div style="font-size:13px;color:var(--amarelo-escuro);font-weight:600">tarefas pendentes</div>
        </div>
        <div class="card" id="resumo-mercado" style="cursor:pointer;background:var(--verde-claro);border-color:var(--verde)">
          <div style="font-size:28px;margin-bottom:4px">🛒</div>
          <div id="count-mercado" style="font-family:'Nunito',sans-serif;font-weight:800;font-size:28px;color:var(--verde-escuro)">–</div>
          <div style="font-size:13px;color:var(--verde-escuro);font-weight:600">itens no mercado</div>
        </div>
      </div>

      <!-- Minhas tarefas -->
      <h3 class="secao-titulo" style="font-size:16px">Minhas tarefas de hoje</h3>
      <div id="minhas-tarefas"><div class="spinner" style="margin:20px auto"></div></div>

      <!-- Acesso rápido -->
      <h3 class="secao-titulo" style="font-size:16px;margin-top:24px">Acesso rápido</h3>
      <div class="grid-modulos" style="grid-template-columns:repeat(3,1fr)">
        ${[
          { pagina:'tarefas',  emoji:'📋', nome:'Tarefas' },
          { pagina:'mercado',  emoji:'🛒', nome:'Mercado' },
          { pagina:'mais',     emoji:'🌱', nome:'Horta'   },
          { pagina:'mais',     emoji:'🔧', nome:'Casa'    },
          { pagina:'mais',     emoji:'📞', nome:'Contatos'},
          { pagina:'mais',     emoji:'🍽️', nome:'Refeições'},
        ].map(m => `
          <div class="modulo-card" data-nav="${m.pagina}">
            <span class="modulo-icone">${m.emoji}</span>
            <div class="modulo-nome">${m.nome}</div>
          </div>`).join('')}
      </div>

    </div>
  `;

  // Contador de tarefas pendentes
  onSnapshot(
    query(collection(db, 'tarefas'), where('status', '==', 'pendente')),
    snap => {
      const el = document.getElementById('count-tarefas');
      if (el) el.textContent = snap.size;
    }
  );

  // Contador de mercado
  onSnapshot(
    query(collection(db, 'mercado'), where('comprado', '==', false)),
    snap => {
      const el = document.getElementById('count-mercado');
      if (el) el.textContent = snap.size;
    }
  );

  // Minhas tarefas
  if (usuarioAtual) {
    onSnapshot(
      query(
        collection(db, 'tarefas'),
        where('atribuidaPara', '==', usuarioAtual.uid),
        where('status', '==', 'pendente'),
        orderBy('criadaEm', 'desc'),
        limit(5)
      ),
      snap => {
        const el = document.getElementById('minhas-tarefas');
        if (!el) return;
        if (snap.empty) {
          el.innerHTML = `<div class="estado-vazio" style="padding:20px"><span class="vazio-icone" style="font-size:32px">🎉</span><p>Sem tarefas para você hoje!</p></div>`;
          return;
        }
        el.innerHTML = snap.docs.map(d => {
          const t = d.data();
          return `<div class="lista-item">
            <div class="checkbox-custom" style="border-radius:50%"></div>
            <span class="item-titulo">${t.titulo}</span>
          </div>`;
        }).join('');
      }
    );
  }

  // Navegação dos cards de resumo
  document.getElementById('resumo-tarefas')?.addEventListener('click', () => navegarPara('tarefas'));
  document.getElementById('resumo-mercado')?.addEventListener('click', () => navegarPara('mercado'));
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => navegarPara(el.dataset.nav));
  });
}

function saudacaoHora() {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function dataHoje() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long'
  });
}
