import { Card } from "@kleros/ui-components-library";

const DisplayCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => {
  return (
    <Card className="w-full h-auto">
      <div className="w-full bg-klerosUIComponentsLightBackground px-5 md:px-7 pt-2.25 pb-2.75 h-11.25">
        <label id="value-label" className="text-base text-klerosUIComponentsPrimaryText h-6.25">
          {label}
        </label>
      </div>
      <div className="w-full px-5 md:px-7 pt-2.25 pb-2.75 min-h-11.5 h-fit max-h-105 overflow-y-scroll">
        <p
          aria-labelledby="value-label"
          className="break-words whitespace-pre-wrap text-klerosUIComponentsSecondaryText text-sm"
        >
          {value}
        </p>
      </div>
    </Card>
  );
};

export default DisplayCard;
