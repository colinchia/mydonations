import React, { ReactNode, createContext, useContext, useState } from 'react';

type Image = {
    src: string;
    alt: string;
    caption: {
        text: string;
    };
};

type Currency = {
    code: string;
    name: string;
};

type AppContextType = {
    showModal: boolean;
    images: Image[];
    handleShow: (imagesToShow?: Image[]) => void;
    handleClose: () => void;
    donationAmount: number;
    setDonationAmount: React.Dispatch<React.SetStateAction<number>>;
    donationCurrency: string;
    setDonationCurrency: React.Dispatch<React.SetStateAction<string>>;
    donorName: string;
    setDonorName: React.Dispatch<React.SetStateAction<string>>;
    donorEmail: string;
    setDonorEmail: React.Dispatch<React.SetStateAction<string>>;
    donorComments: string;
    setDonorComments: React.Dispatch<React.SetStateAction<string>>;
    transactionMode: string;
    setTransactionMode: React.Dispatch<React.SetStateAction<string>>;
    transactionStatus: string;
    setTransactionStatus: React.Dispatch<React.SetStateAction<string>>;
    defaultAmounts: number[];
    setDefaultAmounts: React.Dispatch<React.SetStateAction<number[]>>;
    currencyList: Currency[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a ContextProvider');
    }
    return context;
};

export const ContextProvider = ({ children }: { children: ReactNode }) => {
    /**
     * Modal Contexts
     */
    const [showModal, setShowModal] = useState<boolean>(false);
    const [images, setImages] = useState<Image[]>([]);
    
    const handleShow = (imagesToShow: Image[] = []) => {
        setImages(imagesToShow);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    
    /**
     * Payment Contexts
     */
    const [donationAmount, setDonationAmount] = useState<number>(0);
    const [donationCurrency, setDonationCurrency] = useState<string>('SGD');
    const [donorName, setDonorName] = useState<string>('');
    const [donorEmail, setDonorEmail] = useState<string>('');
    const [donorComments, setDonorComments] = useState<string>('');
    const [transactionMode, setTransactionMode] = useState<string>('StripeCard');
    const [transactionStatus, setTransactionStatus] = useState<string>('');

    const [defaultAmounts, setDefaultAmounts] = useState<number[]>([5, 10, 50, 100]);
    const currencyList: Currency[] = [
        { code: "AUD", name: "Australian Dollar" },
        { code: "BRL", name: "Brazilian Real" },
        { code: "CAD", name: "Canadian Dollar" },
        { code: "CHF", name: "Swiss Franc" },
        { code: "CNY", name: "Chinese Renminbi" },
        { code: "CZK", name: "Czech Koruna" },
        { code: "DKK", name: "Danish Krone" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "Pound Sterling" },
        { code: "HKD", name: "Hong Kong Dollar" },
        { code: "HUF", name: "Hungarian Forint" },
        { code: "ILS", name: "Israeli New Shekel" },
        { code: "JPY", name: "Japanese Yen" },
        { code: "MXN", name: "Mexican Peso" },
        { code: "MYR", name: "Malaysian Ringgit" },
        { code: "NOK", name: "Norwegian Krone" },
        { code: "NZD", name: "New Zealand Dollar" },
        { code: "PHP", name: "Philippine Peso" },
        { code: "PLN", name: "Polish Złoty" },
        { code: "SEK", name: "Swedish Krona" },
        { code: "SGD", name: "Singapore Dollar" },
        { code: "THB", name: "Thai Baht" },
        { code: "TWD", name: "New Taiwan Dollar" },
        { code: "USD", name: "United States Dollar" },
    ];


    /**
     * Return AppContext
     */
    return (
        <AppContext.Provider value={{
            showModal, images, handleShow, handleClose,
            donationAmount, setDonationAmount, donationCurrency, setDonationCurrency, donorName, setDonorName, donorEmail, setDonorEmail, donorComments, setDonorComments,
            transactionMode, setTransactionMode, transactionStatus, setTransactionStatus,
            defaultAmounts, setDefaultAmounts, currencyList,
        }}>
            {children}
        </AppContext.Provider>
    );
};
