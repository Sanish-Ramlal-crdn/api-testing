import { test, expect } from "@playwright/test";
import user from "../fixtures/user.json";
const path = "https://api.practicesoftwaretesting.com/users";

test("POST register request", async ({ request }) => {
  // API POST call for user registration
  const startTime = performance.now();
  let res;
  try {
    res = await request.post(`${path}/register`, { data: user });
    const endTime = performance.now();
    const resTime = (endTime - startTime).toFixed(0);

    // Status code should be either 201 (created) or 422 (unprocessable entity)
    expect([201, 422]).toContain(res.status());

    if (res.status() === 201) {
      console.log("User registered successfully! - Test passed");
    } else if (res.status() === 422) {
      console.log("User already registered - Test passed");
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

test("POST login request", async ({ request }) => {
  //API POST call for login
  const startTime = performance.now();
  let res;
  try {
    res = await request.post(`${path}/login`, { data: user });
    const endTime = performance.now();
    const resTime = (endTime - startTime).toFixed(0);

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);

    const responseBody = await res.json();
    console.log(responseBody);

    console.log("User logged in successfully! - Test passed");

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
