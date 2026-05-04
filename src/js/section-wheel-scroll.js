/**
 * Desktop: scroll por "degrau" entre #inicio, #projetos, #experiencia e #contato (wheel).
 * Em telas ≤768px o comportamento é o scroll nativo (sem interceptar).
 */
(function initSectionWheelScroll() {
  const inicioSection = document.getElementById("inicio");
  const projetosSection = document.getElementById("projetos");
  const experienciaSection = document.getElementById("experiencia");
  const ctaSection = document.getElementById("contato");

  const sections = [inicioSection, projetosSection, experienciaSection, ctaSection];
  if (sections.some((el) => !el)) return;

  let isScrollingBetweenSections = false;
  let currentSectionIndex = 0;
  let sectionEdgeArmed = false;
  let armedSectionIndex = null;
  let armedDirection = 0;
  let armTimeoutId = null;

  function getCurrentSectionIndex() {
    const anchorY = window.scrollY + 120;
    let currentIndex = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= anchorY) {
        currentIndex = index;
      }
    });
    return currentIndex;
  }

  function scrollToSection(targetIndex) {
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    isScrollingBetweenSections = true;
    currentSectionIndex = targetIndex;
    sections[targetIndex].scrollIntoView({ behavior: "smooth", block: "start" });

    setTimeout(() => {
      isScrollingBetweenSections = false;
    }, 750);
  }

  function resetEdgeArm() {
    sectionEdgeArmed = false;
    armedSectionIndex = null;
    armedDirection = 0;
    if (armTimeoutId) {
      clearTimeout(armTimeoutId);
      armTimeoutId = null;
    }
  }

  function armEdge(sectionIndex, direction) {
    sectionEdgeArmed = true;
    armedSectionIndex = sectionIndex;
    armedDirection = direction;
    if (armTimeoutId) clearTimeout(armTimeoutId);
    armTimeoutId = setTimeout(() => {
      resetEdgeArm();
    }, 900);
  }

  function canLeaveSection(section, direction) {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const viewportTop = window.scrollY;
    const viewportBottom = viewportTop + window.innerHeight;
    const threshold = 12;

    if (direction > 0) {
      return viewportBottom >= sectionBottom - threshold;
    }
    if (direction < 0) {
      return viewportTop <= sectionTop + threshold;
    }
    return false;
  }

  window.addEventListener(
    "wheel",
    (event) => {
      if (window.innerWidth <= 768) return;
      if (isScrollingBetweenSections) {
        event.preventDefault();
        return;
      }

      const direction = Math.sign(event.deltaY);
      if (direction === 0) return;

      currentSectionIndex = getCurrentSectionIndex();
      const activeSection = sections[currentSectionIndex];

      if (!canLeaveSection(activeSection, direction)) {
        resetEdgeArm();
        return;
      }

      const isArmedForThisMove =
        sectionEdgeArmed &&
        armedSectionIndex === currentSectionIndex &&
        armedDirection === direction;

      if (!isArmedForThisMove) {
        armEdge(currentSectionIndex, direction);
        return;
      }

      const nextIndex = currentSectionIndex + direction;
      if (nextIndex < 0 || nextIndex >= sections.length) return;

      resetEdgeArm();
      event.preventDefault();
      scrollToSection(nextIndex);
    },
    { passive: false }
  );
})();
