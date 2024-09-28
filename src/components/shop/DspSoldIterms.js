import React, { useEffect, useState } from 'react';
import { db , } from '../config/fireBase';
import { View , Text , ScrollView , TouchableOpacity , Linking ,StyleSheet} from 'react-native';
import {onSnapshot ,  query ,collection,where } from "firebase/firestore"

import {useNavigate,useParams} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

function DspSoldIterms(){
    const navigate = useNavigate()

  const {location, specproduct } = useParams()

  const [allSoldIterms, setAllSoldIterms] = useState([]);

      let [buyRent , setBuyRent] = React.useState(null)

 useEffect(() => {
    try {
        let dataQuery;

        if (specproduct === "vehicles" || specproduct === "trailers") {
            if (buyRent === true || buyRent === false) {
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellRent", "==", buyRent));
            } else {
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location));
            }
        } else {
            dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location));
        }

        const loadedData = [];
        const userItemsMap = new Map(); // Map to store user items

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const dataWithId = { id: change.doc.id, ...change.doc.data() };

                    // Add or update the user's items
                    if (!userItemsMap.has(dataWithId.userId)) {
                        userItemsMap.set(dataWithId.userId, []);
                    }
                    userItemsMap.get(dataWithId.userId).push(dataWithId);
                }
            });

            // Select 4 random items for each user
            userItemsMap.forEach((userItems) => {
                const randomItems = userItems.sort(() => 0.5 - Math.random()).slice(0, 4);
                loadedData.push(...randomItems);
            });

          const verifiedUsers = loadedData.filter(user => user.isVerified);
          const nonVerifiedUsers = loadedData.filter(user => !user.isVerified);

             const shuffleArray = (array) => {
              for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
              }
              return array;
            };
            const shuffledData = shuffleArray(nonVerifiedUsers);
            loadedData = verifiedUsers.concat(shuffledData);

            setAllSoldIterms( );
        });

        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    } catch (err) {
        console.error(err);
    }
}, [specproduct, buyRent]);


    
    const [contactDisplay, setContactDisplay] = React.useState({ ['']: false });
    const toggleContact = (itemId) => {
      setContactDisplay((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
    };

   
  const [dspMoreInfo , setDspMoreInfo] = React.useState({ ['']: false })
  function toggleDspMoreInfo(itemId){
          setDspMoreInfo((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
  }


  const rendereIterms = allSoldIterms.map((item)=>{

        const message =  ` ${item.CompanyName} is this Product still available ${item.productName} ${item.sellRent ? "for sell" :'for rental' } from https://www.truckerz.net/OneFirmsShop/${item.userId}` ; // Set your desired message here
    let contactMe = ( <View style={{ paddingLeft: 30 }}>

          <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.CompanyName} `)}  >
            <Text>Message now</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)}>
            <Text>Phone call</Text>
          </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}&text=${encodeURIComponent(message)}`)}>
            <Text>WhatsApp</Text>
          </TouchableOpacity>

          </View>)
    return(
      <TouchableOpacity  key={item.id}  onPress={()=>navigate(`/OneFirmsShop/${item.userId}`)} style={{padding :7}}>

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}


          <ScrollView  horizontal  showsHorizontalScrollIndicator={false}  >
         
        {item.imageUrl.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index}`}   style={{ width : 200 , height : 200 , margin : 7}} />
        ))}

          </ScrollView>

      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20 , color:"#6a0c0c" , textAlign:'center'}} >{item.CompanyName} </Text>

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
          
         { item.productName &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Product</Text>
       {<Text>:  {item.productName} {item.sellRent ? "for sell" :'for rental' } </Text>} 
      </View>}

      { item.price &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Price</Text>
       {<Text>:  {item.currency?"USD" : "Rand" }  {item.price}</Text>} 
      </View>}

      { item.shopLocation &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Location</Text>
       {<Text>:  {item.shopLocation}  </Text>} 
      </View>}


       {!contactDisplay[item.id] && <View>

      { item.contact && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Contact</Text>
       {<Text>:  {item.contact}</Text>} 
      </View>}

      { item.deliveryR && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >deliveryR</Text>
       {<Text>:  {item.newDeliverR}</Text>} 
      </View>}

      {  dspMoreInfo[item.id]  && item.additionalInfo  &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Aditional Info</Text>
      {<Text>:  {item.additionalInfo}</Text>} 
      </View>}

        </View>}

        {contactDisplay[item.id] && contactMe}

        <TouchableOpacity onPress={()=>toggleDspMoreInfo(item.id) } >
          <Text style={{marginLeft :50 ,color :'green'}} >See more </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline'}} > get In Touch now</Text>
        </TouchableOpacity>


    </TouchableOpacity>
        )
      })

    return(
        <ScrollView >
     { specproduct ==="vehicles" || specproduct ==="trailers" ? <ScrollView  horizontal  showsHorizontalScrollIndicator={false}  >


          <TouchableOpacity onPress={()=> setBuyRent(null)} style={buyRent === null ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== null ? {color : 'white'}: {color : 'black'} } >All </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> setBuyRent(true)} style={buyRent === true ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== true ? {color : 'white'}: {color : 'black'} } >Buy </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> setBuyRent(false)} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ buyRent=== false ? {color : 'white'}: {color : 'black'} } >Rent</Text>
          </TouchableOpacity>

        </ScrollView> : null }

      <div className="Main-grid">
        { allSoldIterms.length>0? rendereIterms: <Text> {specproduct} Loading.....</Text> }
        <View style={{height : 200}} ></View>
        </div>
        </ScrollView>
    )
}
export default React.memo(DspSoldIterms)


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