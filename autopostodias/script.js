/* ===================================================================
   Auto Posto Dias · Diagnóstico Estratégico — Lean Company
   Acesso, diagnóstico (frentes expostas), cenários, navegação e progresso.
=================================================================== */

const PASSWORD = "PostoDias2026";

/* ---------- Ícones (inline SVG, coerentes por frente) ---------- */
const IC = {
  control:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 4v2.2M12 17.8V20M20 12h-2.2M6.2 12H4M17.2 6.8l-1.6 1.6M8.4 15.6l-1.6 1.6M17.2 17.2l-1.6-1.6M8.4 8.4L6.8 6.8"/></svg>',
  finance:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="10" width="3" height="7"/></svg>',
  commercial:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M20.5 8.5 15 3H9L3.5 8.5"/><path d="M3.5 8.5H20.5V19a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2z"/><path d="M9 12a3 3 0 0 0 6 0"/></svg>',
  stock:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M12 3 3 7.5 12 12l9-4.5z"/><path d="M3 7.5V16l9 4.5 9-4.5V7.5"/><path d="M12 12v8.5"/></svg>',
  purchases:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6"/></svg>',
  people:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><circle cx="17.5" cy="9" r="2.6"/><path d="M15.2 20a5.2 5.2 0 0 1 6.3-4.8"/></svg>'
};

/* ---------- Frentes de diagnóstico (concisas) ---------- */
const FRENTES = [
  {
    icon:'control', title:'Estrutura e Controles', star:true,
    badges:[{t:'Prioridade imediata', c:'badge--prio'},{t:'Desafio relatado', c:'badge--evid'}],
    summary:'A conveniência ainda não tem um sistema de controle adequado. Os proprietários permanecem no caixa, o que reduz o risco de fraude mas não gera dado gerencial da operação. Esse é o passo anterior a qualquer indicador.',
    delivers:['Sistema de controle implantado na conveniência','Processos e responsável pelos lançamentos definidos e treinados','Base de dados validada para sustentar os indicadores']
  },
  {
    icon:'finance', title:'Financeiro', star:false,
    badges:[{t:'Prioridade alta', c:'badge--prio-alta'},{t:'Desafio relatado', c:'badge--evid'}],
    summary:'Hoje não há resposta segura para quanto cada unidade fatura, gera de margem ou de lucro. A Lean estrutura o financeiro por posto e pela distribuidora, com o consolidado do grupo.',
    delivers:['Faturamento, custo, margem e lucro por unidade','Fluxo de caixa, contas a receber e inadimplência','Resultado consolidado do grupo']
  },
  {
    icon:'commercial', title:'Comercial e Produtos', star:false,
    badges:[{t:'Prioridade alta', c:'badge--prio-alta'},{t:'Desafio relatado', c:'badge--evid'}],
    summary:'Não há controle de vendas por produto, giro ou margem na conveniência. A Lean organiza essa leitura para orientar precificação e mix.',
    delivers:['Vendas e margem por produto','Produtos de maior e menor giro','Análise de precificação']
  },
  {
    icon:'stock', title:'Estoque', star:false,
    badges:[{t:'Oportunidade estratégica', c:'badge--evid'}],
    summary:'Entradas, saídas e perdas de produto ainda não são acompanhadas de forma estruturada, o que dificulta saber o que falta e o que sobra.',
    delivers:['Controle de entradas, saídas e giro','Identificação de rupturas e necessidade de reposição','Mapeamento de perdas']
  },
  {
    icon:'purchases', title:'Compras', star:false,
    badges:[{t:'Oportunidade estratégica', c:'badge--evid'}],
    summary:'Volume, frequência e a relação entre compras e vendas ainda não são analisados, o que limita a visão sobre o impacto na margem e no caixa.',
    delivers:['Análise de volume e frequência de compras','Relação entre compras e vendas','Oportunidades de melhoria na negociação']
  },
  {
    icon:'people', title:'Pessoas e Operação', star:false,
    badges:[{t:'Ponto a validar', c:'badge--evid'}],
    summary:'Ainda não há clareza sobre o dimensionamento das equipes nem sobre a distribuição de responsabilidades entre os postos e a distribuidora.',
    delivers:['Dimensionamento da equipe por unidade','Distribuição de responsabilidades','Estrutura de gestão que reduz a dependência dos proprietários']
  }
];

/* ---------- Impacto sistêmico ---------- */
const IMPACT = {
  antes:[
    {t:'Controles e dados', d:'Caixa acompanhado pelos próprios donos, sem sistema estruturado nem dado confiável sobre a operação da conveniência.'},
    {t:'Gestão por unidade', d:'Resultado dos dois postos e da distribuidora sem separação clara, dificultando saber onde está o problema ou a oportunidade.'},
    {t:'Papel dos proprietários', d:'Donos no caixa e no operacional diário, com pouco tempo para decisão estratégica.'}
  ],
  depois:[
    {t:'Controles e dados', d:'Sistema implantado, processos padronizados e dados validados para sustentar os indicadores.'},
    {t:'Gestão por unidade', d:'Faturamento, margem e lucro visíveis por unidade, com o consolidado do grupo.'},
    {t:'Papel dos proprietários', d:'Donos acompanhando indicadores, priorizando investimentos e decidindo com dado, não com presença física.'}
  ]
};

/* =================================================================
   INICIALIZAÇÃO
================================================================= */
document.addEventListener('DOMContentLoaded', () => {

  const accessEl = document.getElementById('access');
  const siteEl = document.getElementById('site');

  function openSite(){
    accessEl.style.display = 'none';
    siteEl.hidden = false;
    window.scrollTo(0,0);
    onScroll();
  }

  /* ----- Acesso ----- */
  const form = document.getElementById('access-form');
  const pass = document.getElementById('password');
  const errEl = document.getElementById('access-error');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (pass.value === PASSWORD){
      sessionStorage.setItem('autopostodias_ok','1');
      errEl.hidden = true;
      openSite();
    } else {
      errEl.hidden = false;
      pass.value = '';
      pass.focus();
    }
  });

  const toggle = document.getElementById('toggle-pass');
  toggle.addEventListener('click', () => {
    const show = pass.type === 'password';
    pass.type = show ? 'text' : 'password';
    toggle.textContent = show ? 'Ocultar' : 'Mostrar';
    toggle.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
  });

  document.getElementById('logout').addEventListener('click', () => {
    sessionStorage.removeItem('autopostodias_ok');
    location.reload();
  });

  /* ----- Diagnóstico (frentes expostas) ----- */
  document.getElementById('diag-grid').innerHTML = FRENTES.map((f, i) => `
    <article class="dcard ${f.star ? 'dcard--star' : ''}">
      <div class="dcard__head">
        <span class="dcard__ic">${IC[f.icon]}</span>
        <div>
          <span class="dcard__num">Frente ${String(i+1).padStart(2,'0')}</span>
          <h4 class="dcard__title">${f.title}</h4>
        </div>
      </div>
      <div class="dcard__badges">${f.badges.map(b=>`<span class="badge ${b.c}">${b.t}</span>`).join('')}</div>
      <p class="dcard__summary">${f.summary}</p>
      <span class="dcard__label">O que a Lean entrega</span>
      <ul>${f.delivers.map(d=>`<li>${d}</li>`).join('')}</ul>
    </article>`).join('');

  /* ----- Impacto sistêmico ----- */
  const impactGrid = document.getElementById('impact-grid');
  function renderImpact(scn){
    const after = scn==='depois';
    impactGrid.innerHTML = IMPACT[scn].map(c=>`
      <div class="impact__card ${after?'is-after':''}">
        <span class="impact__tag ${after?'impact__tag--next':'impact__tag--now'}">${after?'Após as melhorias':'Cenário atual'}</span>
        <h4>${c.t}</h4>
        <p>${c.d}</p>
      </div>`).join('');
  }
  renderImpact('antes');
  document.querySelectorAll('.switch__btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.switch__btn').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderImpact(btn.dataset.scenario);
    });
  });

  /* ----- Menu mobile ----- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('menu-toggle');
  burger.addEventListener('click',()=>{
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open?'true':'false');
  });
  nav.querySelectorAll('.nav__link').forEach(l=>l.addEventListener('click',()=>{
    nav.classList.remove('is-open');
    burger.setAttribute('aria-expanded','false');
  }));

  /* ----- Progresso + navegação ativa ----- */
  const bar = document.getElementById('progress-bar');
  const sections = [...document.querySelectorAll('section[id]')];
  const links = [...nav.querySelectorAll('.nav__link')];
  function onScroll(){
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    bar.style.width = Math.min(100, scrolled*100) + '%';
    let current = sections[0]?.id;
    const y = h.scrollTop + 120;
    sections.forEach(s=>{ if(s.offsetTop <= y) current = s.id; });
    links.forEach(l=>l.classList.toggle('is-active', l.getAttribute('href') === '#'+current));
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ----- Restaurar sessão (depois que bar/sections/links já existem) ----- */
  if (sessionStorage.getItem('autopostodias_ok') === '1') openSite();
});
