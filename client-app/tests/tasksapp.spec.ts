/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test";
import * as fs from "fs";
import { SESSION_SETORAGE_PATH } from "./constants";

test.beforeEach(async ({ page, context }, testInfo) => {
  // Set session storage in a new context
  const sessionStorage = JSON.parse(
    fs.readFileSync(SESSION_SETORAGE_PATH, "utf-8")
  );

  await context.addInitScript(
    (data) => {
      const { storage, baseURL } = data;
      if (window.location.hostname === new URL(baseURL || "").hostname) {
        for (const [key, value] of Object.entries(storage)) {
          if (typeof value === "string") {
            window.sessionStorage.setItem(key, value);
          }
        }
      }
    },
    { storage: sessionStorage, baseURL: testInfo.project.use.baseURL }
  );

  console.log(`Running ${test.info().title}`);
  await page.goto("/");
});

test("has title", async ({ page }) => {
  await expect(page).toHaveTitle(/Tasks/);
});

test("switch theme", async ({ page }) => {
  // change to dark theme
  await expect(page.locator("html")).not.toHaveClass("dark");
  await page.getByLabel("Theme switcher", { exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  // change to light theme
  await page.getByLabel("Theme switcher", { exact: true }).click();
  await expect(page.locator("html")).not.toHaveClass("dark");
});

test("displays the title and description, but not the status, in the todo form dialog when the 'Add Todo' button is clicked", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Add Todo" }).click();

  await expect(page.getByLabel("Task title")).toHaveCount(1);
  await expect(page.getByLabel("Task description")).toHaveCount(1);
  await expect(page.locator("#todo-status")).not.toBeVisible();
  await expect(page.locator("#todo-form-description")).toHaveText(
    "Get started by filling in the information below to create your todo."
  );
});

test("should add a new todo", async ({ page }) => {
  const no_of_records = await page.getByTestId("total-records").innerText();
  await expect(
    page.getByRole("heading", { name: "New Todo" })
  ).not.toBeVisible();

  await page.getByRole("button", { name: "Add Todo" }).click();

  await expect(page.getByRole("heading", { name: "New Todo" })).toBeVisible();

  await page.locator('input[name="title"]').fill("My task for today");
  await page
    .locator('textarea[name="description"]')
    .fill("This is some test description about my task");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByTestId("total-records")).toHaveText(
    (parseInt(no_of_records) + 1).toString()
  );
});

test("should have todo list", async ({ page }) => {
  const per_page = await page
    .getByTestId("total-records")
    .getAttribute("per-page");

  const rows = page.getByRole("listitem");
  const count = await rows.count();
  expect(count).toEqual(parseInt(per_page || ""));
});

test("should be open edit task form", async ({ page }) => {
  await expect(page.getByText("kong")).toBeVisible();
  const todoItem = await page.getByRole("listitem").nth(2);
  expect(todoItem.getByTestId("todo-status")).toHaveText("Done");

  await page.getByTestId("edit-btn").nth(2).click();
  await expect(page.getByRole("heading", { name: "Edit Todo" })).toBeVisible();
});

test("should be able to apply status filter", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "All", exact: true })
  ).toHaveClass(/border-blue-500/);
  await expect(
    page.getByRole("button", { name: "Todo", exact: true })
  ).not.toHaveClass(/border-blue-500/);
  await expect(
    page.getByRole("button", { name: "In Progress", exact: true })
  ).not.toHaveClass(/border-blue-500/);
  await expect(
    page.getByRole("button", { name: "Done", exact: true })
  ).not.toHaveClass(/border-blue-500/);

  // Change filter
  await page.getByRole("button", { name: "In Progress", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "In Progress", exact: true })
  ).toHaveClass(/border-blue-500/);
  await expect(
    page.getByRole("button", { name: "All", exact: true })
  ).not.toHaveClass(/border-blue-500/);

  await expect(page.getByTestId("task-fetch-spinner")).not.toBeVisible();

  const count = await page.getByRole("listitem").count();
  await expect(count).toEqual(2);
});

test("should be able to move to next page", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Prev" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Next" })).not.toBeDisabled();
  const current_page = await page.getByTestId("current-page").innerText();
  await expect(current_page).toBe("1");
  await page.getByRole("button", { name: "Next" }).click();
  const new_current_page = await page.getByTestId("current-page").innerText();
  await expect(new_current_page).toBe("2");
  await expect(page.getByRole("button", { name: "Next" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Prev" })).not.toBeDisabled();
});

test.describe("todo item", () => {
  test("task should have status", async ({ page }) => {
    await expect(page.getByText("My task for today")).toBeVisible();
    const todoItem = await page.getByRole("listitem").nth(0);
    await expect(todoItem.getByTestId("todo-status")).toHaveText("todo");
  });

  test("should change status to in progress", async ({ page }) => {
    await expect(page.getByText("My task for today")).toBeVisible();
    await page
      .getByRole("listitem")
      .nth(0)
      .getByLabel("mark-in-progress")
      .click();
    await expect(
      page.getByRole("listitem").nth(0).getByTestId("todo-status")
    ).toHaveText("in progress");
  });

  test("should change status to done", async ({ page }) => {
    await expect(page.getByText("My task for today")).toBeVisible();
    await page.getByRole("listitem").nth(0).getByLabel("mark-done").click();
    await expect(
      page.getByRole("listitem").nth(0).getByTestId("todo-status")
    ).toHaveText("Done");
  });
});

test("should be able to edit", async ({ page }) => {
  await expect(page.getByText("My task for today")).toBeVisible();
  await page.getByTestId("edit-btn").nth(0).click();
  await expect(page.getByRole("heading", { name: "Edit Todo" })).toBeVisible();
  await page.getByLabel("Task description").fill("King Kong Description");
  // first one is button
  await page
    .locator('input[type="radio"][value="in_progress"]')
    .setChecked(true);
  await expect(
    page.locator('input[type="radio"][value="in_progress"]')
  ).toBeChecked();
  await page.getByRole("button", { name: "Update" }).click();
  // // validate changes
  await expect(
    page.getByRole("heading", { name: "Edit Todo" })
  ).not.toBeVisible();
  const todoItem = await page.getByRole("listitem").nth(0);
  await expect(todoItem.getByTestId("todo-status")).toHaveText("in progress");
});

test("should be able to delete", async ({ page }) => {
  await expect(page.getByText("My task for today")).toBeVisible();

  const todoItem = await page.getByRole("listitem").nth(0);
  await expect(todoItem.locator("p")).toHaveText(/My task for today/);
  const nextItem = await page.getByRole("listitem").nth(1);
  await expect(nextItem.locator("p")).toHaveText(/village/);
  await page.getByTestId("delete-btn").nth(0).click();

  await page.getByRole("button", { name: "Delete" }).click();
  await expect(page.getByTestId("delete-dialog-title")).not.toBeVisible();
  await expect(page.getByText("My task for today")).not.toBeVisible({});
  const currentFirstItem = await page.getByRole("listitem").nth(0);
  await expect(currentFirstItem.locator("p")).toHaveText(/village/);
});
