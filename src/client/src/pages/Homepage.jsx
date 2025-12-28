import { bannerImages } from "../constants/bannerImages";
import { BannerSlider, BrandSection, NewArrivalsSection, BestsellerSection } from "../components";

const Homepage = () => {
    return (
        <div className="w-full mx-auto">
            <BannerSlider slides={bannerImages} />
            <section className="home-section container my-14">
                <BrandSection />
            </section>
            <section className="home-section container mb-14">
                <NewArrivalsSection />
            </section>
            <section className="home-section container mb-14">
                <BestsellerSection />
            </section>
        </div>
    );
}

export default Homepage
