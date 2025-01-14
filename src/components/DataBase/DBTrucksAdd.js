import React,{useState} from "react";
import { storage } from "../config/fireBase";
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable ,} from "firebase/storage";
import { collection, doc, getDoc, addDoc ,serverTimestamp} from 'firebase/firestore';
import { db, auth } from "../config/fireBase";
import {View, TextInput , Text ,    TouchableOpacity , Button , Image , ActivityIndicator,StyleSheet, ScrollView,Linking} from "react-native"
import inputstyles from "../styles/inputElement";

// import * as ImagePicker from 'expo-image-picker';

// import Fontisto from '@expo/vector-icons/Fontisto';
import CameraAltIcon from '@mui/icons-material/CameraAlt';


import VerifiedIcon from '@mui/icons-material/Verified';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams , useNavigate } from 'react-router-dom';

function DBTrucksAdd( { username ,contact , isVerified ,isBlackListed ,blackLWarning,blockVerifiedU ,verifyOngoing} ) {

    const {truckType, verifiedLoadG , fromLocation  , toLocation,truckTonnageG} = useParams()

    let verifiedLoad = null
    verifiedLoadG === "verifiedLoad" ?verifiedLoad= true : verifiedLoad = false

    const navigate = useNavigate()
  const trucksDB = collection(db, "Trucks");

 
  const [formData, setFormData] = React.useState({
    fromLocation: verifiedLoad ? fromLocation : "",
    toLocation : verifiedLoad ? toLocation : "",
    additionalInfo :"" ,
    trailerType : '',
    trailerModel :"" ,
      
    horseReg :"" ,
    trailerReg :"",
    scndTrailerReg :"",
    driverName :"",
    driverLicense :"" ,
    driverPassport :"" ,
    driverPhone :"",

    truckOwnerPhone :"",
    truckOwnerWhatsApp :"",
    businessLoction :"",
    maximumWheight :"" ,

  });


  const [location , setlocation] =   React.useState("")
  const [localOperation , setLocalLoads]=React.useState(false)

  function toggleLocalLoads(){
    setLocalLoads(prevState => !prevState)
  }
    function specifyLocation(loc){
    setlocation(loc)
    setLocalLoads(prev => false)
  }

  const [ truckDetails , setTruckDDsp]=React.useState(false)

  function togglrTruckDe(){
    setTruckDDsp(prev=>!prev) 
    setTruckBuzDDsp(false)
    setDriverDDsp(false)
  }



  const [ truckBuzDe , setTruckBuzDDsp]=React.useState(false)

  function togglrTruckBuzDe(){
    setTruckBuzDDsp(prev=>!prev)
    setDriverDDsp(false)
    setTruckDDsp(false)
  }

  const [driverDetails , setDriverDDsp]=React.useState(false)

  function togglrDriverDe(){
     setTruckBuzDDsp(false)
    setTruckDDsp(false)
    setDriverDDsp(prev=>!prev)
  }

  
  const [image, setImage] = useState(null);  
  const [ imageUpload, setImageUpload] = React.useState(null)    


    const handleFileInputChange = (e) => {
    // Handle file input change here
    setImageUpload(e.target.files[0])
    const file = e.target.files[0];

     if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };



  const  handlechange  = (value, fieldName) => {
 
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

    const uploadImage = ()=>{
      if(imageUpload === null) return
      const imageRef = ref(storage , `Trucks/${imageUpload.name + new Date().getTime()  }`)
      uploadBytes(imageRef , imageUpload).then(()=>{
      })
    }

    const [spinnerItem, setSpinnerItem] = React.useState(false);
    
  const handleSubmit = async () => {

      setSpinnerItem(true)
        uploadImage()
        let imageUrl
        if(image){
       const imageRef =  ref(storage , `Trucks/${imageUpload.name}`)
       await uploadBytes(imageRef , imageUpload)
       // get image  url 
        imageUrl = await getDownloadURL(imageRef)
          }else{
            imageUrl = null
          }
          
        if(isBlackListed ){
        return
      }else if(blackLWarning ){
        alert("Your account is currently under investigation.\n Please contact us for resolution")
        Linking.openURL(`whatsapp://send?phone=+263716326160  &text=${encodeURIComponent(`Good day \nMy Transix account is being investigated whats the issue and how can we resolve it \nMy username is ${username} \n`)} `)
        return
      }else if(blockVerifiedU){
        alert("Important: You are a blocked verified user.\n Legal action may be taken if necessary. \nContact us immediately.")
        Linking.openURL(`whatsapp://send?phone=+263716326160  &text=${encodeURIComponent(`Good day \n I am a blocked Transix verified User \nMy username is ${username} \n How can we speed up the resolving process l am legit`)} `)
        return
      }
        if(imageUrl){
          imageUrl = imageUrl
        }else{
          imageUrl = null
        }
           if(!location){
                alert("Choose were the truck operate")
                return
              }
        if(!formData.fromLocation || !formData.toLocation){
          alert("Add The location the truck is needing");

          setSpinnerItem(false)
          return
        }
        

       if (truckType==="other" &&formData.trailerModel  ){

          truckType = formData.trailerModel
        }else if(truckType==="other" && !formData.trailerModel  ) {

          alert("Enter The Trailer Type You Have");
          setSpinnerItem(false)
          return
        }


        if (verifiedLoad || isVerified) {
        const areAllElementsTrueExceptKeys = (obj, excludedKeys) => {
            for (const key in obj) {
                if (!excludedKeys.includes(key) && !obj[key]) {
                    return false;
                }
            }
            return true;
        };

        const excludedKeys = ["scndTrailerReg", "trailerModel","additionalInfo"];



        if (verifiedLoad && !areAllElementsTrueExceptKeys(formData, excludedKeys)) {
            alert("This truck is for verified loads.\n\nAdd all truck details except for Trailer Reg2 if not available.");
            setSpinnerItem(false)
            return;
        } else if (verifiedLoad && !imageUrl) {
            alert("Please add a truck image.");
            setSpinnerItem(false)
            return;
        }
    }
      setSpinnerItem(true)
        let withDetails 
        verifiedLoad||isVerified ? withDetails = true : withDetails = false 
    let userId = auth.currentUser.uid

  
    try {
      const docRef = await addDoc(trucksDB, {
        CompanyName : username ,
        contact : contact ,
        imageUrl: imageUrl,
        userId : userId ,
        truckType : truckType ,
        isVerified : isVerified ,
        withDetails : withDetails ,
        deletionTime :Date.now() + 2 * 24 * 60 * 60 * 1000 ,
        location : location ,
        truckTonnage : truckTonnageG ,
        ...formData ,       
      });

       setFormData({
    fromLocation:"",
    toLocation:  "",
    additionalInfo :"" ,
    trailerType : '',


    horseReg :"" ,
    trailerReg :"",
    scndTrailerReg :"",
    driverName :"",
    driverLicense :"" ,
    driverPassport :"" ,
    driverPhone :"",

    truckOwnerPhone :"",
    truckOwnerWhatsApp :"",
    businessLoction :"",
    maximumWheight :""


      });
      setImage(null);
      setSpinnerItem(false)
      if(verifiedLoad){
        navigate(-3)
      }

    } catch (err) {
      console.error(err);
    }
  };
  return (
      <View style={{alignItems :'center', paddingTop : 80}} >
         <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add {truckType} </Text>
       </View>


        {verifyOngoing && !isVerified&&<TouchableOpacity  onPress={() => Linking.openURL(`whatsapp://send?phone=+263716325160  &text=${encodeURIComponent(`
I aspire to become verified at the first level on Transix Now!
To make this happen without any delays or uncertainties.

Provide:
- Company Address
- Company Details (e.g., Articles of Association, tax clearance, etc.)
- National ID or Passport must match details in company details

- Verify Address using Utility Bill (electricity, water, internet, gas),
  Lease Agreement, Business Licence, Tax Document.

- The document for Address must be from 3-6 months ago.

There is a $5 monthly subscription fee, and you can choose for how long you want to be verified.

The Future Of Transport And Logistics (Transix)
`)} `)}  style={{  marginBottom : 4,  padding :7 ,borderWidth : 3 , borderColor:'#6a0c0c', borderRadius:8 ,  shadowColor: '#6a0c0c',
        shadowOffset: { width: 3, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5, margin :10}} >
              {<View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
              </View>}

          <Text style={{alignSelf:'flex-start',fontSize:13 , color:'green',fontStyle:'italic'}} >Ongoing Verification</Text>
        {!verifiedLoad&&<Text style={{textAlign:'center',fontSize :17,color:"#6a0c0c",fontWeight:'500'}} > Your Business is not verified </Text>}
        {!verifiedLoad&&<Text style={{}} > If You Are Legit Click Here </Text>}

        {verifiedLoad&&<Text style={{textAlign:'center',fontSize :17,color:"#6a0c0c",fontWeight:'500'}} > You Want A verified Load</Text>}
        {verifiedLoad&& <Text style={{}}>Your truck details will be deleted in 2 days. Be verified to prevent deletion.</Text>}
      </TouchableOpacity>
      }
     {/* {image && <Image source={{ uri: image.localUri }} style={{ width: 200, height: 200 }} />} */}
      {image && <img src={image} alt="Selected" style={{ width : 200 , height : 200}} />}

   
       {!image&&<div>
    <label for="fileInput" >     
        <CameraAltIcon style={{color : '#6a0c0c' , fontSize : 33}} />

    </label>
    <input
      style={{display: 'none'}}
      id="fileInput"
      type="file"
      onChange={handleFileInputChange}
    />

    </div>}


      
          <ScrollView> 
        <TextInput
          value={formData.fromLocation}
          placeholder="from location"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'fromLocation')}
          type="text" 
          style={inputstyles.addIterms }
        />

        <TextInput
          placeholder="to location"
          value={formData.toLocation}
          type="text"
          name="toLocation"
          placeholderTextColor="#6a0c0c"
          style={inputstyles.addIterms }
          onChangeText={(text) => handlechange(text, 'toLocation')}
        />
        
      { spinnerItem &&<ActivityIndicator size={34} />}
         {truckType ==="other" && <TextInput 
            value={formData.trailerModel}
            placeholderTextColor="#6a0c0c"
            placeholder="Trailer Model"
            onChangeText={(text) => handlechange(text, 'trailerModel')}
            type="text"
          style={inputstyles.addIterms }
          />}
         
          <TextInput 
            value={formData.trailerType}
            placeholderTextColor="#6a0c0c"
            placeholder="Trailer Config"
            onChangeText={(text) => handlechange(text, 'trailerType')}
            type="text"
          style={inputstyles.addIterms }
          />

{verifiedLoad || isVerified ? <View> 


    <TouchableOpacity onPress={togglrTruckDe} style={styles.buttonSelectStyle} >
      <Text style={{color:'white' }} >Truck Details</Text>
    </TouchableOpacity>

      {truckDetails && <View>
        

          <TextInput 
            value={formData.horseReg}
            placeholderTextColor="#6a0c0c"
            placeholder="Horse Reg"
            onChangeText={(text) => handlechange(text, 'horseReg')}
            type="text"
          style={inputstyles.addIterms }
          />


          <TextInput 
            value={formData.trailerReg}
            placeholderTextColor="#6a0c0c"
            placeholder="Trailer Reg 1"
            onChangeText={(text) => handlechange(text, 'trailerReg')}
            type="text"
          style={inputstyles.addIterms }
          />




          <TextInput 
            value={formData.scndTrailerReg}
            placeholderTextColor="#6a0c0c"
            placeholder="Trailer Reg 2"
            onChangeText={(text) => handlechange(text, 'scndTrailerReg')}
            type="text"
          style={inputstyles.addIterms }
          />

      </View>}



        <TouchableOpacity onPress={togglrDriverDe} style={styles.buttonStyle} >
          <Text>Driver Details</Text>
        </TouchableOpacity>

      {driverDetails && <View>



          <TextInput 
            value={formData.driverName}
            placeholderTextColor="#6a0c0c"
            placeholder="Driver Name"
            onChangeText={(text) => handlechange(text, 'driverName')}
            type="text"
          style={inputstyles.addIterms }
          />


          <TextInput 
            value={formData.driverLicense}
            placeholderTextColor="#6a0c0c"
            placeholder="Driver License"
            onChangeText={(text) => handlechange(text, 'driverLicense')}
            type="text"
          style={inputstyles.addIterms }
          />


          <TextInput 
            value={formData.driverPassport}
            placeholderTextColor="#6a0c0c"
            placeholder="Driver Passport"
            onChangeText={(text) => handlechange(text, 'driverPassport')}
            type="text"
          style={inputstyles.addIterms }
          />

          <TextInput 
            value={formData.driverPhone}
            placeholderTextColor="#6a0c0c"
            placeholder="driverPhone"
            onChangeText={(text) => handlechange(text, 'driverPhone')}
            type="text"
          style={inputstyles.addIterms }
          />

      </View>}


        <TouchableOpacity onPress={togglrTruckBuzDe} style={styles.buttonSelectStyle} >
          <Text style= {{color:"white" }} >business Details</Text>
        </TouchableOpacity>

      {truckBuzDe && <View>

          <TextInput 
            value={formData.truckOwnerPhone}
            placeholderTextColor="#6a0c0c"
            placeholder="truckOwnerPhone"
            onChangeText={(text) => handlechange(text, 'truckOwnerPhone')}
            type="text"
          style={inputstyles.addIterms }
          />


          <TextInput 
            value={formData.truckOwnerWhatsApp}
            placeholderTextColor="#6a0c0c"
            placeholder="truck Owner WhatsApp"
            onChangeText={(text) => handlechange(text, 'truckOwnerWhatsApp')}
            type="text"
          style={inputstyles.addIterms }
          />


          <TextInput 
            value={formData.businessLoction}
            placeholderTextColor="#6a0c0c"
            placeholder="businessLoction"
            onChangeText={(text) => handlechange(text, 'businessLoction')}
            type="text"
          style={inputstyles.addIterms }
          />


          <TextInput 
            value={formData.maximumWheight}
            placeholderTextColor="#6a0c0c"
            placeholder="maximumWheight"
            onChangeText={(text) => handlechange(text, 'maximumWheight')}
            type="text"
          style={inputstyles.addIterms }
          />

      </View>}

 </View>:null}



          <TextInput 
            value={formData.additionalInfo}
            placeholderTextColor="#6a0c0c"
            placeholder="Additional Information"
            onChangeText={(text) => handlechange(text, 'additionalInfo')}
            type="text"
            style={inputstyles.addIterms }
            />
              

   {localOperation && <View style={{alignSelf:'center'}} >
           <TouchableOpacity onPress={()=>specifyLocation('International')} style={styles.buttonStyle} > 
            <Text style={{color:'#6a0c0c'}}>International</Text>
          </TouchableOpacity>
                <Text style={{alignSelf:'center', fontSize:18 , fontWeight:'bold'}} > local operators</Text>
          <TouchableOpacity onPress={()=>specifyLocation('Zimbabwe')} style={styles.buttonStyle} > 
            <Text style={{color:'#6a0c0c'}}>Zimbabwe </Text>
          </TouchableOpacity>

            <TouchableOpacity onPress={()=> specifyLocation('SouthAfrica') } style={styles.buttonStyle} >
                  <Text style={{color:'#6a0c0c'}} >  South Africa</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> specifyLocation('Namibia') } style={styles.buttonStyle}>
                  <Text style={{color:'#6a0c0c'}}>Namibia </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> specifyLocation('Tanzania') } style={styles.buttonStyle}>
                  <Text style={{color:'#6a0c0c'}}> Tanzania</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=>specifyLocation ('Mozambique') } style={styles.buttonStyle}>
                  <Text style={{color:'#6a0c0c'}}>Mozambique </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> specifyLocation('Zambia') } style={styles.buttonStyle}>
                  <Text style={{color:'#6a0c0c'}}> Zambia</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> specifyLocation('Botswana') } style={styles.buttonStyle} >
                  <Text style={{color:'#6a0c0c'}}>Botswana </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> specifyLocation('Malawi') }style={styles.buttonStyle} >
                  <Text style={{color:'#6a0c0c'}}>Malawi </Text>
              </TouchableOpacity>

        </View>
        }



  
        <TouchableOpacity onPress={toggleLocalLoads} style={{}}>
          {!location? <Text style={styles.buttonIsFalse}>Operating Location</Text>:
          <Text  style={styles.buttonIsFalse}>{location}</Text>

        }
        </TouchableOpacity>    
        <TouchableOpacity onPress={handleSubmit} style={{alignSelf :"center", backgroundColor : '#6a0c0c' , width : 100 , height : 30 , borderRadius: 5 , alignItems : 'center' , justifyContent : 'center',marginTop:5}} >

        <Text style={{color:'white'}} >submit</Text>

        </TouchableOpacity>
        <View style={{height:300}} ></View>
            </ScrollView>
      
      </View>

  );
}


export default React.memo(DBTrucksAdd);
const styles = StyleSheet.create({
    buttonStyle : {
        height : 35,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginTop: 10 ,
        borderWidth: 2 ,
        borderColor:"#6a0c0c" ,
        borderRadius: 10 ,
        alignSelf:'center'
    } ,
    buttonSelectStyle :{
      alignSelf:'center',
        backgroundColor :"#6a0c0c",
        height : 35,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginTop: 10 ,
        borderRadius: 10

    },
          buttonIsFalse : {
     borderWidth : 1 ,
     borderColor : '#6a0c0c' ,
     paddingLeft :4 , 
     paddingRight:4 ,
     alignSelf:'center'

    //  marginLeft : 6
   } ,
});