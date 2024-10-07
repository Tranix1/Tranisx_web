import React,{useState} from "react";
import { View , Text  , TouchableOpacity , StatusBar , Share} from "react-native";

import  { auth , db,  } from "./components/config/fireBase"
import {doc , getDoc ,query ,collection , where,onSnapshot } from "firebase/firestore"

import Header from "./components/Header"
import SmallMenu from "./components/SmallMenu";
import SearchIterms from "./components/pages/SearchElement"

import CreateUser from "./components/Auth/LogIn"
import SignIn from "./components/Auth/SignIn"

import PersonalAccInfo from "./components/Auth/Personalnfo"

import Updates from "./components/pages/Updates";
import AddUpdate from "./components/DataBase/AddUpdate";

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
import BookingsandBiddings from "./components/communcication/BookingsandBiddings"

import SelectedUserTrucks from "./components/selectedUserIterms/userPersonalTrucls"

import ShopLocation from "./components/shop/shopHome"
import DspShopIterms from "./components/shop/DspShopIterms"
import SelectAddToShop from "./components/shop/SelectAddToShop"
import AddToShop from "./components/shop/AddToShop"

import HelpHome from "./components/HelpCentre/HelpHome";
import MobileAppSD from "./components/MobileAppSD";

import VerifyInfo from "./components/verifyBlckList/verifyInfo";
import VerifyNewUser from "./components/verifyBlckList/verifyNewUser";
import Blacklist from "./components/verifyBlckList/Blacklist";

import MainStyle from "./components/styles/Main.css"

import { BrowserRouter as Router ,Route, Routes, BrowserRouter, useNavigate, useParams , } from 'react-router-dom';
import OneFirmsShop from "./components/shop/OneFirmsShop";
import SearchInshop from "./components/shop/SearchInshop";
import ManageStock from "./components/shop/ManageStock";

function HomeScreen() {
  
  // const navigation = useNavigation();
const navigate = useNavigate()
const {page} = useParams()
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

       React.useEffect(() => {
  let unsubscribe;  

  try {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const docRef = doc(db, 'personalData', userId);

      unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          setUsername(doc.data().username);
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

  function checkAuth(){
    if(!currentUser){
      navigate("/createUser/")
    }else if(currentUser &&!username){
      navigate("/addPersnoalInfo/")
    }else {
      navigate('/AddIterms') 
    }
  }

    const [smallMenu , setSmallMenu] = React.useState(false)

    function toggleSmallMenu(){

     if(!currentUser){
      navigate("/createUser/")
    }else if(currentUser &&!username){
      navigate("/addPersnoalInfo/")
    }else {
      setSmallMenu(prev => !prev) 

    }
    }
  return (
    <View >  
              <Header toggleSmallMenu={toggleSmallMenu}  />

     <View  style={{flexDirection:'row' , justifyContent : 'space-evenly' , paddingLeft : 20 , paddingRight: 20 , height : 40 , alignItems : 'center' , backgroundColor : '#6a0c0c' , paddingTop : 10 }}>

               <TouchableOpacity onPress={()=>navigate("/")}> 
                   { !page  ? 
                    <Text style={{color : 'white' , textDecorationLine :'underline' ,fontWeight:'600' , fontSize : 18 }} >Home</Text> :
                    <Text style={{color : 'white' }} >Home</Text>
                  }
                </TouchableOpacity>
             <TouchableOpacity onPress={ ()=>navigate('/loads') }>
                    {page === "loads" ?
                     <Text style={{color : 'white' , textDecorationLine:'underline' ,fontWeight:'600' , fontSize : 18 }} >Loads</Text> :
                     <Text style={{color : 'white'}} >Loads</Text> 
                     }
                </TouchableOpacity>
                <TouchableOpacity  onPress={ ()=>navigate('/trucks')} >
                   { page ==="trucks" ? 
                   <Text  style={{color : 'white' , textDecorationLine:'underline',fontWeight:'600' , fontSize : 18  }}>Trucks</Text>  :
                   <Text  style={{color : 'white'}}>Trucks</Text>  
                   }
                </TouchableOpacity>
                   
                 <TouchableOpacity   onPress={()=>navigate('/shopLocation/') }  >
                  <Text style={{color:'white'}} >Store</Text>
                </TouchableOpacity>

             </View>
             {smallMenu && <SmallMenu  toggleSmallMenu={toggleSmallMenu}  /> }
            
         {/* { currentUser&& !username&& <PersonalAccInfo personalInfo={personalInfo} />}  */}
             <TouchableOpacity onPress={checkAuth}  style={{position :'absolute',top: 440 ,right:10 , width : 60 , height : 35 , alignItems :"center" , justifyContent :'center', backgroundColor:'rgb(129,201,149)' , zIndex :200 , borderRadius: 8}} >
                <Text style={{color : 'white'}} >Add</Text>
             </TouchableOpacity>

   {!page && <View >

     <MiniLoad/>
     <DspAllTrucks/>
    </View>}

    {page === "loads"&& <DspAllLoads  username = {username}/>}
    {page ==="trucks" &&  <SelectOneTruckType  />}
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
   const [ spechopLoc , setShopLoc] = React.useState('');
   const [ deliveryR , setDeliveryR] = React.useState('');

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
          setShopLoc(doc.data().shopLocation);
         setDeliveryR(doc.data().deliveryRange);
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
      }, [currentUser]);

            
    return(
          <BrowserRouter>

       <Routes>

      <Route exact path="/" element={<HomeScreen/>} />
      <Route exact path="/:page/" element={<HomeScreen/>} />

      <Route path="/searchElement/" element={<SearchIterms/>} />

      <Route path="/createUser/" element={<CreateUser/>} />
      <Route path="/signInexistAcc/" element={<SignIn/>} />

      <Route path="/addPersnoalInfo/" element={<PersonalAccInfo/>} />

      <Route path="/updates/" element={<Updates/>} />
      <Route path="/addUpdate/" element={<AddUpdate/>} />

      <Route path="/selectPeronalAcc/" element={<SelectPersnalAcc/>} />
      <Route path="/personalInfomation/" element={<PersnonalAccInfoEdit  
      username ={username}  contact ={contact} />}/>
      <Route path="/peronalAccLoads/" element={<PersnalAccLoads/>}/>
      <Route path="/peronalAccTrucks/" element={<PersonalAccTrucks/>} />

      <Route path="/selectChat/" element={<SelectChat/>} />

      <Route path="/mainGroup" element={<MainGroup username={username}/>} style={{backgroundColor:'green'}} />

      <Route path="/message/:chatStarterId/:starterCompanyName"   element={<Messaging username={username}/>}/>
      <Route path="/message/:gchatId/:senderName/:receiverName"   element={<Messaging username={username}/>}/>

      <Route path="/bookingsandBiddings/" element={<BookingsandBiddings/>} />
      <Route path="/bookingsandBiddings/:dbName/:dspRoute" element={<BookingsandBiddings/>} />

      <Route path="/AddIterms/" element={<AddIterms/>}/>
      <Route path="/AddIterms/:addTrucks" element={<AddIterms/>}/>
      <Route path="/AddIterms/addLoadsDB" element={<AddLoadDB  
      username = {username} contact = {contact}  isVerified={isVerified}/>} />

      <Route path="/addTrucksDB/:truckType" element={<DBTrucksAdd 
       username={ username}  contact = {contact}  isVerified ={ isVerified} />} />

      <Route path="/dspOneTrckType/:truckType" element={<DspOneTruckType/>} initialParams={{username : username , contact : contact , isVerified : isVerified}} />
      <Route path="/selectedUserTrucks/:userId" element={<SelectedUserTrucks/>} />
      <Route path="/selectedUserLoads/:userId" element={<DspAllLoads username={username} />} />
      <Route path="/selectedUserLoads/:userId/:itemId" element={<DspAllLoads username={username} />} />
      <Route path="/searchedLoads/:userId/:itemId" element={<DspAllLoads username={username} />} />

      <Route path="/location/:location" element={<DspAllLoads username={username} />} />

      <Route path="/shopLocation/" element={<ShopLocation/>} />
      <Route path="/DspShop/:location/:specproduct/:sellOBuy" element={<DspShopIterms  spechopLoc={spechopLoc} />} />
      <Route path="/selectAddShop/:location" element={<SelectAddToShop/>} />
      <Route path="/AddToShop/:location/:specproduct" element={<AddToShop  
      username={ username}  contact = {contact}  isVerified ={ isVerified}  shopLocation={spechopLoc}   deliveryR ={deliveryR} /> } />
      <Route path="/AddToShop/:location/:specproduct/:sellOBuy" element={<AddToShop
      username={ username}  contact = {contact}  isVerified ={ isVerified} shopLocation={spechopLoc}/>} deliveryR ={deliveryR} />
      <Route path="/OneFirmsShop/:userId/:itemId/:sellOBuyG" element={<OneFirmsShop/>} />
      <Route path="/OneFirmsShopA/:userId/:itemId/:sellOBuyG/:agCont" element={<OneFirmsShop/>} />
      <Route path="/manageStock/" element={<ManageStock/>} />
      <Route path="/sSoldProducts/:userId/:itemId" element={<OneFirmsShop/>} />
      <Route path="/shosearchElement/" element={<SearchInshop/>} />

      <Route path="/helpHome/" element={<HelpHome/>} />
      <Route path="/mobileAppSD/" element={<MobileAppSD/>} />

      <Route path="/verifyInfo/" element={<VerifyInfo/>} />
      <Route path="/blacklist/" element={<Blacklist/>} />
      <Route path="/verifyNewUser/" element={<VerifyNewUser/>} />
      
    </Routes>
      </BrowserRouter>
    )
}
export default App