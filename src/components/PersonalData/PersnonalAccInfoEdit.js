import React ,{useEffect} from "react";
// import CountryPicker from 'react-native-country-picker-modal';
import { View , TouchableOpacity , Text , TextInput, StyleSheet} from "react-native";

import { db , auth } from "../config/fireBase";

import { signOut} from  'firebase/auth'
import {  updateDoc , doc } from 'firebase/firestore';
import inputstyles from "../styles/inputElement";

import ReactFlagsSelect from "react-flags-select";
import { countries } from 'countries-list';


import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function PersonalAccInfoEdit({username ,contact }){

const navigate = useNavigate()
const [ newUserName , setNewUserName ] = React.useState('')

    const handleUpdateUsername = async () => {
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;

          const docRef = doc(db, 'personalData', userId);
          await updateDoc(docRef, { username: newUserName,  });
          alert("Username updated successfully!");
          setNewUserName("")
        }
      } catch (err) {
        console.error(err);
      }
    };



const [ newCOntact , setNewCOntact ] = React.useState('')

const [countryCode, setCountryCode] = React.useState('');

  
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

  
    const handleUpdateContact = async () => {
      if(!countryCode){
        alert("Select you country code")
        return
      }else if(countryCode && !newCOntact){
        alert("Enter phone number")
        return
      }
      try {
        if (auth.currentUser) {
          const userId = auth.currentUser.uid;

          const docRef = doc(db, 'personalData', userId);
          await updateDoc(docRef, { contact: `+${countryCode}${newCOntact}` });
          setNewCOntact("")
          alert("phone number updated successfully!");
        }
      } catch (err) {
        console.error(err);
      }
    };


  const [editUsername , setintrstUsername] = React.useState(false)

  function toggleIntrstUserName (){
  setintrstUsername(prev => !prev)
  setEditContact(prev=> false)
  }


  const [editContact , setEditContact] = React.useState(false)

  function toggleEditContac (){
  setEditContact(prev => !prev)
  setintrstUsername(orev => false)
  }
  const logout = async ()=>{
    
    try{
    await signOut(auth)
     navigate('/')
    }catch (err){
      console.error(err)
    }
  }



return(
  <View style={{alignItems :'center' , paddingTop: 80}} >
   <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , justifyContent :'space-between'}} >
    <View style={{flexDirection:'row'}} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
           <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        <Text style={{fontSize: 20 , color : 'white'}} > Personal Information </Text>
      </View>
        <TouchableOpacity onPress={logout}style={{backgroundColor:'white'}} >
          <Text>logout </Text>
        </TouchableOpacity>
       </View>
  { !editContact && !editUsername &&<View>
      <TouchableOpacity onPress={toggleIntrstUserName}  style={styles.selectToEdit} >

          <Text>Username : {username} </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleEditContac}  style={styles.selectToEdit} >
        <Text>contact : {contact} </Text>
      </TouchableOpacity>
    </View>}


    { editUsername&& <View style={{paddingTop:20}} >
      <TextInput      
            placeholder="Username"
            type="text"
            value={newUserName}
            onChangeText={(text) => setNewUserName(text)}
            style={inputstyles.inputElem}            
      />

        <View style={{flexDirection : 'row', paddingTop : 15 , justifyContent : 'space-evenly'}} >
          <TouchableOpacity style={styles.cancelBtn} onPress={toggleIntrstUserName} >
            <Text>cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleUpdateUsername} style={styles.saveBtn} >
            <Text style={{color : 'white'}}>Save</Text>
          </TouchableOpacity>
        </View>
        </View>}


   { editContact &&  <View  >

       <ReactFlagsSelect
        select={countryCode}
        onSelect={(code) => handleCountrySelect(code)}
        placeholder="Select Country"
        searchable
      />
      
      { countryCode&& <Text> Country code {countryCode}</Text>} 
      <TextInput
            placeholder="Phone number"
            type="text"
            value={newCOntact}
           onChangeText={(text) => setNewCOntact(text)}
            keyboardType="numeric"
            style={inputstyles.inputElem}            
          />

        <View style={{flexDirection : 'row', paddingTop : 15 , justifyContent : 'space-evenly'}}>
          <TouchableOpacity style={styles.cancelBtn}onPress={toggleEditContac} >
            <Text>cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleUpdateContact} style={styles.saveBtn}>
            <Text style={{color : 'white'}}>Save</Text>
          </TouchableOpacity>
            
        </View>
      </View>} 

  </View>
)


}
export default React.memo(PersonalAccInfoEdit)

const styles = StyleSheet.create({
   selectToEdit :{
      width : 300 ,
       height : 80 , 
       borderWidth: 1 , 
       borderColor:"#6a0c0c"  ,
       alignItems : 'center' ,
       justifyContent:'center' ,
       marginBottom : 20
   },
   saveBtn : {
   backgroundColor : '#6a0c0c' , 
   width : 70 ,
   height : 35 ,
   borderRadius: 5 , 
   alignItems : 'center' ,
   justifyContent : 'center'
  } ,
  cancelBtn : { 
   width : 70 ,
   height : 35 ,
   borderRadius: 5 , 
   alignItems : 'center' ,
   justifyContent : 'center',
   borderWidth : 1 ,
   borderColor : '#6a0c0c'
  }

});