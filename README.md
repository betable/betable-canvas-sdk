

#Intro

This is an SDK that allows you to build games that are Betable Canvas compliant, meaning that they can be added the to Betable Games library and be played at https://betable.com

#Starting from scratch

* Download the SDK :inbox_tray:
* Create a folder to house your game
* Create an index.html file in your game folder
* Make sure to set your redirect URI to "https://localhost:8888/authorize"
* Add this to your index.html

```HTML
    <script src="/betable.js"></script>
    <script>
        var betable = Betable("<YOUR CLIENT ID>")
        if (betable.authorized) {
            //Start the game
        } else {
            betable.authorize("https://localhost:8888/authorize")
        }
    </script>
```

* Create your manifest.js

```JS
    module.exports = {
        ClientID = "<YOUR CLIENT ID>"
      , ClientSecret = "<YOUR CLIENT SECRET>"
    }
```

* Start the test server

```bash
    node /path/to/SDK/server.js
```

* Go to `http://localhost:8888`

Boom you have a canvas ready betable game.

#Running on your own server

**It is worth noting that because you can only load static files and XHRs and off domain scripts are not allowed, there is not a large reason to run your own server** If you require xhr, please contact us at [developers@betable.com](mailto:developers@betable.com?Subject=Requesting%20permission%20for%20offsite%20XHR%20and%20Script%20loading%20on%20betable%20canvas&Body=State%20which%20calls%20you%20need%20and%20why...)

The only difference from above and running your own server is that you can set your redirect URI to whatever you want and then you will have to handle the oauth flow on your server. When you have completed the oauth flow, you need to redirect to your index page and pass in the access token like so 

    http://yourdomain.com/your/index/path.html?access_token=<access_token>

Your authorization endpoint will be called one of 2 ways. Either with a `code` or a `client_user_id`. If its called with a `code`, then you need to make a request for an access_token. You can find out how to do that [here](https://developers.betable.com/docs/api/#authentication). If you receive a `client_user_id` then you need to request an unbacked token (a demo token). You can find out how to do that [here](https://developers.betable.com/docs/api/features/#unbacked-bets).


#Demo Mode

All apps need to support demo mode, but besides clearly displaying that the player is in demo mode, you do not need to make many considerations for it. Simply put, in demo mode, the user is not making real bets, and all of their money is coming out of a demo wallet.

##Things to know about demo mode

* Calls to `bet` and `creditBet` will work the same as in non demo mode.
* Calls to `wallet` will seem to work the same but will actually be referencing a non existent demo wallet, it will be debited and credited correctly when `bet` and `creditBet` are called.
* Calls to `account` in demo mode will return a null user.
* The token you have in demo mode will not allow you to make a real bet even if you tried.
* You must have a button in demo mode that allows the user to play in non-demo mode.

#API Calls

####`bet(gameID, data, callback, errback)`

This call allows you to make a bet on a game. The `gameID` is the game you wish to make a bet on. The `data` is a javascript object containing all the data about the bet such as wager and paylines, (you can read more about this data [here](https://developers.betable.com/docs/api/#post-gamesgameidbet)). The `callback` is a function that will be called when the bet is completed, it will receive a js object that contains the data of the bet, the format of that object can be seen [here](https://developers.betable.com/docs/api/#post-gamesgameidbet). The `errback` is a function that will be called if the bet could not be completed successfuly. It takes an javascript object that represents the error.

####`creditBet(gameID, creditGameID, data, callback, errback)`

This call allows you to make a bet on a game. The `gameID` is the game that the credits were recieved on. The `creditGameID` is the game that the credits will be bet on. The `data` is a javascript object containing all the data about the bet such as wager and paylines, (you can read more about this data [here](https://developers.betable.com/docs/api/#post-gamesgameidbet)). The `callback` is a function that will be called when the bet is completed, it will receive a js object that contains the data of the bet, the format of that object can be seen [here](https://developers.betable.com/docs/api/#post-gamesgameidbet). The `errback` is a function that will be called if the bet could not be completed successfuly. It takes an javascript object that represents the error.

####`unbackedBet(gameID, data, callback, errback)`

This call allows you to make a bet on a game that will not result in any exchange of money, you can user this when you wish to represent a bet in your game that the user has not committed to spending any money on. The `gameID` is the game you wish to make a bet on. The `data` is a javascript object containing all the data about the bet such as wager and paylines, (you can read more about this data [here](https://developers.betable.com/docs/api/#post-gamesgameidbet)). The `callback` is a function that will be called when the bet is completed, it will receive a js object that contains the data of the bet, the format of that object can be seen [here](https://developers.betable.com/docs/api/#post-gamesgameidbet). The `errback` is a function that will be called if the bet could not be completed successfuly. It takes an javascript object that represents the error.

####`unbackedCreditBet(gameID, creditGameID, data, callback, errback)`

This call allows you to make a bet on a game that will not result in any exchange of money, you can user this when you wish to represent a bet in your game that the user has not committed to spending any money on. The `gameID` is the game that the credits were recieved on. The `creditGameID` is the game that the credits will be bet on. The `data` is a javascript object containing all the data about the bet such as wager and paylines, (you can read more about this data [here](https://developers.betable.com/docs/api/#post-gamesgameidbet)). The `callback` is a function that will be called when the bet is completed, it will receive a js object that contains the data of the bet, the format of that object can be seen [here](https://developers.betable.com/docs/api/#post-gamesgameidbet). The `errback` is a function that will be called if the bet could not be completed successfuly. It takes an javascript object that represents the error.

#Chrome Calls
