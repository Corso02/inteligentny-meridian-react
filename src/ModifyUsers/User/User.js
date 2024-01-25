import React from "react";
import "./style.css"
import Swal from "sweetalert2";

const User = ({userName, userId, server_url, set_user_modified, user_modified}) => {

    async function deleteUser(){
        let req_body = {
            user_id: userId
        }
        let req = await fetch(`${server_url}/user/delete`, {
            method: "POST",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify(req_body)
        })
        let res = await req.json()
        if(res.success){
            Swal.fire({
                icon: "success",
                title: "Používateľ bol vymazaný"
            })
            set_user_modified(!user_modified)
        }
    }

    function handleDelete(){
        Swal.fire({
            icon: "warning",
            title: `Naozaj chcete vymazať používateľa ${userName}?`,
            text: "Táto akcia je nevratná",
            showDenyButton: true,
            denyButtonText: "Zrušiť",
            confirmButtonColor: "dodgerblue",
            confirmButtonText: "Pokračovať"
        }).then(res => {
            if(res.isConfirmed){
                deleteUser()        
            }
        })
    }

    async function handleCardChange(){
        const { value: formValues } = await Swal.fire({
            title: "Zadajte nové číslo karty",
            confirmButtonColor: "dodgerblue",
            confirmButtonText: "Zmenit číslo karty",
            html: `
              <input id="swal-input1" class="swal2-input" placeholder="Nové číslo karty" type="text">
            `,
            focusConfirm: false,
            preConfirm: () => {
                let card = document.getElementById("swal-input1").value
                let errorClass = "swal2-input error_input"
                let normalClass = "swal2-input"
                if(!card){
                    if(!card){
                        document.getElementById("swal-input1").setAttribute("class", errorClass)
                    }
                    else{
                        document.getElementById("swal-input1").setAttribute("class", normalClass)
                    }
                    return false
                }
                  return [ card ];
            }
        });
        if (formValues) {
            let card_num = formValues[0]
    
            let req_body = {
                user_id: userId,
                card_num
            }
    
            //req_body = Object.entries(req_body).map(([key,value]) => `${key}=${value}`).join("&")
    
            const res = await fetch(`${server_url}/user/changeCard`, {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8"},
                body: JSON.stringify(req_body)
            })
    
            const ans = await res.json()
            

            if(!ans.success){
                if(ans.reason === "server error"){
                    Swal.fire({
                        icon: "error",
                        title: "Nastala chyba pri zmene čísla karty, kontaktujte admina"
                    })
                }
            }
            else{
                Swal.fire({
                    icon: "success",
                    title: "Zmena čísla karty úspšená"
                })
            }
    
        }
    }


    return(
        <div className="user_container">
            <p className="user_name">{userName}</p>
            <div className="buttons">
                <button className="norm btn" onClick={() => handleCardChange()}>Upraviť kartu</button>
                <button className="red btn" onClick={() => handleDelete()}>Odstrániť</button>
            </div>
        </div>
    )
}

export default User