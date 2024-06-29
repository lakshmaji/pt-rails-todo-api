import { test as setup, expect } from "@playwright/test";
import * as fs from "fs";
import { SESSION_SETORAGE_PATH, STORAGE_PATH } from "./constants";

const account = {
  email: "user@example.com",
  password: "password",
  grant_type: "password",
  client_id: "webapp_id",
  client_secret: "web_app_secret",
};
setup(
  "authenticate user",
  async ({ page, context, contextOptions, playwright, baseURL }) => {
    const initialValues = JSON.stringify({});
    fs.writeFileSync(SESSION_SETORAGE_PATH, initialValues, "utf-8");
    fs.writeFileSync(STORAGE_PATH, initialValues, "utf-8");

    console.log(`\x1b[2m\tSign in started'\x1b[0m`);

    // when we're not authenticated, the app redirects to the login page
    await page.goto(baseURL as string);
    // try {
    //   await expect(
    //     page.getByRole("button", { name: "Logout" })
    //   ).not.toBeVisible();
    // } catch {
    //   return;
    // }
    console.log(`Sign in as '${account.email}`);

    await page.getByLabel("Email address", { exact: true }).fill(account.email);
    await page.getByLabel("Password", { exact: true }).fill(account.password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();

    console.log(`Sign in processed`);

    await expect(page).toHaveURL("/");
    await expect(page.getByText(/Add Todo/)).toBeVisible();
    await page.context().storageState({ path: STORAGE_PATH });

    // Get session storage and store as env variable
    const sessionStorage = await page.evaluate(() =>
      JSON.stringify(sessionStorage)
    );
    fs.writeFileSync(SESSION_SETORAGE_PATH, sessionStorage, "utf-8");
    console.log(await page.context().storageState());
  }
);
