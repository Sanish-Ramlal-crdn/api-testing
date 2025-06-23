import { test, expect } from "@playwright/test";
import product from "../fixtures/products.json";
const path = "https://api.practicesoftwaretesting.com/products";

async function getProductId(request) {
  const res = await request.get(`${path}?page=1`);
  expect(res.status()).toBe(200);
  const responseBody = await res.json();
  return responseBody.data[product.position].id;
}

test("GET products request", async ({ request }) => {
  // API GET call to fetch products
  const startTime = performance.now();
  let res;
  try {
    res = await request.get(`${path}?page=1`);
    const endTime = performance.now();
    const resTime = (endTime - startTime).toFixed(0);

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);
    const responseBody = await res.json();
    console.log(
      responseBody.total,
      "Products fetched successfully! - Test passed"
    );

    // Test should take less than 2 seconds for optimal performance
    if (parseInt(resTime) >= 2000) {
      console.log(`Responded above acceptable time with ${resTime} ms`);
    } else {
      console.log(`Responded within acceptable time with ${resTime} ms`);
    }
  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});

test("GET products by id request", async ({ request }) => {
  // Getting the product ID as it is not fixed and can change with each test run
  const productId = await getProductId(request);

  const startTime = performance.now();
  let res;
  try {
    res = await request.get(`${path}/${productId}`);
    const endTime = performance.now();
    const resTime = (endTime - startTime).toFixed(0);
    const responseBody = await res.json();

    expect(res.status()).toBe(200);
    console.log(`${responseBody.name} found successfully - Test Passed`);

    if (parseInt(resTime) >= 2000) {
      console.log(`Responded above acceptable time with ${resTime} ms`);
    } else {
      console.log(`Responded within acceptable time with ${resTime} ms`);
    }
  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});

test("GET search products request", async ({ request }) => {
  // API GET call to fetch products
  const startTime = performance.now();
  let res;
  try {
    res = await request.get(`${path}/search?q=${product.name}`);
    const endTime = performance.now();
    const resTime = (endTime - startTime).toFixed(0);

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);

    const responseBody = await res.json();
    if (responseBody.total === 0) {
      console.log("No products matched the search - Test passed");
    } else {
      console.log(
        responseBody.total,
        "Products matched the search! - Test passed"
      );
    }

    // Test should take less than 2 seconds for optimal performance
    if (parseInt(resTime) >= 2000) {
      console.log(`Responded above acceptable time with ${resTime} ms`);
    } else {
      console.log(`Responded within acceptable time with ${resTime} ms`);
    }
  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});
