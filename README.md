# CopaSync

<img src="assets/img/logo.png" alt="Logo CopaSync" width="120">

**CopaSync: A sua Copa, no seu tempo.**

O CopaSync é uma plataforma web responsiva, com aparência de aplicativo, criada para ajudar torcedores a acompanharem a Copa do Mundo 2026 de forma simples, organizada e personalizada.

## Objetivo

Reduzir a sobrecarga de informações, tabelas confusas e poluição visual comuns em plataformas esportivas, entregando uma experiência focada no essencial: jogos, horários, seleções favoritas, grupos, chaveamento e organização pessoal do torcedor.

## Tecnologias usadas

- HTML5
- CSS3
- JavaScript puro
- JSON local
- localStorage

Não há backend, banco de dados, Firebase, API esportiva real ou autenticação real nesta versão.

## Funcionalidades

- Listagem de jogos da Copa 2026
- Filtros por grupo, seleção, fase, data e favoritos
- Favoritar jogos e seleções
- Área personalizada Meu Sync
- Grupos e classificação inicial zerada
- Chaveamento preparado
- Calendário local com localStorage
- Exportação simples de arquivo `.ics`
- Login simulado local
- Tema claro e escuro persistente
- Layout responsivo com navegação mobile inferior

## Estrutura de arquivos

```text
copasync/
├── index.html
├── jogos.html
├── selecoes.html
├── grupos.html
├── chaveamento.html
├── meu-sync.html
├── calendario.html
├── login.html
├── sobre.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   ├── js/jogos.js
│   ├── js/selecoes.js
│   ├── js/grupos.js
│   ├── js/chaveamento.js
│   ├── js/favoritos.js
│   ├── js/calendario.js
│   ├── js/auth.js
│   ├── data/jogos.json
│   ├── data/selecoes.json
│   ├── data/grupos.json
│   ├── data/classificacao.json
│   ├── data/chaveamento.json
│   └── img/logo.png
└── README.md
```

## Como rodar localmente

1. Extraia o arquivo `copasync.zip`.
2. Abra a pasta `copasync` no VS Code.
3. Use a extensão Live Server ou publique diretamente no GitHub Pages.
4. Abra `index.html`.

Observação: como o projeto usa `fetch()` para ler arquivos JSON, a abertura direta por `file://` pode bloquear os dados em alguns navegadores. Use Live Server para testar localmente.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos da pasta `copasync` para a branch principal.
3. Acesse **Settings > Pages**.
4. Em **Build and deployment**, selecione a branch principal e a pasta raiz.
5. Salve e aguarde o link do GitHub Pages ser gerado.

## Limitações da versão atual

- Dados locais de pré-Copa, sem garantia de oficialidade.
- Placar em tempo real ainda não implementado.
- Login apenas simulado com localStorage.
- Calendário com exportação `.ics`, sem integração OAuth com Google Calendar.
- Informações como classificados e confrontos eliminatórios aparecem como “Aguardando classificados” ou “A definir”.

## Melhorias futuras

- Integração com API esportiva
- Placar em tempo real
- Login real com Firebase
- Banco de dados
- Integração real com Google Calendar
- Notificações
- PWA instalável
