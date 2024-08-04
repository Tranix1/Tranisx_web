import React,{useState} from "react";
import { storage } from "../config/fireBase";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable ,} from "firebase/storage";
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { db, auth } from "../config/fireBase";
import {View, TextInput , Text ,    TouchableOpacity , Button , Image , ActivityIndicator} from "react-native"
import inputstyles from "../styles/inputElement";

// import * as ImagePicker from 'expo-image-picker';

// import Fontisto from '@expo/vector-icons/Fontisto';



function DBTrucksAdd( {route} ) {

  const {truckType ,username ,contact , isVerified } = route.params

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
     const selectImage = async () => {
//     let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (permissionResult.granted === false) {
//       alert('Permission to access camera roll is required!');
//       return;
//     }

//     let pickerResult = await ImagePicker.launchImageLibraryAsync();
    
//     if (pickerResult.cancelled === true) {
//       return;
//     }

//     // Check if assets array exists and has at least one element
//     if (pickerResult.assets && pickerResult.assets.length > 0) {
//       const firstAsset = pickerResult.assets[0];
//       if (firstAsset.uri) {
//         setImage({ localUri: firstAsset.uri });
//         uploadImage(firstAsset); // Call uploadImage with the selected asset
//       } else {
//         alert('Selected image URI is undefined');
//       }
//     } else {
//       alert('No assets found in the picker result');
//     }
  };

const [storagePath, setStoragePath] = React.useState('');
const [downloadURL, setDownloadURL] = React.useState('')

// async function uploadImage(asset) {  
// const response = await fetch(asset.uri);
// const blob = await response.blob();
// const storageRef = ref(storage, `Trucks/` + new Date().getTime() );
// const path = `Stuff/${new Date().getTime()}`;
// const uploadTask = uploadBytesResumable(storageRef, blob);

// return new Promise((resolve, reject) => {
//   // Listen for events
//   uploadTask.on(
//     'state_changed',
//     (snapshot) => {
//       // Progress handling
//     },
//     (error) => {
//       // Error handling
//       reject(error);
//     },
//     () => {
//       getDownloadURL(uploadTask.snapshot.ref)
//         .then((downloadURL) => {
//            setDownloadURL(downloadURL)
//           resolve(downloadURL);
//         })
//         .catch((error) => {
//           reject(error);
//         });
//     }
//     );
// });
// }


let _downloadURL = downloadURL
  

    const [spinnerItem, setSpinnerItem] = React.useState(false);
 
  const handleSubmit = async () => {

      setSpinnerItem(true)

    let userId = auth.currentUser.uid
    try {
      const docRef = await addDoc(trucksDB, {
        CompanyName : username ,
        contact : contact ,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        imageUrl: _downloadURL,
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

     {image && <Image source={{ uri: image.localUri }} style={{ width: 200, height: 200 }} />}

     {!image && <TouchableOpacity onPress={selectImage} style={{marginBottom : 9}}>



          {/* <Fontisto name="camera" size={30} color="#6a0c0c" /> */}



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