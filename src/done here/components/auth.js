import React from "react";
import { auth, googleProvider } from "./config/fireBase";
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import googlePic from '../public/images/icons/google.svg';
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./config/fireBase";

function Auth() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [signedIn, setSignedIn] = React.useState(false);

  const signIn = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      setSignedIn(true);
      // Prompt user to enter a username and save it to the database
      const inputUsername = prompt('Please enter your username:');
      if (inputUsername) {
        setUsername(inputUsername);
        await setDoc(doc(db, 'usernames', cred.user.uid), { username: inputUsername });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if the user already has a username
      const usernameDoc = await getDoc(doc(db, 'usernames', user.uid));
      if (!usernameDoc.exists()) {
        // Prompt user to enter a username and save it to the database
        const username = prompt('Please enter your username:');
        if (username) {
          setUsername(username);
          await setDoc(doc(db, 'usernames', user.uid), { username: username });
        }
      }

      setSignedIn(true);
      // Additional code or actions after successful sign-in
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="makeBackgroundColor">
      <div className="authDiv">
        <h1>WELCOME TO TRUCKERZ</h1>
        <h3>ALL LOADS AND TRUCKS CONNECTED</h3>
        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="singIN"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="singIN"
        />

        {signedIn ? (
          <input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : null}

        <button onClick={signIn} className="singInButton">Sign In</button>

        <button onClick={signInWithGoogle} className="googleButton">
          <img src={googlePic} height="35px" alt="Google" />
        </button>
      </div>
    </div>
  );
}

export default Auth;