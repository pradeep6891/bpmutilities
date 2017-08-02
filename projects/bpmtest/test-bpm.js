var utilities = require('@o2cil/utilities');
var config = require('./config.json');
var assert = require('assert');
var data = require('./data');

var httpOptions = {
    auth: `${config.bpm.userName}:${config.bpm.password}`,
    hostname: config.bpm.host
}

for (var key in data) {
    describe(key, function () {
        this.timeout(0);
        this.retries(4);
        var refProcessData = utilities.common.removeMetadata(data[key]);
        var testProcessData = {};

        before("Create Process", function () {
            return utilities.process.startProcess(config.bpm.suffix,config.processId,config.processAppId,httpOptions)
                .then((responseData) => {
                    testProcessData = JSON.parse(responseData.data);
                    return testProcessData;
                });
        });



        refProcessData.data.tasks.reduce(function(accum, cur, curIndex, array) {
            it(cur.name,function() {

                this.test.title = this.test.title + " - " + testProcessData.data.piid;
                if (testProcessData.data.tasks[curIndex].name != cur.name)
                    assert.equal(testProcessData.data.tasks[curIndex].name,cur.name,"Task Names did not match")
                else if (testProcessData.data.tasks[curIndex].status != 'Closed' && testProcessData.data.tasks[curIndex].assignedTo != "Admin") {
                    var outputVariables = getMappingVariables(cur, testProcessData.data.tasks[curIndex]);
                    return utilities.task.finishTask(config.bpm.suffix,testProcessData.data.tasks[curIndex].tkiid,httpOptions,outputVariables)
                        .then((responseData) => {
                            if (responseData.statusCode == 200) {
                                return utilities.process.currentState(config.bpm.suffix,testProcessData.data.piid,httpOptions)
                            }
                            else {
                                assert(false,responseData);
                            }

                        })
                        .then((responseData) => {
                            testProcessData = JSON.parse(responseData.data);
                            assert(true);
                        })

                }
                else {
                    return utilities.process.currentState(config.bpm.suffix,testProcessData.data.piid,httpOptions)
                        .then((responseData) => {
                            testProcessData = JSON.parse(responseData.data);
                            assert(true);
                        })
                }

            })

        },refProcessData.data.tasks[0]);

    })
}


function getMappingVariables(refTaskData, curTaskData) {
    var mappingList = config.mapping[refTaskData.name];

    var returnObj = {};

    for (var i=0;i<mappingList.length;i++) {
        returnObj[mappingList[i].name] = refTaskData.data.variables[mappingList[i].value];

        if (mappingList[i].setters) {
            var setters = mappingList[i].setters;
            var sourceObj = curTaskData.data.variables[mappingList[i].value];
            var targetObj = returnObj[mappingList[i].name];
            for(var j=0;j<setters.length;j++) {
                var pathList = setters[j].name.split("_");
                for (var k=0;k<pathList.length-1;k++) {
                    sourceObj = sourceObj[pathList[k]];
                    targetObj = targetObj[pathList[k]];
                }

                if (setters[j].value == "**maintain**")
                    targetObj[pathList[pathList.length-1]] = sourceObj[pathList[pathList.length-1]];
                else
                    targetObj[pathList[pathList.length-1]] = setters[j][value];
            }
        }
    }

    return returnObj;

}
