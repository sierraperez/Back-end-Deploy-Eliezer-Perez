# 🚀 Guia de Deploy Hostinger: Eliezer Pérez

Este guia explica como colocar o teu Backend e Frontend a funcionar no Hostinger, usando a estrutura consolidada que criámos.

---

## 1. Subdomínio da API (`api.eliezerperez.com`)

Este subdomínio vai correr o teu servidor Node.js.

### Arquivos a enviar:
- `server.js`
- `package.json`
- `.env` (Garante que a senha do email está correta aqui!)

### No Painel do Hostinger:
1.  Cria o subdomínio `api.eliezerperez.com`.
2.  Vai a **Node.js Selector** ou **Node.js Dashboard**.
3.  Define o **App Entry Point** como `server.js`.
4.  Clica em **"NPM Install"** no painel para instalar as bibliotecas.
5.  **Variáveis de Ambiente**: Podes carregar o `.env` ou configurar as variáveis (`OPENAI_API_KEY`, `SMTP_PASS`, etc.) diretamente no painel do Hostinger.

---

## 2. Domínio Principal (`eliezerperez.com`)

Aqui é onde os teus clientes entram. Não precisa de Node.js, apenas arquivos estáticos.

### Arquivos a enviar:
1.  No teu computador, corre `npm run build` na pasta `frontend`.
2.  Faz o upload do **CONTEÚDO** da pasta `frontend/dist/` para a pasta `public_html` do domínio `eliezerperez.com`.
3.  **Atenção**: Deves ver ficheiros como `index.html` e a pasta `assets` na raiz do `public_html`.

---

## 3. Segurança e CORS

O site principal vai falar com o subdomínio da API. No teu ficheiro `.env` da API, garante que tens:

```env
ALLOWED_ORIGINS=https://eliezerperez.com,https://www.eliezerperez.com
```

---

## 4. Manutenção Futura

Se quiseres mudar algo no site (texto, cores, chat):
1.  Faz a mudança no código fonte localmente.
2.  Corre `npm run build` na pasta `frontend`.
3.  Faz upload apenas dos novos ficheiros da pasta `dist/` para o Hostinger.

**Tudo pronto! O teu ecossistema IA está agora profissional e seguro.** 🦾
