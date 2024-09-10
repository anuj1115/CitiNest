import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { app } from "../firebase"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signoutUserStart, signoutUserFailure, signoutUserSuccess } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import Footer from "../components/Footer"

function Profile() {
  const { currentUser, loading, error } = useSelector(state => state.user)
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
    if (file) {
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
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          })
      }

    );
  }

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
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
      if (data.success == false) {
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
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success === false) {
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
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message))
        return
      }
      dispatch(signoutUserSuccess(data))
    } catch (error) {
      dispatch(signoutUserFailure(error.message))
    }
  }

  const handleShowListings = async (e) => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if (data.success === false) {
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
      <div className="p-12 max-w-2xl mt-28 mb-10 mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-10">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-8">
          <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*" />
          <img onClick={() => fileRef.current.click()} className='rounded-full h-28 w-28 object-cover cursor-pointer self-center border-4 border-blue-500' src={formData.avatar || currentUser.avatar} alt='user-profile' />
          <p className="text-center">
            {fileUploadError ? (
              <span className="text-red-600 font-semibold">Error: Image upload failed!</span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-blue-600 font-semibold">{`Uploading: ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-600 font-semibold">Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
          <input onChange={handleChange} defaultValue={currentUser.username} type='text' placeholder='Username' className='border p-3 rounded-lg' id='username' />
          <input onChange={handleChange} defaultValue={currentUser.email} type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' />
          <input onChange={handleChange} type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' />
          <button disabled={loading} className='bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50'>
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <Link className="bg-green-600 text-white py-3 rounded-lg text-center hover:bg-green-700 transition" to={"/create-listing"}>
            Create Listing
          </Link>
        </form>
        <div className='flex flex-row justify-between items-center mb-6'>
          <span onClick={handleDeleteUser} className='text-red-600 font-semibold text-sm cursor-pointer hover:underline'>
            Delete Account
          </span>
          <span onClick={handleSignout} className='text-red-600 font-semibold text-sm cursor-pointer hover:underline'>
            Sign Out
          </span>
        </div>
        <p className="text-green-600 text-center">{updateSuccess ? 'Profile updated successfully!' : ''}</p>

        <button onClick={handleShowListings} className='bg-gray-800 text-white py-2 rounded-lg w-full hover:bg-gray-700 transition'>
          Show My Listings
        </button>
        {showListingsError && <p className="text-red-600 text-center mt-4">Error showing listings</p>}

        {userListings && userListings.length > 0 && (
          <div className="mt-6">
            <h2 className="text-center text-2xl font-bold mb-4">Your Listings</h2>
            <div className="grid grid-cols-1 gap-6">
              {userListings.map((listing) => (
                <div key={listing.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                  <Link to={`/listing/${listing._id}`} className="flex-shrink-0">
                    <img src={listing.imageUrls[0]} alt="pic" className="h-20 w-20 object-cover rounded-lg" />
                  </Link>
                  <Link to={`/listing/${listing._id}`} className="flex-grow text-gray-700 font-semibold hover:underline">
                    <p className="truncate">{listing.name}</p>
                  </Link>
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => handleListingDelete(listing._id)} className="text-red-600 uppercase font-semibold text-xs hover:underline">
                      Delete
                    </button>
                    <Link to={`/update-listing/${listing._id}`}>
                      <button className="text-green-600 uppercase text-xs font-semibold hover:underline">Edit</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

export default Profile
