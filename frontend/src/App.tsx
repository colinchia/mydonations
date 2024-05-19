import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ContextProvider } from 'src/AppContext';
import Content from 'src/components/Content';
import Footer from 'src/components/Footer';
import Header from 'src/components/Header';
import ModalManager from 'src/components/ModalManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'src/App.scss';

const apiKeyStripe = process.env.REACT_APP_KEYPUBLIC_STRIPE;
const stripePromise = loadStripe(`${apiKeyStripe}`);

function App() {
    return (
        <ContextProvider>
            <Router>
                <Elements stripe={stripePromise}>
                    <div className="App">
                        <ModalManager />
                        <div className="mydon-content-wrap">
                            <Header />
                            <Content />
                        </div>
                        <Footer />
                    </div>
                </Elements>
            </Router>
        </ContextProvider>
    );
}

export default App;
