# Carrossel de projetos

A seção Meus Projetos usa rolagem horizontal nativa com três conjuntos visuais. O conjunto central é o único exposto a leitores de tela e à navegação por Tab; cópias têm `aria-hidden` e links com `tabIndex=-1`, preservando clique e swipe. Não há novos pacotes.

A posição é normalizada por um período completo entre conjuntos idênticos, antes de alcançar as extremidades. A velocidade é de 25 pixels CSS por segundo, com `requestAnimationFrame`, delta limitado e progresso fracionário. `ResizeObserver` mantém o período correto nas mudanças de largura. Não há timers recorrentes; observers, listeners e frame são removidos ao desmontar. A escrita em scrollLeft para quando fora da área visível ou com aba oculta.

Pausa por hover, foco e interação; após arraste/toque há uma espera de 1,4s antes de retomar. Setas pausam explicitamente para facilitar a leitura. O botão Retomar movimento liga novamente o automático; preferência por movimento reduzido o desativa, inclusive quando muda durante a sessão. Touch usa o scrolling do navegador, incluindo a rolagem vertical da página. Mouse usa um limiar de 6px para diferenciar clique de arraste e suprime o clique após arrastar.

Cards usam a mesma altura de conteúdo máximo, sem corte de descrição ou tecnologias; larguras seguem aproximadamente 3 cards e parte do próximo em desktop, 2 em tablet e 1 em mobile. Mantidos todos os textos, projetos, cores e destinos de links. As mudanças de produto deste commit ficam restritas à seção de projetos.

## Verificação

```sh
npm run lint
npm run build
BASE_URL=http://localhost:5174 python tests/projects_carousel.py
```

Teste usa Python Playwright e `/usr/bin/chromium`, como os demais testes de navegador desta branch. `HDR_FIXTURE` opcional mantém a fixture de iluminação para ambientes restritos; `ARTIFACTS` define a pasta das imagens (padrão `work/carousel`).

Validado em 320, 375, 390, 430, 768, 1024 e 1440px: largura da página, dimensões iguais, normalização por período, conjunto acessível único, setas, mouse drag, swipe por eventos de toque do Chromium, pausa/retomada, hover e mudança de movimento reduzido. Link de demonstração abre nova aba com href preservado; acesso ao destino externo não faz parte do teste. Validar sensação do gesto e inércia também em aparelho real.

O bundle principal aumentou aproximadamente 4kB minificado; nenhum pacote foi adicionado. Continua o aviso pré-existente do chunk 3D acima de 500kB. Testes de interação não constituem medição de Core Web Vitals em celular físico.
