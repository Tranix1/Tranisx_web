import React from "react";
import { View,TouchableOpacity , Text, StyleSheet,ScrollView } from "react-native";
import { onSnapshot ,  query ,doc , collection,where ,updateDoc } from "firebase/firestore"
import { auth , db } from "../config/fireBase";


import {useNavigate} from 'react-router-dom';

function Bookings(){
    const navigate = useNavigate()

  const [AllBooks , setAllBooks]=React.useState([])
const getBookedIterms = () => {
  try {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid;
      const whenBookingIterm = query(collection(db, "bookings"), where("bookerId", "==", userId));
      const whenReceivingABook = query(collection(db, "bookings"), where("ownerId", "==", userId));
      
      const sendedMsgs = [];
      const unsubscribe1 = onSnapshot(whenBookingIterm, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const dataWithId = { id: doc.id, ...doc.data() };
          sendedMsgs.push(dataWithId);
        });
        
        const combineBoth = [ ...sendedMsgs];
        setAllBooks(combineBoth);
      });
      
      const unsubscribe2 = onSnapshot(whenReceivingABook, (querySnapshot) => {
        const reacevedMsg = [];
        querySnapshot.forEach((doc) => {
          const dataWithId = { id: doc.id, ...doc.data() };
          reacevedMsg.push(dataWithId);
        });
        
        const combineBoth = [...reacevedMsg, ...sendedMsgs];
        setAllBooks(combineBoth);
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
  const unsubscribe = getBookedIterms();

  return () => {
    unsubscribe(); // Clean up the listeners when the component unmounts
  };
}, []);


 function toggleAcceptOrDeny(id) {
      // return prevTruck.map(oneTruck => {
      //   if (oneTruck.id === id) {
      //     const newRating = oneTruck.Accept ? oneTruck.rating = true : oneTruck.rating = false;
      //     const docRef = doc(collection(db, "bookings"), id);
      //   updateDoc(docRef, {
      //       rating: newRating
      //     })
         
      //     return {
      //       ...oneTruck,
      //       rating: newRating
      //     };
      //   } else {
      //     return oneTruck;
      //   }
      // });
    
  }



let whnBookAload = AllBooks.map((item) => {
  const userId = auth.currentUser.uid;

  if (item.bookerId === userId) {
    return (
      <View style={{ backgroundColor: '#DDDDDD', marginBottom: 15, width : 300}}>
        <Text>You booked {item.ownerName} load</Text>
        <Text>He accepted / denied</Text>

        <TouchableOpacity onPress={()=>navigate(`/message/${item}`)}>
          <Text>Message</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null; // Return null for other items
});


 let whenMyLoadBooked = AllBooks.map((item)=>{
const userId = auth.currentUser.uid;

if(!item.ownerId !== userId ){ 
return (<View style={{height : 50 , backgroundColor :'green'}} key = {item.id}>

          <Text> {item.ownerName} booked ur load </Text>
          
           <TouchableOpacity onPress={()=> toggleAcceptOrDeny(item.id)} >
            <Text>Accept or deny </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>navigate(`/selectedUserTrucks/${item.bookerId}`)} >
          <Text>Trucks owned by person</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>navigate(`/message/${item}`)} >
          <Text>Message </Text>
            </TouchableOpacity>

      </View>  ) 
 
} 
})


    const [itermsYouBooked , setItemsYouBooked] = React.useState(false)
    function toggelItermsYouBooKed (){
      setItemsYouBooked(prev =>!prev)
    }

    const [yourBookedIterms , setYourBookedIterms] = React.useState(false)
    function toggleYourBookedIterms (){
      setYourBookedIterms(prev =>!prev)
    }
      
  return(
    <View style={{alignItems :'center',paddingTop:78}}>     

       <View key={item.id} style={{flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
            <Text>backkkkk</Text>
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add Iterms  </Text>
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
export default React.memo(Bookings)

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