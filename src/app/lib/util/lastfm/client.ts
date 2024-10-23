import axios, { Axios, AxiosResponse } from 'axios';
import { AUDIOSCROBBLER_API_URL } from '../../constants';

export const lastfmAPI = axios.create({
    baseURL: AUDIOSCROBBLER_API_URL,
    params: {
        format: 'json',
    },
});

export async function lfmGet(params: Record<string, any>, retries: number = 0) {
    const response = await lastfmAPI.get("", {params: params});
    if (response.data.error) {
        const errorNumber: number = response.data.error;
        console.debug(JSON.stringify(response.data) + " " + params.method)
        console.debug("errored on " + params.artist);
        switch (errorNumber) {
            case 6:
                throw new Error("query not found");
            default:
                break;
        }
        if (retries < 5) {
            return lfmGet(params, retries + 1);
        }
    }
    return response;
}
// taken from https://github.com/mold/explr/blob/master/src/assets/js/api/lastfm.js and extended
let keys = [
  // https://gitlab.gnome.org/World/lollypop/blob/master/lollypop/lastfm.py
  "7a9619a850ccf7377c46cf233c51e3c6",
  
  // https://github.com/ampache/ampache/issues/1694
  "13893ba930c63b1b2cbe21441dc7f550",

  // https://www.reddit.com/r/lastfm/comments/3okkij/cant_create_lastfm_api_key/
  "4cb074e4b8ec4ee9ad3eb37d6f7eb240",

  // https://www.w3resource.com/API/last.fm/tutorial.php
  "4a9f5581a9cdf20a699f540ac52a95c9",

  // https://www.reddit.com/r/lastfm/comments/3l3cae/cant_get_a_lastfm_api_key/
  "57ee3318536b23ee81d6b27e36997cde",

  // original explr api key
  "865b1653dbe200905a5b75d9d839467a",

  // https://www.w3resource.com/API/last.fm/example.html
  "68b2125fd8f8fbadeb2195e551f32bc4",

  // https://rstudio-pubs-static.s3.amazonaws.com/236264_81312ba4d795474c8641dd0e2af83cba.html
  "1ba315d4d1673bbf88aed473f1917306",

  //https://github.com/felhag/lastfm-stats-web/blob/master/projects/lastfm-stats/src/app/scrobble-retriever.service.ts
  "2c223bda2fe846bd5c24f9a5d2da834e",

  //openscrobbler
  "0aa2e9944f3e38f7a64358dde668ff63"
];

// Rotating keys functionality, taken from https://github.com/mold/explr/blob/master/src/assets/js/api/lastfm.js
let keyIndex = 0;
let keyInfo: Record<string, any> = {};
keys.forEach(k => keyInfo[k] = { success: 0, fails: 0, total: 0 });
let currentKey = "";

function getKey() {
    let avgErrors = keys.reduce((avg, k, i, arr) => avg + keyInfo[k].fails / arr.length, 0);
        let bestKeys = keys.filter(k => keyInfo[k].fails <= avgErrors);
        bestKeys = bestKeys.length ? bestKeys : keys;
        let key = bestKeys[++keyIndex % bestKeys.length];
        return key;
}

function setKeyInfo (key: string, success: boolean) {
    keyInfo[key].total++;
    keyInfo[key].success += success ? 1 : 0;
    keyInfo[key].fails += success ? 0 : 1;
}

let errors: Record<string, number> = {};

function lastfmResponseErrorHandler(response: AxiosResponse<any, any>) {
    const errorNumber: number = response.data.error;
    console.log("error code " + response.data.error);
    if (!errors[errorNumber]) {
        errors[errorNumber] = 0;
    }
    errors[errorNumber]++;

    switch (errorNumber) {
        case 6:
            setKeyInfo(currentKey, true);
        default:
            setKeyInfo(currentKey, false);
    }
}

// Before request is sent, rotate and add API key to request
lastfmAPI.interceptors.request.use(function (config) {
    // Do something before request is sent
    currentKey = getKey();
    config.params["api_key"] = currentKey;
    return config;
}, function (error) {
    // Do something with request error
    console.info("✉️ request", error);
    return Promise.reject(error);
});

// After response is received, intercept for error handling and setting key failures
lastfmAPI.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data.error) {
        lastfmResponseErrorHandler(response);
    } else {
        setKeyInfo(currentKey, true);
    }
    return response;
    }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    setKeyInfo(currentKey, false);
    console.info("✉️ response", error);
    return Promise.reject(error);
});