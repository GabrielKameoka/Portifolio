(() => {
  const root = document.documentElement;
  let saved;
  try {
    saved = localStorage.getItem("theme");
  } catch {
    /* Storage may be unavailable. */
  }
  const apply = (dark) => {
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
    const button = document.querySelector(".theme-toggle");
    if (button) {
      button.setAttribute(
        "aria-label",
        dark ? "Ativar tema claro" : "Ativar tema escuro",
      );
      button.setAttribute("aria-pressed", String(dark));
    }
  };
  // The dark workspace is the default; an explicit visitor choice takes priority.
  apply(saved !== "light");
  document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector(".theme-toggle");
    if (!button) return;
    button.hidden = false;
    apply(root.classList.contains("dark"));
    button.addEventListener("click", () => {
      saved = root.classList.contains("dark") ? "light" : "dark";
      apply(saved === "dark");
      try {
        localStorage.setItem("theme", saved);
      } catch {
        /* Still works without storage. */
      }
    });
  });
})();
