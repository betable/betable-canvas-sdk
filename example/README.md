#Creating a sample betable canvas-ready app

To make a betable game you will need a betable developer account. If you do not have a betable developer account email us at [developers@betable.com](mailto:developers@betable.com?Subject=Request%20for%20a%20Betable%20XHR%20developer%20account%20&Body=Tell%20us%20a%20little%20bit%20about%20yourself%20and%20why%20you%20want%20to%20become%20a%20betable%20developer) to request developer access.

##Step 1. Setting up your app on betable developers

We are going to configure a simple dice game with this rule. Roll a 4 and above and win your money back, roll a 6 and win 3.5 your money back, roll a 3 or below and lose. To do this you are going to create a new game at https://developers.betable.com and choose the paytable game configuration. Then you are going to set up 6 outcomes (one for each dice roll) each with a probability of approxamately 1/6 chance of happening (set 1 and 2 to 16.6666% and the rest to 16.6667% so that the probability is exactly 100%). For mulitpliers set 6 to 3.5, then set 4 and 5 to 1, set the rest to 0. For a walkthrough on setting up this game go [here](DICE_GAME_SETUP.md).

##Step 2. Setup the game

```
mkdir DiceGame
cd DiceGame
mkdir game
touch game/index.html
touch game/manifest.js

```

##Step 2. Download the SDK [:inbox_tray:](https://github.com/betable/betable-canvas-sdk/releases/download/0.1.0/release.zip)

Then unzip its contents to betable-canvas-sdk inside of the DiceGame folder

##Step 4. Write the Game

Add this to your index.html


```html

<html>
<head>
<script src=betable.js></script>
<script>
    window.onload = function onload() {
        window.betable = new Betable('<CLIENT ID FROM STEP 1>')
        if (!betable.authorized) {
            betable.authorize('https://localhost:8888/api/authorize')
        }

        if (betable.demoMode) {
            document.getElementById("demoMode").innerHTML = "You are playing in Demo Mode"
        }
        setDice('1')    
    }

    function bet() {
        var interval = setInterval(function () { setDice(String(Math.floor(Math.random()*6)+1)) }, 100)
        setResult()
        betable.bet('<GAME ID FROM STEP 1>', {currency: 'GBP', economy: 'sandbox', wager: '0.50'}, function (data) {
            clearInterval(interval)
            setDice(data.outcome)
            setResult(data.payout)
        }, function (data) {
            clearInterval(interval)
            alert("An error has occurred:"+data.description)
        })
    }
    function deposit() {
        betable.chrome('deposit')
    }

    DiceSides = {
        '1': '&#9856;'
      , '2': '&#9857;'
      , '3': '&#9858;'
      , '4': '&#9859;'
      , '5': '&#9860;'
      , '6': '&#9861;'
    }
    function setDice(result) {
        document.getElementById('dice').innerHTML = DiceSides[result]
    }
    function setResult(result) {
        var resString = ''
        if (result) {
            resString = "You Didn't Win"
            if (parseFloat(result)) {
                resString = "You won &pound;"+result
            }
        }
        document.getElementById('result').innerHTML = resString
    }
</script>
</head>
<body style="text-align:center">
    <div id="demoMode"></div>
    <div id="dice" style="font-size:100px"></div>
    <div id="result"></div>
    <button onclick="bet()" id="betButton">Bet 50p</button>
    <button onclick="deposit()" id="depositButton">Deposit</button>
    <div id="wallet"></div>
</body>
</html>

```

##Step 5. setup your manifest

Your manifest is how you setup all of your game configuration. For this game the only things we are going to configure are the client_id and client_secret.

```
module.exports = {
   client_id: "<CLIENT ID FROM STEP 1>"
 , client_secret: "<CLIENT SECRET FROM STEP 1>"
}
```

##Step 6. Run the test server

To do this first cd into the `game` directory and run `node ../betable-canvas-sdk/server.js`. You must run this command from the game directory.

Now go to https://localhost:8888 and enjoy your game. To activate your game in demo mode go to https://localhost:8888?demoMode=true


