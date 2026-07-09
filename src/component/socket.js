import {io} from 'socket.io-client'
export const socket = io("https://vercel-back-eight.vercel.app/",{
     autoConnect : false,
}
   
);