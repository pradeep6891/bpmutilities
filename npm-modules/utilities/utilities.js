'use strict';

const common = require('./common');
const bluepages = require('./bluepages/bluepages');
const bpmoncloud = require('./bpmoncloud/bpmoncloud');
const organization = require('./bpmrest/organization/organization');
const process = require('./bpmrest/process/process');
const task = require('./bpmrest/task/task');

module.exports = {
    common: common,
    bluepages: bluepages,
    bpmoncloud : bpmoncloud,
    organization : organization,
    process : process,
    task : task
}

