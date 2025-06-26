import { test, expect } from "@playwright/test";
import user from "../fixtures/user.json";
import { checkResponseTime } from "../utils.ts";
import urls from "../fixtures/url.json";
import fs from "fs";
import path from "path";

test("POST register request", async ({ request }) => {
  // API POST call for user registration
  const startTime = performance.now();
  let res;
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

    // Test should take less than 2 seconds for optimal performance
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
  const startTime = performance.now();
  let res;
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

    if (responseBody.access_token && responseBody.expires_in) {
      const expiresAt = new Date(
        Date.now() + responseBody.expires_in * 1000
      ).toISOString();
      const tokenPath = path.resolve(__dirname, "../fixtures/token.json");
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

    // Test should take less than 2 seconds for optimal performance
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
  const startTime = performance.now();
  user.password = "wrongpassword"; // Intentionally using wrong password
  let res;
  try {
    res = await request.post(`${urls.auth_url}/login`, { data: user });
    const endTime = performance.now();

    // Status code should be 401 (Unauthorized)
    expect(res.status()).toBe(401);

    const responseBody = await res.json();
    console.log("User log in invalid! - Test passed");

    // Test should take less than 2 seconds for optimal performance
    checkResponseTime(startTime, endTime);
  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});
