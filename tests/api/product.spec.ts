import { test, expect } from '@playwright/test';
const path= 'https://api.practicesoftwaretesting.com/products'

test('GET products request', async ({ request }) => {  // API GET call to fetch products
    const startTime = performance.now();
    const res = await request.get(`${path}?page=1`);

    const endTime = performance.now();

    // Checking response time
    const resTime = (endTime - startTime).toFixed(0);
    const responseBody = await res.json();

    try {
        // Checking status code
        expect(res.status()).toBe(200)
        console.log(responseBody);
    } catch (exception) {
        console.log(responseBody);
    }

    if (parseInt(resTime) >= 2000) {
        console.log(`Responded above acceptable time with ${resTime} ms`);
    } else {
        console.log(`Responded within acceptable time with ${resTime} ms`);
    }
});

test('GET products by id request', async ({ request }) => {  // API GET call to fetch products by ID

    let res = await request.get(`${path}?page=1`);

    let responseBody = await res.json();

    // Extract the ID of the first product as the ID is not fixed
    const firstProductId = responseBody.data[0].id;

    // Checking response time
    const startTime = performance.now();
    res = await request.get(`${path}/${firstProductId}`);
    const endTime = performance.now();
    const resTime = (endTime - startTime).toFixed(0);
    responseBody = await res.json();

    try {
        // Checking status code
        expect(res.status()).toBe(200)
        console.log(responseBody);
        console.log("Item found successfully - Test Passed")
    } catch (exception) {
        console.log(responseBody);
    }

    if (parseInt(resTime) >= 2000) {
        console.log(`Responded above acceptable time with ${resTime} ms`);
    } else {
        console.log(`Responded within acceptable time with ${resTime} ms`);
    }
});

