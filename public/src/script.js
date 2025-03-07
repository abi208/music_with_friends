(function() {
  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */

  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');

  var userPlayerSource = document.getElementById('user-player-template').innerHTML,
      userPlayerTemplate = Handlebars.compile(userPlayerSource),
      userPlayerPlaceholder = document.getElementById('user-player');

  var userPlaylistSource = document.getElementById('user-playlist-template').innerHTML,
      userPlaylistTemplate = Handlebars.compile(userPlaylistSource),
      userPlaylistPlaceholder = document.getElementById('user-playlist');

  var oauthSource = document.getElementById('oauth-template').innerHTML,
      oauthTemplate = Handlebars.compile(oauthSource),
      oauthPlaceholder = document.getElementById('oauth');

  // Define the custom join helper
  Handlebars.registerHelper('join', function(items, separator) {
    return items.map(item => item.name).join(separator);
  });

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });

      $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
          userProfilePlaceholder.innerHTML = userProfileTemplate(response);

          $('#login').hide();
          $('#loggedin').show();

          // API request to get player information
          $.ajax({
            url: 'https://api.spotify.com/v1/me/player',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(playerResponse) {
              userPlayerPlaceholder.innerHTML = userPlayerTemplate(playerResponse);
            },
            error: function() {
              console.log('Failed to fetch player information.');
            }
          });

          // API request to get profile information
          $.ajax({
            url: 'https://api.spotify.com/v1/me/playlists',
            headers: {
              'Authorization': 'Bearer ' + access_token
            },
            success: function(playlistResponse) {
              userPlaylistPlaceholder.innerHTML = userPlaylistTemplate(playlistResponse);
            },
            error: function() {
              console.log('Failed to fetch playlist information.');
            }
          });
        },
        error: function() {
          console.log('Failed to fetch user profile.');
        }
      });
    } else {
      // render initial screen
      $('#login').show();
      $('#loggedin').hide();
    }

    document.getElementById('obtain-new-token').addEventListener('click', function() {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function(data) {
        access_token = data.access_token;
        oauthPlaceholder.innerHTML = oauthTemplate({
          access_token: access_token,
          refresh_token: refresh_token
        });
      });
    }, false);

    document.getElementById('toFriendsPage').addEventListener('click', function() {
      window.location.href = '/friends.html#access_token=' + access_token;
    });
  }
})();
