/**
 * Animações on scroll (biblioteca AOS carregada no <head>).
 */
(function initAos() {
  if (typeof AOS === "undefined") return;
  AOS.init({
    duration: 1000,
    easing: "ease-in-out",
    once: true,
  });
})();
