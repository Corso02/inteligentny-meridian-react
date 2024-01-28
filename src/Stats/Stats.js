import React, { useEffect, useState } from "react";
import "./style.css"
import StatViewer from "./StatViewer/StatViewer";

const Stats = ({server_url, mqttConnected}) => {

    const [room, setRoom] = useState("meridian")
    const [availableRooms, setAvailableRooms] = useState([])
    const [roomsParameters, setRoomsParameters] = useState([])
    const [gatewayMetrics, setGatewayMetrics] = useState([])
    const [openAll, setOpenAll] = useState(false)
    

    useEffect(() => {
        async function getAvailableRooms(){
            let req = await fetch(`${server_url}/rooms`)
            let res = await req.json()
            setAvailableRooms(JSON.parse(res).rooms)
        }
        getAvailableRooms()
    }, [server_url])
    
    useEffect(() => {
        async function getRoomParameters(){
            let req = await fetch(`${server_url}/room/parameters/${room}`)
            let res = await req.json()
            setRoomsParameters(JSON.parse(res).params)
        }
        /* fetch data from influxdb through backend*/
        setGatewayMetrics(["Využitie procesora", "RAM", "HDD"])

        getRoomParameters()
    }, [room, server_url])

    function generateSelectionMenu(){
        let items = []
        for(let i = 0; i < availableRooms.length; i++){
            items.push(<option key={i} value={availableRooms[i]} selected={availableRooms[i] === room}>{availableRooms[i]}</option>)
        }
        return items
    }

    function generateStatViewers(){
        let items = []
        for(let i = 0; i < roomsParameters.length; i++){
            items.push(<StatViewer key={i} roomName={room} statName={roomsParameters[i]} isMetric={false} server_url={server_url} openAll={openAll}/>)
        }
        return items
    }

    function generateMetricsViewers(){
        let items = []
        for(let i = 0; i < gatewayMetrics.length; i++){
            items.push(<StatViewer key={i+roomsParameters.length} roomName={room} statName={gatewayMetrics[i]} isMetric={true} server_url={server_url} openAll={openAll} />)
        }
        return items
    }

    return(
        <div className="stats_wrapper">
            <div className="stats_wrapper_header">
                <div className="stats_header_part_1">
                    <label>Miestnosť:</label>
                    <select onChange={(e) => setRoom(e.target.value)}>
                        {generateSelectionMenu()}
                    </select>
                    <div className="mqtt_status_wrapper">
                        <label>MQTT status</label>
                        <div className={mqttConnected ? "mqtt_status active" : "mqtt_status"}></div>
                    </div>
                </div>
                <button onClick={() => setOpenAll(!openAll)}>{openAll ? "Zatvoriť" : "Otvoriť"} všetky</button>
            </div>
            <div className="stats_viewer_container">
                <div className="measurements">
                    <h2>Merania</h2>
                    <hr></hr>
                    {generateStatViewers()}
                </div>
                <div className="metrics">
                    <h2>Metriky</h2>
                    <hr></hr>
                    {generateMetricsViewers()}
                </div>
            </div>
        </div>
    )
}

export default Stats