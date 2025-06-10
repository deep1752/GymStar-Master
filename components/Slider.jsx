'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Slider = () => {
  const [sliders, setSliders] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/slider/get`)
      .then(res => {
        const activeSliders = res.data.filter(slider => slider.status === 'active');
        setSliders(activeSliders);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container-fluid p-0 mb-5">
      <div id="header-carousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {sliders.map((item, index) => (
            <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <img
                className="w-100"
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.image}`} 
                alt={item.title}  
              />
              <div className="carousel-caption d-flex flex-column align-items-center justify-content-center">
                <div className="p-3" style={{ maxWidth: 900 }}>
                  <h5 className="text-white text-uppercase">{item.title}</h5>
                  <h1 className="display-2 text-white text-uppercase mb-md-4">{item.subtitle}</h1>
                  <Link className="btn btn-primary py-md-3 px-md-5 me-3" href="/join">Join Us</Link>
                  <Link className="btn btn-light py-md-3 px-md-5" href="/contact">Contact Us</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#header-carousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#header-carousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default Slider;
