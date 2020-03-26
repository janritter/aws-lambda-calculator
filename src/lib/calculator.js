import {
  freeTier,
  lambdaPrice,
} from "./lambdaDefaults.js";

const getRequestTypesAndCost = (requests, withFreeTier) => {
  let freeRequests = 0;
  let billedRequests = 0;

  if (withFreeTier) {
    if (requests <= freeTier.requests) {
      freeRequests = requests;
    } else {
      freeRequests = freeTier.requests;
      billedRequests = requests - freeRequests;
    }
  } else {
    billedRequests = requests;
  }

  return {
    "freeRequests": freeRequests,
    "billedRequests": billedRequests,
    "cost": (lambdaPrice["eu-central-1"]
      .millionRequests / 1000000) * billedRequests,
  };
};

const getExecutionTypesAndCost = (runtime, memory, requests, withFreeTier) => {
  let freeExecutionGBs = 0;
  let billedExecutionGBs = 0;

  // 1 unit = 100ms
  let runtimeUnits = Math.round(runtime / 100);

  // Minimum 100ms
  if (runtimeUnits === 0) {
    runtimeUnits = 1;
  }

  const runtimeInSeconds = runtimeUnits / 10;
  const gigabyteSeconds = (runtimeInSeconds / (1024 / memory)) * requests;

  if (withFreeTier) {
    if (gigabyteSeconds <= freeTier.gbs) {
      freeExecutionGBs = gigabyteSeconds;
    } else {
      freeExecutionGBs = freeTier.gbs;
      billedExecutionGBs = gigabyteSeconds - freeExecutionGBs;
    }
  } else {
    billedExecutionGBs = gigabyteSeconds;
  }

  return {
    "freeExecutionGBs": freeExecutionGBs,
    "billedExecutionGBs": billedExecutionGBs,
    "runtimeBilled": runtimeUnits * 100,
    "cost": (lambdaPrice["eu-central-1"].gbs * billedExecutionGBs),
  };
};

export {
  getRequestTypesAndCost,
  getExecutionTypesAndCost,
};
