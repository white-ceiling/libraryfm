class ExcludeList {
    _names: string[] = [];
    setLocalExclusions() {
        const tempArtists = localStorage.getItem("excluded-artists");
        if (tempArtists) {
            this._names = JSON.parse(tempArtists);
        }
        console.log("loaded excluded artists");
    }
    addNameToExclude(name: string) {
        this._names.push(name);
        localStorage.setItem('excluded-artists', JSON.stringify(this._names));
    }
    clearList() {
        this._names = [];
        localStorage.removeItem('excluded-artists');
    }
}

export let excludeArtistsList = new ExcludeList();