import React,{useState , useEffect} from "react";
import { View , Text , ScrollView , TouchableOpacity, ActivityIndicator ,  TextInput} from 'react-native';
import { db, auth } from "../config/fireBase";

import { storage } from "../config/fireBase";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable ,} from "firebase/storage";
import { collection, onSnapshot , serverTimestamp ,addDoc, query , where , getDocs ,doc,deleteDoc , updateDoc, runTransaction , setDoc} from 'firebase/firestore';
import inputstyles from "../styles/inputElement";
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function AddAnUpdate(){

const navigate = useNavigate()
  const [detailOfUpdate, setDeatilOfUpdate] = React.useState("");

const [error , setError]= React.useState("")

    const [spinnerItem, setSpinnerItem] = React.useState(false);
  
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
      const imageRef = ref(storage , `updates/${imageUpload.name + new Date().getTime()  }`)
      uploadBytes(imageRef , imageUpload).then(()=>{
      })
    }





 const [currentTime, setCurrentTime] = useState(formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000); // Update every minute

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run the effect only once

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }


const [currentDateTime, setCurrentDateTime] = useState(formatDateTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(formatDateTime(new Date()));
    }, 5000); // Update every 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run the effect only once

  function formatDateTime(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }


  const UpdatesCollection = collection(db, "updates");

  const checkExistixtDoc = async (receriverId) => {
    const chatsRef = collection(db, 'newIterms'); // Reference to the 'ppleInTouch' collection
    const chatQuery = query(chatsRef, where('docNowExist', '==', receriverId)); // Query for matching chat ID

      const querySnapshot = await getDocs(chatQuery);  
     // Check if any documents exist with the chat ID
      return !querySnapshot.empty; // Returns true if a document exists, false otherwise
    };
    

      const handleSubmit = async () => {
      setSpinnerItem(true)
        // uploadImage()
        let imageUrl
        if(image){
       const imageRef = ref(storage , `updates/${imageUpload.name}`)
       await uploadBytes(imageRef , imageUpload)
       // get image  url 
        imageUrl = await getDownloadURL(imageRef)
          }else{
            imageUrl = null
          }
      setError('')
    try {
      const docRef = await addDoc(UpdatesCollection, {
        deletionTime :Date.now() + 3 * 24 * 60 * 60 * 1000 ,
        timeStamp : serverTimestamp() ,
        detailOfUpdate : detailOfUpdate ,
        imageUrl  : imageUrl ,
        currentDateTime : currentDateTime ,
        currentTime :currentTime 
      });

      setDeatilOfUpdate('')
      setImage(null)
      setSpinnerItem(false)
    } catch (err) {
      setSpinnerItem(false)
      setError(err.toString());
      }
  };
    return(
        <View style={{paddingTop:80 , alignItems : 'center'}} >
           <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />

        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Update  </Text>
       </View>
            {error && <Text>{error} </Text>}
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
            placeholder="Add Update"
            type="text"
            value={detailOfUpdate}
           onChangeText={(text) => setDeatilOfUpdate(text)}
           style={inputstyles.inputElem}
          />
      { spinnerItem &&<ActivityIndicator size={34} />}
          <TouchableOpacity onPress={handleSubmit}>
            <Text>Submit </Text>
          </TouchableOpacity>
        </View>
    )
}
export default React.memo(AddAnUpdate)