import { expect } from "@playwright/test";
import user from "./fixtures/user.json";
import product from "./fixtures/products.json";
import fs from "fs";
import path from "path";
import urls from "./fixtures/url.json";

export async function getProductId(request: any, path: string) {
  const res = await request.get(`${path}?page=1`);
  expect(res.status()).toBe(200);
  const responseBody = await res.json();
  return responseBody.data[product.position].id;
}

export async function createCart(request: any, path: string) {
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

export function saveToken(responseBody: any): void {
  //Getting expiry date of the token
  const expiresAt = new Date(
    Date.now() + responseBody.expires_in * 1000
  ).toISOString();
  const tokenPath = path.resolve(__dirname, "./fixtures/token.json");
  fs.writeFileSync(
    tokenPath,
    JSON.stringify(
      {
        access_token: responseBody.access_token,
        expires_in: responseBody.expires_in,
        expires_at: expiresAt,
        email: user.email,
      },
      null,
      2
    )
  );
  console.log("Access token and expiry saved to token.json");
}

export async function createToken(request: any, page: any, loginUrl: string) {
  let res: any;
  let responseBody: any;
  //Registering again in case the credentials are not stored
  res = await request.post(`${loginUrl}/register`, { data: user });
  res = await request.post(`${loginUrl}/login`, {
    data: {
      email: user.email,
      password: user.password,
    },
  });
  responseBody = await res.json();

  saveToken(responseBody);

  //Opening the the actual webiste to authenticate the token for the requests
  //Since manual insertion of the token is required to enable the  protected API calls
  await page.goto(urls.documentation_url);
  await page.getByRole("button", { name: "Authorize" }).click();
  await page.getByRole("textbox", { name: "auth-bearer-value" }).click();
  await page
    .getByRole("textbox", { name: "auth-bearer-value" })
    .fill(responseBody.access_token);
  await page.getByRole("button", { name: "Apply credentials" }).click();
  return responseBody.access_token;
}

export function getValidToken(): string | null {
  const tokenPath = path.resolve(__dirname, "./fixtures/token.json");
  //If the token file does not exist,  return null
  if (!fs.existsSync(tokenPath)) return null;
  const { access_token, expires_at, email } = JSON.parse(
    fs.readFileSync(tokenPath, "utf-8")
  );
  //Checking if any of the required fields are missing
  if (!access_token || !expires_at || !email) return null;
  // Checking  if the token is expired
  if (new Date() >= new Date(expires_at)) return null;
  // Checking  if the token corresponds to the current user
  if (email !== user.email) return null;
  return access_token;
}
