'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const Class = () => {
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

  return (
    <>
      {/* Hero Start */}
      <div className="container-fluid bg-primary p-5 bg-hero mb-5">
        <div className="row py-5">
          <div className="col-12 text-center">
            <h1 className="display-2 text-uppercase text-white mb-md-4">Classes</h1>
            <Link className="btn btn-primary py-md-3 px-md-5 me-3" href="/">Home</Link>
            <Link className="btn btn-light py-md-3 px-md-5" href="team">Trainers</Link>
          </div>
        </div>
      </div>
      {/* Hero End */}

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
    </>
  );
};

export default Class;
