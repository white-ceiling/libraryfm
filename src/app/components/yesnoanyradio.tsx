import LabeledInput from "./labeledinput";

type YesNoAnyRadioProps = {
    name: string,
    children: string
}

export default function YesNoAnyRadio (props: YesNoAnyRadioProps) {
    return (
        <div className="radio flex space-x-3">
            <label>{props.children}</label>
            <LabeledInput type="radio" id={props.name + "-any"} name={props.name} value="0">any</LabeledInput>
            <LabeledInput type="radio" id={props.name + "-yes"} name={props.name} value="1">yes</LabeledInput>
            <LabeledInput type="radio" id={props.name + "-no"} name={props.name} value="2">no</LabeledInput>
        </div>
    );
}