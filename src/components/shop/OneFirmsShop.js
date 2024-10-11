import React, { useEffect, useState } from 'react';
import { db } from '../config/fireBase';
import { View , Text  , ScrollView ,TouchableOpacity , Linking , Share , StyleSheet} from 'react-native';
import {onSnapshot ,  query ,collection,where ,} from "firebase/firestore"

import { useParams , useNavigate} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { WhatsApp  } from '@mui/icons-material';
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';
function OneFirmsShop({route , navigation } ){ 
  
    const {userId , itemId , agCont ,sellOBuyG,location } = useParams()
    const navigate = useNavigate()
    const [allTrucks, setAllTrucks] = useState([]);
      const [specproduct , setSpecPrduct] = React.useState('')

      let [buyRent , setBuyRent] = React.useState(null)
      let [sellOBuy , setSellOBuy] = React.useState(sellOBuyG)
 const [priceRangeDsp , setPriceRangeDsp]= React.useState(false)
  function addPriceRangeDsp(){
  setPriceRangeDsp(prev => !prev)
  setVehicleTypeDsp(false)
  setvehiMakeDsp(false)
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
      setvehiMakeDsp(false)
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
      setheavyEquipmentMake(false)
    }

    const [vehiMakeDsp , setvehiMakeDsp] =React.useState(false)
          function toggleVehiMakeDsp(){
            setvehiMakeDsp(prev => !prev)
            setVehicleTypeDsp(false)
            setPriceRangeDsp(false)
          }
     const [ heavyEquipmentMake , setheavyEquipmentMake] = React.useState(false)
    function toggleHeavyEquipmentMake(){
      setheavyEquipmentMake(prev=>!prev)
      setCargoTrucksMake(false)
    }

          const [vehiMake , setVehiMake] = React.useState("")

          function addVehiMake(value){
              setVehiMake(value)
              setvehiMakeDsp(false)
          }


    const [cargoTrcksMake , setCargoTrucksMake] = React.useState(false)
    function toggleCargoTrcksMake(){
      setCargoTrucksMake(prev=>!prev)
      setheavyEquipmentMake(false)
    }

    const [ heavyEquipment , setheavyEquipment] = React.useState(false)
    function toggleHeavyEquipment(){
      setheavyEquipment(prev=>!prev)
      setCargoTrucks(false)
    }

        const [ trailerTypeDsp , setTrailerTypeDsp] = React.useState(false)
    function toggleTrailerTypeDsp(){
      setTrailerTypeDsp(prev=>!prev)
    }
    const [ trailerType , setTrailerType] = React.useState(null)
    function addTrailerType(value){
      setTrailerType(value)
      setTrailerTypeDsp(false)
    }
  useEffect(() => {
    try {
      let dataQuery

           if(specproduct === "vehicles" ){

                 if(vehicleType && vehiMake && priceRange && (buyRent === true || buyRent === false) ){
                    dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType) , where("vehiMake", "==", vehiMake) , where("vehiMake", "==", vehiMake) , where("priceRange", "==", priceRange) , where("sellRent", "==", buyRent) , where("userId" ,"==", userId),);
                 }else if(vehicleType && vehiMake && priceRange){

                    dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType) , where("vehiMake", "==", vehiMake) , where("vehiMake", "==", vehiMake) , where("priceRange", "==", priceRange) , where("userId" ,"==", userId),);
                 }

                 else if (priceRange) {

                if(vehicleType ){
                  dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("priceRange", "==", priceRange) , where("vehicleType", "==", vehicleType), where("userId" ,"==", userId), );

                }else if( vehiMake ){

                  dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("priceRange", "==", priceRange) , where("vehiMake", "==", vehiMake) , where("userId" ,"==", userId),);
                }else if ((buyRent === true || buyRent === false) ){

                  dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("sellRent", "==", buyRent) , where("priceRange", "==", priceRange), where("userId" ,"==", userId),);
                }else{

                  dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("priceRange", "==", priceRange) , where("userId" ,"==", userId),);
                }

                 }else if(vehicleType){
                  if( vehiMake ){

                    dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType) , where("vehiMake", "==", vehiMake) , where("userId" ,"==", userId),);
                  }else if ((buyRent === true || buyRent === false) ){

                  dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("sellRent", "==", buyRent) , where("vehicleType", "==", vehicleType), where("userId" ,"==", userId),);

                }
                  else{

                    dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType) , where("userId" ,"==", userId), );
                  }
                 }else if(vehiMake){
                   if ((buyRent === true || buyRent === false) ){

                  dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("sellRent", "==", buyRent) , where("vehiMake", "==", vehiMake), where("userId" ,"==", userId),);

                    }else {

                      dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehiMake", "==", vehiMake) , where("userId" ,"==", userId), );
                    }
                 }else if(buyRent === true || buyRent === false){

                      dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy)  , where("sellRent", "==", buyRent) , where("userId" ,"==", userId), );
                 }
                 else{

                  dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("userId" ,"==", userId), );
                }
            



            }else   if (specproduct === "trailers") {
              if(trailerType){

                if(buyRent === true || buyRent === false){
                  dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellRent", "==", buyRent) , where("sellOBuy", "==", sellOBuy) , where("trailerType", "==", trailerType), where("sellRent", "==", buyRent) , where("userId" ,"==", userId), );

                }else{
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("trailerType", "==", trailerType) , where("userId" ,"==", userId), );
                }

              }else if (buyRent === true || buyRent === false) {
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellRent", "==", buyRent) , where("sellOBuy", "==", sellOBuy) , where("userId" ,"==", userId), );
            } else {
                dataQuery = query(collection(db, "Shop"), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("userId" ,"==", userId), );
            }
        }else if(specproduct){

          dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId), where("sellOBuy", "==", sellOBuy),where("specproduct", "==", specproduct)  );
        }else {

          dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId), where("sellOBuy", "==", sellOBuy) );
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
  }, [userId , specproduct, buyRent, sellOBuy , priceRange , vehicleType ,vehiMake ,trailerType]); 

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
  const rendereIterms = allTrucks.map((item)=>{

        const message =  `${item.CompanyName} is this Product still ${ item.sellOBuy === "forSell"? "available":"wanted" } ${item.productName} ${item.sellRent ? "for sell" :'for rental' }   ${item.currency?"USD" : "Rand" }  ${item.price}  from ${agCont ?`https://www.truckerz.net/OneFirmsShopA/${item.userId}/${item.id}/${sellOBuy}/${agCont}` :  `https://www.truckerz.net/OneFirmsShop/${item.userId}/${item.id}/${sellOBuy}`  }` ;
    let contactMe = ( <View style={{ paddingLeft: 30 }}>

             <TouchableOpacity  onPress={()=>navigate(`/message/${item.userId}/${item.CompanyName} `)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#008080" , borderWidth:1 , borderColor :'#008080', justifyContent:'center', marginBottom : 5 , marginTop:6}} >
            <Text style={{color:"#008080"}} >Message now</Text>
            <ChatIcon/>

          </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL(`whatsapp://send?phone=${item.contact}&text=${encodeURIComponent(message)}`)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#25D366" , borderWidth:1 , borderColor :'#25D366', justifyContent:'center', marginBottom:6}} >
            <Text style={{color : "#25D366"}} >WhatsApp </Text> 
            <WhatsApp  />  
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.contact}`)} style={{height : 30 ,  flexDirection:'row', alignItems :'center',color : "#0074D9" , borderWidth:1 , borderColor :'#0074D9', justifyContent:'center', marginBottom:4}} >
            <Text style={{color:'#0074D9'}} >Phone call</Text>
            <CallIcon/>
          </TouchableOpacity>
          </View>)
    return(
      <View key={item.id} style={{padding :7, borderWidth : 2 , borderColor:'black', borderRadius:8 ,  shadowColor: '#6a0c0c',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,backgroundColor:'rgba(235, 142, 81, 0.07)' }}>

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}
      

        
          {sellOBuy ==="forSell"  &&<ScrollView  horizontal  showsHorizontalScrollIndicator={false} style={{height : 200 }} >
         

        {item.imageUrl.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index}`} style={{ margin: 7, maxWidth: '100%', height: 'auto' }}
/>
        ))}

          </ScrollView>}


      <Text style={{marginLeft : 60 , fontWeight : 'bold', fontSize : 20 , color:"#6a0c0c" , textAlign:'center'}} >{item.CompanyName} {item.specproduct}</Text>


         {item.specproduct === "vehicles" && <ScrollView  horizontal  showsHorizontalScrollIndicator={false} style={{height: 50 , margin : 5 , }} >

           { item.mileage&& <View  style={{marginRight:12}}>
              <Text>MILEAGE </Text>
              <Text>{item.mileage} </Text>
            </View>}


            {item.year &&<View  style={{marginRight:12}}>
              <Text>Year</Text>
              <Text>{item.year} </Text>
            </View>}

           {item.engine && <View  style={{marginRight:12}}>
              <Text>ENGINE </Text>
              <Text>{item.engine}  </Text>
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

          { item.productName &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >{sellOBuy ==="forSell" ? "Product":'Looking For' }</Text>
       {<Text>:  {item.productName} {item.sellRent ? "for sell" :'for rental' } </Text>} 
      </View>}

      { item.price &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >{sellOBuy==='forSell' ?'Price':'Budget' }</Text>
       {<Text>:  {item.currency?"USD" : "Rand" }  {item.price} </Text>} 
      </View>}
      {<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Contact</Text>
       {<Text>:  {agCont? agCont : item.contact}</Text>} 
      </View>}

       {!contactDisplay[item.id] && <View>

  { item.shopLocation &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Store Loc</Text>
       {<Text>:  {item.shopLocation}  </Text>} 
      </View>}

      { specproduct ==="vehicles" || specproduct ==="trailers" ? item.productLoc &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >{specproduct} Loc</Text>
       {<Text>:  {item.productLoc}  </Text>} 
      </View>:null }

      { item.deliveryR && <View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >deliveryR</Text>
       {<Text>:  {item.deliveryR}</Text>} 
      </View>}
      
      {  dspMoreInfo[item.id]  && item.additionalInfo  &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Aditional Info</Text>
      {<Text>:  {item.additionalInfo}</Text>} 
      </View>}

        </View>}

        {contactDisplay[item.id] && contactMe}

           <TouchableOpacity onPress={()=>toggleDspMoreInfo(item.id) } >
          <Text style={{color :'green'}} >{  dspMoreInfo[item.id]  ?"See Less": "See more"} </Text>
        </TouchableOpacity>
        
        <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{ width : 150 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#228B22' ,  borderRadius: 8, alignSelf:'center', margin:5 }} >
          <Text style={{ color:'white'}} > Get In Touch Now</Text>
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
  <View >
     { allTrucks.map((item)=>{
          const companyName = item.companyName;
          const showUserName = comapnyName !== companyName;
          comapnyName = companyName;
      return(     
        showUserName&&<View  style={{}} >
          <View style={{flexDirection : 'row' , height : 44  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center'}} > 
           <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate( `/DspShop/${location}/vehicles/${sellOBuyG}` )}>
            {/* <Ionicons name="arrow-back" size={28} color="white"style={{ marginLeft: 10 }}  /> */}
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity>
      <Text style={{fontSize: 20 , color : 'white'}} > {item.CompanyName} Store</Text>
      </View>

        <TouchableOpacity  onPress={()=>handleShareLink(item.CompanyName)} style={{position :'absolute' , right:30 , top : 20 ,backgroundColor : 'white' }} >
          <Text  >Share Store Link</Text>
        </TouchableOpacity>


     <View style={{justifyContent:'space-evenly' , backgroundColor:'#6a0c0c', flexDirection : "row" }} >
       {sellOBuy !== "toBuy" || sellOBuy !=="forSell" ?<View style={{backgroundColor:'#6a0c0c' }} >

           {sellOBuy ==="toBuy"&& <TouchableOpacity onPress={()=>setSellOBuy("forSell")}
             style={sellOBuy === "forSell" ? styles.bttonIsTrue : styles.buttonIsFalse} >
               <Text style={sellOBuy === "forSell" ? {color:'black'} : {color:'white'}} >Click to BUY</Text>
            </TouchableOpacity>}
            {sellOBuy ==="forSell"&& <TouchableOpacity onPress={()=>setSellOBuy("toBuy")} style={sellOBuy === "toBuy" ? styles.bttonIsTrue : styles.buttonIsFalse} >
                <Text style={sellOBuy === "toBuy" ? {color:'black'} :{color:'white'} } >Click to SELL</Text>
            </TouchableOpacity>}

        </View> :null }

          </View>


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
        <ScrollView >
     { specproduct ==="vehicles" || specproduct ==="trailers" ? <ScrollView  horizontal  showsHorizontalScrollIndicator={false} style={{marginBottom:10 , marginTop:10}}  >


          <TouchableOpacity onPress={()=> setBuyRent(null)} style={buyRent === null ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== null ? {color : 'white'}: {color : 'black'} } >All </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> setBuyRent(true)} style={buyRent === true ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== true ? {color : 'white'}: {color : 'black'} } >Buy </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> setBuyRent(false)} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ buyRent=== false ? {color : 'white'}: {color : 'black'} } >Rent</Text>
          </TouchableOpacity>

          { specproduct ==="vehicles" && <TouchableOpacity onPress={addPriceRangeDsp} style={priceRange  ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ priceRange ? {color : 'white'}: {color : 'black'} } >{priceRange? priceRangeShow : "budjet"} </Text>
          </TouchableOpacity>}

         { specproduct ==="vehicles" && !priceRangeDsp && <TouchableOpacity onPress={dspVehicleTypeDsp} style={vehicleType ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ vehicleType ? {color : 'white'}: {color : 'black'} } > {vehicleType ? vehicleType : "body"} </Text>
          </TouchableOpacity>}

          { specproduct ==="vehicles" && !priceRangeDsp && !priceRangeDsp&& !vehicleTypeDsp && <TouchableOpacity onPress={toggleVehiMakeDsp} style={ vehiMake ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ vehiMake ? {color : 'white'}: {color : 'black'} }  > {vehiMake ? vehiMake : "Make"} </Text>
          </TouchableOpacity>}

          { specproduct=== "trailers" &&<TouchableOpacity onPress={toggleTrailerTypeDsp}  style={ trailerType ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ trailerType ? {color :'white'}:null } >{trailerType ? trailerType  : "Trailer Type" } </Text>
            </TouchableOpacity>}

          {specproduct ==="vehicles" && priceRangeDsp && <View style={{flexDirection:'row'}} >
            <TouchableOpacity style={styles.bynIsUnActive } onPress={()=>addPriceRange("firstRange") }>
            <Text>0 - 1500</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ styles.bynIsUnActive } onPress={()=>addPriceRange("scndRange") }>
            <Text> 1.5k - 2.5k</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ styles.bynIsUnActive }   onPress={()=>addPriceRange("thirdRange") }>
            <Text>2.5 - 5k</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ styles.bynIsUnActive }  onPress={()=>addPriceRange("fouthRange") } >
            <Text>5k - 10k</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={ styles.bynIsUnActive }  onPress={()=>addPriceRange("fifthRange") } >
            <Text>10k - 25k</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={ styles.bynIsUnActive }   onPress={()=>addPriceRange("sixthRange") }>
            <Text>25k - 45k</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bynIsUnActive }   onPress={()=>addPriceRange("svthRange") }>
            <Text>45k 65k</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bynIsUnActive }   onPress={()=>addPriceRange("eighthRange") }>
            <Text>65k - 80k</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={ styles.bynIsUnActive }   onPress={()=>addPriceRange("ninthRange") }>
            <Text>80k - 100k</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={ styles.bynIsUnActive }   onPress={()=>addPriceRange("tentRange") }>
            <Text>100k +++ </Text>
            </TouchableOpacity>
          </View>}

  { specproduct ==="vehicles" && vehicleTypeDsp && <View style={{flexDirection:'row'}} >
    
                  <TouchableOpacity onPress={toggleCargoTrcks} style={styles.btnIsActive  } >
                    <Text style={{color:"white"}} >Cargo Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={toggleHeavyEquipment} style={styles.btnIsActive  } >
                    <Text style={{color:"white"}} >heavy Equipment</Text>
                  </TouchableOpacity>
                 {cargoTrcks && <View style={{flexDirection:'row'}} >
                  <TouchableOpacity onPress={()=>addVehicleType("truckhorse")} style={styles.bynIsUnActive } >
                    <Text>truck horse</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("BoxTrucks")} style={styles.bynIsUnActive } >
                    <Text>Box Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("FlatbedTrucks")} style={styles.bynIsUnActive } >
                    <Text>Flatbed Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("RefrigeratedTrucks")} style={styles.bynIsUnActive } >
                    <Text>Refrigerated Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("DumpTrucks")} style={styles.bynIsUnActive } >
                    <Text>Dump Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("TankerTrucks")} style={styles.bynIsUnActive } >
                    <Text>Tanker Trucks</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>addVehicleType("CurtainsideTrucks")} style={styles.bynIsUnActive } >
                    <Text>Curtainside Trucks</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>addVehicleType("ParcelVans")} style={styles.bynIsUnActive } >
                    <Text>Parcel Vans</Text>
                  </TouchableOpacity>
                  </View>}
             { heavyEquipment && <View style={{flexDirection:'row'}} >   
                    <TouchableOpacity onPress={()=>addVehicleType("Tipper")}  style={styles.bynIsUnActive }  >
                      <Text>Tipper</Text>
                    </TouchableOpacity  >
                    <TouchableOpacity  onPress={()=>addVehicleType("Excavator")} style={styles.bynIsUnActive }  >
                      <Text>Excavator</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("Bulldozer")} style={styles.bynIsUnActive } >
                      <Text>Bulldozer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("WheelLoader")}style={styles.bynIsUnActive }   >
                      <Text>Crane</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("truckhorse")} style={styles.bynIsUnActive } >
                      <Text>WheelLoader</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={()=>addVehicleType("Compactors")}style={styles.bynIsUnActive } >
                      <Text>Compactors</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={()=>addVehicleType("Pavers")}style={styles.bynIsUnActive } >
                      <Text>Pavers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("Graders")} style={styles.bynIsUnActive } >
                      <Text>Graders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={()=>addVehicleType("TrackedLoader")} style={styles.bynIsUnActive } >
                      <Text>Tracked Loader</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={()=>addVehicleType("ConcreteMixer")} style={styles.bynIsUnActive } >
                      <Text>Concrete Mixer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("otherHeavyB")} style={styles.bynIsUnActive }  >
                      <Text>Other</Text>
                    </TouchableOpacity>
                    
                  </View>}

                 {!cargoTrcks&&  !heavyEquipment &&<View style={{flexDirection:'row'}} >
                  <TouchableOpacity onPress={()=>addVehicleType("Sedans")} style={styles.bynIsUnActive } >
                    <Text>Sedans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("SUV")} style={ styles.bynIsUnActive } >
                    <Text>SUV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Vans")} style={styles.buttonStyle} >
                    <Text>Vans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("PickupTrucks")} style={styles.bynIsUnActive } >
                    <Text>Pickup Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Hatchbacks")} style={styles.bynIsUnActive } >
                    <Text>Hatchbacks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Convertibles")} style={ styles.bynIsUnActive } >
                    <Text>Convertibles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Crossovers")} style={styles.bynIsUnActive } >
                    <Text>Crossovers</Text>
                  </TouchableOpacity>
                   <TouchableOpacity onPress={()=>addVehicleType("otherVehicles")} style={styles.buttonStyle} >
                    <Text>other</Text>
                  </TouchableOpacity>
                  </View>}

                  </View>}

                  {specproduct ==="vehicles" && vehiMakeDsp && <View style={{flexDirection:'row'}} >

                    {!heavyEquipmentMake && <TouchableOpacity style={styles.btnIsActive} onPress={toggleCargoTrcksMake} >
                      <Text style={{color:'white'}}>Cargo Trucks</Text>
                    </TouchableOpacity>}

                   { !cargoTrcksMake&& <TouchableOpacity  style={styles.btnIsActive} onPress={toggleHeavyEquipmentMake}>
                      <Text style={{color:'white'}} >Heavy Equipment</Text>
                    </TouchableOpacity>}

                    {heavyEquipmentMake && <View style={{flexDirection:'row'}} > 
                      <TouchableOpacity style={styles.bynIsUnActive }   onPress={()=>addVehiMake("heavyCaterpillar") } >
                        <Text>Caterpillar </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }   onPress={()=>addVehiMake("heavyVolvo") }>
                        <Text>Volvo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("heavyJohnDeere") }>
                        <Text>John Deere</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("heavyHyundai") } >
                        <Text>Hyundai</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("heavySany") } >
                        <Text>Sany </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive } onPress={()=>addVehiMake("heavyKobelco") } >
                        <Text>Kobelco </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive } onPress={()=>addVehiMake("heavyXCMG") } >
                        <Text>XCMG</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("heavyBobcat") } >
                        <Text>Bobcat</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("heavyHitachi") } >
                        <Text>Hitachi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("heavyManitou") } >
                        <Text>Manitou</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("heavyKubota") } >
                        <Text>Kubota</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("heavyOtherM") } >
                        <Text>Other</Text>
                      </TouchableOpacity>
                    </View>}

                   {cargoTrcksMake && <View style={{flexDirection:'row'}} >
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoMercedesBenz") }  >
                        <Text>Mercedes-Benz</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoMAN") } >
                        <Text>MAN</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoScania") } >
                        <Text>Scania </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoHowo") } >
                        <Text>Howo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoVolvo") } >
                        <Text>Volvo </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoDAF") } >
                        <Text>DAF </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoIveco") } >
                        <Text>Iveco </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoUD") } >
                        <Text>UD </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoIsuzu") } >
                        <Text>Isuzu </Text>
                      </TouchableOpacity  >
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoMitsubishiFuso") } >
                        <Text>Mitsubishi Fuso</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoHino") } >
                        <Text>Hino</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("cargoOtherM") } >
                        <Text>other</Text>
                      </TouchableOpacity>
                    </View>}

                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Toyota") }  >
                      <Text>Toyota</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("MercedesBenz") }  >
                      <Text>Mercedes-Benz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("BMW") }  >
                      <Text>BMW</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Honda") }  >
                      <Text>Honda</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("NISSAN") }  >
                      <Text>NISSAN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("MAZDA") }  >
                      <Text>MAZDA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Volkswagen") }  >
                      <Text>Volkswagen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Ford") }  >
                      <Text>Ford</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Isuzu") }  >
                      <Text>Isuzu</Text>
                    </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Chevrolet") }  >
                      <Text>Chevrolet</Text>
                      </TouchableOpacity>
                    <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Hyundai") }  >
                        <Text>Hyundai</Text>
                    </TouchableOpacity>
                      <TouchableOpacity  style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Renault") } >
                        <Text>Renault</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Mitsubishi") }  >
                        <Text>Mitsubishi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive }  onPress={()=>addVehiMake("Kia") }  >
                        <Text>Kia</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.bynIsUnActive } onPress={()=>addVehiMake("otherMakes") }  >
                        <Text>other</Text>
                      </TouchableOpacity>
                  </View>}


                      {specproduct=== "trailers" && trailerTypeDsp && <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={()=>addTrailerType("Bulktrailer")} style={styles.bynIsUnActive } >
                        <Text>Bulk trailer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("SideTipper")}  style={styles.bynIsUnActive }>
                        <Text>Side Tipper</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Tautliner")}  style={styles.bynIsUnActive }>
                        <Text>Tautliner</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Flatbed")}  style={styles.bynIsUnActive }>
                        <Text>Flatbed</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Tanker")}  style={styles.bynIsUnActive }>
                        <Text>Tanker</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Refrigerated")} style={styles.bynIsUnActive } >
                        <Text>Refrigerated</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("CarHauler")}  style={styles.bynIsUnActive }>
                        <Text>Car Hauler </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("UtilityTrailer")} style={styles.bynIsUnActive } >
                        <Text>Utility Trailer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Lowboy")} style={styles.bynIsUnActive } >
                        <Text>Lowboy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("otherTrailer")}  style={styles.bynIsUnActive }>
                        <Text>other</Text>
                      </TouchableOpacity>
                        </View>}



        </ScrollView> : null }

      <div className="Main-grid">
         {allTrucks.length > 0 ? rendereIterms
            : <View style={{flexDirection:'row'}} >

           <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate( `/DspShop/${location}/vehicles/${sellOBuyG}` )}>
                    <ArrowBackIcon style={{color : 'black'}} />
        </TouchableOpacity>
                    <Text>Loading...</Text> 
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
  }, 
  buttonIsFalse : {
     borderWidth : 1 ,
     borderColor : '#6a0c0c' ,
     paddingLeft :4 , 
     paddingRight:4 ,
    //  marginLeft : 6
   } , 
    bttonIsTrue:{
    backgroundColor : 'white' ,
     paddingLeft :4 ,
     paddingRight:4 ,
     color :'white' 

    }

});
