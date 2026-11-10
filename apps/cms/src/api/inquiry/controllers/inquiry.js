const { factories } = require("@strapi/strapi");
// A small per-CMS-instance intake limit. Use a shared edge limit for multiple replicas.
let windowStart = Date.now();
let count = 0;
module.exports = factories.createCoreController("api::inquiry.inquiry", () => ({
  async create(ctx) {
    const now = Date.now();
    if (now - windowStart >= 60000) {
      windowStart = now;
      count = 0;
    }
    if (++count > 30) {
      ctx.set("Retry-After", "60");
      return ctx.tooManyRequests("Please try again in a minute.");
    }
    if (!ctx.request.body?.data || typeof ctx.request.body.data !== "object")
      return ctx.badRequest("Missing inquiry.");
    const { name, email, company, message } = ctx.request.body.data;
    ctx.request.body = {
      data: {
        name,
        email,
        company,
        message,
        submissionDate: new Date(now).toISOString(),
      },
    };
    return super.create(ctx);
  },
}));
