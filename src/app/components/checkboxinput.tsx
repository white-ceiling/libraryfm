import LabeledInput from "./labeledinput";

type CheckboxInputProps = {
    name: string;
    children?: React.ReactNode;
}
export default function CheckboxInput (props: CheckboxInputProps) {
    return (
        <LabeledInput type="checkbox" id={props.name + "-checkbox"}>{props.children}</LabeledInput>
    );
}