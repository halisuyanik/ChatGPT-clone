"use client";
import { signOut, useSession } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import NewChat from "./NewChat";
import { db } from "../firebase-config";
import ChatRow from "./ChatRow";

import { useTheme } from "next-themes";

function SideBar() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [chats, loading, error] = useCollection(
    session &&
      query(
        collection(db, "users", session.user?.email!, "chats"),
        orderBy("createdAt", "asc")
      )
  );

  console.log(session);

  return (
    <div className="p-2 flex flex-col h-screen ">
      <div className="flex-1">
        <div className=" overflow-y-auto overflow-x-hidden max-h-[35em]">
          <NewChat></NewChat>
          {chats?.docs.map((chat) => (
            <ChatRow key={chat.id} id={chat.id}></ChatRow>
          ))}
        </div>
      </div>

      <div className="">
        {session && (
          <div>
            <a
              href="https://help.openai.com/en/collections/3742473-chatgpt"
              target="_blank"
              className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              Updates &amp; FAQ
            </a>
            <a
              onClick={() => signOut()}
              className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm"
            >
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="h-4 w-4"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>{" "}
              Log out
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default SideBar;
