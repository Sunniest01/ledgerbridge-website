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
    `Phone / LINE: ${data.get("phone")}`,
    "",
    "Message:",
    data.get("message")
  ].join("\n");

  window.location.href = `mailto:hello@ledgerbridge.co.th?subject=${subject}&body=${encodeURIComponent(bodyText)}`;

  if (formStatus) {
    formStatus.textContent =
      currentLanguage === "th"
        ? "ระบบกำลังเปิดอีเมลของคุณ หากไม่เปิด กรุณาส่งอีเมลโดยตรง"
        : "Opening your email app. If it does not open, please email us directly.";
  }
});

if (year) year.textContent = new Date().getFullYear();
applyLanguage(currentLanguage);

