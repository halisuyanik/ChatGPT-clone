'use client';
import { collection, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react"
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase-config";
import Message from "./Message";
import {BoltIcon, ExclamationTriangleIcon, SunIcon} from "@heroicons/react/24/outline";
import HomePage from "../app/page";

type Props={
    chatId:string
}
function Chat({chatId}:Props) {

  const {data:session}=useSession();
  const [messages]=useCollection(session && query(
    collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  ));
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {messages?.empty &&(<HomePage></HomePage>)}
      {messages?.docs.map((message)=>(
        <Message key={message.id} message={message.data()}></Message>
      ))}
    </div>
  )
}

export default Chat