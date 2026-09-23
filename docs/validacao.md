# Validação do portfólio — 22/09/2026

## Resultado

- `npm run build`: aprovado; três entradas HTML estáticas e assets relativos, sem avisos de scripts não empacotados.
- `npm run test:e2e`: 25 testes aprovados no Chromium.
- Matriz visual: página principal, SinalVortex e RepCortex em 390, 768 e 1440 px, nos temas claro e escuro.
- Axe (WCAG 2 A/AA e 2.1 AA): nenhuma violação detectada nas 18 combinações. Isso é uma verificação automatizada, não uma certificação de acessibilidade.
- Sem overflow horizontal de página, erros de JavaScript ou respostas HTTP de erro para os recursos locais nas combinações testadas.
- Navegação entre estudos de caso, indicação da seção ativa, persistência do tema, armazenamento bloqueado, link de pular conteúdo, preferência de movimento reduzido e conteúdo sem JavaScript: aprovados.
- O bloco de comando Docker recebeu foco por teclado para permitir rolagem horizontal em telas pequenas.
- `npm audit`: nenhuma vulnerabilidade reportada após atualização das dependências.

Capturas reproduzíveis são geradas em `test-results/`. A revisão visual conferiu a hierarquia da página, a leitura dos diagramas e as versões para desktop e celular.

## Conteúdo e fontes locais

O conteúdo técnico foi conferido no README e na documentação do SinalVortex, e no README, serviço de avaliações, entidade de domínio, AppDbContext e DashboardHub do RepCortex. Nenhum desses repositórios foi alterado.

A apresentação do RepCortex foi corrigida: análise de sentimento durante a criação, baseada em regras léxicas; configuração do hub não foi tratada como comprovação de emissão de eventos. O SinalVortex é apresentado como demo local com Mailpit, não como entrega externa de e-mail ou sistema de produção.

Os diagramas representam fluxos, sem se passar por telas do produto. Não foram executados os sistemas de origem para criar capturas ou revalidar todas as suas funcionalidades. Formação e experiência freelancer usam as informações já presentes no portfólio.

## Links e publicação

GitHub (perfil, SinalVortex, RepCortex, Aprenda+), roteiro local do SinalVortex e WhatsApp responderam HTTP 200. O LinkedIn retornou HTTP 999 à checagem automática; seu endereço original foi preservado, sem declarar validação de acesso.

Nenhum deploy foi realizado. Antes de publicar, configurar domínio real nos metadados canônicos e de compartilhamento. `node_modules` foi retirado do índice Git e mantido localmente; dependências são reproduzidas por `npm ci` e pelo lockfile.

## Interações e movimento

A abertura recebeu uma animação única no nome e inclinação discreta do diagrama com mouse. Dois controles permitem simular entrega local e falha temporária com encaminhamento para DLQ; não fazem chamadas de API nem enviam mensagens. Botões ficam indisponíveis durante a sequência para impedir execuções concorrentes e voltam a funcionar ao final. Uma nova simulação limpa o estado anterior.

Testes adicionais validaram entrega, falha e nova entrega, ausência de chamadas de backend, execução por teclado e preferência de movimento reduzido. A simulação fornece status acessível e os controles ficam ocultos sem JavaScript. Os projetos têm entrada discreta ao aparecer; botões e links respondem à interação, e o cabeçalho indica o progresso da leitura sem controlar a rolagem.

## Identidade verde e ambiente de desenvolvimento

A identidade usa carvão, verde-sálvia e fontes monoespaçadas para código e navegação. O tema escuro é o padrão, preservando a escolha explícita do visitante. A abertura inclui abas de fluxo e código com trecho conferido no handler do SinalVortex. A seção de decisões relaciona perguntas de engenharia a implementações reais.

As abas suportam setas, Home e End. O controle de animações persiste sua preferência, e movimento reduzido do sistema tem precedência. Os 25 testes incluem essas interações, além da matriz responsiva anterior. Revisão visual adicional em 1440 e 390 px conferiu as duas abas. Build estático gerado em `dist/`; hospedagem e domínio de produção ainda não configurados.
