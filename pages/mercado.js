// ============================================================
//  pages/mercado.js — Lista de Mercado Compartilhada
//  Pedacinho do Céu
// ============================================================

import { db } from '../firebase.js';
import { usuarioAtual, mostrarToast } from '../app.js';
import {
  collection, addDoc, onSnapshot,
  doc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export function renderMercado(container) {
  container.innerHTML = `
    <div class="pagina" id="pg-mercado">
      <h2 class="secao-titulo">🛒 Lista de Mercado</h2>
      <p class="secao-subtitulo">Sincronizada em tempo real para toda a família</p>

      <!-- Adicionar item rápido -->
      <div style="display:flex;gap:8px;margin-bottom:20px">
        <input
          type="text"
          id="input-item"
          placeholder="Adicionar item..."
          style="flex:1;padding:12px 14px;border:1.5px solid var(--borda);border-radius:var(--raio-sm);background:var(--fundo-card);color:var(--texto-primario);outline:none;font-family:inherit;font-size:15px"
        />
        <button class="btn-primario" id="btn-add-item" style="width:auto;padding:12px 20px;margin-top:0">
          Adicionar
        </button>
      </div>

      <!-- Pendentes -->
      <div id="lista-mercado-pendente"></div>

      <!-- Comprados -->
      <div id="secao-comprados" style="margin-top:24px" class="escondido">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <span style="font-weight:700;font-size:15px;color:var(--texto-sec)">Já comprado</span>
          <button class="btn-outline" id="btn-limpar-comprados" style="font-size:12px;padding:6px 12px">
            Limpar lista
          </button>
        </div>
        <div id="lista-mercado-comprado"></div>
      </div>
    </div>
  `;

  // Escuta em tempo real
  const q = query(collection(db, 'mercado'), orderBy('criadoEm', 'asc'));
  onSnapshot(q, (snap) => {
    const itens = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderItens(itens);
  });

  // Adicionar item
  const input = container.querySelector('#input-item');
  const btnAdd = container.querySelector('#btn-add-item');

  const adicionarItem = async () => {
    const texto = input.value.trim();
    if (!texto) return;
    input.value = '';
    await addDoc(collection(db, 'mercado'), {
      item:           texto,
      comprado:       false,
      adicionadoPor:  usuarioAtual?.uid,
      criadoEm:       serverTimestamp(),
    });
    mostrarToast('🛒 Item adicionado!');
  };

  btnAdd.addEventListener('click', adicionarItem);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') adicionarItem(); });

  // Limpar comprados
  container.querySelector('#btn-limpar-comprados')?.addEventListener('click', async () => {
    if (!confirm('Limpar todos os itens comprados?')) return;
    const q2 = query(collection(db, 'mercado'));
    // Deleta apenas os comprados
    const snap = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js")
      .then(m => m.getDocs(q2));
    const batch = [];
    snap.forEach(d => { if (d.data().comprado) batch.push(deleteDoc(doc(db, 'mercado', d.id))); });
    await Promise.all(batch);
    mostrarToast('✨ Lista limpa!');
  });
}

function renderItens(itens) {
  const pendentes  = itens.filter(i => !i.comprado);
  const comprados  = itens.filter(i => i.comprado);

  const listaPend = document.getElementById('lista-mercado-pendente');
  const listaComp = document.getElementById('lista-mercado-comprado');
  const secaoComp = document.getElementById('secao-comprados');
  if (!listaPend) return;

  if (pendentes.length === 0) {
    listaPend.innerHTML = `
      <div class="estado-vazio">
        <span class="vazio-icone">🎉</span>
        <p>Lista vazia! Adicione itens acima.</p>
      </div>`;
  } else {
    listaPend.innerHTML = pendentes.map(i => itemHTML(i)).join('');
    bindEventos(listaPend);
  }

  if (comprados.length > 0) {
    secaoComp?.classList.remove('escondido');
    if (listaComp) {
      listaComp.innerHTML = comprados.map(i => itemHTML(i)).join('');
      bindEventos(listaComp);
    }
  } else {
    secaoComp?.classList.add('escondido');
  }
}

function itemHTML(item) {
  return `
    <div class="lista-item ${item.comprado ? 'concluido' : ''}" data-id="${item.id}">
      <div class="checkbox-custom ${item.comprado ? 'marcado' : ''}"
        data-toggle="${item.id}" role="checkbox" aria-checked="${item.comprado}" tabindex="0"
        style="border-radius:50%">
        ${item.comprado ? '✓' : ''}
      </div>
      <div class="item-titulo" style="flex:1">${item.item}</div>
      <button class="btn-icone" data-delete="${item.id}" aria-label="Remover item" style="color:var(--texto-terciario)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>`;
}

function bindEventos(container) {
  container.querySelectorAll('[data-toggle]').forEach(cb => {
    cb.addEventListener('click', async () => {
      const marcado = cb.classList.contains('marcado');
      await updateDoc(doc(db, 'mercado', cb.dataset.toggle), { comprado: !marcado });
    });
  });
  container.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await deleteDoc(doc(db, 'mercado', btn.dataset.delete));
    });
  });
}
