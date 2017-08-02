var config = require('./bluepages.json');
var common = require('../common')

function getEmail(notesId) {
    var noteIdParts = notesId.split("/");
    var name = "CN=" + noteIdParts[0];
    var location = "OU=" + noteIdParts[1];
    var country = "O=" + noteIdParts[2];
    var modNotesId = encodeURIComponent(name + "/" + location + "/" + country);
    var httpOptions = {
        hostname: config.hostname,
        rejectUnAuthorized: false,
        path: config.notesIdSearch.replace("{notesemail}", modNotesId)
    }

    return common.invokeHttps(httpOptions).then((response) => {
        var data = {};
        var responseData = JSON.parse(response.data);
        if (responseData.search.return.count == 1) {
            data = processBluepagesData(responseData);
        }

        return data;
    })
    .catch ((err) => {
        return err;
    });
}

function getBluePagesData(email) {
    var httpOptions = {
        hostname: config.hostname,
        rejectUnAuthorized: false,
        path: config.emailSearch.replace("{email}", email)
    }

    return common.invokeHttps(httpOptions).then((response) => {
        var data = null;
        var responseData = JSON.parse(response.data);
        if (responseData.search.return.count == 1) {
            data = processBluepagesData(responseData);
        }

        return data;
    })
        .catch ((err) => {
            return err;
        });
}

function getDataByIbmserialnumber(ibmserialnumber) {
    var httpOptions = {
        hostname: config.hostname,
        rejectUnAuthorized: false,
        path: config.ibmserialnumberSearch.replace("{ibmserialnumber}", ibmserialnumber)
    }

    return common.invokeHttps(httpOptions).then((response) => {
        var data = null;
        var responseData = JSON.parse(response.data);
        if (responseData.search.return.count == 1) {
            data = processBluepagesData(responseData);
        }

        return data;
    })
        .catch ((err) => {
            return err;
        });
}

function processBluepagesData(bluepagesData) {
    var data = {};
    for (var i = 0; i < bluepagesData.search.entry[0].attribute.length; i++) {
        var attribute = bluepagesData.search.entry[0].attribute[i];
        data[attribute.name] = attribute.value.length == 1 ? attribute.value[0] : attribute.value;
    }
    return data;
}

module.exports = {
    getEmail:getEmail,
    getBluePagesData:getBluePagesData,
    getDataByIbmserialnumber:getDataByIbmserialnumber
}

getBluePagesData("xyz@us.ibm.com").then((data) => {
    console.log(data);

})