import { h } from "preact";
import { useCallback, useState } from "preact/hooks";

import { Results } from "./Results.js";
import { RuntimeBillingInfo } from "./RuntimeBillingInfo.js";
import { RuntimeMemoryTable } from "./RuntimeMemoryTable.js";
import { lambdaMemory as lambdaMemoryDefaults } from "../lib/lambdaDefaults";
import {
  getRequestTypesAndCost,
  getExecutionTypesAndCost,
} from "../lib/calculator.js";

import "bulma/css/bulma.css";
import "../../assets/css/custom.css";

const App = () => {
  const [lambdaRequests, setlambdaRequests] = useState(null);
  const onLambdaRequestsInput = useCallback((e) => {
    setlambdaRequests(Number(e.target.value));
  }, []);

  const [lambdaRuntime, setLambdaRuntime] = useState(null);
  const onLambdaRuntimeInput = useCallback((e) => {
    setLambdaRuntime(Number(e.target.value));
  }, []);

  const [lambdaMemory, setLambdaMemory] = useState(lambdaMemoryDefaults.min);
  const onLambdaMemoryInput = useCallback((e) => {
    setLambdaMemory(Number(e.target.value));
  }, []);

  const [withFreeTier, setwithFreeTier] = useState(false);
  const onFreeTierInput = useCallback((e) => {
    if (e.target.value === "true") {
      setwithFreeTier(true);
    } else {
      setwithFreeTier(false);
    }
  }, []);

  let requestTypesAndCost = null;
  if (lambdaRequests) {
    requestTypesAndCost = getRequestTypesAndCost(lambdaRequests, withFreeTier);
  }

  let executionTypesAndCost = null;
  if (lambdaRuntime && lambdaMemory && lambdaRequests) {
    executionTypesAndCost = getExecutionTypesAndCost(
      lambdaRuntime,
      lambdaMemory,
      lambdaRequests,
      withFreeTier,
    );
  }

  const dropdownMemoryOptions = [];
  for (
    let memory = lambdaMemoryDefaults.min;
    memory <= lambdaMemoryDefaults.max;
    memory += 64
  ) {
    dropdownMemoryOptions.push(<option value={memory}>{memory}</option>);
  }

  return (
    <div class="container calculator-container">
      <h1 class="title is-1">AWS Lambda calculator</h1>
      <hr />
      <div class="field">
        <label class="label">Lambda requests</label>
        <div class="control">
          <input
            onInput={onLambdaRequestsInput}
            name="lambdaCalls"
            class="input"
            type="number"
            placeholder="1"
            min="1"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Lambda runtime per execution in ms</label>
        <div class="control">
          <input
            onInput={onLambdaRuntimeInput}
            name="lambdaRuntime"
            class="input"
            type="number"
            placeholder="600"
            min="1"
            required
          />
        </div>
      </div>
      <label class="label">Configured memory in MB</label>
      <div class="select">
        <select value={lambdaMemory} onInput={onLambdaMemoryInput}>
          {dropdownMemoryOptions}
        </select>
      </div>
      <br />
      <br />
      <label class="label">Inlcude free tier? 1M free requests per month
       and 400,000 GB-seconds of compute time per month</label>
      <div class="control">
        <label class="radio">
          <input
            onChange={onFreeTierInput}
            type="radio" value="true" checked={withFreeTier}
          />Yes
        </label>
        <label class="radio">
          <input
            onChange={onFreeTierInput}
            type="radio" value="false" checked={!withFreeTier}
          />No
        </label>
      </div>
      <hr />
      {
        executionTypesAndCost
          ? <RuntimeBillingInfo
            runtimeBilled={executionTypesAndCost.runtimeBilled}
            runtime={lambdaRuntime}
          /> : ""
      }
      <br />
      {
        requestTypesAndCost
        || executionTypesAndCost
          ? <Results
            requestTypesAndCost={requestTypesAndCost}
            executionTypesAndCost={executionTypesAndCost}
          /> : ""
      }
      {
        executionTypesAndCost
          ? <RuntimeMemoryTable
            freeTier={withFreeTier}
            executionCost={executionTypesAndCost.cost}
            calls={lambdaRequests}
          /> : ""
      }
    </div>
  );
};

export { App };
