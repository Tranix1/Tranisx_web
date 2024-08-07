import React from "react";
import { db, auth } from "../config/fireBase";
import { collection, doc, getDoc, addDoc, serverTimestamp ,} from 'firebase/firestore';

import { View , TextInput , Text, Alert ,TouchableOpacity , ActivityIndicator} from "react-native";

import inputstyles from "../styles/inputElement";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {useNavigate} from 'react-router-dom';
function AddLoadDB ({username ,contact , isVerified }) {


const navigate = useNavigate()

  const loadsCollection = collection(db, "Loads");
  const [formData, setFormData] = React.useState({
    typeofLoad: "",
    fromLocation: "",
    toLocation: "",
    ratePerTonne: 0,
    paymentTerms: "",
    requirements: "",
    additionalInfo: "",
  });

 
  

  const  handleTypedText  = (value, fieldName) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };
  
    const [spinnerItem, setSpinnerItem] = React.useState(false);
  const handleSubmit = async () => {
    if(!formData.ratePerTonne || !formData.typeofLoad || !formData.toLocation || !formData.fromLocation || !formData.paymentTerms){
        alert('Enter Rate , Commodity ,  ','Routes and Payment terms' )
        return
      }
      setSpinnerItem(true)

      const userId = auth.currentUser.uid
    
    try {
      const docRef = await addDoc(loadsCollection, {
        userId: userId, // Add the user ID to the document
        companyName: username,
        typeofLoad: formData.typeofLoad,
        contact: contact,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        ratePerTonne: formData.ratePerTonne,
        paymentTerms: formData.paymentTerms,
        requirements: formData.requirements,
        additionalInfo: formData.additionalInfo,
        deletionTime :Date.now() + 3 * 24 * 60 * 60 * 1000 ,
        timeStamp : serverTimestamp() ,
        isVerified : isVerified ,

      });

      setFormData({
        typeofLoad: "",
        fromLocation: "",
        toLocation: "",
        ratePerTonne: "",
        paymentTerms: "",
        requirements: "",
        additionalInfo: "",
      });
      setSpinnerItem(false)
    } catch (err) {
      console.error(err);
      }
  };

  return (
    <View   style={{alignItems :'center', paddingTop : 80}}>
 <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />

        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Load  </Text>
       </View>

  <TextInput
    value={formData.typeofLoad}
    placeholderTextColor="#6a0c0c"
    placeholder="Type of Load"
    onChangeText={(text) => handleTypedText(text, 'typeofLoad')}
    type="text"
    style={inputstyles.addIterms }
  />

  <TextInput 
    value={formData.fromLocation}
    placeholderTextColor="#6a0c0c"
    placeholder="From Loacation"
    onChangeText={(text) => handleTypedText(text, 'fromLocation')}
    type="text"
    style={inputstyles.addIterms }
  />
  <TextInput
    value={formData.toLocation}
    placeholderTextColor="#6a0c0c"
    placeholder="To location"
    onChangeText={(text) => handleTypedText(text, 'toLocation')}
    type="text"
    style={inputstyles.addIterms }
  />
    <TextInput
        onChangeText={(text) => handleTypedText(text, 'ratePerTonne')}
        name="ratePerTonne"
        value={formData.ratePerTonne}
        keyboardType="numeric"
        placeholderTextColor="#6a0c0c"
        style={inputstyles.addIterms }
        placeholder="Enter rate here"
      />
  
      { spinnerItem &&<ActivityIndicator size={36} />}
  <TextInput
    value={formData.paymentTerms}
    placeholderTextColor="#6a0c0c"
    placeholder="Payment Terms"
    onChangeText={(text) => handleTypedText(text, 'paymentTerms')}
    type="text"
    style={inputstyles.addIterms }
  />
  <TextInput
     value={formData.requirements}
    placeholderTextColor="#6a0c0c"
    placeholder="Requirements"
    onChangeText={(text) => handleTypedText(text, 'requirements')}
    type="text"
    style={inputstyles.addIterms }
  />

  <TextInput 
    value={formData.additionalInfo}
    placeholderTextColor="#6a0c0c"
    placeholder="Additional Information"
    onChangeText={(text) => handleTypedText(text, 'additionalInfo')}
    type="text"
    style={inputstyles.addIterms }
  />
  {/* <Text>acive Loading</Text> */}

  <TouchableOpacity  onPress={handleSubmit} style={{backgroundColor : '#6a0c0c' , width : 80 , height : 35 , borderRadius: 5 , alignItems : 'center' , justifyContent : 'center'}}>
    <Text style={{color : 'white'}}>submit</Text>
  </TouchableOpacity>

</View>
  );
}

export default AddLoadDB;
