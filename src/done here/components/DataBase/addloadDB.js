import React from "react";
import { db, auth } from "../config/fireBase";
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';

function AddLoadDB (displayAddLooads) {

  const [ username , setUsername] = React.useState('');

  React.useEffect(()=>{
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
  weed()
}, [])


  const loadsCollection = collection(db, "Loads");
  const [formData, setFormData] = React.useState({
    typeofLoad: "",
    contact: "",
    fromLocation: "",
    toLocation: "",
    ratePerTonne: "",
    paymentTerms: "",
    requirements: "",
    additionalInfo: "",
    date : ""
  });

  function handleTypedText(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value
      };
    });
  }
  
  

  const [userId, setUserId] = React.useState('');

  React.useEffect(() => {
    const fetchUserId = async () => {
      try {
        if (auth.currentUser) {
          setUserId(auth.currentUser.uid);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserId();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const docRef = await addDoc(loadsCollection, {
        userId: userId, // Add the user ID to the document
        companyName: username,
        typeofLoad: formData.typeofLoad,
        contact: formData.contact,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        ratePerTonne: formData.ratePerTonne,
        paymentTerms: formData.paymentTerms,
        requirements: formData.requirements,
        additionalInfo: formData.additionalInfo,
        DueDate : formData.date
      });

      setFormData({
        typeofLoad: "",
        contact: "",
        fromLocation: "",
        toLocation: "",
        ratePerTonne: "",
        paymentTerms: "",
        requirements: "",
        additionalInfo: "",
        date : ""

      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="addloadDBform" onSubmit={handleSubmit}>
      <label>type of load</label>
  <input
    onChange={handleTypedText}
    name="typeofLoad"
    value={formData.typeofLoad}
  />
<label>contact</label>
  <input 
    onChange={handleTypedText}
    name="contact"
    value={formData.contact}
  />
  <label>Due date</label>
     <input
      type="date"
      name="date"
      value={formData.date}
      onChange={handleTypedText}
    />
<label>from loacation</label>
  <input 
    onChange={handleTypedText}
    name="fromLocation"
    value={formData.fromLocation}
  />
  <label>to location</label>
  <input 
    onChange={handleTypedText}
    name="toLocation"
    value={formData.toLocation}
  />
  <label>rate per tonne</label>
  <input 
    onChange={handleTypedText}
    name="ratePerTonne"
    value={formData.ratePerTonne}
    type="text"
  />
<label>payment terms</label>
  <input
    onChange={handleTypedText}
    name="paymentTerms"
    value={formData.paymentTerms}
  />
  <label>requirements</label>
  <input 
    onChange={handleTypedText}
    name="requirements"
    value={formData.requirements}
  />

<label>Any additional info</label>
  <input 
    onChange={handleTypedText}
    name="additionalInfo"
    value={formData.additionalInfo}
  />

  <button className="submitINAddload">submit</button>

</form>
  );
}

export default AddLoadDB;
