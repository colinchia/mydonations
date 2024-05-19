import React, { useState } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useAppContext } from 'src/AppContext';

type PaymentStep3Props = {
    onBack: () => void;
    onSubmit: (paymentMethod: any) => void;
};

type Errors = {
    doTransaction?: string;
};

function PaymentStep3({ onBack, onSubmit }: PaymentStep3Props) {
    const stripe = useStripe();
    const elements = useElements();
    const { transactionMode, setTransactionMode } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});

    // Enable this if you want to include multiple transaction modes
    /* const handleChangeTransactionMode = (e) => {
        setTransactionMode(e.target.value);
    } */

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        if (transactionMode === 'StripeCard') {
            if (!stripe || !elements) {
                setErrors(prev => ({ ...prev, doTransaction: "Stripe has not initialized. Please try again." }));
                setIsSubmitting(false);
                return;
            }

            const cardElement = elements.getElement(CardElement);
            if (cardElement === null) {
                setIsSubmitting(false);
                return;
            }

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });
            if (error) {
                setErrors(prev => ({ ...prev, doTransaction: error.message }));
                setIsSubmitting(false);
            } else {
                setIsSubmitting(false);
                onSubmit(paymentMethod);
            }
        }
    };
    
    return (
        <div className="card-body">
            <h5 className="card-title text-center" style={{ fontWeight: "300", marginBottom: "20px" }}>Your donation is secure...</h5>
            <form>
                {/* Include a dropdown for multiple payment modes */}
                {/* <div className="mb-3">
                    <select className="form-select" value={transactionMode} onChange={handleChangeTransactionMode} disabled={isSubmitting} style={{ backgroundColor: "#f4fff4" }}>
                        <option value="StripeCard">Credit/Debit Card</option>
                        <option value="#">...</option>
                    </select>
                </div> */}

                <div className="row mb-3">
                    <div className="col">
                        {transactionMode === 'StripeCard' && (
                            <div className="form-control mydon-cardelement"><CardElement /></div>
                        )}
                    </div>
                </div>
                
                <div className="row">
                    <div className="col">
                        {errors.doTransaction && <span className="text-danger">{errors.doTransaction}</span>}
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col">
                        <button type="button" className="btn w-100 btn-secondary mb-2" onClick={onBack} disabled={isSubmitting}>Back</button>
                        <button type="submit" className="btn w-100 mydon-btn-darkseagreen" onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PaymentStep3;
