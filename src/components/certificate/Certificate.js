import React, {useRef, useEffect, useState} from "react";
import "./Certificate.css";

import Logo from '../../assets/Logo.svg';
import done from '../../assets/done.svg';
import done2 from '../../assets/done2.svg';
import done3 from '../../assets/done3.svg';

import Frame2 from '../../assets/Frame2.svg';
import {useTranslation} from "react-i18next";
import Loading from "react-fullscreen-loading";

function Certificate(props) {
    const certificateRef = useRef();
    const [selectedOption, setSelectedOption] = useState(props.restaurants[0].id);
    const [showLoader, setShowLoader] = useState(false)

    const handleSelectChange = (event) => {
        console.log(event.target.value)
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    };
    const activate = (() => {
        setShowLoader(true)
        console.log(props.certificate.id + " " + selectedOption)
        fetch('https://api.reddel.kz/activate_certificate/' + props.certificate.id + "/" + selectedOption, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => {
            console.log(response)
            setShowLoader(false)
        }).then(data => {
            console.log(data)
            window.location.reload(false)
        })
    })
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (certificateRef.current && !certificateRef.current.contains(event.target)) {
                props.onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [props.onClose]);
    const {t, i18n} = useTranslation();

    return (
    <div className="cerf-modal">
        <div ref={certificateRef} className="certification">
            <img src={Logo} alt="logo" />
                {props.certificate.status?
                    (
                        <div className="certification-header">
                        <img src={done2} alt='123' />
                        <span>{t("Воспользуйтесь до")} {props.certificate.end_date.substring(0,10).replaceAll('-', '.')} {t("дейін іске қосылды")}</span>
                        </div>

                    ):
                    <div className="certification-header">
                    <img src={done} alt="done" />
                    <span>{t("Активируйте до")} 29.12.2023 {t("дейін іске қосыңыз")}</span>
                    </div>
                }
            <h4>{t("Поздравляем")}! <br/> {t("Вы успешно оформили уникальный сертификат")} </h4>
            <p>{t("Ваш код")}:</p>
            {props.certificate.status && <h3>{props.certificate.encode.substring(0,10)}</h3>}
            <p>{t("Покажите его администратору заведения")}  </p>
            <div className='info last'>
                <span>{t("Сумма сертификата")}</span>
                <h5>{props.certificate.sum} ₸</h5>
            </div>
            <div className='info last'>
                <span>Клиент</span>
                <h5>{props.user.first_name} {props.user.last_name}</h5>
            </div>
            <div className='info last'>
                <span>Телефон</span>
                <h5>{"8" + props.user.phone_number.substring(1)}</h5>
            </div>
            <div className='info'>
                <span>{t("В заведении")}</span>
                {!props.certificate.status?
                    (
                <select value={selectedOption} onChange={handleSelectChange}>
                    {props.restaurants.map(restaurant =>
                        <option value={restaurant.id}>{restaurant.title}</option>
                    )}
                </select>
                    ) :
                    <h5>
                        {props.certificate.restaurant}
                    </h5>
                }
            </div>
            <div className='attention'>
                <img src={Frame2} alt="frame" />
                <ul>
                    <li>{t("Активацию нельзя отменить")}</li>
                    <li>{t("Сертификат нельзя обналичить")}</li>
                    <li>{t("Сертификат действителен 6 месяцев")} </li>
                    <li>{t("Использовать сумму можно только для оплаты одного счета в заведении")}</li>
                </ul>
            </div>
            {!props.certificate.status?
                (<a className="activate" onClick={activate}>Активировать</a>) : <a></a>}
        </div>
        {showLoader ? <Loading loading background="" loaderColor="#3498db" > Банк принимает решение </Loading> : (<a></a>)}
    </div>
  );
}

export default Certificate;
