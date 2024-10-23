import { Parser } from 'csv-parse';
import { Scrobble, Stats } from './types';
import { artistGetCorrection } from './util/lastfm/methods';
class ScrobbleStore {
    _scrobbles = [] as Scrobble[];
    _artistsRaw = {} as Record<string, Stats>;
    _artists = {} as Record<string, Stats>;
    _artistsInitialized = false;

    // Use local storage to set artist stats
    setLocalArtists() {
        const tempArtists = localStorage.getItem("artists");
        if (tempArtists) {
            this._artists = JSON.parse(tempArtists);
        }
        this._artistsInitialized = true;
        console.log("loaded artists");
    }
    
    // Initialize scrobbles, convert timestamp to milliseconds through multiply factor
    setCSVScrobbles(parser: Parser, timestampMultiply: number) {
        this._scrobbles = [] as Scrobble[];
        const self = this;
        parser.on('readable', function() {
            let record;
            while ((record = parser.read()) !== null) {
                const scrobble: Scrobble = {
                    artist: record[0],
                    album: record[1],
                    track: record[2],
                    timestamp: parseInt(record[3]) * timestampMultiply
                }
                self._scrobbles.push(scrobble);
            }
            self._scrobbles.sort((a, b) => a.timestamp - b.timestamp);
            self.setArtistStats();
        });
    }

    // Set basic numeric statistics of each artist
    setArtistStats() {
        this._artistsRaw = {} as Record<string, Stats>;
        this._artists = {} as Record<string, Stats>;
        for (let scrobble of this._scrobbles) {
            if (!this._artistsRaw[scrobble.artist]) {
                this._artistsRaw[scrobble.artist] = {
                    name: scrobble.artist,
                    scrobbles: 0,
                    discovered: scrobble.timestamp
                };
            }
            this._artistsRaw[scrobble.artist].scrobbles += 1;
        }
        this._artists = this._artistsRaw;
        this._artistsInitialized = true;
        localStorage.setItem("artists", JSON.stringify(this._artists));
    }

    // Merge artists if they have the same canonical name
    async setCanonicalArtists() {
        const correctionsElement: HTMLInputElement = document.querySelector("#corrections-checkbox")!;
        if (correctionsElement.checked) {
            this._artists = {};
            for (let artist in this._artistsRaw) {
                let canonicalArtist = "";
                try {
                    canonicalArtist = await artistGetCorrection(artist);
                } catch (error) { // last.fm doesn't store corrections or artist data for many artists with only 1 listener (the requester)
                    console.log(error);
                    canonicalArtist = artist;
                }
                if (!this._artists[canonicalArtist]) {
                    this._artists[canonicalArtist] = {
                        name: canonicalArtist,
                        scrobbles: 0,
                        discovered: this._artistsRaw[artist].discovered
                    };
                }
                this._artists[canonicalArtist].scrobbles += this._artistsRaw[artist].scrobbles;

            }
            localStorage.setItem("artists", JSON.stringify(this._artists));
        }
    }
}

export let scrobbles = new ScrobbleStore();