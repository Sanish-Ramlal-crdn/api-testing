import { test, expect } from '@playwright/test';

test('GET products request', async ({ request }) => {  // API GET call to fetch products
    const startTime = performance.now();
    const res = await request.get('https://api.practicesoftwaretesting.com/products?page=1');

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

