(() => {
  const links = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!sections.length) return;
  let scheduled = false;
  const update = () => {
    scheduled = false;
    let current = "";
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= innerHeight * 0.4)
        current = `#${section.id}`;
    }
    links.forEach((link) => {
      if (link.getAttribute("href") === current)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  addEventListener("resize", update);
  update();
})();
