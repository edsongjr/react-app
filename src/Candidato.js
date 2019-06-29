import React, {Component} from 'react';
import $ from 'jquery';
import InputCustomizado from './componentes/InputCustomizado';
import PubSub from 'pubsub-js';
import TratadorErros from './TratadorErros';


export class FormularioCandidato extends Component {

  constructor(){
      super();
      this.state = { nome: "", cpf: "", rendaMensal: ""};
      this.enviaForm = this.enviaForm.bind(this);
      this.setNome = this.setNome.bind(this);
      this.setCpf = this.setCpf.bind(this);
      this.setRendaMensal = this.setRendaMensal.bind(this);
  }
    
  setNome(event){
    this.setState({nome: event.target.value});
  }
    
  setCpf(event){
    this.setState({cpf: event.target.value});
  }

  setRendaMensal(event){
    this.setState({rendaMensal: event.target.value});
  } 
    
  enviaForm(event){
    let json = {
      "nome": this.state.nome,
      "contatos": [{"descricao": "85 999271397", "tipoContato": "CELULAR"}, {"descricao": "edson12.j@hotmail.com", "tipoContato": "EMAIL"}],
      "endereco": {
        "rua": "Rua Jaime benévolo",
        "numero": 1355,
        "bairro": "Fátima"
        
      },
      "dataNascimento": "10/04/1995",
      "cpf": this.state.cpf,
      "motivoConsulta": "Por que sim",
      "rendaMensal": this.state.rendaMensal
    }
    event.preventDefault();
    $.ajax({
      url:"http://localhost:8080/api/candidatos",
      contentType: "application/json",
      dataType: "json",
      type: "post",
      data: JSON.stringify(json),
      beforeSend: function(){
        PubSub.publish("limpar-erros", {});
      },
      success: function(){
        //disparar um aviso geral de nova listagem disponivel
        PubSub.publish("atualiza-lista-candidatos", json); 
        this.setState({nome:'', cpf: '', rendaMensal: ''});
      }.bind(this),
      error: function(resposta){
        if(resposta.status === 400){ 
          new TratadorErros().publicaErros(resposta.responseJSON);
        }
      }
    });
  }

  render(){
    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} >
            <InputCustomizado label="Nome" id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome}/>
            <InputCustomizado label="CPF" id="cpf" type="text" name="cpf" value={this.state.cpf} onChange={this.setCpf}/>
            <InputCustomizado label="Renda mensal" id="rendaMensal" type="text" name="rendaMensal" value={this.state.rendaMensal} onChange={this.setRendaMensal}/>
            <div className="pure-control-group">                                  
            <label></label> 
            <button type="submit" className="pure-button pure-button-primary">Gravar</button>                                    
            </div>
        </form> 
      </div>
    );
  }

}

export class TabelaCandidatos extends Component {

  render(){
    return (
      <table className="pure-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>email</th>
          </tr>
        </thead>

        <tbody>
        {
            this.props.candidatos.map(candidato => {
              return (
                <tr key={candidato.id + candidato.nome} chave={candidato.id }>
                  <td>{candidato.nome}</td>
                  <td>{candidato.email}</td>
                </tr>
              );
            })
          }
        </tbody>

      </table>
    );
  }

}


export default class AutorBox extends Component{

  constructor(){
    super();
    this.state = {candidatos:[]};
  }

  componentDidMount(){
    $.ajax({
      url:"http://localhost:8080/api/candidatos",
      dataType: "json",
      type: "get",
      success: function(resposta){
        this.setState({candidatos: resposta});
      }.bind(this)
    });

    PubSub.subscribe("atualiza-lista-candidatos", function(topico, jsonAdicionado){
      this.setState({candidatos: this.state.candidatos.concat(jsonAdicionado)})
    }.bind(this));

  }

  render(){
    return (
      <div>
        <FormularioCandidato />
        <TabelaCandidatos candidatos={this.state.candidatos}/>
      </div>
    );
  }
}