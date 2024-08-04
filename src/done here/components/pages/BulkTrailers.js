import "../styles/Main.css"
import React from "react"
import  unlikedStar from "../../public/images/icons/grade_FILL0_wght400_GRAD0_opsz48.svg"
import likedstar from "../../public/images/icons/star_rate_black_24dp.svg"

function BulkTrailers(props){
  
  const starIcon = props.liked ? likedstar : unlikedStar   
  return(
    <div >
    <img src={props.item.imageUrl} className="truck-image"/>
    <div className="About" >
      <img src = {starIcon } className="star"  onClick={props.handleClick}/>
      <span>({props.item.rating}) </span>      
    </div>
    <h2 className="truck-name">{props.item.CompanyName} </h2>
      <p className="location"> From {props.item.fromLocation} to {props.item.toLocation} </p>
      <p>contact {props.item.contact}</p>
    </div>
  )
}
export default React.memo(BulkTrailers)

