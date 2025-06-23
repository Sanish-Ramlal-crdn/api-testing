## Assignment 2:  API Testing
<p align="center"><a href="#project-description">Project Description</a> -
<a href="#key-features">Key Features</a> - 
<a href="#ui-test-scenarios">API Test Scenarios</a> -
<a href="#how-to-run">How To Run</a> 
</p>

## Project Description

The goal of this assignment is to Use the public API endpoints from the Practice Software Testing GitHub repo (https://github.com/testsmith-io/practice-software-testing) to perform automated API testing using Playwright

## Key Features


## API Test Scenarios

The following scenarios have been tested:
1. **Authentication**

    *  Register a user (POST /users/register)

    *   Login a user (POST /users/login)

    *   Validate token is returned and can be reused



## How to Run
Install Node and npm from 
https://nodejs.org/en/download/

Ensure that typescript is installed on your machine
```javascript
npm install -g typescript
```

Clone the repository 
```javascript
git clone https://github.com/Sanish-Ramlal-crdn/automation-project.git
```

Once you have installed TypeScript, open the project and install Playwright if it's not already installed by running the below command in the project's root in the terminal
```javascript
npm init playwright@latest
```

Now, you can run all the tests at once by typing this command on the terminal of your code editor
```javascript
npx playwright test
```

Or you can choose which test file to run
```javascript
npx playwright test ./tests/ui/[test_file_name].spec.ts
```

You can also select the browser on which to run the tests, else it will run on all 3 browsers by default. For example

Chromium
```javascript
npx playwright test --project=chromium
```

And you can also choose to activate headed mode, as the deault mode is headless

Headed
```javascript
npx playwright test --headed
```

You can view the report after doing a test by running the following command

Report
```javascript
npx playwright show-report
```

You can also run the tests via the Playwright UI
```javascript
npx playwright test --ui
```

For more information, you can visit the official Playwright documentation at: 
https://playwright.dev/docs/api/class-playwright

And the official Playwright Git repository: https://github.com/microsoft/playwright

