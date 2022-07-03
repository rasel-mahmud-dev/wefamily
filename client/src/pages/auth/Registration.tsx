import  React from "react";
import {Link} from "react-router-dom";
import api from "src/apis";
import Input from "UI/input/Input";
import {email, max, min, required, text, tuple, validate} from "src/utils/validator";
import Button from "UI/button/Button";
import Radio from "UI/input/Radio";
import errorResponse from "src/utils/errorResponse";
import Spin from "UI/spin/Spin";

const Registration = (props) => {
  
  const [errorMessage, setErrorMessage] = React.useState("")
  
  const [isPending, setPending] = React.useState(false)
  
  const [step, setStep] = React.useState(1)
  
  const [userData, setUserData] = React.useState({
    firstName: { value:"rasel", touch: false, errorMessage: "" },
    lastName: { value:"dev", touch: false, errorMessage: "" },
    email: { value:"rasel.code.dev@gmail.com", touch: false, errorMessage: "" },
    birthDay: { value:"2022-06-16", touch: false, errorMessage: "" },
    gender: { value:"", touch: false, errorMessage: "" },
    password: { value:"", touch: false, errorMessage: "" },
    confirmPassword: { value:"", touch: false, errorMessage: "" },
  })
  
  const schema = {
    firstName: {
      text: text(),
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
    gender: {
      tuple: tuple(["male", "female"]),
    },
    email: {
      email: email(),
      max: max(30),
      min: min(3),
      required: required(),
    },
    birthDay: {
      required: required(),
    },
     password: {
      max: max(30),
      min: min(3),
      required: required(),
    },
    confirmPassword: {
      max: max(30),
      min: min(3),
      required: required(),
    }

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
  
  function handleStepBack(){
    if(errorMessage) {
      setErrorMessage("")
    }
    setStep(1)
  }
  
  function handleSubmit(e){

    e.preventDefault && e.preventDefault()
    isPending && setPending(false)
    if(errorMessage) {
      setErrorMessage("")
    }
  
    let complete = true;
    for (const userDataKey in userData) {
      complete = !!(userData[userDataKey].touch && userData[userDataKey].value);
    }
  
    let valData: any = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      gender: userData.gender,
      birthDay: userData.birthDay
    }
    if(step !== 1){
      valData.password = userData.password
      valData.confirmPassword = userData.confirmPassword
    }
    
    let errors = validate("",valData, schema, false)
    
    
    let result = {
      ...userData
    }
  
    if(errors) {
      for (let errorsKey in errors) {
        result[errorsKey] = {
          value: userData[errorsKey].value,
          errorMessage: errors[errorsKey],
          touch: true
        }
      }
      return setUserData(result)
    }
    
    if(step === 2){
      if(userData.password.value !== userData.confirmPassword.value){
        setErrorMessage("password not matched")
        return;
      }
      setPending(true)
      api.post("/api/registration", {
        first_name: userData.firstName.value,
        last_name: userData.lastName.value,
        email: userData.email.value,
        gender: userData.gender.value,
        birthday: userData.birthDay.value,
        password: userData.password.value
      }).then(data=>{
        if(data.status === 201){
          setPending(false)
          // setStep(2)
          
          
        } else {
          setErrorMessage(data.data.message)
        }
  
      }).catch(ex=>{
        setPending(false)
        setErrorMessage(errorResponse(ex))
      })
    } else {
      setStep(2)
    }
    
  }
  
  function sendAccountActiveMail() {
    return (
      <div>
        <div>
          {/*<p className="para">We send a mail to <span className="text-blue-400">{userData.email.value}</span></p>*/}
          {/*<p className="para">please check your mailbox and click there to validate your mail</p>*/}
        
           <h4 className="font-medium mb-3 mt-4 text-gray-700">Next time login you can set a password</h4>
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
  
         <div>
           <Button type="button" onClick={handleStepBack} className="mr-2 bg-primary rounded-full px-8 py-1">Back</Button>
           <Button type="submit" className={["bg-primary rounded-full px-8 py-1", isPending ? "btn-disable": ""].join(" ")}>
             Registration</Button>
         </div>
          
        </div>
      </div>
    )
  }
  
  function basicInfo() {
    return (
      <div>
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
          label="Last Name"
          errorMessage={(userData.lastName.touch && userData.lastName.errorMessage) ? userData.lastName.errorMessage :  "" }
        />
  
  
        <Input
          onChange={handleChange}
          value={userData.birthDay.value}
          // placeholder="Enter First Name."
          name="birthDay"
          label="Date of Birthday"
          errorMessage={(userData.birthDay.touch && userData.birthDay.errorMessage) ? userData.birthDay.errorMessage :  "" }
          type="date"
        />
  
        <div className="mt-4 mb-3">
          <label className="font-medium min-w-100px mb-[5px] block text-base font-400 text-gray-dark-4" htmlFor="">Gender</label>
          <Radio
            onChange={handleChange}
            value={userData.gender.value}
            className="flex"
            // placeholder="Enter First Name."
            name="gender"
            label="female"
          />
    
          <Radio
            onChange={handleChange}
            value={userData.gender.value}
            className="flex"
            // placeholder="Enter First Name."
            name="gender"
            label="male"
          />
          <span className="input--error_message">{userData.gender.touch && userData.gender.errorMessage ? userData.gender.errorMessage :  "" }</span>
        </div>
        
        <div className="mt-2 mb-3">
          <h4 className="text-sm font-400">Already have a account?
            <span className="cursor-pointer text-blue-400 p-px ml-0.5 "><Link to="/auth/login">Click</Link></span>
            Login Page </h4>
        </div>
        <div>
          <Button type="submit" className="bg-primary rounded-full px-8 py-1">Continue</Button>
        </div>
      </div>
    )
  }
  
  return (
    <div>
      <div className="px-4">
  
        <div className="box rounded-lg max-w-4xl mx-auto">
          <div className="px-6 py-4  max-w-xl mx-auto rounded-xl">
          <h1 className="text-2xl font-medium  text-center">Create a new account.</h1>
          <form onSubmit={handleSubmit} className="py-5">
  
  
            {isPending && <div className="flex justify-center">
							<Spin size="small" />
						</div> }
            <p className="input--error_message open__error_message text-center bg-red-400/20"> {errorMessage && errorMessage}</p>
            
            
            <div>
              { step === 1 && basicInfo() }
              { step === 2 && sendAccountActiveMail() }
            </div>
            
          </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};


export default Registration;

/*
C+  2.50*4
F   2.00*4
D   2.00*4
C   2.25*4
C+  2.50*4
C   2.25*4
F   2.00*4
C   2.25*4
*/


// console.log( (((2.25 * 4) * 3 ) + ((2.50 * 4) * 2 )  + ((2.00 * 4) * 3) ) / 26 )
//
// let all = (2.63+2.67+2.98+2.97)
// console.log(all / 4)