/* ===================================================================
   Solucon · Diagnóstico Estratégico — Lean Company
   Acesso, diagnóstico (frentes expostas), cenários, navegação e progresso.
=================================================================== */

const PASSWORD = "Solucon2026";

/* ---------- Ícones (inline SVG, coerentes por frente) ---------- */
const IC = {
  process:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="12" r="2.5"/><path d="M6 8.5v7M8.4 6.7l7.2 4M8.4 17.3l7.2-4"/></svg>',
  budget:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h4"/><circle cx="17.5" cy="14.5" r="4.2" fill="#fff"/><path d="M17.5 12.5v2l1.3 1.3"/></svg>',
  engineer:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/><path d="M12 4.8V3M9 12.5l-1.5 2M15 12.5l1.5 2"/></svg>',
  integrate:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M9 15l6-6"/><path d="M14 7l1.5-1.5a3.5 3.5 0 0 1 5 5L19 12"/><path d="M10 17l-1.5 1.5a3.5 3.5 0 0 1-5-5L5 12"/></svg>',
  finance:'<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8"><path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="10" width="3" height="7"/></svg>'
};

/* ---------- Frentes de diagnóstico (concisas) ---------- */
const FRENTES = [
  {
    icon:'process', title:'Processos Administrativos', star:false,
    badges:[{t:'Prioridade imediata', c:'badge--prio'},{t:'Foco definido', c:'badge--evid'}],
    summary:'Mapear o fluxo administrativo de ponta a ponta para revelar gargalos e padronizar o que hoje depende de conhecimento individual.',
    delivers:['Processo administrativo mapeado de ponta a ponta','Rotinas e critérios padronizados entre as áreas','Menos retrabalho entre comercial, engenharia e obra']
  },
  {
    icon:'budget', title:'Orçamentação Inteligente', star:false,
    badges:[{t:'Prioridade imediata', c:'badge--prio'},{t:'Desafio relatado', c:'badge--evid'}],
    summary:'Controlar o tempo de cada orçamento e direcionar o esforço da engenharia aos casos com maior potencial de conversão, automatizando o que for repetitivo.',
    delivers:['Etapas do orçamento padronizadas e automatizadas','Priorização por potencial de conversão × esforço','Tempo de cada orçamento medido e sob controle']
  },
  {
    icon:'engineer', title:'Produtividade da Engenharia', star:false,
    badges:[{t:'Prioridade alta', c:'badge--prio-alta'},{t:'Desafio relatado', c:'badge--evid'}],
    summary:'Dar visibilidade ao custo de horas e à ocupação dos engenheiros para liberar capacidade ao que gera mais valor.',
    delivers:['Horas e ocupação medidas por engenheiro e tarefa','Atividades repetitivas identificadas e padronizadas','Mais tempo de engenharia livre para os projetos']
  },
  {
    icon:'integrate', title:'Integração de Sistemas', star:true,
    badges:[{t:'Prioridade alta', c:'badge--prio-alta'},{t:'Oportunidade central', c:'badge--evid'}],
    summary:'A Solucon opera hoje com três sistemas diferentes. Podemos integrá-los e reunir os indicadores em um só lugar — com um dado único e confiável, sem consolidação manual.',
    delivers:['Os três sistemas integrados em uma base única','Indicadores reunidos em um painel central','Fim da consolidação manual e das informações divergentes']
  },
  {
    icon:'finance', title:'Indicadores Financeiros', star:false,
    badges:[{t:'Prioridade alta', c:'badge--prio-alta'},{t:'Frente padrão Lean', c:'badge--evid'}],
    summary:'Estruturar os indicadores financeiros e gerenciais que a Lean sempre implanta, conectando processos e orçamentos ao resultado.',
    delivers:['Indicadores financeiros e gerenciais prioritários','Painel de acompanhamento contínuo','Visão clara de custo, margem e resultado por projeto']
  }
];

/* ---------- Impacto sistêmico ---------- */
const IMPACT = {
  antes:[
    {t:'Orçamentação', d:'Tempo por orçamento sem controle; esforço nem sempre nos casos de maior conversão.'},
    {t:'Engenharia', d:'Horas consumidas em orçamentos, com pouca visibilidade de ocupação e custo.'},
    {t:'Sistemas e indicadores', d:'Três sistemas separados; consolidação manual e informações que divergem.'}
  ],
  depois:[
    {t:'Orçamentação', d:'Funil padronizado que prioriza por conversão e mede o tempo de cada orçamento.'},
    {t:'Engenharia', d:'Ocupação e custo de horas visíveis; mais tempo livre para o que gera valor.'},
    {t:'Sistemas e indicadores', d:'Sistemas integrados e indicadores reunidos em um painel único e confiável.'}
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
  }
  if (sessionStorage.getItem('solucon_ok') === '1') openSite();

  /* ----- Acesso ----- */
  const form = document.getElementById('access-form');
  const pass = document.getElementById('password');
  const errEl = document.getElementById('access-error');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (pass.value === PASSWORD){
      sessionStorage.setItem('solucon_ok','1');
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
    sessionStorage.removeItem('solucon_ok');
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
});
