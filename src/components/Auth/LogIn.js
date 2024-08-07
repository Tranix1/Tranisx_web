import React from "react";
import { createUserWithEmailAndPassword , } from 'firebase/auth';
import { db , auth } from "../config/fireBase";
import { View , TextInput ,TouchableOpacity , Text, Alert} from "react-native";

import { useNavigate } from "react-router-dom";

import inputstyles from "../styles/inputElement"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function CreateUser({}) {
  const navigate = useNavigate()

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error , setError]= React.useState("")

  const create = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      setEmail("")
      setPassword("")
      navigate('/addPersnoalInfo/')
    } catch (err) {
      setError(err.toString());
    }
  };

 

  return (
      <View style={{alignItems:'center' , paddingTop: 90}} >
         <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Create New Account </Text>
       </View>
        <TouchableOpacity onPress={()=>navigate('/signInexistAcc/')} style={{position : 'absolute' , top : 83 , right: 10 ,backgroundColor : '#6a0c0c' , width : 80 , height : 35 , borderRadius: 5 , alignItems : 'center' , justifyContent : 'center' }}>
          <Text> Sign In</Text>
        </TouchableOpacity>

        {error &&<Text>{error} </Text>}

        <TextInput
          placeholder="Email"
           onChangeText={(text) => setEmail(text)}
           style={inputstyles.inputElem}
        />

        <TextInput
          placeholder="Password"
          type="password"
           onChangeText={(text) => setPassword(text)}
           style={inputstyles.inputElem}
        />

        <TouchableOpacity onPress={create} >
        <Text style={{textDecorationLine : 'underline', fontSize : 17}}>Create</Text>
        </TouchableOpacity>

    </View>
  );
}

export default CreateUser;