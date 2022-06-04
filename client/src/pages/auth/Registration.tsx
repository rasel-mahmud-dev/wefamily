import  React from "react";
import {Link} from "react-router-dom";
import api from "src/apis";
import Input from "UI/input/Input";
import {email, max, min, required, text, validate} from "src/utils/validator";
import Button from "UI/button/Button";

const Registration = (props) => {
  
  const [userData, setUserData] = React.useState({
    firstName: { value:"", touch: false, errorMessage: "" },
    lastName: { value:"", touch: false, errorMessage: "" },
    email: { value:"", touch: false, errorMessage: "" },
    password: { value:"", touch: false, errorMessage: "" },
    confirmPassword: { value:"", touch: false, errorMessage: "" },
  })
  
  const schema = {
    firstName: {
      email: text(),
      max: max(50),
      min: min(3),
      required: required(),
    },
    lastName: {
      text: text(),
      max: max(30),
      min: min(3),
      required: required(),
    },
    email: {
      text: email(),
      max: max(30),
      min: min(3),
      required: required(),
    },
     password: {
      text: text(),
      max: max(30),
      min: min(3),
      required: required(),
    },
    confirmPassword: {
      text: text(),
      max: max(30),
      min: min(3),
      required: required(),
    },
    
  }
  
  function handleChange(e: any){
    const {name, value} = e.target
    let error = validate(name, value, schema)
    let a = {
      ...userData,
      [name]: {
        value,
        touch: true,
        errorMessage: error ? error[name] : ""
      }
    }
    setUserData(a)
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
      <div className="sm:px-0 px-4">
  
        <div className="box rounded-lg max-w-4xl mx-auto">
          <div className="px-6 py-4  max-w-lg mx-auto rounded-xl">
          <h1 className="text-2xl font-medium  text-center">Create a new account.</h1>
          <form onSubmit={handleSubmit} className="py-5">
            
            <Input
              onChange={handleChange}
              value={userData.firstName.value}
              // placeholder="Enter First Name."
              name="firstName"
              label="First Name"
              errorMessage={(userData.firstName.touch && userData.firstName.errorMessage) ? userData.firstName.errorMessage :  "" }
            />
  
            <Input
              onChange={handleChange}
              value={userData.lastName.value}
              // placeholder="Enter First Name."
              name="lastName"
              label="First Name"
              errorMessage={(userData.lastName.touch && userData.lastName.errorMessage) ? userData.lastName.errorMessage :  "" }
            />
  
            <Input
              onChange={handleChange}
              value={userData.email.value}
              // placeholder="Enter First Name."
              name="email"
              label="Email"
              errorMessage={(userData.email.touch && userData.email.errorMessage) ? userData.email.errorMessage :  "" }
            />
            <Input
              onChange={handleChange}
              value={userData.password.value}
              // placeholder="Enter Password."
              name="password"
              type="password"
              label="Password"
              errorMessage={(userData.password.touch && userData.password.errorMessage) ? userData.password.errorMessage :  "" }
            />
            <Input
              onChange={handleChange}
              value={userData.confirmPassword.value}
              type="password"
              // placeholder="Confirm Password."
              name="confirmPassword"
              label="Confirm Password"
              errorMessage={(userData.confirmPassword.touch && userData.confirmPassword.errorMessage) ? userData.confirmPassword.errorMessage :  "" }
            />
            
            
            <div className="mt-2 mb-3">
              <h4 className="text-sm font-400">Already have a account?
                <span className="cursor-pointer text-blue-400 p-px ml-0.5 "><Link to="/auth/login">Click</Link></span>
                Login Page </h4>
            </div>
            <div>
              <Button type="submit" className="bg-primary rounded-full px-8 py-1">Registration</Button>
            </div>
          </form>
        </div>
        </div>
      
      </div>
    </div>
  );
};

export default Registration;