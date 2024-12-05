import { useState } from "react";
const UiState = (props) => {
    const [isNavbarVisible,setNavBarVisible]=useState(false);
    const [NavbarTitle,setNavbarTitle]=useState("Dashboard");

    setAuth(true)
    return (
        <UiState.Provider value={{isNavbarVisible,setNavBarVisible,setNavbarTitle,NavbarTitle}}>
            {props.children}
        </UiState.Provider>
    )
}

export default UiState;