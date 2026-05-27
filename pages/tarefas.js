// ============================================================
//  pages/tarefas.js — Módulo de Tarefas
//  Pedacinho do Céu
// ============================================================

import { db } from '../firebase.js';
import { usuarioAtual, MEMBROS, mostrarToast } from '../app.js';
import {
  collection, addDoc, onSnapshot,
  doc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let unsubscribe = null;

export function renderTarefas(container) {
  container.innerHTML = `
    <div class="pagina" id="pg-tarefas">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
        <div>
          <h2 class="secao-titulo" style="margin-bottom:2px">Tarefas</h2>
          <p class="secao-subtitulo" style="margin-bottom:0">O que precisa ser feito</p>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn-outline chip-filtro ativo" data-filtro="todas" style="font-size:13px;padding:8px 14px">Todas</button>
          <button class="btn-outline chip-filtro" data-filtro="pendente" style="font-size:13px;padding:8px 14px">Pendentes</button>
        </div>
      </div>
      <div id="lista-tarefas"><div class="spinner"></div></div>
    </div>
    <button class="btn-fab" id="btn-nova-tarefa" aria-label="Nova tarefa">+</button>
  `;

  // Escuta em tempo real do Firestore
  const q = query(collection(db, 'tarefas'), orderBy('criadaEm', 'desc'));
  unsubscribe = onSnapshot(q, (snap) => {
    const tarefas = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    const filtro = document.querySelector('.chip-filtro.ativo')?.dataset.filtro || 'todas';
    renderListaTarefas(tarefas, filtro);
  });

  // Filtros
  container.addEventListener('click', e => {
    if (e.target.classList.contains('chip-filtro')) {
      document.querySelectorAll('.chip-filtro').forEach(b => b.classList.remove('ativo'));
      e.target.classList.add('ativo');
    }
  });

  // Botão nova tarefa
  document.getElementById('btn-nova-tarefa')?.addEventListener('click', () => {
    abrirDrawerNovaTarefa();
  });
}

function renderListaTarefas(tarefas, filtro) {
  const lista = document.getElementById('lista-tarefas');
  if (!lista) return;

  const filtradas = filtro === 'todas' ? tarefas :
    tarefas.filter(t => t.status === filtro);

  if (filtradas.length === 0) {
    lista.innerHTML = `
      <div class="estado-vazio">
        <span class="vazio-icone">✅</span>
        <p>Nenhuma tarefa aqui!</p>
      </div>`;
    return;
  }

  lista.innerHTML = filtradas.map(t => {
    const concluida = t.status === 'concluida';
    const membro = MEMBROS[t.atribuidaPara];
    const dataLimite = t.dataLimite?.toDate?.();
    const dataStr = dataLimite
      ? dataLimite.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      : '';

    return `
      <div class="lista-item ${concluida ? 'concluido' : ''}" data-id="${t.id}">
        <div class="checkbox-custom ${concluida ? 'marcado' : ''}" data-id="${t.id}" role="checkbox" aria-checked="${concluida}" tabindex="0">
          ${concluida ? '✓' : ''}
        </div>
        <div style="flex:1;min-width:0">
          <div class="item-titulo">${t.titulo}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
            ${membro ? `<span class="chip chip-roxo">${membro.emoji} ${membro.nome}</span>` : ''}
            ${dataStr ? `<span class="chip chip-amarelo">📅 ${dataStr}</span>` : ''}
          </div>
        </div>
        <button class="btn-icone" data-delete="${t.id}" aria-label="Excluir tarefa" style="color:var(--texto-terciario)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
          </svg>
        </button>
      </div>`;
  }).join('');

  // Marcar/desmarcar
  lista.querySelectorAll('.checkbox-custom').forEach(cb => {
    cb.addEventListener('click', () => alternarStatus(cb.dataset.id));
    cb.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') alternarStatus(cb.dataset.id); });
  });

  // Deletar
  lista.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      excluirTarefa(btn.dataset.delete);
    });
  });
}

async function alternarStatus(id) {
  const ref = doc(db, 'tarefas', id);
  // Lê estado atual da lista
  const item = document.querySelector(`.checkbox-custom[data-id="${id}"]`);
  const novoStatus = item?.classList.contains('marcado') ? 'pendente' : 'concluida';
  await updateDoc(ref, { status: novoStatus });
  mostrarToast(novoStatus === 'concluida' ? '✅ Tarefa concluída!' : 'Tarefa reaberta');
}

async function excluirTarefa(id) {
  if (!confirm('Excluir esta tarefa?')) return;
  await deleteDoc(doc(db, 'tarefas', id));
  mostrarToast('🗑️ Tarefa excluída');
}

function abrirDrawerNovaTarefa() {
  const membrosOpts = Object.entries(MEMBROS)
    .map(([uid, m]) => {
      // Lógica inteligente: se o UID do membro for igual ao de quem está logado, 
      // mostramos "Você", senão mostramos o nome real dele
      const nomeExibido = (uid === usuarioAtual?.uid) ? "Você" : m.nome;
      return `<option value="${uid}">${m.emoji} ${nomeExibido}</option>`;
    })
    .join('');

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="drawer">
      <div class="drawer-handle"></div>
      <h3 class="drawer-titulo">Nova tarefa</h3>
      <div class="campo">
        <label>Título *</label>
        <input type="text" id="tarefa-titulo" placeholder="Ex: Lavar o quintal" maxlength="80" />
      </div>
      <div class="campo">
        <label>Atribuir para</label>
        <select id="tarefa-responsavel">
          <option value="">Toda a família</option>
          ${membrosOpts}
        </select>
      </div>
      <div class="campo">
        <label>Data limite</label>
        <input type="date" id="tarefa-data" />
      </div>
      <div style="display:flex;gap:12px;margin-top:8px">
        <button class="btn-outline" id="fechar-drawer" style="flex:1">Cancelar</button>
        <button class="btn-primario" id="salvar-tarefa" style="margin-top:0;flex:2">Salvar</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('#fechar-drawer').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

  overlay.querySelector('#salvar-tarefa').addEventListener('click', async () => {
    const titulo = overlay.querySelector('#tarefa-titulo').value.trim();
    if (!titulo) { mostrarToast('⚠️ Informe o título'); return; }

    const responsavel = overlay.querySelector('#tarefa-responsavel').value;
    const dataVal     = overlay.querySelector('#tarefa-data').value;

    await addDoc(collection(db, 'tarefas'), {
      titulo,
      atribuidaPara: responsavel || null,
      dataLimite:    dataVal ? new Date(dataVal + 'T00:00:00') : null,
      status:        'pendente',
      criadaPor:     usuarioAtual?.uid,
      criadaEm:      serverTimestamp(),
    });

    overlay.remove();
    mostrarToast('🎉 Tarefa criada!');
  });
}
