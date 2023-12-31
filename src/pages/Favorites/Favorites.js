import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Favorite from "../../components/favorites/Favorite";
import "./Favorites.css";
import React, {useEffect, useState} from "react";
import Card from "../../components/card/Card";
import {useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next"


function Favorites() {
    const [favoriteItems,setFavoriteItems] = useState([])
    const navigate = useNavigate ();
    let id = -1
    useEffect(() => {
        fetch('https://api.reddel.kz/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'jwt': localStorage.getItem('accessToken')})
        })
            .then((response) => {
                if(response.status != 200){
                    navigate('/login')
                }
                return response.json()
            })
            .then((data) => {
                id = data.id
            })
            .then(() => {
                fetch('https://api.reddel.kz/get_favourites/' + id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                    .then((response) => {
                        return response.json()
                    })
                    .then((data) => {
                        const newCardArray = [];
                        for (let i = 0; i < data['restaurants'].length; ++i) {
                            newCardArray.push(
                                <Card
                                    item_image={"https://api.reddel.kz"+data['restaurants'][i].image}
                                    title={data['restaurants'][i].title}
                                    id={data['restaurants'][i].id}
                                    slug={"/restauran/" + data['restaurants'][i].slug}
                                    tags={data['restaurants'][i].tags}
                                    description={data['restaurants'][i].description}
                                    key={i}
                                    logo={"https://api.reddel.kz"+data['restaurants'][i].logo}
                                    location={data['restaurants'][i].location}
                                    isLiked={true}
                                />
                            );
                        }
                        setFavoriteItems(newCardArray);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                navigate('/login')
            })

    }, []);
  return (
    <div className="favorites">
      <Header />
      <div className="main-content">
        <Favorite favoriteItems={favoriteItems}/>
      </div>
      <Footer />
    </div>
  );
}

export default Favorites;
