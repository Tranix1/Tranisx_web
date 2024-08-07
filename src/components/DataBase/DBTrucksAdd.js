import React,{useState} from "react";
import { storage } from "../config/fireBase";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable ,} from "firebase/storage";
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from "../config/fireBase";
import {View, TextInput , Text ,    TouchableOpacity , Image , ActivityIndicator} from "react-native"
import inputstyles from "../styles/inputElement";

// import * as ImagePicker from 'expo-image-picker';

// import Fontisto from '@expo/vector-icons/Fontisto';
import CameraAltIcon from '@mui/icons-material/CameraAlt';


import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams , useNavigate } from 'react-router-dom';

function DBTrucksAdd( { username ,contact , isVerified } ) {

    const {truckType} = useParams()
    const navigate = useNavigate()
  const trucksDB = collection(db, "Trucks");

  const [formData, setFormData] = React.useState({
    fromLocation: "",
    toLocation: "",
    additionalInfo :"" ,
    trailerType : ''
  });

  const  handlechange  = (value, fieldName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };



  
  
  const [image, setImage] = useState(null);  
  const [ imageUpload, setImageUpload] = React.useState(null)    


    const handleFileInputChange = (e) => {
    // Handle file input change here
    setImageUpload(e.target.files[0])
    const file = e.target.files[0];

     if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


    const uploadImage = ()=>{
      if(imageUpload === null) return
      const imageRef = ref(storage , `Trucks/${imageUpload.name + new Date().getTime()  }`)
      uploadBytes(imageRef , imageUpload).then(()=>{
      })
    }

    const [spinnerItem, setSpinnerItem] = React.useState(false);
    
 
  const handleSubmit = async () => {

      setSpinnerItem(true)
        uploadImage()
       const imageRef = ref(storage , `Trucks/${imageUpload.name}`)
       await uploadBytes(imageRef , imageUpload)
       // get image  url 
       let imageUrl = await getDownloadURL(imageRef)

    let userId = auth.currentUser.uid
    try {
      const docRef = await addDoc(trucksDB, {
        CompanyName : username ,
        contact : contact ,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        imageUrl: imageUrl,
        userId : userId ,
        additionalInfo : formData.additionalInfo ,
        trailerType : formData.trailerType ,
        truckType : truckType ,
        isVerified : isVerified ,
      });

       setFormData({
        fromLocation: "",
        toLocation: "",
        additionalInfo :"",
        trailerType : "" ,
      });
      setImage(null);
      setSpinnerItem(false)
    } catch (err) {
      console.error(err);
    }
  };
  return (
      <View style={{alignItems :'center', paddingTop : 80}} >
         <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Trucks  </Text>
       </View>


     {/* {image && <Image source={{ uri: image.localUri }} style={{ width: 200, height: 200 }} />} */}
      {image && <img src={image} alt="Selected" style={{ width : 200 , height : 200}} />}

   
       {!image&&<div>
    <label for="fileInput" >     
        <CameraAltIcon style={{color : '#6a0c0c' , fontSize : 33}} />

    </label>
    <input
      style={{display: 'none'}}
      id="fileInput"
      type="file"
      onChange={handleFileInputChange}
    />

    </div>}


      
        <TextInput
          value={formData.fromLocation}
          placeholder="from location"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'fromLocation')}
          type="text" 
          style={inputstyles.addIterms }
        />

        <TextInput
          placeholder="to location"
          type="text"
          onChange={handlechange}
          name="toLocation"
          value={formData.toLocation}
          placeholderTextColor="#6a0c0c"
          style={inputstyles.addIterms }
          onChangeText={(text) => handlechange(text, 'toLocation')}
        />
        
      { spinnerItem &&<ActivityIndicator size={34} />}
          <TextInput 
            value={formData.trailerType}
            placeholderTextColor="#6a0c0c"
            placeholder="Trailer Type"
            onChangeText={(text) => handlechange(text, 'trailerType')}
            type="text"
          style={inputstyles.addIterms }
          />
          <TextInput 
            value={formData.additionalInfo}
            placeholderTextColor="#6a0c0c"
            placeholder="Additional Information"
            onChangeText={(text) => handlechange(text, 'additionalInfo')}
            type="text"
            style={inputstyles.addIterms }
          />
              
        <TouchableOpacity onPress={handleSubmit} style={{backgroundColor : '#6a0c0c' , width : 70 , height : 30 , borderRadius: 5 , alignItems : 'center' , justifyContent : 'center'}} >

        <Text style={{color:'white'}} >submit</Text>

        </TouchableOpacity>
      
      </View>

  );
}


export default DBTrucksAdd;