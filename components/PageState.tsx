import { messages } from "@/lib/copy/messages";
import { Button } from "./Button";

type PageStateProps =
  | { state: "loading" | "notFound" }
  | { state: "empty"; message: string }
  | { state: "error" | "offline"; onRetry?: () => void };

function stateMessage(props: PageStateProps): string {
  switch (props.state) {
    case "loading":
      return messages["page.loading"];
    case "notFound":
      return messages["error.notFound"];
    case "empty":
      return props.message;
    case "error":
      return messages["error.load"];
    case "offline":
      return messages["error.offline"];
  }
}

export function PageState(props: PageStateProps) {
  const isFailure = props.state === "error" || props.state === "offline";

  return (
    <div
      role={isFailure ? "alert" : "status"}
      className="flex flex-col items-center gap-4 p-7 text-center text-text-muted"
    >
      <p>{stateMessage(props)}</p>
      {isFailure && props.onRetry && (
        <Button variant="secondary" onClick={props.onRetry}>
          {messages["error.retry"]}
        </Button>
      )}
    </div>
  );
}
