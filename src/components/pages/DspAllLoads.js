import React, { useEffect, useState} from 'react';
import { View , Text , ScrollView, TouchableOpacity , ActivityIndicator , StyleSheet , Linking, Alert , TextInput , Share} from "react-native"
import { auth, db } from '../config/fireBase';
import { collection, onSnapshot , serverTimestamp ,addDoc, query , where , getDocs ,doc,deleteDoc , updateDoc, runTransaction , setDoc} from 'firebase/firestore';
import inputstyles from '../styles/inputElement';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {useNavigate,useParams} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

import { WhatsApp  } from '@mui/icons-material';
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';

function DspAllLoads({username}){  

  const navigate = useNavigate()
  const {userId ,  location ,itemId} = useParams()
  
  const deleteLoad = async (id) => {
  try {
    const loadsDocRef = doc(db, 'Loads', id);
    await deleteDoc(loadsDocRef);
    // Remove the deleted item from loadsList
    setLoadsList((prevLoadsList) => prevLoadsList.filter(item => item.id !== id));
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

  const [localLoads , setLocalLoads]=React.useState(false)

  function toggleLocalLoads(){
    setLocalLoads(prevState => !prevState)
  }

  function specifyLocation(loc){
    navigate(`/location/${loc}`) 
    setLocalLoads(prev => false)
  }

 
      const [loadsList, setLoadsList] = useState([]);


     const checkAndDeleteExpiredItems = () => {
  loadsList.forEach((item) => {
    const deletionTime = item.deletionTime;
    const timeRemaining = deletionTime - Date.now();
    if (timeRemaining <= 0) {
      deleteLoad(item.id);
    } else {
      setTimeout(() => {
        deleteLoad(item.id);
      }, timeRemaining); // This might not work as expected
    }
  });
};
setTimeout(() => {
  checkAndDeleteExpiredItems();
}, 1000);
    
  useEffect(() => {
    const loadData = () => {
      if (userId) {
        const dataQuery = query(collection(db, "Loads"), where("userId", "==", userId));

       const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
      let loadedData = [];
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added' || change.type === 'modified') {
          const dataWithId = { id: change.doc.id, ...change.doc.data() };
          loadedData.push(dataWithId);
        }
      });

      loadedData = loadedData.sort((a, b) => b.timeStamp - a.timeStamp);

      if (itemId) {
        const updatedLoadList = loadedData.map(oneLoad => ({
          ...oneLoad,
          backgroundColor: oneLoad.id === itemId ? "#F2F2F2" : "#EDEDED"
        }));

        const sortedLoadList = updatedLoadList.sort((a, b) => a.backgroundColor === "#F2F2F2" ? -1 : b.backgroundColor === "#F2F2F2" ? 1 : 0);

        setLoadsList(sortedLoadList);
      } else {
        setLoadsList(loadedData);
      }
    });

        return unsubscribe  
      }else if(location){
        const dataQuery = query(collection(db, "Loads"), where("location", "==", location));

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          let loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

          loadedData = loadedData.sort((a, b) => b.timeStamp - a.timeStamp);


          setLoadsList(loadedData);
        });
        return unsubscribe 
      }    
      else {
       const loadsCollection = collection(db, "Loads");

        const unsubscribe = onSnapshot(loadsCollection, (querySnapshot) => {
          let filteredData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          // Separate verified and non-verified users
          const verifiedUsers = filteredData.filter(user => user.isVerified);
          const nonVerifiedUsers = filteredData.filter(user => !user.isVerified);

         let  shuffledDataUnV = nonVerifiedUsers.sort((a, b) => b.timeStamp - a.timeStamp);

          filteredData = verifiedUsers.concat(shuffledDataUnV);

          setLoadsList(filteredData);
        });
        
        return  unsubscribe
        
      };
      
    }
    
    loadData();
  }, []); 

    
    const [contactDisplay, setContactDisplay] = React.useState({ ['']: false });
    const toggleContact = (itemId) => {
      setContactDisplay((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    };
    
    const [bidDisplay, setBidDisplay] = React.useState({ ['']: false });
    const toggleBid = (itemId) => {
      setBidDisplay((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    };


    const [spinnerItem, setSpinnerItem] = React.useState(null);
    const [ bookingError , setBookingError] =React.useState("")

    const checkExistiDoc = async (docId) => {
    const chatsRef = collection(db, 'bookings'); // Reference to the 'ppleInTouch' collection
    const chatQuery = query(chatsRef, where('docId', '==',docId )); // Query for matching chat ID

      const querySnapshot = await getDocs(chatQuery);  
     // Check if any documents exist with the chat ID
      return !querySnapshot.empty; // Returns true if a document exists, false otherwise
    };

    const checkExistixtBBDoc = async (receriverId) => {
    const chatsRef = collection(db, 'newIterms'); // Reference to the 'ppleInTouch' collection
    const chatQuery = query(chatsRef, where('receriverId', '==', receriverId)); // Query for matching chat ID

      const querySnapshot = await getDocs(chatQuery);  
     // Check if any documents exist with the chat ID
      return !querySnapshot.empty; // Returns true if a document exists, false otherwise
    };
    

            const [currencyBid , setCurrencyBid] = React.useState(true)
          function toggleCurrencyBid(){
            setCurrencyBid(prev=>!prev)
          }

          const [perTonneBid , setPerTonneBid] = React.useState(false)
          function togglePerTonneBid(){
            setPerTonneBid(prev=>!prev)
          }

          const [bidRate, setBidRate] = React.useState("");
          const [bidLinks, setBidLinks] = React.useState("");
          const [bidTriaxle, setBdTriaxle] = React.useState("");

    
  const [dspMoreInfo , setDspMoreInfo] = React.useState({ ['']: false })
  function toggleDspMoreInfo(itemId){
          setDspMoreInfo((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
  }


      
    const rendereIterms =  loadsList.map((item)=>{ 
      
      const handleSubmit = async (clickedItem , dbName) => {
        
        setSpinnerItem(clickedItem);
        const bookingCollection = collection(db, `${dbName}`);
        const userId = auth.currentUser.uid
        try {
          
          let docId = item.linksRate || item.triaxleRate ? `${userId}${item.typeofLoad}${item.linksRate || item.triaxleRate }${item.userId}` : `${userId}${item.typeofLoad}${item.ratePerTonne}${item.userId}`

          let existingChat 
            if(dbName === "bookings" ){

               existingChat = await checkExistiDoc(docId);
            }

           let theRate 
           let thelinksRate
           let thetriaxleRate
           let currencyB 
           let perTonneB

              if(bidDisplay[item.id]){ 

              theRate= bidRate  
              thelinksRate = bidLinks
              thetriaxleRate = bidTriaxle
               currencyB = currencyBid  
               perTonneB = perTonneBid
              }else{

               currencyB = null
               perTonneB = null
                theRate = item.ratePerTonne
                thelinksRate = item.linksRate
                thetriaxleRate= item.triaxleRate
              }

          if(  !existingChat ){
        const docRef = await addDoc(bookingCollection, {
        itemName : item.typeofLoad ,
        fromLocation : item.fromLocation ,
        toLocation : item.toLocation ,
        bookerId : userId ,
        bookerName : username ,
        ownerName: item.companyName ,
        ownerId : item.userId ,
        contact : item.contact ,
        Accept : null ,
        isVerified : item.isVerified ,
        msgReceiverId : userId ,
        docId : docId,
        rate :  theRate ,
        linksRate :   thelinksRate ,
        triaxleRate : thetriaxleRate ,
        currencyB : currencyB ,
        perTonneB : perTonneB ,
        loadId : item.id ,
        deletionTime :Date.now() + 5 * 24 * 60 * 60 * 1000 ,
        timestamp : serverTimestamp() ,
      });
      
      setBidRate("")
      setBidLinks("")
      setBdTriaxle("")
      setBidDisplay({ ['']: false });
      alert(`${!bidDisplay[item.id] ? "booking": "bidding"} was successfull`)    
        }else {
          alert("Already Booked this Item!")    

        }
        
          const existingBBDoc = await checkExistixtBBDoc(userId);
        // const existingChat = await checkExistingChat(addChatId);
        let newBiddedDoc = 0
        let newBOOKEDDoc = 0

        dbName === "bookings" ? newBOOKEDDoc = 1  : newBiddedDoc = 1
      // Chat doesn't exist, add it to 'ppleInTouch'
      if(!existingBBDoc){
      await setDoc( doc(db , "newIterms", userId), {
        bookingdocs : newBOOKEDDoc ,
        biddingdocs : newBiddedDoc ,
        timestamp : serverTimestamp() ,
        receriverId : item.userId ,
      }); 
    }
    else{
       
       const docRef = doc(db, 'newIterms', userId);
       await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);

        if (docSnap.exists()) {
            const currentBiddingDocs = docSnap.data().biddingdocs || 0;

            const currentBookingsDocs = docSnap.data().bookingdocs || 0;
            let updatedBiddingDocs = currentBiddingDocs
            let updateBokingsDocs = currentBookingsDocs
            dbName !== "bookings" ?  updatedBiddingDocs = currentBiddingDocs + 1 : updateBokingsDocs = currentBookingsDocs + 1

            transaction.update(docRef, {
                biddingdocs : updatedBiddingDocs,
                bookingdocs :  updateBokingsDocs ,
            });
        }
    });
    }
      
      setSpinnerItem(null)      

    } catch (err) {
      setBookingError(err.toString());
      setSpinnerItem(null)      
    }
  };
        const message =  `${item.companyName} is this Load still available ${item.typeofLoad} from ${item.fromLocation} to ${item.toLocation} ${item.linksRate || item.triaxleRate ? item.triaxleRate &&`Triaxle ${item.triaxleRate } ` + item.linksRate&&`Links for ${item.linksRate}` : `Rate ${item.ratePerTonne}` } ${item.perTonne ?"Per tonne" : ''}            from https://www.transix.net/selectedUserLoads/${item.userId}/${item.id}` ; // Set your desired message here

    let contactMe = ( <View style={{ paddingLeft: 30 }}>

            <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.CompanyName} `)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#008080" , borderWidth:1 , borderColor :'#008080', justifyContent:'center', marginBottom : 5 , marginTop:6}} >
            <Text style={{color:"#008080"}} >Message now</Text>
            <ChatIcon/>

          </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}&text=${encodeURIComponent(message)}`)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#25D366" , borderWidth:1 , borderColor :'#25D366', justifyContent:'center', marginBottom:6}} >
            <Text style={{color : "#25D366"}} >WhatsApp </Text> 
            <WhatsApp  />  
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#0074D9" , borderWidth:1 , borderColor :'#0074D9', justifyContent:'center', marginBottom:4}} >
            <Text style={{color:'#0074D9'}} >Phone call</Text>
            <CallIcon/>
          </TouchableOpacity>

          </View>)


      let bidNow = (
        <View style={{position:'absolute' , bottom:0, backgroundColor:'#DDDDDD'}}>

    {spinnerItem === item ? (
        <ActivityIndicator size={34} />
      ) :    <View >

         {!item.linksRate && !item.triaxleRate &&  <View style={{flexDirection:'row', alignItems : 'center' ,}} >

        <TouchableOpacity onPress={toggleCurrencyBid}>
            {currencyBid ? <Text style={styles.buttonIsFalse} >USD</Text> :
            <Text style={styles.bttonIsTrue}>Rand </Text>}
          </TouchableOpacity>

        <TextInput
           onChangeText={(text) => setBidRate(text)}
            name="ratePerTonne"
            value={bidRate}
            keyboardType="numeric"
            placeholderTextColor="#6a0c0c"
            style={ {height : 30 , borderBottomWidth: 2 , borderBottomColor : "#6a0c0c" ,marginBottom : 10 , paddingLeft : 20 ,width : 180}}
            placeholder="Bid rate here"
          />
          <TouchableOpacity onPress={togglePerTonneBid} >
            {perTonneBid ? <Text style={styles.bttonIsTrue} >Per tonne</Text> : 
              <Text style={styles.buttonIsFalse}>Per tonne</Text>}
          </TouchableOpacity>
          </View>}


          {item.linksRate || item.triaxleRate ?   <View>
                {item.linksRate&& <View style={{flexDirection:'row', alignItems : 'center' ,}} >

        <TouchableOpacity onPress={toggleCurrencyBid}>
            {currencyBid ? <Text style={styles.buttonIsFalse} >USD</Text> :
            <Text style={styles.bttonIsTrue}>Rand </Text>}
          </TouchableOpacity>

        <TextInput
           onChangeText={(text) => setBidLinks (text)}
            name="ratePerTonne"
            value={bidLinks}
            keyboardType="numeric"
            placeholderTextColor="#6a0c0c"
            style={ {height : 30 , borderBottomWidth: 2 , borderBottomColor : "#6a0c0c" ,marginBottom : 10 , paddingLeft : 20 ,width : 180}}
            placeholder="Bid Links rate"
          />
          <TouchableOpacity onPress={togglePerTonneBid} >
            {perTonneBid ? <Text style={styles.bttonIsTrue} >Per tonne</Text> : 
              <Text style={styles.buttonIsFalse}>Per tonne</Text>}
          </TouchableOpacity>
          </View>}
          


 { item.triaxleRate&& <View style={{flexDirection:'row', alignItems : 'center' ,}} >

        <TouchableOpacity onPress={toggleCurrencyBid}>
            {currencyBid ? <Text style={styles.buttonIsFalse} >USD</Text> :
            <Text style={styles.bttonIsTrue}>Rand </Text>}
          </TouchableOpacity>

        <TextInput
           onChangeText={(text) => setBdTriaxle(text)}
            name="ratePerTonne"
            value={bidTriaxle}
            keyboardType="numeric"
            placeholderTextColor="#6a0c0c"
            style={ {height : 30 , borderBottomWidth: 2 , borderBottomColor : "#6a0c0c" ,marginBottom : 10 , paddingLeft : 20 ,width : 180}}
            placeholder="Bid triaxle rate"
          />
          <TouchableOpacity onPress={togglePerTonneBid} >
            {perTonneBid ? <Text style={styles.bttonIsTrue} >Per tonne</Text> : 
              <Text style={styles.buttonIsFalse}>Per tonne</Text>}
          </TouchableOpacity>
          </View>}


            </View>:null}















          
   </View>}


          <View style={{flexDirection:'row' , justifyContent: 'space-evenly'}}>

            <TouchableOpacity onPress={()=>toggleBid(item.id) } style={{ backgroundColor:'#6a0c0c',padding:1 ,paddingLeft :7 , paddingRight:7 ,borderRadius:3}} > 
              <Text style={{color:'white'}}>Cancel </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>handleSubmit(item , "biddings")} style={{ backgroundColor:'rgb(129,201,149)',padding:1 ,paddingLeft :7 , paddingRight:7 ,borderRadius:3}} >
              <Text style={{color:'white'}}> Send</Text>
            </TouchableOpacity>

          </View>

        </View>
      )







  return(
    <View  key={item.id} style={{  marginBottom : 8, padding :6  , padding :7, borderWidth : 2 , borderColor:'black', borderRadius:8 ,  shadowColor: '#6a0c0c',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5}} >

            
            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}
        <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 21 , fontWeight:'600'}}  >{item.companyName} </Text>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Commodity</Text>
        <Text  >:  {item.typeofLoad} </Text>
      </View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Route</Text>
        <Text>:  from  {item.fromLocation}  to  {item.toLocation} </Text>
      </View>

      {!item.linksRate && !item.triaxleRate && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Rate</Text>
        <Text>:  {item.currency ? "USD" : "RAND"} {item.ratePerTonne} {item.perTonne ? "Per tonne" :null} </Text>
      </View>}

       {item.linksRate&&  <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Links</Text>
        <Text>:  {item.currency ? "USD" : "RAND"} {item.linksRate} {item.perTonne ? "Per tonne" :null} </Text>
      </View>}

       {item.triaxleRate&& <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Triaxle</Text>
        <Text>:  {item.currency ? "USD" : "RAND"} {item.triaxleRate} {item.perTonne ? "Per tonne" :null} </Text>
      </View>}

       {   !contactDisplay[item.id] && <View>

     {!item.isVerified&&  <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Contact</Text>
        <Text>:  {item.contact}</Text>
      </View>}

      <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Payment Terms</Text>
        <Text>:  {item.paymentTerms} </Text>
      </View>

    { dspMoreInfo[item.id] && item.requirements && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Requirements</Text>
         <Text>:  {item.requirements} </Text>
      </View>}

      { dspMoreInfo[item.id] && item.additionalInfo && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Additional info </Text>
       {<Text>:  {item.additionalInfo} </Text>} 
      </View>}

         {!contactDisplay[item.id] && <TouchableOpacity onPress={()=>toggleDspMoreInfo(item.id) } >
          <Text style={{color :'green'}} >{  dspMoreInfo[item.id]  ?"See Less": "See more"} </Text>
        </TouchableOpacity>}
        </View> }

        {item.activeLoading&& <Text style={{fontSize:17 , color:"#FF8C00" }} >Active Loading.... </Text> }

        {contactDisplay[item.id] && contactMe}

         {bidDisplay[item.id]&& bidNow}

        { !item.isVerified&& !bidDisplay[item.id]&&  <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{  width : 150 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#228B22' ,  borderRadius: 8, alignSelf:'center', margin:5 }} >
          <Text style={{color:'white'}} > Get In Touch Now</Text>
        </TouchableOpacity>}
        
        
       {  auth.currentUser ? !bidDisplay[item.id]&& !contactDisplay[item.id]  && <View style={{flexDirection : 'row', justifyContent : 'space-evenly' }} >  
      {bookingError&&<Text>{bookingError}</Text>}
          {spinnerItem === item ? (
        <ActivityIndicator size={34} />
      ) : (
        <TouchableOpacity style={{ width : 90 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#6a0c0c' ,  borderRadius: 8, alignSelf:'center', margin:5 }} onPress={() => handleSubmit(item , "bookings")}>
          <Text style={{color:'white'}} >Book</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={()=>toggleBid(item.id) } style={{ width : 90 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#6a0c0c' ,  borderRadius: 8, alignSelf:'center', margin:5 }} >
        <Text style={{color:'white'}} >Bid</Text>
      </TouchableOpacity>

        <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.companyName} `)} style={{ width : 90 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#6a0c0c' ,  borderRadius: 8, alignSelf:'center', margin:5 }} >
          <Text style={{color:'white'}} >Message</Text>
        </TouchableOpacity>       
        </View> : 
        <Text style={{color:'red'}}> Sign In to Book Bid and Message </Text>
        }

      </View>     
  )})


        let comapnyName = null;


 const handleShareLink = async (companyName) => {
    try {
      const url = `https://www.truckerz.net/selectedUserLoads/${userId}`; // Replace this with the URL you want to share
      const message = `Check out ${companyName} loads on Truckerz: ${url}`;

      const result = await Share.share({
        message: message,
      });

      if (result) {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // Shared with activity type of result.activityType
          } else {
            // Shared
          }
        } else if (result.action === Share.dismissedAction) {
          // Dismissed
        }
      } else {
        // Handle the case where result is undefined or null
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return(
    <View>
        {  userId  && loadsList.map((item)=>{
          let showUserName
          if(userId){
          const companyName = item.companyName ;
           showUserName = comapnyName !== companyName;
          comapnyName = companyName;
        }
      return(     
        showUserName&&<View key={item.id} style={{flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
      
           <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate( '/' )}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
       
                <Text style={{fontSize: 20 , color : 'white'}} > { item.companyName} Loads </Text>
                <TouchableOpacity  onPress={()=>handleShareLink(item.companyName)} style={{position :'absolute' , right:30 ,  backgroundColor : 'white' }} >
                    <Text  >Share loads Link</Text>
                </TouchableOpacity>

       </View> )})
       }

      { location && <View  style={{flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
         <TouchableOpacity style={{marginRight: 10}}  onPress={()=>navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        <Text style={{fontSize: 20 , color : 'white'}} > {location} Loads</Text>
       </View>}
       

   {!localLoads &&  <ScrollView style={{padding : 10 , marginTop : 10 , paddingTop : 0}} >
   {!location && <View style={{flexDirection : 'row' , justifyContent : 'space-evenly' }} >
    <TouchableOpacity onPress={toggleLocalLoads} style={styles.buttonStyle} >
      <Text style={{color:'white'}} > Local </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.buttonStyle} onPress={()=> navigate(`/location/International`) }>
      <Text style={{color:'white'}} >International  </Text>
    </TouchableOpacity>
    </View>
}
      <div className="Main-grid">
        { loadsList.length>0? rendereIterms: <Text>Loads Loading.....</Text> }
        <View style={{height : 200}} ></View>
        </div>
    </ScrollView> }


       {localLoads && <View style={{alignItems : 'center' , paddingTop : 30}}>
        <TouchableOpacity  onPress={()=>specifyLocation('Zimbabwe')} style={styles.buttonStyleCounry}  >
          <Text style={{color:'#6a0c0c'}}>Zimbabwe </Text>
        </TouchableOpacity>
          <TouchableOpacity onPress={()=> specifyLocation('SouthAfrica') } style={styles.buttonStyleCounry} >
            <Text style={{color:'#6a0c0c'}}>South Africa</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> specifyLocation('Namibia') } style={styles.buttonStyleCounry} >
            <Text style={{color:'#6a0c0c'}}>Namibia </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> specifyLocation('Tanzania') } style={styles.buttonStyleCounry} >
            <Text style={{color:'#6a0c0c'}}> Tanzania</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>specifyLocation ('Mozambique') } style={styles.buttonStyleCounry} >
            <Text style={{color:'#6a0c0c'}}>Mozambique </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> specifyLocation('Zambia') } style={styles.buttonStyleCounry} >
            <Text style={{color:'#6a0c0c'}}> Zambia</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> specifyLocation('Botswana') } style={styles.buttonStyleCounry} >
            <Text style={{color:'#6a0c0c'}}>Botswana </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> specifyLocation('Malawi') }style={styles.buttonStyleCounry} >
            <Text style={{color:'#6a0c0c'}}>Malawi </Text>
        </TouchableOpacity>
       </View> }

       
    </View>
  )

}
export default React.memo( DspAllLoads)

const styles = StyleSheet.create({
    buttonStyle : {
        height : 30,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        // paddingLeft : 10,
        // paddingRight : 10 ,
        width : 100 ,
        marginBottom: 10 ,
        borderWidth: 2 ,
        borderColor:"#6a0c0c" ,
        borderRadius: 10,
        backgroundColor:'#228B22' 
    } ,
    buttonStyleCounry :{
        height : 40,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginBottom: 15 ,
    },
  
    buttonIsFalse : {
     borderWidth : 1 ,
     borderColor : '#6a0c0c' ,
     paddingLeft :4 , 
     paddingRight:4 ,
    //  marginLeft : 6
   } , 
    bttonIsTrue:{
    backgroundColor : '#6a0c0c' ,
     paddingLeft :4 ,
     paddingRight:4 ,
     color :'white' 

    }
});
