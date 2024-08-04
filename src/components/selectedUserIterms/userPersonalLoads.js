import React,{useEffect} from "react";
import { View ,Text,Image, TouchableOpacity ,ScrollView ,StyleSheet} from "react-native";
import { auth, db } from '../config/fireBase'; 
import { collection, onSnapshot,where ,query} from 'firebase/firestore';
// import Main from "../styles/Main.css"

import { useParams , useNavigate} from 'react-router-dom';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { Ionicons } from "@expo/vector-icons";
function  SelectedUserLoads(){
    const {userId} = useParams()
    const navigate = useNavigate()


 const [loadIterms , setLoadedIterms ]= React.useState([])
 useEffect(() => {
  try {
    // if (auth.currentUser) {
      const dataQuery = query(collection(db, "Loads"), where("userId", "==", userId));

      const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
        const loadedData = [];
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added' || change.type === 'modified') {
            const dataWithId = { id: change.doc.id, ...change.doc.data() };
            loadedData.push(dataWithId);
          }
        });

        setLoadedIterms(loadedData);
      });

      return () => unsubscribe();
    // }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}, [userId]); // Ensure userId is included as a dependency if it can change

  
  
    const [contactDisplay, setContactDisplay] = React.useState({ ['']: false });
        const toggleContact = (itemId) => {
        setContactDisplay((prevState) => ({
          ...prevState,
          [itemId]: !prevState[itemId],
        }));
      };

   const rendereIterms =  loadIterms.map((item)=>{ 
  return(    <View  key={item.id} style={{ backgroundColor:  "#DDDDDD", marginBottom : 8, padding :6  }} >

            { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white',zIndex : 66}} >
                  {/* <MaterialIcons name="verified" size={24} color="green" /> */}
            </View>}
        <Text style={{color:'#6a0c0c' , fontSize:15 }} >Company {item.companyName} </Text>
        <Text>Commodity {item.typeofLoad} </Text>
        <Text>from {item.fromLocation} to {item.toLocation} </Text>
        <Text>Rate {item.ratePerTonne} </Text>

       {!contactDisplay[item.id] && <View>
        <Text>Contact : {item.contact}</Text>
        <Text> payment terms {item.paymentTerms} </Text>
        <Text>Requirements {item.requirements} </Text>
        <Text>additional info {item.additionalInfo} </Text> 
        </View>}


        {/* {contactDisplay[item.id] && contactMe} */}

        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>
        
        <View style={{flexDirection : 'row', justifyContent : 'space-evenly' }} >

        {/* <TouchableOpacity style={styles.buttonStyle} onPress={() => handleBook(item)}>
          <Text>Book</Text>
        </TouchableOpacity> */}

        <TouchableOpacity  onPress={()=>navigate('/message/${item}', {messageData :item }) } style={styles.buttonStyle} >
          <Text>Message</Text>
        </TouchableOpacity>

        </View>

      </View>     
  )})

        let comapnyName = null;
  return(
    <View>
     { loadIterms.map((item)=>{
      
          const companyName = item.companyName;
          const showUserName = comapnyName !== companyName;
          comapnyName = companyName;
      return(     
        showUserName&&<View key={item.id} style={{flexDirection : 'row' , height : 84  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
        {/* <TouchableOpacity style={{marginRight: 10}} onPress={() => navigation.goBack()}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
        {/* </TouchableOpacity> */}
        
        <Text style={{fontSize: 20 , color : 'white'}} > {item.companyName}  </Text>
       </View> )})
       }
    <ScrollView style={{padding : 10 , marginTop : 10}}>
      <div className="Main-grid">

        {rendereIterms}
      </div>
        <View style={{height : 200}} ></View>
    </ScrollView>
 </View>
  )
}

export default React.memo( SelectedUserLoads)


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
