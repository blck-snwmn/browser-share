# browser-share

A minimal Cloudflare Worker PWA for trying the Web Share Target API on Android.

The app can be installed as a PWA, appear in Android's share sheet, receive shared
`title`, `text`, `url`, and `files`, and show the received payload on the page.
It does not save shared data.

## Development

```sh
pnpm install
pnpm run dev
```

Open <http://localhost:8787>.

## Scripts

```sh
pnpm run lint
pnpm run fmt:check
pnpm run typecheck
pnpm run test
pnpm run build
```

`pnpm run build` runs `wrangler deploy --dry-run`.

## Deploy

```sh
pnpm run deploy
```

After deploying, open the HTTPS URL in Android Chrome, install the PWA, then
share a page from another browser tab to `Browser Share Lab`.
