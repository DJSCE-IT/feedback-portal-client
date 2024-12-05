import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from '../context/Theme/ThemeContext'
import { UIContext } from '../context/UIContext/UiContext';

export default function DJNavbar() {
    const {primaryColor}=useContext(ThemeContext);
    let {isNavbarVisible,NavbarTitle} =useContext(UIContext);
  return (
   <nav className="navbar" style={{"backgroundColor":primaryColor}}>
   <div className='text-white h3 ms-3 '>
       Dashboard
   </div>
   <div className='m-2 bg-white px-3 py-2 rounded-circle'>
   <i className="fa-solid fa-user"></i>
   </div>
  
 </nav>
  )
}
