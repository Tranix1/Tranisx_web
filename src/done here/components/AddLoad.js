import React from "react"
import "./styles/AddLoad.css"

function AddLoad( props){
  const styles = {
    backgroundColor : props.backgroundColor
  }
  return(
    <div className="bigLoad" style={styles} >
        <h3>Company {props.item.companyName} </h3>
        <p>Contact : <span className="spaninMini">{props.item.contact}</span></p>
        <p>type of load {props.item.typeofLoad} </p>
        <p>from {props.item.fromLocation} to {props.item.toLocation} </p>
        <p>Rate {props.item.ratePerTonne} </p>
        <p> payment terms {props.item.paymentTerms} </p>
        <p>Due Date {props.item.DueDate} </p>
        <p>Requirements {props.item.requirements} </p>
        <p>additional info {props.item.additionalInfo} </p>        

      </div>     
  )

}
export default React.memo( AddLoad)