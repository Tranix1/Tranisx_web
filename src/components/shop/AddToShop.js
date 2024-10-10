import React,{useState} from "react";
import { storage } from "../config/fireBase";
import { getDownloadURL, ref, uploadBytes, } from "firebase/storage";
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from "../config/fireBase";
import {View, TextInput , Text ,    TouchableOpacity , Image , ActivityIndicator , StyleSheet , ScrollView} from "react-native"
import inputstyles from "../styles/inputElement";

// import * as ImagePicker from 'expo-image-picker';

// import Fontisto from '@expo/vector-icons/Fontisto';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams , useNavigate } from 'react-router-dom';

function AddToShop( {deliveryR ,username ,contact , isVerified , shopLocation} ) {
    let {location , specproduct , sellOBuy} = useParams()

    const navigate = useNavigate()
  const shopDB = collection(db, "Shop");

  const [formData, setFormData] = React.useState({
    productName: "",
    price: null,
    additionalInfo :"" ,
    productLoc :"" ,
    mileage :'' ,
    year :'' ,
    engine : '' , 
    trans :"" ,
     fuel :''
  });

  const  handlechange  = (value, fieldName) => {

      if (fieldName === 'price' && isNaN(value)) {
        // Handle the case where the input is not a number for the price field
        alert('Price must be a number.');
        return;
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };


    const [currency , setCurrency] = React.useState(true)
  function toggleCurrency(){
    setCurrency(prev=>!prev)
  }

    const [sellRent , setSellRent] = React.useState(true)
  function toggleSellRent(){
    setSellRent(prev=>!prev)
  }

    const [brandNew , setBrandNew] = React.useState(false)
  function toggleBrandNew(){
    setBrandNew(prev=>!prev)
  }

 

  let priceRange = null

        if (formData.price < 1500) {
            priceRange= "firstRange"
        } else if (formData.price >= 1500 && formData.price < 2500)  {
            priceRange ="scndRange";
        } else if (formData.price >= 2500 && formData.price < 5000)  {
            priceRange = "thirdRange" ;
        } else if (formData.price >= 5000 && formData.price < 10000)  {
            priceRange = "fouthRange" ;
        } else if (formData.price >= 10000 && formData.price < 25000)  {
            priceRange = "fifthRange" ;
        } else if (formData.price >= 25000 && formData.price < 45000)  {
            priceRange = "sixthRange" ;
        } else if (formData.price >= 45000 && formData.price < 65000)  {
            priceRange = "svthRange"
        } else if (formData.price >= 65000 && formData.price < 80000)  {
            priceRange = "eighthRange"
        } else if (formData.price >= 80000 && formData.price < 100000)  {
            priceRange = "ninthRange"
        } else if (formData.price >= 100000 )  {
            priceRange = "tentRange"
        }

        const [vehiMakeDsp , setvehiMakeDsp] =React.useState(false)
          function toggleVehiMakeDsp(){
            setvehiMakeDsp(prev => !prev)
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

    const [ heavyEquipmentMake , setheavyEquipmentMake] = React.useState(false)
    function toggleHeavyEquipmentMake(){
      setheavyEquipmentMake(prev=>!prev)
      setCargoTrucksMake(false)
    }

  const [vehicleTypeDsp , setVehicleTypeDsp] = React.useState(false)
    function dspVehicleTypeDsp(){
      setVehicleTypeDsp(prev => !prev)
    }

  const [vehicleType , setVehicleType] = React.useState(null)
    function addVehicleType(slctedV){
      setVehicleType(slctedV)
      setVehicleTypeDsp(false)
    }

    const [cargoTrcks , setCargoTrucks] = React.useState(false)
    function toggleCargoTrcks(){
      setCargoTrucks(prev=>!prev)
      setheavyEquipment(false)
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

const [images, setImages] = useState([]);

const [ imageUpload, setImageUpload] = React.useState([])    

    const handleFileInputChange = (e) => {
        const files = Array.from(e.target.files);

        // Limit the number of images to 4
        if (images.length + files.length > 4) {
            alert('You can only add up to 4 images.');
            return;
        }
        
            setImageUpload(prevImages => [...prevImages, ...files]);

        // Handle multiple file input change
        files.forEach(file => {

            const reader = new FileReader();
            reader.onload = () => {
                setImages(prevImages => [...prevImages, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };



    const [spinnerItem, setSpinnerItem] = React.useState(false);
    
 let image 

  const handleSubmit = async () => {

       if(images.length === 0){
        alert("Add at least 4 images")
        return
      }else if(!username){
        alert('add username')
        return
      }
     

      if(specproduct === "vehicles"){

       if(!vehicleType){
        alert("Specify the vehicle type")
        return
      } else if(!vehiMake){
          alert("Specify vehicle make")
          return
        }else if(!formData.price ||!formData.productName  ) {
        alert("Add product name and the price to continue")
        return
        }
      }else if( specproduct !== "Sprovider" ){ 
      if(!formData.productName  || !formData.price  ){
        alert("Add product name and the price to continue")
        return
      }}  else if(!trailerType &&specproduct === "trailers" ){
          alert('Specify trailer type');
          return
        }
      setSpinnerItem(true)

    
    let imageUrls = [];

    let userId = auth.currentUser.uid


    try {
        // Upload each image and get the download URL
        for (const image of imageUpload) {
            const imageName = image.name + new Date().getTime();
            const imageRef = ref(storage, `Shop/${imageName}`);
            await uploadBytes(imageRef, image);
            const imageUrl = await getDownloadURL(imageRef);
            imageUrls.push(imageUrl);
        }

        // Add a document to Firestore with image URLs
        const docRef = await addDoc(shopDB, {
            CompanyName: username,
            contact: contact,
            productName: formData.productName,
            price: formData.price,
            imageUrl: imageUrls,
            userId: userId,
            additionalInfo: formData.additionalInfo,
            mileage : formData.mileage ,
            year : formData.year ,
            engine : formData.engine ,
            trans : formData.trans ,
            fuel : formData.fuel ,
            isVerified: isVerified,
            location: location,
            specproduct: specproduct,
            currency: currency,
            shopLocation: shopLocation,
            deliveryR : deliveryR ,
            sellRent: sellRent ,
            sellOBuy :sellOBuy ,
            priceRange : priceRange ,
            vehicleType : vehicleType ,
            brandNew : brandNew ,
            vehiMake : vehiMake

        });


       setFormData({
        productName: "",
        price: "",
        additionalInfo :"",
        mileage :'' ,
        year :'' ,
        engine : '' , 
        trans :"" ,
        fuel :''
      });
      imageUrls = []
      setImages([])
      setImageUpload([])
      setSpinnerItem(false)
      setVehiMake(null)
      setVehicleType(null)
      setBrandNew(false)
        console.log('Document added with image URLs:', docRef.id);
    } catch (error) {
      setSpinnerItem(false)
        console.error('Error uploading images and adding document:', error);
    }
  };
  return (
      <View style={{alignItems :'center', paddingTop : 80}} >
         <View  style={{position:'absolute' , top : 0 , left: 0 , right : 0 , flexDirection : 'row' , height : 74  ,  paddingLeft : 6 , paddingRight: 15 , paddingTop:10 ,backgroundColor : '#6a0c0c' ,paddingTop : 15 , alignItems : 'center' , }} >
         <TouchableOpacity style={{marginRight: 10}} onPress={() => navigate(-1)}>
                    <ArrowBackIcon style={{color : 'white'}} />
        </TouchableOpacity> 
        
        <Text style={{fontSize: 20 , color : 'white'}} > Add {specproduct} to Shop  </Text>
       </View>


     {/* {image && <Image source={{ uri: image.localUri }} style={{ width: 200, height: 200 }} />} */}
      {image && <img src={image} alt="Selected" style={{ width : 200 , height : 200}} />}


          {sellOBuy==='forSell' && !vehiMakeDsp && !vehicleTypeDsp &&  <Text>Add @ most 4  Images </Text>}
        {sellOBuy==='forSell' && !vehiMakeDsp && !vehicleTypeDsp &&  <div >
            {images.length < 4 && (
                <div>
                    <label for="fileInput">
                        <CameraAltIcon style={{ color: '#6a0c0c', fontSize: 33 }} />
                    </label>
                    <input
                        style={{ display: 'none' }}
                        id="fileInput"
                        type="file"
                        multiple
                        onChange={handleFileInputChange}
                    />
                </div>
            )}

          <ScrollView  horizontal  showsHorizontalScrollIndicator={false}  >

        {images.map((image, index) => (
            <img key={index} src={image} alt={`Image ${index}`}   style={{ width : 200 , height : 200 , margin : 7}} />
        ))}
          </ScrollView>
        </div>}

      {sellOBuy ==='toBuy' && <Text> What are you Looking for </Text> }

  {!vehiMakeDsp && !vehicleTypeDsp && specproduct === "vehicles" && <ScrollView horizontal style={{ width : 240 , flexDirection: 'row' , height:40 , margin :10}} >
     <TextInput
          value={formData.mileage}
          placeholder="Mileage"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'mileage')}
          type="text" 
          style={{width : 75 , borderWidth : 1 , borderColor : 'black' , marginRight:8 , } }
        />
          <TextInput
          value={formData.year}
          placeholder="Year"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'year')}
          type="text" 
          style={{width : 75 , borderWidth : 1 , borderColor : 'black' , marginRight:8 , } }
        />
          <TextInput
          value={formData.engine}
          placeholder="Engine"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'engine')}
          type="text" 
          style={{width : 75 , borderWidth : 1 , borderColor : 'black' , marginRight:8 , }}
        />
          <TextInput
          value={formData.trans}
          placeholder="Trans"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'trans')}
          type="text" 
          style={{width : 75 , borderWidth : 1 , borderColor : 'black' , marginRight:8 , } }
        />
             <TextInput
          value={formData.fuel}
          placeholder="Fuel"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'fuel')}
          type="text" 
          style={{width : 75 , borderWidth : 1 , borderColor : 'black' , marginRight:8 , } }
        />
          
        </ScrollView>}


              <TouchableOpacity onPress={toggleBrandNew} style={ brandNew ? styles.bttonIsTrue : styles.buttonIsFalse} >
                <Text style={ brandNew ? {color:'white'} :null } >Brand New</Text>
              </TouchableOpacity>

        <TextInput
          value={formData.productName}
          placeholder="Product Name"
          placeholderTextColor="#6a0c0c"
          onChangeText={(text) => handlechange(text, 'productName')}
          type="text" 
          style={inputstyles.addIterms }
        />

    
   { specproduct !== "Sprovider" && <View style={{flexDirection:'row', alignItems : 'center'}}>   
     <TouchableOpacity onPress={toggleCurrency}>
        {currency ? <Text style={styles.buttonIsFalse} >USD</Text> :
         <Text style={styles.bttonIsTrue}>Rand </Text>}
      </TouchableOpacity>

        <TextInput
          placeholder="Price"
          type="text"
          onChange={handlechange}
          name="toLocation"
          value={formData.price}
          placeholderTextColor="#6a0c0c"
          style={inputstyles.addIterms }
          onChangeText={(text) => handlechange(text, 'price')}
        />
        
    </View>}

      { spinnerItem &&<ActivityIndicator size={34} />}
       
                
          {!vehicleTypeDsp&& !vehiMakeDsp && <TextInput 
            value={formData.productLoc}
            placeholderTextColor="#6a0c0c"
            placeholder="Additional Information"
            onChangeText={(text) => handlechange(text, 'productLoc')}
            type="text"
            style={inputstyles.addIterms }
          />}
          
             {!vehicleTypeDsp && !trailerTypeDsp && specproduct ==="vehicles" || specproduct ==="trailers" ? <View style={{margin : 8 , }} >
              <View style={{flexDirection:'row', marginBottom:5}} >
                <TouchableOpacity style={sellRent ? styles.bttonIsTrue : styles.buttonIsFalse} onPress={toggleSellRent} >
                  <Text style={sellRent ? {color:'white'} : {color:'black'} } > Sell </Text>
                </TouchableOpacity>

                <TouchableOpacity  style={!sellRent ? styles.bttonIsTrue : styles.buttonIsFalse} onPress={toggleSellRent} >
                  <Text style={!sellRent ? {color:'white'} : {color:'black'} } > Rent </Text>
                </TouchableOpacity> 
                </View>
               { <View>
                </View>}

              </View>
              :null}


              { specproduct === "vehicles" &&  <View style={{flexDirection:'row'}} >
                 { !vehicleTypeDsp && !vehiMakeDsp && <TouchableOpacity onPress={dspVehicleTypeDsp} style={!vehicleType ? {        
                  backgroundColor :"#6a0c0c",height : 30,justifyContent : 'center' , alignItems : 'center'  ,marginBottom: 15 ,borderRadius: 10 , paddingLeft: 7 , paddingRight  : 7
                    } : {
                  height : 30,justifyContent : 'center' , alignItems : 'center' ,marginBottom: 15 ,borderWidth: 2 ,borderColor:"#6a0c0c" ,borderRadius: 10 , paddingLeft: 7 , paddingRight  : 7
                    } } >
                    <Text style={!vehicleType ? {color :'white'}:null } > {vehicleType ? vehicleType : "vehicle type"}</Text>
                  </TouchableOpacity>}

                 {!vehiMakeDsp && !vehicleTypeDsp &&<TouchableOpacity onPress={toggleVehiMakeDsp} style={!vehiMake ? {        
                  backgroundColor :"#6a0c0c",height : 30,justifyContent : 'center' , alignItems : 'center'  ,marginBottom: 15 ,borderRadius: 10 , paddingLeft: 7 , paddingRight  : 7  , marginLeft:9
                    } : {
                  height : 30,justifyContent : 'center' , alignItems : 'center' ,marginBottom: 15 ,borderWidth: 2 ,borderColor:"#6a0c0c" ,borderRadius: 10 , paddingLeft: 7 , paddingRight  : 7 , marginLeft:5
                    } } >
                    <Text style={!vehiMake ? {color :'white'}:null } > {vehiMake ? vehiMake : "vehicle Make"} </Text>
                  </TouchableOpacity>}

                </View>}
                    {specproduct=== "trailers" && <View>
                      <TouchableOpacity onPress={toggleTrailerTypeDsp} style={!trailerType ? styles.buttonSelectStyle : styles.buttonStyle } >
                        <Text style={!trailerType ? {color :'white'}:null } >{trailerType ? trailerType  : "Trailer Type" } </Text>
                      </TouchableOpacity>

                     {trailerTypeDsp && <View>
                      <TouchableOpacity onPress={()=>addTrailerType("Bulktrailer")} style={styles.buttonStyle} >
                        <Text>Bulk trailer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("SideTipper")}  style={styles.buttonStyle} >
                        <Text>Side Tipper</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Tautliner")}  style={styles.buttonStyle} >
                        <Text>Tautliner</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Flatbed")}  style={styles.buttonStyle} >
                        <Text>Flatbed</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Tanker")}  style={styles.buttonStyle} >
                        <Text>Tanker</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Refrigerated")} style={styles.buttonStyle}  >
                        <Text>Refrigerated</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("CarHauler")}  style={styles.buttonStyle} >
                        <Text>Car Hauler </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("UtilityTrailer")} style={styles.buttonStyle}  >
                        <Text>Utility Trailer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("Lowboy")} style={styles.buttonStyle}  >
                        <Text>Lowboy</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>addTrailerType("otherTrailer")}  style={styles.buttonStyle} >
                        <Text>other</Text>
                      </TouchableOpacity>
                        </View>}
                    </View> }



                 { vehicleTypeDsp && <View>
                 { !heavyEquipment && <TouchableOpacity onPress={toggleCargoTrcks} style={styles.buttonSelectStyle} >
                    <Text style={{color:'white'}} >Cargo Trucks</Text>
                  </TouchableOpacity>}

                 { !cargoTrcks && <TouchableOpacity onPress={toggleHeavyEquipment} style={styles.buttonSelectStyle} >
                    <Text style={{color:'white'}}>Heavy Equipment </Text>
                  </TouchableOpacity>}

                 { heavyEquipment && <View> 
                    <TouchableOpacity onPress={()=>addVehicleType("Tipper")}  style={styles.buttonStyle} >
                      <Text>Tipper</Text>
                    </TouchableOpacity  >
                    <TouchableOpacity  onPress={()=>addVehicleType("Excavator")} style={styles.buttonStyle} >
                      <Text>Excavator</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("Bulldozer")} style={styles.buttonStyle} >
                      <Text>Bulldozer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("WheelLoader")}style={styles.buttonStyle}  >
                      <Text>Crane</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("truckhorse")} style={styles.buttonStyle} >
                      <Text>WheelLoader</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={()=>addVehicleType("Compactors")}style={styles.buttonStyle}  >
                      <Text>Compactors</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={()=>addVehicleType("Pavers")}style={styles.buttonStyle}  >
                      <Text>Pavers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("Graders")} style={styles.buttonStyle} >
                      <Text>Graders</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={()=>addVehicleType("TrackedLoader")} style={styles.buttonStyle} >
                      <Text>Tracked Loader</Text>
                    </TouchableOpacity>

                    <TouchableOpacity  onPress={()=>addVehicleType("ConcreteMixer")} style={styles.buttonStyle} >
                      <Text>Concrete Mixer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={()=>addVehicleType("otherHeavyB")} style={styles.buttonStyle} >
                      <Text>Other</Text>
                    </TouchableOpacity>
                    
                  </View>}
                 {cargoTrcks && <View>
                  <TouchableOpacity onPress={()=>addVehicleType("truckhorse")} style={styles.buttonStyle} >
                    <Text>truck horse</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("BoxTrucks")} style={styles.buttonStyle} >
                    <Text>Box Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("FlatbedTrucks")}style={styles.buttonStyle}  >
                    <Text>Flatbed Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("RefrigeratedTrucks")} style={styles.buttonStyle} >
                    <Text>Refrigerated Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("DumpTrucks")} style={styles.buttonStyle} >
                    <Text>Dump Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("TankerTrucks")}style={styles.buttonStyle}  >
                    <Text>Tanker Trucks</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>addVehicleType("CurtainsideTrucks")} style={styles.buttonStyle} >
                    <Text>Curtainside Trucks</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={()=>addVehicleType("ParcelVans")} style={styles.buttonStyle} >
                    <Text>Parcel Vans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("otherCargos")} style={styles.buttonStyle} >
                    <Text>Other</Text>
                  </TouchableOpacity>
                  </View>}

                 {!cargoTrcks&& !heavyEquipment&& <View>
                  <TouchableOpacity onPress={()=>addVehicleType("Sedans")} style={styles.buttonStyle} >
                    <Text>Sedans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("SUV")} style={styles.buttonStyle} >
                    <Text>SUV</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("PickupTrucks")} style={styles.buttonStyle} >
                    <Text>Pickup Trucks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Hatchbacks")} style={styles.buttonStyle} >
                    <Text>Hatchbacks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Vans")} style={styles.buttonStyle} >
                    <Text>Vans</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Convertibles")} style={styles.buttonStyle} >
                    <Text>Convertibles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("Crossovers")} style={styles.buttonStyle} >
                    <Text>Crossovers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>addVehicleType("otherVehicles")} style={styles.buttonStyle} >
                    <Text>other</Text>
                  </TouchableOpacity>
                  </View>}

                  </View>}

                  {vehiMakeDsp && <View>
                    {!heavyEquipmentMake && <TouchableOpacity style={styles.buttonSelectStyle} onPress={toggleCargoTrcksMake} >
                      <Text style={{color:'white'}}>Cargo Trucks</Text>
                    </TouchableOpacity>}

                   { !cargoTrcksMake&& <TouchableOpacity  style={styles.buttonSelectStyle} onPress={toggleHeavyEquipmentMake}>
                      <Text style={{color:'white'}} >Heavy Equipment</Text>
                    </TouchableOpacity>}

                    {heavyEquipmentMake && <View> 
                      <TouchableOpacity style={styles.buttonStyle}  onPress={()=>addVehiMake("heavyCaterpillar") } >
                        <Text>Caterpillar </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle}  onPress={()=>addVehiMake("heavyVolvo") }>
                        <Text>Volvo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle}  onPress={()=>addVehiMake("heavyJohnDeere") }>
                        <Text>John Deere</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("heavyHyundai") } >
                        <Text>Hyundai</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("heavySany") } >
                        <Text>Sany </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("heavyKobelco") } >
                        <Text>Kobelco </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("heavyXCMG") } >
                        <Text>XCMG</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("heavyBobcat") } >
                        <Text>Bobcat</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("heavyHitachi") } >
                        <Text>Hitachi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("heavyManitou") } >
                        <Text>Manitou</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("heavyKubota") } >
                        <Text>Kubota</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("heavyOtherM") } >
                        <Text>Other</Text>
                      </TouchableOpacity>
                    </View>}

                   {cargoTrcksMake && <View>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoMercedesBenz") }  >
                        <Text>Mercedes-Benz</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoMAN") } >
                        <Text>MAN</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoScania") } >
                        <Text>Scania </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoHowo") } >
                        <Text>Howo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoVolvo") } >
                        <Text>Volvo </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoDAF") } >
                        <Text>DAF </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoIveco") } >
                        <Text>Iveco </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoUD") } >
                        <Text>UD </Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoIsuzu") } >
                        <Text>Isuzu </Text>
                      </TouchableOpacity  >
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoMitsubishiFuso") } >
                        <Text>Mitsubishi Fuso</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoHino") } >
                        <Text>Hino</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("cargoOtherM") } >
                        <Text>other</Text>
                      </TouchableOpacity>
                    </View>}

                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("Toyota") }  >
                      <Text>Toyota</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("MercedesBenz") }  >
                      <Text>Mercedes-Benz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("BMW") }  >
                      <Text>BMW</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("Honda") }  >
                      <Text>Honda</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("NISSAN") }  >
                      <Text>NISSAN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("MAZDA") }  >
                      <Text>MAZDA</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("Volkswagen") }  >
                      <Text>Volkswagen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("Ford") }  >
                      <Text>Ford</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("Isuzu") }  >
                      <Text>Isuzu</Text>
                    </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("Chevrolet") }  >
                      <Text>Chevrolet</Text>
                      </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("Hyundai") }  >
                        <Text>Hyundai</Text>
                    </TouchableOpacity>
                      <TouchableOpacity  style={styles.buttonStyle} onPress={()=>addVehiMake("Renault") } >
                        <Text>Renault</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("Mitsubishi") }  >
                        <Text>Mitsubishi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("Kia") }  >
                        <Text>Kia</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.buttonStyle} onPress={()=>addVehiMake("otherMakes") }  >
                        <Text>other</Text>
                      </TouchableOpacity>
                  </View>}

        <TouchableOpacity onPress={handleSubmit} style={{backgroundColor : '#6a0c0c' , width : 70 , height : 30 , borderRadius: 5 , alignItems : 'center' , justifyContent : 'center', marginTop :6}} >

        <Text style={{color:'white'}} >submit</Text>

        </TouchableOpacity>
      
      </View>

  );
}


export default React.memo(AddToShop)

const styles = StyleSheet.create({
  
  buttonIsFalse : {
     borderWidth : 1 ,
     borderColor : '#6a0c0c' ,
     paddingLeft :4 , 
     paddingRight:4 ,
   } , 
    bttonIsTrue:{
    backgroundColor : '#6a0c0c' ,
     paddingLeft :4 ,
     paddingRight:4 ,
     color :'white' 
    } ,
       buttonStyle : {
        height : 30,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginBottom: 15 ,
        borderWidth: 2 ,
        borderColor:"#6a0c0c" ,
        borderRadius: 10
    } ,
    buttonSelectStyle :{
        backgroundColor :"#6a0c0c",
        height : 30,
        justifyContent : 'center' , 
        alignItems : 'center' ,
        width : 150 ,
        marginBottom: 15 ,
        borderRadius: 10

    }
});