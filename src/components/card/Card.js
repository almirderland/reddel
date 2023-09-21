import React, { useState } from 'react';
import './Card.css'; 
import { Link } from 'react-router-dom';


import Regtangle from '../../assets/Rectangle.png';
import location from '../../assets/location2.svg';
import hearts from '../../assets/heart.svg';
import heart3 from '../../assets/heart3.svg';

import image from '../../assets/image.png';

function Card(props) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className={`card ${isLiked ? 'liked' : ''}`}>
      <span className='card-header'>0-0-6</span>
      <img src={props.item_image} alt="random" />
      <div className='tags'>
          {props.tags && props.tags.map((item, index) => (
              <span key={index} className='tag'>{item}</span>
          ))}
      </div>
        <Link to={props.slug} className="card-body">

          <img src={image} alt="" />
          <h3>{props.title} </h3>
        </Link>
        <Link to={props.slug} className="card-text">{props.description}</Link>
        <Link to={props.slug} className="location">
          <img src={location} alt="random" />
          <span>{props.location}</span>
        </Link>
      <div className="card-footer">
        <button className={`card-button ${isLiked ? 'liked' : ''}`} onClick={handleLikeClick}>
          <img src={isLiked ? heart3 : hearts} alt="heart" />
        </button>
        <Link to={props.slug} className="card-button">
          <button className="card-button">Посетить в рассрочку</button>
        </Link>
      </div>
    </div>
  );
}

export default Card;
