import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { Button, Chip } from "@heroui/react";
import { SpotlightCard } from '../components/SpotlightCard';
import { motion } from "framer-motion";
import { Brain, Globe, Zap, Eye } from 'lucide-react';

const curriculum = [
  {
    week: "MODULE 01",
    title: "The Nervous System",
    desc: "Master ROS 2 Nodes, Topics, and the architecture of robotic thought.",
    link: "/docs/module-1-ros2/week-01-intro",
    icon: Brain
  },
  {
    week: "MODULE 02",
    title: "Synthetic Worlds",
    desc: "Gazebo & Unity. Build photorealistic simulations before touching hardware.",
    link: "/docs/module-2-simulation/week-05-gazebo",
    icon: Globe
  },
  {
    week: "MODULE 03",
    title: "Parallel Training",
    desc: "NVIDIA Isaac Sim. Train robots in 10,000 parallel universes simultaneously.",
    link: "/docs/module-3-nvidia/week-08-isaac-sim",
    icon: Zap
  },
  {
    week: "MODULE 04",
    title: "VLA Brains",
    desc: "Vision-Language-Action models. The bleeding edge of Embodied AI.",
    link: "/docs/module-4-vla/week-11-vla-models",
    icon: Eye
  }
];

export default function Home() {
  return (
    <Layout title="Physical AI" description="The definitive guide to Humanoid Robotics">
      <main className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-cyan-500/40">
        
        {/* BACKGROUND LAYER */}
        <div className="fixed inset-0 z-0">
          <div className="aurora-bg" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>

        {/* CONTENT LAYER */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-24 pb-16 px-6">
          
          {/* BADGE */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Chip 
              variant="bordered" 
              className="mb-8 border-white/20 bg-white/5 backdrop-blur-md text-cyan-400 font-mono tracking-[0.2em] text-xs py-1"
            >
              SYSTEM ONLINE // V1.0
            </Chip>
          </motion.div>

          {/* HERO TITLE */}
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-6 text-center leading-[0.9]">
            PHYSICAL
            <br />
            <span 
              className="glitch-text text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
              data-text="INTELLIGENCE"
            >
              INTELLIGENCE
            </span>
          </h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-lg md:text-2xl text-zinc-400 max-w-3xl text-center mb-12 font-light"
          >
            A definitive guide to building <span className="text-white font-medium">Autonomous Humanoids</span>. 
            From ROS 2 internals to VLA Models on NVIDIA Jetson.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 mb-32"
          >
            <Button 
              as={Link} 
              href="/docs/module-1-ros2/week-01-intro"
              size="lg" 
              className="bg-white text-black font-bold text-lg px-12 py-8 rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center justify-center"
            >
              Enter The Matrix
            </Button>
            <Button 
              as={Link} 
              href="https://github.com/MuhammadRaedSiddiqui/physical-ai-textbook"
              size="lg" 
              variant="bordered" 
              className="text-white border-white/20 font-medium text-lg px-12 py-8 rounded-full backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center justify-center"
            >
              Source Code
            </Button>
          </motion.div>

          {/* BENTO GRID WITH SPOTLIGHT */}
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {curriculum.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * idx }}
                >
                  <SpotlightCard to={item.link} className="h-full flex flex-col justify-between group">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <item.icon className="w-10 h-10 text-zinc-500 group-hover:text-neon-cyan transition-all duration-500" strokeWidth={1.5} />
                        <span className="text-xs font-mono text-zinc-500 border border-zinc-800 px-2 py-1 rounded-full">{item.week}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                    <div className="mt-8 flex items-center gap-2 text-xs font-bold text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                      INITIALIZE SEQUENCE <span className="text-lg">→</span>
                    </div>
                  </SpotlightCard>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </Layout>
  );
}