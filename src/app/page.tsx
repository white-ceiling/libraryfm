'use client';
import LabeledInput from "./components/labeledinput";
import ExactLabeledInput from "./components/exactlabeledinput";
import TagInput from "./components/taginput";
import SearchButton from "./components/searchbutton";
import FileUpload from "./components/fileupload";
import UsernameInput from "./components/usernameinput";
import DateRangeInput from "./components/daterangeinput";
import NumberRangeInput from "./components/numberrangeinput";
import { scrobbles } from "./lib/scrobblestore";
import { searchResults } from "./lib/searchresultsstore";
import CheckboxInput from "./components/checkboxinput";
import React, { useRef, useReducer, useState } from "react";
import { getResultElement } from "./components/result";
import { NumRange, SearchParams, Stats } from "./lib/types";
import { excludeArtistsList } from "./lib/excludelist";
import ClearExcludeListButton from "./components/clearexcludelistbutton";
import YesNoAnyRadio from "./components/yesnoanyradio";
export default function Home() {
    const [_, setUpdate] = useReducer(x => x + 1, 0);
    const [results, setResults] = useState([] as Stats[]);
    const [strictIncludeTags, setStrictList] = useState([] as string[]);
    const searchUsage = useRef(0);
    window.onload = () => {
        scrobbles.setLocalArtists();
        excludeArtistsList.setLocalExclusions();
    }
    const searchHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!scrobbles._artistsInitialized) {
            alert("Please load your scrobbles first!");
        } else {
            let searchParams = {} as SearchParams;
            const formElements = event.currentTarget.elements;

            // Query text handling
            const queryElement = formElements.namedItem("query") as HTMLInputElement;
            searchParams.query = queryElement.value !== "" ? queryElement.value : undefined;
            const bioElement = formElements.namedItem("bio") as HTMLInputElement;
            searchParams.bioContains = bioElement.value !== "" ? bioElement.value : undefined;

            // Tags handling
            const includeTagsElement = document.querySelector("#include-tags") as Element;
            const includeTags = Array.from(includeTagsElement.childNodes).map(tag => tag.textContent!);
            const excludeTagsElement = document.querySelector("#exclude-tags") as Element;
            const excludeTags = Array.from(excludeTagsElement.childNodes).map(tag => tag.textContent!);
            searchParams.includeTags = includeTags;
            searchParams.excludeTags = excludeTags;
            searchParams.strictIncludeTags = strictIncludeTags;

            function createRangeFromNumberInput(name: string) {
                const fromElement = formElements.namedItem(name + "-from") as HTMLInputElement;
                const toElement = formElements.namedItem(name + "-to") as HTMLInputElement;
                let from = parseInt(fromElement.value);
                let to = parseInt(toElement.value);
                let range = new NumRange(from, to);
                return range;
            }

            function createRangeFromDateInput(name: string) {
                const fromElement = formElements.namedItem("date-" + name + "-from") as HTMLInputElement;
                const toElement = formElements.namedItem("date-" + name + "-to") as HTMLInputElement;
                let from = Date.parse(fromElement.value + "T00:00:00");
                let to = Date.parse(toElement.value + "T23:59:59.999");
                let range = new NumRange(from, to);
                return range;
            }
            // Discovered date handling
            searchParams.dateDiscoveredRange = createRangeFromDateInput("discovered");
            // Scrobbled date handling
            searchParams.dateScrobbledRange = createRangeFromDateInput("scrobbled");
            
            // Scrobble count handling
            searchParams.scrobblesRange = createRangeFromNumberInput("num-scrobbled");
            
            // Listener count handling
            searchParams.listenersRange = createRangeFromNumberInput("num-listeners");

            // Tags character handling
            searchParams.tagCharactersRange = createRangeFromNumberInput("num-tag-characters");

            // Prepare for search
            searchUsage.current += 1;
            await searchResults.filterResultsArtist(searchParams, scrobbles._artists, setUpdate, searchUsage);
            console.log("results count after filter");
            setUpdate();
            console.log(searchResults._filteredResults.length);
        }
    }
    const preventSubmit = (event: React.KeyboardEvent<HTMLFormElement>) => {
        return false;
    }
    return (
        <main>
            <h1>last.fm library search</h1>
            <ClearExcludeListButton></ClearExcludeListButton>
            <div className="space-y-3">
                <form className="space-y-1" id="options" onSubmit={searchHandler} onKeyDown={preventSubmit}>
                    <div className="importOptions flex space-x-1 mb-5">
                        
                        <UsernameInput></UsernameInput>
                        <label>or</label>
                        <FileUpload></FileUpload>
                    </div>
                    {/* <div className="mode flex space-x-1">
                        <label htmlFor="mode">mode</label>
                        <select className="pl-1" id="mode">
                            <option value="artist">artist</option>
                            <option value="album">album</option>
                            <option value="track">track</option>
                        </select>
                    </div> */}
                    <ExactLabeledInput type="text" id="query"></ExactLabeledInput>
                    <details open className="space-y-1">
                        <summary>options</summary>
                        <CheckboxInput name="corrections">enable artist name corrections</CheckboxInput>
                        <div className="bio flex flex-col space-y-1">
                            <YesNoAnyRadio name="has-bio">has bio?</YesNoAnyRadio>
                            <LabeledInput type="text" id="bio">bio contains</LabeledInput>
                        </div>
                    
                        <div className="tags flex flex-col space-y-1">
                            <YesNoAnyRadio name="has-tags">has tags?</YesNoAnyRadio>
                            <TagInput name="include" setStrictList={setStrictList} strictList={strictIncludeTags}></TagInput>
                            <TagInput name="exclude" setStrictList={setStrictList} strictList={strictIncludeTags}></TagInput>
                            <NumberRangeInput pre="at least one tag" name="tag-characters">characters</NumberRangeInput>
                        </div>
                        <DateRangeInput name="discovered"></DateRangeInput>
                        <DateRangeInput name="scrobbled"></DateRangeInput>
                        <NumberRangeInput pre="scrobbled" name="scrobbled">times</NumberRangeInput>
                        <NumberRangeInput pre="scrobbled" name="songs">different songs</NumberRangeInput>
                        <NumberRangeInput pre="has" name="listeners">listeners</NumberRangeInput>
                        <NumberRangeInput pre="has" name="tags">tags</NumberRangeInput>
                        <div className="radio flex space-x-3">
                            <label>capitalization?</label>
                            <LabeledInput type="radio" id="any" name="capitalization" value="0">any</LabeledInput>
                            <LabeledInput type="radio" id="all-caps" name="capitalization" value="1">ALL CAPS</LabeledInput>
                            <LabeledInput type="radio" id="cap-every-word" name="capitalization" value="2">Capitalize Every Word</LabeledInput>
                            <LabeledInput type="radio" id="sentence-case" name="capitalization" value="3">Sentence case</LabeledInput>
                            <LabeledInput type="radio" id="all-lower" name="capitalization" value="4">all lower</LabeledInput>
                        </div>
                    </details>
                    <SearchButton></SearchButton>
                </form>
                <div id="results" className="grid grid-cols-4 auto-rows-auto gap-3">
                    {searchResults._filteredResults.map((result, index) => getResultElement(result, index, setUpdate))}
                </div>
            </div>
            
            
        </main>
    );
}