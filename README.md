# SauceDemo Web Automation Framework

## 1. Project Overview

This project is a web automation testing framework for [SauceDemo](https://www.saucedemo.com/), built using **Playwright and TypeScript**.

The framework covers key user journeys and functional scenarios, including login, product sorting, shopping cart operations, checkout validation, order calculations, and order completion.

It is designed to support reusable test automation, maintainable test code, selective test execution, and test reporting.

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| Playwright | Browser automation and end-to-end testing |
| TypeScript | Type safety and maintainable test code |
| Playwright Test | Test runner, assertions, fixtures, and execution |
| Page Object Model (POM) | Separates page-specific locators and actions from test scenarios |
| Allure | Test execution reporting |
| dotenv | Loads environment variables from the `.env` file |

### Why Playwright?

Playwright provides browser automation, auto-waiting, built-in assertions, and parallel test execution. These features help reduce synchronization issues and simplify end-to-end testing.

### Why TypeScript?

TypeScript provides static type checking, editor support, and improved maintainability when working with page objects, test data, and reusable methods.

### Why Page Object Model?

POM separates page-specific locators and actions into dedicated classes. This reduces duplication and makes tests easier to read and maintain.

### Why Allure?

Allure provides structured test reports to help review execution results and investigate failures.

## 3. Project Structure

```text
saucedemo-automation/
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── InventoryPage.ts
│   ├── LoginPage.ts
│   └── OverviewPage.ts
├── test-data/
│   └── login.data.ts
├── tests/
│   ├── cart.spec.ts
│   ├── checkout-e2e.spec.ts
│   ├── checkout.spec.ts
│   ├── login.spec.ts
│   ├── problem-user.spec.ts
│   ├── sorting.spec.ts
│   └── users.spec.ts
├── TestFiles/
│   ├── SauceDemo_Test_Cases.xlsx
│   └── TestPlan/
├── playwright-report/
├── test-results/
├── package.json
├── playwright.config.ts
├── .env
├── .gitignore
└── README.md
```

*Note: Generated reports and test results may appear after test execution. The `.env` file is local configuration and should not be committed.*

### Directory Responsibilities

- **`pages/`** — Contains Page Object classes for login, inventory, cart, checkout, and order overview.
- **`test-data/`** — Stores reusable test data separately from test logic.
- **`tests/`** — Contains automated tests grouped by feature and purpose.
- **`TestFiles/`** — Contains the Excel test cases and test plan.
- **`playwright.config.ts`** — Defines Playwright test configuration and execution settings.
- **`.env`** — Stores local environment variables, including the test password.
- **`package.json`** — Defines project dependencies and available npm scripts.

## 4. Automated Test Coverage

The automated suite includes the following areas. Actual coverage depends on the scenarios implemented in each test file.

### Login

- Successful login and navigation to the inventory page.
- Invalid credentials and missing required fields.
- Locked-out user validation.
- Error message dismissal.

### Product Inventory and Sorting

- Sorting products by name in ascending and descending order.
- Sorting products by price from low to high and high to low.
- Verifying product names and prices after sorting.

### Shopping Cart

- Adding products to the cart.
- Verifying the cart badge.
- Verifying selected products and prices.
- Removing products from the inventory page and cart, where implemented.

### Checkout

- Validating missing first name, last name, and postal code.
- Verifying products and prices on the checkout overview.
- Validating subtotal, tax, and total calculations.
- Completing an order successfully.

### User Types and Known Application Behavior

Additional tests cover different SauceDemo user types, including the `problem_user` account.

Tests that investigate known application issues should clearly distinguish expected application limitations from unexpected automation failures.

## 5. Test Case Documentation

Manual test cases are maintained in:

`TestFiles/SauceDemo_Test_Cases.xlsx`

The document supports test planning and manual verification of the main application features.

## 6. Setup and Installation

### Prerequisites

- Node.js and npm.
- Git, if cloning the repository.
- A code editor such as Visual Studio Code.

### Install Dependencies

Run the following commands from the project root:

```bash
npm install
npx playwright install chromium
```

### Environment Configuration

Create a local `.env` file in the project root:

```env
SAUCE_PASSWORD=your_saucedemo_password
```

Replace the placeholder with the password for the intended test account.

Ensure that the project loads the environment variable through `dotenv/config` or an equivalent configuration.

**Security guidelines:**

- Do not commit `.env` or expose credentials in source control.
- Ensure `.env` is listed in `.gitignore`.
- If an `.env.example` file is added, use placeholder values only.
- Avoid printing credentials in test logs or reports.

## 7. Running the Tests

Run commands from the project root.

### Run All Tests

```bash
npm run test:all
```

Runs the complete Playwright test suite.

### Run Smoke Tests

```bash
npm run test:smoke
```

Runs tests tagged with `@smoke`, intended to provide quick feedback on essential functionality.

### Run Regression Tests

```bash
npm run test:regression
```

Runs tests tagged with `@regression` to check existing functionality after changes.

### Run End-to-End Tests

```bash
npm run test:e2e
```

Runs tests tagged with `@e2e`, covering designated end-to-end journeys.

### Run High-Severity Tests

```bash
npm run test:high-severity
```

Runs tests tagged with `@severity-high`. These tags identify scenarios associated with potentially significant failure impact.

### Run High-Priority Tests

```bash
npm run test:high-priority
```

Runs tests tagged with `@priority-high`. These tags identify scenarios selected for earlier testing attention.

### Run Tests in Headed Mode

```bash
npm run test:all -- --headed
```

Opens the browser UI while tests execute.

### Run a Specific Test File

```bash
npx playwright test tests/login.spec.ts
```

### Run a Specific Test by Title

```bash
npx playwright test -g "valid user is redirected to the inventory page"
```

### List Tests Without Executing Them

List high-severity tests:

```bash
npx playwright test --list --grep "@severity-high"
```

List high-priority tests:

```bash
npx playwright test --list --grep "@priority-high"
```

**Tagging note:** Playwright uses matching test titles or configured tags when filtering tests with `--grep`. The npm scripts select tests; they do not automatically assign classifications or change execution order.

## 8. Test Classification Strategy

The framework uses tags to group tests and support selective execution.

| Category | Tag | Purpose |
|---|---|---|
| Smoke | `@smoke` | Quickly verifies essential functionality |
| Regression | `@regression` | Checks existing functionality after changes |
| End-to-End | `@e2e` | Identifies complete user journeys |
| High Severity | `@severity-high` | Identifies scenarios associated with significant failure impact |
| High Priority | `@priority-high` | Identifies scenarios requiring earlier testing attention |

### Severity vs. Priority

**Severity** describes the impact of a failure on the system or its users.

**Priority** describes how urgently an issue or scenario needs attention.

These concepts are related but independent. A test classification does not automatically establish the severity or priority of a defect; defect ratings should be assigned based on the actual failure and its context.

### Tagging Convention

Tags can be included in test titles so Playwright can select the relevant tests.

Example:

```typescript
test(
  'completes checkout successfully @smoke @regression @priority-high @severity-high',
  async ({ page }) => {
    // Existing test steps
  }
);
```

A test may have multiple tags when it belongs to multiple categories. Assign classifications according to defined criteria rather than marking every test as high priority or high severity.

### Recommended Execution Approach

A practical approach is to:

1. Run Smoke Tests for quick feedback on essential functionality.
2. Run High-Priority Tests when early feedback on important scenarios is needed.
3. Run High-Severity Tests to focus on scenarios associated with significant failure impact.
4. Run the Regression Suite for broader functional coverage.

Adjust the sequence based on release risks, testing time, and team requirements.

**Important:** Tags do not automatically change the execution order when the complete suite runs. The commands select the matching tests.

## 9. Allure Reporting

The project includes Allure-related dependencies and npm scripts for report generation.

### Step 1: Execute Tests

```bash
npm run test:all
```

### Step 2: Generate the Allure Report

```bash
npm run report:allure
```

### Step 3: Open the Report

```bash
npm run report:allure:open
```

The generated report can help review test outcomes and investigate failures.

### Playwright Tags and Allure Metadata

Playwright tags support test selection through commands such as `--grep`.

Allure metadata can provide additional structured information in reports when the integration and test configuration support it. A Playwright tag does not automatically guarantee that the corresponding Allure severity or label will appear as structured report metadata.

## 10. Test Design and Maintainability

The framework aims to follow these practices:

- Reusable page objects and page-specific methods.
- Separation of test logic and test data.
- Environment variables for credentials.
- Assertions that verify observable application behavior.
- Tags for selective test execution.
- Independent test setup to reduce unintended dependencies.
- Reporting to support test result analysis.
- Clear identification of tests associated with known application issues.

## 11. Limitations and Future Improvements

Potential improvements include:

- Expanding coverage for additional user types and edge cases.
- Adding further end-to-end user journeys.
- Improving the handling and reporting of known application defects.
- Extending browser and environment coverage.
- Integrating automated execution into a CI/CD pipeline.
- Refining test classification criteria as the suite grows.

## 12. Conclusion

This project demonstrates a maintainable approach to web automation using Playwright, TypeScript, and the Page Object Model.

It combines feature-level automated tests, tagged execution, documented manual test cases, and Allure reporting to support functional verification and regression testing.

The framework's classification strategy enables targeted execution and clearer test planning while keeping test classifications distinct from confirmed defect severity and priority.
