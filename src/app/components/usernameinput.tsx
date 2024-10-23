'use client';

import React from "react";
import LabeledInput from "./labeledinput";
import { parse as csvParse } from 'csv-parse';
import { scrobbles } from "../lib/scrobblestore";

type UsernameInputProps = {
}
export default function UsernameInput (props: UsernameInputProps) {
    const usernameHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "Enter") {
            event.currentTarget.innerText
        }
    };
    return (
        <LabeledInput type="text" id="username" onKeyDown={usernameHandler}>username</LabeledInput>
    );
}
