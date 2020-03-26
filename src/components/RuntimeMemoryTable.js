import { h } from "preact";
import "bulma/css/bulma.css";
import { Message } from "./Message.js";
import {
  lambdaMemory,
  lambdaPrice,
} from "../lib/lambdaDefaults.js";

const RuntimeMemoryTable = (props) => {
  if (props.freeTier) {
    return (
      <div>
        <hr />
        <h3 class="title is-3">Runtime and memory for same execution cost</h3>
        <Message
          type="warning"
          header="Comparison with free tier not possible"
          message={
            <div>
              <p>Activated free tier falsifies the results of
                runtime and memory for same execustion cost.</p>
              <p>To get the result table, please deactivate free tier.</p>
            </div>
          }
        />
      </div>
    );
  }

  if (props.executionCost) {
    const runtimesForMemory = [];

    for (
      let memory = lambdaMemory.min;
      memory <= lambdaMemory.max;
      memory += 64
    ) {
      const pricePer100ms
        = ((lambdaPrice["eu-central-1"].gbs / 1024) * memory) / 10;

      const runtime = (props.executionCost
        / (pricePer100ms * props.calls)) * 100;

      // Can't be less than 100ms
      if (runtime >= 100) {
        runtimesForMemory.push(
          <tr>
            <th>{memory}</th>
            <td>{Math.floor(runtime)}</td>
          </tr>,
        );
      }
    }

    return (
      <div>
        <hr />
        <h3 class="title is-3">Runtime and memory for same execution cost</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Memory in MB</th>
              <th>Runtime in ms</th>
            </tr>
          </thead>
          <tbody>
            {runtimesForMemory}
          </tbody>
        </table>
      </div>
    );
  }
};

export { RuntimeMemoryTable };
