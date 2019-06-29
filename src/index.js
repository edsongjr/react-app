import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import CandidatoBox from './Candidato';
import Home from './Home';
import './index.css';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';

 
ReactDOM.render(
    (<Router>
        <App>
            <Switch>
                <Route path="/" exact component={Home}/>  
                <Route path="/candidato" component={CandidatoBox}/>  
                <Route path="/teste" render={() => <div>Teste das rotas</div>}/>  
            </Switch>
        </App>
    </ Router>),
    document.getElementById('root')  
);
 
 