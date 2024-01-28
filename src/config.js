const is_dev = process.env.NODE_ENV === 'development'

let mqtt_options = {}
/*
MQTT_NAME=maker
MQTT_PASSWORD=this.is.mqtt
MQTT_URL=mqtt://192.168.0.200:1883

*/

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

if(is_dev){
    mqtt_options = {
        host: "localhost",
        protocol: "ws",
        port: 8000,
        clientId: "StyriaPlusPesFrontEnd"+makeid(6),
        username: "maker",
        password: "this.is.mqtt",
        connectUrl: "ws://localhost:8000"
    }
}
else{
    mqtt_options = {
        host: "147.232.205.204",
        protocol: "ws",
        port: 8000,
        clientId: "StyriaPlusPesFrontEnd"+makeid(6),
        username: "maker",
        password: "mother.mqtt.password",
        connectUrl: "ws://147.232.205.204:8000"
    }
}

const config = {
    server_url: is_dev ? 'http://192.168.0.200:3001' : "http://147.232.205.215:3001",
    mqtt_options,
    mqtt_door_topic: is_dev ? "test/door" : "kpi/meridian/rfid/42"
}

export default config