var config = require('./organization.json');
var common = require('../../common')

function modifyGroup(pathPrefix,groupName,userName,action,returnParts,options) {
    var httpOptions = {
        rejectUnAuthorized: false,
        method : 'PUT',
        path: pathPrefix + config.updateGroupUser.replace("{groupName}",groupName)
            .replace("{userName}",userName)
            .replace("{action}",action)
            .replace("{returnParts}",returnParts)
    }

    httpOptions = Object.assign(httpOptions,options);

    return common.invokeHttps(httpOptions).then((response) => {
        return response;
    })
}

function updatePreference(pathPrefix,userId,preferenceKey,value,options) {
    var httpOptions = {
        rejectUnAuthorized: false,
        method : 'PUT',
        path: pathPrefix + config.updatePreferences.replace("{userId}",userId)
            .replace("{preferenceKey}",preferenceKey)
            .replace("{value}",value)
    }

    httpOptions = Object.assign(httpOptions,options);

    return common.invokeHttps(httpOptions).then((response) => {
        return response;
    })
}

/*function getAllUserList(pathPrefix,options) {
    var httpOptions = {
        rejectUnAuthorized: false,
        method : 'GET',
        path: pathPrefix + config.getAllUsers
            
    }
    httpOptions = Object.assign(httpOptions,options);
    return common.invokeHttps(httpOptions).then((response) => {
        return response;
    })
}*/
function getAllUserList(pathPrefix,options) {
    var httpOptions = {
        rejectUnAuthorized: false,
        method : 'GET',
        path: pathPrefix + config.getAllUsers
    }
    
    httpOptions = Object.assign(httpOptions,options);
    return common.invokeHttps(httpOptions).then((response) => {
        return response;
    })
} 
/*var httpOptions = {
    auth: `"onboarding-rest-user.fid@t055":"DPTVNeKqbpHijcgXXVCZMgUpgRs7EmkvEZCBaYYv"`,
    hostname: "saphec.bpm.ibmcloud.com"
}
console.log(getAllUserList("/bpm/dev",httpOptions));
*/
module.exports = {
    modifyGroup : modifyGroup,
    updatePreference:updatePreference,
    getAllUserList:getAllUserList
}