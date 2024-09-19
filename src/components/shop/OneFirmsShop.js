import React, { useEffect, useState } from 'react';
import { db } from '../config/fireBase';
import { View , Text  , ScrollView ,TouchableOpacity , Linking , Share , StyleSheet} from 'react-native';
import {onSnapshot ,  query ,collection,where ,} from "firebase/firestore"

import { useParams , useNavigate} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
function OneFirmsShop({route , navigation } ){ 
  
    const {userId , itemId } = useParams()
    const navigate = useNavigate()
  const [allTrucks, setAllTrucks] = useState([]);

      const [specproduct , setSpecPrduct] = React.useState('')

      let [buyRent , setBuyRent] = React.useState(null)
  useEffect(() => {
    try {
        // const dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId) );
      let dataQuery
     

       if (specproduct === "vehicles" || specproduct === "trailers") {
            if (buyRent === true || buyRent === false) {
                dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId),where("specproduct", "==", specproduct),  where("sellRent", "==", buyRent));
            } else {
                dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId),where("specproduct", "==", specproduct));
            }
        } else if(specproduct ) {
            dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId),where("specproduct", "==", specproduct), );
        }else {

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
  }, [userId , specproduct , buyRent]); 

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
      <View key={item.id} style={{padding :7   , maxHeight : 350}}>
      { item.trailerType && ( <Text> trailer type {item.trailerType}  </Text> ) }

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}
      

          <ScrollView  horizontal  showsHorizontalScrollIndicator={false}  > 
        {item.imageUrl.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index}`}   style={{ width : 200 , height : 200 , margin : 7}} />
        ))}
         </ScrollView>


      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20 , color:"#6a0c0c" , textAlign:'center'}} >{item.CompanyName} {item.specproduct}</Text>


         {item.specproduct === "vehicles" && <ScrollView  horizontal  showsHorizontalScrollIndicator={false} style={{height: 50 , margin : 5 , }} >

            <View  style={{marginRight:12}}>
              <Text>MILEAGE </Text>
              <Text>{item.mileage} </Text>
            </View>


            <View  style={{marginRight:12}}>
              <Text>Year</Text>
              <Text>{item.year} </Text>
            </View>

            <View  style={{marginRight:12}}>
              <Text>ENGINE </Text>
              <Text>{item.engine}  </Text>
            </View>

            <View  style={{marginRight:12}} >
              <Text> Trans </Text>
          <Text>{item.trans} </Text>
            </View>

            <View style={{marginRight:12}} >
              <Text> Fuel </Text>
          <Text>{item.fuel} </Text>
            </View>
          </ScrollView>}

        {item.productName &&<Text>Product {item.productName} {item.sellRent ? "for sell" :'for rental' }  </Text> }
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
      const message = `Explore ${companyName} store for top-notch services. Click the link now to be redirected to the store offering the finest services available  ${url} from Truckerz`;

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
        showUserName&&<View  style={{}} >
          <View style={{flexDirection : 'row' , height : 44  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} > 
           <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate( '/shopLocation/' )}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity>
      <Text style={{fontSize: 20 , color : 'white'}} > {item.CompanyName} Store</Text>
      </View>

        <TouchableOpacity  onPress={()=>handleShareLink(item.CompanyName)} style={{position :'absolute' , right:30 , top : 20 ,backgroundColor : 'white' }} >
                    <Text  >Share Store </Text>
                </TouchableOpacity>



  <View style={{flexDirection:'row' , justifyContent : 'space-evenly' , paddingLeft : 20 , paddingRight: 20 , height : 40 , alignItems : 'center' , backgroundColor : '#6a0c0c' , paddingTop : 10 }}>

            <TouchableOpacity onPress={()=> setSpecPrduct("vehicles") } > 
                {  specproduct === "vehicles" ?
                 <Text style={{color:'white' , textDecorationLine:'underline' , fontWeight:'600' , fontSize : 18  }} > Showroom</Text> :
                 <Text style={{color:'white', }} > Showroom</Text>
                }
            </TouchableOpacity>

            <TouchableOpacity  onPress={()=> setSpecPrduct("trailers") } >
                {specproduct === "trailers" ?
                 <Text style={{color:'white' , textDecorationLine :'underline',fontWeight:'600' , fontSize : 18}} > Trailer</Text> :
                 <Text style={{color:'white'}} > Trailer</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> setSpecPrduct("spares") } >
               {specproduct === "spares" ?
               <Text style={{color:'white' , textDecorationLine :'underline' ,fontWeight:'600' , fontSize : 18 }} > Spares</Text> :
               <Text style={{color:'white'}} > Spares</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> setSpecPrduct("Sprovider") }>
               {specproduct === "Sprovider" ?
               <Text style={{color:'white' , textDecorationLine :'underline' ,fontWeight:'600' , fontSize : 18 }} > Service Provider</Text> :
               <Text style={{color:'white'}} > Service Provider </Text>}

            </TouchableOpacity>
        </View>



       </View> )})
       }
        <ScrollView>
     {specproduct ==="vehicles" || specproduct ==="trailers" ? <ScrollView  horizontal  showsHorizontalScrollIndicator={false} style={{margin : 10}} >


          <TouchableOpacity onPress={()=> setBuyRent(null)} style={buyRent === null ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== null ? {color : 'white'}: {color : 'black'} } >All </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> setBuyRent(true)} style={buyRent === true ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== true ? {color : 'white'}: {color : 'black'} } >Buy </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> setBuyRent(false)} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ buyRent=== false ? {color : 'white'}: {color : 'black'} } >Rent</Text>
          </TouchableOpacity>

        </ScrollView>
        : null
        }

      <div className="Main-grid">
         {allTrucks.length > 0 ? rendereIterms
            : <View style={{flexDirection:'row'}} >

           <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate( '/shopLocation/' )}>
                    <ArrowBackIcon style={{color : 'black'}} />
                    <Text>Loading...</Text> 
        </TouchableOpacity>
            </View> }
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
