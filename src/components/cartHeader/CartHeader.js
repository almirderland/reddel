import React, { useState } from 'react';
import heard3 from '../../assets/heart.svg';
import heard5 from '../../assets/heart3.svg';
import image from '../../assets/image.png';
import './CartHeader.css';
import { useTranslation } from "react-i18next"
import {useNavigate} from "react-router-dom";


function Header(props) {

    const [isFavorite, setIsFavorite] = useState(false);
    console.log(props.tags)

    const navigate = useNavigate();
    const handleLikeClick = (id: any) => {
        console.log(id)
        try {
            fetch('https://api.reddel.kz/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({'jwt': localStorage.getItem('accessToken')})
            })
                .then((response) => {
                    if(response.status == '200'){
                        return response.json()
                    }
                    else{
                        navigate('/login')
                    }
                })
                .then((data) => {
                    fetch("https://api.reddel.kz/add_to_favorite/" + data.id + "/" + id, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                        .then((response) => {
                            setIsFavorite(!isFavorite);
                        })
                        .catch((error) => {
                            alert(error)
                        })
                })
        } catch (error) {
            navigate('/profile')
        }

    };
    const {t, i18n} = useTranslation();

    return (
        <div className="header-card">
          <div className="card-body">
            <img src={props.logo} alt="" width="60px"/>
            <div>
              <h1>{props.title}</h1>
              <div className='tags-card'>
                {props.tags && props.tags.map((item, index) => (
                    <span key={index} className='tag-item'>{item}</span>
                ))}
              </div>
            </div>
          </div>

          <button className="card-button" onClick={handleLikeClick}>
            <img src={isFavorite ? heard5 : heard3} alt="heart"/>
            {t("В избранное")}
          </button>
        </div>
    );
}

export default Header;
