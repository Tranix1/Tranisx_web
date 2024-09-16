import React from "react";
import { db, auth } from "../config/fireBase";
import { collection, doc, getDoc, addDoc, serverTimestamp ,query , where , getDocs} from 'firebase/firestore';

import { View , TextInput , Text, Alert ,TouchableOpacity , ActivityIndicator, StyleSheet} from "react-native";

import inputstyles from "../styles/inputElement";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {useNavigate} from 'react-router-dom';

function VerifyNewUser () {

const navigate = useNavigate()
const [error , setError]= React.useState("")

  const loadsCollection = collection(db, "verifiedUsers");
 
  const [username, setUsername] = React.useState("");
  
  const [verificationState , setverificationState] = React.useState(false)
  const [addedUserId , setAddedUserId] = React.useState('')

    const [spinnerItem, setSpinnerItem] = React.useState(false);
  const handleSubmit = async () => {
   
    try {
      const docRef = await addDoc(loadsCollection, {
        isVerifiedValue : verificationState ,
        deletionTime :Date.now() + 30 * 24 * 60 * 60 * 1000 ,
        timeStamp : serverTimestamp() ,
        userId : addedUserId
    });

    
      setSpinnerItem(false)
    } catch (err) {
      setSpinnerItem(false)
      setError(err.toString());
      }
  };

  return (
    <View   style={{alignItems :'center', paddingTop : 80}}>
 <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />

        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Load  </Text>
       </View>
       
         <TextInput
            placeholder="Username"
            type="text"
            value={username}
           onChangeText={(text) => setUsername(text)}
           style={inputstyles.inputElem}
          />
        <TouchableOpacity>
          <Text>verify </Text>
        </TouchableOpacity>


      { spinnerItem &&<ActivityIndicator size={36} />}
        {error &&<Text>{error}</Text>}



  <TouchableOpacity  onPress={handleSubmit} style={{backgroundColor : '#6a0c0c' , width : 80 , height : 30 , borderRadius: 5 , alignItems : 'center' , justifyContent : 'center'}}>
    <Text style={{color : 'white'}}>submit</Text>
  </TouchableOpacity>

</View>
  );
}

export default React.memo(VerifyNewUser);


