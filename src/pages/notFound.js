import React from "react";
import { Link } from "react-router-dom";
import errorImage from "../assets/photos/4_NoGirl-1-ok-removebg-preview.png";
import { useTranslation } from 'react-i18next';

const NotFound = () => {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex items-center flex-col justify-center bg-gray-100">
            <div>
                <img src={errorImage} alt={t('errorImageAlt')} className="h-64"/>
            </div>

            <div>
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">{t('unauthorizedPageTitle')}</h2>
                    <p className="text-lg text-gray-600">{t('unauthorizedPageMessage')}</p>
                </div>
            </div>
            <div>
                <div>
                    <Link
                        to="/Login"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
                    >
                        {t('goToLogin')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
