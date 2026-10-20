export const loginSuccessData = {
  username: 'standard_user',
  expectedUrl: '/inventory.html',
};

export const loginErrorScenarios = [
  {
    name: 'wrong password',
    username: 'standard_user',
    password: 'wrong_password',
    errorMessage: 'Epic sadface: Username and password do not match any user in this service',
  },
  {
    name: 'empty username',
    username: '',
    errorMessage: 'Epic sadface: Username is required',
  },
  {
    name: 'empty password',
    username: 'standard_user',
    password: '',
    errorMessage: 'Epic sadface: Password is required',
  },
  {
    name: 'locked out user',
    username: 'locked_out_user',
    errorMessage: 'Epic sadface: Sorry, this user has been locked out.',
  },
];

export const dismissErrorData = {
  username: 'standard_user',
  password: '',
};

export const userScenarios = [
  {
    username: 'standard_user',
    expectedResult: 'success',
  },
  {
    username: 'locked_out_user',
    expectedResult: 'locked',
  },
  {
    username: 'problem_user',
    expectedResult: 'success',
  },
  {
    username: 'performance_glitch_user',
    expectedResult: 'success',
  },
  {
    username: 'error_user',
    expectedResult: 'success',
  },
  {
    username: 'visual_user',
    expectedResult: 'success',
  },
] as const;
