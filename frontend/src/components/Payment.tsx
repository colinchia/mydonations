import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useStripe } from '@stripe/react-stripe-js';
import { useAppContext } from 'src/AppContext';
import PaymentStep1 from 'src/components/PaymentStep1';
import PaymentStep2 from 'src/components/PaymentStep2';
import PaymentStep3 from 'src/components/PaymentStep3';
import PaymentStep4 from 'src/components/PaymentStep4';

function Payment() {
    const stripe = useStripe();
    const { donationAmount, donationCurrency, donorName, donorEmail, donorComments, transactionMode, setTransactionStatus } = useAppContext();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const location = useLocation();
    
    useEffect(() => {
        const checkPaymentStatus = async () => {
            const searchParams = new URLSearchParams(location.search);
            const paymentIntentId = searchParams.get('payment_intent');
            const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
            
            if (paymentIntentId && paymentIntentClientSecret && stripe) {
                setIsProcessing(true);
                setCurrentStep(4);

                try {
                    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/donations/finalize-payment/${paymentIntentId}`);
                    const data = await response.json();
                    setIsProcessing(false);
                    
                    if (response.ok) {
                        if (data.status === 'requires_action') {
                            const result = await stripe.confirmCardPayment(paymentIntentClientSecret);
                            if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                                setTransactionStatus('success');
                                setCurrentStep(4);
                            } else {
                                setTransactionStatus('fail');
                                setCurrentStep(4);
                            }
                        } else if (data.status === 'succeeded') {
                            setTransactionStatus('success');
                            setCurrentStep(4);
                        } else {
                            setTransactionStatus('fail');
                            setCurrentStep(4);
                        }
                    } else {
                        throw new Error(data.message || 'Failed to check payment status');
                    }
                } catch (error) {
                    console.error('Error checking payment status:', error);
                    setIsProcessing(false);
                    setTransactionStatus('fail');
                    setCurrentStep(4);
                }
            }
        };
    
        checkPaymentStatus();
    }, [location, stripe, setTransactionStatus]);

    const handleNext = () => {
        setCurrentStep(currentStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleBackendSubmit = async (paymentMethod: any) => {
        setIsProcessing(true);

        const paymentData = {
            donorName: donorName,
            donorEmail: donorEmail,
            donorComments: donorComments,
            donationCurrency: donationCurrency,
            donationAmount: donationAmount,
            transactionId: paymentMethod.id,
            transactionMode: transactionMode,
            transactionStatus: '',
            request: JSON.stringify(paymentMethod),
            response: '',
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/donations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });

            const responseData = await response.json();
            if (response.ok) {
                if (responseData.status === 'requires_action' && responseData.redirectUrl) {
                    window.location.href = responseData.redirectUrl;
                } else {
                    setIsProcessing(false);
                    setTransactionStatus('success');
                    setCurrentStep(4);
                }
            } else {
                console.error('Error: ', responseData);
                setIsProcessing(false);
                setTransactionStatus('fail');
                setCurrentStep(4);
            }
        } catch (error) {
            console.error('Error sending data to server: ', error);
            setIsProcessing(false);
            setTransactionStatus('fail');
            setCurrentStep(4);
        }
    };

    const renderProgressBar = () => {
        return (
            <div className="progress">
                <div className="progress-bar" role="progressbar" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
            </div>
        );
    };

    const renderFormStep = () => {
        switch (currentStep) {
            case 1: return <PaymentStep1 onNext={handleNext} />
            case 2: return <PaymentStep2 onBack={handleBack} onNext={handleNext} />
            case 3: return <PaymentStep3 onBack={handleBack} onSubmit={handleBackendSubmit} />
            case 4: return <PaymentStep4 isProcessing={isProcessing} />
            default: return null;
        }
    };

    return (
        <div className="col-md-6 mb-4">
            <div className="card">
                <div className="card-header text-center mydon-payment-header">
                    Join the Cause
                </div>
                { renderProgressBar() }
                <div>
                    { renderFormStep() }
                </div>
            </div>
        </div>
    );
}

export default Payment;
