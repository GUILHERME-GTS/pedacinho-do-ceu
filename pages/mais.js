// ============================================================
//  pages/mais.js — Todos os Módulos
//  Pedacinho do Céu
// ============================================================

// Módulos completos serão desenvolvidos iterativamente.
// Por ora, cada módulo tem uma tela placeholder funcional.

import { db } from '../firebase.js';
import { mostrarToast } from '../app.js';

const MODULOS = [
  { id: 'refeicoes',   emoji: '🍽️', nome: 'Refeições',      desc: 'Cardápio semanal da família',         cor: 'laranja' },
  { id: 'casa',        emoji: '🏡', nome: 'Melhorias',       desc: 'Projetos e reformas da casa',          cor: 'azul'    },
  { id: 'manutencao',  emoji: '🔧', nome: 'Manutenção',      desc: 'Revisão do Fiesta, Corsa e casa',      cor: 'roxo'    },
  { id: 'inventario',  emoji: '📦', nome: 'Inventário',      desc: 'Ferramentas e equipamentos',           cor: 'amarelo' },
  { id: 'horta',       emoji: '🌱', nome: 'Horta',           desc: 'Sementes, legumes e cultivo',          cor: 'verde'   },
  { id: 'contatos',    emoji: '📞', nome: 'Contatos úteis',  desc: 'Mecânico, encanador, emergências',     cor: 'coral'   },
];

export function renderMais(container) {
  container.innerHTML = `
    <div class="pagina">
      <h2 class="secao-titulo">Todos os módulos</h2>
      <p class="secao-subtitulo">Toque para acessar cada área da casa</p>
      <div class="grid-modulos">
        ${MODULOS.map(m => `
          <div class="modulo-card" data-modulo="${m.id}" style="text-align:left">
            <span class="modulo-icone" style="text-align:left">${m.emoji}</span>
            <div class="modulo-nome">${m.nome}</div>
            <div style="font-size:12px;color:var(--texto-sec);margin-top:4px;font-weight:400">${m.desc}</div>
          </div>`).join('')}
      </div>
    </div>
  `;

  container.querySelectorAll('[data-modulo]').forEach(card => {
    card.addEventListener('click', () => {
      const modulo = MODULOS.find(m => m.id === card.dataset.modulo);
      abrirModulo(modulo);
    });
  });
}

function abrirModulo(modulo) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="drawer" style="min-height:60dvh">
      <div class="drawer-handle"></div>
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
        <span style="font-size:36px">${modulo.emoji}</span>
        <div>
          <h3 class="drawer-titulo" style="margin-bottom:0">${modulo.nome}</h3>
          <p style="color:var(--texto-sec);font-size:14px">${modulo.desc}</p>
        </div>
      </div>

      <div class="card" style="background:var(--amarelo-claro);border-color:var(--amarelo);margin-bottom:16px">
        <p style="font-size:14px;color:var(--amarelo-escuro);font-weight:600">
          🚧 Módulo em desenvolvimento
        </p>
        <p style="font-size:13px;color:var(--texto-sec);margin-top:4px">
          Este módulo será desenvolvido na próxima etapa do projeto.
          A estrutura de dados já está definida no Firestore.
        </p>
      </div>

      <p style="font-size:14px;color:var(--texto-sec);line-height:1.6">
        Coleta de dados já planejada:
      </p>
      <div style="margin-top:8px">
        ${getCamposModulo(modulo.id).map(c =>
          `<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--borda-suave)">
            <span style="font-size:18px">${c.emoji}</span>
            <div>
              <div style="font-weight:600;font-size:14px">${c.campo}</div>
              <div style="font-size:12px;color:var(--texto-terciario)">${c.tipo}</div>
            </div>
          </div>`
        ).join('')}
      </div>

      <button class="btn-outline" style="width:100%;margin-top:20px" onclick="this.closest('.overlay').remove()">
        Fechar
      </button>
    </div>
  `;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function getCamposModulo(id) {
  const campos = {
    refeicoes:  [
      { emoji:'📅', campo:'Dia da semana', tipo:'seg, ter, qua...' },
      { emoji:'🥗', campo:'Almoço',        tipo:'texto livre' },
      { emoji:'🌙', campo:'Jantar',        tipo:'texto livre' },
      { emoji:'🔥', campo:'Observações',   tipo:'texto livre' },
    ],
    casa: [
      { emoji:'🏷️', campo:'Título',       tipo:'texto' },
      { emoji:'🔨', campo:'Materiais',     tipo:'lista de itens' },
      { emoji:'⚡', campo:'Prioridade',    tipo:'baixa / média / alta' },
      { emoji:'📊', campo:'Status',        tipo:'ideia → planejado → concluído' },
    ],
    manutencao: [
      { emoji:'🚗', campo:'Veículo / área', tipo:'Fiesta, Corsa, Casa' },
      { emoji:'📅', campo:'Próxima data',   tipo:'data' },
      { emoji:'🔄', campo:'Periodicidade',  tipo:'mensal, semestral...' },
      { emoji:'📝', campo:'Observações',    tipo:'texto' },
    ],
    inventario: [
      { emoji:'📛', campo:'Nome',           tipo:'ex: Bomba da piscina' },
      { emoji:'🏷️', campo:'Marca/modelo',  tipo:'texto' },
      { emoji:'📍', campo:'Localização',   tipo:'onde está guardado' },
      { emoji:'🔧', campo:'Próx. manutenção', tipo:'data' },
    ],
    horta: [
      { emoji:'🌿', campo:'Planta',        tipo:'ex: Tomate cereja' },
      { emoji:'📦', campo:'Tipo',          tipo:'semente / muda / plantado' },
      { emoji:'📅', campo:'Data plantio',  tipo:'data' },
      { emoji:'✂️', campo:'Insumos',       tipo:'adubo, água, etc' },
    ],
    contatos: [
      { emoji:'👤', campo:'Nome',          tipo:'ex: João — Mecânico' },
      { emoji:'📱', campo:'Telefone',      tipo:'(11) 9xxxx-xxxx' },
      { emoji:'🏷️', campo:'Categoria',    tipo:'mecânico, encanador...' },
      { emoji:'📝', campo:'Observações',   tipo:'horários, referência' },
    ],
  };
  return campos[id] || [];
}
