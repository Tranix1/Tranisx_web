import React from "react";

import { View , Text , TouchableOpacity , ScrollView , Image , TextInput , Keyboard} from "react-native";
function SignIn(){
    
return(
      <View >
        <TextInput
          placeholder="Email"
          // onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          placeholder="Password"
          type="password"
          // onChange={(e) => setPassword(e.target.value)}          
        />

        <TouchableOpacity  >
        <Text  className="singInButton">Login</Text>
        </TouchableOpacity>

    </View>
)
}
export default React.memo(SignIn)