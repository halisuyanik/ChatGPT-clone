'use client'
import { signOut, useSession } from "next-auth/react";
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, orderBy, query } from "firebase/firestore";
import NewChat from "./NewChat"
import { db } from "../firebase-config";
import ChatRow from "./ChatRow";

function SideBar() {
    const {data:session}=useSession();
    const [chats, loading, error]=useCollection(
        session && query(collection(db, 'users', session.user?.email!, 'chats'), orderBy("createdAt","asc"))
    );

    console.log(session)

  return (
    <div className="p-2 flex flex-col h-screen">
        <div className="flex-1">
            <div className="">
                <NewChat></NewChat>
                <div className=""> 
                    {chats?.docs.map((chat)=>(
                        <ChatRow key={chat.id} id={chat.id}></ChatRow>
                    ))}
                </div>
            </div>
        </div>
        {session && <img onClick={()=>signOut()} className="h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50" src={session.user?.image!} alt='profile pic'></img>
        }
    </div>
  )
}

export default SideBar