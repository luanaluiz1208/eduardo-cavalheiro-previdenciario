# Site institucional — Eduardo Ferreira Cavalheiro

Projeto estático em React e Vite, preparado para publicação na Vercel. Todos os ativos institucionais usados pelo site estão em `client/public/assets`, permitindo que o repositório funcione sem serviços da plataforma de origem.

## Desenvolvimento local

```bash
pnpm install
pnpm dev
```

Para validar a versão de produção, execute `pnpm check` e `pnpm build`.

## Publicação na Vercel

1. Importe o repositório na Vercel.
2. Mantenha os comandos detectados: `pnpm run build` e diretório de saída `dist`.
3. Após a publicação, em **Settings → Domains**, associe `adveduardocavalheiro.com.br` e configure os registros DNS solicitados pela Vercel.

As rotas públicas são atendidas por `vercel.json`, inclusive as páginas de áreas e artigos acessadas diretamente por URL.
