"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const Team = () => {
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/trainer/get_all")
      .then((res) => setTrainers(res.data))
      .catch((err) => console.error("Error fetching trainers:", err));
  }, []);

  return (
    <>
      {/* Hero Start */}
      <div className="container-fluid bg-primary p-5 bg-hero mb-5">
        <div className="row py-5">
          <div className="col-12 text-center">
            <h1 className="display-2 text-uppercase text-white mb-md-4">
              Trainers
            </h1>
            <Link className="btn btn-primary py-md-3 px-md-5 me-3" href="/">
              Home
            </Link>
            <Link className="btn btn-light py-md-3 px-md-5" href="/blog">
              Blog
            </Link>
          </div>
        </div>
      </div>
      {/* Hero End */}

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
    </>
  );
};

export default Team;
