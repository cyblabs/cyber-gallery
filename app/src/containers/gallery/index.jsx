import 'aframe';
import 'aframe-particle-system-component';
import {Entity, Scene} from 'aframe-react';

import React, { Component } from 'react';

       



class VRScene extends React.Component {
  render () {
 

    return (
      <Scene background="color: #fff">
		<Entity geometry={{primitive: 'box', width: 2, height: 2, depth: 1 }} material={{  src: require('./photo_2018-04-22_16-00-00.jpg'),  }} position={{x: 0, y: 0, z: -5 }}/>
		<Entity geometry={{primitive: 'box', width: 2, height: 2, depth: 1 }} material={{  src: require('./photo_2018-04-22_16-43-30.jpg'),  }} position={{x: 5, y: 0, z: 0 }}/>
		<Entity geometry={{primitive: 'box', width: 2, height: 2, depth: 1 }} material={{  src: require('./photo_2018-04-22_16-43-36.jpg'),  }} position={{x: 0, y: 0, z: 5 }}/>
		<Entity geometry={{primitive: 'box', width: 2, height: 2, depth: 1 }} material={{  src: require('./photo_2018-04-22_16-43-41.jpg'),  }} position={{x: -5, y: 0, z: 0 }}/>

 <Entity geometry={{primitive: 'box',  width: 60, height: 40, depth: 60}} material={{color: '#000'}} position={{x: 0, y: -30, z: -3}}/>

      </Scene>
    );
  }
}
//<img src={require('./photo_2018-04-22_16-00-00.jpg')} />
class Gallery extends Component {
	render() {
		return (
			<div>
				<VRScene />
			</div>
		);
	}
}

export default Gallery;