import React from "react";
import { View,TouchableOpacity , Text, StyleSheet,ScrollView,Linking } from "react-native";
import { onSnapshot ,  query ,doc , collection,where ,updateDoc , deleteDoc ,runTransaction} from "firebase/firestore"
import { auth , db } from "../config/fireBase";


import {useNavigate , useParams} from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';

function BookingsandBiddings(){

    const navigate = useNavigate()
    const {dspRoute , dbName} = useParams()


  const [ newItermBooked, setNewBkedIterm] = React.useState(0);
  const [ newItermBidded , setNewBiddedIterm] = React.useState(0);

  // const [ valueOfUpdates , setVlueOfUpdates] = React.useState(null);

      React.useEffect(() => {
        try {
          if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const loadsQuery = query(collection(db, "newIterms"), where("receriverId", "==", userId));

            const unsubscribe = onSnapshot(loadsQuery, (querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                const newBokedIterms = data.bookingdocs || 0;   // Assuming isVerified is a boolean field
                const newBiiedIterms = data.biddingdocs || 0;   // Assuming isVerified is a boolean field

                setNewBkedIterm(newBokedIterms);
                setNewBiddedIterm(newBiiedIterms)
              });
            });

            return () => unsubscribe(); // Cleanup the listener when the component unmounts
          }

        } catch (error) {
          console.error(error);
        }
      }, []);

      if(dspRoute === "yourBiddedItems" ||dspRoute === "yourBookedItems"){
       const userId = auth.currentUser.uid
       const docRef = doc(db, 'newIterms', userId);
       runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);

        if (docSnap.exists()) {
            const currentBiddingDocs = docSnap.data().biddingdocs || 0;

            const currentBookingsDocs = docSnap.data().bookingdocs || 0;
            let updatedBiddingDocs = currentBiddingDocs
            let updateBokingsDocs = currentBookingsDocs
            
            if (dspRoute === "yourBiddedItems") {
                updatedBiddingDocs = 0;
            } else if (dspRoute === "yourBookedItems") {
                updateBokingsDocs = 0;
            }

            transaction.update(docRef, {
                biddingdocs : updatedBiddingDocs,
                bookingdocs :  updateBokingsDocs ,
            });
        }
    });
      }

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

  const loadTaken = async (loadid ,bbId) => {
        const loadsDocRef = doc(db, 'Loads', loadid);
        await deleteDoc(loadsDocRef);
    const bbDocRef = doc(db, `${dbName}`, bbId);
    await deleteDoc(bbDocRef);
    getAlltermsF()
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

    const [contactDisplay, setContactDisplay] = React.useState({ ['']: false });
    const toggleContact = (itemId) => {
      setContactDisplay((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    };




let whnBookBiddAload = getAllIterms.map((item) => {
  const userId = auth.currentUser.uid;

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
  if (item.bookerId === userId) {
    return (
      <View style={{ backgroundColor: '#DDDDDD', marginBottom: 15, width : 350 , padding :7}}>

            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}

            
        <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 17}} >{item.ownerName} </Text>

         <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >{dbName === "bookings" ?  "Booked" : "Bidded"}</Text>
        <Text>:  {item.itemName} </Text>
      </View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Rate</Text>
        <Text>:  {item.currencyB ? "USD" : "RAND"} {item.rate} {item.perTonneB ? "Per tonne" :null} </Text>
      </View>

  <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Route</Text>
        <Text>:  from  {item.fromLocation}  to  {item.toLocation} </Text>
      </View>
          
      <View style={{flexDirection :'row'}} >
        <Text style={{width :60}} >Decision</Text>
        <Text>: {item.Accept === null ? "Pending" : item.Accept === true ? "Accepted" : item.Accept === false ? "Denied" : "Unknown"}</Text>
      </View>

        {contactDisplay[item.id] && contactMe}
        {item.Accept && <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>}

          <TouchableOpacity onPress={()=>loadTaken(  item.loadId ,  item.id ) } style={{backgroundColor :'red' , width : 100 , alignItems :'center' , borderRadius :50 , position :'absolute', right :7 , bottom :7}}>
            <Text style={{color:'white'}} > Not intrested </Text>
          </TouchableOpacity>
      </View>
    );
  }

  return null; // Return null for other items
});




 let whenMyLoadBookBidd = getAllIterms.map((item)=>{
  
const userId = auth.currentUser.uid;

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
          let dbToBechanged 
          dbName === "bookings" ?  dbToBechanged = "bookings" : dbToBechanged = "biddings"

if(item.ownerId === userId ){ 
return (<View style={{ backgroundColor: '#DDDDDD', marginBottom: 15, width : 350 , padding :7}} key = {item.id}>


            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}

            <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 17}}  >{item.ownerName} </Text>


 <View style={{flexDirection :'row'}} >
        <Text style={{width :75}} >Commodity</Text>
        <Text>: {item.itemName} was {dbName === "bookings" ?  "Booked" : "Bidded"} </Text>
      </View>

      <View style={{flexDirection :'row'}} >
        <Text style={{width :75}} >Rate</Text>
        {/* <Text>:  {item.currencyB ? "USD" : "RAND"} {item.rate} {item.perTonneB ? "Per tonne" :null} </Text> */}
        <Text>: {item.currencyB ? "USD" : "Rand"} {item.rate} {item.perTonneB ? "per tonne": null} {dbName === "bookings" ?  "solid" : "offered"} </Text>
      </View>

  <View style={{flexDirection :'row'}} >
        <Text style={{width :75}} >Route</Text>
        <Text>:  from  {item.fromLocation}  to  {item.toLocation} </Text>
      </View>

                 <View style={{flexDirection:'row' , margin :4}} >      
           <TouchableOpacity onPress={()=> toggleAcceptOrDeny( dbToBechanged , item.id  , "Accept")} style={styles.bttonIsTrue} >
            <Text style={{color:'white'}} >Accept </Text>
          </TouchableOpacity>
          
           <TouchableOpacity onPress={()=> toggleAcceptOrDeny( dbToBechanged , item.id  , "Deny")} style={styles.buttonIsFalse}>
            <Text  >Deny </Text>
          </TouchableOpacity>
            </View>

      <View style={{flexDirection:'row', marginBottom : 25 , height : 30 , alignSelf:'center' , marginTop : 6, borderWidth : 2 , borderColor :'#6a0c0c' }} >
          <TouchableOpacity onPress={()=>navigate(`/selectedUserTrucks/${item.bookerId}`)}style={{alignItems :'center' ,borderColor :'#6a0c0c'  , borderRightWidth :1 , paddingLeft :5 , paddingRight:5 }} >
          <Text style={{textDecorationLine:'underline',fontSize:17 }} >Bookers trucks</Text>

          </TouchableOpacity>

        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{  borderRightWidth :1 , paddingLeft :5 , paddingRight:5 }} >
          <Text style={{textDecorationLine:'underline', fontSize:17}} > get In Touch now</Text>
        </TouchableOpacity>
        </View>

        {contactDisplay[item.id] && contactMe}

          <TouchableOpacity onPress={()=>loadTaken(  item.loadId ,  item.id ) } style={{backgroundColor :'red' , width : 100 , alignItems :'center' , borderRadius :50 , position :'absolute', right :7 , bottom :7}}>
            <Text style={{color:'white'}} > Load Taken </Text>
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

                    { !dspRoute&&<TouchableOpacity onPress={()=>navigate('/bookingsandBiddings/bookings/yourBookedItems') } style={styles.slctView}>
                        <Text>Your booked Items</Text>
        {  <Text style={{backgroundColor :'#6a0c0c' , color:'white' , paddingLeft :5, paddingRight:5, marginRight :6 , borderRadius :10 , justifyContent:'center' }} >{newItermBooked} </Text>}
                      </TouchableOpacity>}
                  { !dspRoute &&<TouchableOpacity onPress={()=>navigate('/bookingsandBiddings/bookings/itemsYouBooked') } style={styles.slctView}>
                        <Text>Items you booked</Text>
                      </TouchableOpacity>}
          </View>

<View>

          { !dspRoute&& <TouchableOpacity onPress={()=>navigate('/bookingsandBiddings/biddings/yourBiddedItems') } style={styles.slctView}>
              <Text>Your Bidded Items</Text>
        { <Text style={{backgroundColor :'rgb(129,201,149)', color:'white' , paddingLeft :5, paddingRight:5, marginRight :6 , borderRadius :10 , justifyContent:'center'  }} > {newItermBidded} </Text> }
            </TouchableOpacity>}
        { !dspRoute&&<TouchableOpacity onPress={()=>navigate('/bookingsandBiddings/biddings/itermsYouBidded') } style={styles.slctView}>
              <Text>Items you Bidded</Text>
            </TouchableOpacity>}
 </View>
  </View> 
  
            {dspRoute=== "itermsYouBidded" && <ScrollView>
              {whnBookBiddAload}
            </ScrollView> }

            
            {dspRoute=== "yourBiddedItems" && <ScrollView> 
              {whenMyLoadBookBidd}
              </ScrollView>}
              
            {dspRoute=== "itemsYouBooked" && <ScrollView>
              {whnBookBiddAload}
            </ScrollView> }
            
            {dspRoute===  "yourBookedItems" && <ScrollView> 
              {whenMyLoadBookBidd}
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
 } ,  buttonIsFalse : {
     borderWidth : 1 ,
     borderColor : '#6a0c0c' ,
     paddingLeft :4 , 
     paddingRight:4 ,
    //  marginLeft : 6
   } , 
    bttonIsTrue:{
    backgroundColor : 'green' ,
     paddingLeft :4 ,
     paddingRight:4 ,
     color :'white' 

    }
});



