/**
 * Cor do link ativo no header conforme a seção visível (#inicio, #projetos, #experiencia, #contato).
 */
(function initNavScrollSpy() {
  const linkInicio = document.getElementById("link-inicio");
  const linkProjetos = document.getElementById("link-projetos");
  const linkExperiencia = document.getElementById("link-experiencia");
  const linkContato = document.getElementById("link-contato");
  const inicioSection = document.getElementById("inicio");
  const projetosSection = document.getElementById("projetos");
  const experienciaSection = document.getElementById("experiencia");
  const ctaSection = document.getElementById("contato");

  if (!linkInicio || !linkProjetos || !linkExperiencia || !linkContato) return;
  if (!inicioSection || !projetosSection || !experienciaSection || !ctaSection) return;

  const ACTIVE_COLOR = "#00CD07";

  function clearActiveColors() {
    linkInicio.style.color = "";
    linkProjetos.style.color = "";
    linkExperiencia.style.color = "";
    linkContato.style.color = "";
  }

  function updateLinkColors() {
    const scrollY = window.scrollY;
    const inicioTop = inicioSection.offsetTop;
    const projetosTop = projetosSection.offsetTop;
    const experienciaTop = experienciaSection.offsetTop;
    const ctaTop = ctaSection.offsetTop;
    const sectionHeight = window.innerHeight / 2;

    clearActiveColors();

    if (scrollY >= inicioTop - sectionHeight && scrollY < projetosTop - sectionHeight) {
      linkInicio.style.color = ACTIVE_COLOR;
    } else if (
      scrollY >= projetosTop - sectionHeight &&
      scrollY < experienciaTop - sectionHeight
    ) {
      linkProjetos.style.color = ACTIVE_COLOR;
    } else if (scrollY >= experienciaTop - sectionHeight && scrollY < ctaTop - sectionHeight) {
      linkExperiencia.style.color = ACTIVE_COLOR;
    } else if (scrollY >= ctaTop - sectionHeight) {
      linkContato.style.color = ACTIVE_COLOR;
    }
  }

  window.addEventListener("load", updateLinkColors);
  window.addEventListener("scroll", updateLinkColors);
})();
