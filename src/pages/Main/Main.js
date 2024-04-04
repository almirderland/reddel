import Header from "../../components/header/Header";
import Banner from "../../components/banner/Banner";
import Restaurants from "../../components/restaurants/Restaurants";
import Footer from "../../components/footer/Footer";
import Banner2 from "../../components/banner2/Banner2";
import "./Main.css";
import {useEffect} from "react";

function Main() {
    useEffect(() => {
        document.title = 'Reddel.kz'; // Set the page title here
    }, []);

  return (
    <div className="main">
      <Header />
        <Banner />
      <div className="main-content">
        <Restaurants />
        <Banner2 />
      </div>
      <Footer />
    </div>
  );
}

export default Main;
