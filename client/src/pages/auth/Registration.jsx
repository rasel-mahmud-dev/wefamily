import  React, {useEffect} from "react";
import {Link} from "react-router-dom";
import api from "src/apis";

const Registration = (props) => {
  
  const [userData, setUserData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  
  
  function handleChange(e){
    setUserData({
      ...userData,
      [e.target.name]: e.target.value.trim()
    })
  }
  function handleSubmit(e){
    e.preventDefault()
    let complete = true;
    for (const userDataKey in userData) {
      if(!userData[userDataKey]){
        complete = false
      }
    }
    if(complete){
      if(userData.password !== userData.confirmPassword){
        alert("password not matched")
        return;
      }
      api.post("/api/registration", {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
      }).then(data=>{
        console.log(data)
      })
    }
  }
  
  return (
    <div>
      <div className="container">
        
        <div className="bg-white px-6 py-4 rounded-5 max-w-xl mx-auto">
          <h1 className="text-2xl font-400 text-primary text-center">Create a new account.</h1>
          <form onSubmit={handleSubmit} className="py-5">
            
            <div className="flex mb-2 ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4" htmlFor="">First Name</label>
              <input
                value={userData.firstName}
                onChange={handleChange}
                placeholder="Enter Your First Name."
                className="input-item" type="text" name="firstName" />
            </div>
  
            <div className="flex mb-2 ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4" htmlFor="">Last Name</label>
              <input
                value={userData.lastName}
                onChange={handleChange}
                placeholder="Enter Your Last Name."
                className="input-item " type="text" name="lastName" />
            </div>
            
            <div className="flex mb-2 ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4" htmlFor="">Email</label>
              <input
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter Your Email."
                className="input-item "
                type="email" name="email" />
            </div>
            <div  className="flex mb-2 ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4 " htmlFor="">Password</label>
              <input
                value={userData.password}
                onChange={handleChange}
                placeholder="Enter Your Password."
                className="input-item "
                type="text" name="password"
              />
            </div>
            <div  className="flex mb-2 ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4" htmlFor="confirmPassword">Confirm Password</label>
              <input
                value={userData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter Your Password."
                className="input-item "
                type="text" name="confirmPassword"
              />
            </div>
            <div className="mt-2 mb-3">
              <h4 className="text-sm font-400">Already have a account?
                <span className="cursor-pointer text-blue-400 p-px ml-0.5 "><Link to="/auth/login">Click</Link></span>
                Login Page </h4>
  
            </div>
            <div>
              <button className="bg-primary px-4 py-1.5 rounded-2 text-sm text-white cursor-pointer">Registration</button>
            </div>
          </form>
        </div>
      
      </div>
    </div>
  );
};

export default Registration;