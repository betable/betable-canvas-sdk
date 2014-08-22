1. Make your game start at index.html
2. run CLIENT_ID=<Your Client ID> CLIENT_SECRET=<Your Client Secret> node server.js
3. Visit https://localhost:8888

    var data = {
            "paylines": [[0,0,0]]
          , "wager": wager
        }
      , betFunc = Betable.unbackedBet

    if (!Betable.demoMode) {
        data.economy = 'real'
        data.currency = 'GBP'
        betFunc = Betable.bet
    }
    bet_history.push(bet)
    betFunc.call(Betable, '<Game ID>' , data , <Callback>)

   
