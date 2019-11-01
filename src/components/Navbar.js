//import Navbar from 'react-bootstrap/Navbar';
import { render } from 'pug';

import React, { Component } from 'react';


// class Navbar extends Component {
//     constructor() {

//     }
// }

class Navbar extends React.Component{

    render() {
        return (
            <Navbar>
             <Navbar.Header>
               <Navbar.Brand>
                 <a href="#">My Brand</a>
                 </Navbar.Brand>
             </Navbar.Header>
             </Navbar>
         );
    }
}

export default Navbar;