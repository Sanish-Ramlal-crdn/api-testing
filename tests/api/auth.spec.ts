import { test, expect } from "@playwright/test";
import user from "../fixtures/user.json";
import { checkResponseTime, saveToken } from "../utils.ts";
import urls from "../fixtures/url.json";

test("POST register request", async ({ request }) => {
  // API POST call for user registration
  let res;
  const startTime = performance.now();
  try {
    res = await request.post(`${urls.auth_url}/register`, { data: user });
    const endTime = performance.now();

    // Status code should be either 201 (created) or 422 (unprocessable entity in case of usr already existing)
    expect([201, 422]).toContain(res.status());

    if (res.status() === 201) {
      console.log("User registered successfully! - Test passed");
    } else if (res.status() === 422) {
      console.log("User already registered - Test passed");
    }

    // Response should take less than 2 seconds for optimal performance
    checkResponseTime(startTime, endTime);
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
  let res;
  const startTime = performance.now();
  try {
    res = await request.post(`${urls.auth_url}/login`, {
      data: {
        email: user.email,
        password: user.password,
      },
    });
    const endTime = performance.now();

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);

    const responseBody = await res.json();
    console.log("User logged in successfully! - Test passed");

    //Saving the access token for future requests
    if (responseBody.access_token && responseBody.expires_in) {
      saveToken(responseBody);
    }

    // Response should take less than 2 seconds for optimal performance
    checkResponseTime(startTime, endTime);
  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});

test("POST invalid login request", async ({ request }) => {
  //API POST call for  invalid login
  user.password = "wrongpassword"; // Intentionally using wrong password
  let res;
  const startTime = performance.now();
  try {
    res = await request.post(`${urls.auth_url}/login`, {
      data: {
        email: user.email,
        password: user.password,
      },
    });
    const endTime = performance.now();

    // Status code should be 401 (Unauthorized)
    expect(res.status()).toBe(401);

    console.log("User log in invalid! - Test passed");

    // Response should take less than 2 seconds for optimal performance
    checkResponseTime(startTime, endTime);
  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});
