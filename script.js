const CONTACT = {
  telegram: "HRenar",
};

const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");
const year = document.getElementById("year");
const modal = document.getElementById("checklist-modal");
const consultForm = document.getElementById("consult-form");
const checklistForm = document.getElementById("checklist-form");

if (year) year.textContent = String(new Date().getFullYear());

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll('.nav a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

function openModal() {
  modal.hidden = false;
  modal.querySelector("input")?.focus();
}

function closeModal() {
  modal.hidden = true;
}

document.querySelectorAll("[data-open-checklist]").forEach((el) => {
  el.addEventListener("click", openModal);
});

document.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) closeModal();
});

function telegramUrl(text) {
  return `https://t.me/${CONTACT.telegram}?text=${encodeURIComponent(text)}`;
}

function sendToTelegram(text, status, successMessage) {
  window.open(telegramUrl(text), "_blank", "noopener,noreferrer");
  if (status) status.textContent = successMessage;
}

if (consultForm) {
  const status = consultForm.querySelector(".form-status");
  consultForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(consultForm);
    const text = [
      "Заявка на консультацию с сайта Renar",
      `Имя: ${data.get("name") || "—"}`,
      `Компания: ${data.get("company") || "—"}`,
      `Контакт: ${data.get("contact") || "—"}`,
      `Запрос: ${data.get("need") || "—"}`,
    ].join("\n");
    sendToTelegram(
      text,
      status,
      "Открыл Telegram @HRenar. Нажмите «Отправить», чтобы заявка ушла мне."
    );
    consultForm.reset();
  });
}

if (checklistForm) {
  const status =
    checklistForm.parentElement.querySelector(".form-status") ||
    checklistForm.querySelector(".form-status");
  checklistForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const lead = new FormData(checklistForm).get("lead") || "—";
    sendToTelegram(
      `Запрос чек-листа HR-аудита с сайта Renar\nКонтакт: ${lead}`,
      status,
      "Открыл Telegram @HRenar. Нажмите «Отправить», чтобы запрос ушёл мне."
    );
    checklistForm.reset();
  });
}
