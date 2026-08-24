const PASSWORD = "Laranjeira2026";
const SESSION_KEY = "laranjeira_proposta_ok";

document.addEventListener("DOMContentLoaded", () => {
  const access = document.getElementById("access");
  const site = document.getElementById("site");
  const form = document.getElementById("access-form");
  const pass = document.getElementById("password");
  const error = document.getElementById("access-error");
  const toggle = document.getElementById("toggle-pass");
  const logout = document.getElementById("logout");
  const nav = document.getElementById("nav");
  const burger = document.getElementById("menu-toggle");
  const bar = document.getElementById("progress-bar");

  const openSite = () => {
    access.hidden = true;
    site.hidden = false;
    document.body.style.overflow = "";
    window.scrollTo(0, 0);
  };

  document.body.style.overflow = "hidden";
  if (sessionStorage.getItem(SESSION_KEY) === "1") openSite();

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (pass.value === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      error.hidden = true;
      openSite();
    } else {
      error.hidden = false;
      pass.value = "";
      pass.focus();
    }
  });

  toggle.addEventListener("click", () => {
    const isHidden = pass.type === "password";
    pass.type = isHidden ? "text" : "password";
    toggle.textContent = isHidden ? "Ocultar" : "Mostrar";
    toggle.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
  });

  logout.addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  });

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  nav.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  const sections = [...document.querySelectorAll("section[id]")];
  const links = [...nav.querySelectorAll(".nav__link")];
  const updateScroll = () => {
    const doc = document.documentElement;
    const total = Math.max(1, doc.scrollHeight - doc.clientHeight);
    bar.style.width = `${Math.min(100, (doc.scrollTop / total) * 100)}%`;

    const y = doc.scrollTop + 130;
    let current = sections[0]?.id || "capa";
    sections.forEach((section) => {
      if (section.offsetTop <= y) current = section.id;
    });
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
});
