import React from "react";

type LabeledInputProps = {
    id: string;
    type: string;
    children?: React.ReactNode;
    name?: string;
    value?: string;
    min?: string;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export default function LabeledInput (props: LabeledInputProps) {

    return (
        <div className="flex space-x-1">
            <label htmlFor={props.id}>{props.children}</label>
            <input type={props.type} id={props.id} name={props.name} min={props.min} value={props.value} onKeyDown={props.onKeyDown} onChange={props.onChange}></input>
        </div>
    );
}