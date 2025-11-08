import { bannerImages } from "../constants/bannerImages";
import { BannerSlider, BrandSection } from "../components";

const Homepage = () => {
    return (
        <div className="w-full mx-auto">
            <BannerSlider slides={bannerImages} />
            <section className="container">
                <BrandSection />
            </section>
        </div>
    );
}

export default Homepage
