/**
 * Tema claro/escuro: aplica preferência salva e alterna ao clicar no botão do header.
 */
(function initThemeToggle() {
  const toggleButton = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;
  if (!toggleButton) return;

  if (localStorage.getItem("theme") === "dark") {
    htmlElement.classList.add("dark");
  }

  toggleButton.addEventListener("click", () => {
    if (htmlElement.classList.contains("dark")) {
      htmlElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      htmlElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  });
})();
