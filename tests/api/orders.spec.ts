import { test, expect } from "@playwright/test";
import user from "../fixtures/user.json";
import invoice from "../fixtures/invoice.json";
import token from "../fixtures/token.json";
import { getProductId, createCart, checkResponseTime } from "../utils.ts";

const path = "https://api.practicesoftwaretesting.com/invoices";
const cartPath = "https://api.practicesoftwaretesting.com/carts";
const productPath = "https://api.practicesoftwaretesting.com/products";

test("POST order invoice request", async ({ request }) => {
  const cartId = await createCart(request, cartPath);
  const productId = await getProductId(request, productPath);

  let res;
  try {
    res = await request.post(`${path}/login`, { data: user });
    //Putting at least 1 item in the cart before creating an invoice
    res = await request.post(`${cartPath}/${cartId}`, {
      data: {
        product_id: productId,
        quantity: 1,
      },
    });

    invoice.cart_id = cartId;
    const startTime = performance.now();
    res = await request.post(`${path}`, {
      data: invoice,
      headers: {
        Authorization: `Bearer ${token.access_token}`,
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

test("GET orders request", async ({ request }) => {
  // API GET call to fetch orders
  let res;
  const startTime = performance.now();

  try {
    res = await request.get(`${path}?page=1`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
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

test("GET orders by ID request", async ({ request }) => {
  // API call to GET orders by ID
  let res;
  const startTime = performance.now();

  try {
    res = await request.get(`${path}?page=1`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        accept: "application/json",
      },
    });

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);
    const responseBody = await res.json();

    const startTime = performance.now();

    res = await request.get(`${path}/${responseBody.data[0].id}`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
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
