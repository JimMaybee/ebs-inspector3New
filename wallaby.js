module.exports = function (wallaby) {
  return {
    files: [
      '*.js'
  ],

  tests: [
      'test/*Test.js'
  ]
    testFramework: 'mocha'
  };
};
