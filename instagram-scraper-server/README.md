# Browser Automation 🤖 e Scraping 🚜

Este projeto é uma **implementação prática** de como automatizar o **login, raspagem de dados de perfil** e **captura de cookies de sessão** do Instagram, usando **Playwright** dentro de uma aplicação **AdonisJS**.

---

## 🖥️ Contexto

O Instagram protege seu fluxo de login com:

- Proteção **CSRF**
- **CORS**
- `enc_password` dinâmico gerado pelo JavaScript
- Checagem de User-Agent, fingerprint, captcha e 2FA

Por isso, **fazer login por requisições HTTP puras** (Axios, Fetch, Node.js) **não é confiável**.  
A única forma **robusta** é **usar um navegador real**, que simula exatamente o comportamento do usuário.

## 🧩 Autenticação

A automação reutiliza **cookies de sessão** do navegador:

| Cookie                         | Função                             |
| ------------------------------ | ---------------------------------- |
| `sessionid`                    | Identifica sua sessão ativa        |
| `csrftoken`                    | Protege contra CSRF                |
| `ds_user_id`                   | ID do usuário logado               |
| `rur`, `mid`, `datr`, `ig_did` | Rastreamento de sessão/dispositivo |

Os headers incluem:

- **User-Agent real**
- **X-IG-App-ID**
- **X-CSRFToken**

➡️ Basta enviar esses cookies + headers no **axios** ou **fetch** e o Instagram trata como se fosse o navegador.

## 🍪 **Atenção sobre Cookies e Segurança**

- Os `cookies` **não são criptografados** — apenas **assinados** pelo servidor.
- Não é viável “quebrar” o `sessionid`; é **mais seguro** reutilizar ou renovar manualmente.
- Para evitar **bloqueio da conta principal**, recomenda-se usar **conta de teste**.
- **Automação 24/7** é **desaconselhada** — execute scraping manual ou agendado com moderação.

## 🔒 Anti-ban

Para evitar bloqueios:

- Copie o **User-Agent** do navegador real.
- Envie headers corretos (X-IG-App-ID, X-CSRFToken).
- Mantenha os cookies atualizados.
- Faça **delays aleatórios** (800ms–1.5s entre imagens, 2s–4s entre páginas).

⚠️ Scraping de API privada não é permitido oficialmente → sua conta pode ser bloqueada.

---

## 🎲 Por que Playwright ?

- Controle **multi-context** (vários perfis isolados)
- Suporte oficial a **Chromium**, **Firefox** e **WebKit**
- Melhor detecção de bot detection
- Inspecionar facilmente com **Playwright Inspector**
- Permite abrir o navegador visível (`headless: false`) para debug

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

## 🌊 Fluxo do projeto

### 1️⃣ Login

O **código principal** usa:

```ts
await page.goto('https://www.instagram.com/accounts/login/')
await page.fill(...) // Preenche usuário e senha
await page.click(...) // Clica em Entrar
await page.waitForURL(...) // Espera sair da tela de login
```

O Playwright simula exatamente o **navegador real**.

### 2️⃣ Cookies

Após login, extraímos:

- `sessionid` → autenticação da sessão
- `csrftoken` → proteção contra CSRF
- `ds_user_id` → ID do usuário logado
- `x-ig-app-id` → fixo

Estes valores permitem **consultar APIs internas** como:

```ts
GET /api/v1/friendships/{user_id}/followers/
```

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

## 5️⃣ Organização e persistência

Cada consulta é salva num arquivo **\`users.json\`**, com estrutura:

```json
{
    "users": [
        {
          ...
        }
    ]
}
```

## 6️⃣ Por que não usar login via Fetch

📌 **Enc_password**: gerado pelo JS do site  
📌 **CORS**: o Instagram bloqueia origins diferentes  
📌 **CSRF Token**: precisa ser gerado e sincronizado com os cookies  
📌 **Proteção 2FA e captcha**: só o navegador real consegue resolver

---

## ⚙️ Inspeção de Rede

A coleta utiliza rotas privadas da API do Instagram identificadas via DevTools:

- `GET /api/v1/friendships/{user_id}/followers/`
- `GET /api/v1/friendships/{user_id}/following/`

### ⏭️ Conceito de `next_max_id` na API do Instagram

Quando você faz uma requisição para endpoints de paginação do Instagram — por exemplo, `/api/v1/friendships/{user_id}/followers/` — o Instagram não retorna **todos** os seguidores ou seguidos de uma vez. Em vez disso, ele entrega os dados em blocos (páginas).

Para continuar da página atual até a próxima, a API devolve no JSON de resposta uma chave chamada **`next_max_id`**.

Essa chave é um _cursor_ de paginação: ela representa um identificador interno que o Instagram usa para saber onde parou na lista completa.

#### 💬 Exemplo de resposta

```json
{
  "users": [
    { "id": "123", "username": "alice" },
    { "id": "456", "username": "bob" }
  ],
  "next_max_id": "QVFBZ1VoSE5T...",
  "big_list": true,
  "page_size": 50,
  "status": "ok"
}
```

- `users`: lista parcial (primeira página).
- `next_max_id`: cursor para pegar a **próxima página**.
- `big_list`: indica que ainda existem mais páginas.

#### 📱 Como usar

O fluxo básico:

1. Você faz a **primeira requisição** SEM `max_id`.
2. Você recebe `next_max_id`.
3. Para a **próxima requisição**, você passa `?max_id={next_max_id}`.
4. Repete até que `next_max_id` não exista ou seja `null`.

#### 🏃‍➡️ Na prática com Playwright ou Axios

- No Playwright: você intercepta o `next_max_id` observando as `fetch` ou XHRs.
- No Axios ou fetch puro: o backend faz as chamadas REST passando o `max_id` como parâmetro.

Exemplo:

```ts
let nextMaxId: string | undefined = undefined

do {
  const res = await InstagramApi.getFriendships(userId, type, nextMaxId)

  // Processa os usuários
  const users = res.users

  // Atualiza o cursor
  nextMaxId = res.next_max_id
} while (nextMaxId)
```

#### 🦋 Boas práticas

✅ Sempre trate `next_max_id` como **string** — não manipule o valor.
✅ Respeite delays (sleep) entre requisições para evitar bloqueios de IP.
✅ Use `do...while` para garantir que a primeira chamada execute mesmo sem `max_id`.
✅ Salve o progresso se for fazer scraping em larga escala.

#### 🚩 Problemas comuns

⚠️ Se ignorar o `next_max_id`, você vai coletar apenas a **primeira página**.
⚠️ Se passar um `max_id` inválido, pode receber erro HTTP ou lista vazia.
⚠️ Se a sessão expirar (cookies/headers errados), o Instagram responde `login_required`.

#### 📌 Resumo

- `next_max_id` é essencial para **raspar listas longas**.
- É uma forma de paginação **stateful** — o servidor lembra do ponto exato.
- Sem ele, APIs públicas limitariam o scraping a apenas poucos resultados.

## 🗃️ Armazenamento

**Fluxo interno:**

1. Remove JSON antigo.
2. Faz requisições paginadas.
3. Salva blocos de usuários no `/app/data/json/ID_followers.json` ou `ID_following.json`.
4. Baixa fotos de perfil em `public/img`.

Delays controlam o ritmo para reduzir risco de bloqueio.

## 🔍 Análise

A rota `/compare` calcula:

- **notFollowingBack** → quem te segue mas você não segue.
- **notFollowedBack** → quem você segue mas não te segue.

---

### Imagem Static

Salvar as fotos de perfil dos usuários coletados pelo scraper **no backend** e servir essas imagens **diretamente via HTTP** usando o AdonisJS v6.

#### ✅ Estrutura de Diretórios

```
instagram-scraper-server/
 ├─ app/
 ├─ public/
 │   └─ img/       # 📸 Aqui ficam as imagens salvas
 ├─ config/
 ├─ start/
 │   ├─ kernel.ts  # ⚙️ Registra middleware e static server
 │   └─ routes.ts  # 🗺️ Define as rotas principais
```

#### ⚙️ Passo 1 — Baixar a Imagem com Axios

```ts
// services/instagram_service.ts

import axios from 'axios'
import app from '@adonisjs/core/services/app'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'

const streamPipeline = promisify(pipeline)

export default class InstagramService {
  static async downloadImage(user: any) {
    const dest = app.publicPath(`img/${user.id}_${user.username}.jpg`)

    try {
      const response = await axios.get(user.profile_pic_url, {
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://www.instagram.com/',
        },
      })

      await streamPipeline(response.data, createWriteStream(dest))
      console.log(`✔️ Avatar salvo em: ${dest}`)
    } catch (error) {
      console.error(`❌ Erro ao baixar imagem de ${user.username}:`, error)
    }
  }
}
```

**📝 Observações**

- Usa **Axios** com `responseType: 'stream'` para receber o fluxo binário.
- `app.publicPath()` garante que o arquivo vá pra `public/img/`.

#### ⚙️ Passo 2 — Servir o Diretório `public/` como Arquivos Estáticos

No **AdonisJS v6**, **NÃO** existe `Server.static` como no v5.
Use o pacote `@adonisjs/static`.

**Exemplo:**
No `start/kernel.ts`:

```ts
import staticServer from '@adonisjs/static/services/main'

staticServer.serve()
```

> ✅ Isso expõe **automaticamente** todos os arquivos dentro de `/public`.

#### ⚡ Como Funciona na URL

- Um arquivo salvo em:

  ```
  /project_root/public/img/12345_user.jpg
  ```

- Fica acessível em:

  ```
  http://localhost:3333/img/12345_user.jpg
  ```

#### 📌 Resumo do Fluxo

1. **Coleta**: Você chama a função que coleta seguidores/seguidos.
2. **Baixa**: Para cada usuário, `downloadImage()` salva a foto em `public/img/`.
3. **Exibe no Front**: Use `<img src="http://localhost:3333/img/${user.id}_${user.username}.jpg">` no React/Next.js.
4. **🚫 Sem Proxy**: O Next.js faz requisição HTTP normal, sem proxy extra.

#### 🚩 Problemas comuns resolvidos

- **Erro 404:**
  👉 Solução: Use `staticServer.serve()` e salve dentro de `public/`.

- **Caminho errado:**
  👉 Solução: Use `app.publicPath()` para construir o caminho absoluto no disco.

- **User-Agent bloqueado:**
  👉 Solução: Use um `User-Agent` real e cookies se necessário.

#### ✅ Produção

- Organize imagens em subpastas, se preferir.
- Crie uma rotina para limpeza de imagens antigas, se necessário.
- Use CDN na frente do `/public` se precisar escalar.

---

## 🛠️ Comandos Úteis - Adonis.js

```bash
# Criar controller
node ace make:controller Instagram

# Criar model + migration
node ace make:model Follower -m

# Criar migration isolada
node ace make:migration followers

# Exemplo de rota (AdonisJS 6)
import router from '@adonisjs/core/services/router'
router.get('/', async () => ({ hello: 'world' }))
router.get('/followers', ['InstagramsController', 'followers'])
```

---

Este projeto é um estudo pessoal de scraping e automação controlada, com foco **educacional**, para entender headers, cookies e estratégias anti-bloqueio.
