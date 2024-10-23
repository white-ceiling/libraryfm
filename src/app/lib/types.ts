export type Scrobble = {
    artist: string,
    album: string,
    track: string,
    timestamp: number
}

export interface Stats extends Record<string, any> {
    name: string,
    scrobbles: number,
    discovered: number,
    tags?: string[],
    listeners?: number,
    url?: string,
    bio?: string
}

export class NumRange {
    from?: number;
    to?: number;

    constructor(from: number, to: number) {
        this.from = !isNaN(from) ? from : undefined;
        this.to = !isNaN(to) ? to : undefined;
    }
}

enum Capitalization {
    Any,
    AllCaps,
    EveryWord,
    SentenceCase,
    LowerCase
}

export interface SearchParams extends Record<string, any> {
    query?: string,
    hasBio?: boolean,
    bioContains?: string,
    hasTags?: boolean,
    includeTags?: string[],
    excludeTags?: string[],
    strictIncludeTags?: string[];
    dateDiscoveredRange: NumRange,
    dateScrobbledRange: NumRange,
    scrobblesRange: NumRange,
    listenersRange: NumRange,
    songsRange?: NumRange,
    tagsRange?: NumRange,
    tagCharactersRange: NumRange,
    capitalization?: Capitalization
}

export type ArtistInfo = {
    name: string,
    url: string,
    listeners: number,
    playcount: number,
    tags: string[],
    bio?: string
}
export type IfEquals<T, U, Y=unknown, N=never> =
  (<G>() => G extends T ? 1 : 2) extends
  (<G>() => G extends U ? 1 : 2) ? Y : N;