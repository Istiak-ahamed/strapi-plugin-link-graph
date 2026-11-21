"use strict";

function extractBlogSlugs(blocks) {
  const json = JSON.stringify(blocks || []);
  const slugs = [];
  const re = /\/blog\/([a-z0-9-]+)\//gi;
  let m;
  while ((m = re.exec(json)) !== null) {
    if (m[1]) slugs.push(m[1]);
  }
  return slugs;
}

module.exports = {
  register({ strapi }) {
    strapi.server.routes([
      {
        method: "GET",
        path: "/api/link-graph/analyze",
        handler: async (ctx) => {
          const posts = await strapi.db.query("api::post.post").findMany({
            select: ["id", "title", "slug", "body", "publishedAt"],
          });
          const inbound = new Map();
          for (const p of posts) {
            for (const target of new Set(extractBlogSlugs(p.body))) {
              if (target !== p.slug) {
                inbound.set(target, (inbound.get(target) || 0) + 1);
              }
            }
          }
          ctx.body = posts.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            inboundLinks: inbound.get(p.slug) || 0,
            isOrphan: (inbound.get(p.slug) || 0) < 3,
          }));
        },
        config: { auth: false },
      },
    ]);
  },
};
