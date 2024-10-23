'use client';
import React from "react";

type TagProps = {
    children: string;
    onClick?: React.MouseEventHandler;
    strictList?: string[];
}
export default function Tag(props: TagProps) {
    let strict = props.strictList && props.strictList.includes(props.children);
    return (
        <button className={(strict ? "bg-red-500" : "bg-emerald-500") + " " + (props.onClick ? (strict ? "hover:bg-red-700" : "hover:bg-emerald-700") : "") + " px-1"}
        onClick={props.onClick}>{props.children}</button>
    );
};