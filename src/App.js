import React,{useState} from "react";
import { View , Text , Button , TouchableOpacity , StatusBar, BackHandler,Linking,Platform,ActivityIndicator  } from "react-native";
import  { auth , db,  } from "./components/config/fireBase"
import {doc , getDoc ,query ,collection , where,onSnapshot, loadBundle,updateDoc} from "firebase/firestore"
import { signOut,sendEmailVerification} from  'firebase/auth'

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
import BBVerifiedLoad from "./components/communcication/BBVerifiedLoad"

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

import AddBoxIcon from '@mui/icons-material/AddBox';


function HomeScreen({navigation}) {
  
  // const navigation = useNavigation();
const navigate = useNavigate()
const {page} = useParams()
 
  



  const [trackLoading , setTrackLoading]=React.useState(false)
  const [trackLoadingScnd , setTrackLoadingScnd]=React.useState(false)

  const [currentUser, setCurrentUser] = React.useState("");
  const [ contact , setContact] = React.useState('');
   const [ username , setUsername] = React.useState(false);

    // Check if user is already signed in
    function checkAuthSta (){
      setemailVerifiedN(false)
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
      });
      
    // Cleanup function
    return () => unsubscribe();
    }
    React.useEffect(() => {
      checkAuthSta()
  }, [currentUser]);

          

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
    }else if(!auth.currentUser && trackLoading ) {
      setUsername("")
    }
setTrackLoading(true)
if(trackLoading){
setTrackLoadingScnd(true)
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



  const logout = async ()=>{
    
    try{
      setemailVerifiedN(false)
      setCurrentUser(null)
    await signOut(auth)

    }catch (err){
      console.error(err)
    }
  }
const newCodeEmVeri = async () => {
  try {
    const user = auth.currentUser  ;

    if (user && user.email) {
      await sendEmailVerification(user);
      alert("New code sent");
      setemailVerifiedN(false)
    } else {
      console.error("Current user or user email is null");
    }

  } catch (err) {
    console.error(err);
  }
};

const [whenemailVerifiedN , setemailVerifiedN] = React.useState(false)


    const [smallMenu , setSmallMenu] = React.useState(false)

    function toggleSmallMenu(){
        setSmallMenu(prev => !prev)
    }


  

      const [userIsVerified, setIsVerified] = React.useState(false);
      const [reverifyUserV , setReverifyUser] = React.useState(false)

      const [isBlackListed, setIsBlacListed] = React.useState(false);

      const [blackLWarning, setIsblacklWarning] = React.useState(false);
      const [blackLWarningDSP, setIsblacklWarningDSP] = React.useState(false);

      const [blockVerifiedU , setBlockVerifiedU] = React.useState(false)

       async function changeStatuses(userId,elemUpdate) {
          const docRef = doc(db, 'userStatuses', userId);
          try {
              if(elemUpdate==="verifcation"){

              await updateDoc(docRef, {
                 isVerified: false, veriExpTime: 0,reverifyUser:true , reverfyTime :Date.now() + 14 * 24 * 60 * 60 * 1000   });
              alert("Verification Expired! \nRe-verify to unlock features.")
            }else if(elemUpdate === "blockWarn"){

             await updateDoc(docRef, { isBlackListed:true , blackLWarning : false,usernameBL :username , contactBL : contact});
             alert("You have been blocked")
            }else if(elemUpdate === "reverfyOff"){

            await updateDoc(docRef, {
             veriExpTime: 0,reverifyUser:false , reverfyTime :0, leftVeri : true , usernameLV : username,contactLV:contact});
         }

          } catch (error) {
              console.error('Error updating document:', error);
         }
      }
        

   React.useEffect(() => {
        try {

         
          if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const statusQuery = query(collection(db, "userStatuses"), where("userId", "==", userId));

            const unsubscribe = onSnapshot(statusQuery, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const isVerifiedValue = data.isVerified || false; // Assuming isVerified is a boolean field
                const reverifyUserValue = data.reverifyUser || false; // Assuming isVerified is a boolean field

                const blackListedValue = data.isBlackListed || false; // Assuming isVerified is a boolean field
                const blackLWrningValue = data.blackLWarning || false; // Assuming isVerified is a boolean field
                const blockVerifiedUValue = data.blockVerifiedU || false; // Assuming isVerified is a boolean field

                const  veriExpTime = data.veriExpTime || false; // Assuming isVerified is a boolean field
                const  blockBlackWarn  = data.blockBlackWarn || false; // Aswsuming isVerified is a boolean field
                const  reverfyTime  = data.reverfyTime || false; // Aswsuming isVerified is a boolean field


              const timeRemainingVer = veriExpTime - Date.now();
              
              if(isVerifiedValue ){
                if(timeRemainingVer <= 0){
                    changeStatuses(userId,"verifcation")
                  }else if(timeRemainingVer > 0){
                    setIsVerified(isVerifiedValue)
                  }
                 
                }

                const timeRemainingReVer = reverfyTime - Date.now();
                  if(reverifyUserValue <= 0 ){
                    if(timeRemainingReVer){
                      changeStatuses(userId,"reverfyOff")

                    }else{
                      setReverifyUser(true)
                    }
                  }

              const blockBlackWarnTim = blockBlackWarn - Date.now();
              
                if(blackLWrningValue){
                  if(blockBlackWarnTim <= 0 ){

                    changeStatuses(userId,"blockWarn")
                  }else if(blockBlackWarnTim >0){

                    setIsblacklWarning(blackLWrningValue);
                    setIsblacklWarningDSP(true)
                  }
                }

                

                setBlockVerifiedU(blockVerifiedUValue)
                setIsBlacListed(blackListedValue);
              });
            });

            return () => unsubscribe(); // Cleanup the listener when the component unmounts
          }
        } catch (error) {
          console.error(error);
        }
      }, [currentUser,username]);






      const [updateApp , setUpdateApp]=React.useState(true)
      const [downloadPlayStore , setDownloadOnPlaystore]=React.useState(false)
      const [downloadApkLink , setDownloadApkLink]=React.useState(false)
      
          React.useEffect(() => {
        try {
            const loadsQuery = query(collection(db, "updateEveryone"));
            const unsubscribe = onSnapshot(loadsQuery, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const data = doc.data();


                const newAppUpdateApkLink = data.newAppUpdateApkLink
                const newAppUpdatePlystore = data.switchToPlayStoreLink

                    
                    if(newAppUpdateApkLink){

                      setDownloadApkLink(newAppUpdateApkLink)
                    }else if(newAppUpdatePlystore){
                         setDownloadOnPlaystore(newAppUpdatePlystore)
                    }

                  
                                        
              });
            });

            return () => unsubscribe(); // Cleanup the listener when the component unmounts
        } catch (error) {
          console.error(error);
        }
      }, [currentUser,username]);










function checkAuth(routeToGo){
    if(username !== false|| trackLoadingScnd){
    if(!currentUser){
      navigate("/createUser/")
    }
    else if(!currentUser.emailVerified ){
      setemailVerifiedN(true)
      return
    }else if(currentUser &&!username){
      navigate("/addPersnoalInfo/")
    }
    else {
      if(routeToGo ==="selectAddIterms" ){
        navigate('/AddIterms') 

      }else{
      toggleSmallMenu()
      }
    }
  }
  }



 














    
  return (
    <View>

    {!isBlackListed ?<View >  
        <Header  checkAuth={checkAuth}  dspMenu={username !== false } />


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


 {updateApp &&  <View style={{position:'fixed', top: 10 , left :0 , right:0 , bottom : 0 , zIndex: 500 , backgroundColor:'rgba(106, 12, 12, 0.4)'}}>
 <View style={{alignSelf:'center', backgroundColor :'white', zIndex:100, position:'fixed', top : 130 , width:300, padding:7, height:100, justifyContent:'center',alignItems :'center', borderRadius:7}} >

         {downloadApkLink ?      <Text>Download App not yet on Playstore </Text> : <Text>Update App on Playstore</Text>}
         <Text>For Android</Text>

                  <View style={{flexDirection:'row', justifyContent:"space-evenly",marginTop:7}} >

              <TouchableOpacity style={{height:27 , backgroundColor:'red', width:65,borderRadius:5, alignItems:'center',margin:7}} onPress={()=>setUpdateApp(false) } >
                <Text style={{color:'white'}}>Cancel</Text>
               </TouchableOpacity>

             
               {<TouchableOpacity onPress={()=>Linking.openURL(`${downloadApkLink ? downloadApkLink : downloadPlayStore }`)} style={{height:27 , backgroundColor:'green', width:65,borderRadius:5, alignItems:'center',margin:7}}>
        
                <Text style={{color:'white'}} >OK</Text>
               </TouchableOpacity>}

              </View>
             </View>
             </View>
             }





    {blackLWarningDSP && <View style={{alignSelf:'center', backgroundColor :'white', zIndex:100, position:'absolute', top : 130 , width:300, padding:7, height:150, justifyContent:'center',alignItems :'center', borderRadius:7}} >
      <Text>Your account is currently under investigation.</Text>
      <Text>
        Please contact us for resolution If Not In 4days Your Account Will Be Blocked
      </Text>

      <View style={{flexDirection:'row'}} > 
    
       <TouchableOpacity style={{height:27 , backgroundColor:'red', width:65,borderRadius:5, alignItems:'center',margin:7}} onPress={()=>setIsblacklWarningDSP(false)} >
                <Text style={{color:'white'}}>Cancel</Text>
               </TouchableOpacity>

              

               <TouchableOpacity onPress={()=>Linking.openURL(`whatsapp://send?phone=+263716325160  &text=${encodeURIComponent(`Good day \nMy Transix account is being investigated whats the issue and how can we resolve it \nMy username is ${username}`)} `)} style={{height:27 , backgroundColor:'green', width:65,borderRadius:5, alignItems:'center',margin:7}}>

                <Text style={{color:'white'}} >OK</Text>
               </TouchableOpacity>

      </View>
    </View>}


    {blockVerifiedU && <View style={{alignSelf:'center', backgroundColor :'white', zIndex:100, position:'absolute', top : 130 , width:300, padding:7, height:150, justifyContent:'center',alignItems :'center', borderRadius:7}} >
      <Text>Important: You are an investigated  verified user.</Text>
      <Text> Legal action may be taken if necessary. Contact us immediately..</Text>

      <Text>
        Please contact us for resolution If Not In 4days Your Account Will Be Blocked
      </Text>

      <View style={{flexDirection:'row'}} > 
    
       <TouchableOpacity style={{height:27 , backgroundColor:'red', width:65,borderRadius:5, alignItems:'center',margin:7}} onPress={()=>setIsblacklWarning(false)} >
                <Text style={{color:'white'}}>Cancel</Text>
               </TouchableOpacity>
       
              

               <TouchableOpacity onPress={()=>Linking.openURL(`whatsapp://send?phone=+263716325160  &text=${encodeURIComponent(`Good day \n I am a  investiged Transix verified User \nMy username is ${username} \n How can we speed up the resolving process l am legit`)} `)} style={{height:27 , backgroundColor:'green', width:65,borderRadius:5, alignItems:'center',margin:7}}>

                <Text style={{color:'white'}} >OK</Text>
               </TouchableOpacity>

      </View>
    </View>}

          
              {reverifyUserV && <View style={{alignSelf:'center', backgroundColor :'white', zIndex:100, position:'absolute', top : 130 , width:300, padding:7, height:150, justifyContent:'center',alignItems :'center', borderRadius:7}} >
      <Text>You were a trusted industry member.</Text>

      <Text>
        Renew your verification now.
      </Text>

      <View style={{flexDirection:'row'}} > 
    
       <TouchableOpacity style={{height:27 , backgroundColor:'red', width:65,borderRadius:5, alignItems:'center',margin:7}} onPress={()=>setReverifyUser(false)} >
                <Text style={{color:'white'}}>Cancel</Text>
               </TouchableOpacity>
       
              

               <TouchableOpacity onPress={()=>Linking.openURL(`whatsapp://send?phone=+263716325160  &text=${encodeURIComponent(`Good day \n I want to be reverified on Transix \nMy username is ${username} `)} `)} style={{height:27 , backgroundColor:'green', width:65,borderRadius:5, alignItems:'center',margin:7}}>

                <Text style={{color:'white'}} >OK</Text>
               </TouchableOpacity>

      </View>
    </View>}

             

                   


             {whenemailVerifiedN && <View style={{alignSelf:'center', backgroundColor :'white', zIndex:100, position:'absolute', top : 130 , width:300, padding:7, height:150, justifyContent:'center',alignItems :'center', borderRadius:7}} >
               <Text style={{fontSize:17 , fontWeight:'600'}} >Verify Your Email</Text> 
               <Text style={{fontSize:17 , fontWeight:'600',color:'green'}} >{currentUser.email}</Text> 
               <Text>To Proceed........</Text>
              <View style={{flexDirection:'row', justifyContent:"space-evenly",marginTop:7}} >

               <TouchableOpacity style={{height:27 , backgroundColor:'red', width:65,borderRadius:5, alignItems:'center',margin:7}} onPress={logout} >
                <Text style={{color:'white'}}>Sign Out</Text>
               </TouchableOpacity>

               <TouchableOpacity onPress={newCodeEmVeri} style={{borderWidth:2 , marginLeft:6 , marginRight:5 ,width:80,height:27,alignItems:'center',marginTop:7}} >
                <Text>new code</Text>
               </TouchableOpacity>

               <TouchableOpacity  style={{height:27 , backgroundColor:'green', width:65,borderRadius:5, alignItems:'center',margin:7}}>
                <Text style={{color:'white'}} >Refresh</Text>
               </TouchableOpacity>

              </View>
             </View>}

           {!blockVerifiedU && !blackLWarning && username !== false   && <TouchableOpacity onPress={()=>checkAuth("selectAddIterms")  }  style={{position :'absolute',top: 440 ,right:10 , width : 80 , height : 35 , alignItems :"center" , justifyContent :"space-around", backgroundColor:'#228B22' , zIndex :200 , borderRadius: 8, flexDirection:'row'}} >
                <Text style={{color : 'white',fontSize:17,fontWeight:'bold'}} >Add</Text>
                 <AddBoxIcon style={{color:'white'}} />
             </TouchableOpacity>}
   {!page &&<View  >

     <MiniLoad blockVerifiedU ={blockVerifiedU} blackLWarning={blackLWarning}  />
     {username === false   && <ActivityIndicator size="large" /> }
     <DspAllTrucks blockVerifiedU={blockVerifiedU} blackLWarning={blackLWarning}  />
    </View>}

    {page === "loads"&&<DspAllLoads  username = {username } contactG={contact}  userIsVerified={userIsVerified} blockVerifiedU ={blockVerifiedU} blackLWarning={blackLWarning}  />}
        {page ==="trucks" &&  <SelectOneTruckType  />}
    </View>:
    <View>
      <Text>You Have been blocked</Text>
    </View>
    
    }

 </View>
  );
   
}

function App(){
  
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
            

      const [verifyOngoing , setverifyOngoing]=React.useState(false)
      const [newAppUpdate , setNewAppUpdate]=React.useState(false)
      
          React.useEffect(() => {
        try {
          if (auth.currentUser) {
            const loadsQuery = query(collection(db, "updateEveryone"));

            const unsubscribe = onSnapshot(loadsQuery, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const isVerifyOngoing = data.verifyOngoing || false; // Assuming isVerified is a boolean field
                const newAppUpdate = data.newAppUpdate || false; // Assuming isVerified is a boolean field

                setverifyOngoing(isVerifyOngoing)
                setNewAppUpdate(newAppUpdate)
              });
            });

            return () => unsubscribe(); // Cleanup the listener when the component unmounts
          }
        } catch (error) {
          console.error(error);
        }
      }, [currentUser,username]);



      const [isVerified, setIsVerified] = React.useState(false);
      const [isBlackListed, setIsBlacListed] = React.useState(false);
      const [blackLWarning, setIsblacklWarning] = React.useState(false);
      const [blockVerifiedU , setBlockVerifiedU] = React.useState(false)


      React.useEffect(() => {
        try {

          if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const statusQuery = query(collection(db, "userStatuses"), where("userId", "==", userId));

            const unsubscribe = onSnapshot(statusQuery, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const isVerifiedValue = data.isVerified || false; // Assuming isVerified is a boolean field
                const blackListedValue = data.isBlackListed || false; // Assuming isVerified is a boolean field
                const blackLWrningValue = data.blackLWarning || false; // Assuming isVerified is a boolean field
                const blockVerifiedUValue = data.blockVerifiedU || false; // Assuming isVerified is a boolean field

                const  veriExpTime = data.veriExpTime || false; // Assuming isVerified is a boolean field
                const  blockBlackWarn  = data.blockBlackWarn || false; // Aswsuming isVerified is a boolean field

              const timeRemainingVer = veriExpTime - Date.now();
              
              if(isVerifiedValue ){
                if(timeRemainingVer <= 0){
                    changeStatuses(userId,"verifcation")
                  }else if(timeRemainingVer > 0){
                    setIsVerified(isVerifiedValue)
                  }
                 
                }

              const blockBlackWarnTim = blockBlackWarn - Date.now();
              
                if(blackLWrningValue){
                  if(blockBlackWarnTim <= 0 ){

                    changeStatuses(userId,"blockWarn")
                  }else if(blockBlackWarnTim >0){

                    setIsblacklWarning(blackLWrningValue);
                  }
                }

                

                setBlockVerifiedU(blockVerifiedUValue)
                setIsBlacListed(blackListedValue);
              });
            });

            return () => unsubscribe(); // Cleanup the listener when the component unmounts
          }
        } catch (error) {
          console.error(error);
        }
      }, [currentUser , username]);
  if(username ){

      if(isBlackListed){
        alert("You Are Blacklisted")
        return
      } if(blockVerifiedU){
        alert("Important: You are a blocked verified user.\n Legal action may be taken if necessary. \nContact us immediately.")
       Linking.openURL(`whatsapp://send?phone=+263716325160  &text=${encodeURIComponent(`Good day \n I am a blocked Transix verified User \nMy username is ${username} \n How can we speed up the resolving process l am legit`)} `)
      }

  }

     async function changeStatuses(userId,elemUpdate) {
          const docRef = doc(db, 'userStatuses', userId);
          try {
              if(elemUpdate==="verifcation"){

              await updateDoc(docRef, { isVerified: false, veriExpTime: 0 });
              alert("Verification Expired! \nRe-verify to unlock features.")
            }else if(elemUpdate === "blockWarn"){

             await updateDoc(docRef, { isBlackListed:true , blackLWarning : false });
             alert("You have been blocked")
            }

          } catch (error) {
              console.error('Error updating document:', error);
          }
      }


    return(
          <BrowserRouter>

       <Routes>

      <Route exact path="/" element={<HomeScreen/>} />
      <Route exact path="/:page/" element={<HomeScreen/>} />

      <Route path="/searchElement/" element={<SearchIterms/>} />

      <Route path="/createUser/" element={<CreateUser/>} />
      <Route path="/signInexistAcc/" element={<SignIn/>} />

      <Route path="/addPersnoalInfo/" element={<PersonalAccInfo/>} />

      <Route path="/updates" element={<Updates/>} />
      <Route path="/addUpdate/" element={<AddUpdate/>} />

      <Route path="/selectPeronalAcc/" element={<SelectPersnalAcc/>} isVerified ={ isVerified} />
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

      <Route path="/BBVerifiedLoad/:itemName/:fromLocation/:toLocation/:bookerId/:bookerName/:ownerName/:ownerId/:contact/:isVer/:msgReceiverId/:docId/:rateG/:linksRateG/:triaxleRateG/:currencyBG/:perTonneBG/:loadId/:dbName" element={<BBVerifiedLoad/>} />




      

      <Route path="/AddIterms/" element={<AddIterms/>}/>
      <Route path="/AddIterms/:addTrucks" element={<AddIterms/>}/>
      <Route path="/AddIterms/:addTrucks/:fromLocation/:toLocation/:verifiedLoad" element={<AddIterms/>}/>
      <Route path="/AddIterms/:verifiedLoad/:fromLocation/:toLocation" element={<AddIterms/>}/>
      <Route path="/AddIterms/addLoadsDB" element={<AddLoadDB  
      username = {username} contact = {contact}  isVerified={isVerified}   isBlackListed={isBlackListed}   blackLWarning={blackLWarning} blockVerifiedU={blockVerifiedU} verifyOngoing ={verifyOngoing}  />}   />

      <Route path="/addTrucksDB/:truckType/:fromLocation/:toLocation/:verifiedLoadG/:truckTonnageG" element={<DBTrucksAdd 
       username={ username}  contact = {contact}  isVerified ={ isVerified}    isBlackListed={isBlackListed}   blackLWarning={blackLWarning} blockVerifiedU={blockVerifiedU} verifyOngoing ={verifyOngoing}  />} />

      <Route path="/dspOneTrckType/:truckType" element={<DspOneTruckType blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning}  />} />
      <Route path="/selectedUserTrucks/:userId/:itemKey/:CompanyNameG" element={<SelectedUserTrucks   blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} />} />
      <Route path="/selectedUserTrucks/:userId/:itemKey/:CompanyNameG/:wereFrom" element={<SelectedUserTrucks   blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} />} />

      <Route path="/selectedUserTrucks/:userId/:loadIsVerifiedG/:CompanyNameG" element={<SelectedUserTrucks   blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} isVerified={isVerified} />} />


      <Route path="/selectedUserLoads/:userId/:companyNameG" element={<DspAllLoads username={username}  
      contact ={contact} blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} />} />
      <Route path="/selectedUserLoads/:userId/:companyNameG/:itemKey" element={<DspAllLoads username={username}  
      contact ={contact} blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} />} />
      <Route path="/searchedLoads/:userId/:itemKey/:companyNameG" element={<DspAllLoads username={username} />} />
      <Route path="/dspLoads/verified/:verfiedLoadsG" element={<DspAllLoads username={username}  
      contact ={contact} blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} />} />
      <Route path="/dspLoads/location/:location" element={<DspAllLoads username={username}  
      contact ={contact} blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} />} />


      <Route path="/shopLocation/" element={<ShopLocation/>} />
      <Route path="/DspShop/:location/:specproduct/:sellOBuy" element={<DspShopIterms  spechopLoc={spechopLoc}  blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} />} />
      <Route path="/selectAddShop/:location" element={<SelectAddToShop/>} />

      <Route path="/AddToShop/:location/:specproduct" element={<AddToShop  
      username={ username}  contact = {contact}  isVerified ={ isVerified}  shopLocation={spechopLoc}   deliveryR ={deliveryR}   isBlackListed={isBlackListed}   blackLWarning={blackLWarning} blockVerifiedU={blockVerifiedU} verifyOngoing ={verifyOngoing}  /> } />
      <Route path="/AddToShop/:location/:specproduct/:sellOBuy" element={<AddToShop
       deliveryR ={deliveryR}  username={ username}  contact = {contact}  isVerified ={ isVerified} shopLocation={spechopLoc}/>} />

      <Route path="/OneFirmsShop/:userId/:location/:sellOBuyG/:specproductG/:CompanyName" element={<OneFirmsShop   blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} />} />
      <Route path="/OneFirmsShop/:userId/:location/:sellOBuyG/:specproductG/:CompanyName/:itemKey/:sItemKey" element={<OneFirmsShop   blockVerifiedU={blockVerifiedU}  blackLWarning={blackLWarning} />} />
      {/* <Route path="/OneFirmsShopA/:userId/:itemId/:location/:sellOBuyG/:agCont" element={<OneFirmsShop/>} /> */}
      <Route path="/manageStock/" element={<ManageStock/>} />
      <Route path="/sSoldProducts/:userId/:itemKey/:sItemKey/:location/:sellOBuyG/:specproductG/:CompanyName" element={<OneFirmsShop/>} />
      <Route path="/shosearchElement/" element={<SearchInshop/>} />

      <Route path="/helpHome" element={<HelpHome/>} />
      <Route path="/mobileAppSD" element={<MobileAppSD/>} />

      <Route path="/verifyInfo/" element={<VerifyInfo/>} />
      <Route path="/blacklist/" element={<Blacklist/>} />
      <Route path="/verifyNewUser/" element={<VerifyNewUser/>} />
      
    </Routes>
      </BrowserRouter>
    )
}
export default App