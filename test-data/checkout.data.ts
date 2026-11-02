
export const checkoutUsers = {
  validUser: {
    firstName: 'Shaimaa',
    lastName: 'Ahmed',
    postalCode: '12345',
  },

  anotherValidUser: {
    firstName: 'Mona',
    lastName: 'Mohamed',
    postalCode: '54321',
  },
};

export const checkoutValidationScenarios = [
  {
    title: 'first name is missing',
    firstName: '',
    lastName: 'Ahmed',
    postalCode: '12345',
    expectedError: 'Error: First Name is required',
  },
  {
    title: 'last name is missing',
    firstName: 'Shaimaa',
    lastName: '',
    postalCode: '12345',
    expectedError: 'Error: Last Name is required',
  },
  {
    title: 'postal code is missing',
    firstName: 'Shaimaa',
    lastName: 'Ahmed',
    postalCode: '',
    expectedError: 'Error: Postal Code is required',
  },
];
export const checkoutExpectedValues = {
  tax: 2.40,
};