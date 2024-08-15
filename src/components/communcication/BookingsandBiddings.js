import React from "react";
import { View,TouchableOpacity , Text, StyleSheet,ScrollView } from "react-native";
import { onSnapshot ,  query ,doc , collection,where ,updateDoc , deleteDoc ,} from "firebase/firestore"
import { auth , db } from "../config/fireBase";


import {useNavigate} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BookingsandBiddings(){

    const navigate = useNavigate()

  const [getAllIterms , setAllIterms]=React.useState([])

  const deleteLoad = async (id) => {
  try {
    const loadsDocRef = doc(db, 'Loads', id);
    await deleteDoc(loadsDocRef);
    console.log(`Item with ID ${id} deleted successfully from the database.`);

    // Remove the deleted item from loadsList
    setAllIterms((prevLoadsList) => prevLoadsList.filter(item => item.id !== id));
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};
const getBookedIterms = (dbName) => {
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
        
        const combineBoth = [ ...sendedMsgs];
        setAllIterms(combineBoth);
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


        const checkAndDeleteExpiredItems = () => {
          getAllIterms.forEach((item) => {
            const deletionTime = item.deletionTime;
            const timeRemaining = deletionTime - Date.now();
            if (timeRemaining <= 0) {
              deleteLoad(item.id);
            } else {
              setTimeout(() => {
                deleteLoad(item.id);
              }, timeRemaining);
            }
          });
        };

        checkAndDeleteExpiredItems();

        const interval = setInterval(() => {
          checkAndDeleteExpiredItems();
        }, 1000); // Check every second for expired items

        return () => {
          clearInterval(interval);
        };
    
  } catch (error) {
    console.error(error);
  }
};
















    const toggleAcceptOrDeny = async (id) => {
   
      try {
        if (auth.currentUser) {

          const docRef = doc(db, 'bookings', id);
          await updateDoc(docRef, { Accept : true ,  });
          alert("Username updated successfully!");
        }
      } catch (err) {
        console.error(err);
      }

  }



let whnBookAload = getAllIterms.map((item) => {
  const userId = auth.currentUser.uid;

        const serializedItem = JSON.stringify(item);
  if (item.bookerId === userId) {
    return (
      <View style={{ backgroundColor: '#DDDDDD', marginBottom: 15, width : 300}}>
        <Text>You booked {item.ownerName} load</Text>
        <Text>He accepted / denied</Text>

        <TouchableOpacity onPress={()=>navigate(`/message/${encodeURIComponent(serializedItem)}`)}>
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
if(!item.ownerId !== userId ){ 
return (<View style={{ backgroundColor: '#DDDDDD', marginBottom: 15, width : 300}} key = {item.id}>

          <Text> {item.ownerName} booked ur load </Text>
          
           <TouchableOpacity onPress={()=> toggleAcceptOrDeny(item.id)} >
            <Text>Accept or deny </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>navigate(`/selectedUserTrucks/${item.bookerId}`)} >
          <Text>Trucks owned by person</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>navigate(`/message/${encodeURIComponent(serializedItem)}`)} >
          <Text>Message </Text>
            </TouchableOpacity>

      </View>  ) 
 
} 
})


    const [itermsYouBooked , setItemsYouBooked] = React.useState(false)
    function toggelItermsYouBooKed (){
      setItemsYouBooked(prev =>!prev)
      getBookedIterms("bookings")
    }

    const [yourBookedIterms , setYourBookedIterms] = React.useState(false)
    function toggleYourBookedIterms (){
      setYourBookedIterms(prev =>!prev)
      getBookedIterms("bookings")
    }

    const [itermsYouBidded , setItemsYouBidded] = React.useState(false)
    function toggelItermsYouBidded (){
      setItemsYouBidded(prev =>!prev)
      getBookedIterms("biddings")
    }

    const [yourBiddedIterms , setYourBiddedIterms] = React.useState(false)
    function toggleYourBiddedIterms (){
      setYourBiddedIterms(prev =>!prev)
      getBookedIterms("biddings")
    }


    let whenMyLoadBidded = (
      <View>
        <Text> panashe bidded sadza </Text>
        <Text> The required rate is rate </Text>
        <Text> Accept / Deny  required rate is rate </Text>
        <Text> Message   required rate is rate </Text>
        <Text> get in touch Now </Text>
      </View>
    )
      
  return(
    <View style={{alignItems :'center',paddingTop:80}}>     

       <View style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Bookings  </Text>
       </View>

        { !yourBookedIterms&&   <TouchableOpacity onPress={toggelItermsYouBooKed} style={styles.slctView}>
              <Text>Iterms you booked</Text>
            </TouchableOpacity>}

          { !itermsYouBooked&& <TouchableOpacity onPress={toggleYourBookedIterms} style={styles.slctView}>
              <Text>Your booked Iterms</Text>
            </TouchableOpacity>}

            {itermsYouBooked && <ScrollView>
              {whnBookAload}
            </ScrollView> }
            
            {yourBookedIterms&& <ScrollView> 
              {whenMyLoadBooked}
              </ScrollView>}

    </View>
  )
}
export default React.memo(BookingsandBiddings)

const styles = StyleSheet.create({
 slctView : {
  height : 45 ,
  width : 250 ,
  borderColor : "#6a0c0c" ,
  borderWidth : 1 ,
  justifyContent : 'center',
  alignItems : 'center' ,
  marginBottom : 10
 } 
});