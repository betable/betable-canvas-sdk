#Dice Game

We are going to configure a simple dice game with this rule: Roll a 6 and win 3.5 times your money, Roll a 4 and above and win your money back, roll anything else and you lose.

#Setup

First go to https://developers.betable.com. If you are not signed in, sign in with your developer credentials. If you are not signed up as a developer for betable, send an email to [developers@betable.com](mailto:developers@betable.com?Subject=Request%20for%20a%20Betable%20XHR%20developer%20account%20&Body=Tell%20us%20a%20little%20bit%20about%20yourself%20and%20why%20you%20want%20to%20become%20a%20betable%20developer).

##Creating the game

When you are logged in you should see a big button in the top left that says "Create a new game"

![](https://github.com/betable/betable-canvas-sdk/blob/master/example/images/StepA.png)

##Naming the game

Next we are going to name the game. For this example name the game Dice Game.

![](https://github.com/betable/betable-canvas-sdk/blob/master/example/images/StepB.png)

##Choosing the game type

Now we have to select the kind of game we want, this will dictate how the math on the backend is run and how data is returned to you about the bet. For the purposes of simulating a single dice roll in this example we are going to use a paytable.

![](https://github.com/betable/betable-canvas-sdk/blob/master/example/images/StepC.png)

##Setting up the pay table

Now we have to set the outcomes of the pay table. Since we are simulating a dice we want 6 outcomes (1, 2, 3, 4, 5, and 6 obviously). Each outcome has a 1/6 probability of rolling so we will set the probability percentage to 16.6667, now because the decimal system has an issue with 3rds and for the math to work we need to add up to exactly 100% we are going to set 1 and 2 to a probability of 16.666, which will make it have a very very slightly less chance of rolling, but overall should have very little impact on the game.

![](https://github.com/betable/betable-canvas-sdk/blob/master/example/images/StepD.png)

##Setting the redirect URI

Once that is set you will continue through screens until you get to a page that asks for your redirect URI, to make the game work with the test server simply set the redirect URI to be `https://localhost:888/api/authorize`. Once that is set you will get your game ID, client ID, and client secret. You will need these later, but they can always be found by selecting your game from the games sidebar at https://developers.betable.com.

![](https://github.com/betable/betable-canvas-sdk/blob/master/example/images/StepE.png)


