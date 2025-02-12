<h1 align="center">
    🎧 All In One Music
</h1>

<p align="center">
  <a href="#-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#setup">Setup</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
</p>

<p align="center">
 <img src="https://img.shields.io/static/v1?label=PRs&message=welcome&color=15C3D6&labelColor=000000" alt="PRs welcome!" />
  <img alt="License" src="https://img.shields.io/static/v1?label=license&message=MIT&color=15C3D6&labelColor=000000" />
</p>

<br>

<p align="center">
  <img alt="All In One Music" src=".github/media/Captura de tela de 2025-02-12 11-49-39.png" width="100%">
</p>

<a id="-tecnologias"></a>

## 🚀 Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- NodeJS
- NextJS
- GraphQL
- TailwindCss
- Next Auth

<a id="setup"></a>

## 💻 Projeto

Para configurar o projeto em NEXTJS tenha garantido que voce executou os passos do pacote ***packages/shared***.

Nao se esqueça de instalar as dependências, e e obrigatório voce ter o [pnpm](https://pnpm.io/pt/) como gerenciador de pacotes.

Para começar, crie um arquivo `.env` para realizar as configurações principais do NEXT. Você ira precisar acessar algumas plataformas como o [***TURSO***](https://turso.tech/) e o [***UPSTASH***](https://upstash.com/) para pegar as credenciais de banco e cache do redis.

Também ira precisar acessar o [AUDIODB](https://www.theaudiodb.com/) para pegar suas credenciais e ler a API.

Em relação ao GitHub, crie um app de desenvolvimento e configure as URLS de acordo com o localhost e callback.

```sh
HomePage -> http://localhost:3000
CallBack -> http://localhost:3000/api/auth/callback
```

```bash
TURSO_CONNECTION_URL=
TURSO_AUTH_TOKEN=

UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

AUTH_SECRET=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_INVIDIOUS_URLS=https://yewtu.be,https://invidious.nerdvpn.de,https://inv.nadeko.net/feed/popular

NEXTAUTH_URL=http://localhost:3000/api/auth

AUDIODB_API_KEY=
```

Depois, rode o comando `pnpm run db:migrate` e por fim `pnpm run db:push`

Por fim, inicie com `pnpm run dev`

---
