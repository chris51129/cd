/**
 * Home - Landing page for CryptoDuels
 */
import { Hero, FeatureSection, Leaderboard } from '../components/home';
import '../styles/components/BackgroundEffects.css';

const Atmosphere = () => (
    <div className="bg-ambient-layer">
        <div className="mesh-gradient"></div>
        <div className="bg-light light-1"></div>
        <div className="bg-light light-2"></div>
        <div className="scanline-overlay"></div>
    </div>
);

const Home = () => {
    return (
        <div className="home-page">
            <Atmosphere />
            <Hero />
            <FeatureSection />
            <Leaderboard />
        </div>
    );
};

export default Home;
