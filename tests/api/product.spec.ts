import { test, expect } from "@playwright/test";
const path = "https://api.practicesoftwaretesting.com/products";

async function getFirstProductId(request) {
  const res = await request.get(`${path}?page=1`);
  expect(res.status()).toBe(200);
  const responseBody = await res.json();
  return responseBody.data[0].id;
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

    console.log("Products fetched successfully! - Test passed");

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
  // Getting the first product ID as it is not fixed
  // and can change with each test run
  const firstProductId = await getFirstProductId(request);

  const startTime = performance.now();
  let res;
  try {
    res = await request.get(`${path}/${firstProductId}`);
    const endTime = performance.now();
    const resTime = endTime - startTime;
    const responseBody = await res.json();

    expect(res.status()).toBe(200);
    console.log(`${responseBody.name} found successfully - Test Passed`);

    expect(resTime).toBeLessThan(2000);
    console.log(`Responded in ${resTime.toFixed(0)} ms`);
  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});
