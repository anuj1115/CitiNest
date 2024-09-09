import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className='fixed top-0 left-0 w-full bg-gradient-to-r from-blue-100 to-pink-100 shadow-lg z-50'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-4'>
        <Link to='/'>
          <h1 className='font-bold text-3xl flex items-center text-gray-800 tracking-wide'>
            <span className='text-blue-900'>Citi</span>
            <span className='text-yellow-500'>Nest</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='bg-white p-2 rounded-lg flex items-center shadow-md'
        >
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none text-gray-800 placeholder-gray-500 w-32 sm:w-72 p-2'
          />
          <button className='p-2 hover:bg-gray-200 rounded-full'>
            <FaSearch className='text-teal-600' />
          </button>
        </form>

        <div className='sm:hidden'>
          <button onClick={toggleMenu} className='text-gray-800 text-2xl'>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <ul
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } sm:flex flex-col sm:flex-row gap-4 items-center absolute sm:relative top-16 sm:top-0 left-0 sm:left-auto w-full sm:w-auto p-5 sm:p-0 backdrop-blur-md bg-opacity-50 bg-white sm:bg-transparent transition duration-300 ease-in-out`}
        >
          <Link to='/' onClick={toggleMenu}>
            <li className='hover:underline cursor-pointer text-lg sm:text-base text-gray-700 hover:text-teal-600 transition-all duration-300'>
              Home
            </li>
          </Link>
          <Link to='/about' onClick={toggleMenu}>
            <li className='hover:underline cursor-pointer text-lg sm:text-base text-gray-700 hover:text-pink-600 transition-all duration-300'>
              About
            </li>
          </Link>
          <Link to='/profile' onClick={toggleMenu}>
            {currentUser ? (
              <img
                className='rounded-full h-8 w-8 object-cover ring-2 ring-black'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className='hover:underline cursor-pointer text-lg sm:text-base text-gray-700 hover:text-yellow-600 transition-all duration-300'>
                Sign in
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
