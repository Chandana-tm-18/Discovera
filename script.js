const resultsList = document.getElementById("results");
const searchInputHome = document.getElementById("searchInput");
const searchBtnHome = document.getElementById("searchBtn");
const micBtnHome = document.getElementById("micBtn");
const searchInputTop = document.getElementById("searchInputTop");
const searchBtnTop = document.getElementById("searchBtnTop");
const micBtnTop = document.getElementById("micBtnTop");
const topBar = document.getElementById("topBar");
const mainPage = document.getElementById("mainPage");
const resultsSection = document.getElementById("resultsSection");
const themeToggle = document.getElementById("themeToggle");

let lastQuery = "";

function showHomeView() {
  mainPage.classList.remove("hidden");
  topBar.classList.add("hidden");
  resultsSection.classList.add("hidden");
  searchInputHome.value = "";
  searchInputTop.value = "";
  resultsList.innerHTML = "";
}

function showResultsView(query) {
  mainPage.classList.add("hidden");
  topBar.classList.remove("hidden");
  resultsSection.classList.remove("hidden");
  searchInputTop.value = query;
}

function performSearch(query) {
  if (!query) return;
  lastQuery = query;
  resultsList.innerHTML = '<li>Loading results…</li>';
  fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => {
      resultsList.innerHTML = "";
      if (!Array.isArray(data) || data.length === 0) {
        resultsList.innerHTML = "<li>No results found.</li>";
        return;
      }
      data.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${item.link}" target="_blank"><strong>${item.title}</strong></a>
                        <small>${item.link}</small>
                        <p>${item.description}</p>`;
        resultsList.appendChild(li);
      });
    })
    .catch(() => {
      resultsList.innerHTML = "<li>Server error.</li>";
    });
}

function startVoiceSearch(targetInput) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice search not supported in this browser.");
    return;
  }
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();
  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    targetInput.value = transcript;
    performSearch(transcript);
    showResultsView(transcript);
    history.pushState({ page: "results", query: transcript }, "", "#results");
  };
}

micBtnHome.addEventListener("click", () => startVoiceSearch(searchInputHome));
micBtnTop.addEventListener("click", () => startVoiceSearch(searchInputTop));

searchBtnHome.addEventListener("click", () => {
  const query = searchInputHome.value.trim();
  if (!query) return;
  showResultsView(query);
  performSearch(query);
  history.pushState({ page: "results", query }, "", "#results");
});

searchBtnTop.addEventListener("click", () => {
  const query = searchInputTop.value.trim();
  if (!query) return;
  performSearch(query);
  history.pushState({ page: "results", query }, "", "#results");
});

searchInputHome.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const query = searchInputHome.value.trim();
    if (!query) return;
    showResultsView(query);
    performSearch(query);
    history.pushState({ page: "results", query }, "", "#results");
  }
});

searchInputTop.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const query = searchInputTop.value.trim();
    if (!query) return;
    performSearch(query);
    history.pushState({ page: "results", query }, "", "#results");
  }
});

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");
});

window.addEventListener("popstate", event => {
  if (event.state && event.state.page === "results") {
    showResultsView(event.state.query);
    performSearch(event.state.query);
  } else {
    showHomeView();
  }
});

if (location.hash === "#results") {
  history.replaceState({}, "", location.pathname);
  showHomeView();
}
