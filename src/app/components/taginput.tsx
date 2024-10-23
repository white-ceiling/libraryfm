'use client';
import React, { useState } from "react";
import Tag from "./tag";
import LabeledInput from "./labeledinput";
import StrictButton from "./strictbutton";

type TagInputProps = {
    name: string,
    strictList: string[],
    setStrictList: React.Dispatch<React.SetStateAction<string[]>>
}
export default function TagInput (props: TagInputProps) {
    const name = props.name;
    const [tagsList, setTagsList] = useState([] as string[]);
    const [strictMode, setStrict] = useState(false);
    const strictEnabled = name === "include";
    const addTagHandler = () => {
        const tagInputID: string = "#" + name + "-input";
        const tagInput = document.querySelector(tagInputID) as HTMLInputElement;
        if (tagInput.value) {
            console.log(tagInput.value);
            const allTags: string[] = [];
            document.querySelectorAll(".tags-container").forEach(
                (container) => {
                    container.childNodes.forEach(
                        (tag) => {
                            allTags.push(tag.textContent!);
                })}); // Get one array of all the text of the tags
            console.log("allTags: " + allTags);
            console.log("tagsList: " + tagsList);
            let newList = [];
            let queryTags = [] as string[];
            if (tagInput.value.includes(",")) {
                queryTags = tagInput.value.split(",");
            } else {
                queryTags.push(tagInput.value);
            }
            for (let tag of queryTags) {
                if (!allTags.includes(tag)) { // Make sure new tag doesn't already exist
                    newList.push(tag);
                    
                }
            }
            if (strictEnabled && strictMode) {
                props.setStrictList([...props.strictList].concat(newList));
            }
            const totalList = [...tagsList].concat(newList);
            console.log(totalList);
            setTagsList(totalList);
        }
        tagInput.value = "";
      };
    const keyHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key == "Enter") {
            console.log("triggered");
            addTagHandler();
            console.log(tagsList);
            
        }
    };
    const tagHandler = (event: React.MouseEvent<Element, MouseEvent>) => {
        let tag = event.currentTarget.textContent!;
        setTagsList(tagsList.filter(t => t !== tag));
        props.setStrictList(props.strictList.filter(t => t !== tag));
    };
    return (
        <div className="flex space-x-1">
            <LabeledInput type="text" id={name + "-input"} onKeyDown={keyHandler}>
                {name} tags
            </LabeledInput>
            {strictEnabled ? <StrictButton strictMode={strictMode} setStrict={setStrict}></StrictButton> : undefined}
            <button type="button" className="bg-blue-500 hover:bg-blue-700 px-1" onClick={addTagHandler}>add</button>
            <div id={name + "-tags"} className="tags-container flex flex-wrap gap-1">
                {tagsList.map((tag, index) => <Tag key={index} onClick={tagHandler} strictList={props.strictList}>{tag}</Tag>)}
            </div>
        </div>
    );
};