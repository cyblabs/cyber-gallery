var Gallery = artifacts.require("./Gallery.sol");

module.exports = function(deployer) {
  deployer.deploy(Gallery, 
  	'cyber gallery',
  	'G',
  	'name',
  	'description',
    'link',
  );
};
