
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    // Add logic to handle newsletter signup
    alert(`Signed up with email: ${email}`);
  };

  return (
    <footer className='bg-slate-800 text-white py-8'>
      <div className='max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center'>
        <div className='flex flex-col md:flex-row gap-8'>
          <div className='flex flex-col gap-2'>
            <h3 className='text-lg font-semibold mb-2'>Contact Us</h3>
            <p className='text-sm'>Email: info@citinest.com</p>
            <p className='text-sm'>Phone: (123) 456-7890</p>
            <p className='text-sm'>Address: 123 Real Estate Ave, Suite 400, City, State, 12345</p>
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-2'>Quick Links</h3>
            <ul className='space-y-2 text-sm'>
              <li><a href='/about' className='hover:underline'>About Us</a></li>
              <li><a href='/contact' className='hover:underline'>Contact Us</a></li>
              <li><a href='/privacy-policy' className='hover:underline'>Privacy Policy</a></li>
              <li><a href='/terms-of-service' className='hover:underline'>Terms of Service</a></li>
            </ul>
          </div>
          <div className='ml-14'>
            <h3 className='text-lg font-semibold mb-2'>Follow Us</h3>
            <div className='flex gap-4'>
              <a href='https://facebook.com' target='_blank' rel='noopener noreferrer'>
                <FaFacebook className='text-2xl hover:text-gray-400' />
              </a>
              <a href='https://twitter.com' target='_blank' rel='noopener noreferrer'>
                <FaTwitter className='text-2xl hover:text-gray-400' />
              </a>
              <a href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
                <FaInstagram className='text-2xl hover:text-gray-400' />
              </a>
              <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer'>
                <FaLinkedin className='text-2xl hover:text-gray-400' />
              </a>
            </div>
          </div>
        </div>
        <div className='mt-8 md:mt-0'>
          <h3 className='text-lg font-semibold mb-2'>Newsletter Signup</h3>
          <form onSubmit={handleNewsletterSignup} className='flex flex-col md:flex-row gap-2'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              className='p-2 rounded-lg w-full md:w-auto'
              required
            />
            <button type='submit' className='bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700'>
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className='text-center py-4 mt-6 items-center border-t border-slate-700'>
        <p className='text-sm'>© 2024 CitiNest. All rights reserved.</p>
      </div>
    </footer>
  );
}
