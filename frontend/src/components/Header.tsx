import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

function Header() {
    return (
        <header className="mb-5">
            <div className="container mydon-header-caption">
                <div className="row justify-content-center">
                    <div className="col">
                        <img className="img-fluid mydon-header-captionlogo" src="./img/logo-gmp.png" alt="Green Mars Project Logo"/>
                        <h1 className="mydon-header-captiontext">REVIVING MARS, INSPIRING EARTH: TOGETHER FOR A GREENER FUTURE.</h1>
                    </div>
                </div>
            </div>

            <div className="carousel-container">
                <Carousel className="mw-100" fade={true} interval={7000}>
                    <Carousel.Item>
                        <picture>
                            <source type="image/webp" srcSet="./img/hero-terraform.webp" />
                            <img className="d-block w-100" src="./img/hero-terraform.jpg" alt="Mars terraforming" />
                        </picture>
                    </Carousel.Item>
                    <Carousel.Item>
                        <picture>
                            <source type="image/webp" srcSet="./img/hero-ecodome.webp" />
                            <img className="d-block w-100" src="./img/hero-ecodome.jpg" alt="Ecodome interior" />
                        </picture>
                    </Carousel.Item>
                    <Carousel.Item>
                        <picture>
                            <source type="image/webp" srcSet="./img/hero-water.webp" />
                            <img className="d-block w-100" src="./img/hero-water.jpg" alt="Water ecodome" />
                        </picture>
                    </Carousel.Item>
                </Carousel>
            </div>
        </header>
    );
}

export default Header;
