import React, { useEffect, useState } from "react";
import cross from "../cross.png"
import "./style.css"
import brightest from "../light3.svg"
import mid from "../light1.svg"
import lowest from "../light2.svg"
import Swal from "sweetalert2";


const Prefs = ({prefsOpened, user_id, server_url}) => {


    const [lightValue, setLightValue] = useState(50)
    const [minTemp, setMinTemp] = useState(24)
    const [maxTemp, setMaxTemp] = useState(28)
    const [imgSource, setImgSource] = useState(mid)
    const [email, setEmail] = useState("test@examle.com")
    const [allAlerts, setAllAlerts] = useState(false)
    const [alerts, setAlerts] = useState(false)

    useEffect(() => {
        async function fetchData(){
            let req_body = {user_id}

            let req = await fetch(`${server_url}/user/get_prefs`, {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8"},
                body: JSON.stringify(req_body)
            })
            let res = await req.json()
            if(res.success){
                console.log(res)
                setMaxTemp(res.max_temp)
                setMinTemp(res.min_temp)
                setLightValue(res.min_light)
                setEmail(res.email)
                setAlerts(res.send_alerts === 1)
                setAllAlerts(res.send_all_alerts === 1)
            }
        }
        fetchData()
    },[server_url, user_id])

    const showErrorMessage = (msg) => {
        Swal.fire({
            icon: "error",
            title: "Zadali ste neplatné údaje",
            text: msg
        })
    }

    const savePrefs = async () => {
        if(minTemp > maxTemp) showErrorMessage("Minimálna teplota nesmie byť nižšia ako maximálna teplota")
        else if(minTemp <= 0) showErrorMessage("Minimálna teplota nesmie byt mešia alebo rovná 0")
        else if(alerts && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) showErrorMessage("Zadajte validný email")
        else{
            let body = {
                user_id,
                prefs:{
                    min_temp: minTemp,
                    max_temp: maxTemp,
                    min_light: lightValue,
                    alerts,
                    email,
                    allAlerts
                }
            }
            let req = await fetch(`${server_url}/user/save_prefs`, {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8"},
                body: JSON.stringify(body)
            })
            let ans = req.status
            if(ans === 200)
                Swal.fire({
                    icon: "success",
                    title: "Preferencie boli uložené",
                    toast: true,
                    position: "top",
                    timer: 2000,
                    showConfirmButton: false
                })
            else
                Swal.fire({
                    icon: "error",
                    title: "Nastala chyba na strane servera",
                    toast: true,
                    position: "top",
                    timer: 2000,
                    showConfirmButton: false
                })

        }

    }


    return (
        <div className="pref_wrapper">
            <div className="pref_header">
                <h1>Preferencie</h1>
                <img src={cross} alt="Close" onClick={() => prefsOpened(false)}/>
            </div>
            <div className="pref_body">
                <div className="pref_setting_container">
                    <h3>Teplota</h3>
                    <div className="pref_settings temp_settings">
                        <div className="input_container">
                            <label>Minimálna teplota: </label>
                            <input type="number" value={minTemp} onChange={(e) => setMinTemp(e.target.value)} step="0.01" />
                        </div>
                        <div className="input_container">
                            <label>Maximálna teplota: </label>
                            <input type="number" value={maxTemp} onChange={(e) => setMaxTemp(e.target.value)} step="0.01"/>
                        </div>
                    </div>
                </div>
                <div className="pref_setting_container">
                    <h3>Osvetlenie</h3>
                    <div className="pref_settings">
                        <div className="input_container">
                            <label>Intenzita svetla: </label>
                            <input type="range" min={0} max={100} value={lightValue} onChange={(e) => {
                                setLightValue(e.target.value)
                                if(e.target.value <= 5)
                                    setImgSource(lowest)
                                else if(e.target.value >= 85)
                                    setImgSource(brightest)
                                else
                                    setImgSource(mid) 
                            }}/>
                            <div className="image_container">
                                <img src={imgSource} className="bigger" alt="light_bulb"/>
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div className="pref_setting_container">
                    <h3>Upozornenia</h3>
                    <div className="pref_settings">
                        <div className="input_container">
                            <label>Email:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="input_container">
                            <label>Dostávať upozornenia:</label>
                            <input type="checkbox" onChange={(e) => setAlerts(e.target.checked)} checked={alerts}/>    
                        </div>
                        {alerts && <div className="input_container">
                            <label>Dostávať všetky upozornenia:</label>
                            <input type="checkbox" onChange={(e) => setAllAlerts(e.target.checked)} checked={allAlerts}/>    
                        </div>}
                    </div>
                </div>
                <button onClick={() => savePrefs()}>Uložiť preferencie</button>
            </div>
        </div>
    )
}

export default Prefs