import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import User from "./User/User";
import "./style.css"
import refresh_img from "../refresh.svg"

const ModifyUsers = ({server_url, userModified, setUserModified}) => {
    
    const [users, setUsers] = useState([])
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        async function fetchUsers(){
            let req = await fetch(`${server_url}/user/getAll`)
            let res = await req.json()
            if(!res.success){
                Swal.fire({
                    icon: "error",
                    text: "Chyba pri získavaní používateľov"
                })
            }
            else{
                let usrs = res.row.map((user, i) => <User key={i} userName={user.user_name} userId={user.user_id} server_url={server_url} set_user_modified={setUserModified} user_modified={userModified}/>)
                console.log(usrs)
                setUsers(usrs)
            }
        }
        fetchUsers()
    }, [server_url, userModified, refresh])
    
    return(
        <div>
            <div className="list_header">
                <h3>Zoznam používateľov</h3>
                <img src={refresh_img} alt="refresh" onClick={() => setRefresh(!refresh)}/>
            </div>
            
            {users}
        </div>
    )
}

export default ModifyUsers