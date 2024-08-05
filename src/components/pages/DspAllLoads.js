import React, { useEffect, useState} from 'react';
import { View , Text , ScrollView, TouchableOpacity , ActivityIndicator , StyleSheet , Linking, Alert} from "react-native"
import { auth, db } from '../config/fireBase';
import { collection, onSnapshot , serverTimestamp ,addDoc, query , where , getDocs ,doc,deleteDoc} from 'firebase/firestore';

// import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {useNavigate,useParams} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
function DspAllLoads({username}){  

const navigate = useNavigate()
const {userId} = useParams()


  const deleteLoad = async (id) => {
  try {
    const loadsDocRef = doc(db, 'Loads', id);
    await deleteDoc(loadsDocRef);
    console.log(`Item with ID ${id} deleted successfully from the database.`);

    // Remove the deleted item from loadsList
    setLoadsList((prevLoadsList) => prevLoadsList.filter(item => item.id !== id));
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};


    //  const loadsCollection = collection(db, 'Loads');  
      const [loadsList, setLoadsList] = useState([]);


  useEffect(() => {
    const loadData = () => {
      if (userId) {
        const dataQuery = query(collection(db, "Loads"), where("userId", "==", userId));

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          const loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

          setLoadsList(loadedData);
        });

        return unsubscribe;
      } else {
        const loadsCollection = collection(db, "Loads");

        const unsubscribe = onSnapshot(loadsCollection, (querySnapshot) => {
          let filteredData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          filteredData = filteredData.sort((a, b) => b.timeStamp - a.timeStamp);

          setLoadsList(filteredData);
        });

        const checkAndDeleteExpiredItems = () => {
          loadsList.forEach((item) => {
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
          unsubscribe(); // Unsubscribe the listener when the component unmounts
        };
      }
    };

    loadData();
  }, [userId, loadsList]); 
    
    

    const [contactDisplay, setContactDisplay] = React.useState({ ['']: false });
    const toggleContact = (itemId) => {
      setContactDisplay((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    };
    
    
    const [spinnerItem, setSpinnerItem] = React.useState(null);
    const checkExistiDoc = async (docId) => {
    const chatsRef = collection(db, 'bookings'); // Reference to the 'ppleInTouch' collection
    const chatQuery = query(chatsRef, where('docId', '==',docId )); // Query for matching chat ID

      const querySnapshot = await getDocs(chatQuery);  
     // Check if any documents exist with the chat ID
      return !querySnapshot.empty; // Returns true if a document exists, false otherwise
    };


    const rendereIterms =  loadsList.map((item)=>{ 
      
  
        const serializedItem = JSON.stringify(item);

      const handleBook = async (clickedItem) => {

        
        setSpinnerItem(clickedItem);
        const bookingCollection = collection(db, "bookings");
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
        rate : item.ratePerTonne,
        timestamp : serverTimestamp() ,
      });
      alert("Booking successful!")    
        }else {
          alert("Already Booked this Item!")    

        }
      setSpinnerItem(null)      
    } catch (err) {
      console.error(err);
    }
  };

        
    let contactMe = ( <View style={{ paddingLeft: 30 }}>

          <TouchableOpacity onPress={()=>navigate(`/message/${item} `) }>
            <Text>Message now</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)}>
            <Text>Phone call</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}`)}>
            <Text>WhatsApp</Text>
          </TouchableOpacity>

          </View>)


  return(
    <View  key={item.id} style={{ backgroundColor:  "#DDDDDD", marginBottom : 8, padding :6  }} >

            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
            </View>}
        <Text style={{color:'#6a0c0c' , fontSize:15,textAlign :'center' ,fontSize: 17}}  >{item.companyName} </Text>
        <Text>Commodity {item.typeofLoad} </Text>
        <Text>from {item.fromLocation} to {item.toLocation} </Text>
        <Text>Rate {item.ratePerTonne} </Text>

       {!contactDisplay[item.id] && <View>
        <Text>Contact : {item.contact}</Text>
        <Text> payment terms {item.paymentTerms} </Text>
        <Text>Requirements {item.requirements} </Text>
        <Text>additional info {item.additionalInfo} </Text> 
        </View>}


        {contactDisplay[item.id] && contactMe}

        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>
        
        <View style={{flexDirection : 'row', justifyContent : 'space-evenly' }} >

  
      
          {spinnerItem === item ? (
        <ActivityIndicator size={34} />
      ) : (
        <TouchableOpacity style={styles.buttonStyle} onPress={() => handleBook(item)}>
          <Text>Book</Text>
        </TouchableOpacity>
      )}

        <TouchableOpacity  onPress={()=>navigate(`/message/${encodeURIComponent(serializedItem)}`)} style={styles.buttonStyle} >
          <Text>Message</Text>
        </TouchableOpacity>

        </View>

      </View>     
  )})

        let comapnyName = null;
  return(
    <View>
        {userId && loadsList.map((item)=>{
      
          const companyName = item.companyName;
          const showUserName = comapnyName !== companyName;
          comapnyName = companyName;
      return(     
        showUserName&&<View key={item.id} style={{flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
      
           <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > {item.companyName}  </Text>
       </View> )})
       }
    <ScrollView style={{padding : 10 , marginTop : 10 }} >
      <div className="Main-grid">
        {rendereIterms}
        <View style={{height : 200}} ></View>
        </div>
    </ScrollView> 
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
        marginBottom: 15 ,
        borderWidth: 2 ,
        borderColor:"#6a0c0c" ,
        borderRadius: 10
    } 
});
