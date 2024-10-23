import LabeledInput from "./labeledinput";

type RangeInputProps = {
    name: string;
    pre?: string;
    type: string;
    min?: string;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export default function DateRangeInput (props: RangeInputProps) {
    return (
        <div className="flex space-x-1">
            <label>{props.pre}</label>
            <LabeledInput type={props.type} min={props.min} id={props.name + "-from"}>from</LabeledInput>
            <LabeledInput type={props.type} min={props.min} id={props.name + "-to"}>to</LabeledInput>
        </div>
    );
}