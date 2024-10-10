import React, { useEffect, useState } from 'react';
import { db , } from '../config/fireBase';
import { View , Text , ScrollView , TouchableOpacity , Linking ,StyleSheet} from 'react-native';
import {onSnapshot ,  query ,collection,where } from "firebase/firestore"

import {useNavigate,useParams} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

import { WhatsApp  } from '@mui/icons-material';

function DspSoldIterms(){
    const navigate = useNavigate()

  const {location, specproduct , sellOBuy} = useParams()
  const [allSoldIterms, setAllSoldIterms] = useState([]);
  
      let [buyRent , setBuyRent] = React.useState(null)



  const [priceRangeDsp , setPriceRangeDsp]= React.useState(false)
  function addPriceRangeDsp(){
  setPriceRangeDsp(prev => !prev)
  setVehicleTypeDsp(false)
  }
  const [priceRange , setPriceRange]= React.useState(null)
  function addPriceRange(addedValue){
    setPriceRange(addedValue)
    setPriceRangeDsp(false)
      setVehicleTypeDsp(false)
  }
   let priceRangeShow = null

        if ( priceRange ==="firstRange") {
            priceRangeShow = "0 - 1.5k"
        } else if (priceRange ==="scndRange")  {
          priceRangeShow = "1.5 - 2.5"
        } else if (priceRange === "thirdRange" )  {
          priceRangeShow= "2.5k - 5k" ;
        } else if (priceRange === "fouthRange" )  {
          priceRangeShow = "5k - 10k" ;
        } else if (priceRange === "fifthRange" )  {
          priceRangeShow = "10k - 25k" ;
        } else if (priceRange === "sixthRange")  {
          priceRangeShow = "25k - 45k" ;
        } else if (priceRange === "svthRange")  {
          priceRangeShow = "45k - 65k"
        } else if (priceRange === "eighthRange")  {
          priceRangeShow = "65k - 100k"
        } else if (priceRange === "ninthRange")  {
          priceRangeShow = "80k - 100k"
        } else if (priceRange === "tentRange" )  {
            priceRangeShow= "100k +++"

        }

   

  const [vehicleTypeDsp , setVehicleTypeDsp] = React.useState(false)
    function dspVehicleTypeDsp(){
      setVehicleTypeDsp(prev => !prev)
      setPriceRangeDsp(false)
    }

  const [vehicleType , setVehicleType] = React.useState(null)
    function addVehicleType(slctedV){
      setVehicleType(slctedV)
      setVehicleTypeDsp(false)
      setPriceRangeDsp(false)
    }
    const [cargoTrcks , setCargoTrucks] = React.useState(false)
    function toggleCargoTrcks(){
      setCargoTrucks(prev=>!prev)
    }

 useEffect(() => {
    try {
        let dataQuery;

            if(specproduct === "vehicles" ){
              if(priceRange){
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("priceRange","==",priceRange ) );
              } else if(vehicleType){
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehicleType","==",vehicleType ) );
              }else if(vehicleType && priceRange){
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellRent", "==", buyRent) , where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType) , where("priceRange", "==", priceRange) );
              }else if(vehicleType && priceRange&&(buyRent === true || buyRent === false) ){
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellRent", "==", buyRent) , where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType) , where("priceRange", "==", priceRange) , where("sellOBuy", "==", sellOBuy) );
              } else if (buyRent === true || buyRent === false) {
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellRent", "==", buyRent) , where("sellOBuy", "==", sellOBuy) );
            } else {
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) );
            }
            }else   if (specproduct === "trailers") {

            if (buyRent === true || buyRent === false) {
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellRent", "==", buyRent) , where("sellOBuy", "==", sellOBuy) );
            } else {
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) );
            }
        } else {
            dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) );
        }

        let loadedData = [];
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

            setAllSoldIterms(loadedData);
        });

        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
    } catch (err) {
        console.error(err);
    }
}, [specproduct, buyRent, sellOBuy , priceRange , vehicleType ]);

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

        const message =  `${item.CompanyName} is this Product still ${ item.sellOBuy === "forSell"? "available":"wanted" } ${item.productName} ${item.sellRent ? "for sell" :'for rental' }   ${item.currency?"USD" : "Rand" }  ${item.price}   from https://www.truckerz.net/OneFirmsShop/${item.userId}/${item.id}` ; // Set your desired message here
    let contactMe = ( <View style={{ paddingLeft: 30 }}>

          <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.CompanyName} `)}  >
            <Text>Message now</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)}>
            <Text>Phone call</Text>
          </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}&text=${encodeURIComponent(message)}`)} style={{height : 50}} >
            <Text > WhatsApp <WhatsApp style={{color : "#25D366" }} />   </Text>
          </TouchableOpacity>

          </View>)
    return(
      <TouchableOpacity  key={item.id}  onPress={()=>navigate(`/OneFirmsShop/${item.userId}/${item.id}/${sellOBuy}`)} style={{padding :7}}>

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}

      {item.brandNew && <Text> brand New</Text>}
      
          {sellOBuy ==="forSell"  &&<ScrollView  horizontal  showsHorizontalScrollIndicator={false}  >
         
        {item.imageUrl.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index}`}   style={{ width : 200 , height : 200 , margin : 7}} />
        ))}

          </ScrollView>}

      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20 , color:"#6a0c0c" , textAlign:'center'}} >{item.CompanyName} </Text>

     {item.specproduct === "vehicles" &&  <ScrollView  horizontal  showsHorizontalScrollIndicator={false} style={{ margin : 5 , }} >

           { item.mileage && <View  style={{marginRight:12}}>
              <Text>MILEAGE </Text>
              <Text>{item.mileage} </Text>
            </View>}


            {item.year &&<View  style={{marginRight:12}}>
              <Text>Year</Text>
              <Text>{item.year} </Text>
            </View>}

           {item.engine && <View  style={{marginRight:12}}>
              <Text>ENGINE </Text>
              <Text>{item.engine}</Text>
            </View>}

            {item.trans && <View  style={{marginRight:12}} >
              <Text> Trans </Text>
          <Text>{item.trans} </Text>
            </View>}

            {item.fuel &&<View style={{marginRight:12}} >
              <Text> Fuel </Text>
          <Text>{item.fuel} </Text>
            </View>}
          </ScrollView>}

          
         {item.productName &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >{sellOBuy ==="forSell" ? "Product":'Looking For' }</Text>
       {<Text>:  {item.productName} {item.sellRent ? "for sell" :'for rental' } </Text>} 
      </View>}

      { item.price &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >{sellOBuy==='forSell' ?'Price':'Budget' }</Text>
       {<Text style={{color:'green'}} >:  {item.currency?"USD" : "Rand" }  {item.price}</Text>} 
      </View>}

      { item.contact && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Contact</Text>
       {<Text  >:  {item.contact}</Text>} 
      </View>}


       {!contactDisplay[item.id] && <View>

      {item.shopLocation &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Store Loc</Text>
       {<Text>:  {item.shopLocation}  </Text>} 
      </View>}

      { specproduct ==="vehicles" || specproduct ==="trailers" ? item.productLoc &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >{specproduct} Loc</Text>
       {<Text>:  {item.productLoc}  </Text>} 
      </View>:null }
      
      {item.deliveryR && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >deliveryR</Text>
       {<Text>:  {item.deliveryR}</Text>} 
      </View>}

      {dspMoreInfo[item.id]  && item.additionalInfo  &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Aditional Info</Text>
      {<Text>:  {item.additionalInfo}</Text>} 
      </View>}

        </View>}

        {contactDisplay[item.id] && contactMe}

        <TouchableOpacity onPress={()=>toggleDspMoreInfo(item.id) } >
          <Text style={{marginLeft :50 ,color :'green'}} >See more </Text>
        </TouchableOpacity>
        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{marginTop : 7 , marginBottom :10}} >
          <Text style={{textDecorationLine:'underline' , color:'#DC143C'}} > get In Touch now</Text>
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

          {<TouchableOpacity onPress={addPriceRangeDsp} style={priceRangeDsp  ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ priceRangeDsp ? {color : 'white'}: {color : 'black'} } >{priceRange? priceRangeShow : "budjet"} </Text>
          </TouchableOpacity>}

         { !priceRangeDsp && <TouchableOpacity onPress={dspVehicleTypeDsp} style={vehicleTypeDsp ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ vehicleTypeDsp ? {color : 'white'}: {color : 'black'} } > {vehicleType ? vehicleType : "body"} </Text>
          </TouchableOpacity>}

          {priceRangeDsp && <View style={{flexDirection:'row'}} >
            <TouchableOpacity style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } onPress={()=>addPriceRange("firstRange") }>
            <Text>0 - 1500</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } onPress={()=>addPriceRange("scndRange") }>
            <Text> 1.5k - 2.5k</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }   onPress={()=>addPriceRange("thirdRange") }>
            <Text>2.5 - 5k</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }  onPress={()=>addPriceRange("fouthRange") } >
            <Text>5k - 10k</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }  onPress={()=>addPriceRange("fifthRange") } >
            <Text>10k - 25k</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }   onPress={()=>addPriceRange("sixthRange") }>
            <Text>25k - 45k</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }   onPress={()=>addPriceRange("svthRange") }>
            <Text>45k 65k</Text>
            </TouchableOpacity>

            <TouchableOpacity style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }   onPress={()=>addPriceRange("eighthRange") }>
            <Text>65k - 80k</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }   onPress={()=>addPriceRange("ninthRange") }>
            <Text>80k - 100k</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }   onPress={()=>addPriceRange("tentRange") }>
            <Text>100k +++ </Text>
            </TouchableOpacity>
          </View>}

  { vehicleTypeDsp && <View style={{flexDirection:'row'}} >
                  <TouchableOpacity onPress={toggleCargoTrcks} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Cargo Trucks</Text>
                  </TouchableOpacity>
                 {cargoTrcks && <View style={{flexDirection:'row'}} >
                  <TouchableOpacity onPress={()=>addVehicleType("truckhorse")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>truck horse</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("BoxTrucks")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Box Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("FlatbedTrucks")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Flatbed Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("RefrigeratedTrucks")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Refrigerated Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("DumpTrucks")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Dump Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("TankerTrucks")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Tanker Trucks</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>addVehicleType("CurtainsideTrucks")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Curtainside Trucks</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>addVehicleType("ParcelVans")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Parcel Vans</Text>
                  </TouchableOpacity>
                  </View>}

                 {!cargoTrcks&& <View style={{flexDirection:'row'}} >
                  <TouchableOpacity onPress={()=>addVehicleType("Sedans")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Sedans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("SUV")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>SUV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("PickupTrucks")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Pickup Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Hatchbacks")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Hatchbacks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Vans")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Vans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Convertibles")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Convertibles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Crossovers")} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive } >
                    <Text>Crossovers</Text>
                  </TouchableOpacity>
                  </View>}

                  </View>}

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
    // width : 50 ,
    paddingLeft : 6 ,
    paddingRight :4 ,
    color :'white'  , 
    borderWidth:1, 
    alignItems :'center' ,
    justifyContent :'center' ,
    marginRight : 7 ,
    borderRadius : 15
  },
  btnIsActive : {
    paddingLeft : 5 ,
    paddingRight :6 ,
    color :'white'  , 
    alignItems :'center' ,
    justifyContent :'center' ,
    marginRight : 7 ,
    borderRadius : 15 ,
    backgroundColor : 'rgb(129,201,149)'
  }

});