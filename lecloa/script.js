const ACCESS_HASH = '4af37d7b';
const ACCESS_KEY = 'lecloa-diagnostico-access';

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
const logoutButton = document.getElementById('logoutButton');
const mobileLogoutButton = document.getElementById('mobileLogoutButton');

function unlockSite({ focusTop = false } = {}) {
  sessionStorage.setItem(ACCESS_KEY, 'granted');
  body.classList.remove('locked');
  body.classList.add('unlocked');
  accessGate.setAttribute('aria-hidden', 'true');
  siteShell.setAttribute('aria-hidden', 'false');
  if (focusTop) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelector('.brand-lockup')?.focus({ preventScroll: true });
  }
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
  setTimeout(() => accessPassword.focus(), 80);
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
      setTimeout(() => unlockSite({ focusTop: true }), 220);
    } else {
      accessFeedback.textContent = 'Senha incorreta. Verifique e tente novamente.';
      accessPassword.select();
      document.querySelector('.access-card').classList.remove('shake');
      requestAnimationFrame(() => document.querySelector('.access-card').classList.add('shake'));
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

logoutButton.addEventListener('click', lockSite);
mobileLogoutButton.addEventListener('click', lockSite);

const icons = {
  data: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/><path d="M9 8h.01M9 14h.01"/></svg>`,
  finance: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7.5h16v11H4z"/><path d="M7 7.5V5h10v2.5"/><path d="M8 13h2l1.2-2.2 2 4.1 1.4-2.2H17"/></svg>`,
  commercial: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V9l8-4 8 4v10"/><path d="M8 19v-5h8v5"/><path d="M7 10h.01M12 10h.01M17 10h.01"/><path d="M3 19h18"/></svg>`,
  production: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20V9l6 3V9l6 3V5h4v15z"/><path d="M7 16h.01M12 16h.01M17 16h.01"/></svg>`,
  stock: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l8-4 8 4-8 4z"/><path d="M4 7v10l8 4 8-4V7"/><path d="M12 11v10"/><path d="M8 5l8 4"/></svg>`,
  cost: `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h2M14 12h2M8 16h2M14 16h2"/></svg>`
};

const diagnostics = [
  {
    icon: 'data', title: 'Dados e ERP', kicker: 'Confiabilidade', priority: 'Base crítica',
    summary: 'O sistema e as rotinas precisam gerar informações confiáveis sem depender do conhecimento informal de poucas pessoas.',
    problems: [
      'Sistema percebido como lento, trabalhoso e difícil em algumas rotinas.',
      'Treinamento não estruturado e conhecimento repassado de forma parcial.',
      'Cadastros, lançamentos e processos ainda precisam ser validados na origem.'
    ],
    risks: [
      'Retrabalho, erros e informações incompletas.',
      'Dependência de pessoas específicas e perda de conhecimento na rotatividade.',
      'Indicadores e decisões construídos sobre dados pouco confiáveis.'
    ],
    actions: [
      'Mapear as rotinas críticas executadas no ERP.',
      'Validar cadastros, lançamentos, devoluções, baixas e movimentações.',
      'Padronizar processos, responsabilidades e treinamento dos usuários.'
    ],
    impacts: [
      'Informações mais confiáveis e menor retrabalho.',
      'Redução da dependência de conhecimento individual.',
      'Base segura para automação, indicadores e decisões gerenciais.'
    ]
  },
  {
    icon: 'finance', title: 'Gestão financeira', kicker: 'Previsibilidade', priority: 'Alta prioridade',
    summary: 'A empresa precisa separar resultado econômico, movimentação de caixa e necessidade de capital para antecipar decisões.',
    problems: [
      'Ausência de uma DRE gerencial mensal estruturada e confiável.',
      'Resultado ainda acompanhado com informações dispersas ou informais.',
      'Falta de uma projeção consolidada de recebimentos, pagamentos e despesas.'
    ],
    risks: [
      'Dificuldade de enxergar lucro, margem e resultado real.',
      'Pressão de caixa percebida somente quando já aconteceu.',
      'Crescimento, compras e vendas sem clareza sobre capital de giro.'
    ],
    actions: [
      'Estruturar DRE por competência e rotina mensal de fechamento.',
      'Implantar fluxo de caixa projetado x realizado.',
      'Analisar contas a receber, prazos médios, inadimplência e capital de giro.'
    ],
    impacts: [
      'Clareza sobre lucro, margem e geração de caixa.',
      'Antecipação de desencaixes e maior capacidade de reação.',
      'Decisões financeiras e de crescimento mais seguras.'
    ]
  },
  {
    icon: 'commercial', title: 'Inteligência comercial', kicker: 'Direcionamento', priority: 'Oportunidade',
    summary: 'Site e linha corporativa possuem comportamentos distintos e precisam de análises, metas e estratégias próprias.',
    problems: [
      'Canais comerciais ainda podem ser separados e analisados com mais profundidade.',
      'Recompra, clientes inativos e redução de compra não são plenamente explorados.',
      'Metas podem considerar pedidos, peças, ticket, margem e sazonalidade.'
    ],
    risks: [
      'Esforço comercial disperso entre clientes e segmentos.',
      'Baixa visibilidade da margem e do potencial por canal.',
      'Perda de oportunidades de reativação, recorrência e melhor mix.'
    ],
    actions: [
      'Separar indicadores de site, corporativo, segmento e vendedor.',
      'Criar Curva ABC e análises de ticket, margem e frequência.',
      'Mapear recompra, inativos e metas comerciais sazonais.'
    ],
    impacts: [
      'Maior foco nos clientes e segmentos de melhor potencial.',
      'Aumento da recompra e melhor qualidade da receita.',
      'Metas mais realistas, específicas e acionáveis.'
    ]
  },
  {
    icon: 'production', title: 'Produção e prazo', kicker: 'Velocidade', priority: 'Alta prioridade',
    summary: 'O prazo de entrega indica oportunidades de reduzir filas, esperas, movimentações e desequilíbrios entre etapas.',
    problems: [
      'Prazo de entrega em torno de 40 dias.',
      'Tempos de espera e gargalos ainda não medidos de forma estruturada.',
      'Possíveis estoques intermediários e movimentações desnecessárias.'
    ],
    risks: [
      'Faturamento postergado e menor velocidade de caixa.',
      'Pressão sobre equipe, capacidade e programação da produção.',
      'Limitação para absorver crescimento e manter o nível de serviço.'
    ],
    actions: [
      'Mapear o fluxo completo do pedido ao faturamento.',
      'Realizar cronoanálise e medir processo, espera e capacidade.',
      'Identificar gargalos, balancear etapas e revisar movimentações e layout.'
    ],
    impacts: [
      'Redução do prazo, das filas e dos estoques intermediários.',
      'Maior produtividade com os recursos atuais.',
      'Antecipação do faturamento e aumento da capacidade de atendimento.'
    ]
  },
  {
    icon: 'stock', title: 'Estoques e fornecedores', kicker: 'Disponibilidade', priority: 'Alta prioridade',
    summary: 'A operação precisa reduzir rupturas sem transformar a solução em excesso de estoque e capital imobilizado.',
    problems: [
      'Paradas de produção por falta de matéria-prima.',
      'Estoques mínimos, máximos e de segurança ainda não parametrizados.',
      'Prazos e confiabilidade de fornecedores afetam o fluxo produtivo.'
    ],
    risks: [
      'Reprogramações, ociosidade e perda de produtividade.',
      'Atraso dos pedidos, do faturamento e da entrada de caixa.',
      'Excesso em alguns itens, ruptura em outros e capital mal alocado.'
    ],
    actions: [
      'Calcular mínimos, máximos, segurança e critérios de reposição.',
      'Explodir a composição dos produtos para projetar o consumo real.',
      'Avaliar criticidade, lead time, confiabilidade e alternativas de fornecedores.'
    ],
    impacts: [
      'Menos rupturas e maior estabilidade produtiva.',
      'Capital de giro melhor alocado entre os materiais.',
      'Atendimento mais rápido para produtos padronizados do site.'
    ]
  },
  {
    icon: 'cost', title: 'Custos e precificação', kicker: 'Rentabilidade', priority: 'Estruturante',
    summary: 'O preço precisa refletir matéria-prima, processo, tempo, volume, setup, capacidade e complexidade produtiva.',
    problems: [
      'O custo pode não capturar integralmente o esforço das etapas produtivas.',
      'Preparações, lotes e ganhos de escala não possuem comportamento linear.',
      'Produtos diferentes consomem capacidades e complexidades distintas.'
    ],
    risks: [
      'Margem aparente sem retorno proporcional ao esforço produtivo.',
      'Produtos complexos ocupando capacidade sem compensação financeira.',
      'Crescimento do mix e do faturamento sem evolução equivalente do lucro.'
    ],
    actions: [
      'Separar custo de matéria-prima, processo, setup e indiretos.',
      'Mensurar tempos e capacidade consumida pelas diferentes famílias.',
      'Criar precificação por complexidade e margem por produto e canal.'
    ],
    impacts: [
      'Preço coerente com o esforço e os recursos consumidos.',
      'Visibilidade da margem real por produto, cliente e canal.',
      'Mix mais rentável e melhor uso da capacidade produtiva.'
    ]
  }
];

const scenarios = {
  current: {
    intro: 'Quando as informações e os processos não estão conectados, a empresa tende a descobrir o problema depois que ele já afetou a operação.',
    steps: ['Dados frágeis', 'Decisão reativa', 'Compras desalinhadas', 'Rupturas e esperas', 'Prazo elevado', 'Faturamento e caixa pressionados'],
    outcome: 'Efeito provável: mais retrabalho, menor velocidade, capital mal alocado e baixa previsibilidade para decidir.'
  },
  future: {
    intro: 'Com uma base confiável e uma rotina integrada, a gestão passa a agir antes que o desvio se transforme em perda.',
    steps: ['Dados validados', 'Decisão antecipada', 'Compras planejadas', 'Estoque parametrizado', 'Produção fluida', 'Margem e caixa previsíveis'],
    outcome: 'Impacto esperado: menor risco, melhor uso dos recursos, prazo reduzido e crescimento com mais controle.'
  }
};

const tabs = document.getElementById('diagnosticTabs');
const content = document.querySelector('.diagnostic-content');
const fields = {
  areaIcon: document.getElementById('activeAreaIcon'),
  priority: document.getElementById('diagPriority'),
  kicker: document.getElementById('diagKicker'),
  title: document.getElementById('diagTitle'),
  summary: document.getElementById('diagSummary'),
  index: document.getElementById('diagIndex'),
  problems: document.getElementById('diagProblems'),
  risks: document.getElementById('diagRisks'),
  actions: document.getElementById('diagActions'),
  impacts: document.getElementById('diagImpacts')
};

function list(items) {
  return items.map(item => `<li>${item}</li>`).join('');
}

function renderTabs() {
  tabs.innerHTML = diagnostics.map((item, index) => `
    <button class="diag-tab ${index === 0 ? 'active' : ''}" data-index="${index}" aria-pressed="${index === 0}">
      <span class="tab-icon" aria-hidden="true">${icons[item.icon]}</span>
      <span class="tab-copy"><strong>${item.title}</strong></span>
      <span class="tab-arrow" aria-hidden="true">→</span>
    </button>
  `).join('');
}

function selectDiagnostic(index) {
  const item = diagnostics[index];
  document.querySelectorAll('.diag-tab').forEach((tab, tabIndex) => {
    tab.classList.toggle('active', tabIndex === index);
    tab.setAttribute('aria-pressed', String(tabIndex === index));
  });
  fields.areaIcon.innerHTML = icons[item.icon];
  fields.priority.textContent = item.priority;
  fields.kicker.textContent = item.kicker;
  fields.title.textContent = item.title;
  fields.summary.textContent = item.summary;
  fields.index.textContent = String(index + 1).padStart(2, '0');
  fields.problems.innerHTML = list(item.problems);
  fields.risks.innerHTML = list(item.risks);
  fields.actions.innerHTML = list(item.actions);
  fields.impacts.innerHTML = list(item.impacts);
  if (content.animate) {
    content.animate(
      [{ opacity: .55, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 260, easing: 'ease-out' }
    );
  }
}

renderTabs();
selectDiagnostic(0);
tabs.addEventListener('click', event => {
  const button = event.target.closest('.diag-tab');
  if (button) selectDiagnostic(Number(button.dataset.index));
});

function renderScenario(key) {
  const item = scenarios[key];
  const stage = document.querySelector('.impact-stage');
  stage.classList.toggle('future', key === 'future');
  document.getElementById('impactIntro').textContent = item.intro;
  document.getElementById('impactFlow').innerHTML = item.steps.map((step, index) => `
    <div class="flow-step"><span>${String(index + 1).padStart(2, '0')}</span><strong>${step}</strong></div>
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
  const percentage = available > 0 ? window.scrollY / available * 100 : 0;
  document.getElementById('progressBar').style.width = `${percentage}%`;
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
const navTargets = navLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
navTargets.forEach(section => navObserver.observe(section));
