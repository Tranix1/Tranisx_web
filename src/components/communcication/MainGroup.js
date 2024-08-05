import React ,{useState, useEffect} from "react";
import { View , Text , TouchableOpacity , ScrollView , Image , TextInput , Keyboard} from "react-native";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable ,} from "firebase/storage";
import {addDoc , onSnapshot , orderBy , query , serverTimestamp , collection, } from "firebase/firestore"
import { db , auth} from "../config/fireBase";


// import { Ionicons } from '@expo/vector-icons';

function MainGroup({username}){


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




 const [image, setImage] = useState(null);








 const mainGroup = collection(db ,'mainGroup');

const [typedMsg , setTypedMsg] = React.useState('')

const handleSubmit = async (event) => {
  try {
    await addDoc(mainGroup, {
      typedMsg: typedMsg,
      username: username,
      userId: auth.currentUser.uid,
      currentDate: currentDate,
      // currentTime: currentTime,
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



const currentDate = new Date();

// Format the date as "Thursday, July 25, 2024"
const formattedDate = currentDate.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});
const prevDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));

// Format the previous date as "Thursday, July 25, 2024"
const formattedPreviousDate = prevDate.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

 let previousDate = null;
 const dspMessages =   message.map((item) => {
      let messageDate = item.currentDate;
      const showMessageDate = previousDate !== messageDate;
      previousDate = messageDate;

      if (messageDate === formattedDate) {
        messageDate = 'today';
      } else if (messageDate === formattedPreviousDate) {
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
<View style={{ flex: 1 , paddingBottom : 6}}>
 <View key={item.id} style={{flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
            <Text>backkkkk</Text>
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Iterms  </Text>
       </View>


    <ScrollView      style={{ flex: 1, paddingBottom: 0, paddingLeft: 7, paddingRight: 7, paddingTop: 20, marginBottom: 40 }}
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

      {/* <Ionicons name="send" size={25} color="white" /> */}

    </TouchableOpacity>
   
  </View>
  </View>
</View>
)

}
export default React.memo(MainGroup)