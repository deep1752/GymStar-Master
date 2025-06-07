'use client';


import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const About = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [trainersCount, setTrainersCount] = useState(0);

  // Fetch admin details
  useEffect(() => {
    const fetchAdminDetails = async () => {
      const response = await fetch('http://127.0.0.1:8000/admin/get_by_id/1');
      const data = await response.json();
      setAdminDetails(data);
    };

    fetchAdminDetails();
  }, []);

  // Fetch trainers count
  useEffect(() => {
    const fetchTrainersCount = async () => {
      const response = await fetch('http://127.0.0.1:8000/trainer/get_all');
      const data = await response.json();
      setTrainersCount(data.length); // Assuming the API returns an array of trainers
    };

    fetchTrainersCount();
  }, []);

  return (
    <>
      {/* Hero Start */}
      <div className="container-fluid bg-primary p-5 bg-hero mb-5">
        <div className="row py-5">
          <div className="col-12 text-center">
            <h1 className="display-2 text-uppercase text-white mb-md-4">
              About Us
            </h1>

            <Link className="btn btn-primary py-md-3 px-md-5 me-3" href="/">Home</Link>
            <Link className="btn btn-light py-md-3 px-md-5" href="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
      {/* Hero End */}

      {/* About Start */}
      <div className="container-fluid p-5">
        <div className="row gx-5">
          <div className="col-lg-5 mb-5 mb-lg-0" style={{ minHeight: 500 }}>
            <div className="position-relative h-100">
              <img className="position-absolute w-100 h-100 rounded" src="img/about.jpg" style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div className="col-lg-7">
            <div className="mb-4">
              <h5 className="text-primary text-uppercase">About Us</h5>
              <h1 className="display-3 text-uppercase mb-0">Welcome to Gymstar</h1>
            </div>
            <h4 className="text-body mb-4">
              At Gymstar, we help you achieve your fitness goals with expert trainers, modern equipment, and a motivating atmosphere.
            </h4>
            <p className="mb-4">
              Our mission is to empower individuals to live healthier and stronger lives. Whether you’re a beginner or a seasoned athlete, Gymstar offers tailored programs to fit every level. Join our community, challenge yourself, and experience transformation through fitness.
            </p>
            <div className="rounded bg-dark p-5">
              <ul className="nav nav-pills justify-content-between mb-3">
                <li className="nav-item w-50">
                  <a className="nav-link text-uppercase text-center w-100 active" data-bs-toggle="pill" href="#pills-1">About Us</a>
                </li>
                <li className="nav-item w-50">
                  <a className="nav-link text-uppercase text-center w-100" data-bs-toggle="pill" href="#pills-2">Why Choose Us</a>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="pills-1">
                  <p className="text-secondary mb-0">
                    Gymstar is built on a foundation of commitment, innovation, and excellence. We are more than a gym — we’re a community of fitness enthusiasts dedicated to progress and positive change. From weight training to group classes, our facility provides all you need to succeed.
                  </p>
                </div>
                <div className="tab-pane fade" id="pills-2">
                  <p className="text-secondary mb-0">
                    With certified trainers, personalized plans, and top-tier equipment, Gymstar delivers unmatched value. Our flexible hours, clean environment, and supportive staff make us the perfect choice for anyone serious about fitness. Start your journey today with Gymstar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Program Start */}
      <div className="container-fluid programe position-relative px-5 mt-5" style={{ marginBottom: 135 }}>
        <div className="row g-5 gb-5">
          <div className="col-lg-4 col-md-6">
            <div className="bg-light rounded text-center p-5">
              <i className="flaticon-six-pack display-1 text-primary" />
              <h3 className="text-uppercase my-4">Body Building</h3>
              <p>
                Achieve your dream physique with our expert-guided bodybuilding programs. We help you gain strength, size, and confidence through Gymstar.
              </p>
              <a className="text-uppercase" href="">
                Read More <i className="bi bi-arrow-right" />
              </a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="bg-light rounded text-center p-5">
              <i className="flaticon-barbell display-1 text-primary" />
              <h3 className="text-uppercase my-4">Weight Lifting</h3>
              <p>
                Improve your lifting technique and build powerful muscles with our weightlifting sessions. Perfect for all levels—from beginners to pros.
              </p>
              <a className="text-uppercase" href="">
                Read More <i className="bi bi-arrow-right" />
              </a>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="bg-light rounded text-center p-5">
              <i className="flaticon-bodybuilding display-1 text-primary" />
              <h3 className="text-uppercase my-4">Muscle Building</h3>
              <p>
                Unlock your muscle-building potential with targeted workouts and nutrition support. Build lean muscle mass and sculpt your body effectively.
              </p>
              <a className="text-uppercase" href="">
                Read More <i className="bi bi-arrow-right" />
              </a>
            </div>
          </div>
          <div className="col-lg-12 col-md-6 text-center">
            <h1 className="text-uppercase text-light mb-4">
              30% Discount For This Summer
            </h1>
            <Link className="btn btn-primary py-3 px-5" href="/membership">Become A Member</Link>
          </div>
        </div>
      </div>
      {/* Program End */}

      {/* Facts Start */}
      <div className="container-fluid bg-dark facts p-5" style={{ marginBottom: 90 }}>
        <div className="row gx-5 gy-4 py-5">
          <div className="col-lg-3 col-md-6">
            <div className="d-flex">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                <i className="fa fa-star fs-4 text-white" />
              </div>
              <div className="ps-4">
                <h5 className="text-secondary text-uppercase">Experience</h5>
                <h1 className="display-5 text-white mb-0" data-toggle="counter-up">
                  {adminDetails ? adminDetails.expirence_in_year : 'Loading...'}
                </h1>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="d-flex">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                <i className="fa fa-users fs-4 text-white" />
              </div>
              <div className="ps-4">
                <h5 className="text-secondary text-uppercase">Our Trainers</h5>
                <h1 className="display-5 text-white mb-0" data-toggle="counter-up">
                  {trainersCount > 0 ? trainersCount : 'Loading...'}
                </h1>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="d-flex">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                <i className="fa fa-check fs-4 text-white" />
              </div>
              <div className="ps-4">
                <h5 className="text-secondary text-uppercase">Complete Project</h5>
                <h1 className="display-5 text-white mb-0" data-toggle="counter-up">
                  {adminDetails ? adminDetails.complet_project_numbers : 'Loading...'}
                </h1>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="d-flex">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                <i className="fa fa-mug-hot fs-4 text-white" />
              </div>
              <div className="ps-4">
                <h5 className="text-secondary text-uppercase">Happy Clients</h5>
                <h1 className="display-5 text-white mb-0" data-toggle="counter-up">
                  {adminDetails ? adminDetails.happy_clint_numbers : 'Loading...'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Facts End */}
    </>
  );
};

export default About;
