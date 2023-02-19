'use client'
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { useSession } from "next-auth/react"
import { FormEvent, useState } from "react"
import { db } from "../firebase-config"
import toast, { Toaster } from 'react-hot-toast';
type Props={
    chatId:string
}
function ChatInput({chatId}:Props) {
    const [prompt, setPrompt]=useState('');
    const {data:session}=useSession();
    const model="text-davinci-003"
    const sendMessage=async(e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(!prompt)return;
        const input =prompt.trim();
        setPrompt('');
        const message:Message={
            text:input,
            createdAt:serverTimestamp(),
            user:{
                _id:session?.user?.email!,
                name:session?.user?.name!,
                avatar:session?.user?.image! || `https://ui-avatars.com/api/?name=${session?.user?.name}`,

            }
        }
        await addDoc(collection(db, 'users', session?.user?.email!, 'chats', chatId, 'messages'),message)
        const notification=toast.loading('ChatGPT is thinking...')
        await fetch('/api/askQuestion',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                prompt:input, chatId, model, session
            }),
        }).then(()=>{
            toast.success('ChatGPT has responded',{
                id:notification,
            })
        })
    }
  return (
    <div className="justify-center flex  text-gray-400 rounded-lg text-sm ">
        <div className="lg:min-w-[48em]">
        <form onSubmit={sendMessage} className="p-5 space-x-5 flex">
            <div className="bg-[#40414F] flex  py-2 flex-grow md:py-3 md:pl-4 relative  rounded-md">
                <input disabled={!session} className="bg-transparent sm:ml-2 text-white focus:outline-none flex-1  disabled:cursor-not-allowed disabled:text-gray-300" value={prompt} onChange={(e)=>setPrompt(e.target.value)} type="text"/>
                <button disabled={!prompt || !session} 
                className=" hover:bg-gray-900 rounded-md mr-2 text-gray-500 bottom-1.5 md:bottom-2.5 p-1 md:right-2 right-1"
                type="submit">
                    <PaperAirplaneIcon className="h-4 w-4 -rotate-45 text-white"></PaperAirplaneIcon>
                </button>
            </div>
        </form>
        

        </div>
    </div>
  )
}

export default ChatInput