import React, { useState, useEffect } from 'react';
// import Auth from './components/auth'  
import "./App.css"
import Header from "./components/Header";
import AddLoad from "./components/AddLoad";

import SideBar from "./components/SideBar";
import SideBarData from "./components/SideBarData";

import Tankers from "./components/pages/Tankers";

import LowBeds from "./components/pages/LowBeds";

import BulkTrailers from "./components/pages/BulkTrailers";

import SideTippers from "./components/pages/SideTippers";

import Tauntliners from "./components/pages/Taultliner";

import { auth, db, storage } from "./components/config/fireBase"
import { collection, getDocs, doc, updateDoc, addDoc, query, where , getDoc} from 'firebase/firestore';

import MiniLoad from './components/miniLoads';
import ThingsByUser from './components/ThingsByUser'

require('events').EventEmitter.defaultMaxListeners = 15;


function App(){  
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    // Check if user is already signed in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);
  
  
  let [sideBarNames , setSideBarName] = React.useState(SideBarData)
  
  
  
  const BulkTrailersDB = collection(db , "BulkTrailers")
  const [BulkTrailer , setBulkTrailer] = React.useState([])

  const getBulktrailers = async()=>{
    //read data 
    //set movieList 
    try{
      const data = await getDocs(BulkTrailersDB)
      const filteredData = data.docs.map((doc)=>({
        ...doc.data(),
        id : doc.id,
      }))

      setBulkTrailer(filteredData)
    }catch(err){
      console.error(err)
    }
  }
    
  
  React.useEffect(()=>{
    getBulktrailers()
  }, [])

    
  const LowBedsDB = collection(db , "LowBeds")
  let [ LowBed , setLowBeds] = React.useState([])

  const getLoBeds= async()=>{
    //read data 
    //set movieList 
    try{
      const data = await getDocs(LowBedsDB)
      const filteredData = data.docs.map((doc)=>({
        ...doc.data(),
        id : doc.id,

      }))

      setLowBeds(filteredData)
    }catch(err){
      console.error(err)
    }
  }
    
  
  React.useEffect(()=>{
    getLoBeds()
  }, [])

      
  const SideTipperDB = collection(db , "sideTippers")
  let [ SideTipper , setSideTipper] = React.useState([])

  const getSideTippers= async()=>{
    //read data 
    //set movieList 
    try{
      const data = await getDocs(SideTipperDB)
      const filteredData = data.docs.map((doc)=>({
        ...doc.data(),
        id : doc.id,
      }))

      setSideTipper(filteredData)
    }catch(err){
      console.error(err)
    }
  }
    
  
  React.useEffect(()=>{
    getSideTippers()
  }, [])

        
  const TankersDB = collection(db , "tankers")
  let [ tankers , setTanker] = React.useState([])

  const getTankers= async()=>{
    //read data 
    //set movieList 
    try{
      const data = await getDocs(TankersDB)
      const filteredData = data.docs.map((doc)=>({
        ...doc.data(),
        id : doc.id,
      }))


      setTanker(filteredData)
    }catch(err){
      console.error(err)
    }
  }
  React.useEffect(()=>{
    getTankers()
  }, [])

  const TaultlinerDB = collection(db , "tauntliner")
  let [ Taultliner , setTautliner] = React.useState([])

  const getTauntliner= async()=>{
    //read data 
    //set movieList 
    try{
      const data = await getDocs(TaultlinerDB)
      const filteredData = data.docs.map((doc)=>({
        ...doc.data(),
        id : doc.id,
      }))

      setTautliner(filteredData)
    }catch(err){
      console.error(err)
    }
  }
    
  
  React.useEffect(()=>{
    getTauntliner()
  }, [])

  function toggleSideBar (id){

    setSideBarName(prevName => {
      return prevName.map( oneName =>{
        return oneName.id === id ? {...oneName , state : true } : {...oneName , state : false}
             
      })
  })

  }

  function toggleTanker(id) {
    setTanker(prevTruck => {
      return prevTruck.map(oneTruck => {
        if (oneTruck.id === id) {
          const newLikeStatus = !oneTruck.like;
          const newRating = oneTruck.like ? oneTruck.rating - 1 : oneTruck.rating + 1;
          const docRef = doc(collection(db, "tankers"), id);
        updateDoc(docRef, {
            like: newLikeStatus,
            rating: newRating
          })
         
          return {
            ...oneTruck,
            like: newLikeStatus,
            rating: newRating
          };
        } else {
          return oneTruck;
        }
      });
    });
  }

  function toggleLowBed(id) {
    setLowBeds(prevTruck => {
      return prevTruck.map(oneTruck => {
        if (oneTruck.id === id) {
          const newLikeStatus = !oneTruck.like;
          const newRating = oneTruck.like ? oneTruck.rating - 1 : oneTruck.rating + 1;
          const docRef = doc(collection(db, "LowBeds"), id);
          updateDoc(docRef, {
            like: newLikeStatus,
            rating: newRating
          })
         
          return {
            ...oneTruck,
            like: newLikeStatus,
            rating: newRating
          };
        } else {
          return oneTruck;
        }
      });
    });
  }
  // function toggleBulkTrailer (id){
  //   setBulkTrailer(prevTruck => {
  //     return prevTruck.map( oneTruck =>{
  //       return oneTruck.id === id ? {...oneTruck , like : !oneTruck.like } : oneTruck
                
  //     })
  //   })
  // }


  function toggleBulkTrailer(id) {
    setBulkTrailer(prevTruck => {
      return prevTruck.map(oneTruck => {
        if (oneTruck.id === id) {
          const newLikeStatus = !oneTruck.like;
          const newRating = oneTruck.like ? oneTruck.rating - 1 : oneTruck.rating + 1;
          const docRef = doc(collection(db, "BulkTrailers"), id);
          updateDoc(docRef, {
            like: newLikeStatus,
            rating: newRating
          })
         
          return {
            ...oneTruck,
            like: newLikeStatus,
            rating: newRating
          };
        } else {
          return oneTruck;
        }
      });
    });
  }

  function toggleSideTipper(id) {
    setSideTipper(prevTruck => {
      return prevTruck.map(oneTruck => {
        if (oneTruck.id === id) {
          const newLikeStatus = !oneTruck.like;
          const newRating = oneTruck.like ? oneTruck.rating - 1 : oneTruck.rating + 1;
          const docRef = doc(collection(db, "sideTippers"), id);
          updateDoc(docRef, {
            like: newLikeStatus,
            rating: newRating
          })
         
          return {
            ...oneTruck,
            like: newLikeStatus,
            rating: newRating
          };
        } else {
          return oneTruck;
        }
      });
    });
  }

    function toggleTautliner(id) {
      setTautliner(prevTruck => {
        return prevTruck.map(oneTruck => {
          if (oneTruck.id === id) {
            const newLikeStatus = !oneTruck.like;
            const newRating = oneTruck.like ? oneTruck.rating - 1 : oneTruck.rating + 1;
            const docRef = doc(collection(db, "tauntliner"), id);
            updateDoc(docRef, {
              like: newLikeStatus,
              rating: newRating
            })
          
            return {
              ...oneTruck,
              like: newLikeStatus,
              rating: newRating
            };
          } else {
            return oneTruck;
          }
        });
      });
    }


    
    let trucks 

    const sideBarName = sideBarNames.map(oneName =>{
      
      
      {
        if (oneName.id === 1 && oneName.state === true){
          
 
           trucks = BulkTrailer.map(truck =>{ 
            return(
              < BulkTrailers
            liked = {truck.like }
            key = {truck.id}
            item = {truck}
            handleClick = {()=> toggleBulkTrailer(truck.id)}
            />     
          
            )
          })
          }    
          
           if (oneName.id === 3 && oneName.state === true){
            trucks = LowBed.map(truck =>{      
              
              return(
                <LowBeds
                liked = {truck.like}
                key = {truck.id}
                item = {truck}
                handleClick = {()=> toggleLowBed(truck.id)}
                />     
                
                )})                
              }
              else if (oneName.id === 4 && oneName.state === true){
                
                trucks = tankers.map(truck =>{      
                  
                  return(
                    <Tankers
                    liked = {truck.like}
                    key = {truck.id}
                    item = {truck}
                    handleClick = {()=> toggleTanker(truck.id)}
                    />     
                   )                  
              } )         
        }
        else if (oneName.id === 2 && oneName.state === true){
              
          trucks = SideTipper.map(truck =>{      
            
            return(
              <SideTippers
              liked = {truck.like}
              key = {truck.id}
              item = {truck}
              handleClick = {()=> toggleSideTipper(truck.id)}
              />     
               )                  
          } )         
      }
      else if (oneName.id === 5 && oneName.state === true){
              
        trucks = Taultliner.map(truck =>{      
          
          return(
            <Tauntliners
            liked = {truck.on}
            key = {truck.id}
            item = {truck}
            handleClick = {()=> toggleTautliner(truck.id)}
            />     
             )                  
        } )         
      }
      }         
      
        return (      
    
          <SideBar 
            key = {oneName.id}
            item = {oneName}
            handleClick = {() => toggleSideBar(oneName.id)}
          />
        )
      } )




      const sortRatingBulkTrailer = BulkTrailer.sort((a , b)=> b.rating -  a.rating)
      const topRatingsBulk = sortRatingBulkTrailer.slice(0 , 2)
       const     takeBestBulks = topRatingsBulk.map(Bulks => (
         <p className="ratingNames" key={ Bulks.id}>{Bulks.CompanyName}</p>) )
         
    const sortRatingLowBed = LowBed.sort((a , b)=> b.rating -  a.rating)
      const topRatingsLowbed = sortRatingLowBed.slice(0 , 2)
       const   takeBestLowbeds = topRatingsLowbed.map(Lowbed =>(
        <p className="ratingNames" key={Lowbed.id}>{Lowbed.CompanyName}</p>) )

      const sortRatingSideTipper = SideTipper.sort((a , b)=> b.rating -  a.rating)
      const topRatingSideTipper = sortRatingSideTipper.slice(0 , 2)
       const   takeBestSideTipper = topRatingSideTipper.map(sideTipper => (
      <p className="ratingNames" key={sideTipper.id}>{sideTipper.CompanyName}</p>) )

      const sortRatingTaultliner = Taultliner.sort((a , b)=> b.rating -  a.rating)
      const topRatingsTaultliner = sortRatingTaultliner.slice(0 , 2)
       const  takeBestTaultliner = topRatingsTaultliner.map(Taultliner => (
      <p className="ratingNames" key={Taultliner.id}>{Taultliner.CompanyName}</p>) )

      const sortRatingsTankers = tankers.sort((a , b)=> b.rating - a.rating)
      const topRatingsTanker = sortRatingsTankers.slice(0 , 2)
       const takeBestTanker = topRatingsTanker.map(bestTrucks => (
        <p className="ratingNames" key={bestTrucks.id}> {bestTrucks.CompanyName} </p>) )

        
       
      let [addLoad , setaddLoad] = React.useState(false)

      useEffect(() => {
        // document.body.style.paddingTop = addLoad ? '70px' : '250px'
        if(addLoad){
          document.body.style.paddingTop = '70px'
        }else if(allThingsByUser.length > 0) {
          document.body.style.paddingTop = '70px'
        }else{
          document.body.style.paddingTop = '250px'

        }

      }, [addLoad]);


      function toggleAddLoad(){
        setaddLoad(prevState => !prevState)
      }



      const [loadsList, setLoadsList] = useState([]);
      const [allThingsByUser, setAllThings] = useState([]);
      
      
      const mainLoadsCollection = collection(db, 'Loads');
      const loadsCollection = collection(db, 'Loads');
      
      const [mainLoadsList, setMainLoadsList] = useState([]);
  const getMainLoadsList = async () => {
    try {
      const data = await getDocs(mainLoadsCollection);
      const userIds = new Set(); // To keep track of unique user IDs

      const filteredData = [];

      data.docs.forEach((doc) => {
        const userId = doc.data().userId;

        // If we haven't processed an item for this user yet, add it to the filteredData array
        if (!userIds.has(userId)) {
          const item = {
            id: doc.id,
            companyName: doc.data().companyName,
            typeofLoad: doc.data().typeofLoad,
            fromLocation: doc.data().fromLocation,
            toLocation: doc.data().toLocation,
            ratePerTonne: doc.data().ratePerTonne,
            userId: userId,
          };

          filteredData.push(item);
          userIds.add(userId);
        }
      });

      setMainLoadsList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBio = async (userId) => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'Loads'), where('userId', '==', userId))
      );
      const userItems = querySnapshot.docs.map((doc) => doc.data());
      setAllThings(userItems);
    } catch (err) {
      console.error(err);
    }
  };

  const getLoadsList = async () => {
    try {
      const data = await getDocs(loadsCollection);
      const filteredData = data.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        companyName: doc.data().companyName,
        typeofLoad: doc.data().typeofLoad,
        fromLocation: doc.data().fromLocation,
        toLocation: doc.data().toLocation,
        ratePerTonne: doc.data().ratePerTonne,
      }));

      setLoadsList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMainLoadsList();
    getLoadsList();
  }, []);

  const handleClickOneData = (userId) => {
    fetchBio(userId);
  };

  useEffect(() => {
    document.body.style.paddingTop = allThingsByUser.length > 0 ? '70px' : '250px';
  }, [allThingsByUser]);

  
      function handleClick(id){
        setaddLoad(state => !state)        
        setLoadsList(prevLoad => {
          return prevLoad.map( oneLoad =>{
            return oneLoad.id === id ? { ...oneLoad ,  backgroundColor: "green" }  :  oneLoad         
        })
        })
      }

      function handleClick(id) {
        setaddLoad(state => !state);
      
        setLoadsList(prevLoad => {
          const updatedLoadList = prevLoad.map(oneLoad => ({
            ...oneLoad,
            backgroundColor: oneLoad.id === id ? "#F2F2F2" : "#EDEDED"
          }));
      
          const sortedLoadList = updatedLoadList.sort((a, b) => a.backgroundColor === "#F2F2F2" ? -1 : b.backgroundColor === "#F2F2F2" ? 1 : 0);
      
          return sortedLoadList;
        });
      }
      
      const [currentUserLoads, setCurrentUserLoads] = React.useState([]);

      const fetchLoads = async () => {
        try {
          if (auth.currentUser) {
            const userId = auth.currentUser.uid;
            const loadsQuery = query(collection(db, "Loads"), where("userId", "==", userId));
            const querySnapshot = await getDocs(loadsQuery);

            const loadedLoads = [];
            querySnapshot.forEach((doc) => {
              const dataWithId = { id: doc.id, ...doc.data() };
              loadedLoads.push(dataWithId);
            });

            setCurrentUserLoads(loadedLoads);
          }
        } catch (err) {
          console.error(err);
        }
      };

      React.useEffect(() => {
        fetchLoads();
      }, [currentUser]);


     
       

      let miniLoad
    

      if(addLoad === true){  
        trucks = loadsList.map(load => {

          return(           
            <AddLoad
              item = {load}
              backgroundColor = {load.backgroundColor}
            />
          )
        })
      }else if(allThingsByUser.length > 0 ){
        trucks = allThingsByUser.map((item)=>{
          return(
          <ThingsByUser
            item = {item}
            allThingsByUser = {setAllThings}            
          />
          )
        })      
      }else {         
         miniLoad = mainLoadsList.map((item) => {
          return (
            <MiniLoad
              key={item.id}
              item={item}
              handleClickOneData={() => fetchBio(item.userId)}
              handleClickWholeDiv = {()=>handleClick(item.id) }
            />
          );
        });     
      }    
     
        const allData = [  ...loadsList]
          

        const [filteredData, setFilteredData] = React.useState([]);
        const [wordEntered, setWordEntered] = React.useState("");
      
        const handleFilter = (event) => {
          const searchWord = event.target.value;
          setWordEntered(searchWord);
          const newFilter = allData.filter((value) => {
            return ( value.companyName ||  value.fromLocation || value.toLocation ).toLowerCase().includes(searchWord.toLowerCase());
          });
      
          if (searchWord === "") {
            setFilteredData([]);
          } else {
            setFilteredData(newFilter);
          }
        };
        const clearInput = () => {
          setFilteredData([]);
          setWordEntered("");
        };
        
        const displaySearched =  filteredData.slice(0, 15).map((value , key)=>{
            return(
              <div className="dataItem">
              <div className='wordsSearched' >{value.companyName} </div>
              <div  className='wordsSearched' >from {value.fromLocation } </div>
              <div className='wordsSearched' >to {value.toLocation  } </div>
              </div>
            )
          })
          const [ username , setUsername] = React.useState('');

            const weed = async () => {
              try {
                if (auth.currentUser) {
                  const userId = auth.currentUser.uid;
        
                  const docRef = doc(db, 'usernames', userId);
                  const docSnap = await getDoc(docRef);
                  if (docSnap.exists()) {
                    setUsername(docSnap.data().username);
                  }
                }
              } catch (err) {
                console.error(err);
              }
            };
            React.useEffect(()=>{
              weed()
            }, [currentUser])

    return(
    <body>

                
      <div>
      <div>
      <Header
        addLoadState ={toggleAddLoad}
        addBulkTrailer ={ getBulktrailers}
        addSideTippers = { getSideTippers}
        handleFilter = {handleFilter}
        username = {username}
        currentUserLoads = {currentUserLoads}
       sideBar = {
          <aside className="sise-bar">
          <div className="all-names" >

              <p className="bulkavai">Available</p>
              <p className="sideTipperavai">Available</p>
              <p className="lowbedavai">Available</p>
              <p className="tankeravai">Available</p>
              <p className="tauntlineAvai">Available</p>

             <div className="BulkAmnt">{BulkTrailer.length}</div>
             <div className="SideTipperAmnt">{SideTipper.length}</div>
              <div className="lowBedAmnt">{LowBed.length}</div>
             <div className="TankerAmnt">{tankers.length}</div>
             <div className="tauntlinerAmnt">{Taultliner.length}</div>

          {sideBarName} 
          </div>
          <h3 className="most-reviewd">Most reviewed</h3>

            {takeBestBulks}
            {takeBestSideTipper}
            {takeBestLowbeds}
            {takeBestTanker}  
            {takeBestTaultliner}
          
          </aside>
        }
      />      { filteredData.length > 0 && (
              <div className='displaySearched' >
              {displaySearched}
             </div>
              )
              }

      <div className='miniloads'>
        {miniLoad}
        </div>
      <section className="Main-grid"> 
        {trucks}
      
      </section>
      </div>
      </div>            
       
      </body>
       )
      }

export default App

