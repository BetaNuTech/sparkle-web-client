# Testing

Here are some practices we use to improve our tests.

## Design for Non-Techical People

Write your test assertions so non technical people can read them, understand what's wrong, and communicate it easily to a developer.

Bad:
`add property to queue for deleteConfirmModal`

Good:
`selects property for user to confirm to delete later`

## Table Driven Testing

[Table driven testing](https://www.guru99.com/data-driven-testing.html) is a great technique for adding coverage over large amounts of possible inputs.

Here's an example of testing a `isEven` util:

```
const tests = [
  { input: 1, expected: false },
  { input: 2, expected: true },
  { input: 3, expected: false},
  { input: 4, expected: true }
];

for (let i = 0; i < tests.length; i++) {
  const const { input, expected } = tests[i];
  expect(isEven(input)).toEqual(expected);
}
```

Instead of writing 2 tests or only testing two values we've added more test coverage within a single test.\

## Prioritizing Tests

- Prefer the speed of unit testing over integration testing.
- Prefer the speed of integration testing over E2E testing.
- Limit Acceptance & E2E for only the most business-critical functionality (For example a checkout form).
