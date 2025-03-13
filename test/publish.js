const pact = require('@pact-foundation/pact-node')
const path = require('path')
const pactBrokerUrl = process.env.PACT_BROKER_BASE_URL || 'https://verity.pactflow.io';
const pactBrokerToken = process.env.PACT_BROKER_TOKEN || 'v_ieq2UfPtJpt1UEt9IsYQ';

pact.publishPacts(opts)
  .then(() => {
    console.log('Pact contract publishing complete!')
    console.log('')
    console.log('Head over to https://test.pactflow.io/ and login with')
    console.log('=> Username: dXfltyFMgNOFZAxr8io9wJ37iUpY42M')
    console.log('=> Password: O5AIZWxelWbLvqMd8PkAVycBJh2Psyg1')
    console.log('to see your published contracts.')
  })
  .catch(e => {
    console.log('Pact contract publishing failed: ', e)
  })
