// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce";

const clientId = "847b250e307d4d4897aea9a421742d17"; 
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    redirectToAuthCodeFlow(clientId);
} else {
    const accessToken = await getAccessToken(clientId, code);
    const profile = await fetchProfile(accessToken);
    const playback = await fetchPlaybackState(accessToken);
    populateProfileUI(profile);
    populatePlaybackUI(playback);
}

// Making HTTP requests to the API endpoint

// Fetching Profile Data
async function fetchProfile(code: string): Promise<UserProfile> {
        const result = await fetch("https://api.spotify.com/v1/me", {
                method: "GET", headers: { Authorization: `Bearer ${code}` }
        });

        return await result.json();
}

async function fetchPlaybackState(code: string): Promise<UserPlayback> {
    const result = await fetch("https://api.spotify.com/v1/me/player", {
        method: "GET", headers: { Authorization: `Bearer ${code}` }
    });

    return await result.json();
}

// Populate page with datas

// Populating Profile Data
function populateProfileUI(profile: UserProfile) {
    document.getElementById("displayName")!.innerText = profile.display_name;
    document.getElementById("avatar")!.setAttribute("src", profile.images[0].url)
    document.getElementById("id")!.innerText = profile.id;
    document.getElementById("email")!.innerText = profile.email;
    document.getElementById("uri")!.innerText = profile.uri;
    document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
    document.getElementById("url")!.innerText = profile.href;
    document.getElementById("url")!.setAttribute("href", profile.href);
    document.getElementById("imgUrl")!.innerText = profile.images[0].url;
    document.getElementById("followers")!.innerText = profile.followers.total;
}

// Populating Playback Data
function populatePlaybackUI(playback: UserPlayback) {
    document.getElementById("name")!.innerText = playback.item.name;
    document.getElementById("artists")!.innerText = playback.item.artists.map(artist => artist.name).join(", ");
    document.getElementById("currentlyPlayingType")!.innerText = playback.currently_playing_type;
    document.getElementById("progressMs")!.innerText = playback.progress_ms;
}