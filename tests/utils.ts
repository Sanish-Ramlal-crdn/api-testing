import { expect } from "@playwright/test";
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
