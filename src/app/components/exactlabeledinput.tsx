import React from "react";
import LabeledInput from "./labeledinput";

type ExactLabeledInputProps = {
    id: string;
    type: string;
}
export default function ExactLabeledInput (props: ExactLabeledInputProps) {
    return (
        <LabeledInput id={props.id} type={props.type}>{props.id}</LabeledInput>
    );
}