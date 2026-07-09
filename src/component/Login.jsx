import { useState} from "react";
// import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./login.css";
// import { useLocation } from "react-router-dom";

function Login() {
    const navigate = useNavigate()
    // const location = useLocation();
   const user = JSON.parse(localStorage.getItem("user"));

const [data, setData] = useState({
  email: user?.email || "",
  password: "",
});
//  const [userData,setUserData]=useState({})
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  const res = await fetch('https://vercel-back-eight.vercel.app/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  console.log(result);

  if (result.success) { 
    navigate('/Dashboard',{
      state:{
        user : {
          _id: result._id,
          profilePic: result.profilePic,
          username: result.name
        }
      }
    });
  } else {
    alert(result.message);
    navigate('/signup');
  }
};
  // const userData = ()=>
  //   const userRes = fetch("http://localhost:4000/user-data/")
  // }
//   useEffect(() => {
//   const handleLoginRes = (res) => {
//     if (res.success === false) {
//       console.log("Email or password are incorrect");
//     } else {
//       navigate("/Dashboard");
//     }
//   };

//   socket.on("loginRes", handleLoginRes);

//   return () => {
//     socket.off("loginRes", handleLoginRes);
//   };
// }, [navigate]);

  return (
    <>
      <div className="login-container">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <img src={user?.profilePic ||"https://cdn-icons-png.flaticon.com/512/149/149071.png"}alt="Profile"/>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={handleChange}
          />

          <input type="submit" value="Login"/>
        </form>
        <div className="signup-link">
          <Link to="/signup">Create Account</Link>
        </div>
      </div>
    </>
  );
}

export default Login;