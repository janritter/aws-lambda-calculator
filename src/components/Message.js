import { h } from "preact";
import "bulma/css/bulma.css";

const Message = (props) => {
  return (
    <div>
      <div>
        <article class={props.type ? "message is-" + props.type : "message"}>
          <div class="message-header">
            <p>{props.header}</p>
          </div>
          <div class="message-body">
            {props.message}
          </div>
        </article>
      </div>
    </div>
  );
};

export { Message };
