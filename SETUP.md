# 🌿 Pedacinho do Céu — Guia de Setup Completo

## O que você tem agora

```
pedacinho-do-ceu/
├── index.html              ← Shell principal (PWA)
├── style.css               ← Design system completo
├── app.js                  ← Roteador + autenticação
├── firebase.js             ← ⚠️ Config do Firebase (você preenche)
├── firestore-schema.js     ← Documentação da estrutura de dados
├── manifest.json           ← PWA: "Add to Home Screen"
├── sw.js                   ← Service Worker (cache offline)
└── pages/
    ├── inicio.js           ← Dashboard com resumos em tempo real
    ├── tarefas.js          ← CRUD completo + Firebase sync
    ├── mercado.js          ← Lista de compras em tempo real
    └── mais.js             ← Hub dos módulos secundários
```

---

## Passo 1 — Criar o projeto no Firebase

1. Acesse https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Nome: `pedacinho-do-ceu`
4. Desative o Google Analytics (desnecessário)
5. Clique em **"Criar projeto"**

---

## Passo 2 — Ativar os serviços

### Firestore (banco de dados)
1. No menu lateral: **Build → Firestore Database**
2. Clique em **"Create database"**
3. Escolha **"Start in test mode"** (ajustaremos as regras depois)
4. Selecione a região: `southamerica-east1` (São Paulo)

### Authentication (login)
1. **Build → Authentication → Get started**
2. Aba **"Sign-in method"**
3. Clique em **"Email/Password"** → Ative → Salve

### Criar contas dos membros
1. **Authentication → Users → Add user**
2. Crie 4 usuários (um para cada membro):
   - você@email.com / senha123
   - arthur@email.com / senha123
   - mae@email.com / senha123
   - pai@email.com / senha123
3. Anote o **UID** de cada usuário (coluna "User UID")

---

## Passo 3 — Pegar as credenciais

1. **Configurações do projeto** (ícone ⚙️) → aba **"Geral"**
2. Scroll até **"Seus apps"**
3. Clique no ícone **`</>`** (Web app)
4. Nome: `pedacinho-web` → **Registrar app**
5. Copie o objeto `firebaseConfig`

---

## Passo 4 — Preencher firebase.js

Abra `firebase.js` e substitua o `firebaseConfig` com seus valores:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "pedacinho-do-ceu.firebaseapp.com",
  projectId: "pedacinho-do-ceu",
  storageBucket: "pedacinho-do-ceu.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

---

## Passo 5 — Registrar os membros no app.js

Abra `app.js` e preencha o objeto `MEMBROS` com os UIDs do Firebase Auth:

```js
export const MEMBROS = {
  "uid-copiado-do-firebase-1": { nome: "Você",   emoji: "🌿", cor: "#F59E0B" },
  "uid-copiado-do-firebase-2": { nome: "Arthur", emoji: "🎮", cor: "#8B5CF6" },
  "uid-copiado-do-firebase-3": { nome: "Mãe",   emoji: "🌸", cor: "#EF4444" },
  "uid-copiado-do-firebase-4": { nome: "Pai",   emoji: "🔧", cor: "#3B82F6" },
};
```

---

## Passo 6 — Hospedar o app

### Opção A: Firebase Hosting (recomendado, gratuito)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Public directory: . (pasta raiz)
# Single-page app: No
firebase deploy
```
→ Você receberá uma URL tipo: `https://pedacinho-do-ceu.web.app`

### Opção B: Netlify (arrasta e solta)
1. Acesse https://netlify.com
2. Arraste a pasta `pedacinho-do-ceu` para o painel
3. URL instantânea!

### Opção C: Testar localmente
```bash
# Na pasta do projeto:
npx serve .
# ou
python3 -m http.server 3000
```
→ Abra: `http://localhost:3000`

---

## Passo 7 — Adicionar à tela inicial (iPhone/Android)

**iPhone (Safari):**
1. Abra o app no Safari
2. Toque no ícone de compartilhamento 📤
3. Role e toque em **"Adicionar à Tela de Início"**

**Android (Chrome):**
1. Abra o app no Chrome
2. Menu ⋮ → **"Adicionar à tela inicial"**

---

## Regras de segurança do Firestore (Produção)

Quando estiver pronto para deixar seguro, coloque estas regras:
**Firestore → Rules:**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Próximas etapas de desenvolvimento

- [ ] Módulo Refeições (cardápio semanal)
- [ ] Módulo Casa / Melhorias
- [ ] Módulo Manutenção (lembretes Fiesta e Corsa)
- [ ] Módulo Inventário
- [ ] Módulo Horta
- [ ] Módulo Contatos úteis
- [ ] Push Notifications (FCM)
- [ ] Ícones PWA (icons/icon-192.png e icon-512.png)
- [ ] Página de perfil dos membros
