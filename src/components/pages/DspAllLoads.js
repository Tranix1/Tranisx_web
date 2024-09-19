import React, { useEffect, useState} from 'react';
import { View , Text , ScrollView, TouchableOpacity , ActivityIndicator , StyleSheet , Linking, Alert , TextInput , Share} from "react-native"
import { auth, db } from '../config/fireBase';
import { collection, onSnapshot , serverTimestamp ,addDoc, query , where , getDocs ,doc,deleteDoc} from 'firebase/firestore';
import inputstyles from '../styles/inputElement';

// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {useNavigate,useParams} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

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

  //  DRC , ZIM , MOZA , BOTSWA , SOUTH , NAMIB , TANZAN , MALAWI , Zambia
 
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
          filteredData = filteredData.sort((a, b) => b.timeStamp - a.timeStamp);

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


            const [currencyBid , setCurrencyBid] = React.useState(true)
          function toggleCurrencyBid(){
            setCurrencyBid(prev=>!prev)
          }

          const [perTonneBid , setPerTonneBid] = React.useState(false)
          function togglePerTonneBid(){
            setPerTonneBid(prev=>!prev)
          }

          const [bidRate, setBidRate] = React.useState("");
     
      
    const rendereIterms =  loadsList.map((item)=>{ 
      
      const handleSubmit = async (clickedItem , dbName) => {
        
        setSpinnerItem(clickedItem);
        const bookingCollection = collection(db, `${dbName}`);
        const userId = auth.currentUser.uid
        try {
          
          let docId = `${userId}${item.typeofLoad}${item.ratePerTonne}${item.userId}  `
          const existingChat = await checkExistiDoc(docId);
           let theRate 
           let currencyB 
           let perTonneB

              if(bidDisplay[item.id]){ 
              theRate= bidRate  
               currencyB = currencyBid  
               perTonneB = perTonneBid
              }else{

               currencyB = null
               perTonneB = null
                theRate = item.ratePerTonne
              }

          if(!existingChat){
        const docRef = await addDoc(bookingCollection, {
        itemName : item.typeofLoad ,
        fromLocation : item.fromLocation ,
        toLocation : item.toLocation ,
        bookerId : userId ,
        bookerName : username ,
        ownerName: item.companyName ,
        ownerId : item.userId ,
        Accept : null ,
        isVerified : item.isVerified ,
        msgReceiverId : userId ,
        docId : docId,
        rate :  theRate ,
        currencyB : currencyB ,
        perTonneB : perTonneB ,
        deletionTime :Date.now() + 5 * 24 * 60 * 60 * 1000 ,
        timestamp : serverTimestamp() ,
      });
      
      setBidRate("")
      alert(`${!bidDisplay[item.id] ? "booking": "bidding"} was successfull`)    
        }else {
          alert("Already Booked this Item!")    

        }
        
        // const existingChat = await checkExistingChat(addChatId);
        let newBiddedDoc = null
        let newBOOKEDDoc = null

        dbName === "bookings" ? newBOOKEDDoc = true  : newBiddedDoc = true

        const newIterms = collection(db ,'newIterms');
      // Chat doesn't exist, add it to 'ppleInTouch'
      await addDoc(newIterms, {
        bookingdocs : newBOOKEDDoc ,
        biddingdocs : newBiddedDoc ,
        timestamp : serverTimestamp() ,
        receriverId : item.userId ,
      });
      
      setSpinnerItem(null)      

    } catch (err) {
      setBookingError(err.toString());
      setSpinnerItem(null)      
    }
  };
        const message =  ` Is this Load still available   ${item.typeofLoad} from  ${item.fromLocation} to ${item.toLocation} ${item.ratePerTonne} ${item.perTonne ?"Per tonne" : null} from Truckerz ` ; // Set your desired message here

  let contactMe = ( <View style={{ paddingLeft: 30 }}>

        {auth.currentUser &&  <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.companyName} `)} >
            <Text>Message now</Text>
          </TouchableOpacity>}
          
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)}>
            <Text>Phone call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}&text=${encodeURIComponent(message)}`)}>
            <Text>WhatsApp</Text>
          </TouchableOpacity>
          
          </View>)


      let bidNow = (
        <View style={{position:'absolute' , bottom:0, backgroundColor:'#DDDDDD'}}>

    {spinnerItem === item ? (
        <ActivityIndicator size={34} />
      ) :    <View style={{flexDirection:'row', alignItems : 'center' ,}}>

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
            style={inputstyles.addIterms }
            placeholder="Enter rate here"
          />
          <TouchableOpacity onPress={togglePerTonneBid} >
            {perTonneBid ? <Text style={styles.bttonIsTrue} >Per tonne</Text> : 
              <Text style={styles.buttonIsFalse}>Per tonne</Text>}
          </TouchableOpacity>
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
    <View  key={item.id} style={{ backgroundColor:  "#DDDDDD", marginBottom : 8, padding :6  , }} >

            
            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}
        <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 17}}  >{item.companyName} </Text>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Commodity</Text>
        <Text  >:  {item.typeofLoad} </Text>
      </View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Route</Text>
        <Text>:  from  {item.fromLocation}  to  {item.toLocation} </Text>
      </View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Rate</Text>
        <Text>:  {item.currency ? "USD" : "RAND"} {item.ratePerTonne} {item.perTonne ? "Per tonne" :null} </Text>
      </View>

       {   !contactDisplay[item.id] && <View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Contact</Text>
        <Text>:  {item.contact}</Text>
      </View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Payment Terms </Text>
        <Text>:  {item.paymentTerms} </Text>
      </View>

    { item.requirements && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Requirements</Text>
         <Text>:  {item.requirements} </Text>
      </View>}

      {item.additionalInfo && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Additional info </Text>
       {<Text>:  {item.additionalInfo} </Text>} 
      </View>}

        {item.activeLoading&& <Text style={{fontSize:17 , fontStyle:'italic' , color:'green'}} >Active Loading </Text> }
        </View> }


        {contactDisplay[item.id] && contactMe}

         {bidDisplay[item.id]&& bidNow}

        {!bidDisplay[item.id]&&<TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>}
        
        
       { auth.currentUser ? !bidDisplay[item.id]&& <View style={{flexDirection : 'row', justifyContent : 'space-evenly' }} >  
      {bookingError&&<Text>{bookingError}</Text>}
          {spinnerItem === item ? (
        <ActivityIndicator size={34} />
      ) : (
        <TouchableOpacity style={styles.buttonStyle} onPress={() => handleSubmit(item , "bookings")}>
          <Text>Book</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={()=>toggleBid(item.id) } style={{ height : 30,justifyContent : 'center' , alignItems : 'center' ,width : 90 ,marginBottom: 10 ,borderRadius: 10}} >
        <Text>Bid</Text>
      </TouchableOpacity>

        <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.companyName} `)} style={styles.buttonStyle} >
          <Text>Message</Text>
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
                    <Text  >Share loads </Text>
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
      <Text> Local </Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.buttonStyle} onPress={()=> navigate(`/location/International`) }>
      <Text> International  </Text>
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
        width : 100 ,
        marginBottom: 10 ,
        borderWidth: 2 ,
        borderColor:"#6a0c0c" ,
        borderRadius: 10
    } ,
    buttonStyleCounry :{
        height : 40,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginBottom: 15 ,
        borderWidth: 2 ,
        borderColor:"#6a0c0c" ,
        borderRadius: 3
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
