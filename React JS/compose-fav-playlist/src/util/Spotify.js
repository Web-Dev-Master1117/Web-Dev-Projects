
const endpoint = 'https://accounts.spotify.com/authorize';
const clientId = '920af8a3451647d9ac6bdd8e30e42d7b';
const redirectURI = 'https://compose-fav-playlist.surge.sh';
const scope = 'user-read-private user-read-email playlist-modify-public';

const Spotify = {
    accessToken: '',
    requestAccessToken() {
        const url = `${endpoint}?client_id=${clientId}&response_type=token&redirect_uri=${redirectURI}&scope=${scope}`;
        window.location = url;
    },
    getAccessTokenFromURI() {
        let url = window.location.href;
        let token = url.match(/access_token=([^&]*)/);
        let expirationTime = url.match(/expires_in=([^&]*)/);
        if(token && expirationTime){
            token = token[1];
            expirationTime = expirationTime[1];
            //got an accessToken
            this.accessToken = token;
            /*
            window.setTimeout(() => this.accessToken = '', expirationTime * 1000);
            window.history.pushState('Access Token', null, '/');
            */
           let d = new Date();
           d.setTime(d.getTime() + ((Number(expirationTime)) * 1000) + 19800000 );
           let expires = 'expires='+d.toUTCString();
           document.cookie = 'access_token=' + this.accessToken + ';' + expires + ';path=/';
            return this.accessToken;
        }
        return;
    },

    getAccessTokenFromCookie() {
        let name = 'access_token';
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            this.accessToken = c.substring(name.length+1, c.length);
            return this.accessToken;
          }
        }
        return '';
    },
    
    async search(term) {
        const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                'Authorization': 'Bearer ' + this.accessToken
            }
        });
        if(response.ok){
            let tracksResponse = await response.json();
            tracksResponse = tracksResponse.tracks.items;
            if (!tracksResponse.length)
                return [];
            let tracks = tracksResponse.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                    image: track.album.images[2].url
                };
            });
            return tracks;
        }
        else return;
    },
    async savePlaylist(playlistName, trackURIs) {
        if(!playlistName || !trackURIs.length) {
            return ;
        }

        //getting user_id
        let endpoint = 'https://api.spotify.com/v1/me';
        const response = await fetch(endpoint, {headers: { 'Authorization': 'Bearer ' + this.accessToken }});
        const jsonResponse = await response.json();
        let userID = jsonResponse.uri.match(/user:(.*)/)[1];
        
        if(userID) {
            const playlistCreateUrl = `https://api.spotify.com/v1/users/${userID}/playlists`;
            let playlistNameResponse = await fetch(playlistCreateUrl, { 
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.accessToken,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: playlistName })
            });

            playlistNameResponse = await playlistNameResponse.json();
            let playlistID = playlistNameResponse.id;
            
            if(playlistID){
                const bodyData = JSON.stringify({uris: trackURIs});
                const addItemsToPlaylistUrl = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
                
                let newPlaylistResponse = await fetch(addItemsToPlaylistUrl, 
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + this.accessToken,
                            'Content-type': 'application/json',
                                },
                        body: bodyData 
                    });
                newPlaylistResponse = await newPlaylistResponse.json();
                return newPlaylistResponse.snapshot_id;
                }

        }
    }
}

export default Spotify;