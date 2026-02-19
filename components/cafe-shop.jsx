'use client';

import React, { useState, useEffect } from 'react';
import { Coffee, MapPin, Clock, Star, ArrowRight, Menu, X } from 'lucide-react';

export default function CafeShop() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Espresso', price: '$3.50', description: 'Rich, full-bodied shot of pure coffee essence' },
    { name: 'Cappuccino', price: '$4.50', description: 'Perfectly balanced espresso, steamed milk, and foam' },
    { name: 'Cold Brew', price: '$5.00', description: 'Smooth, refreshing coffee steeped for 24 hours' },
    { name: 'Cortado', price: '$4.00', description: 'Equal parts espresso and steamed milk' },
    { name: 'Affogato', price: '$6.00', description: 'Vanilla gelato drowned in hot espresso' },
    { name: 'Mocha', price: '$5.50', description: 'Espresso with chocolate and steamed milk' }
  ];

  const testimonials = [
    { name: 'Sarah M.', text: 'The best coffee in town. The atmosphere is unmatched.', rating: 5 },
    { name: 'James K.', text: 'My daily ritual. Every cup is crafted with care.', rating: 5 },
    { name: 'Emma L.', text: 'A hidden gem. Perfect spot for remote work or catching up with friends.', rating: 5 }
  ];

  return (
    <div className="cafe-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;600;700&family=Montserrat:wght@300;400;500;600&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .cafe-container {
          font-family: 'Montserrat', sans-serif;
          background: #faf8f5;
          color: #2c2520;
          overflow-x: hidden;
        }

        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 1.5rem 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: ${scrollY > 50 ? 'rgba(250, 248, 245, 0.95)' : 'transparent'};
          backdrop-filter: ${scrollY > 50 ? 'blur(10px)' : 'none'};
          transition: all 0.4s ease;
          box-shadow: ${scrollY > 50 ? '0 2px 20px rgba(44, 37, 32, 0.08)' : 'none'};
        }

        .logo {
          font-family: 'Crimson Pro', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #6b4423;
          letter-spacing: -0.5px;
          animation: fadeInDown 0.8s ease;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          animation: fadeInDown 0.8s ease 0.2s backwards;
        }

        .nav-links a {
          color: #2c2520;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
          transition: color 0.3s ease;
          position: relative;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: #d4a574;
          transition: width 0.3s ease;
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .nav-links a:hover {
          color: #6b4423;
        }

        .mobile-menu {
          display: none;
          cursor: pointer;
        }

        /* Hero Section */
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%);
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(107, 68, 35, 0.1) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
        }

        .hero-content {
          text-align: center;
          z-index: 10;
          max-width: 900px;
          padding: 2rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #6b4423;
          margin-bottom: 1rem;
          animation: fadeInUp 0.8s ease 0.3s backwards;
          font-weight: 500;
        }

        .hero-title {
          font-family: 'Crimson Pro', serif;
          font-size: clamp(3.5rem, 10vw, 7rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #2c2520;
          animation: fadeInUp 0.8s ease 0.5s backwards;
        }

        .hero-description {
          font-size: 1.25rem;
          color: #5c524a;
          margin-bottom: 3rem;
          line-height: 1.6;
          animation: fadeInUp 0.8s ease 0.7s backwards;
        }

        .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.2rem 2.5rem;
          background: #6b4423;
          color: #faf8f5;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1.05rem;
          letter-spacing: 0.5px;
          transition: all 0.4s ease;
          animation: fadeInUp 0.8s ease 0.9s backwards;
          box-shadow: 0 10px 30px rgba(107, 68, 35, 0.3);
        }

        .cta-button:hover {
          background: #8b5a2b;
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(107, 68, 35, 0.4);
        }

        .floating-coffee {
          position: absolute;
          opacity: 0.15;
          animation: floatRotate 30s infinite ease-in-out;
          will-change: transform;
        }

        .coffee-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .coffee-2 {
          top: 60%;
          right: 15%;
          animation-delay: 5s;
        }

        .coffee-3 {
          bottom: 15%;
          left: 20%;
          animation-delay: 10s;
        }

        /* About Section */
        .about {
          padding: 8rem 5%;
          background: #faf8f5;
          position: relative;
        }

        .about::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to bottom, #e8d5c4, #faf8f5);
        }

        .about-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .about-text h2 {
          font-family: 'Crimson Pro', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 2rem;
          color: #2c2520;
          line-height: 1.2;
        }

        .about-text p {
          font-size: 1.15rem;
          line-height: 1.8;
          color: #5c524a;
          margin-bottom: 1.5rem;
        }

        .about-features {
          display: grid;
          gap: 2rem;
        }

        .feature {
          display: flex;
          align-items: start;
          gap: 1.5rem;
          padding: 2rem;
          background: white;
          border-radius: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          box-shadow: 0 5px 20px rgba(44, 37, 32, 0.05);
        }

        .feature:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(44, 37, 32, 0.1);
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #d4a574, #c89968);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .feature-text h3 {
          font-family: 'Crimson Pro', serif;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #2c2520;
        }

        .feature-text p {
          font-size: 1rem;
          color: #5c524a;
          margin: 0;
        }

        /* Menu Section */
        .menu-section {
          padding: 8rem 5%;
          background: linear-gradient(135deg, #2c2520 0%, #3d342f 100%);
          color: #faf8f5;
          position: relative;
          overflow: hidden;
        }

        .menu-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(212, 165, 116, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: pulse 15s ease-in-out infinite;
        }

        .section-header {
          text-align: center;
          margin-bottom: 5rem;
          position: relative;
          z-index: 10;
        }

        .section-subtitle {
          font-size: 1rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #d4a574;
          margin-bottom: 1rem;
          font-weight: 500;
        }

        .section-title {
          font-family: 'Crimson Pro', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          color: #faf8f5;
        }

        .menu-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          position: relative;
          z-index: 10;
        }

        .menu-item {
          background: rgba(250, 248, 245, 0.05);
          backdrop-filter: blur(10px);
          padding: 2.5rem;
          border-radius: 25px;
          border: 1px solid rgba(212, 165, 116, 0.2);
          transition: all 0.4s ease;
        }

        .menu-item:hover {
          transform: translateY(-10px);
          background: rgba(250, 248, 245, 0.08);
          border-color: rgba(212, 165, 116, 0.4);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .menu-item-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .menu-item h3 {
          font-family: 'Crimson Pro', serif;
          font-size: 1.75rem;
          color: #faf8f5;
        }

        .menu-item-price {
          font-size: 1.5rem;
          color: #d4a574;
          font-weight: 600;
        }

        .menu-item p {
          color: #c4bcb5;
          line-height: 1.6;
          font-size: 1rem;
        }

        /* Testimonials */
        .testimonials {
          padding: 8rem 5%;
          background: #f5e6d3;
        }

        .testimonials-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          margin-top: 3rem;
        }

        .testimonial-card {
          background: white;
          padding: 3rem 2.5rem;
          border-radius: 25px;
          box-shadow: 0 10px 30px rgba(44, 37, 32, 0.1);
          transition: transform 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
        }

        .stars {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
          color: #d4a574;
        }

        .testimonial-text {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #5c524a;
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .testimonial-author {
          font-weight: 600;
          color: #2c2520;
        }

        /* Contact Section */
        .contact {
          padding: 8rem 5%;
          background: #2c2520;
          color: #faf8f5;
        }

        .contact-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
        }

        .contact-info h2 {
          font-family: 'Crimson Pro', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          margin-bottom: 2rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .contact-icon {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #d4a574, #c89968);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #2c2520;
        }

        .contact-details h3 {
          font-size: 1.25rem;
          margin-bottom: 0.25rem;
          color: #d4a574;
        }

        .contact-details p {
          color: #c4bcb5;
        }

        .map-placeholder {
          background: linear-gradient(135deg, #3d342f, #4a3f3a);
          border-radius: 25px;
          height: 100%;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Crimson Pro', serif;
          font-size: 2rem;
          color: #d4a574;
        }

        /* Footer */
        .footer {
          background: #1a1612;
          color: #c4bcb5;
          padding: 3rem 5%;
          text-align: center;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer p {
          margin-bottom: 1rem;
        }

        .social-links {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .social-links a {
          width: 45px;
          height: 45px;
          background: rgba(212, 165, 116, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4a574;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: #d4a574;
          color: #1a1612;
          transform: translateY(-3px);
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        @keyframes floatRotate {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        /* Responsive */
        @media (max-width: 968px) {
          .nav-links {
            display: none;
          }

          .mobile-menu {
            display: block;
          }

          .about-content,
          .contact-content {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .menu-grid,
          .testimonials-grid {
            grid-template-columns: 1fr;
          }

          .hero-title {
            font-size: 3rem;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav className="nav">
        <div className="logo">Café Noir</div>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#menu">Menu</a>
          <a href="#testimonials">Reviews</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="floating-coffee coffee-1" style={{ fontSize: '4rem' }}>
          <Coffee size={80} />
        </div>
        <div className="floating-coffee coffee-2" style={{ fontSize: '3rem' }}>
          <Coffee size={60} />
        </div>
        <div className="floating-coffee coffee-3" style={{ fontSize: '2.5rem' }}>
          <Coffee size={50} />
        </div>
        
        <div className="hero-content">
          <p className="hero-subtitle">Artisan Coffee Since 2018</p>
          <h1 className="hero-title">Crafted With Passion</h1>
          <p className="hero-description">
            Where every cup tells a story. Experience the perfect blend of tradition and innovation
            in every sip.
          </p>
          <a href="#menu" className="cta-button">
            Explore Our Menu <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-content">
          <div className="about-text">
            <h2>The Art of Coffee</h2>
            <p>
              At Café Noir, we believe coffee is more than just a beverage—it's an experience.
              Our master baristas craft each cup with precision and care, using only the finest
              ethically-sourced beans from around the world.
            </p>
            <p>
              From the first aroma to the last sip, we're dedicated to creating moments of pure
              coffee bliss in a warm, inviting atmosphere.
            </p>
          </div>
          <div className="about-features">
            <div className="feature">
              <div className="feature-icon">
                <Coffee size={24} />
              </div>
              <div className="feature-text">
                <h3>Premium Beans</h3>
                <p>Ethically sourced from the world's finest coffee regions</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <Star size={24} />
              </div>
              <div className="feature-text">
                <h3>Expert Baristas</h3>
                <p>Trained professionals passionate about their craft</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <MapPin size={24} />
              </div>
              <div className="feature-text">
                <h3>Cozy Atmosphere</h3>
                <p>A perfect spot to work, relax, or catch up with friends</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section" id="menu">
        <div className="section-header">
          <p className="section-subtitle">Our Offerings</p>
          <h2 className="section-title">Signature Menu</h2>
        </div>
        <div className="menu-grid">
          {menuItems.map((item, index) => (
            <div 
              className="menu-item" 
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="menu-item-header">
                <h3>{item.name}</h3>
                <span className="menu-item-price">{item.price}</span>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials" id="testimonials">
        <div className="section-header">
          <p className="section-subtitle" style={{ color: '#6b4423' }}>What People Say</p>
          <h2 className="section-title" style={{ color: '#2c2520' }}>Customer Love</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <p className="testimonial-author">— {testimonial.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="contact-content">
          <div className="contact-info">
            <h2>Visit Us</h2>
            <div className="contact-item">
              <div className="contact-icon">
                <MapPin size={24} />
              </div>
              <div className="contact-details">
                <h3>Location</h3>
                <p>123 Coffee Street, Downtown<br />New York, NY 10001</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <Clock size={24} />
              </div>
              <div className="contact-details">
                <h3>Hours</h3>
                <p>Mon-Fri: 7:00 AM - 8:00 PM<br />Sat-Sun: 8:00 AM - 9:00 PM</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="contact-icon">
                <Coffee size={24} />
              </div>
              <div className="contact-details">
                <h3>Contact</h3>
                <p>hello@cafenoir.com<br />(555) 123-4567</p>
              </div>
            </div>
          </div>
          <div className="map-placeholder">
            📍 Map View
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="logo" style={{ color: '#d4a574', marginBottom: '1rem' }}>Café Noir</p>
          <p>Crafted with ❤️ and ☕</p>
          <div className="social-links">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">TW</a>
          </div>
          <p style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
            © 2026 Café Noir. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
