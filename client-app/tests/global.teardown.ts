import { test as teardown } from "@playwright/test";
import * as fs from "fs";
import { SESSION_SETORAGE_PATH, STORAGE_PATH } from "./constants";

teardown("delete auth", async ({ context, page }, testInfo) => {
  const sessionStorage = JSON.stringify({});
  fs.writeFileSync(SESSION_SETORAGE_PATH, sessionStorage, "utf-8");
  fs.writeFileSync(STORAGE_PATH, sessionStorage, "utf-8");
});
