var common = require('../common');
var config = require('./bpmoncloud.json')
var bpmUser = require('./BPMUser.json')

function getUser(email,options) {
    var httpOptions = {
        rejectUnAuthorized: false,
        path: config.userExists.replace("{userName}",email)
    }

    httpOptions = Object.assign(httpOptions,options);

    return common.invokeHttps(httpOptions).then((response) => {
        if (response.statusCode == 200)
            return JSON.parse(response.data);
        else
            return null;
    }).catch((err) => {
        return err;
    })
}

function deleteuser(email,options) {
    var httpOptions = {
        rejectUnAuthorized: false,
        method : 'DELETE',
        path: config.deleteUser.replace("{userName}",email)
    }

    httpOptions = Object.assign(httpOptions,options);

    return common.invokeHttps(httpOptions).then((response) => {
        if (response.statusCode == 200)
            return true;
        else
            return false;
    }).catch((err) => {
        return err;
    })
}

function addUser(user,options) {
    var httpOptions = {
        rejectUnAuthorized: false,
        method : 'PUT',
        path: config.addUser
    }

    httpOptions = Object.assign(httpOptions,options);

    bpmUser = Object.assign(bpmUser,user);

    return common.invokeHttps(httpOptions,JSON.stringify(bpmUser)).then((response) => {
        if (response.statusCode == 200) {
            user.addStatus = true;
            return user;
        }
        else if (response.statusCode == 400) {
            user.addStatus = false;
        }
        else {
            user.exists = true;
        }

        return user;
    }).catch((err) => {
        return err;
    })
}

module.exports = {
    getUser : getUser,
    addUser : addUser,
    deleteuser:deleteuser
}