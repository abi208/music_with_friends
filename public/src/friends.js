document.addEventListener('DOMContentLoaded', (event) => {
  const friendProfileSource = document.getElementById('friend-profile-template').innerHTML;
  const friendProfileTemplate = Handlebars.compile(friendProfileSource);
  const friendProfilePlaceholder = document.getElementById('friend-profile');

  const friendPlaylistSource = document.getElementById('friend-playlist-template').innerHTML;
  const friendPlaylistTemplate = Handlebars.compile(friendPlaylistSource);
  const friendPlaylistPlaceholder = document.getElementById('friend-playlist');

  // Function to get the access token from URL hash parameters
  function getAccessToken() {
      const params = new URLSearchParams(window.location.hash.substring(1));
      return params.get('access_token');
  }

  document.getElementById('getFriendData').addEventListener('click', async () => {
      const friendID = document.getElementById('friendID').value;
      const url = `https://api.spotify.com/v1/users/${friendID}`;
      const url_2 = `https://api.spotify.com/v1/users/${friendID}/playlists`
      const access_token = getAccessToken();

      if (!access_token) {
          console.error('Access token is missing');
          return;
      }

      try {
          const response = await fetch(url, {
              headers: {
                  'Authorization': `Bearer ${access_token}`
              }
          });

          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }

          const friendResponse = await response.json();
          friendProfilePlaceholder.innerHTML = friendProfileTemplate(friendResponse);
      } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
      }

      try {
        const playlistResponse = await fetch(url_2, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });

        if (!playlistResponse.ok) {
            throw new Error('Network response was not ok ' + playlistResponse.statusText);
        }

        const friendPlaylistResponse = await playlistResponse.json();
        friendPlaylistPlaceholder.innerHTML = friendPlaylistTemplate(friendPlaylistResponse);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
  });

  document.getElementById('toHomePage').addEventListener('click', () => {
      window.location.href = '/index.html';
  });
});