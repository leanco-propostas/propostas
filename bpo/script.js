const API_URL = 'https://script.google.com/macros/s/AKfycbyV4VoM0hpNdYMkkbXiok-C1Vs3V0GgLfvKf50ZmG-P3gaWP_9ferdl6jgOUOiH9Da2/exec';
const DRAFT_KEY = 'lean-bpo-diagnostic-v2';

const form = document.getElementById('diagnosticForm');
const steps = [...document.querySelectorAll('.form-step')];
const stageButtons = [...document.querySelectorAll('.stage')];
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const autosaveStatus = document.getElementById('autosaveStatus');
const successScreen = document.getElementById('successScreen');
const newResponseBtn = document.getElementById('newResponseBtn');
const toast = document.getElementById('toast');

let currentStep = 0;
let saveTimer;

function showStep(index, scroll = true) {
  currentStep = Math.max(0, Math.min(index, steps.length - 1));

  steps.forEach((step, i) => step.classList.toggle('active', i === currentStep));
  stageButtons.forEach((button, i) => {
    button.classList.toggle('active', i === currentStep);
    button.classList.toggle('completed', i < currentStep);
  });

  const pct = Math.round(((currentStep + 1) / steps.length) * 100);
  progressText.textContent = `Etapa ${currentStep + 1} de ${steps.length}`;
  progressPercent.textContent = `${pct}%`;
  progressFill.style.width = `${pct}%`;

  prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
  nextBtn.hidden = currentStep === steps.length - 1;
  submitBtn.hidden = currentStep !== steps.length - 1;

  if (scroll) {
    const y = document.querySelector('.progress-wrap').getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function getRadio(name) {
  return form.querySelector(`input[name="${name}"]:checked`)?.value || '';
}

function checkedValues(name) {
  return [...form.querySelectorAll(`input[name="${name}"]:checked`)].map(el => el.value);
}

function markInvalid(el, invalid) {
  if (!el) return;
  el.classList.toggle('invalid', invalid);
}

function validateCurrentStep() {
  const current = steps[currentStep];
  let valid = true;
  let firstInvalid = null;

  current.querySelectorAll('input[required]:not([type="radio"]):not([type="checkbox"]), textarea[required], select[required]').forEach(field => {
    const ok = field.checkValidity();
    markInvalid(field, !ok);
    if (!ok && !firstInvalid) firstInvalid = field;
    valid = valid && ok;
  });

  const radioNames = [...new Set([...current.querySelectorAll('input[type="radio"][required]')].map(r => r.name))];
  radioNames.forEach(name => {
    const checked = current.querySelector(`input[name="${name}"]:checked`);
    if (!checked) {
      valid = false;
      if (!firstInvalid) firstInvalid = current.querySelector(`input[name="${name}"]`)?.closest('.binary-choice') || current;
    }
  });

  current.querySelectorAll('[data-required-group]').forEach(group => {
    const name = group.dataset.requiredGroup;
    const hasChecked = group.querySelector(`input[name="${name}"]:checked`);
    const error = name === 'classificacoesFinanceiras'
      ? document.getElementById('classificacoesError')
      : document.getElementById('escopoError');
    error?.classList.toggle('show', !hasChecked);
    if (!hasChecked) {
      valid = false;
      if (!firstInvalid) firstInvalid = group;
    }
  });

  if (currentStep === 3) {
    if (getRadio('usaCartaoCorporativo') === 'Sim') {
      const qtdCartoes = document.getElementById('qtdCartoes');
      const qtdTransacoes = document.getElementById('qtdTransacoesCartaoMes');
      [qtdCartoes, qtdTransacoes].forEach(el => {
        const ok = !!el.value.trim();
        markInvalid(el, !ok);
        if (!ok && !firstInvalid) firstInvalid = el;
        valid = valid && ok;
      });
    }
    if (getRadio('temConciliacaoEspecifica') === 'Sim') {
      const el = document.getElementById('conciliacaoDescricao');
      const ok = !!el.value.trim();
      markInvalid(el, !ok);
      if (!ok && !firstInvalid) firstInvalid = el;
      valid = valid && ok;
    }
    if (getRadio('temCobranca') === 'Sim') {
      const el = document.getElementById('cobrancaDescricao');
      const ok = !!el.value.trim();
      markInvalid(el, !ok);
      if (!ok && !firstInvalid) firstInvalid = el;
      valid = valid && ok;
    }
  }

  if (currentStep === 4 && getRadio('temRotinasColaboradores') === 'Sim') {
    const el = document.getElementById('rotinasColaboradoresDescricao');
    const ok = !!el.value.trim();
    markInvalid(el, !ok);
    if (!ok && !firstInvalid) firstInvalid = el;
    valid = valid && ok;
  }

  if (!valid) {
    showToast('Revise os campos destacados antes de continuar.', true);
    firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  return valid;
}

function togglePanel(id, visible) {
  const el = document.getElementById(id);
  if (!el) return;
  el.hidden = !visible;
  if (!visible) el.querySelectorAll('.invalid').forEach(item => item.classList.remove('invalid'));
}

function handleConditionalVisibility() {
  togglePanel('cartaoDetails', getRadio('usaCartaoCorporativo') === 'Sim');
  togglePanel('conciliacaoDetails', getRadio('temConciliacaoEspecifica') === 'Sim');
  togglePanel('cobrancaDetails', getRadio('temCobranca') === 'Sim');
  togglePanel('rotinasColaboradoresDetails', getRadio('temRotinasColaboradores') === 'Sim');
}

function normalizeConditionalData() {
  const usaCartao = getRadio('usaCartaoCorporativo');
  const qtdCartoes = document.getElementById('qtdCartoes').value.trim();
  const temConciliacao = getRadio('temConciliacaoEspecifica');
  const conciliacaoDescricao = document.getElementById('conciliacaoDescricao').value.trim();
  const temCobranca = getRadio('temCobranca');
  const cobrancaDescricao = document.getElementById('cobrancaDescricao').value.trim();
  const temRotinas = getRadio('temRotinasColaboradores');
  const rotinasDescricao = document.getElementById('rotinasColaboradoresDescricao').value.trim();

  const classificacoes = checkedValues('classificacoesFinanceiras');
  const classificacaoOutro = document.getElementById('classificacaoOutro').value.trim();
  if (classificacaoOutro) classificacoes.push(`Outro: ${classificacaoOutro}`);

  const escopo = checkedValues('escopoBpo');
  const escopoOutro = document.getElementById('escopoOutro').value.trim();
  if (escopoOutro) escopo.push(`Outro: ${escopoOutro}`);

  return {
    cartoesCorporativos: usaCartao === 'Sim' ? `Sim | ${qtdCartoes || 'Quantidade não informada'} cartão(ões)` : 'Não',
    qtdTransacoesCartaoMes: usaCartao === 'Sim' ? document.getElementById('qtdTransacoesCartaoMes').value.trim() : '0',
    recebimentosConciliacaoEspecifica: temConciliacao === 'Sim' ? `Sim | ${conciliacaoDescricao}` : 'Não',
    cobrancaInadimplentes: temCobranca === 'Sim' ? `Sim | ${cobrancaDescricao}` : 'Não',
    classificacoesFinanceiras: classificacoes,
    rotinasColaboradores: temRotinas === 'Sim' ? `Sim | ${rotinasDescricao}` : 'Não',
    escopoBpo: escopo
  };
}

function buildPayload() {
  const data = Object.fromEntries(new FormData(form).entries());
  const conditional = normalizeConditionalData();

  return {
    empresaNomeCargo: data.empresaNomeCargo || '',
    segmentoAtividades: data.segmentoAtividades || '',
    qtdCnpjs: data.qtdCnpjs || '',
    faturamentoMedioMensal: data.faturamentoMedioMensal || '',
    regimeTributario: data.regimeTributario || '',
    colaboradores: data.colaboradores || '',
    estruturaFinanceiraAtual: data.estruturaFinanceiraAtual || '',
    sistemaErp: data.sistemaErp || '',
    controlesExternos: data.controlesExternos || '',
    situacaoInformacoesFinanceiras: data.situacaoInformacoesFinanceiras || '',
    qtdContasPagarMes: data.qtdContasPagarMes || '',
    qtdRecebimentosTitulosMes: data.qtdRecebimentosTitulosMes || '',
    qtdNfSaidaMes: data.qtdNfSaidaMes || '',
    qtdNfEntradaMes: data.qtdNfEntradaMes || '',
    qtdClientesFaturadosMes: data.qtdClientesFaturadosMes || '',
    contasBancarias: data.contasBancarias || '',
    qtdMovimentacoesBancariasMes: data.qtdMovimentacoesBancariasMes || '',
    cartoesCorporativos: conditional.cartoesCorporativos,
    qtdTransacoesCartaoMes: conditional.qtdTransacoesCartaoMes,
    recebimentosConciliacaoEspecifica: conditional.recebimentosConciliacaoEspecifica,
    cobrancaInadimplentes: conditional.cobrancaInadimplentes,
    classificacoesFinanceiras: conditional.classificacoesFinanceiras,
    rotinasColaboradores: conditional.rotinasColaboradores,
    entregasContabilidade: data.entregasContabilidade || '',
    relacionamentoContabilidade: data.relacionamentoContabilidade || '',
    escopoBpo: conditional.escopoBpo,
    indicadoresRelatoriosAtuais: data.indicadoresRelatoriosAtuais || '',
    dorExpectativaInfoAdicionais: data.dorExpectativaInfoAdicionais || '',
    website: document.getElementById('website').value || ''
  };
}

async function sendToAppsScript(payload) {
  await fetch(API_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    cache: 'no-store'
  });
}

function serializeDraft() {
  const fields = {};
  form.querySelectorAll('input, textarea, select').forEach(el => {
    if (!el.id && !el.name) return;
    const key = el.id || el.name;
    if (el.type === 'checkbox' || el.type === 'radio') {
      if (!fields[key]) fields[key] = [];
      if (el.checked) fields[key].push(el.value);
    } else {
      fields[key] = el.value;
    }
  });
  return { step: currentStep, fields, savedAt: Date.now() };
}

function saveDraft() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(serializeDraft()));
  autosaveStatus.textContent = 'Rascunho salvo';
}

function scheduleDraftSave() {
  autosaveStatus.textContent = 'Salvando...';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveDraft, 450);
}

function restoreDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return false;

  try {
    const draft = JSON.parse(raw);
    const fields = draft.fields || {};

    form.querySelectorAll('input, textarea, select').forEach(el => {
      const key = el.id || el.name;
      if (!(key in fields)) return;
      if (el.type === 'checkbox' || el.type === 'radio') {
        el.checked = Array.isArray(fields[key]) && fields[key].includes(el.value);
      } else {
        el.value = fields[key] ?? '';
      }
    });

    handleConditionalVisibility();
    showStep(Number.isInteger(draft.step) ? draft.step : 0, false);
    return true;
  } catch (e) {
    localStorage.removeItem(DRAFT_KEY);
    return false;
  }
}

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.toggle('error', isError);
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

nextBtn.addEventListener('click', () => {
  if (!validateCurrentStep()) return;
  saveDraft();
  showStep(currentStep + 1);
});

prevBtn.addEventListener('click', () => {
  saveDraft();
  showStep(currentStep - 1);
});

stageButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (index < currentStep) showStep(index);
  });
});

form.addEventListener('input', event => {
  markInvalid(event.target, false);
  scheduleDraftSave();
});
form.addEventListener('change', () => {
  handleConditionalVisibility();
  scheduleDraftSave();
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!validateCurrentStep()) return;

  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Enviando...';

  try {
    await sendToAppsScript(buildPayload());
    localStorage.removeItem(DRAFT_KEY);
    form.hidden = true;
    document.querySelector('.progress-wrap').hidden = true;
    document.querySelector('.intro').hidden = true;
    successScreen.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error(error);
    showToast('Não foi possível enviar agora. Tente novamente em alguns instantes.', true);
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Enviar diagnóstico <span aria-hidden="true">→</span>';
  }
});

newResponseBtn.addEventListener('click', () => {
  form.reset();
  localStorage.removeItem(DRAFT_KEY);
  handleConditionalVisibility();
  form.hidden = false;
  document.querySelector('.progress-wrap').hidden = false;
  document.querySelector('.intro').hidden = false;
  successScreen.hidden = true;
  submitBtn.disabled = false;
  submitBtn.innerHTML = 'Enviar diagnóstico <span aria-hidden="true">→</span>';
  showStep(0, false);
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const recovered = restoreDraft();
if (!recovered) showStep(0, false);
else showToast('Seu rascunho anterior foi recuperado.');
handleConditionalVisibility();
