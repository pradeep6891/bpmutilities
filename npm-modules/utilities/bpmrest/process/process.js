var config = require('./process.json');
var common = require('../../common');

function startProcess(pathPrefix,bpdId,processAppId,options) {
    var httpOptions = {
        rejectUnAuthorized: false,
        method : 'POST',
        path: pathPrefix + config.startProcess.replace("{bpdId}",bpdId).replace("{processAppId}",processAppId)
    }

    httpOptions = Object.assign(httpOptions,options);

    return common.invokeHttps(httpOptions)
        .then((response) => {
            return response;

        })
}

function currentState(pathPrefix,instanceId,options) {
    var httpOptions = {
        rejectUnAuthorized: false,
        method : 'GET',
        path: pathPrefix + config.currentState.replace("{instanceId}",instanceId)
    }

    httpOptions = Object.assign(httpOptions,options);

    return common.invokeHttps(httpOptions)
        .then((response) => {
            return response;

        })

}

module.exports = {
    startProcess : startProcess,
    currentState : currentState
}