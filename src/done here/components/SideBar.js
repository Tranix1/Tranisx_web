import React from "react"
import "./styles/SideBar.css"

function SideBar( props){
  return(
    <div>

      <div className="name" onClick={props.handleClick} >{props.item.name} <span>{props.item.ammount}</span> </div>
    </div>
   

    )
}
export default React.memo( SideBar)
