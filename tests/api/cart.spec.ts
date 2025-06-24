import { test, expect } from "@playwright/test";
import { getProductId } from "./product.spec";

const path = "https://api.practicesoftwaretesting.com/carts";

async function createCart(request) {
  const res = await request.post(`${path}`);
  expect(res.status()).toBe(201);
  const responseBody = await res.json();
  return responseBody.id;
}

test("Add product to cart", async ({ request }) => {
  const cartId = await createCart(request);
  const productId = await getProductId(request);

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
    const resTime = (endTime - startTime).toFixed(0);

    // Status code should be 200 (OK)
    expect(res.status()).toBe(200);
    console.log(
      "Product added successfully to cart with ID " + cartId + "! - Test passed"
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
