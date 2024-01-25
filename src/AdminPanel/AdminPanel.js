import React, { useEffect, useState } from "react";
import cross from "../cross.png"
import "./style.css"

const AdminPanel = ({adminPanelOpened, server_url}) => {

    const [temp, setTemp] = useState({})
    const [light, setLight] = useState({})
    const [door, setDoor] = useState({})

    useEffect(() => {
        async function fetchData(){
            let req = await fetch(`${server_url}/admin/get_panel_values`)
            let res = await req.json()
            let json = JSON.parse(res)
            for(let i = 0; i < json.values.length; i++){
                console.log(json.values[i])
                switch(json.values[i].name){
                    case "temp":
                        setTemp(json.values[i])
                        break
                    case "light":
                        setLight(json.values[i])
                        break
                    case "door":
                        setDoor(json.values[i])
                        break
                }
            }
        } 
        fetchData()
    }, [])

    function parseTimeStamp(timestamp){
        if(!timestamp) return "00.00.0000, 00:00"
        let date = new Date(timestamp)
        console.log(date.getDate())
        return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()}, ${date.getHours()}:${String(date.getMinutes()).length === 1 ? `0${date.getMinutes()}` : date.getMinutes()}` 
    }

    return (
        <div className="adminPanel_wrapper">
            <div className="adminPanel_header">
                <h1>Admin Panel</h1>
                <img src={cross} alt="Close" onClick={() => adminPanelOpened(false)} />
            </div>
            <div className="adminPanel_body">
                <div className="sensor_status">
                    <h3 className="sensor_name">Teplomer</h3>
                    <p className="sensor_last_time">Posledný čas merania: {parseTimeStamp(temp.dt)}</p>
                    <p className={Number(temp.battery) > 30 ? "sensor_battery_level" : "sensor_battery_level low"}>Stav batérie: {temp.battery}%</p>
                </div>
                <div className="sensor_status">
                    <h3 className="sensor_name">Osvetlenie</h3>
                    <p className="sensor_last_time">Posledný čas merania: {parseTimeStamp(light.dt)}</p>
                    <p className={Number(light.battery) > 30 ? "sensor_battery_level" : "sensor_battery_level low"}>Stav batérie: {light.battery}%</p>
                </div>
                <div className="sensor_status">
                    <h3 className="sensor_name">Dvere</h3>
                    <p className="sensor_last_time">Posledný čas otvorenia dverí: {parseTimeStamp(door.dt)}</p>
                    <p className={Number(door.battery) > 30 ? "sensor_battery_level" : "sensor_battery_level low"}>Stav batérie: {door.battery}%</p>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel