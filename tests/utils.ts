import { expect } from "@playwright/test";
import user from "./fixtures/user.json";
import product from "./fixtures/products.json";
import fs from "fs";
import path from "path";

export async function getProductId(request, path: string) {
  const res = await request.get(`${path}?page=1`);
  expect(res.status()).toBe(200);
  const responseBody = await res.json();
  return responseBody.data[product.position].id;
}

export async function createCart(request, path: string) {
  const res = await request.post(`${path}`);
  expect(res.status()).toBe(201);
  const responseBody = await res.json();
  return responseBody.id;
}

export function checkResponseTime(startTime: number, endTime: number) {
  const resTime = (endTime - startTime).toFixed(0);
  if (parseInt(resTime) >= 2000) {
    console.log(`Responded above acceptable time with ${resTime} ms`);
  } else {
    console.log(`Responded within acceptable time with ${resTime} ms`);
  }
}

export async function createToken(request: any, page: any, loginUrl: string) {
  let res: any;
  let responseBody: any;
  res = await request.post(`${loginUrl}/register`, { data: user });
  res = await request.post(`${loginUrl}/login`, {
    data: {
      email: user.email,
      password: user.password,
    },
  });
  responseBody = await res.json();

  //Opening the the actual webiste to authenticate the token for the requests
  await page.goto("https://api.practicesoftwaretesting.com/api/documentation");
  await page.getByRole("button", { name: "Authorize" }).click();
  await page.getByRole("textbox", { name: "auth-bearer-value" }).click();
  await page
    .getByRole("textbox", { name: "auth-bearer-value" })
    .fill(responseBody.access_token);
  await page.getByRole("button", { name: "Apply credentials" }).click();
  return responseBody.access_token;
}

export function getValidToken() {
  const tokenPath = path.resolve(__dirname, "./fixtures/token.json");
  if (!fs.existsSync(tokenPath)) return null;
  const { access_token, expires_at, email } = JSON.parse(
    fs.readFileSync(tokenPath, "utf-8")
  );
  if (!access_token || !expires_at || !email) return null;
  if (new Date() >= new Date(expires_at)) return null;
  if (email !== user.email) return null;
  return access_token;
}
