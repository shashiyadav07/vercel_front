import "./Dashboard.css";
import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useLocation } from "react-router-dom";
import { use } from "react";
function Dashboard() {
  const [msg,setMsg]=useState('')
   const location = useLocation()
   const user = location.state?.user
   const [onlineUser,setOnlineUser]= useState([])
   const [contactUser,setContactUser] = useState({})
   const [roomId,setRoomId] = useState("")
  //  const [button,setButton] = useState("Follow")
  //  const [userName,setUserName]=useState('')
   const [message,setMessage] = useState({})
    const [followStatus, setFollowStatus] = useState({});
   const [selectedUser,setSelectedUser] = useState(null)
  //  const flowControl = ()=>{
  //   setMessage([])
  //  }
   const handleMsg=(e)=>{
     e.preventDefault();
     console.log(typeof roomId);
console.log(roomId);
if (!selectedUser) {
        alert("Please select a user first.");
        return;
    }

    if (!msg.trim()) {
        alert("Message cannot be empty.");
        return;
    }
    socket.emit("private-msg",{
      receiverSocketId:selectedUser?.socketId,
       sender_id: user._id,
      reciver_id: selectedUser?.userId,
      roomId:roomId,
      message: msg,
      username : user.username,
      profilePic: user.profilePic,
       createdAt: new Date().toISOString(),
    })
    console.log(selectedUser?.socketId)
    setMessage((prev) => ({
  ...prev,
  [roomId]: [
    ...(prev[roomId] || []),
    {
      roomId,
      sender_id: user._id,
      reciver_id: selectedUser?.userId,
      receiverSocketId: selectedUser?.socketId,
      message: msg.trim(),
      username: user.username,
      profilePic: user.profilePic,
      createdAt: new Date().toISOString(),
    },
  ],
}));
    setMsg('')
   }
  useEffect(() => {
  socket.connect();

  const onConnect = () => {
    console.log("Connected:", socket.id);

    socket.emit("contactData", user._id);
    socket.emit("followData", user._id);
    socket.emit("userData", {
      _id: user._id,
      username: user.username,
      profilePic: user.profilePic,
    });
  };

  socket.on("connect", onConnect);

  return () => {
    socket.off("connect", onConnect);
  };
}, []);
  useEffect(() => {
  const handleFollowData = (data) => {
    const status = {};

    data.forEach((item) => {
      status[item.follow_id] = item.status;
    });

    setFollowStatus(status);
  };

  socket.on("followData", handleFollowData);

  return () => {
    socket.off("followData", handleFollowData);
  };
}, []);
  useEffect(() => {
  socket.on("contactData", (contacts) => {
    setContactUser({
      [user._id]: contacts,
    });
  });

  return () => {
    socket.off("contactData");
  };
}, [user]);
  useEffect(()=>{
    socket.on('online-user',(user)=>{
      setOnlineUser(user)
    });
  },[] )
  const [userCount,setUserCount] = useState(0)
  //  const [userData,setUserData] = useState([])
   useEffect(()=>{
    // setUserData([user])
    
     socket.on('client',(count)=>{
        setUserCount(count)
    });
   },[user])
  useEffect( ()=>{
    socket.on("unfollow_request", (data) => {
  setFollowStatus((prev) => ({
    ...prev,
    [data.sender_id]: "Follow",
  }));
socket.emit('delete_data', {
  owner_id : user._id,
  userId : data.sender_id
})
  setContactUser((prev) => ({
    ...prev,
    [user._id]: (prev[user._id] || []).filter(
      (contact) => contact.userId !== data.sender_id
    ),
  }));
  socket.emit('unfollow',{
    owner_id : user._id,
    unfollow_id : data.sender_id,
    status: 'Follow'
  })
});
  },[])
   useEffect(()=>{
    socket.on("Accept_request",(data)=>{
      console.log("accept request data :",data);
      setFollowStatus( (prev)=>({
        ...prev,
        [data.userId]: "unfollow"
      }))
      setContactUser( (prev)=>({
      ...prev,
      [user._id]:[...(prev[user._id] || []),
      data
    ]
    }))
    socket.emit('saveContact2',{
      owner_id: user._id,
      contact:data
    })
   socket.emit('follow_accept',{
  owner_id: user._id,
  accept_by: data.userId,
  status:'unfollow'
})
    })
    
   },[])
  useEffect(() => {
 socket.on("contact_request", (data) => {
  console.log("Contact request received in frontend:", data);
    setFollowStatus(prev => ({
        ...prev,
        [data.sender_id]: "Accept",
    }));
    socket.emit('accept_follow_request',{
  owner_id: data.reciver_id,
  reciver : data.sender_id,
  status : 'Accept'
})
});

}, []);
   const[id,setId]=useState("")

   const handelContact = (client,e)=>{
   if (e.target.value === "Follow") {
  setFollowStatus(prev => ({
    ...prev,
    [client.userId]: "following"
}));
socket.emit('follow_status', {
  owner_id: user._id,
  follow_id:client.userId,
  status:"following"
})
    socket.emit('contact_request',{
      sender_id: user._id,
      reciver_id: client.userId,
      sender_name: user.username,
      profilePic: client.profilePic,
      reciver_name: client.username,
      socketId: client.socketId
    })
  } else if(e.target.value === "Accept"){
    setFollowStatus( (prev)=>({
      ...prev,
      [client.userId]: "unfollow"
    }))
    socket.emit('accept_status',{
      owner_id: user._id,
      accept_for: client.userId,
      status: 'unfollow'
    })
     socket.emit('Accept_request', 
      {
      sender_id: user._id,//jo req accept kar raha hai
      // reciver_id: client.userId,// jiska req accept ho raha hai
      sender_name: user.username,//jo req accept kar raha hai
      profilePic: user.profilePic,//jo req accept kar raha hai
      // reciver_name: client.username,// jiska req accept ho raha hai
      socketId: client.socketId//jiska req accept ho raha hai
    }
     )
   setContactUser((prev) => ({
  ...prev,
  [user._id]: [
    ...(prev[user._id] || []),
    client,
  ],
}));
socket.emit('saveContact',{
  owner_id: user._id,
  contact: client
})
  }else if (e.target.value === "unfollow") {
  setFollowStatus(prev => ({
    ...prev,
    [client.userId]: "Follow"
}));
socket.emit('unfollow',{
  owner_id : user._id,
  unfollow_id: client.userId,
  status : 'Follow'
})
setContactUser((prev)=>({
  ...prev,
  [user._id]: [...(prev[user._id] || []).filter(
    (contact)=> contact.userId !== client.userId
  )]
}))
    socket.emit('unfollow_request',
      {
      sender_id: user._id,
      reciver_id: client.userId,
      sender_name: user.username,
      profilePic: client.profilePic,
      reciver_name: client.username,
      socketId: client.socketId
    }
    )
  }
    
   }
   
  const slectedId = (client)=>{
     setSelectedUser(client)
     console.log(client)
     socket.emit('createRoom',{
      sender_id: user._id,
      reciver_id: client.userId
     })
    //  flowControl()
    //  socket.emit('privateMessage', {
    //   sender_id: user._id,
    //   reciver_id: client._id,
    //   recevier: client.socketId,
    //   sender: me,
    //  })
  }
  useEffect(() => {
  const handleChatData = ({ roomId, messages }) => {
    setMessage((prev) => ({
      ...prev,
      [roomId]: messages,
    }));
  };

  socket.on("chatData", handleChatData);

  return () => {
    socket.off("chatData", handleChatData);
  };
}, []);
 useEffect(() => {
  const handleRoomCreated = ({ roomId }) => {
    setRoomId(roomId);
    socket.emit("chatData", { roomId });
  };

  socket.on("roomCreated", handleRoomCreated);

  return () => {
    socket.off("roomCreated", handleRoomCreated);
  };
}, []);
  useEffect(() => {
  const handleReceive = (data) => {
    console.log("Received message:", data);
    setMessage((prev) => ({
      ...prev,
      [data.roomId]: [
        ...(prev[data.roomId] || []),
        data,
      ],
    }));
  };

  socket.on('recive-msg', handleReceive);

  return () => {
    socket.off('recive-msg', handleReceive);
  };
}, []);
// console.log(userData)
  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="contacts">
            <h1>user online:{userCount}</h1>
           {
  onlineUser.map((userOnline) =>
    userOnline.userId !== user._id ? (
      <div className="user-card" key={userOnline.socketId}>
        <img
          className="user-avatar"
          src={
            userOnline.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Profile"
        />

        <button
          className="user-btn"
          onClick={() => slectedId(userOnline)}
        >
          {userOnline.username}
        </button>

        <input
          type="submit"
          value={followStatus[userOnline.userId] || "Follow"}
          onClick={(e) => handelContact(userOnline, e)}
          className="contact-btn"
        />
      </div>
    ) : null
  )
}
      </div>
      <div className="save_contacts">
        <h1>Saved Contacts</h1>


          {(contactUser[user._id] || []).map((userOnline) => (
  <div className="user-card" key={userOnline.socketId}>
    <img
      className="user-avatar"
      src={
        userOnline.profilePic ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }
      alt="Profile"
    />

    <button
      className="user-btn"
      onClick={() => slectedId(userOnline)}
    >
      {userOnline.username}
    </button>
  </div>
))}


      </div>
      </div>
      

      <div className="chat-board">

        <div className="chat-header">
  <div className="chat-logo">
    Chat App
  </div>

  <div className="chat-user">
    <img
      className="user-avatar"
      src={
        selectedUser?.profilePic ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
      }
      alt="Profile"
    />

    <div className="user-info">
      <h4>{selectedUser?.username}</h4>
      <span>Online</span>
    </div>
  </div>
</div>

  <div id="messages">
   {
    message[roomId]?.map((item,index)=>(
       <p
    key={index}
   className={
  item.sender_id === user._id
    ? "sent"
    : "received"
}
  >
    {item.message}
    {item.receiverSocketId !== selectedUser?.socketId ? (
  <span className="username">{item.username}</span>
) : null}
   
  </p>
    ) )
   }
  </div>

    <form action="" method="post" onSubmit={handleMsg} id="input-box"> 
      <input type="text" value={msg} onChange={(e)=>setMsg(e.target.value)} placeholder="type a message...."/>
    <button type="submit" >Send</button>
</form>

      </div>
    </div>
  );
}

export default Dashboard;