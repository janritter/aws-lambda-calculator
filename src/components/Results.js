import { h } from "preact";
import { Message } from "./Message.js";

const Results = (props) => {
  return (
    <Message
      header="Your cost"
      message={
        <div>
          {
            props.requestTypesAndCost
              ? <div>
                <p>
                  <b>Free requests: </b>
                  {props.requestTypesAndCost.freeRequests}
                </p>
                <p>
                  <b>Billed requests: </b>
                  {props.requestTypesAndCost.billedRequests}
                </p>
                <p>
                  <b>Request cost: </b>
                  {props.requestTypesAndCost.cost}$
                </p>
              </div>
              : ""
          }
          {
            props.executionTypesAndCost
            && props.requestTypesAndCost
              ? <br />
              : ""
          }
          {
            props.executionTypesAndCost
              ? <div>
                <p>
                  <b>Free execution GB/s: </b>
                  {props.executionTypesAndCost.freeExecutionGBs}
                </p>
                <p>
                  <b>Billed execution GB/s: </b>
                  {props.executionTypesAndCost.billedExecutionGBs}
                </p>
                <p>
                  <b>Execution cost: </b>
                  {props.executionTypesAndCost.cost}$
                </p>
              </div>
              : ""
          }
          {
            props.executionTypesAndCost
            && props.requestTypesAndCost
              ? <div>
                <br />
                <p>
                  <b>Total cost: </b>
                  {props.executionTypesAndCost.cost
                    + props.requestTypesAndCost.cost}$
                </p>
              </div>
              : ""
          }
        </div>
      }
    />
  );
};

export { Results };
