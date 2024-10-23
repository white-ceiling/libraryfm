import RangeInput from "./rangeinput";

type DateRangeInputProps = {
    name: string;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export default function DateRangeInput (props: DateRangeInputProps) {
    const name = props.name;
    return (
        <RangeInput name={"date-" + props.name} pre={props.name} type="date"></RangeInput>
    );
}