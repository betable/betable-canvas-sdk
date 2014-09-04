

#Intro

This is an SDK that allows you to build games that are Betable Canvas compliant, meaning that they can be added the to Betable Games library and be played at https://betable.com

#Starting from scratch

Download the SDK

Create a folder to house your game

Create an index.html file in your game folder

add this to your index.html

    <script src="/betable.js"></script>
    <script>
        var betable = Betable("<YOUR CLIENT ID>")
        if (betable.authorized) {
            //Start the game
        } else {
            betable.authorize("<YOUR REDIRECT URI>")
        }
    </script>

Create your manifest.js

    module.exports = {
        ClientID = "<YOUR CLIENT ID>"
      , ClientSecret = "<YOUR CLIENT SECRET>"
    }

Start the test server
    node /path/to/SDK/server.js

Go to http://localhost:8888

Boom you have a canvas ready betable game.

