import clsx from "clsx";

export enum ListStatus {
  Draft,
  Submitted,
  Executed,
}

const Status: React.FC<{ status: ListStatus }> = ({ status }) => {
  return (
    <small
      className={clsx(
        "text-sm text-klerosUIComponentsPrimaryText relative ml-4.5",
        "before:-left-4 before:top-1/2 before:-translate-y-1/2 before:absolute",
        "before:size-2 before:rounded-full",
        {
          "before:bg-klerosUIComponentsSuccess ": status === ListStatus.Executed,
          "before:bg-klerosUIComponentsSecondaryText ": status === ListStatus.Draft,
          "before:bg-klerosUIComponentsPrimaryBlue ": status === ListStatus.Submitted,
        }
      )}
    >
      {status === ListStatus.Executed && "Executed"}
      {status === ListStatus.Draft && "Draft"}
      {status === ListStatus.Submitted && "Submitted"}
    </small>
  );
};
export default Status;
