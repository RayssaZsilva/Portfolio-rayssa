# Revisão de responsividade

## Diagnóstico

Revisão do commit `918e97b`, com leitura de todas as seções e medição em Chromium local. O site publicado retornou bloqueio HTTP 403 da política de rede do ambiente; não foi possível comparar o deploy com o checkout.

| Tela | Largura do documento antes | Depois |
| --- | ---: | ---: |
| 320px | 470px | 320px |
| 375px | 460px | 375px |
| 390px | 465px | 390px |
| 430px | 485px | 430px |

- **Hero:** brilho absoluto de 420px ultrapassava a tela; `overflow-x: hidden` no body mascarava a origem. Hero mobile ocupava toda a largura, sem margem lateral; botões e redes tinham alvos pequenos. “Ver Projetos” apontava para a lista de repositórios do usuário autenticado no GitHub.
- **Menu:** faltavam Escape, fechamento por toque fora/saída de foco e relação `aria-controls`. Navegação para seções não compensava o cabeçalho fixo; menu sem altura máxima em landscape.
- **Sobre e habilidades:** regras de largura existentes já comportavam mobile. Mantidas, com títulos que podem quebrar e margens de navegação ajustadas.
- **Projetos:** grid mobile já usava mínimo flexível, mas o grid desktop tinha mínimo rígido. Links de ação não tinham estilo próprio nem alvo mínimo. Badges precisam permitir quebra de textos longos.
- **Contato:** nomes ocultos no mobile e quatro colunas comprimiam os contatos; alguns links ficavam sem nome acessível quando a imagem não carregava.
- **Chat:** controles de 32px, textos mobile de 12px e input de 13px (risco de zoom automático no iOS). `dvh` sozinho não cobre todos os comportamentos de teclado; rolagem por `scrollIntoView` podia mover também a página.
- **3D e movimento:** efeitos contínuos fora da tela, partículas e sombras com o mesmo custo em celulares; cursor registrava movimentos em dispositivos sem mouse. Lenis ativo indiscriminadamente; preferência de movimento reduzido incompleta.

## Correções

Identidade roxa/lilás, conteúdo, projetos e funcionalidades preservados. Menu continua sendo uma navegação expansível, sem armadilha de foco. Chat é um diálogo não modal e mantém acesso ao restante da página.

Corrigida a origem do overflow decorativo; adicionados espaçamento lateral, controles com mínimo de 44px, contatos em duas colunas com rótulos, links de projetos e foco visível. Mantida a composição desktop e corrigida a câmera para três coordenadas, preservando a distância original de 8.

Chat usa `visualViewport.height` e `offsetTop` com listeners removidos ao fechar, fallback para `dvh`, safe areas, input de 16px e rolagem restrita à conversa. Abrir não força teclado virtual. Escape fecha e devolve foco ao botão. Requisição `/api/chat`, histórico, payload e integração Gemini não foram alterados.

3D separado por import dinâmico, DPR mobile 1, 24 partículas em vez de 80 e sombra calculada uma vez no mobile. Movimento reduzido respeitado por Framer Motion e CSS. Rolagem nativa em dispositivos de toque; Lenis restrito a mouse com movimento permitido.

## Validação e reprodução

- `npm run lint` e `npm run build` aprovados. Corrigida importação React sem uso já existente no calendário.
- Chromium: 320, 375, 390, 430, 600, 768, 950, 1024 e 1440px; quatro projetos presentes, limites dos cards, menu, chat e janela reduzida para 350px.
- Teste separado de viewport visual: altura de 300px e deslocamento de 120px, sem reduzir a viewport de layout; cabeçalho, input e fechamento dentro da área visível.
- Envio com resposta HTTP **simulada**: payload/histórico, resposta longa, limpar conversa, Escape e retorno de foco. Não equivale a validar Gemini.
- Screenshots locais usados para revisão. O navegador do ambiente teve falhas de certificado em fontes/ícones externos. O HDR city foi interceptado nos testes com uma cópia local do mesmo arquivo para isolar o layout; a origem do HDR em produção permanece intacta.

Os testes adicionais usam Python Playwright e Chromium; não havia suíte de testes no package.json. Com servidor Vite na porta 5174:

```sh
python tests/responsive.py
python tests/chat_viewport.py
```

Instale `playwright` em ambiente Python próprio se necessário. `BASE_URL` altera a origem; `ARTIFACTS` altera a pasta de screenshots (padrão `work/responsive`). `HDR_FIXTURE` permite apontar para uma cópia local legítima de `potsdamer_platz_1k.hdr` em ambientes com bloqueio de rede. Chromium esperado em `/usr/bin/chromium`.

## Limites e revisão manual

- Conferir teclado real e rotação em Safari/iOS e Chrome/Android; emulação de viewport não substitui aparelho real.
- Sem segredo Gemini configurado, não foi realizado envio real ao serviço. Backend e integração não foram modificados.
- Chunk principal passou de cerca de 1.487kB para 475kB (gzip 424kB para 149kB). O chunk 3D permanece com cerca de 1.014kB; o build mantém esse aviso. Separação de arquivo não implica economia equivalente no download total nem é medição de Core Web Vitals.
- Nenhum merge ou comando de deploy executado. Integrações automáticas do repositório podem gerar previews quando a branch/PR for enviada.
- O Chromium headless apresentou perdas de contexto WebGL em rodadas repetidas. A tentativa de suspender renderização fora da tela foi retirada por cautela; a inspeção do 3D em aparelhos reais permanece necessária. Os asserts de layout não validam pixels do canvas.
