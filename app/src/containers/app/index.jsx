import React, { Component } from 'react';

import getContract from '../../utils/getContract';

let _contract;
let _web3;

class App extends Component {
	componentDidMount() {
      // getContract().then(({ contract, web3 }) => {

      // })

      getContract().then(({ contract, web3 }) => {
        _contract = contract;
        _web3 = web3;
        // contract.addContractParameter('BOSS', 'BIG', { from: '0xa3564D084fabf13e69eca6F2949D3328BF6468Ef' }).then(() => {
        //   debugger
        // })
        // this.loadData();
      })
  	}
	
	render() {
		return (
			<div>
				<h2 className='text-center'>Cyber Gallery</h2>
				{this.props.children}
			</div>
		);
	}
}

export default App;