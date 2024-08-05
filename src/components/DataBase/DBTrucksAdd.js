import React,{useState} from "react";
import { storage } from "../config/fireBase";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable ,} from "firebase/storage";
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from "../config/fireBase";
import {View, TextInput , Text ,    TouchableOpacity , Image , ActivityIndicator} from "react-native"
import inputstyles from "../styles/inputElement";

// import * as ImagePicker from 'expo-image-picker';

// import Fontisto from '@expo/vector-icons/Fontisto';


import { useParams } from 'react-router-dom';

function DBTrucksAdd( { username ,contact , isVerified } ) {

    const {truckType} = useParams()

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

    const uploadImage = ()=>{
      if(imageUpload === null) return
      const imageRef = ref(storage , `Trucks/${imageUpload.name + new Date().getTime()  }`)
      uploadBytes(imageRef , imageUpload).then(()=>{
        alert("refresh page to see changes")
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
      <View style={{alignItems :'center', paddingTop : 40}} >
         <View key={item.id} style={{flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
            <Text>backkkkk</Text>
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Iterms  </Text>
       </View>


     {image && <Image source={{ uri: image.localUri }} style={{ width: 200, height: 200 }} />}

     {!image && <TouchableOpacity style={{marginBottom : 9 , backgroundColor:'red'}}>



          {/* <Fontisto name="camera" size={30} color="#6a0c0c" /> */}
     <input
      className="inputFIle"
      type="file"
      onChange={(e)=>{setImageUpload(e.target.files[0])}}
      />


     </TouchableOpacity>}

      
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