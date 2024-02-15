import React, {useEffect, useState} from 'react';
import './Card.css'; 
import {Link, useNavigate} from 'react-router-dom';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Regtangle from '../../assets/Rectangle.png';
import location from '../../assets/location2.svg';
import hearts from '../../assets/heart.svg';
import heart3 from '../../assets/heart3.svg';

import image from '../../assets/image.png';
import error from "../error/Error";
import {useTranslation} from "react-i18next";


function Card(props) {
    const {t, i18n} = useTranslation();

    const [isLiked, setIsLiked] = useState(props.isLiked);
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
                            setIsLiked(!isLiked);
                        })
                        .catch((error) => {
                            alert(error)
                        })
                })
        } catch (error) {
            navigate('/profile')
        }

    };

  return (
    <div className={`card ${isLiked ? 'liked' : ''}`}>
      <span className='card-header'>0-0-6</span>
        <div className="card-img">
            <img src={props.item_image} alt="random" width="100%" height="100%"/>
            <div className='tags'>
                {props.tags && props.tags.map((item, index) => (
                    <span key={index} className='tag'><p>{item}</p></span>
                ))}
            </div>
        </div>

        <Link to={props.slug} className="card-body">
            <img src={props.logo} alt="" width="50px"/>
            <h3>{props.title} </h3>
        </Link>
        <Link to={props.slug} className="card-text">{props.description}</Link>
        <Link to={props.slug} className="location">
          <img src={location} alt="random" />
          <span>{props.location}</span>
        </Link>
      <div className="card-footer">
        <button className={`card-button ${isLiked ? 'liked' : ''}`} onClick={() => handleLikeClick(props.id)}>
          <img src={isLiked ? heart3 : hearts} alt="heart" />
        </button>
        <Link to={props.slug} className="card-button">
          <button className="card-button">{t("Посетить в рассрочку")}</button>
        </Link>
      </div>
    </div>
  );
}

export default Card;
