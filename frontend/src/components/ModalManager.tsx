import React from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import { useAppContext } from 'src/AppContext';

function ModalManager() {
    const { handleClose, images, showModal } = useAppContext();

    return (
        <Modal show={showModal} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                {images.length > 0 && (
                    <Carousel interval={7000} fade>
                        {images.map((image, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={image.src}
                                    alt={image.alt || `Slide ${index + 1}`}
                                />
                                {(image.caption.text) && (
                                    <Carousel.Caption style={{ backgroundColor: "rgb(0 0 0 / 70%)", borderRadius: "5px", padding: "10px" }}>
                                        <p>{image.caption.text}</p>
                                    </Carousel.Caption>
                                )}
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default ModalManager;
