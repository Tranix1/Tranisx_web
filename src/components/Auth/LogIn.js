import React from "react";
import { createUserWithEmailAndPassword , } from 'firebase/auth';
import { db , auth } from "../config/fireBase";
import { View , TextInput ,TouchableOpacity , Text, Alert} from "react-native";

import inputstyles from "../styles/inputElement"
import { useNavigate } from "react-router-dom";

function CreateUser({route , navigation}) {
  const navigate = useNavigate()

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error , setError]= React.useState("")

  const create = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      setEmail("")
      setPassword("")
      navigate('addPersnoalInfo')
    } catch (err) {
      setError(err.toString());
    }
  };

 

  return (
      <View style={{alignItems:'center' , marginTop: 60}} >
        <Text> </Text>
        <Text>{error} </Text>
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