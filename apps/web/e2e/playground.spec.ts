import { expect, test } from "@playwright/test";

test("inspect an element and generate an AI prompt", async ({ page }) => {
  await page.goto("/playground");

  // The overlay toolbar lives inside a Shadow DOM root; Playwright pierces it.
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByRole("button", { name: "Exit Inspect" })).toBeVisible();

  // Select a demo element. The overlay intercepts the click and opens the popover.
  await page.locator(".primary-cta").click();

  const feedback = page.locator(".elementation-textarea");
  await expect(feedback).toBeVisible();
  await feedback.fill("This button is too large. Make it smaller and use the primary brand color.");

  await page.getByRole("button", { name: "Generate Prompt" }).click();

  // The prompt panel shows the structured prompt with the expected sections.
  const prompt = page.locator(".elementation-pre");
  await expect(prompt).toBeVisible();
  await expect(prompt).toContainText("## User Feedback");
  await expect(prompt).toContainText("Make it smaller and use the primary brand color.");
  await expect(prompt).toContainText("## Selected Element");
  await expect(prompt).toContainText("## Source Location");
  await expect(prompt).toContainText("DemoHero");
  await expect(page.getByRole("button", { name: "Copy Prompt" })).toBeVisible();
});

test("escape exits inspect mode", async ({ page }) => {
  await page.goto("/playground");
  await page.getByRole("button", { name: "Inspect", exact: true }).click();
  await expect(page.getByRole("button", { name: "Exit Inspect" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Inspect", exact: true })).toBeVisible();
});
