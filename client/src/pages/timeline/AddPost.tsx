import React from 'react';
import {ActionTypes} from "store/types/ActionTypes";
import Backdrop from "UI/backdrop/Backdrop";
import Modal from "UI/modal/Modal";
import {faImage, faPlus, faSmile, faTimes} from "@fortawesome/pro-regular-svg-icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import blobToBase64 from "src/utils/blobToBase64";
import Input from "UI/input/Input";
import {max, min, required, validate} from "src/utils/validator";
import apis from "src/apis";
import errorResponse from "src/utils/errorResponse";
import Radio from "UI/input/Radio";

const AddPost = ({dispatch, appState}) => {
  
  let [postText, setPostText] = React.useState({value: "", errorMessage: "", touch: false})
  let [isPublic, setPublic] = React.useState(true)
  const [images, setImages] = React.useState({})
  
  const [errorMessage, setErrorMessage] = React.useState({})
  const [isPending, setPending] = React.useState(false)
  
  
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  const schema = {
    postText: {
      max: max(30),
      min: min(3),
      required: required(),
    }
  }
  
  function publishPostHandler(){
    dispatch({
      type: ActionTypes.TOGGLE_BACKDROP,
      payload: {
        where: "content",
        message: "addpost",
        isOpen: true
      }
    })
    // apis.post("/api/post", {description: postText,}).then(r => {
    //   console.log(r)
    // })
  }
  
  function discardAddPost() {
    dispatch({
      type: ActionTypes.TOGGLE_BACKDROP,
      payload: false
    })
  }
  
  function chooseImage(){
    inputRef.current && inputRef.current.click()
  }
  
  function handleImageChange(e){
    let files = e.target.files
    let im = {
      ...images
    }
   
    for (let i = 0; i < files.length; i++) {
      blobToBase64(files[i], (blob)=>{
        im[files[i].name] = {
          base64: blob,
          blob: files[i]
        }
        if((i+1) === files.length){
          setImages(im)
        }
      })
    }
  }
  
  function deleteImage(imageName: string) {
    let img = {...images}
    delete img[imageName]
    setImages(img)
  }
  
  function addPostHandler(e){
    errorMessage && setErrorMessage("")
    isPending && setPending(false)
  
    let errors = validate("", {
      postText: postText
    }, schema, false)
  
    
    let result = {...postText}
  
    if(errors) {
      for (let errorsKey in errors) {
        result = {
          value: postText.value,
          errorMessage: errors.postText,
          touch: true
        }
      }
      return setPostText(result)
    }
    setPending(true)
    
    apis.post("/api/post", {
      description: postText.value,
      is_public: isPublic,
    }).then(r => {
      console.log(r)
    }).then(res=>{
      console.log(res)
    }).catch(ex=>{
      setErrorMessage(errorResponse(ex))
      setPending(false)
    })
  }
  
  
  function handleChange({target: {name, value}}) {
    let error = validate(name, value, schema)
    setPostText({
      value: value,
      errorMessage: error ? error[name] : "",
      touch: true
    })
  }
  
  
  function addPostModal(){
    return (
      <Modal inProp={appState.backdrop.message === "addpost" && appState.backdrop.isOpen}>
        <div className="box add-post-box">
          <input onChange={handleImageChange} multiple={true} type="file" hidden={true} ref={inputRef}/>
          
          <div className="add-comment-form">
            <div className="flex justify-between items-center">
              <h1 className="text-center font-medium my-2 mt-1">Add post</h1>
              <button onClick={discardAddPost} className="btn">Discard</button>
            </div>
            
            {/*<Radio*/}
            {/*  onChange={(e)=>setPublic(e.target.value)}*/}
            {/*  name={"is_publish"}*/}
            {/*  value={isPublic}*/}
            {/*  label={"public"} />*/}
              
            
            <textarea
              // onChange={(e)=>setPostText(e.target.value)}
              className="input-item w-full"
              name="postText"
              rows={4}
              onChange={handleChange}
              value={postText.value}
              placeholder="Share some what you are thinking?"
              id="text"
              defaultValue={postText.value}
            />
            <span className="input--error_message">{(postText.touch && postText.errorMessage) ? postText.errorMessage :  "" }</span>
        
            <div className="post-images">
              { Object.keys(images).length > 0 && Object.keys(images).map(imageName=>(
                <div className="single-image">
                  <FontAwesomeIcon onClick={()=>deleteImage(imageName)} className="remove-image" icon={faTimes} />
                  <img src={images[imageName].base64}  alt="as"/>
                </div>
                
              
              )) }
  
              {Object.keys(images).length > 0 && (
                <button onClick={chooseImage}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="ml-1 font-medium">Add More</span>
                </button>
              )}


            </div>
            
            <div className="flex mb-1">
              <li className="list-none text-gray-700  px-1 pl-0">
                <FontAwesomeIcon onClick={chooseImage} icon={faImage} />
              </li>
              <li className="list-none text-gray-700 px-1">
                <FontAwesomeIcon icon={faSmile} />
              </li>
            </div>
        
            <div className="flex">
              <button onClick={addPostHandler}  className="btn w-full">Post</button>
            </div>
      
          </div>
        </div>
      </Modal>
    )
  }
  
  
  return (
    <div className="mt-2 mb-5 bg-white rounded py-3  px-4">
      
      <Backdrop
        as={appState.backdrop.where}
        bg="#5c5c5c78"
        isOpenBackdrop={appState.backdrop.isOpen}
        // onCloseBackdrop={handleCloseBackdrop}
      />
  
      {addPostModal()}
      
      
      <h4 className="text-md font-medium mb-1">What is in your mind</h4>
      <div className="add-comment-form">
        <textarea
          className="input-item w-full"
          name="text"
          rows={4}
          placeholder="Share some what you are thinking?"
          id="text"
        />
        <div className="flex mb-1">
          <li className="list-none text-gray-700  px-1 pl-0">
            <FontAwesomeIcon icon={faImage} />
          </li>
          <li className="list-none text-gray-700 px-1">
            <FontAwesomeIcon icon={faSmile} />
          </li>
        </div>
        <div className="flex">
          <button onClick={publishPostHandler}  className="btn w-full">Post</button>
        </div>
      </div>
    </div>
  )
};

export default AddPost;