import {io} from 'socket.io-client'
export const socket = io("https://vercelback-production.up.railway.app/",{
     autoConnect : false,
}
   
);