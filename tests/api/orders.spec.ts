import { test, expect } from "@playwright/test";
import invoice from "../fixtures/invoice.json";
import {
  getProductId,
  createCart,
  checkResponseTime,
  createToken,
} from "../utils.ts";
import urls from "../fixtures/url.json";

test("POST order invoice request", async ({ request, page }) => {
  const cartId = await createCart(request, urls.cart_url);
  const productId = await getProductId(request, urls.products_url);

  let res;
  try {
    const token = await createToken(request, page, urls.auth_url);
    //Putting at least 1 item in the cart before creating an invoice
    res = await request.post(`${urls.cart_url}/${cartId}`, {
      data: {
        product_id: productId,
        quantity: 1,
      },
    });

    invoice.cart_id = cartId;
    const startTime = performance.now();
    res = await request.post(`${urls.invoice_url}`, {
      data: invoice,
      headers: {
        Authorization: `Bearer ${token}`,
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

test("POST order invoice request with an empty cart", async ({
  request,
  page,
}) => {
  const cartId = await createCart(request, urls.cart_url);

  let res;
  page.pause();
  try {
    const token = await createToken(request, page, urls.auth_url);
    //Leaving the cart empty before creating an invoice
    invoice.cart_id = cartId;
    const startTime = performance.now();
    res = await request.post(`${urls.invoice_url}`, {
      data: invoice,
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });
    const endTime = performance.now();

    // Status code should be 200 (OK)
    expect(res.status()).toBe(201);
    console.log("Cart is empty! - Test passed");

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
  let res;
  // API GET call to fetch orders
  try {
    const token = await createToken(request, page, urls.auth_url);

    const startTime = performance.now();
    res = await request.get(`${urls.invoice_url}?page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });
    const endTime = performance.now();

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);
    const responseBody = await res.json();
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

test("GET orders request with missing token", async ({ request }) => {
  let res;
  // API GET call to fetch orders
  try {
    const startTime = performance.now();
    res = await request.get(`${urls.invoice_url}?page=1`);
    const endTime = performance.now();

    // Status code should be 401 (Unauthorized)
    expect(res.status()).toBe(401);

    console.log("Request made with missing token! - Test passed");

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
    const token = await createToken(request, page, urls.auth_url);

    res = await request.get(`${urls.invoice_url}?page=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
    });

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);
    let responseBody = await res.json();

    const startTime = performance.now();

    res = await request.get(`${urls.invoice_url}/${responseBody.data[0].id}`, {
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
