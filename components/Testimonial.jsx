import React from 'react';

const Testimonial = () => {
    return (
        <>
           
            {/* Hero Start */}
            <div className="container-fluid bg-primary p-5 bg-hero mb-5">
                <div className="row py-5">
                    <div className="col-12 text-center">
                        <h1 className="display-2 text-uppercase text-white mb-md-4">
                            Testimonial
                        </h1>
                        <a href="" className="btn btn-primary py-md-3 px-md-5 me-3">
                            Home
                        </a>
                        <a href="" className="btn btn-light py-md-3 px-md-5">
                            Testimonial
                        </a>
                    </div>
                </div>
            </div>
            {/* Hero End */}
            {/* Testimonial Start */}
            <div className="container-fluid p-0" style={{ margin: "90px 0" }}>
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
                        </div>
                        <div className="owl-carousel testimonial-carousel">
                            <div className="testimonial-item">
                                <p className="fs-4 fw-normal text-light mb-4">
                                    <i className="fa fa-quote-left text-primary me-3" />
                                    Dolores sed duo clita tempor justo dolor et stet lorem kasd labore
                                    dolore lorem ipsum. At lorem lorem magna ut et, nonumy et labore
                                    et tempor diam tempor erat dolor rebum sit ipsum.
                                </p>
                                <div className="d-flex align-items-center">
                                    <img
                                        className="img-fluid rounded-circle"
                                        src="img/testimonial-1.jpg"
                                        alt=""
                                    />
                                    <div className="ps-4">
                                        <h5 className="text-uppercase text-light">Client Name</h5>
                                        <span className="text-uppercase text-secondary">
                                            Profession
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="testimonial-item">
                                <p className="fs-4 fw-normal text-light mb-4">
                                    <i className="fa fa-quote-left text-primary me-3" />
                                    Dolores sed duo clita tempor justo dolor et stet lorem kasd labore
                                    dolore lorem ipsum. At lorem lorem magna ut et, nonumy et labore
                                    et tempor diam tempor erat dolor rebum sit ipsum.
                                </p>
                                <div className="d-flex align-items-center">
                                    <img
                                        className="img-fluid rounded-circle"
                                        src="img/testimonial-2.jpg"
                                        alt=""
                                    />
                                    <div className="ps-4">
                                        <h5 className="text-uppercase text-light">Client Name</h5>
                                        <span className="text-uppercase text-secondary">
                                            Profession
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Testimonial End */}
         
        </>

    );
};

export default Testimonial;
