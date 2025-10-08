import { bannerImages } from "../constants/bannerImages";
import { BannerSlider } from "../components";
const Homepage = () => {
    return (
        <div className="w-full mx-auto">
            <BannerSlider slides={bannerImages} />
        </div>
    );
}

export default Homepage
