import React from "react";
import { View,TouchableOpacity , Text, StyleSheet,ScrollView } from "react-native";
import { onSnapshot ,  query ,doc , collection,where ,updateDoc , deleteDoc ,} from "firebase/firestore"
import { auth , db } from "../config/fireBase";


import {useNavigate , useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';

function BookingsandBiddings(){

    const navigate = useNavigate()
    const {dspRoute , dbName} = useParams()

  const [getAllIterms , setAllIterms]=React.useState([])
     
  const deleteLoad = async (id) => {
  try {
    const loadsDocRef = doc(db, `${dbName}`, id);
    await deleteDoc(loadsDocRef);
    // Remove the deleted item from loadsList
    setAllIterms((prevLoadsList) => prevLoadsList.filter(item => item.id !== id));
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};

     const checkAndDeleteExpiredItems = () => {
  getAllIterms.forEach((item) => {
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


const getAlltermsF = () => {
  try {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const whenBookingIterm = query(collection(db, `${dbName}`), where("bookerId", "==", userId));
      const whenReceivingABook = query(collection(db, `${dbName}`), where("ownerId", "==", userId));
      
      const sendedMsgs = [];
      const unsubscribe1 = onSnapshot(whenBookingIterm, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const dataWithId = { id: doc.id, ...doc.data() };
          sendedMsgs.push(dataWithId);
        });
        

      });
      
      const unsubscribe2 = onSnapshot(whenReceivingABook, (querySnapshot) => {
        const reacevedMsg = [];
        querySnapshot.forEach((doc) => {
          const dataWithId = { id: doc.id, ...doc.data() };
          reacevedMsg.push(dataWithId);
        });
        
        const combineBoth = [...reacevedMsg, ...sendedMsgs];
        setAllIterms(combineBoth);
      });

      return () => {
        unsubscribe1(); // Clean up the listener when the component unmounts
        unsubscribe2(); // Clean up the listener when the component unmounts
      };
    }
    
  } catch (error) {
    console.error(error);
  }
};

  React.useEffect(() => {
    getAlltermsF()
    },[dspRoute]);

    const toggleAcceptOrDeny = async (dbNameMin , id ,decision ) => {
      try {
        if (decision === "Accept") {
          const docRef = doc(db, `${dbNameMin}`, id);
          await updateDoc(docRef, { Accept : true ,  });
          alert("You Accepted the offer");
        }else{
          const docRef = doc(db, `${dbNameMin}`, id);
          await updateDoc(docRef, { Accept : false ,  });
          alert("Username denied the offer!");
        }
      } catch (err) {
        console.error(err);
      }

  }



let whnBookAload = getAllIterms.map((item) => {
  const userId = auth.currentUser.uid;

  if (item.bookerId === userId) {
    return (
      <View style={{ backgroundColor: '#DDDDDD', marginBottom: 15, width : 350}}>

            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}
        <Text> booked {item.ownerName} </Text>
        <Text> You booked {item.itemName} </Text>
        <Text>Its rate : {item.currencyB ? "USD" : "Rand"}  {item.rate} {item.perTonneB ? "per tonne": null} load </Text>

          <Text>
         Decision : {item.Accept === null ? "Pending" : item.Accept === true ? "Accepted" : item.Accept === false ? "Denied" : "Unknown"}
           </Text>

          <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.companyName} `)}  >
          <Text>Message</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null; // Return null for other items
});


 let whenMyLoadBooked = getAllIterms.map((item)=>{
const userId = auth.currentUser.uid;
        const serializedItem = JSON.stringify(item);
if(!item.ownerId === userId ){ 
return (<View style={{ backgroundColor: '#DDDDDD', marginBottom: 15, width : 350}} key = {item.id}>


            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}
          <Text> {item.ownerName} booked ur load </Text>
          
           <TouchableOpacity onPress={()=> toggleAcceptOrDeny( "bookings" , item.id  , "Accept")} >
            <Text>Accept </Text>
          </TouchableOpacity>
          
           <TouchableOpacity onPress={()=> toggleAcceptOrDeny("bookings", item.id  , "Deny")} >
            <Text>Deny </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>navigate(`/selectedUserTrucks/${item.bookerId}`)} >
          <Text>Trucks owned by person</Text>
          </TouchableOpacity>

          <TouchableOpacity  onPress={()=>navigate(`/message/${item.bookerName}/${item.bookerId} `)}  >
          <Text>Message </Text>
            </TouchableOpacity>

      </View>  ) 
 
} 
})


    let whenBidALoad =  getAllIterms.map((item) => {
  const userId = auth.currentUser.uid;

  if (item.bookerId === userId) {
    return (
      <View style={{ backgroundColor: '#DDDDDD', marginBottom: 15, width : 400 , paddingLeft :10 }}>

            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}
        <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 17}}> {item.ownerName} </Text>

        <Text> You bidded {item.itemName} </Text>
        <Text> Offer : {item.currencyB ? "USD" : "Rand"}  {item.rate} {item.perTonneB ? "per tonne": null}</Text>
        <Text>Route : {item.fromLocation} TO {item.toLocation} </Text>

        <Text>
         Decision : {item.Accept === null ? "Pending" : item.Accept === true ? "Accepted" : item.Accept === false ? "Denied" : "Unknown"}
        </Text>
          <TouchableOpacity  onPress={()=>navigate(`/message/${item.ownerId}/${item.ownerName} `)}  >
          <Text>Message</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null; // Return null for other items
});

      
      const whenMyLoadBidded = getAllIterms.map((item)=>{
      const userId = auth.currentUser.uid;
      if(!item.ownerId !== userId ){ 
      return (<View style={{ backgroundColor: '#DDDDDD', marginBottom: 15, width : 350}} key = {item.id}>


                  { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
                  <VerifiedIcon style={{color : 'green'}} />
                  </View>}
                <Text> {item.ownerName}</Text>
                
                
                  <Text> {item.ownerName} </Text>
                  <Text> {item.itemName} was bidded</Text>
                  <Text>The offered rate  {item.currencyB ? "USD" : "Rand"} {item.rate} {item.perTonneB ? "per tonne": null}</Text>
                  <Text>Route : {item.fromLocation} TO {item.toLocation} </Text>

                <TouchableOpacity onPress={()=> toggleAcceptOrDeny('biddings' ,item.id  , "Accept")} >
                  <Text>Accept </Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={()=> toggleAcceptOrDeny('biddings' ,item.id  , "Deny")} >
                  <Text>Deny </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>navigate(`/selectedUserTrucks/${item.bookerId}`)} >
                <Text>Trucks owned by person</Text>
                </TouchableOpacity>

                <TouchableOpacity  onPress={()=>navigate(`/message/${item.bookerName}/${item.bookerId} `)}  >
                <Text>Message </Text>
                  </TouchableOpacity>

            </View>  ) 
      
      } 
      })


  return(
    <View style={{paddingTop:80 , alignItems:'center'}}>     

       <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > {dspRoute? dspRoute : "Bookings and Biddings"} </Text>
         </View>
    <View style={{flexDirection:'row', alignItems : 'center'  , justifyContent:'center'}}>
          <View style={{marginRight:7}} >
                  { !dspRoute &&<TouchableOpacity onPress={()=>navigate('/bookingsandBiddings/bookings/itemsYouBooked') } style={styles.slctView}>
                        <Text>Items you booked</Text>
                      </TouchableOpacity>}

                    { !dspRoute&&<TouchableOpacity onPress={()=>navigate('/bookingsandBiddings/bookings/yourBookedItems') } style={styles.slctView}>
                        <Text>Your booked Items</Text>
                      </TouchableOpacity>}
          </View>

<View>
        { !dspRoute&&<TouchableOpacity onPress={()=>navigate('/bookingsandBiddings/biddings/itermsYouBidded') } style={styles.slctView}>
              <Text>Items you Bidded</Text>
            </TouchableOpacity>}

          { !dspRoute&& <TouchableOpacity onPress={()=>navigate('/bookingsandBiddings/biddings/yourBiddedItems') } style={styles.slctView}>
              <Text>Your Bidded Items</Text>
            </TouchableOpacity>}
 </View>
  </View> 
  
            {dspRoute=== "itermsYouBidded" && <ScrollView>
              {whenBidALoad}
            </ScrollView> }

            
            {dspRoute=== "yourBiddedItems" && <ScrollView> 
              {whenMyLoadBidded}
              </ScrollView>}
              
            {dspRoute=== "itemsYouBooked" && <ScrollView>
              {whnBookAload}
            </ScrollView> }
            
            {dspRoute===  "yourBookedItems" && <ScrollView> 
              {whenMyLoadBooked}
              </ScrollView>}

    </View>
  )
}
export default React.memo(BookingsandBiddings)

const styles = StyleSheet.create({
 slctView : {
  height : 45 ,
  width : 200 ,
  borderColor : "#6a0c0c" ,
  borderWidth : 1 ,
  justifyContent : 'center',
  alignItems : 'center' ,
  marginBottom : 10
 } 
});
