"use strict";
const samples = require("../../../data/samples.json");
const path = require("node:path");
const fs = require("node:fs");
module.exports = {
  register() {},
  async bootstrap({ strapi }) {
    if (process.env.SEED_SAMPLE_DATA !== "true") return;
    if (
      await strapi.documents("api::speaker.speaker").count({ status: "draft" })
    )
      return;
    const speakers = [];
    for (const item of samples.speakers) {
      const { documentId, image, ...data } = item;
      const filepath = path.resolve(
        __dirname,
        "../../web/public/images",
        data.slug + ".jpg",
      );
      if (fs.existsSync(filepath)) {
        const [uploaded] = await strapi
          .plugin("upload")
          .service("upload")
          .upload({
            data: {
              fileInfo: {
                name: data.name + " - illustrative sample",
                alternativeText:
                  "Illustrative stock portrait for fictional speaker " +
                  data.name,
              },
            },
            files: {
              filepath,
              originalFilename: data.slug + ".jpg",
              mimetype: "image/jpeg",
              size: fs.statSync(filepath).size,
            },
          });
        data.image = uploaded.id;
      }
      speakers.push(
        await strapi
          .documents("api::speaker.speaker")
          .create({ data, status: "published" }),
      );
    }
    for (const item of samples.programs) {
      const { documentId, image, speakers: related, ...data } = item;
      await strapi
        .documents("api::program.program")
        .create({
          data: { ...data, speakers: speakers.map((s) => s.documentId) },
          status: "published",
        });
    }
    strapi.log.info(
      "Published fictional sample speakers and programs. Add images through Media Library.",
    );
  },
};
