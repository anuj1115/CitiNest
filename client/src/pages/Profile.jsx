import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {useEffect, useRef, useState} from 'react'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from "firebase/storage"
import { app } from "../firebase"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signoutUserFailure, signoutUserSuccess } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import Footer from "../components/Footer"

function Profile() {
  const {currentUser, loading, error} = useSelector(state => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})  
  const dispatch = useDispatch()
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingsError, setShowListingsError] = useState(false)
  const [userListings, setUserListings] = useState([])

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

  const handleChange = async (e) => {
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

  const handleDeleteUser = async (e) => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method: 'DELETE',
      })
      const data = await res.json()
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message))
      }
      dispatch(deleteUserSuccess(data))
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleSignout = async (e) => {
    try {
      dispatch(signoutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if(data.success === false) {
        dispatch(signoutUserFailure(data.message))
        return
      }
      dispatch(signoutUserSuccess(data))
    } catch (error) {
      dispatch(signoutUserFailure(data.message))
    }
  }

  const handleShowListings = async (e) => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if(data.success === false) {
        setShowListingsError(true)
        return
      }
      setUserListings(data)
    } catch (error) {
      setShowListingsError(true)
    }
  }

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
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
        <input onChange={handleChange} type='password' placeholder='Password' className='border p-3 rounded-lg' id='password'/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
           {loading ? "updating...":"Update"}
        </button>
        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
          Create Listing
        </Link>
      </form>
      <div className='flex flex-row justify-between items-center'>
          <Link to={"/sign-in"}>
            <span onClick={handleDeleteUser} className='text-red-700 text-[15px]'>Delete Account</span>
          </Link>
          <Link to={"/sign-in"}>
            <span onClick={handleSignout} className='text-red-700 text-[15px]'>Sign out</span>
          </Link>
      </div>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User is updated successfully!' : ''}</p>

      <button onClick={handleShowListings} className='text-green-700 w-full text-[15px] font-normal'>
        Show Listings
      </button>
      <p>{showListingsError ? 'Error showing listings' : ''}</p>
      
      {userListings && userListings.length > 0 &&
         <div className="flex flex-col gap-4">
           <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>
           {userListings.map((listing)=>(
             <div key={listing.id} className="flex items-center gap-4 border rounded-lg p-3 justify-between">
               <Link to={`/listing/${listing._id}`}>
                 <img src={listing.imageUrls[0]} alt="pic" className="h-16 w-16 object-contain"/>
               </Link>
               <Link className="flex-1 text-slate-700 font-semibold hover:underline truncate" to={`/listing/${listing._id}`}>
                 <p>{listing.name}</p>
               </Link>
               <div className="flex flex-col items-center">
                 <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
                 <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700 uppercase">Edit</button>
                 </Link>
               </div>
             </div>
           ))}
         </div>
        }
    </div>
    <div>
      <Footer/>
    </div>
   </>
  )
}

export default Profile