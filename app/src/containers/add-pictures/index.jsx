import React, { Component } from 'react';


import getContract from '../../utils/getContract';
import { browserHistory } from 'react-router'

let _contract;
let _web3;

// const ipfsAPI = require('ipfs-api')


const IPFS = require('ipfs-api');

//require('ipfs-api/dist/index.min.js')
//require('ipfs-api');

export const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


class AddPictures extends Component {
	constructor(props) {
      super(props)

      this.state = {
      	loading: false,
      	added_file_hash: null
      }
      
      // this.ipfsApi = ipfsAPI('localhost', '5001')

      this.add = this.add.bind(this);
	  this.captureFile = this.captureFile.bind(this)
	  this.saveToIpfs = this.saveToIpfs.bind(this)
	  // this.handleSubmit = this.handleSubmit.bind(this)
    }


// constructor () {
//     super()
//     this.state = {
//       added_file_hash: null
//     }
//     this.ipfsApi = ipfsAPI('localhost', '5001')

//     // bind methods
//     this.captureFile = this.captureFile.bind(this)
//     this.saveToIpfs = this.saveToIpfs.bind(this)
//     this.handleSubmit = this.handleSubmit.bind(this)
//   }
	componentDidMount() {
      getContract().then(({ contract, web3 }) => {
        _contract = contract;
        _web3 = web3;
      })
  	}

	captureFile (event) {
	    event.stopPropagation()
	    event.preventDefault()
	    const file = event.target.files[0]
	    let reader = new window.FileReader()
	    reader.onloadend = () => this.saveToIpfs(reader)
	    reader.readAsArrayBuffer(file)
  	}
	saveToIpfs (reader) {
	    let ipfsId
	    const buffer = Buffer.from(reader.result)
	    ipfs.add(buffer, { progress: (prog) => console.log(`received: ${prog}`) })
	      .then((response) => {
	        console.log(response)
	        ipfsId = response[0].hash
	        console.log(ipfsId)
	        this.setState({added_file_hash: ipfsId})
	      }).catch((err) => {
	        console.error(err)
	      })
  	}

	add() {
		const pictureName = this.refs.pictureName.value;
		const pictureDescription = this.refs.pictureDescription.value;
		const price = this.refs.price.value;
		const { added_file_hash } = this.state;
		this.setState({
			loading: true
		})
		_contract.addPicture(pictureName, pictureDescription, added_file_hash, +price, { from: '0xf2492533F7d89DBfEd69757156c4B746839E59E8' })
			.then(() => {
				this.setState({
					loading: true
				})
				browserHistory.push(`/`); 
			})
	}
	render() {
		const { loading, added_file_hash } = this.state;
		return (
			<div>
				{loading && <div>loading...</div>}
				<div>
					<div>
						name:
						<input ref='pictureName' />
					</div>
					{added_file_hash && <div>
					<a target='_blank'
            href={'https://ipfs.io/ipfs/' + this.state.added_file_hash}>
            {this.state.added_file_hash}
          </a>
          	{<img style={{ width: 100 }} src={'https://ipfs.io/ipfs/' + this.state.added_file_hash} />}
          </div>}
					<div>
						description:
						<textarea ref='pictureDescription' ></textarea>
					</div>
					<div>
						price:
						<input ref='price' />
					</div>
					<div>
						<input type='file' onChange={this.captureFile}/>
					</div>
					<button onClick={this.add}>add</button>
				</div>
			</div>
		);
	}
}

export default AddPictures;