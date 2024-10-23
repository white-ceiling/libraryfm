import Tag from "./tag";
import { Stats } from "../lib/types";
import { excludeArtistsList } from "../lib/excludelist";
import { searchResults } from "../lib/searchresultsstore";

export function getResultElement(result: Stats, index: number, dispatch: React.DispatchWithoutAction) {
    const date = new Date(result.discovered);
    const removeHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        excludeArtistsList.addNameToExclude(result.name);
        searchResults._filteredResults.splice(searchResults._filteredResults.indexOf(result), 1);
        dispatch();
    }
    return (
        <div className="result p-3 relative" key={index}>
            <a href={result.url}>{result.name}</a>
            <button className="bg-red-500 hover:bg-red-700 absolute top-3 right-3 px-1" onClick={removeHandler}>exclude</button>
            <p>scrobbles: {result.scrobbles}</p>
            <p>discovered on {date.toDateString()}</p>
            <div className="flex flex-wrap gap-1">
                {result.tags ? result.tags.map((tag, index) => <Tag key={index}>{tag}</Tag>) : undefined}
            </div>
        </div>
    );
}