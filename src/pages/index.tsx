import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { CardSwap, DecryptedText, GridScan, SpotlightCard, ClickSpark } from '../components/react-bits';
import { CardIcons } from '../components/react-bits/icons';
import { Card } from '../components/react-bits/CardSwap';
import CardNav from '../components/react-bits/CardNav';




const items = [
  {
    label: "ROS 2 Foundations",
    bgColor: "linear-gradient(135deg, #050505 0%, #0a1820 100%)",
    textColor: "#00f3ff",
    links: [
      { label: "Week 1: Introduction", href: "/docs/module-1-ros2/week-01-intro", ariaLabel: "ROS 2 Introduction" },
      { label: "Week 2: Architecture", href: "/docs/module-1-ros2/week-02-architecture", ariaLabel: "ROS 2 Architecture" },
      { label: "Week 3: Communication", href: "/docs/module-1-ros2/week-03-communication", ariaLabel: "ROS 2 Communication" },
      { label: "Week 4: Nav2", href: "/docs/module-1-ros2/week-04-nav2", ariaLabel: "Navigation Stack" }
    ]
  },
  {
    label: "Simulation",
    bgColor: "linear-gradient(135deg, #050505 0%, #0a1820 100%)",
    textColor: "#00f3ff",
    links: [
      { label: "Week 5: Gazebo", href: "/docs/module-2-simulation/week-05-gazebo", ariaLabel: "Gazebo Simulation" },
      { label: "Week 6: Unity", href: "/docs/module-2-simulation/week-06-unity", ariaLabel: "Unity Simulation" },
      { label: "Week 7: Sim-to-Real", href: "/docs/module-2-simulation/week-07-sim-to-real", ariaLabel: "Sim to Real Transfer" }
    ]
  },
  {
    label: "NVIDIA & AI",
    bgColor: "linear-gradient(135deg, #050505 0%, #0a1820 100%)",
    textColor: "#00f3ff",
    links: [
      { label: "Week 8: Isaac Sim", href: "/docs/module-3-nvidia/week-08-isaac-sim", ariaLabel: "Isaac Sim" },
      { label: "Week 9: RL Gym", href: "/docs/module-3-nvidia/week-09-rl-gym", ariaLabel: "RL Gym" },
      { label: "Week 10: Jetson", href: "/docs/module-3-nvidia/week-10-jetson", ariaLabel: "Jetson Deployment" }
    ]
  }
];




// HUD-styled hero section with GridScan background and DecryptedText title (FR-007, FR-009)
function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* GridScan animated background (FR-007) */}
      <div className="absolute inset-0 w-full h-full">
        <GridScan
          sensitivity={0.55}
          lineThickness={1}
          linesColor="#0a1820"
          gridScale={0.1}
          scanColor="#00f3ff"
          scanOpacity={0.5}
          enablePost
          bloomIntensity={0.8}
          chromaticAberration={0.002}
          noiseIntensity={0.01}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center px-4">
        {/* Decrypted title animation (FR-009) */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif', color: '#00f3ff' }}>
          <DecryptedText text={siteConfig.title} />
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#a0a0a0' }}>
          {siteConfig.tagline}
        </p>

        {/* CTA Button (T020 - Fixed link path) */}
        <Link
          className="inline-block px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: 'transparent',
            border: '2px solid #ffffffff',
            color: '#ffffffff',
            fontFamily: 'Rajdhani, sans-serif',
          }}
          to="/docs/module-1-ros2/week-01-intro">
          Start the Course →
        </Link>
      </div>

      {/* Decorative HUD elements */}
      <div className="absolute bottom-8 left-8 text-xs" style={{ color: '#00f3ff', opacity: 0.5, fontFamily: 'JetBrains Mono, monospace' }}>
        SYS.READY // v1.0.0
      </div>
      <div className="absolute bottom-8 right-8 text-xs" style={{ color: '#00f3ff', opacity: 0.5, fontFamily: 'JetBrains Mono, monospace' }}>
        PHYSICAL_AI_TEXTBOOK
      </div>
    </header>
  );
}

// Sim-to-Real pipeline card data (T034)
const pipelineCards = [
  {
    title: 'Gazebo Simulation',
    description: 'ROS 2 integrated physics simulation for robot development and testing',
    icon: '🔬',
  },
  {
    title: 'Isaac Sim',
    description: 'NVIDIA GPU-accelerated simulation with photorealistic rendering',
    icon: '🎮',
  },
  {
    title: 'Real Robot',
    description: 'Deploy trained models to physical hardware with sim-to-real transfer',
    icon: '🤖',
  },
];

// Capstone showcase section with CardSwap gallery (FR-010)
function CapstoneShowcase() {
  // Enhanced card content and style
  const enhancedCards = [
    {
      title: 'Simulation in Gazebo',
      description: 'Build, test, and visualize robots in a realistic physics environment. Supports ROS 2 integration and rapid prototyping.',
      icon: CardIcons[0],
      color: '#00f3ff',
      gradient: 'linear-gradient(135deg, #050505 0%, #0a1820 100%)',
    },
    {
      title: 'Photorealistic Isaac Sim',
      description: 'Leverage NVIDIA’s GPU-accelerated Isaac Sim for advanced AI training, domain randomization, and high-fidelity rendering.',
      icon: CardIcons[1],
      color: '#00f3ff',
      gradient: 'linear-gradient(135deg, #050505 0%, #0a1820 100%)',
    },
    {
      title: 'Deploy to Real Robot',
      description: 'Transfer your models to physical robots with sim-to-real techniques. Validate, iterate, and deploy in the real world.',
      icon: CardIcons[2],
      color: '#00f3ff',
      gradient: 'linear-gradient(135deg, #050505 0%, #0a1820 100%)',
    },
  ];
  return (
    <section className="min-h-screen flex items-center py-20 px-4" style={{ background: 'radial-gradient(ellipse at 50% 0%, #0a1820 60%, #050505 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left: Heading and text */}
          <div className="flex-1 text-left md:pr-12 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Orbitron, sans-serif', color: '#00f3ff', letterSpacing: 1 }}>
              Sim-to-Real Pipeline
            </h2>
            <p className="text-xl max-w-xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#a0a0a0' }}>
              Go from simulation to real-world deployment with a modern robotics workflow. Learn to build, train, and deploy robots using the latest tools in simulation and AI.
            </p>
            <ul className="mt-8 space-y-3 text-base" style={{ color: '#00f3ff', fontFamily: 'JetBrains Mono, monospace' }}>
              <li>✓ Physics-based simulation</li>
              <li>✓ GPU-accelerated AI training</li>
              <li>✓ Seamless sim-to-real transfer</li>
            </ul>
          </div>
          {/* Right: CardSwap */}
          <div className="flex-1 flex justify-center">
            <div style={{ width: 400, height: 280, position: 'relative' }}>
              <BrowserOnly fallback={<div className="h-80 flex items-center justify-center text-gray-500">Loading...</div>}>
                {() => (
                  <CardSwap
                    width={400}
                    height={280}
                    cardDistance={70}
                    verticalDistance={30}
                    skewAmount={10}
                    easing="elastic"
                    pauseOnHover={true}
                    delay={5000}
                    onCardClick={(idx) => {
                      // Move clicked card to front
                      const el = document.querySelectorAll('.capstone-card')[idx];
                      if (el) el.click();
                    }}
                  >
                    {enhancedCards.map((card, index) => {
                      const Icon = card.icon;
                      return (
                        <SpotlightCard
                          key={index}
                          className="capstone-card flex flex-col h-full w-full items-center justify-between shadow-xl cursor-pointer"
                          style={{
                            background: card.gradient,
                            border: `2px solid ${card.color}`,
                            borderRadius: 18,
                            boxShadow: `0 6px 32px 0 ${card.color}33`,
                            color: card.color,
                            padding: 0,
                            minHeight: 240,
                            maxHeight: 260,
                            minWidth: 320,
                            maxWidth: 380,
                            transition: 'box-shadow 0.3s',
                          }}
                        >
                          <div className="w-full flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: card.color, fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>
                            <Icon style={{ fontSize: 28 }} />
                            {card.title}
                          </div>
                          <div className="flex-1 flex items-center justify-center px-8 py-6 text-base" style={{ fontFamily: 'Rajdhani, sans-serif', color: '#fff', textShadow: '0 2px 8px #0008', fontSize: 17, lineHeight: 1.5 }}>
                            {card.description}
                          </div>
                        </SpotlightCard>
                      );
                    })}
                  </CardSwap>
                )}
              </BrowserOnly>
            </div>
          </div>
        </div>
        <p className="text-center mt-12 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00f3ff', opacity: 0.5 }}>
          Click to swap cards • Auto-cycles every 5s
        </p>
      </div>
    </section>
  );
}

// Course modules section with SpotlightCards
function ModulesSection() {
  const modules = [
    { title: 'ROS 2 Foundations', weeks: '4 weeks', icon: '🔧' },
    { title: 'Simulation', weeks: '3 weeks', icon: '🎯' },
    { title: 'NVIDIA Stack', weeks: '3 weeks', icon: '💚' },
    { title: 'VLA Models', weeks: '2 weeks', icon: '🧠' },
  ];

  return (
    <section className="py-20 px-4" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ fontFamily: 'Orbitron, sans-serif', color: '#00f3ff' }}>
          Course Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.map((module, index) => (
            <SpotlightCard key={index} className="p-6 text-center">
              <div className="text-4xl mb-4">{module.icon}</div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Orbitron, sans-serif', color: '#00f3ff' }}>
                {module.title}
              </h3>
              <p className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#a0a0a0' }}>
                {module.weeks}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Learn Physical AI and Humanoid Robotics from ROS 2 to Vision-Language-Action Models">
      <ClickSpark
        sparkColor='#fff'
        sparkSize={15}
        sparkRadius={25}
        sparkCount={8}
        duration={400}
      >

        <HomepageHero />
        <CardNav
          logo={''}
          logoAlt=""
          items={items}
          baseColor="rgba(5, 5, 5, 0.95)"
          menuColor="#00f3ff"
          buttonBgColor="#00f3ff"
          buttonTextColor="#050505"
          ease="power3.out"
        />
        <main className="bg-[#050505]">
          <CapstoneShowcase />
          {/* <ModulesSection /> */}
        </main>
      </ClickSpark>
    </Layout>
  );
}
