## Assignment 2: API Testing

<p align="center"><a href="#project-description">Project Description</a> - 
<a href="#api-test-scenarios">API Test Scenarios</a> -
<a href="#how-to-run">How To Run</a> 
</p>

## Project Description

The goal of this assignment is to Use the public API endpoints from the Practice Software Testing GitHub repo (https://github.com/testsmith-io/practice-software-testing) to perform automated API testing using Playwright

## API Test Scenarios

The following scenarios have been tested:

1. **Authentication**

   - Register a user (POST /users/register)

   - Login a user (POST /users/login)

   - Validate token is returned and can be reused

2. **Product Catalog**

   - Get list of products (GET /products)

   - Get product by ID (GET /products/:id)

   - Search for a Product

3. **Cart Operations**

   - Add item to cart (POST /cart)

   - Get cart (GET /cart)

   - Remove item from cart (DELETE /cart/:itemId)

4. **Order Processing**

   - Place an order (POST /orders)

   - Get order history (GET /orders)

   - Get order by ID (GET /orders/:id)

5. **Negative Testing**

   - Send invalid login credentials

   - Access a protected endpoint with an invalid or missing token

   - Try ordering with an empty cart

## How to Run

Install Node and npm from
https://nodejs.org/en/download/

Ensure that typescript is installed on your machine, in case you want to make any modification to the code

```javascript
npm install -g typescript
```

Clone the repository

```javascript
git clone https://github.com/Sanish-Ramlal-crdn/api-testing.git
```

Once you have installed TypeScript, open the project and install Playwright if it's not already installed by running the below command in the project's root in the terminal

```javascript
npm init playwright@latest
```

install Monocart reporter if it's not already installed by running the below command in the project's root in the terminal

```javascript
npm i -D monocart-reporter
```

After that, add Monocart reporter to the playwright.config.ts in the defineConfig function

```javascript
  reporter: [
    ["html", { outputFile: "playwright-report/index.html" }],
    ["monocart-reporter", { outputFile: "monocart-report/index.html" }],
  ],
```

Now, you can run all the tests (in order) at once by typing this command on the terminal of your code editor

```javascript
npx playwright test --workers 1
```

Or you can choose which test file to run

```javascript
npx playwright test ./tests/api/[file_name]
```

You can also select the browser on which to run the tests, else it will run on all 3 browsers by default. For example

Chromium

```javascript
npx playwright test --project=chromium --workers 1
```

And you can also choose to activate headed mode, as the deault mode is headless

Headed

```javascript
npx playwright test --headed
```

You can view the report after doing a test by running the following command

Playwright Report

```javascript
npx playwright show-report
```

Alternatively, you can view the Monocart report by running the following command

Monocart Report

```javascript
npx monocart show-report monocart-report/index.html
```

You can also run the tests via the Playwright UI

```javascript
npx playwright test --ui
```

For more information, you can visit the official Playwright documentation at:
https://playwright.dev/docs/api/class-playwright

And the official Playwright Git repository: https://github.com/microsoft/playwright
