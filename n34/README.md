# Grão & Arte — Cafeteria Artesanal

Site institucional de porte médio para uma cafeteria fictícia, desenvolvido como
projeto da disciplina (Trabalho N3). HTML5 semântico, CSS responsivo Mobile First
e interatividade em JavaScript puro (vanilla), sem frameworks e sem banco de dados.

---

## 1. Escopo Fechado

**Objetivo do site:** apresentar a cafeteria Grão & Arte como marca — contar sua
história, exibir o cardápio completo e oferecer um canal de contato funcional,
simulando reservas, dúvidas e parcerias comerciais.

**Público-alvo:** adultos de 25–45 anos, moradores ou visitantes de Jaraguá do Sul,
interessados em café especial, ambientes para trabalho remoto/leitura e
experiências gastronômicas com identidade de marca forte.

**Paleta de cores e por quê:**

| Cor | Hex | Uso | Justificativa |
|---|---|---|---|
| Espresso (escuro) | `#1C0A00` | Fundo do hero, navbar, footer | Remete à cor do café torrado; cria contraste de alto impacto e transmite sofisticação |
| Âmbar | `#C8780A` | CTAs, destaques, links ativos | Cor quente associada a calor e acolhimento — psicologicamente estimula apetite e conforto |
| Dourado | `#E8970C` | Gradientes em botões | Acentua o âmbar, sugere "artesanal premium" |
| Creme | `#F6EDDB` | Fundo geral das seções | Simula papel/leite, reduz fadiga visual em blocos extensos de texto |
| Marrom médio | `#3D2007` | Gradientes em cards visuais | Profundidade, evita o uso de preto puro |

**Tipografia:** combinação de uma serifada (`Georgia`, nativa do sistema) para
títulos — transmitindo tradição e artesanalidade — com uma sans-serif (`-apple-system`/`Segoe UI`,
pilha de fontes do sistema) para corpo de texto, garantindo legibilidade em qualquer
dispositivo. Optamos por fontes de sistema (sem Google Fonts) para que o site
funcione 100% offline, sem dependência de CDN externo.

**Framework:** **nenhum**. O projeto foi construído em HTML5 + CSS3 + JavaScript
vanilla puro, por dois motivos: (1) atender ao requisito de demonstrar domínio
direto dos conceitos da disciplina (seletores, box model, flexbox/grid,
manipulação de DOM, Regex, eventos) sem abstrações de terceiros; (2) eliminar
qualquer necessidade de configuração de ambiente, bundler ou servidor — o
arquivo `index.html` roda sozinho, em qualquer navegador, com duplo clique.

---

## 2. Arquitetura do Site

O projeto agora é **multipágina** (cada seção é um arquivo HTML independente),
com CSS e JavaScript centralizados em arquivos compartilhados para manter
consistência visual e evitar duplicação de código.

```
index.html           Página inicial (Home)
sobre.html            Página Sobre (história, valores, equipe)
cardapio.html         Página Cardápio (filtros + modal de produto)
servicos.html         Página Serviços (eventos, workshops, assinatura — nova)
contato.html          Página Contato (informações + formulário validado)
css/
  └─ style.css        Folha de estilo única, compartilhada por todas as páginas
js/
  └─ main.js           Script único, compartilhado, com checagens defensivas
README.md             Este arquivo
```

### Páginas

**🏠 Início (`index.html`)**
Hero com headline, estatísticas da marca e CTA duplo. Seção de 4 diferenciais
(cards) e banner de chamada para ação final.

**☕ Sobre (`sobre.html`)**
Hero institucional, bloco de "nossa história" (texto + elemento visual),
grid de 4 valores da marca e cards da equipe (3 integrantes fictícios).

**📋 Cardápio (`cardapio.html`)**
Sistema de filtros por categoria (Cafés, Chás, Doces, Salgados) que mostra/oculta
seções via JS. 15 itens distribuídos em 5 categorias, cada um clicável — abre um
modal (`role="dialog"`) com descrição detalhada, preço e tags sensoriais.

**🛠️ Serviços (`servicos.html`) — nova página**
Apresenta 6 serviços oferecidos pela cafeteria (eventos privados, workshops de
barismo, café corporativo, clube de assinatura, delivery para escritórios e
cestas personalizadas), cada um com preço de referência. Inclui uma seção de
"como contratar" em 4 passos numerados (já que aqui a numeração representa
uma sequência real de processo) e um CTA final direcionando para Contato.

**✉️ Contato (`contato.html`)**
Informações de localização/horário/telefone + formulário completo com validação.

### Por que essa arquitetura

O projeto foi reestruturado de SPA (página única com JavaScript alternando
seções) para **multipágina real**: cada rota é um arquivo `.html` próprio,
navegável por URL, com histórico de navegador funcionando nativamente
(botões voltar/avançar, abrir em nova aba, compartilhar link direto de uma
seção específica). CSS (`css/style.css`) e JavaScript (`js/main.js`) ficam
em arquivos únicos, compartilhados por todas as páginas via `<link>` e
`<script src>`, evitando duplicação de ~700 linhas de estilo em cada arquivo.

Como o JavaScript é o mesmo em todas as páginas mas cada página só tem alguns
dos elementos (por exemplo, o formulário só existe em `contato.html`), todo
trecho de `main.js` que manipula um elemento específico faz a verificação
`if (elemento) { ... }` antes de agir — isso garante que abrir qualquer página
isoladamente não gera erros no console, mesmo sem os elementos das outras
páginas presentes no DOM.

**Importante:** como agora são múltiplos arquivos `.html` carregando `css/style.css`
e `js/main.js` via caminho relativo, o projeto deve ser aberto a partir da pasta
extraída — não mova `index.html` para fora da pasta sem mover `css/` e `js/`
junto, ou os caminhos relativos vão quebrar.

---

## 3. HTML5 & Acessibilidade

- Tags semânticas: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- Skip link (`Pular para o conteúdo`) para usuários de teclado/leitores de tela.
- Atributos ARIA: `aria-label`, `aria-required`, `aria-live`, `aria-pressed`,
  `aria-expanded`, `role="dialog"`, `role="alert"`, `role="listitem"`.
- Navegação por teclado: itens do cardápio e botões respondem a `Enter`/`Espaço`;
  `Esc` fecha modal e menu mobile.
- Contraste de cores testado para leitura confortável (texto escuro sobre fundo
  claro nas seções de conteúdo; texto claro sobre fundo escuro no hero/footer).
- Respeita `prefers-reduced-motion` para usuários sensíveis a animação.

## 4. CSS & Responsividade

- **Mobile First:** todo o CSS parte do layout de smartphone (`grid-template-columns: 1fr`)
  e expande progressivamente via `@media (min-width: 600px)` e `@media (min-width: 900px)`.
- Variáveis CSS (`:root`) centralizam cores, espaçamentos e easing de transição.
- Layout construído com **Flexbox** (navbar, cards, formulário) e **CSS Grid**
  (grids de features, equipe, valores, itens do cardápio) — sem uso de floats.
- "Teste do aperto": testado de 320px a 1920px sem rolagem horizontal e sem
  quebra de elementos.

## 5. Interatividade (JavaScript)

Tudo implementado em **JavaScript vanilla**, sem bibliotecas:

- **Navegação SPA:** troca de página via delegação de eventos (`data-page`).
- **Menu hamburguer:** abre/fecha com animação de transformação dos traços em X.
- **Filtro de cardápio:** botões de categoria escondem/mostram seções via DOM.
- **Modal de produto:** populado dinamicamente com `dataset` de cada item.
- **Validação de formulário com Regex:**
  - E-mail: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`
  - Nome: apenas letras, mínimo 3 caracteres
  - Telefone: máscara automática + validação de 10–11 dígitos
  - Mensagem: mínimo 20 caracteres, contador dinâmico até 500
  - **Nenhum uso de `alert()`** — todo erro/sucesso é exibido na própria
    interface (`role="alert"`, mensagens inline abaixo de cada campo),
    atendendo à Heurística 9 de Nielsen (prevenção de erros com mensagens claras).
- **Scroll reveal:** elementos aparecem com fade-in via `IntersectionObserver`
  conforme entram na viewport.
- **Scroll-to-top:** botão flutuante que aparece após 400px de rolagem.

---

## 6. Divisão de Tarefas do Grupo

> ⚠️ Campo a ser preenchido pela equipe antes da entrega final.

| Integrante | Responsabilidade |
|---|---|
| [Nome 1] | Estruturação HTML semântico, conteúdo das páginas Início e Sobre |
| [Nome 2] | Engenharia CSS — sistema de variáveis, grid/flexbox, responsividade |
| [Nome 3] | JavaScript — navegação SPA, modal e filtros do cardápio |
| [Nome 4] | JavaScript — validação de formulário com Regex e feedback de UI |
| [Nome 5] | Conteúdo do cardápio, revisão de acessibilidade e testes de "aperto" de tela |

---

## 7. Como executar

Não há instalação nem dependências externas (sem CDN, sem Google Fonts, sem
build). Basta:

1. Extrair a pasta compactada mantendo a estrutura de diretórios (`css/`, `js/`
   junto dos arquivos `.html`).
2. Abrir `index.html` com duplo clique, **ou**
3. Arrastar `index.html` para qualquer navegador (Chrome, Firefox, Edge).

A partir do Início, toda a navegação entre páginas (Sobre, Cardápio, Serviços,
Contato) funciona pelos links do menu — sem precisar reabrir arquivos manualmente.
