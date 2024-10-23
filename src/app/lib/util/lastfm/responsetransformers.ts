import { AxiosResponse } from 'axios';
import { ArtistInfo, Scrobble } from '../../types';

export function getTopTagsTransformer(response: AxiosResponse<any, any>): string[] {
    const tagObjects: any[] = response.data.toptags.tag;
    const tags: string[] = tagObjects.map(obj => obj.name);
    return tags;
}

export function getArtistGetCorrectionTransformer(response: AxiosResponse<any, any>): string {
    const artist: string = response.data.corrections.correction.artist.name;
    return artist;
}

export function getArtistGetInfoTransformer(response: AxiosResponse<any, any>): ArtistInfo {
    const artist = response.data.artist;
    let info = {} as ArtistInfo;
    try {
        info.name = artist.name;
        info.url = artist.url;
        info.listeners = artist.stats.listeners;
        info.playcount = artist.stats.playcount;
        info.bio = (artist.bio.content !== "") ? artist.bio.content : undefined;
        info.tags = [];
        if (artist.tags) {
            const tagObjects: any[] = artist.tags.tag;
            info.tags = tagObjects.map(obj => obj.name);
        }
        return info;
    } catch (error) {
        console.debug("error received by transformer" + error);
        console.debug("errored on " + artist);
        throw error;
    }
}

export function getUserGetRecentTracksTransformer(response: AxiosResponse<any, any>) {
    const scrobbles: Scrobble[] = [];
    console.log(JSON.stringify(response.data));
    const totalPages = response.data.recenttracks["@attr"].totalPages;
    return {scrobbles, totalPages};
}