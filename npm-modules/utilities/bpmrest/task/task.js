config = require('./task.json');
common = require('../../common');
querystring = require('querystring')



function finishTask(pathPrefix,taskId,options,variables) {
    var httpOptions = {
        rejectUnAuthorized: false,
        method : 'POST',
        path: pathPrefix + config.finishTask.replace("{taskId}",taskId),
        headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
        }
    }

    httpOptions = Object.assign(httpOptions,options);

    var dataObj = {
        params : JSON.stringify(variables)
    }

    var data = querystring.stringify(dataObj);

    return common.invokeHttps(httpOptions,data)
        .then((response) => {
            return response;

        })

}

module.exports = {
    finishTask : finishTask
}