
'use client';


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
    const [adminDetails, setAdminDetails] = useState(null);
    const [trainersCount, setTrainersCount] = useState(0);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
    };
    // Fetch admin details
    useEffect(() => {
        const fetchAdminDetails = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/get_by_id/1`);
            const data = await response.json();
            setAdminDetails(data);
        };

        fetchAdminDetails();
    }, []);

    // Fetch trainers count
    useEffect(() => {
        const fetchTrainersCount = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainer/get_all`);
            const data = await response.json();
            setTrainersCount(data.length); // Assuming the API returns an array of trainers
        };

        fetchTrainersCount();
    }, []);








    const [classData, setClassData] = useState({});
    const [trainerMap, setTrainerMap] = useState({}); // id -> name

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/classes/get_all`)
            .then(async (response) => {
                const classes = response.data;

                // Group by day
                const grouped = classes.reduce((acc, cls) => {
                    const day = cls.day.toLowerCase();
                    if (!acc[day]) acc[day] = [];
                    acc[day].push(cls);
                    return acc;
                }, {});
                setClassData(grouped);

                // Extract unique trainer IDs
                const trainerIds = [...new Set(classes.map(cls => cls.trainer_id))];

                // Fetch all trainer details
                const trainerPromises = trainerIds.map(id =>
                    axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/trainer/get_by_id/${id}`)
                        .then(res => ({ id, name: res.data.name }))
                        .catch(err => {
                            console.error(`Error fetching trainer ${id}:`, err);
                            return { id, name: 'Unknown Trainer' };
                        })
                );

                const trainers = await Promise.all(trainerPromises);
                const trainerMapObj = {};
                trainers.forEach(t => {
                    trainerMapObj[t.id] = t.name;
                });
                setTrainerMap(trainerMapObj);
            })
            .catch((error) => {
                console.error('Error fetching classes:', error);
            });
    }, []);

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const renderClasses = (day) => {
        const classes = classData[day] || [];
        return (
            <div className="row g-5">
                {classes.map((cls, index) => (
                    <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                        <div className="bg-dark rounded text-center py-5 px-3">
                            <h6 className="text-uppercase text-light mb-3">{cls.timeing}</h6>
                            <h5 className="text-uppercase text-primary">{cls.class_name}</h5>
                            <p className="text-uppercase text-secondary mb-0">
                                {trainerMap[cls.trainer_id] || 'Loading...'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };









    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/trainer/get_all")
            .then((res) => setTrainers(res.data))
            .catch((err) => console.error("Error fetching trainers:", err));
    }, []);






    return (
        <>


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

            {/* Class Timetable Start */}
            <div className="container-fluid p-5">
                <div className="mb-5 text-center">
                    <h5 className="text-primary text-uppercase">Class Schedule</h5>
                    <h1 className="display-3 text-uppercase mb-0">Working Hours</h1>
                </div>
                <div className="tab-class text-center">
                    <ul className="nav nav-pills d-inline-flex justify-content-center bg-dark text-uppercase rounded-pill mb-5">
                        {days.map((day, index) => (
                            <li className="nav-item" key={day}>
                                <a
                                    className={`nav-link rounded-pill text-white ${index === 0 ? 'active' : ''}`}
                                    data-bs-toggle="pill"
                                    href={`#tab-${index + 1}`}
                                >
                                    {day.charAt(0).toUpperCase() + day.slice(1)}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="tab-content">
                        {days.map((day, index) => (
                            <div
                                key={day}
                                id={`tab-${index + 1}`}
                                className={`tab-pane fade p-0 ${index === 0 ? 'show active' : ''}`}
                            >
                                {renderClasses(day)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Class Timetable End */}

            {/* Team Start */}
            <div className="container-fluid p-5">
                <div className="mb-5 text-center">
                    <h5 className="text-primary text-uppercase">The Team</h5>
                    <h1 className="display-3 text-uppercase mb-0">Expert Trainers</h1>
                </div>
                <div className="row g-5">
                    {trainers.map((trainer) => (
                        <div className="col-lg-4 col-md-6" key={trainer.id}>
                            <div className="team-item position-relative">
                                <div className="position-relative overflow-hidden rounded">
                                    <img
                                        className="img-fluid w-100"
                                        src={`http://127.0.0.1:8000${trainer.image}`}
                                        alt={trainer.name}
                                    />
                                    <div className="team-overlay">
                                        <div className="d-flex align-items-center justify-content-start">
                                            <a
                                                className="btn btn-light btn-square rounded-circle mx-1"
                                                href={trainer.twitter_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <i className="fab fa-twitter" />
                                            </a>
                                            <a
                                                className="btn btn-light btn-square rounded-circle mx-1"
                                                href={trainer.fb_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <i className="fab fa-facebook-f" />
                                            </a>
                                            <a
                                                className="btn btn-light btn-square rounded-circle mx-1"
                                                href={trainer.linkedin_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <i className="fab fa-linkedin-in" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="position-absolute start-0 bottom-0 w-100 rounded-bottom text-center p-4"
                                    style={{ background: "rgba(34, 36, 41, .9)" }}
                                >
                                    <h5 className="text-uppercase text-light">{trainer.name}</h5>
                                    <p className="text-uppercase text-secondary m-0">
                                        {trainer.designation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Team End */}


            <div className="container-fluid p-0 my-5">
                <div className="row g-0">
                    <div className="col-lg-6" style={{ minHeight: 500 }}>
                        <div className="position-relative h-100">
                            <img
                                className="position-absolute w-100 h-100"
                                src="img/testimonial.jpg"
                                style={{ objectFit: "cover" }}
                            />
                        </div>
                    </div>
                    <div className="col-lg-6 bg-dark p-5">
                        <div className="mb-5">
                            <h5 className="text-primary text-uppercase">Testimonial</h5>
                            <h1 className="display-3 text-uppercase text-light mb-0">
                                Our Client Say
                            </h1>
                            <Slider {...settings}>
                                {[
                                    {
                                        text: " Dolores sed duo clita tempor justo dolor et stet lorem kasd labore dolore lorem ipsum. At lorem lorem magna ut et, nonumy et labore et tempor diam tempor erat dolor rebum sit ipsum.",
                                        name: "Anjali Verma",
                                        role: "Profession",
                                        image: "/img/testimonial-1.jpg",
                                    },
                                    {
                                        text: " Dolores sed duo clita tempor justo dolor et stet lorem kasd labore dolore lorem ipsum. At lorem lorem magna ut et, nonumy et labore et tempor diam tempor erat dolor rebum sit ipsum.",
                                        name: "Rajesh Kumar",
                                        role: "Profession",
                                        image: "/img/testimonial-2.jpg",
                                    },
                                    {
                                        text: " Dolores sed duo clita tempor justo dolor et stet lorem kasd labore dolore lorem ipsum. At lorem lorem magna ut et, nonumy et labore et tempor diam tempor erat dolor rebum sit ipsum.",
                                        name: "Pooja Sharma",
                                        role: "Profession",
                                        image: "/img/testimonial-1.jpg",
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="testimonial-item">
                                        <p className="fs-5 fw-normal text-light mb-4">
                                            <i className="fa fa-quote-left text-primary me-3" />
                                            {item.text}
                                        </p>
                                        <div className="d-flex align-items-center">
                                            <img
                                                className="rounded-circle testimonial-img"
                                                src={item.image}
                                                alt="client"
                                            />
                                            <div className="ps-4">
                                                <h5 className="text-uppercase text-light mb-1">
                                                    {item.name}
                                                </h5>
                                                <span className="text-uppercase text-secondary">
                                                    {item.role}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Slider>


                        </div>

                    </div>
                </div>
            </div>
            {/* Blog Start */}
            <div className="container-fluid p-5">
                <div className="mb-5 text-center">
                    <h5 className="text-primary text-uppercase">Our Blog</h5>
                    <h1 className="display-3 text-uppercase mb-0">Latest Blog Post</h1>
                </div>
                <div className="row g-5">
                    <div className="col-lg-4">
                        <div className="blog-item">
                            <div className="position-relative overflow-hidden rounded-top">
                                <img className="img-fluid" src="img/blog-1.jpg" alt="" />
                            </div>
                            <div className="bg-dark d-flex align-items-center rounded-bottom p-4">
                                <div className="flex-shrink-0 text-center text-secondary border-end border-secondary pe-3 me-3">
                                    <span>01</span>
                                    <h6 className="text-light text-uppercase mb-0">January</h6>
                                    <span>2045</span>
                                </div>
                                {/* <a className="h5 text-uppercase text-light" href="">
                                    Sed amet tempor amet sit kasd sea lorem
                                </a> */}
                                <Link className="h5 text-uppercase text-light" href="/blog">Sed amet tempor amet sit kasd sea lorem</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="blog-item">
                            <div className="position-relative overflow-hidden rounded-top">
                                <img className="img-fluid" src="img/blog-2.jpg" alt="" />
                            </div>
                            <div className="bg-dark d-flex align-items-center rounded-bottom p-4">
                                <div className="flex-shrink-0 text-center text-secondary border-end border-secondary pe-3 me-3">
                                    <span>01</span>
                                    <h6 className="text-light text-uppercase mb-0">January</h6>
                                    <span>2045</span>
                                </div>
                                <Link className="h5 text-uppercase text-light" href="/blog">Sed amet tempor amet sit kasd sea lorem</Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="blog-item">
                            <div className="position-relative overflow-hidden rounded-top">
                                <img className="img-fluid" src="img/blog-3.jpg" alt="" />
                            </div>
                            <div className="bg-dark d-flex align-items-center rounded-bottom p-4">
                                <div className="flex-shrink-0 text-center text-secondary border-end border-secondary pe-3 me-3">
                                    <span>01</span>
                                    <h6 className="text-light text-uppercase mb-0">January</h6>
                                    <span>2045</span>
                                </div>
                                <Link className="h5 text-uppercase text-light" href="/blog">Sed amet tempor amet sit kasd sea lorem</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Blog End */}
        </>


    );
};

export default Home;
