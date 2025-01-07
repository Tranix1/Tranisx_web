import React from "react";
import {Alert, TextInput, TouchableOpacity, View ,  Text , ActivityIndicator}from "react-native"
import {auth , db} from "../config/fireBase"
import { query , doc ,  getDocs,collection,where,setDoc } from "firebase/firestore"

// import CountryPicker from 'react-native-country-picker-modal';
import inputstyles from "../styles/inputElement";

import ReactFlagsSelect from "react-flags-select";
import { countries } from 'countries-list';
import { useNavigate } from "react-router-dom";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function PersonalAccInfo({}){
  

  const navigate = useNavigate()

  const [errorOccur , setErrorOccur] = React.useState("")
  const [username, setUsername] = React.useState("");
  const [spinnerItem, setSpinnerItem] = React.useState(null);

  const [contact, setContact] = React.useState("");
  const [countryCode , setCountryCode] = React.useState(null)

const handleSubmitData = async (event) => {
    setSpinnerItem(true)
    if(!countryCode){
        alert("Select country code ")
        return
    }else if(!contact){
        alert("Enter your phone number")
        return
    }
    
    try {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
      const usernameValue = username; // Store the username value in a separate variable

      if (usernameValue) { // Check if the username value is defined and not empty
        // Check if username already exists
        const usernamesRef = collection(db, 'personalData'); // Get the usernames collection reference
        const usernameQuery = query(usernamesRef, where('username', '==', usernameValue)); // Create a query to check username

        const querySnapshot = await getDocs(usernameQuery); // Get matching documents, if any

        if (querySnapshot.empty) {
          // Username is not found, add it to the database
          await setDoc(doc(db, 'personalData', userId ), {
             username: usernameValue, 
             contact: `+${countryCode}${contact}` ,
             shopLocation : "",
             email : auth.currentUser.email 
              });
      setSpinnerItem(false)
          setUsername("");
          setContact("");
           navigate('/')
        } else {
          // Username already exists, handle the situation here
          setErrorOccur('Username already exists!');
      setSpinnerItem(false)
        }
      } else {
        setErrorOccur('Username is undefined or empty!');
      setSpinnerItem(false)
      }
    }
  } catch (err) {
      setErrorOccur(err.toString());
      setSpinnerItem(false)
  }
};

  
  const getCallingCode = (countryCode) => {
    const countryData = countries[countryCode];
    if (countryData) {
      return countryData.phone;
    }
    return null;
  };

  const handleCountrySelect = (code) => {
      const selectedCallingCode = getCallingCode(code);
      setCountryCode(selectedCallingCode);
};

    return(
        <View style={{paddingTop:80 , alignItems : 'center'}} > 
 <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > personal Infomation  </Text>
       </View>
            {errorOccur&& <Text>{errorOccur} </Text>}
    
      <ReactFlagsSelect
        select={countryCode}
        onSelect={(code) => handleCountrySelect(code)}
        placeholder="Select Country"
        searchable
      />
    

      {<Text>Country code{countryCode}</Text>}
          <TextInput
            placeholder="Username"
            type="text"
            value={username}
           onChangeText={(text) => setUsername(text)}
           style={inputstyles.inputElem}
          />
        
          {spinnerItem && <ActivityIndicator/>}
          <TextInput
            placeholder="contact"
            type="text"
            value={contact}
           onChangeText={(text) => setContact(text)}
            keyboardType="numeric"
           style={inputstyles.inputElem}
          />
        <TouchableOpacity onPress={handleSubmitData} >
            <Text style={{textDecorationLine : 'underline', fontSize : 17}} >Get Started </Text>
        </TouchableOpacity>
        
        </View>

    )
}
export default React.memo(PersonalAccInfo)