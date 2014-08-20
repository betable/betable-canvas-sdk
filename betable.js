;
/*
 * Copyright (c) 2012, Betable Limited
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Betable Limited nor the names of its contributors
 *       may be used to endorse or promote products derived from this software
 *       without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL BETABLE LIMITED BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var Mode = {
    FullScreen: 'fullscreen'
  , StandAlone: 'standalone'
  , Canvas: 'canvas'
}

function Betable(clientID) {
    this.clientID = clientID
    this.mode = Mode.StandAlone
    this.setupWithLocation(window.location)
    this.endpoint = Betable.betableAPIURL
}

Betable.betableURL = 'https://betable.com'
Betable.betableAPIURL = "https://api.betable.com/1.0"

Betable.prototype.setupWithLocation = function Betable_setupWithLocation(loc) {
    var parts = loc.search.substr(1).split('&')
      , search = {}
      , part
      , keyvalue
      , key
      , value
    for (var i=0,l=parts.length; i < l; i++) {
        part = parts[i]
        keyvalue = part.split('=')
        key = keyvalue[0]
        value = keyvalue[1]
        search[key]=decodeURIComponent(value)
    }
    this.accessToken = search.accessToken
    this.demoMode = !!parseInt(search.demoMode)
    if (!!parseInt(search.fullscreen)) {
        this.mode = Mode.FullScreen
    } else if (!!parseInt(search.canvas)) {
        this.mode = Mode.Canvas
    }
    this.manifest = search.manifest
}

Betable.prototype.url = function Betable_url(path, params) {
    params = params || {}
    params.manifest = this.manifest
    var paramList = []
    for (var key in params) {
        paramList.push(key +'='+ encodeURIComponent(params[key]))
    }
    return Betable.betableURL + '/' + path + '?' + paramList.join('&')
}

Betable.prototype.popup = function Betable_popup(url) {
    var iframe = "<iframe style='position: fixed; top:10px; left:10px; right:10px; bottom:10px; z-index:10000;' name='betable-popup' class='betable-popup' src="+url+"></iframe>"
      , closeButton = "<div style='position:fixed; width:10px; height:10px; top:5px; right:5px; color:#CB3332' onclick='__betablePopupClose' style = class='betable-close'>×</div>"
      , popup = this.popup =  document.createElement("div")
    popup.innerHTML = iframe + closeButton
    document.getElementsByTagName('body')[0].appendChild(popup);
    window.__betablePopupClose = function () {
        window.__betablePopupClose = null
        popup.parentNode.removeChild(popup);
    }
}

Betable.prototype.authorize = function Betable_authorize(redirectURI, callback) {
    if(this.mode != Mode.StandAlone) {
        alert("Error: You can only call authorize in Stand Alone mode")
    } else {
        window.location = this.url('track', {
            action: 'authorize'
          , client_id: this.clientID
          , redirect_uri: redirectURI
          , response_type: 'code'
        })
        //this.popup(this.url('ext/deposit/?client_id='+this.clientID+'redirect_uri='+redirectURI+''))
    }
}

Betable.prototype.showWallet = function Betable_showWallet() {
    if(this.mode != Mode.StandAlone) {
        window.location = this.url('wallet')
    }
}
Betable.prototype.playForReal = function Betable_playForReal() {
    if(this.mode != Mode.StandAlone) {
        window.location = this.url('wallet')
    }
}
Betable.prototype.showDeposit = function Betable_showDeposit() {
    if(this.mode != Mode.StandAlone) {
        window.location = this.url('wallet/deposit')
    } 
}
Betable.prototype.showRedeem = function Betable_showRedeem(promotion) {
    //TODO Support this
}
Betable.prototype.showWithdraw= function Betable_showWithdraw() {
    if(this.mode != Mode.StandAlone) {
        window.location = this.url('wallet/withdraw')
    }
}
Betable.prototype.showSupport = function Betable_showSupport() {
    //TODO Support this
}
Betable.prototype.goHome = function Betable_goHome() {
    if(this.mode != Mode.StandAlone) {
        window.location = this.url('')
    }
}

Betable.prototype.account = function Betable_account(callback, errback) {
    this.xhr('GET', '/account', void 0, callback, errback)
}

Betable.prototype.bet = function Betable_bet(gameID, data, callback, errback) {
    this.xhr(
        'POST'
      , '/games/' + gameID + '/bet'
      , data
      , callback
      , errback
      , true
    )
}

Betable.prototype.betCredits = function Betable_betCredits(gameID, creditGameID, data, callback, errback) {
    this.bet(gameID +'/'+ creditGameID, data, callback, errback)
}

Betable.prototype.unbackedBet = function Betable_unbackedBet(gameID, data, callback, errback) {
    this.xhr(
        'POST'
      , '/games/' + gameID + '/unbacked-bet'
      , data
      , callback
      , errback
    )
}

Betable.prototype.unbackedBetCredits = function Betable_unbackedBetCredits(gameID, creditGameID, options, callback, errback) {
    this.unbackedBet(gameID +'/'+ creditGameID, data, callback, errback)
}

Betable.prototype.wallet = function Betable_wallet(games, callback, errback) {
    var data = {}
    games = games || []
    if (!(games instanceof Array)) {
        games = [games]
    }
    data.games = games.join(',')
    this.xhr('GET', '/account/wallet', data, callback, errback)
}

Betable.prototype.xhr = function Betable_xhr(
    method
  , path
  , body
  , callback
  , errback
  , includeContentType
) {
    this._xhr(this.endpoint, method, path + '?access_token=' + this.accessToken, body, callback, errback, includeContentType)
}

Betable.prototype._xhr = function Betable__xhr(
    endpoint
  , method
  , path
  , body
  , callback
  , errback
  , includeContentType
) {
    var xhr = function() {
        try { return new XDomainRequest() } catch (e) {}
        try { return new XMLHttpRequest() } catch (e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.6.0') } catch (e) {}
        try { return new ActiveXObject('Msxml2.XMLHTTP.3.0') } catch (e) {}
        try { return new ActiveXObject('Microsoft.XMLHTTP') } catch (e) {}
        throw new Error('no XMLHttpRequest')
    }()
    var path = endpoint + path
      , is_xdr = typeof XDomainRequest === 'function'
      , xhr_args = [method, path]

    if ('GET' === method && body) {
        Object.keys(body).forEach(function(key) {
            xhr_args[1] += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(body[key])
        })
    }

    if(!is_xdr)            xhr_args.push(true)
    if(includeContentType) xhr_args[1] = xhr_args[1] + '&content_type=application/json'

    xhr.open.apply(xhr, xhr_args)

    if(is_xdr) {
        xhr.onload = function() { callback(JSON.parse(xhr.responseText)) }
        xhr.onerror = xhr.ontimeout = function() { errback(JSON.parse(xhr.responseText)) }
        xhr.onprogress = function() {}
    } else {
        xhr.onreadystatechange = function Betable_account_onreadystatechange() {
            if (4 === xhr.readyState) {
                var response = JSON.parse(xhr.responseText)
                if (400 > xhr.status) {
                    callback(response,xhr)
                } else {
                    errback(response)
                }
            }
        }
    }
    if ('POST' === method && body) {
        if(!is_xdr) xhr.setRequestHeader('Content-Type', 'application/json; charset=utf8')
        xhr.send(JSON.stringify(body))
    } else {
        xhr.send()
    }
}
;
