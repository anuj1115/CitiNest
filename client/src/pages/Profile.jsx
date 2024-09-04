import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {useEffect, useRef, useState} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase"
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"

function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})  
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)

  useEffect(() => {
    if(file) {
      handleFileUpload(file)
    }
  }, [file])

  const handleFileUpload = (file) => {
      const storage = getStorage(app)
      const fileName = new Date().getTime() + file.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, file)


      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
      },
      (error) => {
        setFileUploadError(true)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL) => {
          setFormData({...formData, avatar: downloadURL})
        })
      }
      
    );
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if(data.success == false) {
        dispatch(updateUserFailure(data.message))
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
      
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/.*"/>
        <img onClick={()=>fileRef.current.click()}className='rounded-full h-24 w-24 object-cover cursor-pointer self-center' src={formData.avatar || currentUser.avatar} alt='user-profile'/>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image upload (image must be less than 2 mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
                <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
                ''
          )}
        </p>
        <input onChange={handleChange} defaultValue={currentUser.username} type='text' placeholder='Username' className='border p-3 rounded-lg' id='username' />
        <input onChange={handleChange} defaultValue={currentUser.email} type='text' placeholder='Email' className='border p-3 rounded-lg' id='email'/>
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password'/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
           {loading ? "loading...":"Update"}
        </button>
        <button className='bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
           CREATE LISTING
        </button>
      </form>
      <div className='flex flex-row justify-between items-center'>
          <Link to={"/"}>
            <span className='text-red-700 text-[15px]'>Delete Account</span>
          </Link>
          <Link to={"/"}>
            <span className='text-red-700 text-[15px]'>Sign out</span>
          </Link>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>

      <div className="flex flex-row justify-center items-center mt-4">
        <Link to={"/"}>
              <span className='text-green-600 text-[15px] font-normal'>Show listings</span>
        </Link>
      </div>

    </div>
  )
}

export default Profile