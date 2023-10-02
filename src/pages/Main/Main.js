import Header from "../../components/header/Header";
import Banner from "../../components/banner/Banner";
import Partners from "../../components/partners/Partners";
import Restaurants from "../../components/restaurants/Restaurants";
import Footer from "../../components/footer/Footer";
import Сategories from "../../components/categories/Сategories";
import Banner2 from "../../components/banner2/Banner2";
import "./Main.css";

function Main() {
  return (
    <div className="main">
      <Header />
      <div className="main-content">
        <Banner />
        <Partners />
        {/*<Сategories />*/}
        <Restaurants />
        <Banner2 />
      </div>
      <Footer />
    </div>
  );
}

export default Main;
