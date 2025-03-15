const pact = require('@pact-foundation/pact');
const pactBrokerUrl = process.env.PACT_BROKER_BASE_URL || 'https://verity.pactflow.io';
const pactBrokerToken = process.env.PACT_BROKER_TOKEN || 'v_ieq2UfPtJpt1UEt9IsYQ';

const gitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim();

const opts = {
    pactFilesOrDirs: ['./pacts/'],
    pactBroker: pactBrokerUrl,
    pactBrokerToken: pactBrokerToken,
    tags: ['prod', 'test'],
    consumerVersion: gitHash
};

pact
    .publishPacts(opts)
    .then(() => {
        console.log('Pact contract publishing complete!');
        console.log('');
        console.log(`Head over to ${pactBrokerUrl}`);
        console.log('to see your published contracts.')
    })
    .catch(e => {
        console.log('Pact contract publishing failed: ', e)
    });
