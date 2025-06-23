import { test, expect } from '@playwright/test';
import user from './fixtures/user.json'

test('POST register request', async ({ request }) => {  // API POST call for registration
    const startTime = performance.now();
    const res = await request.post('https://api.practicesoftwaretesting.com/users/register', {
        data: user
    });

    const endTime = performance.now();

    // Checking response time
    const resTime = (endTime - startTime).toFixed(0);

    try {
        // Checking status code
        if (res.status() === 201) {
            console.log("User registered successfully! - Test passed");
        } else if (res.status() === 422) {
            console.log("User already registered");
        } else {
            throw new Error(`Unexpected status code: ${res.status()}`);
        }
    } catch (exception) {
        const responseBody = await res.json();
        console.log(responseBody);
    }

    if (parseInt(resTime) >= 2000) {
        console.log(`Responded above acceptable time with ${resTime} ms`);
    } else {
        console.log(`Responded within acceptable time with ${resTime} ms`);
    }
});


test('POST login request', async ({ request }) => {  //API POST call for login
    const startTime = performance.now();
    const res = await request.post('https://api.practicesoftwaretesting.com/users/login', {
        data: {
            "email": user.email,
            "password": user.password
        }
    })

    const endTime = performance.now();

    //Checking response time
    const resTime = (endTime - startTime).toFixed(0)
    try {
        // Checking status code
        if (res.status() === 200) {
            console.log("User logged in successfully! - Test passed");
        } else {
            throw new Error(`Unexpected status code: ${res.status()}`);
        }
    } catch (exception) {
        const responseBody = await res.json();
        console.log(responseBody);
    }

    if (resTime >= "2000") {
        console.log(`Responded above acceptable time with ${resTime} ms`)
    } else {
        console.log(`Responded within acceptable time with ${resTime} ms`)
    }
})

