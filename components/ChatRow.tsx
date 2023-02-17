
import { ChatBubbleLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../firebase-config";

type Props={
    id:string;
}
function ChatRow({id}:Props) {
    const pathname=usePathname();
    const router=useRouter();
    const {data:session}=useSession();
    const [active, setActive]=useState(false);

    const [messages]=useCollection(
        query(
            collection(db, 'users', session?.user?.email!, 'chats', id, 'messages'),
            orderBy('createdAt', 'asc')
        )
    );

    useEffect(()=>{
        if(!pathname) return;
        setActive(pathname.includes(id))
    },[pathname])
    
    const removeChat=async()=>{
        await deleteDoc(doc(db,'users', session?.user?.email!, 'chats', id))
        router.replace('/');
    }

  return (
    <Link href={`chat/${id}`} className={`chatRow justify-center
    ${active && 'bg-gray-700/50'}`}>
        <svg stroke="currentColor" className="h-4 w-4" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        <p className="flex-1 md:inline-flex truncate">
            {messages?.docs[messages?.docs.length-1]?.data().text || "New Chat"}
        </p>
        {active && (<svg  onClick={removeChat} className="h-4 w-4 hover:text-red-700" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"  height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>)}
    </Link>
  )
}

export default ChatRow