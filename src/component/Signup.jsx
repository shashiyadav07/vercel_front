import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

function Signup() {
  const navigate = useNavigate();

  const [photo,setPhoto] = useState(null)
  const [loading,setLoading] = useState(false)

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const handleChange = (e)=>{
    setData({...data,[e.target.name]:e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

setLoading(true);
    if (!data.name || !data.email || !data.password) {
      setMessage("All fields are required");
      return;
    }
    const formData = new FormData();
    formData.append('name',data.name)
    formData.append('email',data.email)
    formData.append('password',data.password)
    formData.append('profilePic',photo)

    try {
      const res = await fetch("https://vercelback-production.up.railway.app/signup", {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json"
        // },
        body: formData,
      });
      const result = await res.json();
      console.log(result);

     if (result.success) {
  localStorage.setItem("user", JSON.stringify(result));
  navigate("/");
} else {
        setMessage(result.message);
      }
    } catch (err) {
      setMessage("Server error");
      console.log(err);
    }finally {
  setLoading(false);
}
  }; 

  return (
    <>
      <div className="login-container">
        <h1>Sign-up</h1>
        {message && <h1>{message}</h1>}

        <form onSubmit={handleSubmit}>
        <label htmlFor="photo">Profilr_Pic</label>
        <input
        type="file"
        accept="image/*"
        onChange={(e)=>setPhoto(e.target.files[0])}/>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            value={data.name}
            onChange={handleChange}
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={data.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={data.password}
            onChange={handleChange}
          />

          <input type="submit"  disabled={loading} value={loading ? "Signing Up..." : "Sign Up"} />
        </form>
        <div className="signup-link">
          <Link to="/">Login</Link>
        </div>
      </div>
    </>
  );
}

export default Signup;