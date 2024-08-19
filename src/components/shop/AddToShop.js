import React,{useState} from "react";
import { storage } from "../config/fireBase";
import { getDownloadURL, ref, uploadBytes, } from "firebase/storage";
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from "../config/fireBase";
import {View, TextInput , Text ,    TouchableOpacity , Image , ActivityIndicator , StyleSheet} from "react-native"
import inputstyles from "../styles/inputElement";

// import * as ImagePicker from 'expo-image-picker';

// import Fontisto from '@expo/vector-icons/Fontisto';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams , useNavigate } from 'react-router-dom';

function AddToShop( { username ,contact , isVerified , shopLocation} ) {

    const {location , specproduct ,truckType} = useParams()

    const navigate = useNavigate()
  const shopDB = collection(db, "Shop");

  const [formData, setFormData] = React.useState({
    productName: "",
    price: "",
    additionalInfo :"" ,
    deliveryRange : ''
  });

  const  handlechange  = (value, fieldName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };


    const [currency , setCurrency] = React.useState(true)
  function toggleCurrency(){
    setCurrency(prev=>!prev)
  }

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
      const imageRef = ref(storage , `Shop/${imageUpload.name + new Date().getTime()  }`)
      uploadBytes(imageRef , imageUpload).then(()=>{
      })
    }

    const [spinnerItem, setSpinnerItem] = React.useState(false);
    
 
  const handleSubmit = async () => {
      if(!formData.productName  ||!formData.price){
        alert("Add product name and the price to continue")
        return
      }
        if(!image){
          alert('Add product Image')
          return
        }
      setSpinnerItem(true)
        uploadImage()
        let imageUrl
        if(image){ 
       const imageRef = ref(storage , `Shop/${imageUpload.name}`)
       await uploadBytes(imageRef , imageUpload)
       // get image  url 
        imageUrl = await getDownloadURL(imageRef)
        }else{
          imageUrl = null
        }
    let userId = auth.currentUser.uid

    try {
      const docRef = await addDoc(shopDB, {
        CompanyName : username ,
        contact : contact ,
        productName : formData.productName,
        price: formData.price,
        imageUrl: imageUrl,
        userId : userId ,
        additionalInfo : formData.additionalInfo ,
        deliveryRange : formData.deliveryRange ,
        isVerified : isVerified ,
        location : location ,
        specproduct : specproduct ,
        currency : currency ,
        shopLocation : shopLocation ,

      });

       setFormData({
        productName: "",
        price: "",
        additionalInfo :"",
        deliveryRange : "" ,
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
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add {specproduct} to Shop  </Text>
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
          value={formData.productName}
          placeholder="Product Name"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'productName')}
          type="text" 
          style={inputstyles.addIterms }
        />

    <View style={{flexDirection:'row', alignItems : 'center'}}>   
     <TouchableOpacity onPress={toggleCurrency}>
        {currency ? <Text style={styles.buttonIsFalse} >USD</Text> :
         <Text style={styles.bttonIsTrue}>Rand </Text>}
      </TouchableOpacity>

        <TextInput
          placeholder="Price"
          type="text"
          onChange={handlechange}
          name="toLocation"
          value={formData.price}
          placeholderTextColor="#6a0c0c"
          style={inputstyles.addIterms }
          onChangeText={(text) => handlechange(text, 'price')}
        />
        
    </View>
      { spinnerItem &&<ActivityIndicator size={34} />}
          <TextInput 
            value={formData.deliveryRange}
            placeholderTextColor="#6a0c0c"
            placeholder="Delivery Range"
            onChangeText={(text) => handlechange(text, 'deliveryRange')}
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


export default React.memo(AddToShop)

const styles = StyleSheet.create({
  
  buttonIsFalse : {
     borderWidth : 1 ,
     borderColor : '#6a0c0c' ,
     paddingLeft :4 , 
     paddingRight:4 ,
    //  marginLeft : 6
   } , 
    bttonIsTrue:{
    backgroundColor : '#6a0c0c' ,
     paddingLeft :4 ,
     paddingRight:4 ,
     color :'white' 

    }
});