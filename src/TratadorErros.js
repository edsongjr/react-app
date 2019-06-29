import PubSub from 'pubsub-js';

export default class TratadorErros {

    publicaErros(erros){
       // console.log(erros);
        erros.forEach(erro => { 
            PubSub.publish("erro-validacao", erro);
        });
    }

}