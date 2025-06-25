import { expect } from "@playwright/test";
import user from "./fixtures/user.json";
import product from "./fixtures/products.json";

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
  let res;
  let responseBody;
  res = await request.post(`${loginUrl}/register`, { data: user });
  responseBody = await res.json();
  console.log(responseBody);
  res = await request.post(`${loginUrl}/login`, {
    data: {
      email: user.email,
      password: user.password,
    },
  });
  responseBody = await res.json();
  console.log(responseBody);

  //Logging in the webiste to authenticate the token for the requests
  await page.goto("https://api.practicesoftwaretesting.com/api/documentation");
  await page.getByRole("button", { name: "Authorize" }).click();
  await page.getByRole("textbox", { name: "auth-bearer-value" }).click();
  await page
    .getByRole("textbox", { name: "auth-bearer-value" })
    .fill(responseBody.access_token);
  await page.getByRole("button", { name: "Apply credentials" }).click();
  return responseBody.access_token;
}
