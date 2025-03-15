const verifier = require('pact').Verifier
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect
chai.use(chaiAsPromised)
const {
  server,
  importData,
  animalRepository
} = require('../provider.js')

// Append some extra endpoints to mutate current state of the API
server.get('/states', (req, res) => {
  res.json({
    "Matching Service": ['Has some animals', 'Has no animals', 'Has an animal with ID 1']
  })
})

server.post('/setup', (req, res) => {
  const state = req.body.state

  animalRepository.clear()
  switch (state) {
    case 'Has no animals':
      // do nothing
      break
    default:
      importData()
  }

  res.end()
})

server.listen(8081, () => {
  console.log('Animal Profile Service listening on http://localhost:8081')
})

// Verify that the provider meets all consumer expectations
describe('Pact Verification', () => {
  it('should validate the expectations of Matching Service', function() { // lexical binding required here
    this.timeout(10000)

    let opts = {
      providerBaseUrl: 'http://localhost:8081',
      pactBrokerUrl: "https://verity.pactflow.io",
      pactBrokerToken: "v_ieq2UfPtJpt1UEt9IsYQ",
      publishVerificationResult: false,
      providerVersionBranch: process.env.GIT_BRANCH ?? "master",
      providerVersion: process.env.GIT_COMMIT ?? "1.0." + process.env.HOSTNAME,
      consumerVersionSelectors: [
        { mainBranch: true },
        { deployedOrReleased: true }
      ]
    }

    return verifier.verifyProvider(opts)
      .then((output) => {
        console.log("Pact Verification Complete!");
        console.log(output);
      })
      .catch((e) => {
        console.error("Pact verification failed :(", e);
      });
  })
})
