# 📸 Instagram Scraper - Followers Analyzer

Este projeto é **um sistema fullstack**, para realizar **raspagem de dados do Instagram** de forma controlada e segura.

## ✅ **Objetivo**

Automatizar a coleta dos **seguidores** e **pessoas que você segue** no Instagram, e gerar **duas análises principais**:

- 👀 **Quem você segue e não te segue de volta**
- 🤝 **Quem te segue mas você não segue de volta**

A ideia principal é **estudar a API privada do Instagram**, entendendo como funcionam os headers, cookies, sessões e como contornar limites sem violar regras de uso de forma agressiva.

Para isso, foi feita uma **inspeção de rede (Network tab)** no navegador para mapear **rotas reais** usadas quando você abre a lista de seguidores pelo site.

---

## 🧩 **Resumo Técnico**

- **Back-end:** AdonisJS (Node.js + TypeScript)
- **HTTP Requests:** Axios
- **Fila de Tarefas:** Delay no setTimeout (controle de taxa de requisições)
- **Banco:** JSON
- **Front-end:** React + Next.js
- **Infraestrutura:** Cookies reais de sessão reutilizados para autenticação na API privada do Instagram.
- **Anti-bloqueio:** Delays aleatórios, user-agent real, headers espelhados.

---

## 📌 Projeto `instagram-scraper-server`

Este é o backend da aplicação, responsável por coletar seguidores, seguindo e comparar relacionamentos.

* **Instalação**

  ```bash
  npm install
  ```

* **Execução**

  ```bash
  node ace serve --watch
  ```

* **Mais informações**: [Veja o README do instagram-scraper-server](./instagram-scraper-server/README.md)

---

## 📌 Projeto `instagram-scraper-web`

Este é o frontend da aplicação, construído com Next.js, que consome o backend para mostrar progresso, resultados e comparações.

* **Instalação**

  ```bash
  npm install
  ```

* **Execução**

  ```bash
  npm run dev
  ```

* **Mais informações**: [Veja o README do instagram-scraper-web](./instagram-scraper-web/README.md)
