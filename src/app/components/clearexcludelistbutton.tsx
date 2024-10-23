import { excludeArtistsList } from "../lib/excludelist";
import { searchResults } from "../lib/searchresultsstore";
type ClearExcludeListButtonProps = {
}

export default function ClearExcludeListButton (props: ClearExcludeListButtonProps) {

    const onClickHandler = () => {
        excludeArtistsList.clearList();
        const searchButton = document.querySelector("#search") as HTMLButtonElement;
        searchButton.click();
    } 
    return (
        <button className="bg-blue-500 hover:bg-blue-700 px-1 absolute top-0 right-0 m-0" type="button" onClick={onClickHandler}>clear excluded artists list</button>
    );
}