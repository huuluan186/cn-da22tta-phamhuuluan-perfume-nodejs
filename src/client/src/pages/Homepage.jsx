import { bannerImages } from "../constants/bannerImages";
import { BannerSlider, BrandSection, NewArrivalsSection } from "../components";

const Homepage = () => {
    return (
        <div className="w-full mx-auto">
            <BannerSlider slides={bannerImages} />
            <section className="home-section container">
                <BrandSection />
            </section>
            <section className="home-section container">
                <NewArrivalsSection />
            </section>
        </div>
    );
}

export default Homepage
