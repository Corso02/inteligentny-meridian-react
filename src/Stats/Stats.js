import React, { useEffect, useState } from "react";
import "./style.css"

const Stats = ({server_url}) => {

    const [room, setRoom] = useState("meridian")
    const [availableRooms, setAvailableRooms] = useState([])
    

    useEffect(() => {
        async function getAvailableRooms(){
            let req = await fetch(`${server_url}/rooms`)
            let res = await req.json()
            setAvailableRooms(JSON.parse(res).rooms)
        }
        getAvailableRooms()
    }, [server_url])
    
    useEffect(() => {
        console.log(room)
    }, [room])

    function generateSelectionMenu(){
        let items = []
        for(let i = 0; i < availableRooms.length; i++){
            if(availableRooms[i] === 'meridian')
                items.push(<option key={i} value={availableRooms[i]} selected>{availableRooms[i]}</option>)
            else
                items.push(<option key={i} value={availableRooms[i]}>{availableRooms[i]}</option>)
            
        }
        return items
    }

    return(
        <div className="stats_wrapper">
            <div className="room_selection_wrapper">
                <label>Miestnosť:</label>
                <select onChange={(e) => setRoom(e.target.value)}>
                    {generateSelectionMenu()}
                </select>
            </div>
        </div>
    )
}

export default Stats