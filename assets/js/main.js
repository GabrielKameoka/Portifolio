window.addEventListener('scroll', () => {
    const techSection = document.getElementById('tech');
    const techSectionTop = techSection.offsetTop;
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
  
    if (scrollPosition >= techSectionTop - windowHeight + 480) {
      techSection.classList.add('show');
    } else {
      techSection.classList.remove('show');
    }
  });
  
  window.addEventListener('scroll', () => {
    const conteudoP = document.querySelector('.conteudo-p'); // Corrigido: use querySelector
    const conteudoPTop = conteudoP.offsetTop;
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
  
    if (scrollPosition >= conteudoPTop - windowHeight + 480 ) {
      conteudoP.classList.add('show');
    } else {
      conteudoP.classList.remove('show');
    }
  });