import { h } from "preact";
import { Message } from "./Message.js";

const RuntimeBillingInfo = (props) => {
  if (props.runtimeBilled !== props.runtime) {
    return (
      <Message
        header="Runtime billing info"
        type="info"
        message={
          <div>
            <p>AWS bills Lambda per 100ms. The runtime is rounded up to
              the nearest 100ms.</p>
            <p>
              <b>Runtime used for calculation: </b>{props.runtimeBilled}ms
            </p>
          </div>
        }
      />
    );
  }
};

export { RuntimeBillingInfo };
