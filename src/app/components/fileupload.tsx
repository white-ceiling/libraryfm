'use client';

import React from "react";
import LabeledInput from "./labeledinput";
import { parse as csvParse } from 'csv-parse';
import { scrobbles } from "../lib/scrobblestore";

type FileUploadProps = {
}
export default function FileUpload (props: FileUploadProps) {
    const selectFileHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            const filename: string = file.name;
            const blobReader = new FileReader();
            blobReader.onload = () => {
                const csvData = blobReader.result as string;
                let options = {};
                let timestampMultiply = 1000; // Default to assuming timestamp is in seconds as that is what the last.fm API uses, convert to milliseconds.
                if (filename.startsWith("lastfmstats-")) { // if CSV is from lastfmstats, timestamp is already in milliseconds
                    options = {delimiter: ";", from_line: 2};
                    timestampMultiply = 1;
                }
                const parser = csvParse(csvData, options);
                scrobbles.setCSVScrobbles(parser, timestampMultiply);
            };
            blobReader.readAsText(file);
        }
        
    };
    return (
        <LabeledInput type="file" id="file" onChange={selectFileHandler}>load csv</LabeledInput>
    );
}
