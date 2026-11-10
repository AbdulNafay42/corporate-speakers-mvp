module.exports = [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      origin: ["http://localhost:1337"],
      headers: ["Content-Type", "Authorization", "Origin", "Accept"],
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  { name: "strapi::body", config: { jsonLimit: "64kb" } },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
