import 'aframe';
import 'aframe-particle-system-component';
import {Entity, Scene} from 'aframe-react';

import React, { Component } from 'react';
import getContract from '../../utils/getContract';

let _contract;
let _web3;

class VRScene extends React.Component {
  render () {
  	const { images } = this.props;
    return (
      <Scene background="color: #fff">
      
		<Entity geometry={{primitive: 'box', width: 2, height: 2, depth: 1 }} material={{  src: images[0]  }} position={{x: 0, y: 0, z: -5 }}/>
		<Entity geometry={{primitive: 'box', width: 2, height: 2, depth: 1 }} material={{  src: images[1]  }} position={{x: 5, y: 0, z: 0 }}/>
		<Entity geometry={{primitive: 'box', width: 2, height: 2, depth: 1 }} material={{  src: images[2]  }} position={{x: 0, y: 0, z: 5 }}/>
		<Entity geometry={{primitive: 'box', width: 2, height: 2, depth: 1 }} material={{  src: images[3]  }} position={{x: -5, y: 0, z: 0 }}/>
		<Entity geometry={{primitive: 'box',  width: 60, height: 40, depth: 60}} material={{color: '#000'}} position={{x: 0, y: -30, z: -3}}/>       
      </Scene>
    );
  }
}
//<img src={require('./photo_2018-04-22_16-00-00.jpg')} />
class Gallery extends Component {
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
		const {
			pictures,
			loading
		} = this.state;


		const images = pictures.map(picture => `https://ipfs.io/ipfs/${picture.pictureCID}`);

		return (
			<div>
				{!loading && <VRScene images={images}/>}
			</div>
		);
	}
}

export default Gallery;