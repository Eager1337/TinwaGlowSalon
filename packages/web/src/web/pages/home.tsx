import { useCallback, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Phone,
  Sparkles,
  Flower2,
  Menu,
  X,
  Heart,
  Leaf,
  ChevronDown,
  MessageCircle,
  Plus,
} from "lucide-react";
import Booking from "../components/booking";
import TreatmentMenu from "../components/treatment-menu";
import Lightbox from '../components/lightbox';
import { faqs, mapUrl, phone, whatsapp } from "../lib/content";

export default function Home() {
  const [booking, setBooking] = useState<string | null>(null);
  const close = useCallback(() => setBooking(null), []);
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const [gallery, setGallery] = useState<number | null>(null);
  const galleryImages = [
    { src: "/images/hero.jpg", title: "A moment to reset" },
    { src: "/images/nails.jpg", title: "Beauty in the details" },
    { src: "/images/grooming.jpg", title: "Your everyday confidence" },
    { src: "/images/massage.jpg", title: "Time to unwind" },
  ];
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="topbar">
        <span>A little luxury. A lot of you.</span>
        <a href={mapUrl} target="_blank" rel="noreferrer">
          <MapPin size={12} /> Lumley, Freetown <ArrowUpRight size={12} />
        </a>
      </div>
      <header className="header">
        <a className="brand" href="/" aria-label="Tinwa Glow home">
          <Flower2 size={38} strokeWidth={1} />
          <span>
            Tinwa <i>Glow</i>
            <small>UNISEX SALON & SPA</small>
          </span>
        </a>
        <nav className={menu ? "nav open" : "nav"} aria-label="Main navigation">
          {[
            ["Treatments", "#treatments"],
            ["Our story", "#story"],
            ["The glow edit", "#gallery"],
            ["Visit us", "#visit"],
          ].map(([name, href]) => (
            <a key={name} href={href} onClick={() => setMenu(false)}>
              {name}
            </a>
          ))}
        </nav>
        <button className="button primary header-cta" onClick={() => setBooking("")}>
          Book your glow <ArrowUpRight size={16} />
        </button>
        <button
          className="menu-toggle"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          aria-expanded={menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="line" /> BEAUTY, BALANCE & A LITTLE BLISS
            </span>
            <h1>
              A little pause.
              <br />A brighter
              <br />
              <em>you.</em>
              <Sparkles className="headline-sparkle" strokeWidth={1} />
            </h1>
            <p>
              Step away from the everyday. Step into thoughtful beauty and unhurried care, right
              here in Freetown.
            </p>
            <div className="hero-actions">
              <button className="button primary" onClick={() => setBooking("")}>
                Find your glow <ArrowUpRight size={18} />
              </button>
              <a className="text-link" href="#treatments">
                Explore treatments <ArrowRight size={17} />
              </a>
            </div>
            <div className="hero-rating">
              <div className="review-avatars">
                <span>R</span>
                <span>H</span>
                <span>M</span>
              </div>
              <div>
                <div className="rating-line">
                  <span className="stars">★★★★★</span>
                  <strong>4.6 / 5</strong>
                </div>
                <small>
                  Little moments. Lovely reviews. <span>5 on Google*</span>
                </small>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-image"
              src="/images/hero.jpg"
              alt="A woman relaxing with a facial treatment"
              fetchPriority="high"
            />
            <div className="image-corner">
              <Flower2 size={19} strokeWidth={1} /> YOUR TIME. YOUR GLOW.
            </div>
            <div className="hero-floating">
              <div className="floating-icon">
                <Leaf size={22} strokeWidth={1.3} />
              </div>
              <div>
                <span>Leave the rush behind.</span>
                <small>We’ll take care of the rest.</small>
              </div>
              <ArrowUpRight size={20} />
            </div>
            <span className="vertical-caption">A SPACE TO FEEL LIKE YOURSELF AGAIN</span>
          </div>
          <a href="#treatments" className="scroll-hint">
            <ChevronDown size={14} /> A LITTLE MORE TO DISCOVER
          </a>
        </section>
        <div className="trust-strip">
          <span>
            <Flower2 size={20} strokeWidth={1.2} /> Beauty for everyone
          </span>
          <span>
            <Heart size={19} strokeWidth={1.2} /> Proudly women-owned*
          </span>
          <span>
            <Leaf size={20} strokeWidth={1.2} /> Unhurried, personal care
          </span>
          <span>
            <MapPin size={19} strokeWidth={1.2} /> In the heart of Lumley
          </span>
        </div>
        <TreatmentMenu onBook={(name) => setBooking(name)} />
        <section id="story" className="story-section">
          <div className="story-image">
            <img
              src="/images/massage.jpg"
              alt="A relaxing massage treatment, from the existing website"
              loading="lazy"
            />
            <div className="story-image-label">
              <Flower2 size={30} strokeWidth={1} />
              <span>
                A little sanctuary.
                <br />
                <i>Right in your city.</i>
              </span>
            </div>
          </div>
          <div className="story-copy">
            <span className="eyebrow">MORE THAN A SALON</span>
            <h2>
              Come as you are.
              <br />
              Leave feeling
              <br />
              <em>more like you.</em>
            </h2>
            <p>
              At Tinwa Glow, beauty is more than a fresh look. It’s the feeling of being cared for.
              The quiet moment in a busy week. The confidence you carry back into your day.
            </p>
            <p>
              From precision grooming to a restorative spa visit, discover a unisex salon and spa
              made for your kind of self-care.
            </p>
            <div className="story-values">
              <span>
                <Heart size={18} /> Personal, thoughtful care
              </span>
              <span>
                <Flower2 size={18} /> Beauty & wellness together
              </span>
            </div>
            <button className="button outline" onClick={() => setBooking("")}>
              Make a little time for you <ArrowUpRight size={18} />
            </button>
          </div>
        </section>
        <section id="gallery" className="section gallery-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">THE GLOW EDIT</span>
              <h2>
                Small details.
                <br />
                <em>Beautiful moments.</em>
              </h2>
            </div>
            <a
              className="text-link"
              href="https://www.facebook.com/p/Tinwa-Glow-61591740461200/"
              target="_blank"
              rel="noreferrer"
            >
              Find Tinwa Glow on Facebook <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((im, i) => (
              <button
                key={im.src}
                className="gallery-image"
                onClick={() => setGallery(i)}
                aria-label={`View ${im.title}`}
              >
                <img src={im.src} alt={im.title} loading="lazy" />
                <span>
                  {im.title}
                  <Plus size={18} />
                </span>
              </button>
            ))}
          </div>
          <p className="small photo-note">
            Treatment inspiration, not a verified portfolio. Images from the existing website and
            Unsplash; replace with approved salon photography before launch.
          </p>
        </section>
        <section id="reviews" className="reviews-section">
          <div className="reviews-intro">
            <span className="eyebrow">KIND WORDS, REAL PEOPLE</span>
            <h2>
              The glow
              <br />
              <em>goes with you.</em>
            </h2>
            <div className="big-rating">
              4.6{" "}
              <span>
                ★★★★★<small>5 Google reviews*</small>
              </span>
            </div>
            <a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">
              Find us on Google <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="review-list">
            <article>
              <span className="quote-mark">“</span>
              <blockquote>There massage is the best</blockquote>
              <div className="review-author">
                <span className="avatar">RK</span>
                <div>
                  <strong>Rosaline Koroma</strong>
                  <small>Google review · supplied listing</small>
                </div>
                <span className="stars">★★★★★</span>
              </div>
            </article>
            <article>
              <span className="quote-mark">“</span>
              <blockquote>The best spa &salon in freetown</blockquote>
              <div className="review-author">
                <span className="avatar">HH</span>
                <div>
                  <strong>Hawa Hemmingsson</strong>
                  <small>Google review · supplied listing</small>
                </div>
                <span className="stars">★★★★★</span>
              </div>
            </article>
          </div>
          <p className="review-disclaimer">
            *Rating, selected reviews and women-owned status from the Maps listing supplied for this
            demo; not a live Google feed. The supplied listing also includes mixed feedback on
            facial care.
          </p>
        </section>
        <section className="section faq-section">
          <div>
            <span className="eyebrow">A LITTLE CLARITY</span>
            <h2>
              Before your
              <br />
              <em>moment of calm.</em>
            </h2>
            <p>Still have a question? We’re a message away.</p>
            <a className="text-link" href={whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle size={16} /> Let’s chat on WhatsApp <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="faqs">
            {faqs.map(([q, a], i) => (
              <div className="faq" key={q}>
                <button
                  aria-expanded={faq === i}
                  aria-controls={`faq-${i}`}
                  onClick={() => setFaq(faq === i ? null : i)}
                >
                  {q}
                  {faq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                <div id={`faq-${i}`} hidden={faq !== i}>
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="visit" className="visit-section">
          <div className="visit-copy">
            <span className="eyebrow">YOUR LOCAL LITTLE ESCAPE</span>
            <h2>
              A world away.
              <br />
              <em>Just around the corner.</em>
            </h2>
            <div className="visit-details">
              <div>
                <MapPin size={20} />
                <span>
                  <strong>Lumley Road, Freetown</strong>
                  <small>Opposite ACTB Bank · FP5H+6QW</small>
                </span>
              </div>
              <div>
                <Phone size={19} />
                <span>
                  <a href="tel:+23274178422">{phone}</a>
                  <small>Call to confirm today’s opening hours</small>
                </span>
              </div>
            </div>
            <div className="visit-actions">
              <a className="button primary" href={mapUrl} target="_blank" rel="noreferrer">
                Get directions <ArrowUpRight size={18} />
              </a>
              <a className="button outline" href="tel:+23274178422">
                Call the salon <Phone size={16} />
              </a>
            </div>
          </div>
          <a
            className="map-art"
            href={mapUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Open Tinwa Glow directions in Google Maps"
          >
            <div className="map-road road-one" />
            <div className="map-road road-two" />
            <div className="map-road road-three" />
            <span className="map-label lumley">LUMLEY ROAD</span>
            <span className="map-label bank">ACTB BANK</span>
            <span className="map-label freetown">FREETOWN</span>
            <div className="map-pin">
              <Flower2 size={25} />
              <span>
                Tinwa <i>Glow</i>
                <small>YOUR MOMENT OF CALM</small>
              </span>
            </div>
            <span className="map-caption">
              Illustrative location guide · Open Google Maps <ArrowUpRight size={14} />
            </span>
          </a>
        </section>
        <section className="final-cta">
          <Flower2 size={50} strokeWidth={0.8} />
          <span className="eyebrow">YOU DESERVE A LITTLE YOU-TIME</span>
          <h2>
            Your next good feeling
            <br />
            <em>starts here.</em>
          </h2>
          <button className="button cream" onClick={() => setBooking("")}>
            Let’s book your glow <ArrowUpRight size={18} />
          </button>
          <p>Hair. Beauty. Wellness. All in one little escape.</p>
        </section>
      </main>
      <footer>
        <div className="footer-main">
          <a className="brand" href="/">
            <Flower2 size={38} strokeWidth={1} />
            <span>
              Tinwa <i>Glow</i>
              <small>UNISEX SALON & SPA</small>
            </span>
          </a>
          <p>
            Thoughtful beauty. Unhurried care.
            <br />A brighter you, in Freetown.
          </p>
          <div>
            <a href="#treatments">Treatments</a>
            <a href="#story">Our story</a>
            <a href="#visit">Visit us</a>
          </div>
          <div>
            <a href={whatsapp} target="_blank" rel="noreferrer">
              WhatsApp <ArrowUpRight size={13} />
            </a>
            <a
              href="https://www.facebook.com/p/Tinwa-Glow-61591740461200/"
              target="_blank"
              rel="noreferrer"
            >
              Facebook <ArrowUpRight size={13} />
            </a>
            <a href="https://www.tiktok.com/@tinwaglow" target="_blank" rel="noreferrer">TikTok <ArrowUpRight size={13}/></a>
            <a href="https://www.instagram.com/p/De5ctizJ6Eq/" target="_blank" rel="noreferrer">Instagram post <ArrowUpRight size={13}/></a>
            <a href="tel:+23274178422">{phone}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Tinwa Glow · Independent concept demo, not the official
            website.
          </span>
          <div>
            <a href="/privacy">Privacy</a>
            <a href="/studio">Studio demo</a>
            <a href="/owner">Owner access</a>
          </div>
        </div>
      </footer>
      <a
        className="whatsapp-float"
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Tinwa Glow on WhatsApp"
      >
        <MessageCircle size={23} />
        <span>Let’s chat</span>
      </a>
      {booking !== null && <Booking initial={booking} close={close} />}
      {gallery !== null && (
        <Lightbox image={galleryImages[gallery]} close={() => setGallery(null)}/>
      )}
    </>
  );
}
