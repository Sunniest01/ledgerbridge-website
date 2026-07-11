const root = document.documentElement;
const body = document.body;
const languageButton = document.querySelector("[data-language-toggle]");
const translatable = document.querySelectorAll("[data-en], [data-th]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const year = document.querySelector("[data-year]");

const savedLanguage = localStorage.getItem("ledgerbridge-language");
const browserLanguage = navigator.language && navigator.language.toLowerCase().startsWith("th") ? "th" : "en";
let currentLanguage = savedLanguage || browserLanguage;

function applyLanguage(language) {
  currentLanguage = language;
  root.lang = language;
  body.dataset.lang = language;
  localStorage.setItem("ledgerbridge-language", language);

  translatable.forEach((node) => {
    const text = node.dataset[language];
    if (text) node.textContent = text;
  });

  document.querySelectorAll("[data-en-placeholder], [data-th-placeholder]").forEach((node) => {
    const placeholder = node.dataset[`${language}Placeholder`];
    if (placeholder) node.setAttribute("placeholder", placeholder);
  });

  document.querySelectorAll("[data-en-href], [data-th-href]").forEach((node) => {
    const href = node.dataset[`${language}Href`];
    if (href) node.setAttribute("href", href);
  });

  document.title =
    language === "th"
      ? "LedgerBridge Thailand | บัญชี ภาษี แปลภาษา และประสานงานเอกสารราชการ"
      : "LedgerBridge Thailand | Accounting, Tax, Translation & Government Document Support";

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      language === "th"
        ? "บริการบัญชี ภาษี แปลไทย-อังกฤษ ล่าม และประสานงานเอกสารราชการไทยสำหรับลูกค้าต่างชาติและ SME ไทย"
        : "Bilingual accounting, tax filing support, EN-TH translation, interpretation, and Thai government document coordination for foreign clients and Thai SMEs."
    );
  }
}

languageButton?.addEventListener("click", () => applyLanguage(currentLanguage === "en" ? "th" : "en"));

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const data = new FormData(form);
  const subject = encodeURIComponent(`LedgerBridge inquiry: ${data.get("service")}`);
  const bodyText = [
    `Service: ${data.get("service")}`,
    `Name: ${data.get("name")}`,
    `Company: ${data.get("company") || "-"}`,
    `Email: ${data.get("email")}`,
    `Phone: ${data.get("phone")}`,
    "",
    "Message:",
    data.get("message")
  ].join("\n");

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ledgerbridge.acc@gmail.com&su=${subject}&body=${encodeURIComponent(bodyText)}`;
  window.open(gmailUrl, "_blank", "noopener");

  if (formStatus) {
    formStatus.textContent =
      currentLanguage === "th"
        ? "ระบบกำลังเปิด Gmail ให้คุณ หากไม่เปิด กรุณาส่งอีเมลโดยตรงไปที่ ledgerbridge.acc@gmail.com"
        : "Opening Gmail. If it does not open, please email ledgerbridge.acc@gmail.com directly.";
  }
});

if (year) year.textContent = new Date().getFullYear();
applyLanguage(currentLanguage);



const phoneModal = document.querySelector("[data-phone-modal]");
const phoneOpenButtons = document.querySelectorAll("[data-phone-open]");
const phoneCloseButtons = document.querySelectorAll("[data-phone-close]");
const copyPhoneButton = document.querySelector("[data-copy-phone]");
const phoneNumberInput = document.querySelector("[data-phone-number]");
const phoneCopyStatus = document.querySelector("[data-phone-copy-status]");
let lastFocusedElement = null;

function openPhoneModal() {
  if (!phoneModal) return;
  lastFocusedElement = document.activeElement;
  phoneModal.hidden = false;
  document.body.classList.add("modal-open");
  phoneNumberInput?.focus();
  phoneNumberInput?.select();
}

function closePhoneModal() {
  if (!phoneModal) return;
  phoneModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (phoneCopyStatus) phoneCopyStatus.textContent = "";
  lastFocusedElement?.focus?.();
}

phoneOpenButtons.forEach((button) => button.addEventListener("click", openPhoneModal));
phoneCloseButtons.forEach((button) => button.addEventListener("click", closePhoneModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && phoneModal && !phoneModal.hidden) closePhoneModal();
});

copyPhoneButton?.addEventListener("click", async () => {
  const phoneNumber = phoneNumberInput?.value || "+66 (0) 82 545 3235";
  try {
    await navigator.clipboard.writeText(phoneNumber);
    if (phoneCopyStatus) {
      phoneCopyStatus.textContent = currentLanguage === "th" ? "คัดลอกเบอร์โทรศัพท์แล้ว" : "Phone number copied.";
    }
  } catch {
    phoneNumberInput?.focus();
    phoneNumberInput?.select();
    if (phoneCopyStatus) {
      phoneCopyStatus.textContent = currentLanguage === "th" ? "เลือกเบอร์ไว้แล้ว กด Ctrl+C เพื่อคัดลอก" : "Number selected. Press Ctrl+C to copy.";
    }
  }
});

