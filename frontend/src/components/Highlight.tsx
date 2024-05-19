import React from 'react';
import { useAppContext } from 'src/AppContext';

function Highlight() {
    const { handleShow } = useAppContext();

    const imagesToShow = [
        { src: './img/highlight-lab.jpg', alt: 'Science and engineering meet at the Green Mars Project Laboratory in Singapore.', caption: { text: 'Science and engineering meet at the Green Mars Project Laboratory in Singapore.' }},
        { src: './img/highlight-planter.jpg', alt: 'A VerdeBot T-220 autonomous planter hard at work in Arcadia Planitia, Mars.', caption: { text: 'A VerdeBot T-220 autonomous planter hard at work in Arcadia Planitia, Mars.' }},
        { src: './img/highlight-spacecraft.jpg', alt: 'The Galactic Pioneer II under construction in Houston Space Bay.', caption: { text: 'The Galactic Pioneer II under construction in Houston Space Bay.' }},
    ];

    return (
        <div className="col-md-6 mb-4">
            <div className="row">
                <div className="col-md">
                    <div className="row mb-4">
                        <div className="col">
                            <img className="img-fluid mydon-img" src="./img/highlight-lab.jpg" style={{ cursor: "pointer" }} alt="Science and engineering meet at the Green Mars Project Laboratory in Singapore." onClick={() => handleShow(imagesToShow)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p>Imagine being part of an extraordinary journey to paint Mars green, not just as a witness, but as a key contributor to a groundbreaking mission that extends humanity's presence into the cosmos. You have the power to help transform Mars into a thriving, green planet, making history as part of humanity's bold leap towards becoming an interplanetary species. This is about more than exploration; it's about building a legacy that echoes through the ages, offering new horizons for living, learning, and protecting our shared home in the cosmos.</p>
                            <p>Your involvement is the key to this venture's success. Every donation directly fuels the engine of change, including:</p>
                            <ul className="mydon-ul">
                                <li>Funding advanced robotic tree planters,</li>
                                <li>Cutting-edge research in bioengineered plants capable of surviving Mars' harsh environment,</li>
                                <li>And the development of sustainable habitats for future explorers.</li>
                            </ul>
                            <p>Your support also accelerates our efforts in educational outreach and public engagement, vital in fostering a global commitment to interplanetary stewardship. By investing in this cause, you become a cornerstone of innovation, transforming the dream of a green Mars into reality and setting the stage for a future where humanity thrives across the cosmos. The journey to green Mars is not just ours—it's yours. Let's make history together.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Highlight;
