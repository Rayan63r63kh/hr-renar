const CONTACT = {
  telegram: "HRenar",
  email: "renark@internet.ru",
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

function mailtoUrl(subject, body) {
  return `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function sendToEmail(fields) {
  const response = await fetch(`https://formsubmit.co/ajax/${CONTACT.email}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...fields,
      _template: "table",
      _captcha: "false",
    }),
  });
  if (!response.ok) throw new Error("email failed");
}

async function submitLead({ form, status, subject, fields, telegramText }) {
  const button = form.querySelector('button[type="submit"]');
  if (button) button.disabled = true;
  if (status) status.textContent = "Отправляю на почту и открываю Telegram…";

  let emailOk = false;
  try {
    await sendToEmail({ _subject: subject, ...fields });
    emailOk = true;
  } catch (error) {
    emailOk = false;
  }

  window.open(telegramUrl(telegramText), "_blank", "noopener,noreferrer");

  if (!emailOk) {
    window.open(mailtoUrl(subject, telegramText), "_self");
  }

  if (status) {
    status.textContent = emailOk
      ? "Заявка ушла на почту. В Telegram нажмите «Отправить», чтобы продублировать сообщение."
      : "Открыл почту и Telegram. Отправьте оба сообщения, чтобы заявка дошла.";
  }

  form.reset();
  if (button) button.disabled = false;
}

if (consultForm) {
  const status = consultForm.querySelector(".form-status");
  consultForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(consultForm);
    const fields = {
      Имя: data.get("name") || "—",
      Компания: data.get("company") || "—",
      Контакт: data.get("contact") || "—",
      Запрос: data.get("need") || "—",
    };
    const telegramText = [
      "Заявка на консультацию с сайта Renar",
      `Имя: ${fields.Имя}`,
      `Компания: ${fields.Компания}`,
      `Контакт: ${fields.Контакт}`,
      `Запрос: ${fields.Запрос}`,
    ].join("\n");
    submitLead({
      form: consultForm,
      status,
      subject: "Заявка на консультацию — Renar",
      fields,
      telegramText,
    });
  });
}

if (checklistForm) {
  const status =
    checklistForm.parentElement.querySelector(".form-status") ||
    checklistForm.querySelector(".form-status");
  checklistForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const lead = new FormData(checklistForm).get("lead") || "—";
    submitLead({
      form: checklistForm,
      status,
      subject: "Запрос чек-листа — Renar",
      fields: { Контакт: lead, Форма: "Чек-лист HR-аудита" },
      telegramText: `Запрос чек-листа HR-аудита с сайта Renar\nКонтакт: ${lead}`,
    });
  });
}
