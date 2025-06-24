import { test, expect } from "@playwright/test";
import { getProductId, createCart, checkResponseTime } from "../utils.ts";

const path = "https://api.practicesoftwaretesting.com/carts";
const productPath = "https://api.practicesoftwaretesting.com/products";

test("POST Add product to cart", async ({ request }) => {
  const cartId = await createCart(request, path);
  const productId = await getProductId(request, productPath);

  const startTime = performance.now();
  let res;
  try {
    res = await request.post(`${path}/${cartId}`, {
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

test("GET cart details", async ({ request }) => {
  const cartId = await createCart(request, path);

  const startTime = performance.now();
  let res;
  try {
    res = await request.get(`${path}/${cartId}`);
    const endTime = performance.now();

    expect(res.status()).toBe(200);
    console.log(
      "Cart with id " + cartId + " fetched successfully - Test Passed"
    );

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
  const cartId = await createCart(request, path);
  const productId = await getProductId(request, productPath);

  const startTime = performance.now();
  let res;
  try {
    res = await request.post(`${path}/${cartId}`, {
      data: {
        product_id: productId,
        quantity: 1,
      },
    });
    const startTime = performance.now();
    res = await request.delete(`${path}/${cartId}/product/${productId}`);
    const endTime = performance.now();

    expect(res.status()).toBe(204);
    console.log(
      "Product with id " +
        productId +
        " removed from cart " +
        cartId +
        " - Test Passed"
    );
    checkResponseTime(startTime, endTime);
  } catch (error) {
    if (res) {
      const responseBody = await res.json();
      console.log("Error response:", responseBody, " - Test failed");
    }
    throw error;
  }
});
