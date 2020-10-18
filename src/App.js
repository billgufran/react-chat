import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { FiSend } from "react-icons/fi";
import { VscSignOut } from "react-icons/vsc";
import "./App.css";

firebase.initializeApp({
	apiKey: "AIzaSyAWoBomyTlXViHcgdSPismGaKsADqAWGiI",
	authDomain: "react-chat-fbg.firebaseapp.com",
	databaseURL: "https://react-chat-fbg.firebaseio.com",
	projectId: "react-chat-fbg",
	storageBucket: "react-chat-fbg.appspot.com",
	messagingSenderId: "476271889747",
	appId: "1:476271889747:web:b3044620b0d7e0075ca5a6",
	measurementId: "G-7B1EYKXB0K",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
	const [user] = useAuthState(auth);

	return (
		<div className="App">
			<header>
				<div className="logo">ReactChat</div>
				<SignOut />
			</header>
			<section>{user ? <ChatRoom /> : <SignIn />}</section>
		</div>
	);
}

function SignIn() {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};

	return (
		<>
			<button className="sign-in" onClick={signInWithGoogle}>
				Sign in with Google
			</button>
		</>
	);
}

function SignOut() {
	return (
		auth.currentUser && (
			<button className="sign-out" onClick={() => auth.signOut()}>
				<VscSignOut />
			</button>
		)
	);
}

function ChatRoom() {
	const recentChat = useRef();
	const messagesRef = firestore.collection("messages");
	const query = messagesRef.orderBy("createdAt").limit(25);

	const [messages] = useCollectionData(query, {idField: "id"});
	const [formValue, setFormValue] = useState("");

	const sendMessage = async e => {
		e.preventDefault();
		const {uid, photoURL, displayName} = auth.currentUser;
		await messagesRef.add({
			text: formValue,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
			uid,
			photoURL,
			displayName,
		});

		setFormValue("");
		recentChat.current.scrollIntoView({behavior: "smooth"});
	};

	return (
		<>
			<main>
				{messages &&
					messages.map(msg => <ChatMessage key={msg.id} message={msg}/>)}
				<span ref={recentChat}></span>
			</main>
			<form onSubmit={sendMessage}>
				<input
					value={formValue}
					onChange={e => setFormValue(e.target.value)}
				/>
				<button type="submit" disabled={!formValue}>
					<FiSend />
				</button>
			</form>
		</>
	);
}

function ChatMessage(props) {
	const {text, uid, photoURL, displayName} = props.message;
	const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

	return (
		<>
			<div className={`message ${messageClass}`}>
				<img
					src={
						photoURL ||
						"https://api.adorable.io/avatars/23/abott@adorable.png"
					}
					alt="avatar"
				/>
				<p id="chat-bubble">{text}</p>
			</div>
			<div>{displayName}</div>
		</>
	);
}

export default App;