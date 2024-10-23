import RangeInput from "./rangeinput";

type NumberRangeInputProps = {
    name: string;
    pre: string;
    children?: React.ReactNode;
    min?: string;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export default function NumberRangeInput (props: NumberRangeInputProps) {
    return (
        <div className="flex space-x-1">
        <RangeInput pre={props.pre} name={"num-" + props.name} min="0" type="number"></RangeInput>
        <label>{props.children}</label>
        </div>
    );
}