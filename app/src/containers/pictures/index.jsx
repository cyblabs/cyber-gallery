import React, { Component } from 'react';

import { Link } from 'react-router';

import getContract from '../../utils/getContract';

let _contract;
let _web3;

class Pictures extends Component {
	constructor(props) {
      super(props)

      this.state = {
        pictures: [],
        loading: false
      }

      this.loadData = this.loadData.bind(this);
    }
	loadData() {
		// getItems(_contract, 'picturesCount')
		_contract.picturesCount()
			.then(lengthData => {
				const length = lengthData.toNumber();
				// alert(length)
				let promises = [];
	          	for(let i =0; i < length; i++) {
	            	promises.push(_contract.getPicture(i));
	          	}
	          	Promise.all(promises).then(data => {
					const pictures = data.map(arr => ({
						pictureName: arr[0],
						pictureDescription: arr[1],
						pictureCID: arr[2],
						price: arr[3].toNumber(),
						timestamp: arr[4].toNumber()
					}))
					this.setState({
						pictures
					})
	          	})
			})
	}

	componentDidMount() {
      getContract().then(({ contract, web3 }) => {
        _contract = contract;
        _web3 = web3;
        this.loadData();
      })
  	}
	render() {
		const { pictures } = this.state;
		const items = pictures.map((picture, index) => (
			<div key={index}>
				<span>{picture.pictureName}</span>
				<span>{picture.pictureDescription}</span>
				<img src={'https://ipfs.io/ipfs/' + picture.pictureCID} />
				<span>{picture.price}</span>
			</div>
		))
		return (
			<div>
				<div>
					{items}
				</div>
				<Link to='/add'>add picture</Link>
				Pictures
			</div>
		);
	}
}

export default Pictures;
