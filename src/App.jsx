import { Route,Routes } from "react-router-dom"
import Signup from "./component/Signup"
import Login from "./component/Login"
import Dashboard from "./component/Dashboard"

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login/>} />
        <Route path="/Dashboard" element={<Dashboard/>} />
      </Routes>
    </>
  )
}

export default App
