import React from 'react';
import Link from 'next/link';

const Blog = () => {
    return (
        <>
           
            {/* Hero Start */}
            <div className="container-fluid bg-primary p-5 bg-hero mb-5">
                <div className="row py-5">
                    <div className="col-12 text-center">
                        <h1 className="display-2 text-uppercase text-white mb-md-4">
                            Blog Grid
                        </h1>
                        <Link className="btn btn-primary py-md-3 px-md-5 me-3" href="/">Home</Link>
                        <Link className="btn btn-light py-md-3 px-md-5" href="/detail">Blog Details </Link>
                    </div>
                </div>
            </div>
            {/* Hero End */}
            {/* Blog Start */}
            <div className="container-fluid p-5">
                <div className="row g-5">
                    {/* Blog list Start */}
                    <div className="col-lg-8">
                        <div className="row g-5">
                            <div className="col-md-6">
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
                                        <a className="h5 text-uppercase text-light" href="">
                                            Sed amet tempor amet sit kasd sea lorem
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
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
                                        <a className="h5 text-uppercase text-light" href="">
                                            Sed amet tempor amet sit kasd sea lorem
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
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
                                        <a className="h5 text-uppercase text-light" href="">
                                            Sed amet tempor amet sit kasd sea lorem
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
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
                                        <a className="h5 text-uppercase text-light" href="">
                                            Sed amet tempor amet sit kasd sea lorem
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
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
                                        <a className="h5 text-uppercase text-light" href="">
                                            Sed amet tempor amet sit kasd sea lorem
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
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
                                        <a className="h5 text-uppercase text-light" href="">
                                            Sed amet tempor amet sit kasd sea lorem
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
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
                                        <a className="h5 text-uppercase text-light" href="">
                                            Sed amet tempor amet sit kasd sea lorem
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
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
                                        <a className="h5 text-uppercase text-light" href="">
                                            Sed amet tempor amet sit kasd sea lorem
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <nav aria-label="Page navigation">
                                    <ul className="pagination pagination-lg justify-content-center m-0">
                                        <li className="page-item disabled">
                                            <a className="page-link" href="#" aria-label="Previous">
                                                <span aria-hidden="true">
                                                    <i className="bi bi-arrow-left" />
                                                </span>
                                            </a>
                                        </li>
                                        <li className="page-item active">
                                            <a className="page-link" href="#">
                                                1
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#">
                                                2
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#">
                                                3
                                            </a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#" aria-label="Next">
                                                <span aria-hidden="true">
                                                    <i className="bi bi-arrow-right" />
                                                </span>
                                            </a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                    {/* Blog list End */}
                    {/* Sidebar Start */}
                    <div className="col-lg-4">
                        {/* Search Form Start */}
                        <div className="mb-5">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control p-3"
                                    placeholder="Keyword"
                                />
                                <button className="btn btn-primary px-4">
                                    <i className="bi bi-search" />
                                </button>
                            </div>
                        </div>
                        {/* Search Form End */}
                        {/* Category Start */}
                        <div className="mb-5">
                            <h3 className="text-uppercase mb-4">Categories</h3>
                            <div className="d-flex flex-column justify-content-start bg-dark rounded p-4">
                                <a className="fs-5 fw-bold text-light text-uppercase mb-2" href="#">
                                    <i className="bi bi-arrow-right text-primary me-2" />
                                    Web Design
                                </a>
                                <a className="fs-5 fw-bold text-light text-uppercase mb-2" href="#">
                                    <i className="bi bi-arrow-right text-primary me-2" />
                                    Web Development
                                </a>
                                <a className="fs-5 fw-bold text-light text-uppercase mb-2" href="#">
                                    <i className="bi bi-arrow-right text-primary me-2" />
                                    Web Development
                                </a>
                                <a className="fs-5 fw-bold text-light text-uppercase mb-2" href="#">
                                    <i className="bi bi-arrow-right text-primary me-2" />
                                    Keyword Research
                                </a>
                                <a className="fs-5 fw-bold text-light text-uppercase" href="#">
                                    <i className="bi bi-arrow-right text-primary me-2" />
                                    Email Marketing
                                </a>
                            </div>
                        </div>
                        {/* Category End */}
                        {/* Recent Post Start */}
                        <div className="mb-5">
                            <h3 className="text-uppercase mb-4">Recent Post</h3>
                            <div className="bg-dark rounded p-4">
                                <div className="d-flex overflow-hidden mb-3">
                                    <img
                                        className="img-fluid flex-shrink-0 rounded-start"
                                        src="img/blog-1.jpg"
                                        style={{ width: 75 }}
                                        alt=""
                                    />
                                    <a
                                        href=""
                                        className="d-flex align-items-center bg-light rounded-end h5 text-uppercase p-3 mb-0"
                                    >
                                        Sed amet tempor amet sit kasd sea lorem
                                    </a>
                                </div>
                                <div className="d-flex overflow-hidden mb-3">
                                    <img
                                        className="img-fluid flex-shrink-0 rounded-start"
                                        src="img/blog-2.jpg"
                                        style={{ width: 75 }}
                                        alt=""
                                    />
                                    <a
                                        href=""
                                        className="d-flex align-items-center bg-light rounded-end h5 text-uppercase p-3 mb-0"
                                    >
                                        Sed amet tempor amet sit kasd sea lorem
                                    </a>
                                </div>
                                <div className="d-flex overflow-hidden mb-3">
                                    <img
                                        className="img-fluid flex-shrink-0 rounded-start"
                                        src="img/blog-3.jpg"
                                        style={{ width: 75 }}
                                        alt=""
                                    />
                                    <a
                                        href=""
                                        className="d-flex align-items-center bg-light rounded-end h5 text-uppercase p-3 mb-0"
                                    >
                                        Sed amet tempor amet sit kasd sea lorem
                                    </a>
                                </div>
                                <div className="d-flex overflow-hidden mb-3">
                                    <img
                                        className="img-fluid flex-shrink-0 rounded-start"
                                        src="img/blog-1.jpg"
                                        style={{ width: 75 }}
                                        alt=""
                                    />
                                    <a
                                        href=""
                                        className="d-flex align-items-center bg-light rounded-end h5 text-uppercase p-3 mb-0"
                                    >
                                        Sed amet tempor amet sit kasd sea lorem
                                    </a>
                                </div>
                                <div className="d-flex overflow-hidden">
                                    <img
                                        className="img-fluid flex-shrink-0 rounded-start"
                                        src="img/blog-2.jpg"
                                        style={{ width: 75 }}
                                        alt=""
                                    />
                                    <a
                                        href=""
                                        className="d-flex align-items-center bg-light rounded-end h5 text-uppercase p-3 mb-0"
                                    >
                                        Sed amet tempor amet sit kasd sea lorem
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Recent Post End */}
                        {/* Tags Start */}
                        <div className="mb-5">
                            <h3 className="text-uppercase mb-4">Tag Cloud</h3>
                            <div className="d-flex flex-wrap m-n1">
                                <a href="" className="btn btn-dark m-1">
                                    Design
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    Development
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    Marketing
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    SEO
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    Writing
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    Consulting
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    Design
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    Development
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    Marketing
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    SEO
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    Writing
                                </a>
                                <a href="" className="btn btn-dark m-1">
                                    Consulting
                                </a>
                            </div>
                        </div>
                        {/* Tags End */}
                        {/* Plain Text Start */}
                        <div>
                            <h3 className="text-uppercase mb-4">Plain Text</h3>
                            <div
                                className="bg-dark rounded text-center text-light"
                                style={{ padding: 30 }}
                            >
                                <p>
                                    Vero sea et accusam justo dolor accusam lorem consetetur, dolores
                                    sit amet sit dolor clita kasd justo, diam accusam no sea ut tempor
                                    magna takimata, amet sit et diam dolor ipsum amet diam
                                </p>
                                <a href="" className="btn btn-primary py-2 px-4">
                                    Read More
                                </a>
                            </div>
                        </div>
                        {/* Plain Text End */}
                    </div>
                    {/* Sidebar End */}
                </div>
            </div>
            {/* Blog End */}
           
        </>

    );
};

export default Blog;
