import { scrobbles } from "./scrobblestore";
import { Stats, SearchParams } from './types';
import { artistGetInfo } from "./util/lastfm/methods";
import { excludeArtistsList } from "./excludelist";
class SearchResultsStore {
    _filteredResults = [] as Stats[];
    _allResults = [] as Stats[];
    
    async filterResultsArtist(params: SearchParams, artists: Record<string, Stats>, dispatch: React.DispatchWithoutAction, searchUsage: React.MutableRefObject<number>) {
        let originalSearchUsage = searchUsage.current;
        let tempFilteredResults = this.basicFilter(params, artists);
        
        // Async filtering
        this._filteredResults = [];
        for (let result of tempFilteredResults) {
            if (!result.listeners) {
                try {
                    const info = await artistGetInfo(result.name);
                    result.listeners = info.listeners;
                    result.tags = info.tags;
                    result.url = info.url;
                    result.bio = info.bio;
                    scrobbles._artists[result.name] = result;
                    localStorage.setItem("artists", JSON.stringify(scrobbles._artists));
                } catch (error) {
                    if (error instanceof Error) {
                        if (error.message == "query not found") {
                            // 
                            console.log("Last.fm didn't recognize artist " + result.name + " so only scrobble and time data can be used to filter this artist.")
                        }
                    }
                }
            }
            if (result.bio) {
                if (params.bioContains) {
                    if (!result.bio.toLowerCase().includes(params.bioContains.toLowerCase())) {
                        continue;
                    }
                }
            }
            if (result.tags) {
                if (params.tagCharactersRange.from) {
                    if (result.tags.filter(tag => tag.length >= params.tagCharactersRange.from!).length == 0) {
                        continue;
                    }
                }
                if (params.tagCharactersRange.to) {
                    if (result.tags.filter(tag => tag.length <= params.tagCharactersRange.to!).length == 0) {
                        continue;
                    }
                }
                let hasExcludedTag = false;
                let hasIncludedTag = true;
                let hasStrictIncludedTag = true;
                if (params.excludeTags) {
                    hasExcludedTag = params.excludeTags.filter(tag => result.tags!.includes(tag)).length > 0;
                }
                if (params.includeTags) {
                    hasIncludedTag = (params.includeTags.length == 0) || (params.includeTags.filter(tag => result.tags!.includes(tag)).length > 0);
                }
                if (params.strictIncludeTags) {
                    hasStrictIncludedTag = params.strictIncludeTags.filter(tag => result.tags!.includes(tag)).length === params.strictIncludeTags.length;
                }
                if (!hasIncludedTag || !hasStrictIncludedTag || hasExcludedTag) {
                    continue;
                }
            } else {
                if (params.tagCharactersRange.from && params.tagCharactersRange.from > 0) {
                    continue;
                }
            }
            if (searchUsage.current != originalSearchUsage) { // This instance of filtering comes from an older search button press, quit filtering
                break;
            }
            this._filteredResults.push(result);
            dispatch();
        }
    }

    basicFilter(params: SearchParams, artists: Record<string, Stats>) {
        // Basic filtering, no API request needed
        let tempFilteredResults = Object.values(artists);
        tempFilteredResults = tempFilteredResults.filter(x => !excludeArtistsList._names.includes(x.name));
        if (params.query) {
            tempFilteredResults = tempFilteredResults.filter(x => x.name.toLowerCase().includes(params.query!.toLowerCase()));
        }
        // Range filtering, get the specified range from the parameters and use it to check the specified property within the result
        let ranges = new Map<string, string>([
            ["dateDiscoveredRange", "discovered"],
            ["scrobblesRange", "scrobbles"],
            ["listenersRange", "listeners"]]
        );
        for (let [range, property] of ranges) {
            if (params[range].from) {
                tempFilteredResults = tempFilteredResults.filter(x => x[property] >= params[range].from);
            }
            if (params[range].to) {
                tempFilteredResults = tempFilteredResults.filter(x => {
                    return x[property] <= params[range].to;
                });
            }
        }
        tempFilteredResults.sort((a, b) => a.discovered - b.discovered);
        return tempFilteredResults;
    }
}

export let searchResults = new SearchResultsStore();