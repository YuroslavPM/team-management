import { errorMessage } from "../../api/errors";
import { Alert } from "./Alert";

type ErrorAlertProps = {
  error: unknown;
};

export const ErrorAlert = (props: ErrorAlertProps) => {
  const { error } = props;
  return <Alert children={errorMessage(error)} />;
};
