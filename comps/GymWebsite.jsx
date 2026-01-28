"use client";

import React, { useState, useEffect } from 'react';
import { Menu, X, Dumbbell, Users, Calendar, Award, Clock, MapPin, Phone, Mail, ChevronRight, Star, TrendingUp, Activity, Target, CheckCircle } from 'lucide-react';

export default function GymWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [members, setMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [stats, setStats] = useState({ members: 0, classes: 0, trainers: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [selectedClass, setSelectedClass] = useState(null);
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '' });

  // Animated counter for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        members: prev.members < 2500 ? prev.members + 50 : 2500,
        classes: prev.classes < 150 ? prev.classes + 3 : 150,
        trainers: prev.trainers < 25 ? prev.trainers + 1 : 25
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load data
  useEffect(() => {
    loadMembers();
    loadBookings();
  }, []);

  const loadMembers = () => {
    const storedMembers = JSON.parse(localStorage.getItem('gymMembers') || '[]');
    setMembers(storedMembers);
  };

  const loadBookings = () => {
    const storedBookings = JSON.parse(localStorage.getItem('gymBookings') || '[]');
    setBookings(storedBookings);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit contact form");
      }

      setShowSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
};

const handleBookClass = (e) => {
  e.preventDefault();
  const booking = {
    id: Date.now(),
    ...bookingForm,
    class: selectedClass,
    date: new Date().toISOString()
  };
  const updated = [...bookings, booking];
  setBookings(updated);
  localStorage.setItem('gymBookings', JSON.stringify(updated));

  setSelectedClass(null);
  setBookingForm({ name: '', email: '', phone: '' });
  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 3000);
};

const features = [
  { icon: <Dumbbell className="w-8 h-8" />, title: "Premium Equipment", desc: "State-of-the-art machines and free weights" },
  { icon: <Users className="w-8 h-8" />, title: "Expert Trainers", desc: "Certified professionals to guide your journey" },
  { icon: <Calendar className="w-8 h-8" />, title: "Flexible Schedule", desc: "Open 24/7 for your convenience" },
  { icon: <Award className="w-8 h-8" />, title: "Results Driven", desc: "Proven programs that deliver results" }
];

const classes = [
  { id: 1, name: "Strength Training", time: "Mon, Wed, Fri - 6:00 AM", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80", spots: 12 },
  { id: 2, name: "HIIT Cardio", time: "Tue, Thu - 7:00 AM", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80", spots: 15 },
  { id: 3, name: "Yoga & Flexibility", time: "Daily - 8:00 AM", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80", spots: 20 },
  { id: 4, name: "CrossFit", time: "Mon-Sat - 5:00 PM", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80", spots: 10 }
];

const plans = [
  { name: "Starter", price: "29", features: ["Access to gym floor", "Basic equipment", "Locker room access"] },
  { name: "Pro", price: "59", features: ["All Starter features", "Group classes", "Personal trainer (2x/month)", "Nutrition guide"], popular: true },
  { name: "Elite", price: "99", features: ["All Pro features", "Unlimited personal training", "Supplement guidance", "Priority booking"] }
];

const testimonials = [
  { name: "Sarah Johnson", text: "Best gym I've ever joined! Lost 30 lbs in 4 months.", rating: 5 },
  { name: "Mike Chen", text: "The trainers are incredibly knowledgeable and supportive.", rating: 5 },
  { name: "Emily Rodriguez", text: "Clean facilities, great equipment, friendly community!", rating: 5 }
];

/* ---------- JSX ---------- */

return (
  <div className="min-h-screen bg-black text-white overflow-x-hidden">
    {/* 🔥 Your entire JSX stays EXACTLY THE SAME here */}
    {/* No change needed in layout / Tailwind / animations */}
    {showSuccess && (
      <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl animate-slideIn flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        Success! We'll get back to you soon.
      </div>
    )}

    {/* Navigation */}
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-2xl font-bold animate-pulse">
          <Dumbbell className="w-8 h-8 text-red-500 animate-spin-slow" />
          <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">IRONPEAK</span>
        </div>

        <div className="hidden md:flex space-x-8">
          {['Home', 'Features', 'Classes', 'Pricing', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-red-500 transition-colors duration-300 relative group">
              {item}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        <button className="hidden md:block bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-110">
          Join Now
        </button>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-sm py-4 px-4 space-y-4 animate-slideDown">
          {['Home', 'Features', 'Classes', 'Pricing', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block hover:text-red-500" onClick={() => setIsMenuOpen(false)}>
              {item}
            </a>
          ))}
          <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-2 rounded-full font-semibold">
            Join Now
          </button>
        </div>
      )}
    </nav>

    {/* Hero Section */}
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-red-900/20 to-black z-0"></div>
      <img
        src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80"
        alt="Gym"
        className="absolute inset-0 w-full h-full object-cover opacity-40 animate-zoom"
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fadeInUp">
          TRANSFORM YOUR
          <span className="block bg-gradient-to-r from-red-500 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            BODY & MIND
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          Join the elite. Train with purpose. Achieve greatness.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <button className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse">
            Start Free Trial
          </button>
          <button className="border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105">
            Watch Tour
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronRight className="w-8 h-8 rotate-90" />
      </div>
    </section>

    {/* Stats Counter */}
    <section className="py-12 bg-gradient-to-r from-red-600 to-orange-600">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
        <div className="animate-fadeInUp">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="w-8 h-8" />
            <div className="text-4xl md:text-5xl font-bold">{stats.members}+</div>
          </div>
          <div className="text-sm md:text-base">Active Members</div>
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="w-8 h-8" />
            <div className="text-4xl md:text-5xl font-bold">{stats.classes}+</div>
          </div>
          <div className="text-sm md:text-base">Weekly Classes</div>
        </div>
        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Award className="w-8 h-8" />
            <div className="text-4xl md:text-5xl font-bold">{stats.trainers}+</div>
          </div>
          <div className="text-sm md:text-base">Expert Trainers</div>
        </div>
      </div>
    </section>

    {/* Features */}
    <section id="features" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-fadeInUp">
          Why Choose <span className="text-red-500">IronPeak</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-2 group animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300 animate-float">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Classes with Booking */}
    <section id="classes" className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-fadeInUp">
          Popular <span className="text-red-500">Classes</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {classes.map((cls, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-2xl cursor-pointer animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
              <img src={cls.image} alt={cls.name} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold mb-2">{cls.name}</h3>
                <p className="text-gray-300 flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" />
                  {cls.time}
                </p>
                <p className="text-sm text-green-400 mb-3">{cls.spots} spots available</p>
                <button
                  onClick={() => setSelectedClass(cls)}
                  className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Booking Modal */}
    {selectedClass && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl max-w-md w-full border border-red-500/20 animate-scaleIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold">Book {selectedClass.name}</h3>
            <button onClick={() => setSelectedClass(null)} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Your Name"
              value={bookingForm.name}
              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={bookingForm.email}
              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
            <input
              type="tel"
              placeholder="Your Phone"
              value={bookingForm.phone}
              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
            />
          </div>
          <button
            onClick={handleBookClass}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    )}

    {/* Pricing */}
    <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-fadeInUp">
          Membership <span className="text-red-500">Plans</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div key={idx} className={`rounded-2xl p-8 ${plan.popular ? 'bg-gradient-to-br from-red-500 to-orange-500 transform scale-105 animate-pulse-slow' : 'bg-gray-800'} hover:shadow-2xl transition-all duration-300 animate-fadeInUp`} style={{ animationDelay: `${idx * 0.1}s` }}>
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-bold animate-bounce">MOST POPULAR</span>
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${plan.popular ? 'bg-black text-white hover:bg-gray-900' : 'bg-red-500 text-white hover:bg-red-600'}`}>
                Choose Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-fadeInUp">
          Member <span className="text-red-500">Success Stories</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 transform hover:-translate-y-2 animate-fadeInUp" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-twinkle" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
              <p className="font-bold text-red-500">- {testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Contact */}
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-fadeInUp">
          Get In <span className="text-red-500">Touch</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6 animate-fadeInUp">
            <div className="flex items-start gap-4 group">
              <MapPin className="w-6 h-6 text-red-500 mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-bold mb-1">Location</h3>
                <p className="text-gray-400">123 Fitness Street, Gym City, GC 12345</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <Phone className="w-6 h-6 text-red-500 mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-bold mb-1">Phone</h3>
                <p className="text-gray-400">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <Mail className="w-6 h-6 text-red-500 mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="font-bold mb-1">Email</h3>
                <p className="text-gray-400">info@ironpeak.com</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all transform focus:scale-105"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all transform focus:scale-105"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-gray-800 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all transform focus:scale-105"
            ></textarea>
            <button
              onClick={handleContactSubmit}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-black border-t border-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center text-gray-400">
        <p>&copy; 2024 IronPeak Gym. All rights reserved.</p>
        <p className="mt-2 text-sm">Active Bookings: {bookings.length} | Total Inquiries: {contactSubmissions.length}</p>
      </div>
    </footer>
  </div>
);
}
