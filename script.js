/* ==========================================================
   Bianca Santos | Studio de Pilates
   ========================================================== */

/* ---------- CONFIGURAÇÃO ----------
   Para ativar os botões de WhatsApp, coloque o número com DDI e DDD,
   só os dígitos. Exemplo: '5511912345678'
   Enquanto estiver vazio, o site usa só o Instagram. */
const WHATSAPP_NUMERO = '5524988273054';
const WHATSAPP_MENSAGEM = 'Olá, Bianca! Vim pelo site e gostaria de agendar uma aula de Pilates.';

document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {
  initAno();
  initWhatsApp();
  initHeader();
  initMenu();
  initNavAtiva();
  initReveal();
  initFaq();
  initLightbox();
  initBackToTop();
});

/* Ano atual no rodapé */
function initAno() {
  const el = document.getElementById('ano');
  if (el) el.textContent = new Date().getFullYear();
}

/* Liga os botões de WhatsApp quando houver número configurado */
function initWhatsApp() {
  const numero = WHATSAPP_NUMERO.replace(/\D/g, '');
  if (!numero) return;

  const link = `https://wa.me/${numero}?text=${encodeURIComponent(WHATSAPP_MENSAGEM)}`;

  const cta = document.getElementById('cta-whatsapp');
  const flutuante = document.getElementById('float-whatsapp');
  const rodape = document.getElementById('footer-whatsapp');

  [cta, flutuante].forEach(el => { el.href = link; el.hidden = false; });
  rodape.querySelector('a').href = link;
  rodape.hidden = false;

  // Com WhatsApp, o Instagram vira a opção secundária
  document.getElementById('cta-instagram').classList.add('btn--ghost-light');
  document.body.classList.add('has-whatsapp');
}

/* Sombra no header ao rolar a página */
function initHeader() {
  const header = document.querySelector('.header');
  const atualizar = () => header.classList.toggle('is-scrolled', window.scrollY > 10);
  atualizar();
  window.addEventListener('scroll', atualizar, { passive: true });
}

/* Menu mobile */
function initMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('menu');

  const abrir = (aberto) => {
    nav.classList.toggle('is-open', aberto);
    toggle.setAttribute('aria-expanded', aberto);
    toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    document.body.classList.toggle('no-scroll', aberto);
  };

  toggle.addEventListener('click', () => abrir(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => abrir(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') abrir(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) abrir(false); });
}

/* Destaca no menu a seção que está na tela */
function initNavAtiva() {
  const links = document.querySelectorAll('.nav__link');
  const secoes = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  secoes.forEach(s => observer.observe(s));
}

/* Elementos aparecem suavemente ao rolar */
function initReveal() {
  const itens = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    itens.forEach(el => el.classList.add('is-visible'));
    return;
  }

  // Itens lado a lado (cards, passos, fotos) entram em sequência
  document.querySelectorAll('.cards, .equipment__list, .steps__list, .gallery__grid').forEach(grupo => {
    grupo.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = `${i * 90}ms`; });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  itens.forEach(el => observer.observe(el));
}

/* FAQ: abre uma pergunta por vez */
function initFaq() {
  const itens = document.querySelectorAll('.faq__item');
  itens.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      itens.forEach(outro => { if (outro !== item) outro.open = false; });
    });
  });
}

/* Galeria com foto ampliada */
function initLightbox() {
  const box = document.querySelector('.lightbox');
  const img = box.querySelector('.lightbox__img');
  const contador = box.querySelector('.lightbox__counter');
  const fotos = [...document.querySelectorAll('.gallery__item img')];
  let atual = 0;
  let ultimoFoco = null;

  const mostrar = (i) => {
    atual = (i + fotos.length) % fotos.length;
    img.src = fotos[atual].src;
    img.alt = fotos[atual].alt;
    contador.textContent = `${atual + 1} / ${fotos.length}`;
  };

  const abrir = (i) => {
    ultimoFoco = document.activeElement;
    mostrar(i);
    box.hidden = false;
    document.body.classList.add('no-scroll');
    box.querySelector('.lightbox__close').focus();
  };

  const fechar = () => {
    box.hidden = true;
    document.body.classList.remove('no-scroll');
    if (ultimoFoco) ultimoFoco.focus();
  };

  document.querySelectorAll('.gallery__item').forEach(btn => {
    btn.addEventListener('click', () => abrir(Number(btn.dataset.index)));
  });

  box.querySelector('.lightbox__close').addEventListener('click', fechar);
  box.querySelector('.lightbox__nav--prev').addEventListener('click', () => mostrar(atual - 1));
  box.querySelector('.lightbox__nav--next').addEventListener('click', () => mostrar(atual + 1));
  box.addEventListener('click', e => { if (e.target === box) fechar(); });

  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'ArrowLeft') mostrar(atual - 1);
    if (e.key === 'ArrowRight') mostrar(atual + 1);
  });

  // Arrastar para o lado no celular
  let inicioX = null;
  box.addEventListener('touchstart', e => { inicioX = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', e => {
    if (inicioX === null) return;
    const dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 50) mostrar(atual + (dx < 0 ? 1 : -1));
    inicioX = null;
  });
}

/* Botão de voltar ao topo */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  const atualizar = () => btn.classList.toggle('is-visible', window.scrollY > 700);
  atualizar();
  window.addEventListener('scroll', atualizar, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
