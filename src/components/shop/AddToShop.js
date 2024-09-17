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
    deliveryRange : '' ,
    mileage :'' ,
    year :'' ,
    engine : '' , 
    trans :"" ,
     fuel :''
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

    const [sellRent , setSellRent] = React.useState(true)
  function toggleSellRent(){
    setSellRent(prev=>!prev)
  }

const [images, setImages] = useState([]);

const [ imageUpload, setImageUpload] = React.useState([])    

    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files);

        // Limit the number of images to 4
        if (images.length + files.length > 4) {
            alert('You can only add up to 4 images.');
            return;
        }
        
            setImageUpload(prevImages => [...prevImages, ...files]);

        // Handle multiple file input change
        files.forEach(file => {

            const reader = new FileReader();
            reader.onload = () => {
                setImages(prevImages => [...prevImages, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    console.log(imageUpload , "ayayapapa")
 const uploadImages = async () => {
    try {
        for (const image of imageUpload) {
            const imageName = image.name + new Date().getTime();
            const imageRef = ref(storage, `Shop/${imageName}`);
            await uploadBytes(imageRef, image);
            // Handle successful upload if needed
        }
    } catch (error) {
        console.error('Error uploading images:', error);
    }
}

    const [spinnerItem, setSpinnerItem] = React.useState(false);
    
 let image ,uploadImage , setImage

  const handleSubmit = async () => {
      if(!formData.productName  ||!formData.price){
        alert("Add product name and the price to continue")
        return
      }else if(!username){
        alert('add username')
        return
      }
       
      setSpinnerItem(true)


        // uploadImages()
        let imageUrl

    
    const imageUrls = [];

    // Upload each image and get the download URL





    let userId = auth.currentUser.uid


    try {
        // Upload each image and get the download URL
        for (const image of imageUpload) {
            const imageName = image.name + new Date().getTime();
            const imageRef = ref(storage, `Shop/${imageName}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);
            imageUrls.push(imageUrl);
        }

        // Add a document to Firestore with image URLs
        const docRef = await addDoc(shopDB, {
            CompanyName: username,
            contact: contact,
            productName: formData.productName,
            price: formData.price,
            imageUrl: imageUrls,
            userId: userId,
            additionalInfo: formData.additionalInfo,
            deliveryRange: formData.deliveryRange,
            isVerified: isVerified,
            location: location,
            specproduct: specproduct,
            currency: currency,
            shopLocation: shopLocation,
            sellRent: sellRent
        });


       setFormData({
        productName: "",
        price: "",
        additionalInfo :"",
        deliveryRange : "" ,
      });
      setImages([])
      setSpinnerItem(false)
        console.log('Document added with image URLs:', docRef.id);
    } catch (error) {
        console.error('Error uploading images and adding document:', error);
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


<Text>Add @ least 4  Images </Text>

         <div>
            {images.length < 4 && (
                <div>
                    <label for="fileInput">
                        <CameraAltIcon style={{ color: '#6a0c0c', fontSize: 33 }} />
                    </label>
                    <input
                        style={{ display: 'none' }}
                        id="fileInput"
                        type="file"
                        multiple
                        onChange={handleFileInputChange}
                    />
                </div>
            )}

            {/* <Text>Add many Images</Text> */}

            {/* Display selected images */}
          
        {images.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index}`}   style={{ width : 200 , height : 200 , margin : 7}} />
        ))}
            {/* Button to upload images */}
            {/* // <button onClick={uploadImages}>Upload Images</button> */}
        </div>

      
        <TextInput
          value={formData.productName}
          placeholder="Product Name"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'productName')}
          type="text" 
          style={inputstyles.addIterms }
        />

            <Text>Milage Year Engine Trans Fuel    </Text>
        {specproduct === "vehicles"&& <View>
     <TextInput
          value={formData.mileage}
          placeholder="Mileage"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'mileage')}
          type="text" 
          style={inputstyles.addIterms }
        />
          <TextInput
          value={formData.year}
          placeholder="Year"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'year')}
          type="text" 
          style={inputstyles.addIterms }
        />
          <TextInput
          value={formData.engine}
          placeholder="Engine"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'engine')}
          type="text" 
          style={inputstyles.addIterms }
        />
          <TextInput
          value={formData.trans}
          placeholder="Trans"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'trans')}
          type="text" 
          style={inputstyles.addIterms }
        />
             <TextInput
          value={formData.fuel}
          placeholder="Fuel"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'fuel')}
          type="text" 
          style={inputstyles.addIterms }
        />
          
        </View>}



    
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
              <View style={{flexDirection: 'row' , margin : 8 , }} >
                <TouchableOpacity style={sellRent ? styles.bttonIsTrue : styles.buttonIsFalse} onPress={toggleSellRent} >
                  <Text style={sellRent ? {color:'white'} : {color:'black'} } > Sell </Text>
                </TouchableOpacity>

                <TouchableOpacity  style={!sellRent ? styles.bttonIsTrue : styles.buttonIsFalse} onPress={toggleSellRent} >
                  <Text style={!sellRent ? {color:'white'} : {color:'black'} } > Rent </Text>
                </TouchableOpacity>
              </View>

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