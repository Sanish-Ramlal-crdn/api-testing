import { test, expect } from '@playwright/test';
import user from './fixtures/user.json'

test('POST register request', async ({ request }) => {  //API POST call for registration
    const startTime = performance.now();
    const res = await request.post('https://api.practicesoftwaretesting.com/users/register', {
        data: user
    })

    const endTime = performance.now();

    //Checking status code
    expect(res.status()).toBe(201)

    //Checking response time
    const resTime=(endTime-startTime).toFixed(0)

    if (resTime>="2000"){
        console.log(`Responded above acceptable time with ${resTime} ms`)
    } else {
        console.log(`Responded within acceptable time with ${resTime} ms`)
    }

    console.log("User registered successfully! - Test passed")
})

