import { h } from "preact";
import "bulma/css/bulma.css";

const Message = (props) => {
  return (
    <div>
      <div>
        <article class={"message is-" + props.type}>
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
