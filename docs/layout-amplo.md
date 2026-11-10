# Layout amplo e carrossel de borda a borda

## Diagnóstico e decisões

O contêiner global `min(1200px, 90%)` criava margens de 360px em uma janela de 1920px. A própria seção de projetos usava esse contêiner, restringindo a faixa móvel e suas extremidades. Retirar somente um max-width do carrossel não resolveria a largura herdada da seção.

- Seção de projetos passa a ocupar o fluxo completo da página. Apenas título e toolbar usam `.container`. A viewport de rolagem tem largura natural de 100%, sem recuos nem cantos arredondados nas bordas externas. Evita-se `100vw` e margens negativas, que podem incluir a largura de scrollbars e gerar overflow.
- Contêineres usam margens internas fluidas: `clamp(16px, 3vw, 64px)` por lado, sem teto global de 1200px. Em 1920px há aproximadamente 1805px úteis.
- Legibilidade mantém limites próprios: textos do Sobre com até 72ch; texto do hero com até 680px. Foto e texto lado a lado a partir de 1100px e habilidades em duas colunas acima de 950px aproveitam o espaço com conteúdo, sem ampliar fontes.
- Hero desktop usa duas colunas flexíveis equilibradas, com avatar e calendário em grid interno em vez de offsets absolutos negativos. Mantidos limites locais de 500px para o avatar, 320px para o calendário e 850px para o conjunto visual; mobile mantém sua composição compacta.
- Cards do carrossel continuam responsivos, com teto de 460px em monitores grandes. Telas maiores podem mostrar mais projetos em vez de esticar cards. Background fixo cobre toda a janela.

## Validação

Build e lint aprovados. Testes `tests/full_width.py` e `tests/projects_carousel.py` passaram em 320, 375, 390, 430, 768, 1024, 1440 e 1920px.

Verificações: faixa e background com x=0 e largura igual à viewport, ausência de overflow no documento, limites de cards/seções/avatar/calendário, menu e chat. Mantidos testes de loop por período, mouse drag, swipe nativo por CDP, cliques, pausa, hover, controles e reduced motion. Screenshots locais de hero, Sobre, Habilidades e Projetos usados na revisão visual.

Reprodução com Vite na porta 5174 e Python Playwright/Chromium já usados na branch:

```sh
python tests/full_width.py
python tests/projects_carousel.py
```

`BASE_URL`, `HDR_FIXTURE` e `ARTIFACTS` funcionam como nos testes anteriores. As limitações de rede/certificados de imagens externas e de contexto WebGL headless registradas na PR continuam aplicáveis. Os asserts validam a geometria do avatar, não seus pixels. Conferir a renderização 3D e o gesto em aparelho real na prévia da Vercel.

Backend, Gemini, conteúdo e lógica de movimento do carrossel permanecem intactos. Sem dependências novas, merge ou deploy em produção.
