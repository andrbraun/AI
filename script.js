const form = document.getElementById("resumeForm");
const phoneInput = document.getElementById("phone");
const helpBtn = document.getElementById("helpBtn");
const statusEl = document.getElementById("status");

function formatPhone(value) {
  const digits = value.replace(/\D/g, "").replace(/^8/, "7");
  const normalized = digits.startsWith("7") ? digits : `7${digits}`;
  const cut = normalized.slice(0, 11);

  let out = "+7";
  if (cut.length > 1) out += ` (${cut.slice(1, 4)}`;
  if (cut.length >= 4) out += ")";
  if (cut.length > 4) out += ` ${cut.slice(4, 7)}`;
  if (cut.length > 7) out += `-${cut.slice(7, 9)}`;
  if (cut.length > 9) out += `-${cut.slice(9, 11)}`;
  return out;
}

phoneInput.addEventListener("input", () => {
  phoneInput.value = formatPhone(phoneInput.value);
});

function getPhoneDigits(phone) {
  return phone.replace(/\D/g, "");
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.classList.remove("error", "ok");
  if (type) statusEl.classList.add(type);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const fullName = String(data.get("fullName") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const email = String(data.get("email") || "").trim();
  const vacancy = String(data.get("vacancy") || "").trim();
  const file = data.get("resume");
  const phoneDigits = getPhoneDigits(phone);
  const hasValidPhone = phoneDigits.length === 11 && phoneDigits.startsWith("7");
  const hasFile = file instanceof File && file.size > 0;

  if (!fullName || !email || !vacancy || !hasValidPhone || !hasFile) {
    setStatus("Проверьте форму: заполните все поля и укажите корректный телефон.", "error");
    return;
  }

  const payload = {
    fullName,
    phone,
    email,
    vacancy,
    resumeFileName: file.name,
    savedAt: new Date().toISOString()
  };

  localStorage.setItem("resumeDraft", JSON.stringify(payload));
  setStatus("Данные сохранены. Заявка готова к отправке в HR.", "ok");
});

helpBtn.addEventListener("click", () => {
  const vacancy = document.getElementById("vacancy").value || "не выбрана";
  const subject = encodeURIComponent("Нужна помощь с подачей резюме");
  const body = encodeURIComponent(`Здравствуйте! Нужна помощь с откликом. Вакансия: ${vacancy}.`);
  window.location.href = `mailto:hr@company.com?subject=${subject}&body=${body}`;
});
