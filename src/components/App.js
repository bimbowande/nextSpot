import React, { Component } from 'react';
import {inject,observer} from 'mobx-react';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStroopwafel,faUser,faKey, faDivide} from '@fortawesome/free-solid-svg-icons' 
library.add(faStroopwafel,faUser,faKey);

class App extends Component {

  render() {
    return ( 
      <div>
        hi
      </div>
    )
  }
}
export default App