import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import Footer from '../components/Footer';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div className='bg-gradient-to-b from-white via-gray-50 to-gray-100 mt-20'>
      <div className='flex flex-col gap-6 py-20 px-4 max-w-6xl mx-auto text-center'>
        <h1 className='text-slate-700 font-bold text-4xl lg:text-6xl'>
          Explore your perfect <span className='text-yellow-500'>Spot</span>
        </h1>
        <p className='text-gray-500 text-sm sm:text-lg'>
          Discover a wide range of properties with <span className='font-bold text-blue-800'>CitiNest</span> and make your dream home a reality.
        </p>
        <Link
          to={'/search'}
          className='text-xs sm:text-2xl  text-blue-800 font-bold hover:underline'
        >
          Let's get started...
        </Link>
      </div>

    
      <div className='max-w-6xl mx-auto p-2'>
        <h2 className='text-2xl font-semibold text-slate-700 mb-4'>Featured Offers</h2>
        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          navigation
          loop
          className='shadow-lg rounded-lg'
        >
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className='h-[400px] rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105'
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

   
      <div className='max-w-6xl mx-auto p-2 flex flex-col gap-10 my-12'>
      
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-slate-700'>
                Recent Offers
              </h2>
              <Link
                className='text-sm text-blue-600 hover:underline font-medium'
                to='/search?offer=true'
              >
                Show more offers
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-wrap gap-4'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Rent Listings */}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-slate-700'>
                Recent Places for Rent
              </h2>
              <Link
                className='text-sm text-blue-600 hover:underline font-medium'
                to='/search?type=rent'
              >
                Show more places for rent
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-wrap gap-6'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {/* Sale Listings */}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-slate-700'>
                Recent Places for Sale
              </h2>
              <Link
                className='text-sm text-blue-600 hover:underline font-medium'
                to='/search?type=sale'
              >
                Show more places for sale
              </Link>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-wrap gap-6'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}