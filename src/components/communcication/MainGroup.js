import React ,{useState, useEffect} from "react";
import { View , Text , TouchableOpacity , ScrollView , Image , TextInput , Keyboard} from "react-native";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable ,} from "firebase/storage";
import {addDoc , onSnapshot , orderBy , query , serverTimestamp , collection, } from "firebase/firestore"
import { db , auth} from "../config/fireBase";


import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';

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




 const mainGroup = collection(db ,'MainGroupChats');

const [typedMsg , setTypedMsg] = React.useState('')

const handleSubmit = async (event) => {
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
    });
  } catch (err) {
    console.error(err);
  }
  // Reset form fields
  setTypedMsg('')
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
                <Image
                  source={{ uri: item.addedImage }}
                  style={{ width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10 }}
                />
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
                <Image
                  source={{ uri: item.addedImage }}
                  style={{ width: '100%', height: 200, resizeMode: 'cover', marginBottom: 10 }}
                />
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
<View style={{ position : 'absolute' ,bottom : 0 , top : 0 , width:420 , }}>
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


  <View>
  <View style={{ position: 'absolute', bottom: keyboardHeight, left: 0, right: 0 , flexDirection : 'row' , backgroundColor : '#e8e6e3' , height : 45 , }}>
  <TextInput
    style={{paddingLeft : 17 , maxHeight : 40, borderColor: 'black', borderWidth: 2, borderRadius: 20, flex: 1 }}
    placeholderTextColor="#6a0c0c"
    placeholder="Type your message"
    type="text"
    value={typedMsg}
    onChangeText={(text) => setTypedMsg(text)}
    multiline={true}
  />

     <TouchableOpacity onPress={handleSubmit} style={{ width : 50 , backgroundColor : '#9d1e1e', borderRadius : 6  ,  alignItems : 'center' , justifyContent: 'center' , height : 35, marginLeft : 4 , marginRight : 6}}  >
      <SendIcon style={{color : 'white'}}/>

    </TouchableOpacity>
   
  </View>
  </View>
</View>
)

}
export default React.memo(MainGroup)