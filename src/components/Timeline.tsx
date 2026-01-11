import { motion } from 'framer-motion';
import React from 'react';
import GlassCard from './GlassCard';
import { revealParent, revealChild } from '../lib/motion';

interface TimelineItem {
  title: string;
  company?: string;
  period: string;
  description: string[];
  type: 'work' | 'education';
}

const timelineData: TimelineItem[] = [
  {
    title: 'Software Engineer',
    company: 'Backend Focus',
    period: '2023 - Present',
    type: 'work',
    description: [
      'Building scalable backend systems with Python/Django and Java/Spring',
      'Designing microservices architecture and API development',
      'Containerization with Docker and Kubernetes orchestration',
    ],
  },
  {
    title: 'Bachelor of Science',
    company: 'Computer Science',
    period: '2019 - 2023',
    type: 'education',
    description: [
      'Focused on software engineering and system design',
      'Specialized in backend development and distributed systems',
    ],
  },
];

export default function Timeline() {
  return (
    <section id="timeline" className="relative py-16 md:py-24" aria-label="Experience & Education">
      <motion.div
        className="container mx-auto px-6 max-w-6xl"
        variants={revealParent}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={revealChild} className="text-2xl font-semibold">
          Experience & Education
        </motion.h2>
        <div className="mt-8 relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/50 via-teal-400/50 to-cyan-400/50" />
          
          <div className="space-y-8">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                variants={revealChild}
                className={`relative flex items-start gap-6 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 border-4 border-[#0b0b0d] shadow-lg" />
                </div>

                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                  <GlassCard>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        {item.company && (
                          <p className="text-sm text-cyan-400/80 mt-1">{item.company}</p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          item.type === 'work'
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                        }`}
                      >
                        {item.type === 'work' ? 'Work' : 'Education'}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mb-3">{item.period}</p>
                    <ul className="space-y-2">
                      {item.description.map((desc, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 mt-1.5 flex-shrink-0" />
                          <span>{desc}</span>
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
