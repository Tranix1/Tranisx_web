import React from "react"
import "./styles/AddLoad.css"

function ThingsByUser( props){


  function goBackToMini(){
    props.allThingsByUser([])
  }
  return(
    <div className="bigLoad"  >
      <button onClick={goBackToMini} className="moreLessBTN" > less</button>
      
        <h3>Company {props.item.companyName} </h3>
        
        <p>Contact : <span className="spaninMini">{props.item.contact}</span></p>
        <p>type of load {props.item.typeofLoad} </p>
        <p>from {props.item.fromLocation} to {props.item.toLocation} </p>
        <p>Rate {props.item.ratePerTonne} </p>
        <p>Due Date {props.item.DueDate} </p>
        <p> payment terms {props.item.paymentTerms} </p>
        <p>Requirements {props.item.requirements} </p>
        <p>additional info {props.item.additionalInfo} </p>         

      </div>     
  )

}
export default React.memo(ThingsByUser)