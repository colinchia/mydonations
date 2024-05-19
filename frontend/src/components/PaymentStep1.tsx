import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useAppContext } from 'src/AppContext';

type PaymentStep1Props = {
    onNext: () => void;
};

type ConversionRates = {
    [key: string]: number;
};

type Errors = {
    fetchConversionRates?: string;
    selectedAmount?: string;
    selectedCurrency?: string;
};

function PaymentStep1({ onNext }: PaymentStep1Props) {
    const { currencyList, defaultAmounts, donationAmount, donationCurrency, setDonationAmount, setDonationCurrency } = useAppContext();
    const [selectedAmount, setSelectedAmount] = useState<string>(donationAmount > 0 ? donationAmount.toString() : '');
    const [selectedCurrency, setSelectedCurrency] = useState<string>(donationCurrency);
    const [conversionRates, setConversionRates] = useState<ConversionRates>({});
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        const fetchConversionRates = async () => {
            const apiKeyExchangeRate = process.env.REACT_APP_KEY_EXCHANGERATEAPI;
            const url = `https://v6.exchangerate-api.com/v6/${apiKeyExchangeRate}/latest/SGD`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (data.result === 'success') {
                    setConversionRates(data.conversion_rates);
                } else {
                    throw new Error(data['error-type'] || 'Unknown error');
                }
            } catch (error) {
                const message = (error as Error).message;
                setErrors(prevErrors => ({ ...prevErrors, fetchConversionRates: message }));
            }
        };

        fetchConversionRates();
    }, [selectedCurrency]);

    const validateFields = () => {
        let isValid: boolean = true;
        let fieldErrors: Errors = {};

        if (!selectedAmount || parseFloat(selectedAmount) === 0) {
            fieldErrors.selectedAmount = "Amount field cannot be empty or zero.";
            isValid = false;
        }
        if (!selectedCurrency) {
            fieldErrors.selectedCurrency = "Currency field cannot be empty.";
            isValid = false;
        }

        setErrors(fieldErrors);
        return isValid;
    };

    const handleSelectAmount = (donationAmount: string) => {
        setSelectedAmount(donationAmount.toString());
    };

    const handleSelectCurrency = (donationCurrency: string | null) => {
        if (donationCurrency !== null) {
            setSelectedCurrency(donationCurrency);
        }
    };    

    const handleNextClick = () => {
        const isValid = validateFields();

        if (isValid) {
            const selectedAmountFloat = parseFloat(selectedAmount);
            if (!isNaN(selectedAmountFloat)) {
                setDonationAmount(selectedAmountFloat);
                setDonationCurrency(selectedCurrency);
                onNext();
            } else {
                console.error("Invalid number for donation amount");
            }
        }
    };
    
    return (
        <div className="card-body">
            <h5 className="card-title text-center" style={{ fontWeight: "300", marginBottom: "20px" }}>Make a one time donation of...</h5>
            <div className="row">
                {defaultAmounts.map((donationAmount, index) => {
                    const rate = conversionRates[selectedCurrency] || 1;
                    const convertedAmount = (donationAmount * rate).toFixed(2);
                    return (
                        <div className="col-sm-4 mb-3" key={index}>
                            <button type="button" className="btn btn-secondary text-truncate w-100" onClick={() => handleSelectAmount(convertedAmount)}>
                                {convertedAmount} <span style={{ fontSize: "10px" }}>{selectedCurrency}</span>
                            </button>
                        </div>
                    );
                })}
                
                <div className="col-sm-8">
                    <div className="input-group">
                        <input type="number" className="form-control" placeholder="Other amount" value={selectedAmount} onChange={(e) => setSelectedAmount(e.target.value)} />
                        <Dropdown onSelect={(eventKey) => handleSelectCurrency(eventKey)}>
                            <Dropdown.Toggle className="mydon-dropdown-toggle">
                                {selectedCurrency}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu mydon-currencylist" align="end">
                                {currencyList.map((donationCurrency) => (
                                    <Dropdown.Item key={donationCurrency.code} eventKey={donationCurrency.code}>{`${donationCurrency.code} - ${donationCurrency.name}`}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    {errors.fetchConversionRates && <span className="text-danger">{errors.fetchConversionRates}</span>}
                    {errors.selectedAmount && <span className="text-danger">{errors.selectedAmount}</span>}
                    {errors.selectedCurrency && <span className="text-danger">{errors.selectedCurrency}</span>}
                </div>
            </div>

            <div className="row mt-3">
                <div className="col">
                    <button type="button" className="btn w-100 mydon-btn-darkseagreen" onClick={handleNextClick}>Next</button>
                </div>
            </div>
        </div>
    );
}

export default PaymentStep1;
