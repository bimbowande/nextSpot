import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { getFromLocalStorage, removeFromLocalStorage } from './main';



export default function(ComposedComponent) {
    @inject('routing')
    @observer
    class Authenticate extends Component {
        render() {

            const authToken = getFromLocalStorage('auth-token');;
            if(authToken){
                const decToken = jwtDecode(authToken);
                const dateNow = new Date().getTime() / 1000;

                if (decToken.exp < dateNow) {
                    removeFromLocalStorage('auth-token');
                    return <Redirect to="/" />
                }
            } else {
                return <Redirect to="/" />
            }

            return (
                <ComposedComponent {...this.props} />
            )
        }
    }
    return Authenticate;
}
