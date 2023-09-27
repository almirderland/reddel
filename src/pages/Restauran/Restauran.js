import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./Restauran.css";
import CartHeader from "../../components/cartHeader/CartHeader";
import CartMain from "../../components/cartMain/CartMain";
import MobileCartHeader from "../../components/mobileCartHeader/MobileCartHeader";
import MobileCartMain from "../../components/mobileCartMain/MobileCartMain";
import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";

function Restauran() {
    let { id } = useParams();
    const [data,setData] = useState(0)
    useEffect( () => {
        fetch("http://185.146.1.93:8000/get_restaurant_by_slug/" + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then((response) =>{
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) =>{
                setData(data.data)
                console.log(data.data)
            })
    },[]);
  return (
    <div className="favorites">
      <div className="desk">
        <Header className='res' />
        <div className="main-content">
          <CartHeader title={data.title}
                      tags={data.tags}/>
          <CartMain description={data.description}
                    item_image={"http://185.146.1.93:8000/"+data.image}
                    location={data.location}
                    phone_number={data.phone}
                    kitchen={data.kitchen}
                    average={data.average}
                    prices={data.prices}
          />
        </div>
      </div>
        <div className="mobile">
          <MobileCartHeader/>
          <MobileCartMain title={data.title}
                          tags={data.tags}
                          description={data.description}
                          item_image={"http://185.146.1.93:8000/"+data.image}
                          location={data.location}
                          phone_number={data.phone}
                          kitchen={data.kitchen}
                          average={data.average}
                          prices={data.prices} />
        </div>
      <Footer />
    </div>
  );
}

export default Restauran;