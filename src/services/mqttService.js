//Importar do pacote mqtt-paho a classe client
import { Client } from 'paho-mqtt'

let client; //variável globalpara guardar a instância do cliente MQTT

export const connectMQTT = (onMessageRecived) => {

    //Usar wss na porta 8884
    client = new Client('broker.hivemq.com', 8884, 'clientId-', '/mqtt', 'reactClient' + Math.random());

    //define o handler para perda de conexão
    client.onConnectionlOst = (responseObject) => {
        console.log('Conexão perdida: ', responseObject);
};

    //define o handler para a chegada de novas mensagens
    client.onMessageArrived = (message) => {
        //Ao receber a mensagem, repassa para seu callback o tópico e o playload
        onMessageRecived(message.destinationName, message.payloadString);
    };


    //Inicia a conexão e subscreve nos tópicos
    client.connect({
        useSSL: true,
        onSuccess: () => {
            console.log("MQTT Conectado via WSS!");
            client.subscribe('gabriela/resp_enviada');
            client.subscribe('gabriela/resp_resultado');
            client.subscribe('gabriela/resp_statusAluno');
        },
        onFailure: (error) => {console.error('Erro MQTT:', error);
        },
});
}

export const publishMessage = (topic, payload) =>{
    if(!client) return;

    const message = new window.Paho.MQTT.Message(payload);
    message.destinationName = topic;
    client.send(message);
}