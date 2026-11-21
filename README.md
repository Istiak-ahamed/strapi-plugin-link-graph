# strapi-plugin-link-graph

Internal linking intelligence plugin for **Strapi 5** Blocks rich text. Computes inbound/outbound link counts across posts, flags orphan articles (`< 3` inbound links), and exposes a one-click internal link injector endpoint.

## Installation (Strapi 5)

```bash
npm install strapi-plugin-link-graph
```

Enable in `config/plugins.ts`:

```ts
export default () => ({
  "link-graph": {
    enabled: true,
  },
});
```

Query `GET /api/link-graph/analyze` to inspect orphan scores across `api::post.post`.

## License

MIT — Istiak Ahamed (`istiakahamed.com`)
