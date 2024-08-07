import Logo from "../../assets/Logo.svg";
import React, {useRef, useState} from "react";
import "./Landing.css";
import InputMask from "react-input-mask";
import {useTranslation} from "react-i18next";
import TermsAndConditions from "../TermsAndConditions/TermsAndConditions";
import Loading from "react-fullscreen-loading";
import VerificationCode from "../../components/verificationCode/VerificationCode";
import {useNavigate} from "react-router-dom";



function Landing2() {
    const [selectedAmount, setSelectedAmount] = useState('');
    const [phone, setPhone] = useState('')
    const [iin, setIIN] = useState("")
    const [month, setMonth] = useState(-1)
    const {t, i18n} = useTranslation();
    const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
    const [agreementChecked, setAgreementChecked] = useState(false)
    const modalRef = useRef(null);
    const navigate = useNavigate();
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [showVerification, setShowVerification] = useState(false)
    const [showIIN, setShowIIN] = useState(false)
    const [reject, setReject] = useState(null)
    const [iinOk, setIINOk] = useState(true)
    const [showLoader, setShowLoader] = useState(false)
    const [userId, setId] = useState(null)
    let number = ''
    const [formData, setFormData] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "phone_number": ""
    });

    let [user, setUser] = useState({
        "email": "",
        "first_name": "",
        "last_name": "",
        "username": "",
        "phone_number": ""
    });
    const closeTermsAndConditions = () => {
        setShowTermsAndConditions(false);
    };

    const handleMonth = (price) => {
        setMonth(price);
    };
    const sendAgain = async () => {
        console.log(iin + "  " + number)
        await ('https://api.ffin.credit/ffc-api-public/universal/general/send-otp', {
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
    const handleSubmit = async (e) => {
        formData.phone_number = phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '').replaceAll('+', '')
        await fetch('https://api.reddel.kz/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"phone_number": formData.phone_number.replaceAll(/[^0-9]/g, '')})
        }).then((response) => {
            return response.json()
        }).then(async (data) => {
            if (data.token) {
                localStorage.setItem('accessToken', data.token)
                await fetch('https://api.reddel.kz/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({'jwt': localStorage.getItem('accessToken')})
                })
                    .then((response) => {
                        return response.json();
                    })
                    .then(async (data) => {
                        console.log("DATA: " + data)
                        console.log(data.id)
                        await setNumber(data.phone_number)
                        await setId(data.id)
                        await setUser(data)
                        user = data
                        console.log(user)
                        localStorage.setItem('userId', data.id)
                    })
            } else {
                console.log("FUCK ME FUCK ME")
                await fetch("https://api.reddel.kz/checkUser", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                })
                    .then(async (response) => {
                        formData.phone_number = phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '').replaceAll('+', '')
                        await fetch("https://api.reddel.kz/register", {
                            method: 'POST',
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formData)
                        })
                            .then((response) => {
                                return response.json()
                            })
                            .then(async data => {
                                if (data) {
                                    localStorage.setItem('accessToken', data.token)
                                    await fetch('https://api.reddel.kz/user', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({'jwt': localStorage.getItem('accessToken')})
                                    })
                                        .then((response) => {
                                            return response.json();
                                        })
                                        .then(async (data) => {
                                            console.log("DATA: " + data)
                                            setNumber(data.phone_number)
                                            setId(data.id)
                                            await setUser(data)
                                            user = data
                                            console.log(user)
                                            localStorage.setItem('userId', data.id)
                                        })
                                }
                            })
                    }).catch(error => {
                        setShowVerification(false)
                        setShowLoader(false)
                        setShowError(true)
                    })
            }
        })

    };
    const InputField = ({ label, type, name }) => (
        <div>
            <input type={type} name={name} placeholder={label} />
        </div>
    );

    const InstallmentButton = ({ amount, selectedAmount, setSelectedAmount }) => (
        <button
            className={`amount ${amount === selectedAmount ? 'selected' : ''}`}
            onClick={() => setSelectedAmount(amount)}
        >
            {`${amount} ₸`}
        </button>
    );

    const [phone_number, setNumber] = useState('')
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
    const handleVerification = async (id) => {
        let flag = false
        await fetch('https://api.ffin.credit/ffc-api-public/universal/general/validate-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "JWT " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                'iin': iin,
                'mobile_phone': phone,
                'code': id[0].toString() + id[1].toString() + id[2].toString() + id[3].toString()
            })
        })
            .then((response) => {
                return response.json()
            })
            .then(async data => {
                console.log(data)
                if (!data.success) {
                    return
                }
                await handleSubmit()
                if(!user.id){
                    setShowLoader(false)
                    return
                }
                console.log("User" + await user.id)
                await fetch('https://api.ffin.credit/ffc-api-public/universal/apply/apply-lead', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "JWT " + localStorage.getItem("jwt")
                    },
                    body: JSON.stringify({
                        'iin': iin,
                        'mobile_phone': phone,
                        'product': 'REDDEL',
                        'channel': 'REDDEL_WEB',
                        'partner': 'REDDEL',
                        'credit_params': {
                            'period': month,
                            'principal': selectedPrice,
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
                    .then(async data => {
                        console.log(data.uuid)
                        if (flag) {
                            setShowLoader(true)
                            await fetch('https://api.reddel.kz/set_status_data', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    uuid: data.uuid,
                                    user_id: user.id,
                                    restaurant_id: 1,
                                    sum: selectedPrice,
                                    period: month
                                })
                            })
                            setTimeout(() => {
                                waitForRedirect(data.uuid)
                            }, 20000);
                        }
                    })
                    .catch((error) => {
                        console.log(error.message)
                    })
            })
    }
    const create_certificate = async (e) => {
        if(selectedAmount==null || iin.length < 12)
            return
        setSelectedPrice(parseInt(selectedAmount) * 1000)
        setShowLoader(true)

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
                console.log(iin, phone)
                localStorage.setItem("jwt", jwt.access)
            })
        await fetch('https://api.ffin.credit/ffc-api-public/universal/general/send-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "JWT " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                'iin': iin,
                'mobile_phone': phone
            })
        })
            .then((response) =>{
                if (!response.ok){
                    setIINError(true)
                }
                setShowLoader(false)
                console.log(response)
                setShowVerification(response.ok)
                setIINOk(response.ok)
            })
            .catch((error) =>{
                console.log(('error'))
            })
    };

    const SubmitButton = () => (
        <button className="submit" type="submit" onClick={create_certificate}>Подать заявку</button>
    );
    const [showError, setShowError] = useState('')
    const [showIINError, setIINError] = useState('')
    const handleInputChange = (e) => {
        setShowError(false)
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    return (
        <div className="main-cont">
            <div className="center">
                <img src={Logo} alt=""/>
            </div>
            <p className="text1">
                Сертификаты reddel помогут посетить рестораны, караоке и зоны отдыха наших партнеров в рассрочку 0% без
                переплат!
            </p>
            <h3 className="row">Заявка на сертификат</h3>
            <form>
                <div className="row">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Имя"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required={true}
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Фамилия"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required={true}
                    />

                    <InputMask
                        type="integer"
                        mask="* * * * * * * * * * * *"
                        maskChar=" "
                        placeholder="ИИН"
                        value={iin}
                        onChange={(e) => {
                            const numbersOnly = e.target.value.replace(/[^0-9]/g, '');
                            setIIN(numbersOnly)
                        }
                        }
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
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
                </div>
                <h3 className="row-amount">Сумма расрочки:</h3>

                <div className="row-amount">
                    <InstallmentButton amount="300 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                    <InstallmentButton amount="400 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                    <InstallmentButton amount="100 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                </div>
                <div className="row-amount">
                    <InstallmentButton amount="500 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                    <InstallmentButton amount="600 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                    <InstallmentButton amount="700 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                </div>
                <div className="row-amount">
                    <InstallmentButton amount="800 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                    <InstallmentButton amount="900 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                    <InstallmentButton amount="1000 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                </div>
                <div className="row-amount">
                    <InstallmentButton amount="1500 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                    <InstallmentButton amount="2000 000" selectedAmount={selectedAmount}
                                       setSelectedAmount={setSelectedAmount}/>
                </div>

                <svg className="margin5" width="207" height="16" viewBox="0 0 207 16" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8.04425" r="5.33333" stroke="#3153CA" stroke-width="1.33333"/>
                    <path
                        d="M8.04314 4.77162C8.32053 4.77162 8.54541 4.9965 8.54541 5.2739C8.54541 5.55129 8.32053 5.77617 8.04314 5.77617L7.95677 5.77617C7.67938 5.77617 7.4545 5.55129 7.4545 5.2739C7.4545 4.9965 7.67938 4.77162 7.95677 4.77162L8.04314 4.77162ZM7.99996 6.40799C8.3012 6.40799 8.54541 6.6522 8.54541 6.95344L8.54541 10.7716C8.54541 11.0729 8.3012 11.3171 7.99996 11.3171C7.69871 11.3171 7.4545 11.0729 7.4545 10.7716L7.4545 6.95344C7.4545 6.6522 7.69871 6.40799 7.99996 6.40799Z"
                        fill="#3153CA"/>
                    <path
                        d="M23.705 12.15C22.985 12.15 22.3717 11.9933 21.865 11.68C21.3583 11.3633 20.97 10.9233 20.7 10.36C20.4333 9.79667 20.3 9.14333 20.3 8.4C20.3 7.65667 20.4333 7.00333 20.7 6.44C20.97 5.87667 21.3583 5.43833 21.865 5.125C22.3717 4.80833 22.985 4.65 23.705 4.65C24.535 4.65 25.2217 4.86 25.765 5.28C26.3117 5.7 26.6917 6.265 26.905 6.975L25.845 7.26C25.705 6.75667 25.455 6.36167 25.095 6.075C24.7383 5.78833 24.275 5.645 23.705 5.645C23.195 5.645 22.77 5.76 22.43 5.99C22.09 6.22 21.8333 6.54167 21.66 6.955C21.49 7.36833 21.405 7.85 21.405 8.4C21.4017 8.95 21.485 9.43167 21.655 9.845C21.8283 10.2583 22.085 10.58 22.425 10.81C22.7683 11.04 23.195 11.155 23.705 11.155C24.275 11.155 24.7383 11.0117 25.095 10.725C25.455 10.435 25.705 10.04 25.845 9.54L26.905 9.825C26.6917 10.535 26.3117 11.1 25.765 11.52C25.2217 11.94 24.535 12.15 23.705 12.15ZM30.3997 12.15C29.863 12.15 29.3914 12.0333 28.9847 11.8C28.5814 11.5633 28.2664 11.235 28.0397 10.815C27.8164 10.3917 27.7047 9.90167 27.7047 9.345C27.7047 8.755 27.8147 8.24333 28.0347 7.81C28.258 7.37667 28.568 7.04167 28.9647 6.805C29.3614 6.56833 29.823 6.45 30.3497 6.45C30.8997 6.45 31.368 6.57833 31.7547 6.835C32.1414 7.08833 32.4297 7.45 32.6197 7.92C32.813 8.39 32.8897 8.94833 32.8497 9.595H31.8047V9.215C31.798 8.58833 31.678 8.125 31.4447 7.825C31.2147 7.525 30.863 7.375 30.3897 7.375C29.8664 7.375 29.473 7.54 29.2097 7.87C28.9464 8.2 28.8147 8.67667 28.8147 9.3C28.8147 9.89333 28.9464 10.3533 29.2097 10.68C29.473 11.0033 29.853 11.165 30.3497 11.165C30.6764 11.165 30.958 11.0917 31.1947 10.945C31.4347 10.795 31.6214 10.5817 31.7547 10.305L32.7797 10.63C32.5697 11.1133 32.2514 11.4883 31.8247 11.755C31.398 12.0183 30.923 12.15 30.3997 12.15ZM28.4747 9.595V8.78H32.3297V9.595H28.4747ZM36.5065 12.15C35.9898 12.15 35.5565 12.025 35.2065 11.775C34.8565 11.5217 34.5915 11.18 34.4115 10.75C34.2315 10.32 34.1415 9.835 34.1415 9.295C34.1415 8.755 34.2298 8.27 34.4065 7.84C34.5865 7.41 34.8498 7.07167 35.1965 6.825C35.5465 6.575 35.9765 6.45 36.4865 6.45C36.9932 6.45 37.4298 6.575 37.7965 6.825C38.1665 7.07167 38.4515 7.41 38.6515 7.84C38.8515 8.26667 38.9515 8.75167 38.9515 9.295C38.9515 9.835 38.8515 10.3217 38.6515 10.755C38.4548 11.185 38.1732 11.525 37.8065 11.775C37.4432 12.025 37.0098 12.15 36.5065 12.15ZM33.9665 14.4V6.6H34.8965V10.485H35.0165V14.4H33.9665ZM36.3615 11.205C36.6948 11.205 36.9698 11.12 37.1865 10.95C37.4065 10.78 37.5698 10.5517 37.6765 10.265C37.7865 9.975 37.8415 9.65167 37.8415 9.295C37.8415 8.94167 37.7865 8.62167 37.6765 8.335C37.5698 8.04833 37.4048 7.82 37.1815 7.65C36.9582 7.48 36.6732 7.395 36.3265 7.395C35.9998 7.395 35.7298 7.475 35.5165 7.635C35.3065 7.795 35.1498 8.01833 35.0465 8.305C34.9465 8.59167 34.8965 8.92167 34.8965 9.295C34.8965 9.66833 34.9465 9.99833 35.0465 10.285C35.1465 10.5717 35.3048 10.7967 35.5215 10.96C35.7382 11.1233 36.0182 11.205 36.3615 11.205ZM41.4505 12V7.54H39.6055V6.6H44.3405V7.54H42.4955V12H41.4505ZM49.8398 6.6V12H48.8348V8.245L46.1348 12H45.2848V6.6H46.2898V10.28L48.9948 6.6H49.8398ZM53.7771 14.25V12.095C53.2504 12.1783 52.7721 12.1217 52.3421 11.925C51.9121 11.7283 51.5704 11.4083 51.3171 10.965C51.0638 10.5217 50.9371 9.96833 50.9371 9.305C50.9371 8.64167 51.0638 8.08667 51.3171 7.64C51.5704 7.19333 51.9121 6.87167 52.3421 6.675C52.7721 6.47833 53.2504 6.42167 53.7771 6.505V4.87H54.7171V6.505C55.2438 6.42167 55.7221 6.47833 56.1521 6.675C56.5821 6.87167 56.9238 7.19333 57.1771 7.64C57.4304 8.08667 57.5571 8.64167 57.5571 9.305C57.5571 9.96833 57.4304 10.5217 57.1771 10.965C56.9238 11.4083 56.5821 11.7283 56.1521 11.925C55.7221 12.1217 55.2438 12.1783 54.7171 12.095V14.25H53.7771ZM53.7771 11.15V7.455C53.5071 7.40833 53.2621 7.41667 53.0421 7.48C52.8254 7.54333 52.6404 7.655 52.4871 7.815C52.3338 7.97167 52.2154 8.17667 52.1321 8.43C52.0488 8.68 52.0071 8.97167 52.0071 9.305C52.0071 9.63833 52.0488 9.93 52.1321 10.18C52.2188 10.43 52.3404 10.635 52.4971 10.795C52.6571 10.9517 52.8454 11.0617 53.0621 11.125C53.2788 11.185 53.5171 11.1933 53.7771 11.15ZM54.7171 11.15C54.9771 11.1933 55.2154 11.185 55.4321 11.125C55.6488 11.065 55.8354 10.9567 55.9921 10.8C56.1521 10.6433 56.2738 10.44 56.3571 10.19C56.4438 9.93667 56.4871 9.64167 56.4871 9.305C56.4871 8.965 56.4454 8.67 56.3621 8.42C56.2788 8.16667 56.1604 7.96167 56.0071 7.805C55.8538 7.645 55.6671 7.535 55.4471 7.475C55.2304 7.415 54.9871 7.40833 54.7171 7.455V11.15ZM63.209 6.6V12H62.204V8.245L59.504 12H58.654V6.6H59.659V10.28L62.364 6.6H63.209ZM64.6013 12L64.6063 6.6H65.6663V9.2L67.7863 6.6H69.1163L66.8763 9.3L69.3463 12H67.9263L65.6663 9.4V12H64.6013ZM71.3754 12.15C70.9754 12.15 70.6404 12.0767 70.3704 11.93C70.1004 11.78 69.8954 11.5833 69.7554 11.34C69.6187 11.0933 69.5504 10.8233 69.5504 10.53C69.5504 10.2567 69.5987 10.0167 69.6954 9.81C69.7921 9.60333 69.9354 9.42833 70.1254 9.285C70.3154 9.13833 70.5487 9.02 70.8254 8.93C71.0654 8.86 71.3371 8.79833 71.6404 8.745C71.9437 8.69167 72.2621 8.64167 72.5954 8.595C72.9321 8.54833 73.2654 8.50167 73.5954 8.455L73.2154 8.665C73.2221 8.24167 73.1321 7.92833 72.9454 7.725C72.7621 7.51833 72.4454 7.415 71.9954 7.415C71.7121 7.415 71.4521 7.48167 71.2154 7.615C70.9787 7.745 70.8137 7.96167 70.7204 8.265L69.7454 7.965C69.8787 7.50167 70.1321 7.13333 70.5054 6.86C70.8821 6.58667 71.3821 6.45 72.0054 6.45C72.4887 6.45 72.9087 6.53333 73.2654 6.7C73.6254 6.86333 73.8887 7.12333 74.0554 7.48C74.1421 7.65667 74.1954 7.84333 74.2154 8.04C74.2354 8.23667 74.2454 8.44833 74.2454 8.675V12H73.3204V10.765L73.5004 10.925C73.2771 11.3383 72.9921 11.6467 72.6454 11.85C72.3021 12.05 71.8787 12.15 71.3754 12.15ZM71.5604 11.295C71.8571 11.295 72.1121 11.2433 72.3254 11.14C72.5387 11.0333 72.7104 10.8983 72.8404 10.735C72.9704 10.5717 73.0554 10.4017 73.0954 10.225C73.1521 10.065 73.1837 9.885 73.1904 9.685C73.2004 9.485 73.2054 9.325 73.2054 9.205L73.5454 9.33C73.2154 9.38 72.9154 9.425 72.6454 9.465C72.3754 9.505 72.1304 9.545 71.9104 9.585C71.6937 9.62167 71.5004 9.66667 71.3304 9.72C71.1871 9.77 71.0587 9.83 70.9454 9.9C70.8354 9.97 70.7471 10.055 70.6804 10.155C70.6171 10.255 70.5854 10.3767 70.5854 10.52C70.5854 10.66 70.6204 10.79 70.6904 10.91C70.7604 11.0267 70.8671 11.12 71.0104 11.19C71.1537 11.26 71.3371 11.295 71.5604 11.295ZM76.9388 12V7.54H75.0938V6.6H79.8288V7.54H77.9838V12H76.9388ZM83.0255 12.15C82.4855 12.15 82.0171 12.0283 81.6205 11.785C81.2238 11.5417 80.9171 11.2067 80.7005 10.78C80.4871 10.35 80.3805 9.855 80.3805 9.295C80.3805 8.73167 80.4905 8.23667 80.7105 7.81C80.9305 7.38 81.2388 7.04667 81.6355 6.81C82.0321 6.57 82.4955 6.45 83.0255 6.45C83.5655 6.45 84.0338 6.57167 84.4305 6.815C84.8271 7.05833 85.1338 7.39333 85.3505 7.82C85.5671 8.24667 85.6755 8.73833 85.6755 9.295C85.6755 9.85833 85.5655 10.355 85.3455 10.785C85.1288 11.2117 84.8221 11.5467 84.4255 11.79C84.0288 12.03 83.5621 12.15 83.0255 12.15ZM83.0255 11.165C83.5421 11.165 83.9271 10.9917 84.1805 10.645C84.4371 10.295 84.5655 9.845 84.5655 9.295C84.5655 8.73167 84.4355 8.28167 84.1755 7.945C83.9188 7.605 83.5355 7.435 83.0255 7.435C82.6755 7.435 82.3871 7.515 82.1605 7.675C81.9338 7.83167 81.7655 8.05 81.6555 8.33C81.5455 8.60667 81.4905 8.92833 81.4905 9.295C81.4905 9.86167 81.6205 10.315 81.8805 10.655C82.1405 10.995 82.5221 11.165 83.0255 11.165ZM86.7692 12V6.6H87.6442L89.6392 10.56L91.6292 6.6H92.5092V12H91.4992V8.74L89.8742 12H89.3992L87.7742 8.74V12H86.7692ZM95.9098 12V6.6H96.7848L98.7798 10.56L100.77 6.6H101.65V12H100.64V8.74L99.0148 12H98.5398L96.9148 8.74V12H95.9098ZM105.399 12.15C104.859 12.15 104.39 12.0283 103.994 11.785C103.597 11.5417 103.29 11.2067 103.074 10.78C102.86 10.35 102.754 9.855 102.754 9.295C102.754 8.73167 102.864 8.23667 103.084 7.81C103.304 7.38 103.612 7.04667 104.009 6.81C104.405 6.57 104.869 6.45 105.399 6.45C105.939 6.45 106.407 6.57167 106.804 6.815C107.2 7.05833 107.507 7.39333 107.724 7.82C107.94 8.24667 108.049 8.73833 108.049 9.295C108.049 9.85833 107.939 10.355 107.719 10.785C107.502 11.2117 107.195 11.5467 106.799 11.79C106.402 12.03 105.935 12.15 105.399 12.15ZM105.399 11.165C105.915 11.165 106.3 10.9917 106.554 10.645C106.81 10.295 106.939 9.845 106.939 9.295C106.939 8.73167 106.809 8.28167 106.549 7.945C106.292 7.605 105.909 7.435 105.399 7.435C105.049 7.435 104.76 7.515 104.534 7.675C104.307 7.83167 104.139 8.05 104.029 8.33C103.919 8.60667 103.864 8.92833 103.864 9.295C103.864 9.86167 103.994 10.315 104.254 10.655C104.514 10.995 104.895 11.165 105.399 11.165ZM108.401 12L110.481 9.3L108.516 6.6H109.666L111.546 9.235V6.6H112.486V9.235L114.366 6.6H115.521L113.556 9.3L115.636 12H114.421L112.486 9.365V12H111.546V9.365L109.616 12H108.401ZM116.427 12V6.6H117.472V8.805H120.107V6.6H121.152V12H120.107V9.79H117.472V12H116.427ZM124.9 12.15C124.36 12.15 123.892 12.0283 123.495 11.785C123.099 11.5417 122.792 11.2067 122.575 10.78C122.362 10.35 122.255 9.855 122.255 9.295C122.255 8.73167 122.365 8.23667 122.585 7.81C122.805 7.38 123.114 7.04667 123.51 6.81C123.907 6.57 124.37 6.45 124.9 6.45C125.44 6.45 125.909 6.57167 126.305 6.815C126.702 7.05833 127.009 7.39333 127.225 7.82C127.442 8.24667 127.55 8.73833 127.55 9.295C127.55 9.85833 127.44 10.355 127.22 10.785C127.004 11.2117 126.697 11.5467 126.3 11.79C125.904 12.03 125.437 12.15 124.9 12.15ZM124.9 11.165C125.417 11.165 125.802 10.9917 126.055 10.645C126.312 10.295 126.44 9.845 126.44 9.295C126.44 8.73167 126.31 8.28167 126.05 7.945C125.794 7.605 125.41 7.435 124.9 7.435C124.55 7.435 124.262 7.515 124.035 7.675C123.809 7.83167 123.64 8.05 123.53 8.33C123.42 8.60667 123.365 8.92833 123.365 9.295C123.365 9.86167 123.495 10.315 123.755 10.655C124.015 10.995 124.397 11.165 124.9 11.165ZM132.996 12.15C132.456 12.15 131.988 12.0283 131.591 11.785C131.195 11.5417 130.888 11.2067 130.671 10.78C130.458 10.35 130.351 9.855 130.351 9.295C130.351 8.73167 130.461 8.23667 130.681 7.81C130.901 7.38 131.21 7.04667 131.606 6.81C132.003 6.57 132.466 6.45 132.996 6.45C133.536 6.45 134.005 6.57167 134.401 6.815C134.798 7.05833 135.105 7.39333 135.321 7.82C135.538 8.24667 135.646 8.73833 135.646 9.295C135.646 9.85833 135.536 10.355 135.316 10.785C135.1 11.2117 134.793 11.5467 134.396 11.79C134 12.03 133.533 12.15 132.996 12.15ZM132.996 11.165C133.513 11.165 133.898 10.9917 134.151 10.645C134.408 10.295 134.536 9.845 134.536 9.295C134.536 8.73167 134.406 8.28167 134.146 7.945C133.89 7.605 133.506 7.435 132.996 7.435C132.646 7.435 132.358 7.515 132.131 7.675C131.905 7.83167 131.736 8.05 131.626 8.33C131.516 8.60667 131.461 8.92833 131.461 9.295C131.461 9.86167 131.591 10.315 131.851 10.655C132.111 10.995 132.493 11.165 132.996 11.165ZM136.74 12V6.6H141.295V12H140.25V7.585H137.785V12H136.74ZM142.192 12V11.115C142.392 11.1517 142.544 11.1467 142.647 11.1C142.754 11.05 142.832 10.96 142.882 10.83C142.936 10.7 142.981 10.5317 143.017 10.325C143.074 10.0217 143.122 9.67667 143.162 9.29C143.206 8.9 143.244 8.47833 143.277 8.025C143.311 7.57167 143.341 7.09667 143.367 6.6H147.247V12H146.197V7.585H144.307C144.287 7.84833 144.264 8.12833 144.237 8.425C144.214 8.71833 144.187 9.01 144.157 9.3C144.127 9.59 144.096 9.86167 144.062 10.115C144.029 10.3683 143.994 10.585 143.957 10.765C143.891 11.125 143.792 11.4117 143.662 11.625C143.536 11.835 143.356 11.97 143.122 12.03C142.889 12.0933 142.579 12.0833 142.192 12ZM150.174 12.15C149.774 12.15 149.439 12.0767 149.169 11.93C148.899 11.78 148.694 11.5833 148.554 11.34C148.418 11.0933 148.349 10.8233 148.349 10.53C148.349 10.2567 148.398 10.0167 148.494 9.81C148.591 9.60333 148.734 9.42833 148.924 9.285C149.114 9.13833 149.348 9.02 149.624 8.93C149.864 8.86 150.136 8.79833 150.439 8.745C150.743 8.69167 151.061 8.64167 151.394 8.595C151.731 8.54833 152.064 8.50167 152.394 8.455L152.014 8.665C152.021 8.24167 151.931 7.92833 151.744 7.725C151.561 7.51833 151.244 7.415 150.794 7.415C150.511 7.415 150.251 7.48167 150.014 7.615C149.778 7.745 149.613 7.96167 149.519 8.265L148.544 7.965C148.678 7.50167 148.931 7.13333 149.304 6.86C149.681 6.58667 150.181 6.45 150.804 6.45C151.288 6.45 151.708 6.53333 152.064 6.7C152.424 6.86333 152.688 7.12333 152.854 7.48C152.941 7.65667 152.994 7.84333 153.014 8.04C153.034 8.23667 153.044 8.44833 153.044 8.675V12H152.119V10.765L152.299 10.925C152.076 11.3383 151.791 11.6467 151.444 11.85C151.101 12.05 150.678 12.15 150.174 12.15ZM150.359 11.295C150.656 11.295 150.911 11.2433 151.124 11.14C151.338 11.0333 151.509 10.8983 151.639 10.735C151.769 10.5717 151.854 10.4017 151.894 10.225C151.951 10.065 151.983 9.885 151.989 9.685C151.999 9.485 152.004 9.325 152.004 9.205L152.344 9.33C152.014 9.38 151.714 9.425 151.444 9.465C151.174 9.505 150.929 9.545 150.709 9.585C150.493 9.62167 150.299 9.66667 150.129 9.72C149.986 9.77 149.858 9.83 149.744 9.9C149.634 9.97 149.546 10.055 149.479 10.155C149.416 10.255 149.384 10.3767 149.384 10.52C149.384 10.66 149.419 10.79 149.489 10.91C149.559 11.0267 149.666 11.12 149.809 11.19C149.953 11.26 150.136 11.295 150.359 11.295ZM155.738 12V7.54H153.893V6.6H158.628V7.54H156.783V12H155.738ZM164.127 6.6V12H163.122V8.245L160.422 12H159.572V6.6H160.577V10.28L163.282 6.6H164.127ZM166.919 12V7.54H165.074V6.6H169.809V7.54H167.964V12H166.919ZM170.754 12V6.6H171.804V8.475H172.869C173.022 8.475 173.185 8.47833 173.359 8.485C173.535 8.49167 173.687 8.50833 173.814 8.535C174.104 8.595 174.354 8.695 174.564 8.835C174.777 8.975 174.942 9.16167 175.059 9.395C175.175 9.625 175.234 9.90833 175.234 10.245C175.234 10.715 175.11 11.09 174.864 11.37C174.62 11.6467 174.29 11.8333 173.874 11.93C173.74 11.96 173.582 11.98 173.399 11.99C173.219 11.9967 173.054 12 172.904 12H170.754ZM171.804 11.16H172.964C173.047 11.16 173.142 11.1567 173.249 11.15C173.355 11.1433 173.454 11.1283 173.544 11.105C173.704 11.0583 173.847 10.9633 173.974 10.82C174.1 10.6767 174.164 10.485 174.164 10.245C174.164 9.99833 174.1 9.80167 173.974 9.655C173.85 9.50833 173.694 9.41333 173.504 9.37C173.414 9.34667 173.322 9.33167 173.229 9.325C173.135 9.31833 173.047 9.315 172.964 9.315H171.804V11.16ZM179.592 12V5.95L178.237 6.775V5.61L179.592 4.8H180.657V12H179.592ZM186.867 12.15C186.314 12.15 185.844 12.0267 185.457 11.78C185.071 11.5333 184.774 11.195 184.567 10.765C184.364 10.335 184.261 9.84667 184.257 9.3C184.261 8.74333 184.367 8.25167 184.577 7.825C184.787 7.395 185.087 7.05833 185.477 6.815C185.867 6.57167 186.336 6.45 186.882 6.45C187.472 6.45 187.976 6.59667 188.392 6.89C188.812 7.18333 189.089 7.585 189.222 8.095L188.182 8.395C188.079 8.09167 187.909 7.85667 187.672 7.69C187.439 7.52 187.171 7.435 186.867 7.435C186.524 7.435 186.242 7.51667 186.022 7.68C185.802 7.84 185.639 8.06 185.532 8.34C185.426 8.62 185.371 8.94 185.367 9.3C185.371 9.85667 185.497 10.3067 185.747 10.65C186.001 10.9933 186.374 11.165 186.867 11.165C187.204 11.165 187.476 11.0883 187.682 10.935C187.892 10.7783 188.052 10.555 188.162 10.265L189.222 10.515C189.046 11.0417 188.754 11.4467 188.347 11.73C187.941 12.01 187.447 12.15 186.867 12.15ZM193.436 12V10.12C193.253 10.2133 193.038 10.29 192.791 10.35C192.544 10.4067 192.284 10.435 192.011 10.435C191.458 10.435 191.013 10.3117 190.676 10.065C190.343 9.815 190.126 9.455 190.026 8.985C189.999 8.845 189.979 8.70167 189.966 8.555C189.953 8.405 189.944 8.26833 189.941 8.145C189.941 8.02167 189.941 7.93 189.941 7.87V6.6H191.001V7.87C191.001 7.95667 191.004 8.07167 191.011 8.215C191.018 8.355 191.036 8.49167 191.066 8.625C191.129 8.925 191.256 9.14833 191.446 9.295C191.636 9.43833 191.904 9.51 192.251 9.51C192.501 9.51 192.726 9.47833 192.926 9.415C193.129 9.34833 193.299 9.26333 193.436 9.16V6.6H194.491V12H193.436ZM198.29 12.15C197.754 12.15 197.282 12.0333 196.875 11.8C196.472 11.5633 196.157 11.235 195.93 10.815C195.707 10.3917 195.595 9.90167 195.595 9.345C195.595 8.755 195.705 8.24333 195.925 7.81C196.149 7.37667 196.459 7.04167 196.855 6.805C197.252 6.56833 197.714 6.45 198.24 6.45C198.79 6.45 199.259 6.57833 199.645 6.835C200.032 7.08833 200.32 7.45 200.51 7.92C200.704 8.39 200.78 8.94833 200.74 9.595H199.695V9.215C199.689 8.58833 199.569 8.125 199.335 7.825C199.105 7.525 198.754 7.375 198.28 7.375C197.757 7.375 197.364 7.54 197.1 7.87C196.837 8.2 196.705 8.67667 196.705 9.3C196.705 9.89333 196.837 10.3533 197.1 10.68C197.364 11.0033 197.744 11.165 198.24 11.165C198.567 11.165 198.849 11.0917 199.085 10.945C199.325 10.795 199.512 10.5817 199.645 10.305L200.67 10.63C200.46 11.1133 200.142 11.4883 199.715 11.755C199.289 12.0183 198.814 12.15 198.29 12.15ZM196.365 9.595V8.78H200.22V9.595H196.365ZM203.12 12V7.54H201.275V6.6H206.01V7.54H204.165V12H203.12Z"
                        fill="#3153CA"/>
                </svg>
                <h3 className="row-amount">В рассрочку на:</h3>
                <div className='price margin5'>
                        <span className={month === 3 ? 'selected-price' : ''} onClick={() => handleMonth(3)}>
                            <p>3 {t("месяца")}</p>
                        </span>
                        <span className={month === 6 ? 'selected-price' : ''} onClick={() => handleMonth(6)}>
                            <p>6 {t("месяцев")}</p>
                        </span>
                        <span className={month === 12 ? 'selected-price' : ''} onClick={() => handleMonth(12)}>
                            <p>12 {t("месяцев")}</p>
                        </span>
                        <span className={month === 24 ? 'selected-price' : ''} onClick={() => handleMonth(24)}>
                            <p>24 {t("месяцев")}</p>
                        </span>
                </div>
                <div className="registration-checkbox margin5 w-100">
                    <input
                        type="checkbox"
                        className="custom-checkbox"
                        id="agreementChecked"
                        name="agreementChecked"
                        checked={agreementChecked}
                        onChange={() => {
                            setAgreementChecked(!agreementChecked)
                        }}
                    />
                    <label htmlFor="agreementChecked" className="text-12">
                        <p className="text-14">Я согласен с {" "}
                            <a onClick={() => setShowTermsAndConditions(true)}>
                                Условиями и Правилами
                            </a>{" "}
                            Reddel</p>
                    </label>
                </div>
                <div className="margin5">
                    {showIINError && <p className='error'>Введен неверный иин</p>}
                    {showError &&
                        <p className='error'>Номер или электронная почта уже используются другим пользователем</p>}
                </div>

            </form>
            <SubmitButton/>

            {showTermsAndConditions && (
                <TermsAndConditions onClose={closeTermsAndConditions}/>
            )}
            {showVerification && <VerificationCode handleVerification={handleVerification} sendAgain={sendAgain}/>}

            {showLoader ? <Loading loading background="" loaderColor="#3498db"/> : (<a></a>)}
        </div>
    );
}

export default Landing2;
