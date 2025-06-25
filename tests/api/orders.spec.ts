import { test, expect } from "@playwright/test";
import user from "../fixtures/user.json";
import invoice from "../fixtures/invoice.json";
import { getProductId, createCart, checkResponseTime } from "../utils.ts";

const url = "https://api.practicesoftwaretesting.com/invoices";
const loginUrl = "https://api.practicesoftwaretesting.com/users";
const cartPath = "https://api.practicesoftwaretesting.com/carts";
const productPath = "https://api.practicesoftwaretesting.com/products";

test("POST order invoice request", async ({ request, page }) => {
  const cartId = await createCart(request, cartPath);
  const productId = await getProductId(request, productPath);

  let res;
  page.pause();
  try {
    res = await request.post(`${loginUrl}/login`, { data: user });
    const responseBody = await res.json();

    await page.goto(
      "https://api.practicesoftwaretesting.com/api/documentation"
    );
    await page.getByRole("button", { name: "Authorize" }).click();
    await page.getByRole("textbox", { name: "auth-bearer-value" }).click();
    await page
      .getByRole("textbox", { name: "auth-bearer-value" })
      .fill(responseBody.access_token);
    await page.getByRole("button", { name: "Apply credentials" }).click();
    //Putting at least 1 item in the cart before creating an invoice
    res = await request.post(`${cartPath}/${cartId}`, {
      data: {
        product_id: productId,
        quantity: 1,
      },
    });

    invoice.cart_id = cartId;
    const startTime = performance.now();
    res = await request.post(`${url}`, {
      data: invoice,
      headers: {
        Authorization: `Bearer ${responseBody.access_token}`,
        accept: "application/json",
      },
    });
    const endTime = performance.now();

    // Status code should be 200 (OK)
    expect(res.status()).toBe(201);
    console.log("Order passed successfully! - Test passed");

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

test("GET orders request", async ({ request, page }) => {
  // API GET call to fetch orders
  let res;

  try {
    res = await request.post(`${loginUrl}/login`, { data: user });
    let responseBody = await res.json();

    //Logging in the webiste to authenticate the token for the requests
    await page.goto(
      "https://api.practicesoftwaretesting.com/api/documentation"
    );
    await page.getByRole("button", { name: "Authorize" }).click();
    await page.getByRole("textbox", { name: "auth-bearer-value" }).click();
    await page
      .getByRole("textbox", { name: "auth-bearer-value" })
      .fill(responseBody.access_token);
    await page.getByRole("button", { name: "Apply credentials" }).click();
    const startTime = performance.now();
    res = await request.get(`${url}?page=1`, {
      headers: {
        Authorization: `Bearer ${responseBody.access_token}`,
        accept: "application/json",
      },
    });
    const endTime = performance.now();

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);
    responseBody = await res.json();
    console.log(
      responseBody.total,
      "Orders fetched successfully! - Test passed"
    );

    console.log(responseBody);

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

test("GET orders by ID request", async ({ request, page }) => {
  // API call to GET orders by ID
  let res;

  try {
    res = await request.post(`${loginUrl}/login`, { data: user });
    let responseBody = await res.json();
    const token = responseBody.access_token;

    await page.goto(
      "https://api.practicesoftwaretesting.com/api/documentation"
    );
    await page.getByRole("button", { name: "Authorize" }).click();
    await page.getByRole("textbox", { name: "auth-bearer-value" }).click();
    await page
      .getByRole("textbox", { name: "auth-bearer-value" })
      .fill(responseBody.access_token);
    await page.getByRole("button", { name: "Apply credentials" }).click();

    res = await request.get(`${url}?page=1`, {
      headers: {
        Authorization: `Bearer ${responseBody.access_token}`,
        accept: "application/json",
      },
    });

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);
    responseBody = await res.json();

    const startTime = performance.now();

    res = await request.get(`${url}/${responseBody.data[0].id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });

    const endTime = performance.now();
    console.log(
      `Order ${responseBody.data[0].id} found successfully - Test Passed`
    );
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
