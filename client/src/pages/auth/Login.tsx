import React, {FC} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux"
import Input from "UI/input/Input";
import Button from "UI/button/Button";

import {email, max, min, required, text, validate} from "src/utils/validator";

import apis from "src/apis";
import {ActionTypes} from "store/types/ActionTypes";
import {LoginAction} from "store/types/AuthReducerType";
import errorResponse from "src/utils/errorResponse";
import Spin from "UI/spin/Spin";


type Props = {
  afterRedirect?: string
}


const Login:FC<Props> = (props) => {
  
  // const schema = Joi.object({
  //   email: Joi.string().min(3).max(30).required(),
  //   password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  // })

  const a = "ASD"
  console.log(a)

  const [isPending, setPending] = React.useState(false)
  
  const {afterRedirect} = props
  
  let navigate = useNavigate()
  
  const dispatch = useDispatch()
  
  const [errorMessage, setErrorMessage] = React.useState("")
  
  
  const [userData, setUserData] = React.useState({
    email: { value:"rasel@gmail.com", touch: false, errorMessage: "" },
    password: { value:"123", touch: false, errorMessage: "" },
  })
  
  const schema = {
    email: {
      email: email(),
      max: max(50),
      min: min(5),
      required: required(),
    },
    password: {
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

  
  function handleSubmit(e){
    e.preventDefault()
    
    errorMessage && setErrorMessage("")
    isPending && setPending(false)
    
    
    let errors = validate("", {
      email: userData.email,
      password: userData.password
    }, schema, false)
  
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
     return  setUserData(result)
    }
    setPending(true)
    apis.post("/api/login", {
      email: userData.email.value,
      password: userData.password.value,
    }).then(response=>{
      if(response.status === 200) {
        setPending(false)
        dispatch<LoginAction>({
          type: ActionTypes.LOGIN,
          payload: {
            ...response.data,
            authFetched: true,
          }
        })
        navigate(afterRedirect ? afterRedirect : "/")
      }
    }).catch(ex=>{
      setPending(false)
      setErrorMessage(errorResponse(ex))
    })
  }
  
  
  return (
    <div className="px-4">
      <div className="box rounded-lg max-w-4xl mx-auto">
        
        {/*<SweetAlert onClose={()=>setErrorMessage("")} message={errorMessage}/>*/}
        
        
        <div className="px-6 py-4  max-w-lg mx-auto rounded-xl">
          <h1 className="text-2xl font-medium  text-gray-light-7 text-center">Login in your Account.</h1>
          <form onSubmit={handleSubmit} className="py-6">
  
            {isPending && <div className="flex justify-center">
              <Spin size="small" />
            </div> }
  
  
            <p className="input--error_message open__error_message text-center bg-red-400/20"> {errorMessage && errorMessage}</p>
            
            
            <Input
              onChange={handleChange}
              value={userData.email.value}
              // placeholder="Enter Your Email."
              name="email"
              label="Email"
              errorMessage={(userData.email.touch && userData.email.errorMessage) ? userData.email.errorMessage :  "" }
            />
  
            <Input
              onChange={handleChange}
              value={userData.password.value}
              // placeholder="Enter Your Password."
              name="password"
              label="Password"
              type="password"
              errorMessage={(userData.password.touch && userData.password.errorMessage) ? userData.password.errorMessage :  "" }
            />
            
            <div className="mt-2 mb-3">
              <h4 className="text-sm font-400">Not have a account?
              <span className="cursor-pointer text-blue-400 p-px ml-0.5 "><Link to="/auth/registration">Create a account new account</Link></span></h4>
            </div>
            <div>
           
            <Button type="submit" className={["bg-primary rounded-full px-8 py-1", isPending ? "btn-disable": ""].join(" ")}>Login</Button>
            
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;