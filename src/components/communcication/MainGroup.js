import React ,{useState, useEffect} from "react";
import { View , Text , TouchableOpacity , ScrollView , Image , TextInput , Keyboard} from "react-native";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable ,} from "firebase/storage";
import {addDoc , onSnapshot , orderBy , query , serverTimestamp , collection, } from "firebase/firestore"
import { db , auth} from "../config/fireBase";

import { storage } from "../config/fireBase";

import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

function MainGroup({username}){

    const navigate = useNavigate()

  const [message , setMessages]=React.useState([])

  const mainGroupDB = collection(db, "MainGroupChats");

React.useEffect(() => {
  try {
    const q = query(mainGroupDB, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMessages(messages);
    });

    return unsubscribe; // Return the unsubscribe function
  } catch (error) {
    console.error('Error fetching messages:', error);
  }


}, []);

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

    const [previousDateTime, setPreviousDateTime] = useState(formatDateTime(getPreviousDate()));
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPreviousDateTime(formatDateTime(getPreviousDate()));
    }, 5000); // Update every 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run the effect only once

  function formatDateTime(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  function getPreviousDate() {
    const currentDate = new Date();
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 1);
    return previousDate;
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
      const imageRef = ref(storage , `Trucks/${imageUpload.name + new Date().getTime()  }`)
      uploadBytes(imageRef , imageUpload).then(()=>{
      })
    }

 const mainGroup = collection(db ,'MainGroupChats');

const [typedMsg , setTypedMsg] = React.useState('')

const handleSubmit = async (event) => {

          let imageUrl
      if(image){
        uploadImage()
        const imageRef = ref(storage , `chats/${imageUpload.name}`)
        await uploadBytes(imageRef , imageUpload)
        // get image  url 
          imageUrl = await getDownloadURL(imageRef)
      }else{
        imageUrl = null
      }


  try {
    await addDoc(mainGroup, {
      typedMsg: typedMsg,
      username: username,
      userId: auth.currentUser.uid,
      currentDate: currentDateTime,
      currentTime: currentTime,
      timestamp: serverTimestamp(),
      // addedImage: imageUrl,
      isViewed: false, // Set the initial value to indicate the message is not viewed
      addedImage: imageUrl 
    });
        const newIterms = collection(db ,'newIterms');
      // Chat doesn't exist, add it to 'ppleInTouch'
      await addDoc(newIterms, {
        newGrpMessage : true ,
        timestamp : serverTimestamp() ,
      });
  } catch (err) {
    console.error(err);
  }
  // Reset form fields
  setTypedMsg('')
  setImage(null)
  // setDownloadURL(null);
};




 let previousDate = null;
 const dspMessages =   message.map((item) => {
     let messageDate = item.currentDate;
          const showMessageDate = previousDate !== messageDate;
          previousDate = messageDate;
          
          if (messageDate === currentDateTime) {
                messageDate = 'today';
              } else if (messageDate === previousDateTime) {
                messageDate = 'yesterday';
              }

      if (item.userId === auth.currentUser.uid) {
        return (<View key={item.id}>
            {showMessageDate && <Text>{messageDate}</Text>}
            <View style={{padding: 7,marginBottom: 2,backgroundColor: 'rgb(129,201,149)',marginLeft: 70,}}>
              <Text style={{ color: '#6a0c0c' }}>{item.username}</Text>
              {item.addedImage && (
                   <img src={item.addedImage} style={{height : 200 , marginBottom : 10}}/>
              )}
              <Text>{item.typedMsg}</Text>
              <Text style={{ fontSize: 12, position: 'absolute', right: 8, bottom: 0 }}>
                {item.currentTime}
              </Text>
            </View>
          </View>
        );
      } else {
        return (
          <View key={item.id}>
            {showMessageDate && <Text>{messageDate}</Text>}
            <View style={{padding: 7,marginBottom: 6,backgroundColor: 'white',marginRight: 80,}}>
              {item.addedImage && (
                   <img src={item.addedImage} style={{height : 200 , marginBottom : 10}}/>
              )}
              <Text style={{ fontSize: 15, color: '#6a0c0c' }}>{item.username}</Text>
              <Text>{item.typedMsg}</Text>
              <Text style={{ fontSize: 12, position: 'absolute', right: 8, bottom: 0 }}>
                {item.currentTime}
              </Text>
            </View>
          </View>
        );
      }
    })


              const [keyboardHeight, setKeyboardHeight] = useState(0);
              useEffect(() => {

              const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                setKeyboardHeight(0); // Reset keyboard height
              });

              return () => {
                // keyboardDidShowListener.remove();
                keyboardDidHideListener.remove();
              };
              }, []); // Empty dependency array to run effect only once

const scrollViewRef = React.useRef();
    return(
<View style={{ position : 'absolute' ,bottom : 0 , top : 0 , width:390 , }}>
 <View  style={{flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Main Group</Text>
       </View>


    <ScrollView      style={{ flex: 1, paddingBottom: 10, paddingLeft: 7, paddingRight: 7, paddingTop: 20, marginBottom: 40 }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={(contentWidth, contentHeight) => {
                scrollViewRef.current.scrollToEnd({ animated: true });
            }}
            ref={scrollViewRef}
            >
      {dspMessages}
    </ScrollView>
     { image &&<View style={{position:'absolute' , top :70 ,left : 1,  right : 1 , bottom :50   , alignItems :'center' , justifyContent : 'center' , backgroundColor : 'rgba(0, 0, 0, 0.7)'}} >
             <img src={image} alt="Selected" style={{ width : 200 , height : 200}} />

        </View>}

  <View>
  <View style={{ position: 'absolute', bottom: keyboardHeight, left: 0, right: 0 , flexDirection : 'row' , backgroundColor : '#e8e6e3' , height : 45 , }}>
    <View style={{paddingLeft : 17 , maxHeight : 40, borderColor: 'black', borderWidth: 2, borderRadius: 20, flex: 1 , flexDirection:'row', paddingRight:5}}> 
  <TextInput
    style={{flex:1}}
    placeholderTextColor="#6a0c0c"
    placeholder="Type your message"
    type="text"
    value={typedMsg}
    onChangeText={(text) => setTypedMsg(text)}
    multiline={true}
  />

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
    
    </View>

     <TouchableOpacity onPress={handleSubmit} style={{ width : 50 , backgroundColor : '#9d1e1e', borderRadius : 6  ,  alignItems : 'center' , justifyContent: 'center' , height : 35, marginLeft : 4 , marginRight : 6}}  >
      <SendIcon style={{color : 'white'}}/>

    </TouchableOpacity>
   
  </View>
  </View>
</View>
)

}
export default React.memo(MainGroup)