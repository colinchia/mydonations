import React, { useEffect } from 'react';
import { useAppContext } from 'src/AppContext';

type PaymentStep4Props = {
    isProcessing: boolean;
};

function PaymentStep4({ isProcessing }: PaymentStep4Props) {
    const { transactionStatus } = useAppContext();

    useEffect(() => {
        window.history.replaceState({}, '', '/');
    }, []);

    let message;
    if (transactionStatus === 'success') {
        message = (
            <>
                <h5>Processing complete!</h5>
                <p>Your transaction has been processed successfully.</p>
            </>
        );
    } else if (transactionStatus === 'fail') {
        message = (
            <>
                <h5>Transaction Failed</h5>
                <p>There was a problem processing your transaction. Please try again.</p>
            </>
        );
    } else {
        message = isProcessing ? (
            <>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="mt-3">Your transaction is being processed.</h5>
                <p>Please do not close or refresh this page.</p>
            </>
        ) : null;
    }

    return (
        <div className="card-body">
            <div className="text-center">
                {message}
            </div>
        </div>
    );
}

export default PaymentStep4;
