import React, { useEffect, useState ,useRef} from 'react';








import { useParams , useNavigate} from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { WhatsApp  } from '@mui/icons-material';
import CallIcon from '@mui/icons-material/Call';
import ChatIcon from '@mui/icons-material/Chat';

import DeleteIcon from '@mui/icons-material/Delete';




import { db , auth} from '../config/fireBase';
import { View , Text , Image , ScrollView , TouchableOpacity , Linking , StyleSheet, Alert, ActivityIndicator , Share} from 'react-native';
import {onSnapshot ,  query ,collection,where ,limit,getDocs,startAfter,orderBy,doc,updateDoc , deleteDoc} from "firebase/firestore"


function OneFirmsShop({blockVerifiedU, blackLWarning }){

  const {location, specproductG ,sellOBuyG ,userId , CompanyName , itemKey,} = useParams()

  const navigate = useNavigate()


      const [specproduct , setSpecPrduct] = React.useState(specproductG)

     const [fontMarkting, setFontMarketing] = useState([]);
  let [trackDatachange , settrackFmarkt] = React.useState(false)

  function trackFmarket(){
    settrackFmarkt(prev=>!prev)
  }
  useEffect(() => {
    try {
      if(auth.currentUser){

        const userId = auth.currentUser.uid;
        // const dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId) );
      let dataQuery = query(collection(db, "Shop"), where("userId" ,"==", userId), where("frontMarkert" ,"==", true) ,where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) );
       
        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          const loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

        setFontMarketing(loadedData);
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();
      }
    } catch (err) {
      console.error(err);
    }
  }, [trackDatachange]); 


    const toggleFrontMarting = async ( id ,decision ) => {
      try {
        if (decision === "Accept"&& fontMarkting.length < 4  ) {
          const docRef = doc(db, 'Shop', id);
          await updateDoc(docRef, { frontMarkert : true ,  });
          alert("Added To Top Listing");
        }else if(decision === "Accept"&& fontMarkting.length >= 4  ){
          alert("You can only add 4 iterms to martFrontline")
        }else{
          const docRef = doc(db, `Shop`, id);
          await updateDoc(docRef, { frontMarkert : false ,  });
          alert("Removed From Top Listing");
        }
      trackFmarket()
      } catch (err) {
        console.error(err);
      }
  }
    


      const [spinnerItem, setSpinnerItem] = React.useState(false);

    const deleteItem = async (id , imageUrls) => {
      
    setSpinnerItem(true);

        imageUrls.forEach(async (imageUrl) => {
    try {
        const response = await fetch(imageUrl, {
            method: 'DELETE',
        });

        if (response.ok) {
            const loadsDocRef = doc(db, 'Shop', id);
            deleteDoc(loadsDocRef);
            console.log('Document deleted successfully');
        } else {
            console.log('Error deleting image:', response.status);
        }
    } catch (error) {
        console.log('Error deleting image:', error);
        setSpinnerItem(false);
    } finally {
            const loadsDocRef = doc(db, 'Shop', id);
            deleteDoc(loadsDocRef);
        setSpinnerItem(false);
    }
});

      trackFmarket()
    } 















      let [sellOBuy , setSellOBuy] = React.useState(sellOBuyG)
 const [allSoldIterms, setAllSoldIterms] = useState([]);
 
        let [buyRent , setBuyRent] = React.useState(null)
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

  const [getOneItem, setgetOneItem] = useState([]);

    function getOneItemF(){

        const dataQuery = query(collection(db, "Shop"), where("timeStamp", "==", itemKey) , where("userId", "==", userId) );

        const unsubscribe = onSnapshot(dataQuery, (snapshot) => {
          let loadedData = [];
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' || change.type === 'modified') {
              const dataWithId = { id: change.doc.id, ...change.doc.data() };
              loadedData.push(dataWithId);
            }
          });

          setgetOneItem(loadedData);
        });
        
        // Clean up function to unsubscribe from the listener when the component unmounts
        return () => unsubscribe();


    }

        function refreshPageF(){
            window.location.reload();
      }



        
  const [losdingSpec , setLoadingSpec]=React.useState(false)  
  const [dspLoadMoreBtn , setLoadMoreBtn]=React.useState(true)
  const [LoadMoreData , setLoadMoreData]=React.useState(false)

async function fetchData(loadOneMore) {

             if(loadOneMore){

        setLoadMoreData(true) 
      }
  try {
    const mainLoadsCollection = collection(db, 'Shop');
    const orderByField = 'productName'; // Replace with the actual field name for ordering

    const pagination = loadOneMore && allSoldIterms.length > 0 ? [startAfter(allSoldIterms[allSoldIterms.length - 1][orderByField])] : [];

    
  let dataQuery;

            if(specproduct === "vehicles" ){

                 if(vehicleType && vehiMake && priceRange && (buyRent===true || buyRent === false || buyRent==="R2B") ){
                    setLoadingSpec(true)
                    dataQuery = query(collection(db, "Shop"),orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId),  where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType) , where("vehiMake", "==", vehiMake) , where("vehiMake", "==", vehiMake) , where("priceRange", "==", priceRange) , where("sellRent", "==", buyRent) );
                 }else if(vehicleType && vehiMake && priceRange){

                    setLoadingSpec(true)
                    dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType) , where("vehiMake", "==", vehiMake) , where("vehiMake", "==", vehiMake) , where("priceRange", "==", priceRange) );
                 }

                 else if (priceRange) {

                if(vehicleType ){
                    setLoadingSpec(true)
                  dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("priceRange", "==", priceRange) , where("vehicleType", "==", vehicleType) );

                }else if( vehiMake ){

                    setLoadingSpec(true)
                  dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("priceRange", "==", priceRange) , where("vehiMake", "==", vehiMake) );
                }else if ((buyRent === true || buyRent === false || buyRent ==="R2B" ) ){

                    setLoadingSpec(true)
                  dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("sellRent", "==", buyRent) , where("priceRange", "==", priceRange));
                }else{

                    setLoadingSpec(true)
                  dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("priceRange", "==", priceRange) );
                }

                 }else if(vehicleType){
                  if( vehiMake ){

                    setLoadingSpec(true)
                    dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType) , where("vehiMake", "==", vehiMake) );
                  }else if ((buyRent === true || buyRent === false || buyRent==="R2B" ) ){

                    setLoadingSpec(true)
                  dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("sellRent", "==", buyRent) , where("vehicleType", "==", vehicleType));

                }
                  else{

                    setLoadingSpec(true)
                    dataQuery = query(collection(db, "Shop"),orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehicleType", "==", vehicleType)  );
                  }
                 }else if(vehiMake){
                   if ((buyRent === true || buyRent === false || buyRent==="R2B" ) ){

                    setLoadingSpec(true)
                  dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("sellRent", "==", buyRent) , where("vehiMake", "==", vehiMake));

                    }else {

                    setLoadingSpec(true)
                      dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("vehiMake", "==", vehiMake)  );
                    }
                 }else if(buyRent === true || buyRent === false || buyRent==="R2B" ){

                    setLoadingSpec(true)
                      dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy)  , where("sellRent", "==", buyRent) , );
                 }
                 else{

                    setLoadingSpec(true)
                  dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) );
                }
            



            }else   if (specproduct === "trailers") {
              if(trailerType){

                if(buyRent === true || buyRent === false || buyRent==="R2B" ){
                  setLoadingSpec(true)
                  dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellRent", "==", buyRent) , where("sellOBuy", "==", sellOBuy) , where("trailerType", "==", trailerType), where("sellRent", "==", buyRent) );

                }else{
                    setLoadingSpec(true)
                dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) , where("trailerType", "==", trailerType) );
                }

              }else if (buyRent === true || buyRent === false || buyRent==="R2B" ) {
                    setLoadingSpec(true)
                dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellRent", "==", buyRent) , where("sellOBuy", "==", sellOBuy) );
            } else {
                    setLoadingSpec(true)
                dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) );
            }
        } else if(specproduct === "Sprovider") {
                    setLoadingSpec(true)
            dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), );
        }else{

                    setLoadingSpec(true)
            dataQuery = query(collection(db, "Shop"), orderBy(orderByField), ...pagination , limit(8) , where("userId" ,"==", userId), where("specproduct", "==", specproduct), where("location", "==", location), where("sellOBuy", "==", sellOBuy) );
        }





    const docsSnapshot = await getDocs(dataQuery);

    let userItemsMap = [] // Map to store user items

    docsSnapshot.forEach(doc => {
      userItemsMap.push( { id: doc.id, ...doc.data() }) 

    });


    let loadedData = userItemsMap
    if(loadedData.length < 4 ){
      setLoadMoreBtn(false)
    }
    // Update state with the new data
    setAllSoldIterms(loadOneMore ? [...allSoldIterms, ...loadedData] : loadedData);
          if(loadOneMore){

        setLoadMoreData(false) 
      }

                    setLoadingSpec(false)
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}




useEffect(() => {
  fetchData();
}, [specproduct, buyRent, sellOBuy , priceRange , vehicleType ,vehiMake ,trailerType, trackDatachange]);;

useEffect(() => {

    getOneItemF()

}, []);;






        

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


  const [imageLoading, setImageLoading] = useState({ ['']: false });
    const imagaLoadingF = (itemId , state ) => {
      setImageLoading((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      }));
  }
    

const [dspAllImages , setDspAllImages]= React.useState({ ['']: false });

function displayAllImages(itemId){
  setDspAllImages((prevState) => ({
        ...prevState,
        [itemId]: !prevState[itemId],
      })
  );
}

const spreadThis = [...getOneItem ,...allSoldIterms]



  const rendereIterms = spreadThis.map((item)=>{

        const message =  `${item.CompanyName} is this Product still ${ item.sellOBuy === "forSell"? "available":"wanted" } ${item.productName} ${item.sellRent ? "for sell" :'for rental' }   ${item.currency?"USD" : "Rand" }  ${item.price}                    from https://www.transix.net/OneFirmsShop/${item.userId}/${item.id}/${item.location}/${sellOBuy}` ; // Set your desired message here
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
      <View  key={item.id}   style={{padding :7, borderWidth : 2 , borderColor:'black', borderRadius:8 ,  shadowColor: '#6a0c0c',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 5,backgroundColor:'rgba(235, 142, 81, 0.07)' }}>

      { item.isVerified&& <View style={{position : 'absolute' , top : 0 , right : 0 , backgroundColor : 'white' , zIndex : 66}} >
            <VerifiedIcon style={{color : 'green'}} />
      </View>}

   
       
           <View>
          {sellOBuy ==="forSell"  &&<ScrollView  horizontal  showsHorizontalScrollIndicator={false} style={{  height : 200 ,}} >
        {item.imageUrl.map((image, index) => (
          <View>
            {
              image ?
            <img key={index} src={image} alt={`Image ${index}`} style={{ margin: 7, maxWidth: '100%', height: 200, }} loading='lazy'/>
            : <Text style={{alignSelf:'center'}} >quality images loading </Text>
            }
          </View>
        ))}

          </ScrollView>} 
          

      {<View style={{ position : 'absolute' , bottom :0 , left :0 ,flexDirection:'row'}} >

         {item.brandNew &&  <View style={{backgroundColor :'#40E0D0',paddingLeft :4 , paddingRight:4 , marginLeft :7}} >
          <Text style={{color :'white'}} > brand New</Text>
          </View>}

         {item.swapA &&  <View style={{backgroundColor :'#008080',paddingLeft :4 , paddingRight:4 , marginLeft :7}} >
          <Text style={{color :'white'}} >Swap</Text>
          </View>}

         {item.negetiatable &&  <View style={{backgroundColor :'#25D366',paddingLeft :4 , paddingRight:4 , marginLeft :7}} >
          <Text style={{color :'white'}} >Negotiable</Text>
          </View>}

      </View>}

          </View>

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
       {<Text>:  {item.productName} { item.sellRent === "R2B" ?"Rent To Buy": item.sellRent ? "for sell" :'for rental' } </Text>} 
      </View>}
          
         {item.swapWith &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >Swap</Text>
       {<Text>:  {item.swapWith} </Text>} 
      </View>}

      { item.price &&<View style={{flexDirection :'row'}} >
        <Text style={{width :100}} >{sellOBuy==='forSell' ?'Price':'Budget' }</Text>
       {<Text style={{color:'green'}} >:  {item.currency?"USD" : "Rand" }  {item.price}</Text>} 
      </View>}

    
       { !blockVerifiedU && !blackLWarning &&item.contact && <View style={{flexDirection :'row'}} >
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
        <Text style={{width :100 }} >Aditional Info</Text>
      {<Text  >:  {item.additionalInfo}</Text>} 
      </View>}

        </View>}

        {contactDisplay[item.id] && contactMe}

       { !contactDisplay[item.id] &&<TouchableOpacity onPress={()=>toggleDspMoreInfo(item.id) } >
          <Text style={{color :'green'}} >{  dspMoreInfo[item.id]  ?"See Less": "See more"} </Text>
        </TouchableOpacity>}
        
     
          {!blockVerifiedU && !blackLWarning && <TouchableOpacity  onPress={()=>toggleContact(item.id) } style={{ width : 150 , height : 30 , alignItems :"center" , justifyContent :'center', backgroundColor:'#228B22' ,  borderRadius: 8, alignSelf:'center', margin:5 }} >
          <Text style={{ color:'white'}} > Get In Touch Now</Text>
        </TouchableOpacity>}
        
             { auth.currentUser && auth.currentUser.uid === userId &&
        <View style={{justifyContent:'space-between' , flexDirection :'row',padding:6,paddingLeft:15}} >

          {spinnerItem&&<Text> Deleting {item.productName} </Text>}
          {!item.frontMarkert&& <TouchableOpacity onPress={()=>toggleFrontMarting(item.id , "Accept") } style={{backgroundColor:'#3CB371', flexDirection :'row' , height : 30 , borderRadius:10, width : 155 ,justifyContent:'space-around',alignItems:'center'}}>
            <Text style={{color:"white"}} >Pick Top Listings</Text>
          </TouchableOpacity>}
         {item.frontMarkert&&  <TouchableOpacity onPress={()=>toggleFrontMarting(item.id , "Remove") } style={{backgroundColor:'#DC143C', flexDirection :'row' , height : 30 , borderRadius:10, width : 155 ,justifyContent:'space-around',alignItems:'center'}}>
            <Text style={{color:'white'}} >Remove Top Listings</Text>
          </TouchableOpacity>}

        {!spinnerItem&& <TouchableOpacity onPress={()=>deleteItem(item.id , item.imageUrl)}  style={{backgroundColor:'#CE2029' , flexDirection :'row' , height : 30 , borderRadius:10, width : 86 ,justifyContent:'space-around',alignItems:'center'}} >
            <Text style={{color:'white',fontSize:17}} >Delete</Text>
            <DeleteIcon size={24} color="red" />
          </TouchableOpacity>}
        </View>
        }

    </View>
        )
      })






   const handleShareApp = async (companyName) => {
              try {
                const message = `I invite you to Transix!

Transix is a tech-driven business enhancing transportation and logistics services, connecting suppliers with demand for truckloads, vehicles, trailers, spare parts etc.

Contact us at +263716325160 with the message "Application" to swiftly receive the application download link.

Explore Application at : https://play.google.com/store/apps/details?id=com.yayapana.Transix
Explore website at : https://transix.net/

Experience the future of transportation and logistics!`;

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


    return(
      <View>
                 
        <View style={{flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center', justifyContent:'space-between'}} >
              <View style={{flexDirection:'row'}} >
                <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1) } >
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
       
                <Text style={{fontSize: 20 , color : 'white'}} > { CompanyName} STORE</Text>
                </View>
       {sellOBuy !== "toBuy" || sellOBuy !=="forSell" ?<View style={{ justifyContent:'space-evenly' , backgroundColor:'#6a0c0c', flexDirection : "row" , position:'absolute',right:0, zIndex:10, bottom:7, top: 18,borderLeftColor: "white" , borderLeftWidth:2, paddingLeft:5,alignItems :'center ' ,justifyContent:'center',paddingRight:10}} >




               {sellOBuy ==="toBuy"&& <TouchableOpacity onPress={()=>setSellOBuy("forSell")}
             style={sellOBuy === "forSell" ? styles.bttonIsTrue : styles.buttonIsFalse} >
               {/* <Text style={sellOBuy === "forSell" ? {color:'black'} : {color:'white'}} >Click to BUY</Text> */}
                   {auth.currentUser&& auth.currentUser.uid === userId ? <Text style={{color:'white',fontWeight:'bold',fontSize:19,alignSelf:'center' }} >Looking For</Text> 
             : <Text style={sellOBuy === "forSell" ? {color:'black'} : {color:'white',fontWeight:'bold',fontSize:19,alignSelf:'center' }} >Click to BUY</Text>}
            </TouchableOpacity>}
            {sellOBuy ==="forSell"&& <TouchableOpacity onPress={()=>setSellOBuy("toBuy")} style={sellOBuy === "toBuy" ? styles.bttonIsTrue : styles.buttonIsFalse} >
                {/* <Text style={sellOBuy === "toBuy" ? {color:'black'} :{color:'white'} } >Click to SELL</Text> */}
                 {auth.currentUser && auth.currentUser.uid === userId ? <Text style={{color:'white',fontWeight:'bold',fontSize:19,alignSelf:'center' }} >My Products </Text> :

                 <Text style={sellOBuy === "toBuy" ? {color:'black'} :{color:'white',fontWeight:'bold',fontSize:19,alignSelf:'center' } } >Click to SELL</Text>}
            </TouchableOpacity>}

        </View> :null }

        </View> 








         <View style={{flexDirection:'row' , justifyContent : 'space-evenly' , paddingLeft : 20 , paddingRight: 20 , height : 40 , alignItems : 'center' , backgroundColor : '#6a0c0c' , marginBottom:10 }}>

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

     { specproduct ==="vehicles" || specproduct ==="trailers" ? <ScrollView  horizontal  showsHorizontalScrollIndicator={false} style={{marginBottom:15 , marginLeft:10 , height : 27}} >


           { !priceRangeDsp && !vehicleTypeDsp && !vehiMakeDsp && !trailerTypeDsp && <View style={{flexDirection:'row'}} > 
          <TouchableOpacity onPress={()=> setBuyRent(null)} style={buyRent === null ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== null ? {color : 'white'}: {color : 'black'} } >All </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> setBuyRent(true)} style={buyRent === true ? styles.btnIsActive : styles.bynIsUnActive } >
            <Text style={ buyRent=== true ? {color : 'white'}: {color : 'black'} } >Buy </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> setBuyRent(false)} style={buyRent === false ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ buyRent=== false ? {color : 'white'}: {color : 'black'} } >Rent</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=> setBuyRent("R2B")} style={buyRent === "R2B" ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ buyRent=== "R2B" ? {color : 'white'}: {color : 'black'} } >R2B</Text>
          </TouchableOpacity>
          </View>}

          { specproduct ==="vehicles" && !vehicleTypeDsp && !vehiMakeDsp && <TouchableOpacity onPress={addPriceRangeDsp} style={priceRange  ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ priceRange ? {color : 'white'}: {color : 'black'} } >{priceRange? priceRangeShow : "budjet"} </Text>
          </TouchableOpacity>}

         { specproduct ==="vehicles" && !priceRangeDsp && !vehiMakeDsp && <TouchableOpacity onPress={dspVehicleTypeDsp} style={vehicleType ? styles.btnIsActive : styles.bynIsUnActive }>
            <Text style={ vehicleType ? {color : 'white'}: {color : 'black'} } > {vehicleType ? vehicleType : "body"} </Text>
          </TouchableOpacity>}

          { specproduct ==="vehicles" && !priceRangeDsp&& !vehicleTypeDsp && <TouchableOpacity onPress={toggleVehiMakeDsp} style={ vehiMake ? styles.btnIsActive : styles.bynIsUnActive }>
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
                  <TouchableOpacity onPress={()=>addVehicleType("Vans")} style={ styles.bynIsUnActive }  >
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
        <ScrollView>
            {losdingSpec && <ActivityIndicator size="small" />}

     {sellOBuy ==="forSell"&& !dspLoadMoreBtn &&allSoldIterms.length <= 0 &&!vehicleType && !priceRange&& !buyRent && !vehiMake&& <Text style={{fontSize:19 ,fontWeight:'bold'}} >{CompanyName} does not have {specproduct} </Text> }
        {sellOBuy ==="toBuy"&& !dspLoadMoreBtn &&allSoldIterms.length <= 0 &&!vehicleType && !priceRange&& !buyRent && !vehiMake&& <Text style={{fontSize:19 ,fontWeight:'bold'}} >{CompanyName} is not looking for {specproduct} </Text> }
            { allSoldIterms.length<=0 &&  (vehicleType || priceRange|| buyRent || vehiMake)&&<Text style={{fontSize :15}}> The specified product is not available in {CompanyName} Store. </Text> }
         { allSoldIterms.length<=0 &&  (vehicleType || priceRange|| buyRent || vehiMake)&& <TouchableOpacity onPress={refreshPageF} style={{borderWidth: 2.5 , width : 150 , height : 30 , borderColor : "#6a0c0c" , alignSelf:'center', margin:4, borderRadius:8 ,  shadowColor: '#6a0c0c',shadowOffset: { width: 1, height: 2 },shadowOpacity: 0.7,shadowRadius: 5,justifyContent:'center',alignItems:'center'  }} >
          <Text style={{ fontSize:16 , fontWeight:'600',color:'#6a0c0c'}} >Refresh</Text>
         </TouchableOpacity>}

       {!dspLoadMoreBtn &&allSoldIterms.length <= 0  &&<TouchableOpacity onPress={handleShareApp} >

         <Text style={{fontSize : 20 , textDecorationLine:'underline'}} >Please share or recommend our app for more services and products! </Text>
       </TouchableOpacity>}

         <div className="Main-grid">
           { allSoldIterms.length>0 &&  rendereIterms}
        </div>

         { dspLoadMoreBtn &&allSoldIterms.length<=0  && <Text> {specproduct} Loading.......</Text>} 


          {LoadMoreData && allSoldIterms.length>0 && <Text style={{alignSelf:'center'}} >Loading More {specproduct}....... </Text> }

         {allSoldIterms.length>0 && dspLoadMoreBtn&& <TouchableOpacity onPress={()=> fetchData(true) } style={{ height :45 , backgroundColor :'#228B22', margin :25 , justifyContent:'center',borderRadius:25}} >
        <Text style={{color :'white', fontSize :21 , textAlign :'center'}} >Load More......</Text>
      </TouchableOpacity>}
        <View style={{height : 200}} ></View>
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
    height : 20 ,
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