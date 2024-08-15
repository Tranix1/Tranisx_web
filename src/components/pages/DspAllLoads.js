import React, { useEffect, useState} from 'react';
import { View , Text , ScrollView, TouchableOpacity , ActivityIndicator , StyleSheet , Linking, Alert , TextInput} from "react-native"
import { auth, db } from '../config/fireBase';
import { collection, onSnapshot , serverTimestamp ,addDoc, query , where , getDocs ,doc,deleteDoc} from 'firebase/firestore';
import inputstyles from '../styles/inputElement';

// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {useNavigate,useParams} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import DeleteIcon from '@mui/icons-material/Delete';
function DspAllLoads({username}){  

const navigate = useNavigate()
const {userId ,  location} = useParams()

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
          setLoadsList(loadedData);
        });
        return unsubscribe;
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
        return unsubscribe;
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
      
  
        const serializedItem = JSON.stringify(item);

      const handleSubmit = async ({clickedItem , dbName} ) => {

        
        setSpinnerItem(clickedItem);
        const bookingCollection = collection(db, `${dbName}`);
        const userId = auth.currentUser.uid
        try {
          
          let docId = `${userId}${item.typeofLoad}${item.ratePerTonne}${item.userId}`
          const existingChat = await checkExistiDoc(docId);
          
          if(!existingChat){
        const docRef = await addDoc(bookingCollection, {
        itemName : item.typeofLoad ,
        bookerId : userId ,
        bookerName : username ,
        ownerName: item.companyName ,
        ownerId : item.userId ,
        Accept : null ,
        msgReceiverId : userId ,
        docId : docId,
        rate : bidDisplay ? bidRate :  item.ratePerTonne,
        deletionTime :Date.now() + 5 * 24 * 60 * 60 * 1000 ,
        timestamp : serverTimestamp() ,
      });
      alert("Booking successful!")    
        }else {
          alert("Already Booked this Item!")    

        }
      setSpinnerItem(null)      
    } catch (err) {
      setBookingError(err.toString());
    }
  };

        
  let contactMe = ( <View style={{ paddingLeft: 30 }}>

        { auth.currentUser && <TouchableOpacity onPress={()=>navigate(`/message/${encodeURIComponent(serializedItem)} `) }>
            <Text>Message now</Text>
          </TouchableOpacity>}
          
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)}>
            <Text>Phone call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}`)}>
            <Text>WhatsApp</Text>
          </TouchableOpacity>
          
          </View>)


      let bidNow = (
        <View>

      <View style={{flexDirection:'row', alignItems : 'center'}}>

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
   </View>


          <View style={{flexDirection:'row'}}>

            <TouchableOpacity onPress={()=>handleSubmit(item , "biddings")} >
              <Text>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>toggleBid(item.id) }> 
              <Text>Cancel </Text>
            </TouchableOpacity>

          </View>

        </View>
      )

  return(
    <View  key={item.id} style={{ backgroundColor:  "#DDDDDD", marginBottom : 8, padding :6  }} >

            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}
        <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 17}}  >{item.companyName} </Text>
        <Text>Commodity : {item.typeofLoad} </Text>
        <Text> Route : from{item.fromLocation} to {item.toLocation} </Text>

        <View style={{flexDirection : 'row'}} >
          <Text>Rate :</Text>
        {item.currency ? <Text>USD</Text> : <Text>Rand </Text>}
        <Text> {item.ratePerTonne} </Text>
         {item.perTonne ? <Text> Per tonne</Text> : null}
        </View>

       {   !contactDisplay[item.id] && !bidDisplay[item.id]? <View>
        <Text>Contact : {item.contact}</Text>
        <Text> payment terms : {item.paymentTerms} </Text>
        <Text>Requirements : {item.requirements} </Text>
        <Text>additional info : {item.additionalInfo} </Text> 
        {item.activeLoading&& <Text>Active Loading </Text> }
        </View> : null}


        {contactDisplay[item.id] && contactMe}

         {bidDisplay[item.id]&& bidNow}

        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>
        
        
       { auth.currentUser ? <View style={{flexDirection : 'row', justifyContent : 'space-evenly' }} >  
      {bookingError&&<Text>{bookingError}</Text>}
          {spinnerItem === item ? (
        <ActivityIndicator size={34} />
      ) : (
        <TouchableOpacity style={styles.buttonStyle} onPress={() => handleSubmit(item , "bookings")}>
          <Text>Book</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={()=>toggleBid(item.id) }>
        <Text>Bid</Text>
      </TouchableOpacity>

        <TouchableOpacity  onPress={()=>navigate(`/message/${encodeURIComponent(serializedItem)}`)} style={styles.buttonStyle} >
          <Text>Message</Text>
        </TouchableOpacity>       
        </View> : 
        <Text> Sign In to Book Bid and Message </Text>
        }

      </View>     
  )})


        let comapnyName = null;
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
      
           <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > { item.companyName}   Loads </Text>
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
        { loadsList.length>0? rendereIterms: <Text>Loading.....</Text> }
        <View style={{height : 200}} ></View>
        </div>
    </ScrollView> }


       {localLoads && <View style={{alignItems : 'center' , paddingTop : 30}}>
        <TouchableOpacity  onPress={()=>specifyLocation('Zimbabwe')} style={styles.buttonStyle} >
          <Text> Zimbabwe </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>specifyLocation('South')}>
          <Text> South </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text> Moza </Text>
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
