import React, { useState } from "react"
import "./style.css"
import Swal from "sweetalert2"

const Header = ({isLoggedIn, setIsLoggedIn, server_url, isAdmin, setIsAdmin, openAdminPanel, openPrefs, set_user_id, modify_user, user_modified, set_user_modified, set_modify_user}) => {

    const [hamburgerOpened, setHamburgerOpened] = useState(false)
    
    async function logIn(){
        const { value: formValues } = await Swal.fire({
            title: "Zadajte prihlasovacie údaje",
            confirmButtonColor: "dodgerblue",
            confirmButtonText: "Prihlásiť sa",
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
                password
            }
    
            //req_body = Object.entries(req_body).map(([key,value]) => `${key}=${value}`).join("&")
    
            const res = await fetch(`${server_url}/user/login`, {
                method: "POST",
                headers: {"Content-type": "application/json; charset=UTF-8"},
                body: JSON.stringify(req_body)
            })
    
            const ans = await res.json()
            

            if(!ans.success){
                Swal.fire({
                    icon: "error",
                    title: "Neplatné prihlasovacie údaje"
                })
            }
            else{
                set_user_id(ans.user_id)
                setIsLoggedIn(true)
                if(ans.is_admin)
                    setIsAdmin(true)
            }
    
        }
    }

    function handleLogButton(){
        if(isLoggedIn){
            setIsLoggedIn(false)
            setIsAdmin(false)
            setHamburgerOpened(false)
            modify_user(false)
        }
        else{
           logIn()
        }
    }

    function handleHamburgerClick(){
        if(!hamburgerOpened){
            openAdminPanel(false)
            openPrefs(false)
        }
        setHamburgerOpened(!hamburgerOpened)
    }

    async function handleRegister(){
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
            let card_id = null
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
                set_user_modified(!user_modified)
            }
    
        }
    }

    return(
        <header>
        <nav className="navbar">
            <h1 onClick={() => {
                modify_user(false)
            }}>Meridian IoT</h1>
            <ul className={hamburgerOpened ? "nav-menu active" : "nav-menu"}>
                {(isLoggedIn && isAdmin) &&
                    <li className="nav-item">
                        <p className="nav-link" onClick={() => {
                            setHamburgerOpened(false)
                            openAdminPanel(true)
                            openPrefs(false)
                        }}>Admin Panel</p>
                    </li>
                }
                {(isLoggedIn && isAdmin) &&
                    <li className="nav-item">
                        <p className="nav-link" onClick={() => {
                            setHamburgerOpened(false)
                            openAdminPanel(false)
                            openPrefs(false)
                            handleRegister()
                        }}>Rgistrovať používateľa</p>
                    </li>
                }
                {(isLoggedIn && isAdmin) && 
                    <li className="nav-item">
                        <p className="nav-link" onClick={() => {
                            setHamburgerOpened(false)
                            openAdminPanel(false)
                            openPrefs(false)
                            modify_user(true)
                        }}>Úprava používateľov</p>
                    </li>
                }
                {isLoggedIn && 
                    <li className="nav-item">
                        <p className="nav-link" onClick={() => {
                            setHamburgerOpened(false)
                            openPrefs(true)
                            openAdminPanel(false)
                        }}>Preferencie</p>
                    </li>
                }
                <li className="nav-item">
                    <p id="login_btn" className="nav-link" onClick={() => handleLogButton()}>{!isLoggedIn ? "Prihlásiť sa" : "Odhlásiť sa"}</p>
                </li>
            </ul>
            <div className={hamburgerOpened ? "hamburger active" : "hamburger"} onClick={() => handleHamburgerClick()}>
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </div>
        </nav>
    </header>
    )
}

export default Header