const lambdaMemory = {
  "min": 128,
  "max": 3008,
};

const lambdaPrice = {
  "eu-central-1": {
    "gbs": 0.000016667,
    "millionRequests": 0.2,
  },
};

const freeTier = {
  "gbs": 400000,
  "requests": 1000000,
};

export {
  lambdaMemory,
  lambdaPrice,
  freeTier,
};
