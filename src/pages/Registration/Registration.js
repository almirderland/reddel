import React, {useEffect, useState} from "react";
import {Link, useNavigate, useLocation} from "react-router-dom";
import "./Registration.css";
import TermsAndConditions from "../TermsAndConditions/TermsAndConditions";
import api from "../../api";
import VerificationCode from "../../components/verificationCode/VerificationCode";
import InputMask from "react-input-mask";
import home from "../../assets/home.svg";
import search from "../../assets/Search2.svg";
import heart from "../../assets/heart.svg";
import profile from "../../assets/profile.svg";

function Registration() {
  const location = useLocation();
  const [url, setUrl] = useState('/profile')
  useEffect(() => {
    try{
      setUrl(location.state.url)
    }
    catch{

    }
    document.title = 'Reddel';
  }, []);
  const [formData, setFormData] = useState({
    "first_name": "",
    "last_name": "",
    "email": "",
    "phone_number": ""
  });
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [phone, setPhone] = useState('')
  const [validate, setValidate] = useState('1')
  const [showError, setShowError] = useState('')

  const [showVerificationCode, setShowVerificationCode] = useState(false);

  const navigate = useNavigate();

  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);

  const sendAgain = async () => {
    let randomNumber = Math.floor(Math.random() * 10000);
    let code = randomNumber.toString().padStart(4, '0')

    setValidate(code)
    let data = formData.phone_number.replaceAll(/[^0-9]/g, '')
    await fetch("https://api.mobizon.kz/service/message/sendsmsmessage?recipient=" + data + "&text=Код для входа на сайт https://reddel.kz : " + code + "&apiKey=kz0502f56621750a9ca3ac636e8301e235c2b647839531f2994222514c786fb6ff2178")
  }

  const closeTermsAndConditions = () => {
    setShowTermsAndConditions(false);
  };

  const handleInputChange = (e) => {
    setShowError(false)
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleVerification = async (code) => {
    code = code[0] + code[1] + code[2] + code[3]
    if (code != validate) {
      alert('Неверный код')
      return
    }
    try {
      // Make a POST request using the api.post method
      formData.phone_number = phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '').replaceAll('+', '')
      fetch("https://api.reddel.kz/register", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
          .then((response) => {
            if(response.status == 200){
              return response.json()
            }
            else {
              setShowVerificationCode(false)
              setShowError(true)
            }
          })
          .then(data => {
            if(data) {
              localStorage.setItem('accessToken', data.token)
              if(url=='/profile')
                navigate(url)
              else
                navigate('/restauran/' + url, {state: location.state})
            }
          })
    } catch (error) {
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user has agreed to the terms and conditions
    if (!agreementChecked) {
      alert("Please agree to the terms and conditions.");
      return;
    }
    formData.phone_number = phone.replaceAll(' ', '').replaceAll('-', '').replaceAll('(', '').replaceAll(')', '').replaceAll('+', '')
    fetch("https://api.reddel.kz/checkUser", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
        .then(async (response) => {
          if (response.status == 200) {
            let randomNumber = Math.floor(Math.random() * 10000);
            let code = randomNumber.toString().padStart(4, '0')
            setValidate(code)
            console.log("THE CODE", code)

            // await fetch("https://api.mobizon.kz/service/message/sendsmsmessage?recipient=" + formData.phone_number + "&text=Код для входа на сайт https://reddel.kz : " + code + "&apiKey=kz0502f56621750a9ca3ac636e8301e235c2b647839531f2994222514c786fb6ff2178")
            setShowVerificationCode(true)
          } else {
            setShowError(true)
          }
        })
  };

  return (
      <div className="cerf-modal">
        <section className="registration">
          <form className="registration-form" onSubmit={handleSubmit}>
            <h3 className="registration-h2">Регистрация</h3>

            <div className="registration-inputs">
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
            </div>
            <InputMask
                mask="+7 (***) ***-**-**" // Define your desired phone number mask
                maskChar="_" // Use underscore (_) or any character you prefer for unfilled positions
                placeholder="+7 (___) ___-__-__" // Display a placeholder for user guidance
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={true}
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required={true}
            />
            {showError && <p className='error'>Номер или электронная почта уже используются другим пользователем</p>}
            <div className="registration-checkbox">
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
              <label htmlFor="agreementChecked">
                <p>Я согласен с {" "}
                <a onClick={() => setShowTermsAndConditions(true)}>
                  Условиями и Правилами
                </a>{" "}
                Reddel</p>
              </label>
            </div>
            <button type="submit" className="registration-button">
              Продолжить
            </button>
          </form>
        </section>
        {showTermsAndConditions && (
            <TermsAndConditions onClose={closeTermsAndConditions} />
        )}
        {showVerificationCode && <VerificationCode handleVerification={handleVerification} sendAgain={sendAgain}/>}
        <footer className="footer">
          <div className="mob">
            <Link to="/" className="mob-item">
              <img src={home} alt="logo" />
              <span>Главная</span>
            </Link>
            <Link to="/search" className="mob-item">
              <img src={search} alt="logo" />
              <span>Поиск</span>
            </Link>
            <Link to="/favorites" className="mob-item">
              <img src={heart} alt="logo" />
              <span>Избранное</span>
            </Link>
            <Link to="/profile" className="mob-item">
              <img src={profile} alt="logo" />
              <span>Профиль</span>
            </Link>
          </div>
        </footer>
      </div>
  );
}

export default Registration;
