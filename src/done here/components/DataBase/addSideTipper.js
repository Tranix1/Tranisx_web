import React from "react"
import { storage } from "../config/fireBase";
import {getDownloadURL, ref , uploadBytes} from "firebase/storage"
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from "../config/fireBase";

import {v4} from "uuid"

function SideTipper(username){

  // specify the database to use
  const SideTippersDB = collection(db,"sideTippers")

  const [formDta , setFormData] = React.useState({
    fromLocation : "",
    toLocation : "",
    like : false,
    rating : 0,
    contact : ''
  })

    function handlechange(event){
      const {name , value } = event.target

      setFormData(prevFOrmData =>{

        return{
          ...prevFOrmData,
          [name]  : value 
        }
      })
    }
    const [ imageUpload, setImageUpload] = React.useState(null)    

    const uploadImage = ()=>{
      if(imageUpload === null) return
      const imageRef = ref(storage , `sideTippers/${imageUpload.name + v4() }`)
      uploadBytes(imageRef , imageUpload).then(()=>{
        alert("Refresh page to see changes")
      })
    }   

    const handleSubmit = async(event)=>{
      event.preventDefault()
      const imageRef = ref(storage , `sideTippers/${imageUpload.name}`)
       await uploadBytes(imageRef , imageUpload)
       // get image  url 
       let imageUrl = await getDownloadURL(imageRef)

      try{
        await addDoc(SideTippersDB ,{
          CompanyName : username,
          fromLocation : formDta.fromLocation,
          toLocation : formDta.toLocation,
          like : formDta.like,
          rating : formDta.rating,
          contact : formDta.contact,
          imageUrl : imageUrl
        })
        setFormData({
          fromLocation: "",
          toLocation: "",
          contact: "",
        });
      }catch(err){
        console.error(err)
      }
    }

  return(
    <form  onSubmit={handleSubmit}>

      <input
      type="file"
      onChange={(e)=>{setImageUpload(e.target.files[0])}}
      />


           
      <input
        placeholder="from location"
        type="text"
        onChange={handlechange}
        name="fromLocation"
        value={formDta.fromLocation}
         />

        <input
        placeholder="to location"
        type="text"
        onChange={handlechange}
        name="toLocation"
        value={formDta.toLocation}
          />
            <input
            placeholder="Contact"
            type="text"
            onChange={handlechange}
            name="contact"
            value={formDta.contact}
          />
            <button onClick={uploadImage} >submit</button>
          </form>
  )
}
export default SideTipper