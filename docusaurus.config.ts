import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'From ROS 2 to Vision-Language-Action Models',
  favicon: 'img/favicon.ico',

  // Google Fonts for HUD theme
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap',
      },
    },
  ],

  // Tailwind CSS PostCSS plugin (v4 uses @tailwindcss/postcss)
  plugins: [
    async function tailwindPlugin(context, options) {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('@tailwindcss/postcss'));
          return postcssOptions;
        },
      };
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://MuhammadRaedSiddiqui.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'MuhammadRaedSiddiqui', // Usually your GitHub org/user name.
  projectName: 'physical-ai-textbook', // Usually your repo name.

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    // Navbar is handled by custom CardNav component in src/components/react-bits/CardNav.tsx
    // The CardNav includes the AuthButton for authentication
    // navbar: {
    //   title: 'Physical AI & Humanoid Robotics',
    //   logo: {
    //     alt: 'Physical AI Logo',
    //     src: 'img/logo.svg',
    //   },
    //   items: [
    //     {
    //       type: 'docSidebar',
    //       sidebarId: 'tutorialSidebar',
    //       position: 'left',
    //       label: 'Curriculum',
    //     },
    //     {
    //       href: 'https://github.com/MuhammadRaedSiddiqui/physical-ai-textbook',
    //       label: 'GitHub',
    //       position: 'right',
    //     },
    //   ],
    // },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'ROS 2 Foundations',
          items: [
            {
              label: 'Week 1: Introduction',
              to: '/docs/module-1-ros2/week-01-intro',
            },
            {
              label: 'Week 2: Architecture',
              to: '/docs/module-1-ros2/week-02-architecture',
            },
            {
              label: 'Week 3: Communication',
              to: '/docs/module-1-ros2/week-03-communication',
            },
            {
              label: 'Week 4: Nav2',
              to: '/docs/module-1-ros2/week-04-nav2',
            },
          ],
        },
        {
          title: 'Simulation',
          items: [
            {
              label: 'Week 5: Gazebo',
              to: '/docs/module-2-simulation/week-05-gazebo',
            },
            {
              label: 'Week 6: Unity',
              to: '/docs/module-2-simulation/week-06-unity',
            },
            {
              label: 'Week 7: Sim-to-Real',
              to: '/docs/module-2-simulation/week-07-sim-to-real',
            },
          ],
        },
        {
          title: 'NVIDIA & AI',
          items: [
            {
              label: 'Week 8: Isaac Sim',
              to: '/docs/module-3-nvidia/week-08-isaac-sim',
            },
            {
              label: 'Week 9: RL Gym',
              to: '/docs/module-3-nvidia/week-09-rl-gym',
            },
            {
              label: 'Week 10: Jetson',
              to: '/docs/module-3-nvidia/week-10-jetson',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/MuhammadRaedSiddiqui/physical-ai-textbook',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Physical AI & Humanoid Robotics. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
