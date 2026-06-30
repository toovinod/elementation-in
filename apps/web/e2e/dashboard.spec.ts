import { expect, test } from "@playwright/test";

test("create a project from the dashboard", async ({ page }) => {
  await page.goto("/dashboard");

  await page.getByRole("button", { name: "Create Project" }).click();

  const name = `E2E Project ${Date.now()}`;
  await page.getByLabel("Project name").fill(name);
  await page.getByRole("button", { name: "Create", exact: true }).click();

  await expect(page.getByText(name)).toBeVisible();
});
