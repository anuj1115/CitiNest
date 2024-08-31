import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

function Profile() {
  const {currentUser} = useSelector(state => state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4 mb-4">
        <img className='rounded-full h-24 w-24 object-cover cursor-pointer self-center' src={currentUser.avatar} alt='user-profile'/>
        <input type='text' placeholder='Username' className='border p-3 rounded-lg' id='username' />
        <input type='text' placeholder='Email' className='border p-3 rounded-lg' id='email'/>
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
           UPDATE
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
      <div className="flex flex-row justify-center items-center mt-4">
        <Link to={"/"}>
              <span className='text-green-600 text-[15px] font-normal'>Show listings</span>
        </Link>
      </div>

    </div>
  )
}

export default Profile