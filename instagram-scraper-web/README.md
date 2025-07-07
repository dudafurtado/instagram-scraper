# 📌 Instagram Scraper Web

Interface web para **coletar**, **verificar** e **comparar** seguidores e seguindo do Instagram, usando automação e scraping controlados.

## 🚦 Fluxo de Uso

1️⃣ **Autenticação no Instagram**  
2️⃣ **Raspagem de dados do perfil**  
3️⃣ **Coleta de seguidores/seguindo**  
4️⃣ **Comparação de quem não segue de volta**

---

## 📃 Páginas

### 1. **Home Page**

- 📍 **URL:** `/`
- 🗝️ **Função:** Contextualizar o projeto e descrever funções.
- ⏳ **Botão:** Envia o usuário para a autenticação.

![Home 1](./src/assets/home-page.png)

### 2. **Auth Page**

- 📍 **URL:** `/auth`
- 🗝️ **Função:** Digite o usuário e senha para fazer login com a automação.
- 🗂️ **Depois:** Digite o **Username** do Instagram interessado em analisar. É permitido escrever um nome por linha.
- ⏳ **Botão:** Inicia a coleta de informações básicas. Mostra progresso simulado. Uma aba do navegador é aberta mostrando o processo da automação.

![Auth 1](./src/assets/auth-page-1.png)
![Auth 2](./src/assets/auth-page-2.png)

### 3. **Collect Page**

- 📍 **URL:** `/collect`
- 🗝️ **Função:** Digite e salve manualmente os **cookies de sessão** (`sessionid`, `csrftoken`, `ds_user_id`, `ig_app_id`).
- 🗂️ **Depois:** Digite o **User ID** do Instagram e marque **Followers**, **Following**, ou ambos.
- ⏳ **Botão:** Inicia a coleta. Mostra progresso simulado.

![Collect 1](./src/assets/collect-page-1.png)
![Collect 2](./src/assets/collect-page-2.png)
![Collect 3](./src/assets/collect-page-3.png)

---

### ✅ 4. **Verify Page**

- 📍 **URL:** `/verify`
- 🧹 **Função:** Verifica se os arquivos **JSON locais** foram criados corretamente.
- 🔢 **Extras:** Confirme o número de seguidores/seguindo esperados.
- ✅ **Resultado:** Mostra quantos registros foram coletados e possíveis diferenças.

![Verify 1](./src/assets/verify-page-1.png)
![Verify 2](./src/assets/verify-page-2.png)

---

### ✅ 5. **Compare Page**

- 📍 **URL:** `/compare`
- 🔍 **Função:** Compara os arquivos salvos para exibir:
  - Quem **você segue mas não te segue**
  - Quem **te segue mas você não segue**
- 🗃️ **Filtro:** Mostra lista com opção de expandir/minimizar.

![Compare 1](./src/assets/compare-page-1.png)
![Compare 2](./src/assets/compare-page-2.png)

---

## ⚙️ Como rodar o projeto

```bash
# Instalar dependências
npm install

# Rodar em dev
npm run dev
```

---

## ⚠️ Requisitos

- O **servidor backend** (`instagram-scraper-server`) deve estar rodando:
  ```bash
  node ace server --watch
  ```
- As requisições dependem da porta e rotas do backend.

---

## 🧩 Organização

- `CollectionPage` → Autentica e coleta.
- `VerifyPage` → Verifica e mostra diferenças.
- `ComparePage` → Lista quem segue/quem não segue.

---

## 📚 Leia mais

👉 Para detalhes do backend: [README do Server](../instagram-scraper-server/README.md)

---

🫶 **Feito para estudos e experimentos controlados. Use com moderação!**
