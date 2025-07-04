# 📸 Instagram Browser Automation e Scraping com Playwright + AdonisJS

Este projeto é uma **implementação prática** de como automatizar o **login, raspagem de dados de perfil** e **captura de cookies de sessão** do Instagram, usando **Playwright** dentro de uma aplicação **AdonisJS**.

---

## 📌 Contexto

O Instagram protege seu fluxo de login com:

- Proteção **CSRF**
- **CORS**
- `enc_password` dinâmico gerado pelo JavaScript
- Checagem de User-Agent, fingerprint, captcha e 2FA

Por isso, **fazer login por requisições HTTP puras** (Axios, Fetch, Node.js) **não é confiável**.  
A única forma **robusta** é **usar um navegador real**, que simula exatamente o comportamento do usuário.

---

## Por que Playwright ?

- Controle **multi-context** (vários perfis isolados)
- Suporte oficial a **Chromium**, **Firefox** e **WebKit**
- Melhor detecção de bot detection
- Inspecionar facilmente com **Playwright Inspector**
- Permite abrir o navegador visível (`headless: false`) para debug

---

## ⚡️ Comandos úteis

### 🔍 Abrir o Inspector

Execute sua automação Playwright com:

```bash
DEBUG=pw:api node ace serve --watch
```

Ou:

```bash
npx playwright codegen https://www.instagram.com/
```

Assim, você **assiste** cada passo:

- `page.goto()`
- `page.fill()`
- `page.click()`
- `page.waitForURL()`

---

## 🚀 Fluxo do projeto

### 1️⃣ Login

O **código principal** usa:

```ts
await page.goto('https://www.instagram.com/accounts/login/')
await page.fill(...) // Preenche usuário e senha
await page.click(...) // Clica em Entrar
await page.waitForURL(...) // Espera sair da tela de login
```

O Playwright simula exatamente o **navegador real**.

---

### 2️⃣ Cookies

Após login, extraímos:

- `sessionid` → autenticação da sessão
- `csrftoken` → proteção contra CSRF
- `ds_user_id` → ID do usuário logado
- `x-ig-app-id` → fixo `936619743392459`

Estes valores permitem **consultar APIs internas** como:

```ts
GET /api/v1/friendships/{user_id}/followers/
```

---

### 3️⃣ Entrar no perfil alvo

Depois do login, navegamos para o perfil desejado:

```ts
await page.goto(\`https://www.instagram.com/\${credentials.search}/\`)
```

Capturamos:

- Número de postagens
- Número de seguidores
- Número de seguindo
- Foto do perfil
- Nome completo e bio (raspagem via blocos do \`header\`)

---

### 4️⃣ Descobrir o `user_id` do perfil

O `user_id` **não vem em cookie**, mas:

- É capturado **quando você clica em "Seguidores"**, pois o Instagram faz um **request AJAX**:

  ```ts
  /api/v1/friendships/{user_id}/followers/
  ```

- O código escuta todas as \`requests\`:

  ```ts
  page.on('request', (request) => {
    if (url.includes('/api/v1/friendships/') && url.includes('/followers')) {
      // Extrai user_id da URL
    }
  })
  ```

---

## 5️⃣ Organização e persistência

Cada consulta é salva num arquivo **\`users.json\`**, com estrutura:

```json
{
    "users": [
        {
            "info": { ... },
            "session": { ... }
        }
    ]
}
```

---

## 6️⃣ Por que não usar login via Fetch

📌 **Enc_password**: gerado pelo JS do site  
📌 **CORS**: o Instagram bloqueia origins diferentes  
📌 **CSRF Token**: precisa ser gerado e sincronizado com os cookies  
📌 **Proteção 2FA e captcha**: só o navegador real consegue resolver

---

## Resumo técnico

✔️ **Login via Playwright:** simula navegação real  
✔️ **Extrai cookies:** `context.cookies()`  
✔️ **Captura `user_id`:** intercepta AJAX `/api/v1/friendships/`  
✔️ **Raspa dados do perfil:** `page.locator()`, `page.getByText()`  
✔️ **Abre Inspector:** `DEBUG=pw:api`  
✔️ **Salva resultados:** JSON local como mini-banco de dados

---

## Benefícios

✔️ Escala para múltiplos perfis  
✔️ Funciona em qualquer máquina (Playwright cuida do navegador)  
✔️ Cookies reais para uso em **fetch** ou **axios** backend  
✔️ Mantém controle total: `sessionid`, `csrf_token`, `ds_user_id`  
✔️ Pode baixar seguidores, seguindo, fotos de perfil em alta

---

## Conclusão

Se precisa **burlar CORS**, **simular o enc_password** ou **passar na proteção anti-bot** → use sempre **Playwright ou Puppeteer**.  
Depois, use os **cookies** pra fazer chamadas REST **puras** (\`Axios\`, \`node-fetch\`).

**🚀 Projeto real, escalável, testado na prática. Boa raspagem!**
