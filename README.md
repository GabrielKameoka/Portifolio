# Gabriel Mitsuru — Portfólio

Portfólio de um desenvolvedor backend com visão full-stack. A página principal apresenta projetos, competências aplicadas, experiência freelancer, formação e contato. SinalVortex e RepCortex têm estudos de caso próprios, com decisões técnicas e limites explícitos.

## Desenvolvimento

Requer Node.js 20.19+ e npm.

```sh
npm ci
npm run dev
```

O servidor informa a URL local (normalmente `http://127.0.0.1:5173`). O comando observa o CSS do Tailwind e os arquivos do site.

```sh
npm run build
npm run preview
```

A compilação gera `dist/`, pronto para hospedagem estática. As páginas internas usam URLs relativas e não dependem de fallback de SPA. Nenhum deploy faz parte desta alteração.

## Estrutura e manutenção

- `src/index.html`: apresentação, projetos, trajetória e contatos.
- `src/projetos/`: estudos de caso estáticos de SinalVortex e RepCortex.
- `src/en/`: versões em inglês da home e dos dois estudos de caso. Ao alterar conteúdo, atualize a página correspondente nos dois idiomas.
- `src/assets/css/style.css`: identidade visual, responsividade e temas.
- `src/assets/fonts/`: Bricolage Grotesque e Source Sans 3, locais, com licenças OFL; elementos de código usam a fonte monoespaçada do sistema.
- `src/js/`: preferência de tema e indicação da seção atual.
- `src/input.css`: entrada do Tailwind CSS 4; `src/output.css` é gerado.

HTML, Tailwind CSS 4 e JavaScript, com Vite para desenvolvimento e empacotamento. O conteúdo, os links e os diagramas permanecem acessíveis sem JavaScript. O seletor PT/EN no cabeçalho abre a página equivalente, e os controles interativos usam o idioma da página. O tema escuro em carvão e verde-sálvia é o padrão; a escolha manual de tema fica salva. Não há rastreamento, formulário ou serviço de backend. O diagrama do SinalVortex permite simular entrega e falha inteiramente no navegador. As animações respeitam a preferência por movimento reduzido; a navegação continua com rolagem nativa.

Ao editar projetos, confira a implementação antes de afirmar que uma funcionalidade está pronta. Não publique métricas, disponibilidade ou depoimentos sem evidências. Os diagramas são identificados como tal e não simulam capturas do produto. Os links de código permanecem públicos; Pet’s Fran é apresentado apenas pelo contexto profissional, sem código privado.

Na publicação futura, configure `og:url`, URL canônica e o endereço absoluto de `og:image` com o domínio real. A imagem local de compartilhamento já está incluída; não há um domínio presumido no código.

## Validação

```sh
npx playwright install chromium
npm run test:e2e
```

Os testes iniciam uma prévia da compilação e verificam as seis páginas em 390, 768 e 1440 pixels, nos dois temas, além da troca de idioma, navegação, persistência do tema, ausência de overflow, recursos locais, erros de console, teclado, movimento reduzido e conteúdo sem JavaScript. Capturas da validação ficam em `test-results/` (não versionadas).

## Projetos e contato

- [SinalVortex](https://github.com/GabrielKameoka/SinalVortex): notificações assíncronas com API, Redis, Worker, PostgreSQL e sandbox Mailpit.
- [RepCortex](https://github.com/GabrielKameoka/RepCortex): avaliações, moderação e classificação léxica de sentimentos.
- Pet’s Fran: experiência freelancer com .NET, Angular e PostgreSQL; código privado.
- [Aprenda+](https://github.com/andreluiswebdev/AprendaMais): projeto educacional desenvolvido em equipe no IOS.
- [LinkedIn](https://www.linkedin.com/in/gabriel-mitsuru/) · [GitHub](https://github.com/GabrielKameoka) · [E-mail](mailto:gabrielkameoka@gmail.com) · [WhatsApp](https://wa.me/5511964449982)
