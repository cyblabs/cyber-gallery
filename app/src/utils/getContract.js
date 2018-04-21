import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    var results
    var web3 = window.web3

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider)

      results = {
        web3: web3
      }

      console.log('Injected web3 detected.');

      resolve(results)
    } else {
      // Fallback to localhost if no web3 injection. We've configured this to
      // use the development console's port by default.
      var provider = new Web3.providers.HttpProvider('https://kovan.infura.io/eKZdJzgmRo31DJI94iSO')

      web3 = new Web3(provider)

      results = {
        web3: web3
      }

      console.log('No web3 instance injected, using Local web3.');

      resolve(results)
    }
  })
})

const config = require('../../../build/contracts/Gallery.json');
const GalleryAbi = config.abi;


const getContract = () => {
  return getWeb3
      .then(results => {
      const contract = require('truffle-contract');
      const registryContract = contract(config);
      registryContract.setProvider(results.web3.currentProvider);
      results.web3.eth.defaultAccount = results.web3.eth.accounts[0];
      return registryContract.deployed().then(contract => ({
        contract,
        web3: results.web3
      }));
    })
}

const getItems = (contract, count, array, mapFn) => {
  return new Promise(resolve => {
    contract[count]((e, lengthData) => {
      console.log(e, lengthData)
      const length = lengthData.toNumber();
      let promises = [];
          for(let i =0; i < length; i++) {
            promises.push(new Promise((itemResolve, itemReject) => {
              contract[array](i, (e, r) => {
                if (e) itemReject(e)
                  else itemResolve(r);
              })
            }));
          }

          Promise.all(promises).then(data => {
            // .filter(arr => arr[0] !== '')
            const results = data.map(mapFn);
            resolve(results);
          })
    })
  })
}

export default getContract;
