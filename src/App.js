import { useEffect, useRef, useState } from 'react';
import './App.css';
import Header from './Header/Header';
import config from './config';
import AdminPanel from "./AdminPanel/AdminPanel"
import Prefs from './Prefs/Prefs';
import Stats from './Stats/Stats';
import Footer from './Footer/Footer';
import ModifyUsers from './ModifyUsers/ModifyUsers';
import mqtt from 'mqtt';
import Swal from 'sweetalert2';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminPanelOpened, setAdminPanelOpened] = useState(false)
  const [prefsOpened, setPrefsOpened] = useState(false)
  const [userId, setUserId] = useState(null)
  const [modifyUser, setModifyUser] = useState(false)
  const [userModified, setUserModified] = useState(false)
  const server_url = config.server_url
  const mqtt_options = config.mqtt_options
  const [mqttClient, setClient] = useState(null)
  const [mqttConnected, setMqttConnected] = useState(false)

  	useEffect(() => {
		console.log("napajam")
      	setClient(mqtt.connect(mqtt_options.connectUrl, mqtt_options))
  	}, [])

	useEffect(() => {
		if(mqttClient){
        	mqttClient.on("connect", () => {
          		console.log("mqtt connected")
				setMqttConnected(true)
        	})
			mqttClient.on("err", () => {
				setMqttConnected(false)
			})
			mqttClient.on("reconnect", () => {
				setMqttConnected(false)
			})
    	}
  	}, [mqttClient])

	useEffect(() => {
		if(isAdmin && mqttClient){
			mqttClient.on("message", (topic, msg) => {
				console.log(topic)
				if(topic === config.mqtt_door_topic){
					registerUserWithCard(msg.toString())
				}
			})
			mqttClient.subscribe(config.mqtt_door_topic, {label: '0', value: 0}, (err) => console.log(err ? "Subscription error" : "Topic subscribed"))
		}
		else if(!isAdmin && mqttClient){
			mqttClient.unsubscribe(config.mqtt_door_topic, err => console.log(err ? "Unsubscription error" : "Topic unsubscribed"))
		}
	}, [isAdmin])


	async function registerUserWithCard(msg){
		if(isAdmin){
			const { card_id, command } = JSON.parse(msg)
			if(!command || command != "register") return
			const { value: formValues } = await Swal.fire({
				title: "Zadajte registračné údaje",
				confirmButtonColor: "dodgerblue",
				confirmButtonText: "Zaregistrovať sa",
				html: `
				  <input id="swal-input1" class="swal2-input" placeholder="Meno" type="text">
				  <input id="swal-input2" class="swal2-input" placeholder="Heslo" type="password">
				`,
				focusConfirm: false,
				preConfirm: () => {
					let name = document.getElementById("swal-input1").value
					let pswd = document.getElementById("swal-input2").value
					let errorClass = "swal2-input error_input"
					let normalClass = "swal2-input"
					if(!name || !pswd){
						if(!name){
							document.getElementById("swal-input1").setAttribute("class", errorClass)
						}
						else{
							document.getElementById("swal-input1").setAttribute("class", normalClass)
						}
						if(!pswd){
							document.getElementById("swal-input2").setAttribute("class", errorClass)
						}
						else{
							document.getElementById("swal-input2").setAttribute("class", errorClass)
						}
						
						return false
					}
					  return [ name, pswd ];
				}
			});
			if (formValues) {
				let name = formValues[0]
				let password = formValues[1]
		
				let req_body = {
					name,
					password,
					card_id
				}
		
				//req_body = Object.entries(req_body).map(([key,value]) => `${key}=${value}`).join("&")
		
				const res = await fetch(`${server_url}/user/register`, {
					method: "POST",
					headers: {"Content-type": "application/json; charset=UTF-8"},
					body: JSON.stringify(req_body)
				})
		
				const ans = await res.json()
				console.log(ans)
				
	
				if(!ans.success){
					if(ans.reason === "server error"){
						Swal.fire({
							icon: "error",
							title: "Nastala chyba pri registrovaní používateľa, kontaktujte admina"
						})
					}
					else if(ans.reason === "prefs error"){
						Swal.fire({
							icon: "error",
							title: "Nastala chyba pri generovaní preferencií, kontaktujte admina"
						})
					}
					else{
						Swal.fire({
							icon: "error",
							title: "Používateľ s daným menom už existuje"
						})
					}
					
				}
				else{
					Swal.fire({
						icon: "success",
						title: "Rgistrácia úspešná"
					})
					setUserModified(!userModified)
				}
		
			}
		}
	}


  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} server_url={server_url} isAdmin={isAdmin} setIsAdmin={setIsAdmin} openAdminPanel={setAdminPanelOpened} openPrefs = {setPrefsOpened} set_user_id={setUserId} modify_user={setModifyUser} set_user_modified={setUserModified} user_modified={userModified}/>
      {(isLoggedIn && adminPanelOpened) && <div className='popUp_container'><AdminPanel adminPanelOpened={setAdminPanelOpened} server_url={server_url}/></div>}
      {(isLoggedIn && prefsOpened) && <div className='popUp_container'><Prefs prefsOpened={setPrefsOpened} user_id={userId} server_url={server_url}/></div>}
      { (!modifyUser)  && <Stats server_url={server_url} />}
      {(isLoggedIn && isAdmin && modifyUser) && <ModifyUsers server_url={server_url} setUserModified={setUserModified} userModified={userModified}/>}
      <Footer />
    </div>
  );
}

export default App;
