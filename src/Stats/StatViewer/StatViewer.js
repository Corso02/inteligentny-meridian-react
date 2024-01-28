import React, { useEffect, useState } from "react";
import arrow from "../../arrow.svg"
import "./style.css"

const StatViewer = ({roomName, statName, isMetric, server_url, openAll}) => {

    const [statOpened, setStatOpened] = useState(false)
    const [lastMeasurement, setLastMeasurement] = useState(0)
    const [dayAverage, setDayAverage] = useState(0)
    const [weekAverage, setWeekAverage] = useState(0)
    const [batteryCapacity, setBatteryCapacity] = useState(0)

    useEffect(() => {
        async function fetchData(){
            let root = isMetric ? "metric" : "measurement"
            let path = `${server_url}/${root}/${roomName}/${statName}`
            let req = await fetch(path)
            let res = await req.json()
            let json = JSON.parse(res)
            setLastMeasurement(json.last)
            setDayAverage(json.dayAverage)
            setWeekAverage(json.weekAverage)
            if(root === "measurement")
                setBatteryCapacity(json.battery)
        }
        fetchData()
    }, [server_url, roomName, statName, isMetric])

    useEffect(() => {
        if(openAll != statOpened)
            setStatOpened(openAll)
    }, [openAll])

    return (
        <div className="stat_viewer_wrapper">
            <div className="stat_viewer_header" onClick={() => setStatOpened(!statOpened)}>
                <h3>{statName}</h3>
                <img src={arrow} alt="arrow" className={statOpened ? "opened" : "closed"}/>
            </div>
            <div className={statOpened ? "stat_viewer_body active" : "stat_viewer_body"}>
                <p className={statOpened ? "show" : "hide"}>Posledna namerana hodnota: {lastMeasurement}</p>
                <p className={statOpened ? "show" : "hide"}>Denna priemerna hodnota: {dayAverage}</p>
                <p className={statOpened ? "show" : "hide"}>Tyzdenna priemerna hodnota: {weekAverage}</p>
                { !isMetric && <p className={statOpened ? "show" : "hide"}>Uroven nabitia baterie: {batteryCapacity}</p>}
            </div>
        </div>
    )
}

export default StatViewer