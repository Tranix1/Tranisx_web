import React from "react";
import { createUserWithEmailAndPassword ,sendEmailVerification } from 'firebase/auth';
import { db , auth } from "../config/fireBase";
import { View , TextInput ,TouchableOpacity , Text, ActivityIndicator} from "react-native";

import { useNavigate } from "react-router-dom";

import inputstyles from "../styles/inputElement"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function CreateUser({}) {
  const navigate = useNavigate()

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error , setError]= React.useState("")
  const [spinnerItem, setSpinnerItem] = React.useState(null);

  const create = async () => {
     setSpinnerItem(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await  
      sendEmailVerification(user); 
        setPassword("")
        setEmail("")
        setSpinnerItem(false)
        alert('Verification Email Sent', 'Please Verify Your Email To Continue');
      navigate('/addPersnoalInfo/')
    } catch (error) {
        setSpinnerItem(false)
      setError(error.message);
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

        {error &&<Text>{error} </Text>}

        <TextInput
          placeholder="Email"
           onChangeText={(text) => setEmail(text)}
           style={inputstyles.inputElem}
        />

          {spinnerItem && <ActivityIndicator/>}
        <TextInput
          placeholder="Password"
          type="password"
           onChangeText={(text) => setPassword(text)}
           style={inputstyles.inputElem}
        />

        <TouchableOpacity onPress={create} style={{backgroundColor : '#6a0c0c' , width : 80 , height : 35 , borderRadius: 5 , alignItems : 'center' , justifyContent : 'center' , marginBottom : 10}} >
        <Text style={{color : 'white'}}>Create</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>navigate('/signInexistAcc/')} style={{ height : 35,justifyContent : 'center' , alignItems : 'center' ,width : 80 ,borderWidth: 2 ,borderColor:"#6a0c0c" ,borderRadius: 10}}>
                    <Text style={{color :'#6a0c0c'}}>  Sign In</Text>
        </TouchableOpacity>

    </View>
  );
}

export default React.memo(CreateUser);