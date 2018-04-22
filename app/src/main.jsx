import * as React from "react";
import * as ReactDOM from "react-dom";

import {Router, Route, browserHistory} from "react-router";


import App from "./containers/app/";
import Pictures from './containers/pictures/';
import AddPictures from './containers/add-pictures/'
import Gallery from './containers/gallery/';

function Root() {
  return (
    <Router  history={browserHistory}>
      <Route component={App} >
      	<Route path={"/"} component={Pictures}/>
      	<Route path={"/add"} component={AddPictures}/>
      </Route>
      <Route path={"/gallery"} component={Gallery}/>
    </Router>
  );
}


ReactDOM.render(
  <Root />,
  document.getElementById("root")
);

