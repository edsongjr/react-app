import React, {Component} from 'react';
import $ from 'jquery'

class InputCustomizado extends Component{

    render(){
        return (
        <div className="pure-control-group">
            <label htmlFor={this.props.id}>{this.props.label}</label> 
            <input id={this.props.id} type={this.props.type} name={this.props.name} defaultValue={this.props.defaultValue} onChange={this.props.onChange}/>                  
        </div>
        );
    }

}

export default InputCustomizado;