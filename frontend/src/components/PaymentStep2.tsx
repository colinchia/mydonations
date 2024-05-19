import React, { useState } from 'react';
import { useAppContext } from 'src/AppContext';

type PaymentStep2Props = {
    onBack: () => void;
    onNext: () => void;
};

type Errors = {
    selectedName?: string;
    selectedEmail?: string;
};

function PaymentStep2({ onBack, onNext }: PaymentStep2Props) {
    const { donorComments, donorEmail, donorName, setDonorComments, setDonorEmail, setDonorName } = useAppContext();
    const [selectedName, setSelectedName] = useState<string>(donorName);
    const [selectedEmail, setSelectedEmail] = useState<string>(donorEmail);
    const [selectedComments, setSelectedComments] = useState<string>(donorComments);
    const [errors, setErrors] = useState<Errors>({});

    const validateFields = () => {
        let isValid: boolean = true;
        let fieldErrors: Errors = {};

        if (!selectedName) {
            fieldErrors.selectedName = "Name field cannot be empty.";
            isValid = false;
        }
        if (!selectedEmail) {
            fieldErrors.selectedEmail = "Email field cannot be empty.";
            isValid = false;
        }

        setErrors(fieldErrors);
        return isValid;
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedEmail(e.target.value);
    };

    const handleCommentsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSelectedComments(e.target.value);
    };

    const handleNextClick = () => {
        const isValid = validateFields();

        if (isValid) {
            setDonorName(selectedName);
            setDonorEmail(selectedEmail);
            setDonorComments(selectedComments);
            onNext();
        }
    };

    return (
        <div className="card-body">
            <h5 className="card-title text-center" style={{ fontWeight: "300", marginBottom: "20px" }}>Tell us more about you...</h5>
            <form>
                <div className="row mb-4">
                    <div className="col">
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Name *" value={selectedName} onChange={handleNameChange} />
                            {errors.selectedName && <p className="text-danger">{errors.selectedName}</p>}
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" placeholder="Email *" value={selectedEmail} onChange={handleEmailChange} />
                            {errors.selectedEmail && <p className="text-danger">{errors.selectedEmail}</p>}
                        </div>
                        <div className="mb-2">
                            <textarea className="form-control" rows={3} placeholder="Comments" value={selectedComments} onChange={handleCommentsChange}></textarea>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col">
                        <button type="button" className="btn w-100 btn-secondary mb-2" onClick={onBack}>Back</button>
                        <button type="button" className="btn w-100 mydon-btn-darkseagreen" onClick={handleNextClick}>Next</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PaymentStep2;
