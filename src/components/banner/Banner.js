import React, { useState } from 'react';
import './Banner.css'; 
import banner from '../../assets/Banner1.png';
import O from '../../assets/0.svg';
import O6 from '../../assets/6.svg';
import dot from '../../assets/dot.svg';
import bannerMob from '../../assets/BannerMob.png';
import { useTranslation } from "react-i18next"
import InputMask from "react-input-mask";

function Banner() {
    const {t, i18n} = useTranslation();
    const [phone, setPhone] = useState('')
    const [formData, setFormData] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "phone_number": ""
    });
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };
    async function handleSubmit(e) {
        e.preventDefault()
        await fetch('https://api.reddel.kz/send-email', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                    name: formData.first_name,
                    phone_number: phone,
                    party: formData.last_name,
                }
            )
        }).then(response => {
            alert("Завяка отправлена успешно")
        })
    }
    return (
    <div className="banner">
        <div className="banner-desk">
            <div className="banner-left">
                <h1>{t("Оплатите счет электронным сертификатом в рассрочку")}</h1>
                <p>{t("Выберите заведение и оформите безналичную рассрочку или кредит онлайн")} </p>
                <div className="banner-left-frame">
                    <img src={O} alt="" />
                    <img src={dot} alt="" />
                    <img src={O} alt="" />
                    <img src={dot} alt="" />
                    <img src={O6} alt="" />

                </div>
            </div>
            <div className="banner-right">
                <img src={banner} alt="banner" />
            </div>
        </div>
        <div className="banner-mob">
            <div>
                <h2>Закажите обратный звонок</h2>
                <p>Мы ответим на все ваши вопросы по телефону </p>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="first_name"
                    placeholder="Имя"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required={true}
                />
                <InputMask
                    mask="+7 (***) ***-**-**" // Define your desired phone number mask
                    maskChar="_" // Use underscore (_) or any character you prefer for unfilled positions
                    placeholder="+7 (___) ___-__-__" // Display a placeholder for user guidance
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={true}
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Какое мероприятие планируете?"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required={true}
                />
                <button type="submit">Отправить</button>
            </form>
            {/*<img src={bannerMob} />*/}
        </div>
    </div>
  );
}

export default Banner;
