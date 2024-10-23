// 'use client';

import {lfmGet} from "./client"
import {getTopTagsTransformer, getArtistGetCorrectionTransformer, getArtistGetInfoTransformer, getUserGetRecentTracksTransformer} from "./responsetransformers"

export async function artistGetTopTags(artist: string) {
    const response = await lfmGet({
        method: "artist.getTopTags",
        artist
    })
    return getTopTagsTransformer(response);
}

export async function artistGetInfo(artist: string) {
    const response = await lfmGet({
        method: "artist.getInfo",
        artist
    })
    return getArtistGetInfoTransformer(response);
}

export async function artistGetCorrection(artist: string) {
    const response = await lfmGet({
        method: "artist.getCorrection",
        artist
    })
    return getArtistGetCorrectionTransformer(response);
}

export async function userGetRecentTracks(user: string, page=1) {
    const response = await lfmGet({
        method: "user.getRecentTracks",
        user,
        page
    })
    return getUserGetRecentTracksTransformer(response);
}