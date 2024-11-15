document.addEventListener("DOMContentLoaded", () => {
  fetchIntegrations();

  const paragonUrls = {
    dashboard: "https://dashboard.useparagon.com",
    login: "https://dashboard.useparagon.com/login",
  };

  const dashboardButton = document.getElementById("dashboardButton");
  const loginButton = document.getElementById("loginButton");

  dashboardButton?.addEventListener("click", () =>
    openURL(paragonUrls.dashboard)
  );
  loginButton?.addEventListener("click", () => openURL(paragonUrls.login));
});

async function fetchIntegrations() {
  try {
    const response = await fetch("/assets/integrations.json");
    const integrations = await response.json();
    initializeIntegrations(integrations);
  } catch (error) {
    console.error("Failed to load integrations:", error);
  }
}

function initializeIntegrations(integrations) {
  const searchInput = document.getElementById("searchInput");
  const debouncedSearch = debounce((searchTerm) => {
    const filteredIntegrations = integrations.filter((integration) =>
      integration.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    renderIntegrations(filteredIntegrations);
  }, 300);

  searchInput.addEventListener("input", (e) => debouncedSearch(e.target.value));
  renderIntegrations(integrations);
}

function renderIntegrations(data) {
  const integrationList = document.getElementById("integrationList");
  integrationList.innerHTML = "";

  data.forEach((integration) => {
    integrationList.appendChild(renderIntegrationItem(integration));
  });
}

function renderIntegrationItem(integration) {
  const item = document.createElement("div");
  item.className = "integration-item";

  const icon = document.createElement("img");
  icon.src = integration.icon_url;
  icon.alt = `${integration.name} icon`;
  icon.onerror = () => {
    icon.src = "/assets/icons/logo48.png";
  };

  const name = document.createElement("span");
  name.textContent = integration.name;

  item.addEventListener("click", () => openURL(integration.doc_url));
  item.appendChild(icon);
  item.appendChild(name);

  return item;
}

function openURL(url) {
  window.open(url, "_blank");
}

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
