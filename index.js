const core = require('@actions/core');
const https = require('https');

let inputValues = {};

const isObject = function (item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

const mergeDeep = function (target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {[key]: {}});
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return mergeDeep(target, ...sources);
}

try {

    core.getInput('values').split("\n").forEach(e => {
        let [key, value] = e.split(/\:\s/g);
        let tempObject = {};
        let container = tempObject;

        key.split('.').map((k, i, values) => {
            container = (container[k] = (i === values.length - 1 ? JSON.parse(value) : {}))
        });
        mergeDeep(inputValues, tempObject);
    });

    const data = {
        "charts": [
            {
                "chartName": core.getInput('chartName'),
                "releaseName": core.getInput('appName'),
                "values": inputValues
            }
        ],
        "noHooks": false,
        "timeout": "600s",
        "wait": true,
        "namespace": core.getInput('appNamespace'),
        "projectId": `${core.getInput('clusterId')}/${core.getInput('projectId')}`,
        "disableOpenAPIValidation": false,
        "skipCRDs": false
    };

    const options = {
        hostname: core.getInput('rancherUrl').replace(/http(s)?\:\/\//g, ''),
        port: 443,
        path: `/v1/catalog.cattle.io.clusterrepos/${core.getInput('chartNamespace')}?action=install`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${core.getInput('rancherToken')}`
        },
        json: data
    };

    https
        .request(options)
        .on('error', error => core.setFailed(error.message));
} catch (error) {
    core.setFailed(error.message)
}
