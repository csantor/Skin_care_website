import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-surface-low min-h-[600px] flex items-center mb-12">
        <div className="absolute inset-y-0 right-0 w-full md:w-2/3 h-full overflow-hidden">
          <img
            src={heroImage}
            alt="Premium Skincare"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-low via-surface-low/60 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full md:w-1/2 px-8 lg:px-16 space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {t('home.heroTag')}
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter text-on-surface leading-[0.9]">
            {t('home.heroTitle')}<br />
            <span className="text-primary italic font-medium">{t('home.heroTitleSpan')}</span>.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-md leading-relaxed">
            {t('home.heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link to="/onboarding">
              <Button variant="primary" className="text-lg shadow-xl shadow-primary/30">
                {t('home.startProfile')}
              </Button>
            </Link>
            <Link to="/library">
              <Button variant="secondary">
                {t('home.exploreScience')}
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Feature Grid - Tonal Layering No Borders */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {t('home.features').map((feature, i) => (
          <div key={i} className="bg-surface-lowest p-10 rounded-3xl transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
            <div className="w-12 h-12 rounded-2xl bg-surface-low flex items-center justify-center text-primary text-2xl font-bold mb-6">
              {i === 0 ? "◈" : i === 1 ? "✧" : "◎"}
            </div>
            <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
            <p className="text-on-surface-variant leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
