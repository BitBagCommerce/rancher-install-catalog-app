const core = require('@actions/core');
const https = require('https');

try {
    const data = {
        "charts": [
            {
                "chartName": core.getInput('chartName'),
                "releaseName": core.getInput('releaseName'),
                "annotations": JSON.parse(core.getInput('chartAnnotations')),
                "values": JSON.parse(core.getInput('values'))
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
        hostname: core.getInput('rancherUrl'),
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
