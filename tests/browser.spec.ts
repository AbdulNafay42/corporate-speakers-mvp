import { test, expect } from "@playwright/test";
const base = process.env.SITE_URL || "http://localhost:3000";
test("Desktop navigation, published profiles, and contact submission", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Ideas that move",
  );
  await page.getByRole("link", { name: "Discover our speakers" }).click();
  await expect(page).toHaveURL(/speakers$/);
  await page.locator(".speaker-card").first().click();
  await expect(page.locator(".detail-copy h1")).toBeVisible();
  await page.locator(".detail-copy .button").click();
  await expect(page.locator("textarea")).not.toBeEmpty();
  await page.getByLabel("Full name").fill("Browser Test Visitor");
  await page.getByLabel("Work email").fill("browser-test@example.com");
  await page
    .getByLabel("Company", { exact: true })
    .fill("Browser Test Company");
  await page
    .getByLabel("What do you have in mind?")
    .fill("We would like a leadership workshop for our team of twenty people.");
  await page.getByRole("button", { name: "Start the conversation" }).click();
  await expect(
    page.getByRole("heading", { name: "Conversation started." }),
  ).toBeVisible();
  await page.goto(base + "/programs");
  await page.locator(".program-card").first().click();
  await expect(page.locator(".program-detail-heading h1")).toBeVisible();
  await page.screenshot({
    path: "artifacts/program-desktop.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("Mobile menu and responsive layout", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Speakers", exact: true })
    .click();
  await expect(page).toHaveURL(/speakers$/);
  await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  for (const path of ["/", "/speakers", "/programs", "/contact"]) {
    await page.goto(base + path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto(base);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Ideas that move",
  );
  await page
    .locator(".hero-visual img")
    .evaluate((img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Ideas that move",
  );
  await page
    .locator(".hero-visual img")
    .evaluate((img: HTMLImageElement) => img.decode());
  await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
});
