const ACCESS_HASH = '107575f6';
const ACCESS_KEY = 'torrezan-diagnostico-access';

function fnv1a(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

const body = document.body;
const accessGate = document.getElementById('accessGate');
const siteShell = document.getElementById('siteShell');
const accessForm = document.getElementById('accessForm');
const accessPassword = document.getElementById('accessPassword');
const accessFeedback = document.getElementById('accessFeedback');
const passwordToggle = document.getElementById('passwordToggle');

function unlockSite() {
  sessionStorage.setItem(ACCESS_KEY, 'granted');
  body.classList.remove('locked');
  body.classList.add('unlocked');
  accessGate.setAttribute('aria-hidden', 'true');
  siteShell.setAttribute('aria-hidden', 'false');
}

function lockSite() {
  sessionStorage.removeItem(ACCESS_KEY);
  body.classList.add('locked');
  body.classList.remove('unlocked');
  accessGate.setAttribute('aria-hidden', 'false');
  siteShell.setAttribute('aria-hidden', 'true');
  accessPassword.value = '';
  accessFeedback.textContent = '';
  document.getElementById('mobileNav')?.classList.remove('open');
  setTimeout(() => accessPassword.focus(), 60);
}

if (sessionStorage.getItem(ACCESS_KEY) === 'granted') {
  unlockSite();
} else {
  setTimeout(() => accessPassword.focus(), 120);
}

accessForm.addEventListener('submit', event => {
  event.preventDefault();
  const password = accessPassword.value.trim();
  const submit = accessForm.querySelector('.access-submit');

  if (!password) {
    accessFeedback.textContent = 'Digite a senha para continuar.';
    accessPassword.focus();
    return;
  }

  submit.disabled = true;
  accessFeedback.classList.remove('success');

  setTimeout(() => {
    if (fnv1a(password) === ACCESS_HASH) {
      accessFeedback.textContent = 'Acesso autorizado.';
      accessFeedback.classList.add('success');
      setTimeout(unlockSite, 180);
    } else {
      accessFeedback.textContent = 'Senha incorreta. Verifique e tente novamente.';
      accessPassword.select();
      const card = document.querySelector('.access-card');
      card.classList.remove('shake');
      requestAnimationFrame(() => card.classList.add('shake'));
    }
    submit.disabled = false;
  }, 220);
});

passwordToggle.addEventListener('click', () => {
  const visible = accessPassword.type === 'text';
  accessPassword.type = visible ? 'password' : 'text';
  passwordToggle.setAttribute('aria-pressed', String(!visible));
  passwordToggle.setAttribute('aria-label', visible ? 'Mostrar senha' : 'Ocultar senha');
  accessPassword.focus();
});

document.getElementById('logoutButton').addEventListener('click', lockSite);
document.getElementById('mobileLogoutButton').addEventListener('click', lockSite);

const icons = {
  integration: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/><path d="M16.5 3.5 19 6l-2.5 2.5M7.5 20.5 5 18l2.5-2.5"/></svg>`,
  finance: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5h16v11H4zM7 7.5V5h10v2.5M8 13h2l1.2-2.2 2 4.1 1.4-2.2H17"/></svg>`,
  fuel: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v14H6zM15 9h2l2 2v7a1 1 0 0 1-2 0v-3h-2M8.5 8h4"/></svg>`,
  distribution: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 9h4M4 3h9"/></svg>`,
  margin: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19h16M7 16V9M12 16V5M17 16v-7"/><path d="m6 7 5-4 4 3 4-3"/></svg>`,
  network: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8h8v8H8zM4 4h4v4H4zM16 4h4v4h-4zM4 16h4v4H4zM16 16h4v4h-4zM8 6h8M8 18h8M6 8v8M18 8v8"/></svg>`,
  customer: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><path d="M3 19c0-3 2.2-5 5-5s5 2 5 5M16 8h5M18.5 5.5v5M15 15h6M15 19h4"/></svg>`
};

const serviceIcons = {
  fuel: icons.fuel,
  distribution: icons.distribution,
  store: `<svg viewBox="0 0 24 24"><path d="M4 9h16l-1-5H5L4 9ZM5 9v11h14V9M8 20v-6h8v6M3 9h18"/></svg>`,
  oil: `<svg viewBox="0 0 24 24"><path d="M4 9h10l3 3v6H4zM7 9V6h5v3M17 12l3-3M20 9h2M8 15h5"/></svg>`,
  truck: `<svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/></svg>`,
  wash: `<svg viewBox="0 0 24 24"><path d="M12 3s5 5.5 5 10a5 5 0 0 1-10 0c0-4.5 5-10 5-10ZM9 14c.6 1.3 1.5 2 3 2"/></svg>`
};

document.querySelectorAll('[data-service-icon]').forEach(element => {
  element.innerHTML = serviceIcons[element.dataset.serviceIcon];
});

const diagnostics = [
  {
    hash: 'diagnostico-integracao',
    icon: 'integration',
    title: 'Integração e automação',
    fullTitle: 'Integração e automação gerencial',
    priority: 'Prioridade alta',
    evidence: 'Contexto informado · validar na imersão',
    problemTitle: 'Contexto atual',
    summary: 'A Torrezan já possui controles relevantes. A oportunidade está em reduzir o esforço manual necessário para consolidar informações dos nove postos, da distribuidora e das diferentes frentes da operação.',
    problems: [
      'A consolidação das informações dos postos, da distribuidora e dos serviços exige esforço manual.',
      'Parte das análises depende da organização e do tratamento recorrente de relatórios.',
      'O crescimento da rede aumenta a quantidade de informações que precisam ser reunidas e comparadas.'
    ],
    risks: [
      'Tempo excessivo dedicado à preparação das análises.',
      'Dependência de pessoas específicas para consolidar e interpretar informações.',
      'Menor velocidade para transformar os controles existentes em decisões práticas.'
    ],
    actions: [
      'Mapear os controles atuais e preservar as rotinas que já funcionam bem.',
      'Padronizar critérios, formatos e responsáveis pela consolidação.',
      'Automatizar a integração dos dados e a atualização dos indicadores gerenciais.'
    ],
    impacts: [
      'Redução significativa do trabalho manual.',
      'Análises mais rápidas, recorrentes e comparáveis.',
      'Mais tempo da equipe dedicado à interpretação e à tomada de decisão.'
    ]
  },
  {
    hash: 'diagnostico-financeiro',
    icon: 'finance',
    title: 'Análises financeiras',
    fullTitle: 'Análises financeiras por posto',
    priority: 'Prioridade alta',
    evidence: 'Contexto informado · validar na imersão',
    problemTitle: 'Contexto atual',
    summary: 'A Torrezan já possui controles financeiros relevantes por unidade. O ganho potencial está em integrar e acelerar análises que hoje exigem preparação e consolidação manual.',
    problems: [
      'Os controles financeiros já existem e oferecem informações relevantes por unidade.',
      'A preparação e a consolidação das análises são realizadas majoritariamente de forma manual.',
      'Comparar postos, períodos e categorias demanda tempo operacional da equipe.'
    ],
    risks: [
      'Análises importantes demorarem mais do que o necessário para ficar disponíveis.',
      'Dependência de manipulações manuais e de pessoas que conhecem os controles.',
      'A equipe gastar mais tempo preparando informações do que analisando resultados.'
    ],
    actions: [
      'Mapear e integrar os controles financeiros que já funcionam.',
      'Automatizar DRE, fluxo de caixa e comparativos entre unidades.',
      'Criar painéis gerenciais atualizados a partir de critérios padronizados.'
    ],
    impacts: [
      'Fechamentos e análises mais rápidos.',
      'Menor esforço operacional e menor dependência de manipulação manual.',
      'Mais tempo para interpretar resultados e executar ações corretivas.'
    ]
  },
  {
    hash: 'diagnostico-compras',
    icon: 'fuel',
    title: 'Radar de compras',
    fullTitle: 'Radar Inteligente de Compras',
    priority: 'Prioridade imediata',
    evidence: 'Desafio relatado na reunião',
    problemTitle: 'Desafio relatado',
    summary: 'A compra de combustível sofre influência do dólar, do petróleo e de outras variáveis. O Radar deverá organizar cenários e apoiar o timing da decisão sem prometer previsão infalível de preços.',
    problems: [
      'O custo de aquisição pode mudar rapidamente em função de variáveis externas.',
      'A leitura do mercado exige reunir informações dispersas e avaliar diferentes sinais.',
      'O impacto de uma compra atravessa margem, caixa, estoque e competitividade.'
    ],
    risks: [
      'Compras em momentos pouco favoráveis comprimirem margem e caixa.',
      'Decisão reativa diante de oscilações relevantes do mercado.',
      'Menor capacidade de antecipar cenários e negociar com segurança.'
    ],
    actions: [
      'Construir o Radar com dólar, petróleo, histórico, volumes, margens e demais variáveis pertinentes.',
      'Criar sinalizações de tendência, faixa de risco, sensibilidade e oportunidade.',
      'Cruzar cenário de mercado, necessidade de estoque e impacto financeiro da compra.'
    ],
    impacts: [
      'Mais previsibilidade e método no processo de compra.',
      'Melhor proteção de margem e maior clareza sobre impactos possíveis.',
      'Decisões mais técnicas, comparáveis e menos reativas.'
    ]
  },
  {
    hash: 'diagnostico-distribuicao',
    icon: 'distribution',
    title: 'Distribuição e estoques',
    fullTitle: 'Distribuição, estoques e perdas',
    priority: 'Ponto a validar',
    evidence: 'Oportunidade a validar na imersão',
    problemTitle: 'Hipóteses a validar',
    summary: 'A distribuidora possui papel estratégico na logística da rede e pede indicadores próprios para volumes, transferências, custos, disponibilidade, estoques e diferenças operacionais.',
    problems: [
      'A distribuidora é responsável pela logística de abastecimento dos postos.',
      'Combustíveis, lubrificantes, conveniência e acessórios possuem dinâmicas distintas de estoque.',
      'Transferências, recebimentos e diferenças de volume precisam ser analisados de forma integrada.'
    ],
    risks: [
      'Custos logísticos ou diferenças operacionais permanecerem diluídos no resultado.',
      'Rupturas, excesso de estoque ou abastecimento desalinhado entre unidades.',
      'Baixa visibilidade sobre perdas entre carregamento, transporte, recebimento e venda.'
    ],
    actions: [
      'Estruturar indicadores próprios para a distribuidora e para as transferências.',
      'Analisar estoque físico, sistema, compras, recebimentos, vendas e aferições.',
      'Criar indicadores de custo logístico, disponibilidade e eficiência de abastecimento.'
    ],
    impacts: [
      'Maior confiabilidade na movimentação de combustível.',
      'Redução de perdas, rupturas e capital imobilizado.',
      'Logística mais eficiente e aderente à necessidade dos postos.'
    ]
  },
  {
    hash: 'diagnostico-margens',
    icon: 'margin',
    title: 'Margens e rentabilidade',
    fullTitle: 'Margens e rentabilidade por produto, serviço e unidade',
    priority: 'Prioridade alta',
    evidence: 'Oportunidade discutida',
    problemTitle: 'Pontos de análise',
    summary: 'A análise deve preservar a competência atual de precificação e aprofundar a rentabilidade efetivamente realizada por combustível, produto, serviço, categoria e unidade.',
    problems: [
      'A contribuição para o resultado varia entre combustíveis, conveniência, serviços e unidades.',
      'Resultados agregados podem esconder produtos ou categorias com baixa contribuição.',
      'A volatilidade do combustível exige acompanhamento frequente da margem efetivamente realizada.'
    ],
    risks: [
      'Crescimento de volume sem evolução proporcional do lucro.',
      'Produtos ou serviços de baixa contribuição permanecerem ocultos no resultado consolidado.',
      'Recursos e capital serem direcionados para frentes com retorno inferior.'
    ],
    actions: [
      'Mensurar margem por litro, produto, categoria, serviço e posto.',
      'Separar a contribuição de combustíveis, conveniência, troca de óleo, lavagem e Trucklub.',
      'Criar análises de rentabilidade, participação no resultado e evolução do mix.'
    ],
    impacts: [
      'Clareza sobre quais produtos e serviços mais contribuem para o lucro.',
      'Melhor direcionamento de estoque, campanhas e foco comercial.',
      'Maior capacidade de proteger o resultado em cenários de volatilidade.'
    ]
  },
  {
    hash: 'diagnostico-rede',
    icon: 'network',
    title: 'Desempenho da rede',
    fullTitle: 'Desempenho comparativo da rede',
    priority: 'Oportunidade estratégica',
    evidence: 'Oportunidade discutida',
    problemTitle: 'Oportunidade percebida',
    summary: 'O comparativo entre unidades pode se tornar uma rotina de benchmarking interno, replicando acertos e atacando desvios com mais velocidade.',
    problems: [
      'Nove postos exigem critérios equivalentes para comparação de desempenho.',
      'Litragem, ticket, margem, serviços e eficiência precisam ser analisados de forma conjunta.',
      'Melhores práticas internas podem ser identificadas e replicadas com mais rapidez.'
    ],
    risks: [
      'Diferenças de desempenho entre postos permanecerem sem ação.',
      'Metas genéricas não refletirem perfil, porte e potencial de cada unidade.',
      'Oportunidades de aprendizado interno demorarem a ser percebidas.'
    ],
    actions: [
      'Criar scorecard por posto com indicadores financeiros e operacionais.',
      'Definir metas coerentes com perfil, porte e potencial de cada unidade.',
      'Implantar reuniões de benchmarking e planos de ação por posto.'
    ],
    impacts: [
      'Mais clareza sobre melhores resultados e maiores desvios.',
      'Ações específicas por unidade, evitando decisões genéricas.',
      'Evolução mais rápida a partir do aprendizado interno.'
    ]
  },
  {
    hash: 'diagnostico-clientes',
    icon: 'customer',
    title: 'Clientes e fidelização',
    fullTitle: 'Clientes, fidelização e venda cruzada',
    priority: 'Oportunidade estratégica',
    evidence: 'Hipótese a validar na imersão',
    problemTitle: 'Oportunidades percebidas',
    summary: 'O programa de fidelidade e a combinação entre abastecimento, conveniência e serviços podem ampliar frequência, ticket e rentabilidade por cliente.',
    problems: [
      'Dados de fidelidade podem ainda não estar conectados à visão gerencial da rede.',
      'Abastecimento, conveniência e serviços podem ser analisados de forma separada.',
      'Campanhas podem não considerar perfil, frequência e comportamento por unidade.'
    ],
    risks: [
      'Baixo aproveitamento da base recorrente de clientes.',
      'Perda de oportunidades de venda cruzada e reativação.',
      'Campanhas com pouco direcionamento e difícil mensuração de retorno.'
    ],
    actions: [
      'Analisar adesão, frequência, ticket, recorrência e comportamento por posto.',
      'Mapear conversão entre abastecimento, conveniência, óleo e lavagem.',
      'Criar segmentações e campanhas por perfil, unidade e potencial.'
    ],
    impacts: [
      'Maior recorrência e melhor aproveitamento da base de clientes.',
      'Aumento do ticket por meio de venda cruzada.',
      'Campanhas mais mensuráveis e alinhadas à margem.'
    ]
  }
];

const scenarios = {
  current: {
    intro: 'A Torrezan já possui bons controles, mas parte relevante do esforço está na preparação manual das informações antes que elas possam ser analisadas.',
    steps: [
      'Mercado oscila',
      'Dados são consolidados manualmente',
      'Análise demanda tempo',
      'Compra recebe menor antecipação',
      'Unidades são comparadas com esforço',
      'Decisão chega mais tarde'
    ],
    outcome: 'Síntese: bons controles, porém com alto esforço de preparação e menor velocidade para transformar informação em decisão.'
  },
  future: {
    intro: 'Com integração, automação e o Radar Inteligente de Compras, a equipe passa a dedicar mais tempo à leitura do negócio e menos tempo à preparação dos dados.',
    steps: [
      'Dados integrados',
      'Controles atualizados automaticamente',
      'Radar sinaliza cenários',
      'Compras ganham apoio técnico',
      'Postos e distribuidora ganham visibilidade',
      'Margem e caixa ficam mais previsíveis'
    ],
    outcome: 'Síntese: controles integrados, análises mais rápidas e mais tempo dedicado à decisão, ao acompanhamento e à execução.'
  }
};

const tabs = document.getElementById('diagnosticTabs');
const content = document.querySelector('.diagnostic-content');
const fields = {
  areaIcon: document.getElementById('activeAreaIcon'),
  priority: document.getElementById('diagPriority'),
  evidence: document.getElementById('diagEvidence'),
  title: document.getElementById('diagTitle'),
  summary: document.getElementById('diagSummary'),
  index: document.getElementById('diagIndex'),
  problemTitle: document.getElementById('diagProblemTitle'),
  problems: document.getElementById('diagProblems'),
  risks: document.getElementById('diagRisks'),
  actions: document.getElementById('diagActions'),
  impacts: document.getElementById('diagImpacts')
};

const list = items => items.map(item => `<li>${item}</li>`).join('');

function renderTabs() {
  tabs.innerHTML = diagnostics.map((item, index) => `
    <button
      class="diag-tab ${index === 0 ? 'active' : ''}"
      id="tab-${item.hash}"
      role="tab"
      data-index="${index}"
      data-hash="${item.hash}"
      aria-controls="diagnosticPanel"
      aria-selected="${index === 0}"
      tabindex="${index === 0 ? 0 : -1}"
    >
      <span class="tab-icon" aria-hidden="true">${icons[item.icon]}</span>
      <span class="tab-copy"><strong>${item.title}</strong></span>
      <span class="tab-arrow" aria-hidden="true">→</span>
    </button>
  `).join('');
}

function selectDiagnostic(index, { updateHash = false, focus = false } = {}) {
  const item = diagnostics[index];

  document.querySelectorAll('.diag-tab').forEach((tab, tabIndex) => {
    const active = tabIndex === index;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  });

  fields.areaIcon.innerHTML = icons[item.icon];
  fields.priority.textContent = item.priority;
  fields.evidence.textContent = item.evidence;
  fields.title.textContent = item.fullTitle;
  fields.summary.textContent = item.summary;
  fields.index.textContent = String(index + 1).padStart(2, '0');
  fields.problemTitle.textContent = item.problemTitle;
  fields.problems.innerHTML = list(item.problems);
  fields.risks.innerHTML = list(item.risks);
  fields.actions.innerHTML = list(item.actions);
  fields.impacts.innerHTML = list(item.impacts);
  content.setAttribute('aria-labelledby', `tab-${item.hash}`);

  if (updateHash) history.replaceState(null, '', `#${item.hash}`);
  if (focus) document.querySelectorAll('.diag-tab')[index].focus();

  if (content.animate) {
    content.animate(
      [{ opacity: .55, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 240, easing: 'ease-out' }
    );
  }
}

renderTabs();
const hashIndex = diagnostics.findIndex(item => `#${item.hash}` === location.hash);
selectDiagnostic(hashIndex >= 0 ? hashIndex : 0);

tabs.addEventListener('click', event => {
  const button = event.target.closest('.diag-tab');
  if (button) selectDiagnostic(Number(button.dataset.index), { updateHash: true });
});

tabs.addEventListener('keydown', event => {
  const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
  if (!keys.includes(event.key)) return;
  event.preventDefault();

  const tabList = [...document.querySelectorAll('.diag-tab')];
  const current = tabList.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
  let next = current;

  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % diagnostics.length;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + diagnostics.length) % diagnostics.length;
  if (event.key === 'Home') next = 0;
  if (event.key === 'End') next = diagnostics.length - 1;

  selectDiagnostic(next, { updateHash: true, focus: true });
});

function renderScenario(key) {
  const item = scenarios[key];
  const stage = document.querySelector('.impact-stage');
  stage.classList.toggle('future', key === 'future');
  document.getElementById('impactIntro').textContent = item.intro;
  document.getElementById('impactFlow').innerHTML = item.steps.map((step, index) => `
    <div class="flow-step">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <strong>${step}</strong>
    </div>
  `).join('');
  document.getElementById('impactOutcome').textContent = item.outcome;
}

renderScenario('current');
document.querySelectorAll('.scenario').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.scenario').forEach(item => item.classList.toggle('active', item === button));
    renderScenario(button.dataset.scenario);
  });
});

const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');
menuButton.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  document.getElementById('progressBar').style.width = `${available > 0 ? window.scrollY / available * 100 : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const navTargets = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
navTargets.forEach(section => navObserver.observe(section));
