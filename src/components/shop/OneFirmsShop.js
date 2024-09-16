import React, { useEffect, useState } from 'react';
import { db } from '../config/fireBase';
import { View , Text  , ScrollView ,TouchableOpacity , Linking , Share , StyleSheet} from 'react-native';
import {onSnapshot ,  query ,collection,where ,} from "firebase/firestore"

import { useParams , useNavigate} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
function OneFirmsShop({route , navigation } ){ 
  
    const {userId , itemId} = useParams()
    const navigate = useNavigate()
  const [allTrucks, setAllTrucks] = useState([]);


      let [buyRent , setBuyRent] = React.useState(null)
  useEffect(() => {
    try {
        // const dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId) );
      let dataQuery
        if(buyRent=== true || buyRent === false ) {
          dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId), where("sellRent" ,"==", buyRent) );
        }else{
          setBuyRent(null)
          dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId));
        }

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          const loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

              if (itemId) {
        const updatedLoadList = loadedData.map(oneLoad => ({
          ...oneLoad,
          backgroundColor: oneLoad.id === itemId ? "#F2F2F2" : "#EDEDED"
        }));

        const sortedLoadList = updatedLoadList.sort((a, b) => a.backgroundColor === "#F2F2F2" ? -1 : b.backgroundColor === "#F2F2F2" ? 1 : 0);

        setAllTrucks(sortedLoadList);
      } else {
        setAllTrucks(loadedData);
      }
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    } catch (err) {
      console.error(err);
    }
  }, [userId]); 

    const [contactDisplay, setContactDisplay] = React.useState({ ['']: false });
    const toggleContact = (itemId) => {
      setContactDisplay((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    };

  const rendereIterms = allTrucks.map((item)=>{

    let contactMe = ( <View style={{ paddingLeft: 30 }}>

          <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.CompanyName} `)}  >
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
      <View key={item.id} style={{padding :7}}>
      { item.trailerType && ( <Text> trailer type {item.trailerType}  </Text> ) }

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}
      
          {item.imageUrl &&<img src={item.imageUrl} style={{height : 200 , borderRadius : 10}}/>}
      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20 , color:"#6a0c0c" , textAlign:'center'}} >{item.CompanyName} </Text>
        {item.productName &&<Text>Product {item.productName} </Text> }
        {item.price &&<Text>Price :  {item.currency?"USD" : "Rand" }  {item.price} </Text> }
        {item.shopLocation &&<Text>Country {item.location}  in {item.shopLocation} </Text> }



       {!contactDisplay[item.id] && <View>
      { item.contact && ( <Text>contact {item.contact}</Text> )}
      {item.additionalInfo && (<Text> additional Info {item.additionalInfo} </Text>)}
        </View>}

        {contactDisplay[item.id] && contactMe}

        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>


    </View>
        )
      })

 
 const handleShareLink = async (companyName) => {
    try {
      const url = `https://www.truckerz.net/OneFirmsShop/${userId}`; // Replace this with the URL you want to share
      const message = `Check out ${companyName} Store on Truckerz : ${url}`;

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

        let comapnyName = null;
return(
  <View>
     { allTrucks.map((item)=>{
          const companyName = item.companyName;
          const showUserName = comapnyName !== companyName;
          comapnyName = companyName;
      return(     
        showUserName&&<View  style={{flexDirection : 'row' , height : 84  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} >
        <TouchableOpacity style={{marginRight: 10}} onPress={() => navigation.goBack()}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
        </TouchableOpacity>
      <Text style={{fontSize: 20 , color : 'white'}} > {item.CompanyName} Store</Text>
        <TouchableOpacity  onPress={()=>handleShareLink(item.CompanyName)} style={{position :'absolute' , right:30 ,  backgroundColor : 'rgb(129,201,149)' }} >
                    <Text  >Share loads </Text>
                </TouchableOpacity>
       </View> )})
       }
        <ScrollView>
     { <ScrollView  horizontal  showsHorizontalScrollIndicator={false}  >


          <TouchableOpacity onPress={()=> setBuyRent(null)} style={buyRent === null ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== null ? {color : 'white'}: {color : 'black'} } >All </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> setBuyRent(true)} style={buyRent === true ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== true ? {color : 'white'}: {color : 'black'} } >Buy </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> setBuyRent(false)} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ buyRent=== false ? {color : 'white'}: {color : 'black'} } >Rent</Text>
          </TouchableOpacity>

        </ScrollView>}

      <div className="Main-grid">
         {allTrucks.length > 0 ? rendereIterms   : <Text>Loading...</Text>}
         <View style={{height : 550}} >
           </View>
           </div>
        </ScrollView> 
        </View>
)
}


export default React.memo(OneFirmsShop)

const styles = StyleSheet.create({
  bynIsUnActive : {
    width : 50 ,
    color :'white'  , 
    borderWidth:1, 
    alignItems :'center' ,
     justifyContent :'center' ,
      marginRight : 7 ,
       borderRadius : 15
  },
  btnIsActive : {
    width : 50 ,
    color :'white'  , 
    alignItems :'center' ,
     justifyContent :'center' ,
      marginRight : 7 ,
       borderRadius : 15 ,
       backgroundColor : 'rgb(129,201,149)'
  }

});
