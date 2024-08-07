import React from "react";

import { View , Text , TouchableOpacity ,TextInput , ActivityIndicator} from "react-native";
// import { signInWithEmailAndPassword , } from 'firebase/auth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import { useNavigate } from "react-router-dom";

import inputstyles from "../styles/inputElement"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function SignIn(){

  const navigate = useNavigate()


  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error , setError]= React.useState("")
  const [spinnerItem, setSpinnerItem] = React.useState(null);

  const auth = getAuth();

  const handleSignIn  = async () => {
    setSpinnerItem(true)
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail("")
      setPassword("")
      navigate('/')
      setSpinnerItem(false)
    } catch (error) {
      setError(error.message.toString());
      setSpinnerItem(false)
    }
  };


return(
      <View style={{paddingTop : 100 , alignItems : 'center'}}>
         <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Sign In existing Account </Text>
       </View>

      {error && <Text>{error}</Text>}
       
        <TextInput
          placeholder="Email"
          style={inputstyles.inputElem}
           onChangeText={(text) => setEmail(text)}
          />

        <TextInput
          placeholder="Password"
          type="password"
          onChangeText={(text) => setPassword(text)}
           style={inputstyles.inputElem}
        />

        <TouchableOpacity  onPress={handleSignIn}>
        <Text  style={{textDecorationLine : 'underline', fontSize : 17}}>Sign In</Text>
        </TouchableOpacity>

    </View>
)
}
export default React.memo(SignIn)