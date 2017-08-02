utilities = require('@o2cil/utilities');
config = require('./config.json')
fs = require('fs');

var httpOptions = {
    auth: `${config.bpm.userName}:${config.bpm.password}`,
    hostname: config.bpm.host
}

function handleUser(mail) {
    return utilities.bluepages.getBluePagesData(mail)
        .then((data) => {
            var bpmCloudUser = {};
            bpmCloudUser.cn = data.callupname.split(",")[1].trim();
            bpmCloudUser.sn = data.callupname.split(",")[0].trim();
            bpmCloudUser.mail = data.preferredidentity;
            bpmCloudUser.accountAdmin = false;
            bpmCloudUser.developer = false;
            bpmCloudUser.tester = false;
            bpmCloudUser.endUser = true;
            bpmCloudUser.operator = false;
            bpmCloudUser.jobresponsibilities = data.jobresponsibilities;

            /*if (bpmCloudUser.mail.indexOf("Project Executive") >= 0) {
                bpmCloudUser.notValid = true;
                return Promise.reject(bpmCloudUser);
            }*/


            return utilities.bpmoncloud.getUser(bpmCloudUser.mail,httpOptions).then((user) => {
                    return function () {
                        if (user == null) {
                            bpmCloudUser.exists = false;
                        }
                        else {
                            bpmCloudUser.exists = true;
                        }
                        return bpmCloudUser;
                    }();

            });
        }).then((user) => {
            if (!user.exists) {

                return utilities.bpmoncloud.addUser(user,httpOptions).then((user) => {
                    return user;

                })
            }
            else {
                return user;
            }
        }).then((user) => {
            return utilities.organization.modifyGroup("/bpm/run","MCABRequesterGroup",user.mail,"addMember","all",httpOptions).then((response) => {
                if (response.statusCode == 200) {
                    user.addedToGroup = true;
                }
                else {
                  user.addedToGroup = false;
                }
                console.log("Done processing " + user.mail + " statusCode: " + response.statusCode + " statusMessage:" + response.statusMessage);
                return user;
            })
        }).
        catch((err) => {
            return err;
        })
}


//var pelist = fs.readFileSync("/$user/emaillist.txt", "utf-8").split(/\r?\n/);   //changed from \n to the regex /\r?\n/ so it would work for Cindy on Windows
//var pelist = fs.readFileSync("./emaillist.txt", "utf-8").split(/\r?\n/);   //changed from \n to the regex /\r?\n/ so it would work for Cindy on Windows
//console.log(pelist);

function UpdateBluepagesmanagerAttribute(mail) {
    console.log("Process started for:"+mail);
    return utilities.bluepages.getBluePagesData(mail)
    .then((data) => {

           var managerId= data.managerserialnumber;
           return managerId;
    }).then((ibmserialnumber) => {
       
       // console.log("manager serail id: "+ibmserialnumber)
        return utilities.bluepages.getDataByIbmserialnumber(ibmserialnumber)
        .then((data)=>{
            var emailId="";
            /*if(data!=null  && data.mail!=null && data.mail.length>0){
                //emailId=data.mail[0];
                emailId=data.mail;
            }*/
            if(data!=null  && data.preferredidentity!=null){
                
                emailId=data.preferredidentity;
            }
            
           //  console.log("found email Id for manager:"+emailId);
            return emailId;
        } )
    }).then((manageremailId)=>{
        var emailId=mail;
        var manageremailId=manageremailId;
        console.log("email id: "+emailId);
        console.log("Manager mail Id:"+manageremailId);
        return utilities.organization.updatePreference(config.bpm.suffix,emailId,"bluepagesmanager",manageremailId,httpOptions).then((response) => {
               
                if (response.statusCode == 200) {
                    console.log("Update successfull for :"+mail);
                  //  user.addedToGroup = true;
                }
               // console.log("Done processing " + user.mail);
                return mail;
            })
        
    }).catch((err) => {
        console.log("Update not successfull for :"+mail+err);
            return err;
       })
}
/*var pelist = fs.readFileSync("/Users/Deepu/emaillist.txt", "utf-8").split("\n");


pelist.pop();
console.log(pelist);


utilities.common.executeInSerial(pelist, handleUser).then((data) => {
    fs.writeFileSync("./peemails.json",JSON.stringify(data));
})
    .catch((err) => {
        console.log("ERROR: " + err);
    })
*/
/*utilities.common.executeInSerial(pelist, handleUser).then((data) => {
    fs.writeFileSync("/Users/naveen/Downloads/peemails.json",JSON.stringify(data));
})
    .catch((err) => {
        console.log(err);
    })*/



/*function getAllUserList(pathPrefix) {
    var httpOptions1 = {
        rejectUnAuthorized: false,
        method : 'GET',
        path: pathPrefix + "/rest/bpm/wle/v1/users?includeTaskExperts=false&sort=true&includeInternalMemberships=false&refreshUser=false&parts=none"
    }
    
    httpOptions = Object.assign(httpOptions1,httpOptions);
    return common.invokeHttps(httpOptions).then((response) => {
        return response;
    })
} */
//console.log(utilities.organization.getAllUserList("bpm/dev",httpOptions));


function RetrieveUsersandUpdateBluepagesmanager() {
    console.log("Process to RetrieveUsersandUpdateBluepagesmanager and update started in '"+config.bpm.suffix+"' !!");
    return utilities.organization.getAllUserList(config.bpm.suffix,httpOptions)
    .then((data) => {
        console.log(data)
        var dataJson=JSON.parse(data.data)
        var users=dataJson.data.users;
        var usersList=[];
        for(var i=0;i<users.length;i++){
            usersList[i]=users[i].userName;
        }
       // console.log(dataJson)
        return usersList;
    }).then((userList) => {
       
        //console.log("manager serail id: "+ibmserialnumber)
        return utilities.common.executeInSerial(userList, UpdateBluepagesmanagerAttribute).then((data) => {
            console.log("bluepagesmanager attribute update completed for all users.");
        })
        
    }).catch((err) => {
        console.log("Update not successfull:"+err);
            return err;
       })
}
 
//RetrieveUsersandUpdateBluepagesmanager();
UpdateBluepagesmanagerAttribute("NavaRama@ae.ibm.com");
//handleUser("ASHISHSH@ae.ibm.com")