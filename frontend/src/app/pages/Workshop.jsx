import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import svgPaths from '../../imports/svg-go1x4xx39u';
import eventService from '../services/eventService';
import authService from '../services/authService';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

// --- Helper: Auto-classify event as 'past' or 'upcoming' based on date ---
// Vibrant palette for event cards (cycles through)
const EVENT_COLORS = [
  'bg-[#14627a]',
  'bg-[#0183AB]',
  'bg-[#2e7e96]',
  'bg-[#1a5276]',
  'bg-[#117a65]',
  'bg-[#6c3483]',
  'bg-[#922b21]',
  'bg-[#7d6608]',
];

function classifyEvents(events) {
  const now = new Date();
  // Normalize today to midnight so same-day events are still "upcoming"
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return events.map((event, index) => {
    // Use startDateTime (the field the backend/model actually returns)
    const eventDate = new Date(event.startDateTime);
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    // Format a human-readable time string, e.g. "10:00 AM"
    const timeStr = eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Location: show meeting link host if present, otherwise fall back to event type
    let locationStr = event.eventType || 'Online';
    if (event.meetingLink) {
      try {
        locationStr = new URL(event.meetingLink).hostname.replace('www.', '');
      } catch (_) {
        locationStr = 'Online';
      }
    }

    return {
      ...event,
      type: eventDay < today ? 'past' : 'upcoming',
      // Derive display month/day from startDateTime
      month: eventDate.toLocaleString('default', { month: 'short' }),
      day: String(eventDate.getDate()),
      time: timeStr,
      location: locationStr,
      // Assign a rotating vibrant background color
      bgColor: EVENT_COLORS[index % EVENT_COLORS.length],
    };
  });
}


// --- Components ---

function ArrowRightLine() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="arrow-right-line">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g clipPath="url(#clip0_1_3339)" id="arrow-right-line">
          <path d={svgPaths.p39c35b00} fill="var(--fill-0, white)" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_1_3339">
            <rect fill="white" height="24" width="24" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function EventCard({ month, day, title, time, location, bgColor, type }) {
  return (
    <motion.div
      layout
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className={`${bgColor} w-full rounded-[25px] overflow-hidden shadow-lg cursor-pointer relative`}
    >
      {/* Past event overlay badge */}
      {type === 'past' && (
        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Past
        </div>
      )}

      <div className={`p-5 sm:p-6 space-y-3 sm:space-y-4 ${type === 'past' ? 'opacity-75' : ''}`}>
        <div className="font-['Public_Sans:Bold',sans-serif] font-bold text-[36px] sm:text-[44px] md:text-[48px] text-white tracking-[0.36px]">
          <p className="leading-[1]">{month}</p>
        </div>
        <div className="font-['Public_Sans:Bold',sans-serif] font-bold text-[44px] sm:text-[52px] md:text-[55px] text-white">
          <p className="leading-[1]">{day}</p>
        </div>
        <div className="font-['Public_Sans:ExtraBold',sans-serif] font-extrabold text-[26px] sm:text-[32px] md:text-[38px] text-white tracking-[0.08px]">
          <p className="leading-[1.1]">{title}</p>
        </div>
        <div className="flex items-end justify-between gap-2 pt-1">
          <div className="flex flex-col">
            <span className="font-['Public_Sans:Bold',sans-serif] font-bold text-[15px] sm:text-[18px] md:text-[20px] text-white leading-[2]">
              {time}
            </span>
            <span className="font-['Public_Sans:Bold',sans-serif] font-bold text-[15px] sm:text-[18px] md:text-[20px] text-white leading-[2]">
              {location}
            </span>
          </div>
          <div className="mb-1 shrink-0">
            <ArrowRightLine />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Workshop() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationMessage, setRegistrationMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventService.getEvents();
        const classified = classifyEvents(data);
        setEvents(classified);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegisterClick = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    
    // In a full implementation, you'd select a specific event to register for.
    // Here we'll show a general registration success message or redirect to an apply flow.
    setRegistrationMessage('Successfully registered interest for upcoming events!');
    setTimeout(() => setRegistrationMessage(''), 3000);
  };


  const displayed = filter === 'all' ? events : events.filter(e => e.type === filter);

  const upcomingCount = events.filter(e => e.type === 'upcoming').length;
  const pastCount     = events.filter(e => e.type === 'past').length;

  return (
    <div className="bg-white flex flex-col min-h-screen overflow-x-hidden">
      <Header />

      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-br from-[#f8f9fa] to-[#e7f3f5] py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.h1 
            variants={fadeInUp}
            className="font-['DM_Serif_Text:Regular',sans-serif] text-[38px] sm:text-[56px] md:text-[72px] lg:text-[80px] text-[#2e7e96] leading-tight mb-4 sm:mb-6"
          >
            Our Events
          </motion.h1>
          <motion.p 
            variants={fadeInUp}
            className="font-['Public_Sans:Regular',sans-serif] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-[#6d737a] leading-relaxed max-w-4xl mx-auto"
          >
            Our recent event was a great success, bringing together industry leaders and
            professionals to explore the latest trends and innovations. It featured keynote
            sessions, panel discussions, and hands-on workshops, providing valuable
            insights and networking opportunities. The event concluded with a Q&amp;A session,
            fostering meaningful discussions and collaborations.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Filter Toggle ── */}
      <div className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-center">
          <div className="inline-flex p-1.5 bg-gray-100 rounded-[20px] border border-gray-200">
            {[
              { key: 'all',      label: 'All Events' },
              { key: 'upcoming', label: `Upcoming (${upcomingCount})` },
              { key: 'past',     label: `Past (${pastCount})` },
            ].map(({ key, label }) => {
              const isActive = filter === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`relative px-6 sm:px-8 py-2.5 rounded-[15px] text-sm md:text-base font-semibold transition-colors duration-300 focus:outline-none ${
                    isActive ? 'text-white' : 'text-[#6d737a] hover:text-[#14627a]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabPill"
                      className="absolute inset-0 bg-[#14627a] rounded-[15px] shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Toast Notification ── */}
      <AnimatePresence>
        {registrationMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl font-['Public_Sans:Medium',sans-serif]"
          >
            {registrationMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Events Grid ── */}
      <div className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#14627a]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 text-lg">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-[#14627a] text-white rounded-lg"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {displayed.map((event) => (
                    <EventCard key={event._id || event.id} {...event} />
                  ))}
                </AnimatePresence>
              </motion.div>

              {displayed.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[#6d737a] text-lg mt-20"
                >
                  No events found.
                </motion.p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── CTA Section ── */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-[#14627a] to-[#0183AB] py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8 mt-auto"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="font-['Public_Sans:SemiBold',sans-serif] text-[24px] sm:text-[32px] md:text-[38px] lg:text-[40px] text-white leading-tight mb-4 sm:mb-6"
          >
            Don't Miss Our Upcoming Events
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="font-['Public_Sans:Regular',sans-serif] text-[14px] sm:text-[16px] md:text-[18px] text-white/90 mb-8 sm:mb-10"
          >
            Register now to secure your spot and be part of our vibrant learning community
          </motion.p>
          <motion.button 
            onClick={handleRegisterClick}
            whileHover={{ scale: 1.05, backgroundColor: "#ffd194" }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#ffc27a] text-[#14627a] px-10 sm:px-12 py-4 sm:py-5 rounded-xl font-bold text-[16px] sm:text-[18px] transition-all shadow-xl"
          >
            Register for Events
          </motion.button>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
