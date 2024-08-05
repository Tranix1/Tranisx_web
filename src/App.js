import React,{useState} from "react";
import { View , Text  , TouchableOpacity , StatusBar} from "react-native";

import  { auth , db,  } from "./components/config/fireBase"
import {doc , getDoc ,query ,collection , where,onSnapshot} from "firebase/firestore"

import Header from "./components/Header"
import SmallMenu from "./components/SmallMenu";
import SearchIterms from "./components/pages/SearchElement"

import CreateUser from "./components/Auth/LogIn"
import SignIn from "./components/Auth/SignIn"
import PersonalAccInfo from "./components/Auth/Personalnfo"

import MiniLoad from  "./components/pages/MiniLoads"
import DspAllTrucks from  "./components/pages/DspCombinedTrucks"
import DspAllLoads from  "./components/pages/DspAllLoads"
import SelectOneTruckType from  "./components/pages/selectOnteTruckType"
import DspOneTruckType from  "./components/pages/DspOneTruckType"

import AddIterms from "./components/DataBase/AddIterms"
import DBTrucksAdd from "./components/DataBase/DBTrucksAdd"
import AddLoadDB from "./components/DataBase/addloadDB";

import SelectPersnalAcc from "./components/PersonalData/SelectPersnalAcc"
import PersnalAccLoads from "./components/PersonalData/PersnalAccLoads"
import PersnonalAccInfoEdit from "./components/PersonalData/PersnonalAccInfoEdit"
import PersonalAccTrucks from "./components/PersonalData/PersonalAccTrucks"

import SelectChat from "./components/communcication/selectChat"
import Messaging from "./components/communcication/Messaging"
import MainGroup from "./components/communcication/MainGroup"
import Bookings from "./components/communcication/Bookings"

import SelectedUserLoads from "./components/selectedUserIterms/userPersonalLoads"
import SelectedUserTrucks from "./components/selectedUserIterms/userPersonalTrucls"

// 'rgb(129,201,149)
// '#6a0c0c'
// '#6a0c0c'
import MainStyle from "./components/styles/Main.css"

import { BrowserRouter as Router ,Route, Routes, BrowserRouter, useNavigate , } from 'react-router-dom';


function HomeScreen() {
  // const navigation = useNavigation();
const navigate = useNavigate()
  const [currentUser, setCurrentUser] = React.useState("");

  React.useEffect(() => {
    // Check if user is already signed in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [currentUser]);

   const [ username , setUsername] = React.useState("");
   const [ contact , setContact] = React.useState('');

          

       React.useEffect(() => {
  let unsubscribe;

  try {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, 'personalData', userId);

      unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setUsername(doc.data().username);
          setContact(doc.data().contact);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, [currentUser]);

  const [dspLoads , setDspLoads] =React.useState(false)
  function toggleDspLoads(){
    setDspLoads(prev => !prev)
    setDspTrckType(prev => false)
  }


  const [dspTruckType , setDspTrckType] =React.useState(false)
  function toggleDspTrckType(){
    setDspTrckType(prev => !prev)
    setDspLoads(prev => false)
  }
  function toggleGoHome(){
    setDspTrckType(prev => false)
    setDspLoads(prev => false)
  }

  function checkAuth(){
    if(!currentUser){
      navigate("createUser")
    }else if(currentUser &&!username){
      navigate("addPersnoalInfo")
    }else {
      navigate('/AddIterms') 
    }
  }

    const [smallMenu , setSmallMenu] = React.useState(true)

    function toggleSmallMenu(){

     if(!currentUser){
      navigate("createUser")
    }else if(currentUser &&!username){
      navigate("addPersnoalInfo")
    }else {
    setSmallMenu(prev => !prev) 
    }
    }
  return (
    <View >  
              <Header  toggleGoHome = {toggleGoHome} toggleDspLoads={toggleDspLoads} toggleDspTrckType={toggleDspTrckType} toggleSmallMenu={toggleSmallMenu}    />

     <View  style={{flexDirection:'row' , justifyContent : 'space-evenly' , paddingLeft : 20 , paddingRight: 20 , height : 40 , alignItems : 'center' , backgroundColor : '#6a0c0c' , paddingTop : 10 }}>

               <TouchableOpacity onPress={toggleGoHome}> 
                    <Text style={{color : 'white'}} >Home</Text>
                </TouchableOpacity>

             <TouchableOpacity onPress={ toggleDspLoads  }>
                    <Text style={{color : 'white'}} >Loads</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleDspTrckType} >
                    <Text  style={{color : 'white'}}>Trucks</Text>

                </TouchableOpacity>
             </View>
             {smallMenu && <SmallMenu   /> }
            
         {/* { currentUser&& !username&& <PersonalAccInfo personalInfo={personalInfo} />}  */}

             <TouchableOpacity onPress={checkAuth}  style={{position :'absolute',top: 440 ,right:10 , width : 60 , height : 35 , alignItems :"center" , justifyContent :'center', backgroundColor:'rgb(129,201,149)' , zIndex :200 , borderRadius: 8}} >
                <Text style={{color : 'white'}} >Add</Text>
             </TouchableOpacity>

   {!dspLoads && !dspTruckType && <View  >

     <MiniLoad/>
     <DspAllTrucks/>
    </View>}

    {dspLoads && !dspTruckType&& <DspAllLoads  username = {username}/>}
    {dspTruckType &&  <SelectOneTruckType  />}
    </View>
  );
}



function App(){
  React.useEffect(() => {
    // Set the status bar color and style
    StatusBar.setBackgroundColor('#6a0c0c'); // Set the background color of the status bar
    StatusBar.setBarStyle('light-content'); // Set the style of the status bar text (light or dark)
  }, []);

  const [currentUser, setCurrentUser] = React.useState("");

  React.useEffect(() => {
    // Check if user is already signed in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [currentUser]);

   const [ username , setUsername] = React.useState("");
   const [ contact , setContact] = React.useState('');

       React.useEffect(() => {
  let unsubscribe;

  try {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, 'personalData', userId);

      unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setUsername(doc.data().username);
          setContact(doc.data().contact);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }

  return () => {
    if (unsubscribe) {
      unsubscribe();
    }
  };
}, [currentUser]);
            

      const [isVerified, setIsVerified] = React.useState(false);

      React.useEffect(() => {
        try {
          if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const loadsQuery = query(collection(db, "verifiedUsers"), where("userId", "==", userId));

            const unsubscribe = onSnapshot(loadsQuery, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const isVerifiedValue = data.isVerified || false; // Assuming isVerified is a boolean field

                setIsVerified(isVerifiedValue);
              });
            });

            return () => unsubscribe(); // Cleanup the listener when the component unmounts
          }
        } catch (error) {
          console.error(error);
        }
      }, []);

            
// const Stack = createNativeStackNavigator();

    return(
          <BrowserRouter>

       <Routes>


      <Route exact path="/" element={<HomeScreen/>} />

      <Route path="/searchElement/" element={<SearchIterms/>} />

      <Route path="/createUser/" element={<CreateUser/>} />

      <Route path="/addPersnoalInfo/" element={<PersonalAccInfo/>} />
      

      <Route path="/selectPeronalAcc/" element={<SelectPersnalAcc/>} />
      <Route path="/personalInfomation/" element={<PersnonalAccInfoEdit  
      username ={username}  contact ={contact} />}/>
      <Route path="/peronalAccLoads/" element={<PersnalAccLoads/>}/>
      <Route path="/peronalAccTrucks/" element={<PersonalAccTrucks/>} />

      <Route path="/selectChat/" element={<SelectChat/>} />
      <Route path="/mainGroup/" element={<MainGroup username={username}/>}/>
      <Route path="/message/:messageData"   element={<Messaging username={username}/>}/>
      <Route path="/bookings/" element={<Bookings/>} />


      <Route path="/AddIterms/" element={<AddIterms/>}/>
      <Route path="/AddIterms/addLoadsDB" element={<AddLoadDB  
      username = {username} contact = {contact}  isVerified={isVerified}/>} />

      <Route path="/addTrucksDB/:truckType" element={<DBTrucksAdd 
       username={ username}  contact = {contact}  isVerified ={ isVerified} />} />

      <Route path="/dspOneTrckType/:truckType" element={<DspOneTruckType/>} initialParams={{username : username , contact : contact , isVerified : isVerified}} />
      <Route path="/selectedUserLoads/:userId" element={<SelectedUserLoads/>} />
      <Route path="/selectedUserTrucks/:userId" element={<SelectedUserTrucks/>} />

    </Routes>

           
       
      </BrowserRouter>

    )
}
export default App