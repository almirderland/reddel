import React, {useRef, useEffect, useState} from "react";
import "./CerfModal.css";
import Frame from '../../assets/Frame.svg';
import {useNavigate} from "react-router-dom";
import VerificationCode from "../verificationCode/VerificationCode";
import axios from "axios";
import Freedom from "../../assets/Logo Credit.png";
import InputMask from "react-input-mask";
import Loading from "react-fullscreen-loading";
import {useTranslation} from "react-i18next";

function  CerfModal({ onClose, prices, restaurant_id }) {
    const {t, i18n} = useTranslation();
    const modalRef = useRef(null);
    const navigate = useNavigate();
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [showVerification, setShowVerification] = useState(false)
    const [showIIN, setShowIIN] = useState(false)
    const [reject, setReject] = useState(null)
    const [phone, setPhone] = useState("")
    const [iinOk, setIINOk] = useState(true)
    const [iin, setIIN] = useState("")
    const [month, setMonth] = useState(-1)
    const [showLoader, setShowLoader] = useState(false)
    const [userId, setId] = useState(null)
    let number = ''
    let [user, setUser] = useState({
        "email": "",
        "first_name": "",
        "last_name": "",
        "username": "",
        "phone_number": ""
    });
    const [phone_number, setNumber] = useState('')

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const sendAgain = () => {
        console.log(iin + "  " + number)
        fetch('https://api.ffin.credit/ffc-api-public/universal/general/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "JWT " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                'iin': iin,
                'mobile_phone': '+' + phone_number
            })
        })
            .then((response) =>{
                console.log(iin + "  " + phone_number)
                console.log(response)
            })
            .catch((error) =>{
                console.log(('error'))
            })
    }
    const handleIINChange = (e) => {
        setIIN(e.target.value);
    };
    const waitForRedirect = async (uuid) => {
        console.log("HERE WE GO AGAIN")
        try{
            await fetch('https://api.reddel.kz/redirect_user/' + uuid, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    const url = data.url;
                    console.log(url)
                    setShowLoader(false)
                    if (url) {
                        if (url['0'] == 'h')
                            window.location.href = url;
                        else {
                            alert(url)
                            navigate('/')
                        }
                    }
                })
                .catch (async (error) => {
                    setTimeout(() => {
                        waitForRedirect(uuid)
                    }, 10000);
                })
        }
        catch (error){
            setTimeout(() => {
                waitForRedirect()
            }, 10000);
        }

    }
    const handlePriceSelection = (price) => {
        console.log(price)
        setShowIIN(true)
        setSelectedPrice(price);
        setShowIIN(month > 0 && price > 0)
    };
    const handleMonth = (price) => {
        setMonth(price);
        setShowIIN(price > 0 && selectedPrice > 0)
    };
    const handleVerification = (id) => {
        let flag = false
        fetch('https://api.ffin.credit/ffc-api-public/universal/general/validate-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "JWT " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                'iin': iin,
                'mobile_phone': '+' + phone_number,
                'code' : id[0].toString() + id[1].toString() + id[2].toString() + id[3].toString()
            })
        })
            .then((response) =>{
                return response.json()
            })
            .then(data => {
                console.log(data)
                if(!data.success){
                    alert('Неверый код')
                }
                else
                fetch('https://api.ffin.credit/ffc-api-public/universal/apply/apply-lead', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "JWT " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        'iin': iin,
                        'mobile_phone': '+' + phone_number,
                        'product': 'REDDEL',
                        'channel': 'REDDEL_WEB',
                        'partner': 'REDDEL',
                        'credit_params': {
                            'period': month,
                            'principal' : selectedPrice,
                        },
                        'additional_information': {
                            'hook_url': 'http://api.reddel.kz:8000/handle',
                            'success_url': 'https://reddel.kz/profile',
                            'failure_url': 'https://reddel.kz/profile'
                        },
                        'credit_goods': [{'cost': selectedPrice}],
                        'reference_id': userId,
                    })
                })
                    .then((response) => {
                        flag = response.ok
                        return response.json();
                    })
                    .then(data => {
                        console.log(data.uuid)
                        if(flag) {
                            setShowLoader(true)
                            fetch('https://api.reddel.kz/set_status_data', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body:JSON.stringify({
                                    uuid: data.uuid,
                                    user_id: user.id,
                                    restaurant_id: restaurant_id,
                                    sum: selectedPrice,
                                    period: month
                                })
                            })
                            setTimeout(() => {
                                waitForRedirect(data.uuid)
                            }, 20000);
                        }
                    })
                    .catch((error) =>{
                        console.log(error.message)
                    })
            })

    }
    const create_certificate = async (e) => {
        setShowLoader(true)
        fetch('https://api.reddel.kz/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'jwt': localStorage.getItem('accessToken')})
        })
            .then((response) => {
                if(response.status != '200')
                    navigate('/login')
                return response.json();
            })
            .then((data) => {
                console.log(data)
                setNumber(data.phone_number)
                setId(data.id)
                setUser(data)
                localStorage.setItem('userId', data.id)
                number=data.phone_number
            })
            .catch((error) => {
                navigate('/login')
            });
        if(selectedPrice==null || iin.length < 12)
            return
        e.preventDefault();
        await fetch('https://api.ffin.credit/ffc-api-auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': 'reddel@ffin.credit',
                'password': '3TxAA5@rsA9M$*yw'
            })
        })
            .then(async (response) => {
                let jwt = await response.json()
                console.log(jwt.access)
                localStorage.setItem("jwt", jwt.access)
            })
        fetch('https://api.ffin.credit/ffc-api-public/universal/general/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "JWT " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                'iin': iin,
                'mobile_phone': '+' + number
            })
        })
            .then((response) =>{
                setShowLoader(false)
                console.log(response)
                if(showIIN) {
                    setShowVerification(response.ok)
                    setIINOk(response.ok)
                }
            })
            .catch((error) =>{
                console.log(('error'))
            })
    };
    
    return (
    <div className="cerf-modal">
        <div className="cerf-modal-content" ref={modalRef}>
            <h5 className="h5">{t("Сертификат в рассрочку на сумму")}</h5>
            <div className='price'>
                {prices && prices.map((item, index) => (
                    <span
                        key={index}
                        onClick={() => handlePriceSelection(item)}
                        className={selectedPrice === item ? 'selected-price' : ''}
                    >
                            <p>{item} ₸</p>
                        </span>
                ))}
            </div>
            <h5 className="h5">{t("На срок")}</h5>
            <div className='price'>
                        <span className={month === 3 ? 'selected-price' : ''} onClick={()  => handleMonth(3)}>
                            <p>3 {t("месяца")}</p>
                        </span>
                <span className={month === 6 ? 'selected-price' : ''} onClick={()  => handleMonth(6)}>
                            <p>6 {t("месяцев")}</p>
                        </span>
            </div>
            <div className='certificate'>
                <img src={Frame} alt="random" />
                <span>{t("Сертификатом можно оплатить 1 счет")}</span>
            </div>
            <img src={Freedom} alt="random" width={'150px'}/>

            { showIIN ? (
                <form>
                    <label htmlFor="inputField">Введите иин:</label>
                    <br></br>
                    <br></br>
                    <InputMask
                        type="integer"
                        mask="* * * * * * * * * * * *"
                        maskChar=" "
                        placeholder="_ _ _ _ _ _ _ _ _ _ _ _"
                        value={iin}
                        onChange={(e) => {
                            const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                            setIIN(numbersOnly)
                        }
                        }
                        className="input_iin"
                    />
                    {/*<input type="text" value={iin} onChange={handleIINChange} name="code" minLength="12" maxLength="12" required></input>*/}
                    <br></br>
                    <br></br>

                    <button className='certificate-button' type={"submit"} onClick={create_certificate}>{t("Оформить")}</button>
                </form>) : (
                <a>{t("Выберите сумму")}</a>
            )

            }
            { !showIIN ? <button className='certificate-button' onClick={create_certificate}>{t("Оформить")}</button> : (<a></a>)}
        </div>
        {showVerification && <VerificationCode handleVerification={handleVerification} sendAgain={sendAgain}/>}
        {showLoader ? <Loading loading background="" loaderColor="#3498db"/>: (<a></a>)}

    </div>
  );
}

export default CerfModal;
