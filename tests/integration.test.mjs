import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const cms = process.env.STRAPI_URL || "http://localhost:1337";
const web = process.env.SITE_URL || "http://localhost:3000";
const token = process.env.TEST_STRAPI_TOKEN;
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};
const api = (path, options = {}) =>
  fetch(cms + path, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
const post = (data) => ({ method: "POST", body: JSON.stringify({ data }) });
test(
  "Published Strapi content, media, relations, inquiry persistence, and token isolation",
  { skip: !token },
  async () => {
    const slug = `integration-${Date.now()}`;
    let speaker, program, inquiry, upload;
    try {
      const form = new FormData();
      form.append(
        "files",
        new Blob([fs.readFileSync("apps/web/public/images/conference.jpg")], {
          type: "image/jpeg",
        }),
        "integration.jpg",
      );
      const uploaded = await fetch(cms + "/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      assert.equal(uploaded.status, 201);
      [upload] = await uploaded.json();
      const created = await api(
        "/api/speakers?status=draft",
        post({
          name: "Integration Speaker",
          slug,
          designation: "Test facilitator",
          bio: "An integration test profile created in the real Strapi CMS.",
          expertise: "Leadership, Communication",
          featured: true,
          image: upload.id,
        }),
      );
      assert.equal(created.status, 201);
      speaker = (await created.json()).data;
      let response = await fetch(web + "/speakers/" + slug);
      const draftHtml = await response.text();
      assert.match(draftHtml, /NEXT_HTTP_ERROR_FALLBACK;404/);
      assert.match(draftHtml, /noindex/);
      assert.doesNotMatch(
        draftHtml,
        /Integration Speaker/,
        "Draft content must not be visible",
      );
      response = await api(
        "/api/speakers/" + speaker.documentId + "?status=published",
        { method: "PUT", body: JSON.stringify({ data: {} }) },
      );
      assert.equal(response.status, 200);
      for (const path of ["/", "/speakers", "/speakers/" + slug]) {
        response = await fetch(web + path);
        assert.equal(response.status, 200, path);
        assert.match(await response.text(), /Integration Speaker/);
      }
      response = await api(
        "/api/programs?status=published",
        post({
          title: "Integration Workshop",
          slug,
          description:
            "A real linked program used to verify the complete content delivery flow.",
          duration: "Half day",
          featured: true,
          image: upload.id,
          speakers: [speaker.documentId],
        }),
      );
      assert.equal(response.status, 201);
      program = (await response.json()).data;
      response = await fetch(web + "/programs/" + slug);
      assert.equal(response.status, 200);
      const html = await response.text();
      assert.match(html, /Integration Workshop/);
      assert.match(html, /Integration Speaker/);
      assert.match(html, /uploads/);
      const payload = {
        name: "Integration Visitor",
        email: `${slug}@example.com`,
        company: "Sample Company",
        message: "Please tell us more about your corporate speaker programs.",
        website: "",
      };
      const submit = (body, origin = web) =>
        fetch(web + "/api/inquiries", {
          method: "POST",
          headers: { "Content-Type": "application/json", Origin: origin },
          body: JSON.stringify(body),
        });
      assert.equal(
        (await submit(payload, "https://untrusted.example")).status,
        403,
      );
      assert.equal(
        (await submit({ ...payload, email: "invalid" })).status,
        400,
      );
      assert.equal((await submit({ ...payload, website: "spam" })).status, 400);
      assert.equal(
        (await submit({ ...payload, message: "x".repeat(25000) })).status,
        413,
      );
      response = await submit(payload);
      assert.equal(response.status, 201);
      response = await api(
        "/api/inquiries?filters[email][$eq]=" +
          encodeURIComponent(payload.email),
      );
      inquiry = (await response.json()).data[0];
      assert.equal(inquiry.company, payload.company);
      assert.ok(inquiry.submissionDate);
      response = await fetch(cms + "/api/inquiries");
      assert.equal(response.status, 403, "Anonymous inquiries must be private");
      response = await fetch(cms + "/api/inquiries", {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_INQUIRY_TOKEN}`,
        },
      });
      assert.equal(response.status, 403, "Intake token cannot read inquiries");
      response = await fetch(cms + "/api/inquiries", {
        headers: { Authorization: `Bearer ${process.env.STRAPI_READ_TOKEN}` },
      });
      assert.equal(response.status, 403, "Content token cannot read inquiries");
      response = await fetch(cms + "/api/speakers", {
        ...post({ name: "Unauthorized" }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STRAPI_READ_TOKEN}`,
        },
      });
      assert.equal(response.status, 403, "Content token cannot write speakers");
    } finally {
      if (program)
        await api("/api/programs/" + program.documentId, { method: "DELETE" });
      if (speaker)
        await api("/api/speakers/" + speaker.documentId, { method: "DELETE" });
      if (inquiry)
        await api("/api/inquiries/" + inquiry.documentId, { method: "DELETE" });
      if (upload)
        await api("/api/upload/files/" + upload.id, { method: "DELETE" });
    }
  },
);
