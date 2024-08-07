import React from "react";
import { View,TouchableOpacity ,  Text  } from "react-native";
import { onSnapshot  , query ,collection,where } from "firebase/firestore"
import { auth ,db} from "../config/fireBase";


import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function SelectChat(){


const navigate = useNavigate()

  const [ppleInTouch , setPpleInTouch] =React.useState([])
React.useEffect(() => {
  try {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const whenSendingMsg = query(collection(db, "ppleInTouch"), where("msgSenderId", "==", userId));
      const whenReceiving = query(collection(db, "ppleInTouch"), where("msgReceiverId", "==", userId));

      let sendedMsgs = [];
      const unsubscribe1 = onSnapshot(whenSendingMsg, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const dataWithId = { id: doc.id, ...doc.data() };
          sendedMsgs.push(dataWithId);
        });

         sendedMsgs = [ ...sendedMsgs];

      });

      const unsubscribe2 = onSnapshot(whenReceiving, (querySnapshot) => {
        const reacevedMsg = [];
        querySnapshot.forEach((doc) => {
          const dataWithId = { id: doc.id, ...doc.data() };
          reacevedMsg.push(dataWithId);
        });

        const combineBoth = [...reacevedMsg, ...sendedMsgs];
        setPpleInTouch(combineBoth);
      });

      return () => {
        unsubscribe1(); // Clean up the listener when the component unmounts
        unsubscribe2(); // Clean up the listener when the component unmounts
      };
    }
  } catch (error) {
    console.error(error);
  }
  
}, []);


  let _ppleInTouch = ppleInTouch.map((item)=>{
    const userId = auth.currentUser.uid

        const serializedItem = JSON.stringify(item);
    if(item.msgSenderId === userId){
    return(
      <TouchableOpacity  key={item.id} style={{height : 30  , alignItems : 'center' , margin : 10 }} onPress={()=>navigate(`/message/${encodeURIComponent(serializedItem)}`)}>
        <Text>{item.receiverName} </Text>
      </TouchableOpacity>
    )
    }else{
      return(
        <TouchableOpacity onPress={()=>navigate(`/message/${encodeURIComponent(serializedItem)}`)} key={item.id}>
          <Text>{item.senderName} </Text>
        </TouchableOpacity>
      )
    }
  } )

return(<View style={{padding : 10 , paddingTop : 80 , }} >
   <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Iterms  </Text>
       </View>
  <TouchableOpacity onPress={()=>navigate('/mainGroup') } style={{borderBlockColor : "#6a0c0c" , width : 300 , borderWidth : 2, marginTop :10 ,  height : 40  ,justifyContent : 'center' , alignItems:'center'}} >
    <Text>Main Group </Text>
  </TouchableOpacity>
  {_ppleInTouch}
</View>

)
}
export default React.memo(SelectChat)