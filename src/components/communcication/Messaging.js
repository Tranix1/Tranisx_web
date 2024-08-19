import React ,{useState, useEffect} from "react";
import { View , Text , TouchableOpacity , ScrollView , Image , TextInput , Keyboard} from "react-native";
import {addDoc , onSnapshot , orderBy , query ,doc , serverTimestamp , getDocs,collection,where } from "firebase/firestore"
import { db  , auth} from "../config/fireBase";
import { storage } from "../config/fireBase";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable ,} from "firebase/storage";

import { useParams , useNavigate} from 'react-router-dom';
// import { Ionicons } from "@expo/vector-icons";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
function Messaging ({username}){
  

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


    const navigate = useNavigate()
    let {chatStarterId ,starterCompanyName , gchatId  , senderName , receiverName} = useParams()

      let chatId = gchatId

      const contactId =chatStarterId
      
      useEffect(() => {
  const userId = auth.currentUser.uid


    if(!chatId){ 
    let addChatId = `${contactId}${userId}` ;
    const existingChat =  checkExistingChat(addChatId);
    if(existingChat){
      chatId = addChatId
    }
    }



  let chatRef 
  if(chatId){

    chatRef = doc(db, "Chats", chatId);
  }else{
    let chatId = `${userId}${contactId}`; 
    chatRef = doc(db, "Chats", chatId);
    
  }
  const messagesQuery = query(
    collection(chatRef, "messages"),
    orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList = [];
      snapshot.forEach((doc) => {
        messageList.push(doc.data());
      });
      setMessages(messageList.reverse());
    });
    
    return () => unsubscribe(); // Cleanup the listener when the component unmounts
}, [ contactId ]);


 const ppleInTouch = collection(db ,'ppleInTouch');

const checkExistingChat = async (chatId) => {
const chatsRef = collection(db, 'ppleInTouch'); // Reference to the 'ppleInTouch' collection
const chatQuery = query(chatsRef, where('chatId', '==', chatId)); // Query for matching chat ID

    const querySnapshot = await getDocs(chatQuery);  
    // Check if any documents exist with the chat ID
    return !querySnapshot.empty; // Returns true if a document exists, false otherwise
  };



const [messages, setMessages] = useState([]);
const [message, setMessage] = useState("");
 
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
      const imageRef = ref(storage , `chats/${imageUpload.name + new Date().getTime()  }`)
      uploadBytes(imageRef , imageUpload).then(()=>{
      })
    }


const handleSubmit = async () => {

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

 let addChatId 

const existingChat = await checkExistingChat(addChatId);

const userId = auth.currentUser.uid
try {
  
    if(!chatId){
    const chatId = `${userId}${contactId}` ;
    const chatRef = doc(db, "Chats", chatId);
  await addDoc(collection(chatRef, "messages"), {
    message: message,
    msgSenderId : userId,
    senderName : username ,
    receiverName : starterCompanyName ,
    msgReceiverId: contactId ,
    chatId : chatId ,
    timestamp : serverTimestamp() ,
    currentDate: currentDateTime,
    currentTime: currentTime,
    addedImage: imageUrl, 

    });  
  addChatId = chatId
}else{
  const chatId = chatId
  const chatRef = doc(db, "Chats", chatId);
  await addDoc(collection(chatRef, "messages"), {
    message: message,
    senderName : username ,
    receiverName : senderName ,
    chatId : chatId ,
    timestamp : serverTimestamp() ,
    currentDate: currentDateTime,
    currentTime: currentTime,
   
  });  
  addChatId = chatId
}


if (!existingChat) {
  // Chat doesn't exist, add it to 'ppleInTouch'
  await addDoc(ppleInTouch, {
    msgSenderId : userId,
    msgReceiverId: contactId,
    receiverName : starterCompanyName  ,
    senderName  : username  ,
    chatId : addChatId,
    timestamp : serverTimestamp() ,
  });
}
  setMessage("");
} catch (err) {
  console.error(err);
}
};

        let previousDate = null;
        let dspMessages = messages.map((item, index) => {
          let messageDate = item.currentDate;
          const showMessageDate = previousDate !== messageDate;
          previousDate = messageDate;

          if (messageDate === currentDateTime) {
                messageDate = 'today';
              } else if (messageDate === previousDateTime) {
                messageDate = 'yesterday';
              }

         const userId = auth.currentUser.uid
          if (item.msgReceiverId === userId) {
            return (
            <View key={item.id}>
            {showMessageDate && <Text>{messageDate}</Text>}
            <View style={{marginBottom: 2,backgroundColor: 'lightGay',marginLeft: 70,justifyContent:'center' ,paddingLeft:5 ,paddingBottom: 6 ,paddingTop:7}}>

              {item.addedImage && (
                   <img src={item.addedImage} style={{height : 200 , marginBottom : 10}}/>
              )}
              <Text style={{color:'white'}} >{item.message}</Text>
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
            <View style={{marginBottom: 2,backgroundColor: 'rgb(129,201,149)',marginLeft: 70,justifyContent:'center' ,paddingLeft:5 ,paddingBottom: 6 ,paddingTop:7}}>

              {item.addedImage && (
                   <img src={item.addedImage} style={{height : 200 , marginBottom : 10}}/>
              )}
              <Text style={{color:'white'}} >{item.message}</Text>
              <Text style={{ fontSize: 12, position: 'absolute', right: 8, bottom: 0 }}>
                {item.currentTime}
                
              </Text>
            </View>
          </View>
            );
          }
        });

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
return (<View style={{ position : 'absolute' , top :0 , bottom : 0, width : 390 , }}>
        <View  style={{flexDirection : 'row' , height : 84  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
        <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />

        </TouchableOpacity>
        <Text style={{fontSize: 20 , color : 'white'}} >{starterCompanyName}  </Text>
       </View>


    <ScrollView      style={{ flex: 1, paddingBottom: 0, paddingLeft: 7, paddingRight: 7, paddingTop: 20, marginBottom: 50 }}
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
    style={{flex:1 , }}
    placeholderTextColor="#6a0c0c"
    placeholder="Type your message"
    type="text"
    value={message  }
    onChangeText={(text) => setMessage(text)}
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
</View>);

}
export default React.memo(Messaging)