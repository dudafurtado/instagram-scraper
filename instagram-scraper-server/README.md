# 🚦 Funcionamento da Coleta — Instagram Scraper

## ⚙️ Inspeção de Rede

A coleta utiliza rotas privadas da API do Instagram identificadas via DevTools:

- `GET /api/v1/friendships/{user_id}/followers/`
- `GET /api/v1/friendships/{user_id}/following/`
- `POST /api/v1/friendships/show_many/`

---

## 🧩 Autenticação

A automação reutiliza **cookies de sessão** exportados manualmente do navegador:

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

---

## 🧘 Anti-ban

Para evitar bloqueios:

- Copie o **User-Agent** do navegador real.
- Envie headers corretos (X-IG-App-ID, X-CSRFToken).
- Mantenha os cookies atualizados.
- Faça **delays aleatórios** (800ms–1.5s entre imagens, 2s–4s entre páginas).
- Não execute scraping 24/7 — execute sob demanda.

⚠️ Scraping de API privada não é permitido oficialmente → sua conta pode ser bloqueada.

**Dica:** teste com conta secundária.

---

## 🗃️ Armazenamento

A rota `/follow` dispara a coleta com:

- `id`: ID do usuário.
- `type`: `followers` ou `following`.

**Fluxo interno:**

1. Remove JSON antigo.
2. Faz requisições paginadas.
3. Salva blocos de usuários no `/app/data/json/ID_followers.json` ou `ID_following.json`.
4. Baixa fotos de perfil em `public/img`.

Delays controlam o ritmo para reduzir risco de bloqueio.

---

## 🔍 Análise

A rota `/compare` calcula:

- **notFollowingBack** → quem te segue mas você não segue.
- **notFollowedBack** → quem você segue mas não te segue.

---

## 🧩 Controladores e Serviços

### ✅ `InstagramController`

- **`follow`**: inicia scraping de seguidores/seguindo.
- **`checkFiles`**: verifica se os arquivos JSON existem.
- **`checkData`**: valida contagem de seguidores/seguindo com base nos JSON.

### ✅ `InstagramService`

- **`connectionsInstagram`**:
  1. Remove arquivos antigos.
  2. Roda scraping paginado.
  3. Salva JSON.
  4. Baixa avatares com delay.

- **`downloadImage`**: baixa avatar do usuário com stream.
- **`verifyFiles`**: confirma existência de arquivos.
- **`verify`**: compara contagem esperada vs encontrada.

### ✅ `RelationshipsController`

- **`compare`**: lê JSON, compara listas e gera JSON de comparação.

### ✅ `RelationshipService`

- **`compare`**: compara `followers` vs `following` e salva resultados:
  - `not_following_back.json`
  - `not_followed_back.json`

---

## 🗂️ Next Max ID

- É o cursor de paginação: `next_max_id` indica se há mais páginas.
- Nunca invente → use o valor retornado.
- Se perder, recomece do zero.

---

## 🛠️ Comandos Úteis

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

## ⚠️ **Atenção sobre Cookies e Segurança**

- Os `cookies` **não são criptografados** — apenas **assinados** pelo servidor.
- Não é viável “quebrar” o `sessionid`; é **mais seguro** reutilizar ou renovar manualmente.
- Para evitar **bloqueio da conta principal**, recomenda-se usar **conta de teste**.
- **Automação 24/7** é **desaconselhada** — execute scraping manual ou agendado com moderação.

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

Este projeto é um estudo pessoal de scraping e automação controlada, com foco **educacional**, para entender headers, cookies e estratégias anti-bloqueio.
