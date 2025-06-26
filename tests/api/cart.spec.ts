import { test, expect } from "@playwright/test";
import { getProductId, createCart, checkResponseTime } from "../utils.ts";
import urls from "../fixtures/url.json";

test("POST Add product to cart", async ({ request }) => {
  const cartId = await createCart(request, urls.cart_url);
  const productId = await getProductId(request, urls.products_url);

  const startTime = performance.now();
  let res;
  try {
    res = await request.post(`${urls.cart_url}/${cartId}`, {
      data: {
        product_id: productId,
        quantity: 1,
      },
    });

    const endTime = performance.now();

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);
    console.log(
      "Product added successfully to cart with ID " + cartId + "! - Test passed"
    );

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

test("GET cart details", async ({ request }) => {
  const cartId = await createCart(request, urls.cart_url);

  const startTime = performance.now();
  let res;
  try {
    res = await request.get(`${urls.cart_url}/${cartId}`);
    const endTime = performance.now();

    expect(res.status()).toBe(200);
    console.log(
      "Cart with id " + cartId + " fetched successfully - Test Passed"
    );

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

test("DELETE item from cart", async ({ request }) => {
  const cartId = await createCart(request, urls.cart_url);
  const productId = await getProductId(request, urls.products_url);

  let res;
  try {
    res = await request.post(`${urls.cart_url}/${cartId}`, {
      data: {
        product_id: productId,
        quantity: 1,
      },
    });
    const startTime = performance.now();
    res = await request.delete(
      `${urls.cart_url}/${cartId}/product/${productId}`
    );
    const endTime = performance.now();

    expect(res.status()).toBe(204);
    console.log(
      "Product with id " +
        productId +
        " removed from cart " +
        cartId +
        " - Test Passed"
    );

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
