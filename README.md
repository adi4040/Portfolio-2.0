# Portfolio React - Aditya Suryawanshi

A modern, responsive portfolio website built with React.js, featuring a beautiful 3D background, smooth animations, and comprehensive sections showcasing skills, projects, and achievements.

## 🚀 Features

- **Modern React Architecture**: Built with React 18 and functional components
- **3D Background**: Interactive Three.js background with stars and infinity curve
- **Responsive Design**: Mobile-first approach with Tailwind CSS utilities
- **Smooth Animations**: Scroll-triggered animations and transitions
- **Interactive Components**: LeetCode statistics modal, typing effects, and more
- **Performance Optimized**: Efficient rendering and lazy loading

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── SideNavigation.js    # Side navigation menu
│   ├── Background3D.js      # Three.js 3D background
│   ├── Hero.js             # Hero section with typing effect
│   ├── About.js            # About section
│   ├── Experience.js       # Work experience timeline
│   ├── Education.js        # Education details
│   ├── Projects.js         # Featured projects grid
│   ├── Research.js         # Research work
│   ├── Patents.js          # Patents & innovations
│   ├── Achievements.js     # Achievements & awards
│   ├── Skills.js           # Technical skills with progress bars
│   ├── Certifications.js   # Professional certifications
│   ├── Publications.js     # Research publications
│   ├── Volunteering.js     # Volunteering activities
│   ├── Contact.js          # Contact section
│   ├── Footer.js           # Footer
│   └── LeetCodeModal.js    # LeetCode statistics modal
├── App.js                 # Main App component
├── index.js               # React entry point
├── index.css              # Global styles
└── App.css                # App-specific styles

public/
├── index.html             # HTML template
└── manifest.json          # PWA manifest
```

## 🛠️ Technologies Used

- **Frontend**: React 18, JavaScript (ES6+)
- **Styling**: CSS3, Tailwind CSS utilities
- **3D Graphics**: Three.js
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter, JetBrains Mono, Playfair Display)
- **Build Tool**: Create React App

## 📱 Sections

1. **Hero**: Animated typing effect with call-to-action buttons
2. **About**: Personal introduction and technology stack
3. **Experience**: Professional work timeline
4. **Education**: Academic background and achievements
5. **Projects**: Featured projects with technologies used
6. **Research**: Current and completed research work
7. **Patents**: Patent applications and innovations
8. **Achievements**: Awards, competitions, and LeetCode stats
9. **Skills**: Technical skills with animated progress bars
10. **Certifications**: Professional certifications
11. **Publications**: Research papers and publications
12. **Volunteering**: Community involvement and events
13. **Contact**: Get in touch section

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### LeetCode Integration

Update the LeetCode username in `src/components/LeetCodeModal.js`:

```javascript
const LEETCODE_CONFIG = {
  username: 'YOUR_LEETCODE_USERNAME', // Update this
  displayName: 'Your Name',
  // ... other config
};
```

### Customization

- **Colors**: Modify CSS variables in `src/index.css`
- **Content**: Update component data in respective component files
- **Styling**: Modify `src/App.css` for layout adjustments

## 📱 Responsive Design

The portfolio is fully responsive with:
- Mobile-first approach
- Collapsible side navigation on mobile
- Optimized 3D background for different devices
- Adaptive grid layouts
- Touch-friendly interactions

## 🎨 Key Features

### 3D Background
- Interactive starfield with 15,000+ stars (desktop) / 5,000+ stars (mobile)
- Scroll-reactive infinity curve tracer
- Performance optimized for mobile devices
- Smooth animations and transitions

### Animations
- Scroll-triggered animations using Intersection Observer
- Typing effect in hero section
- Skill progress bar animations
- Smooth page transitions

### Interactive Elements
- LeetCode statistics modal with real-time data
- Smooth scrolling navigation
- Hover effects on cards and buttons
- Responsive side navigation

## 🚀 Performance Features

- **Lazy Loading**: Components load as needed
- **Optimized 3D**: Reduced complexity on mobile devices
- **Efficient Rendering**: React optimization techniques
- **CSS Animations**: Hardware-accelerated animations
- **Responsive Images**: Optimized for different screen sizes

## 🔒 Security

- No sensitive data exposed in client-side code
- Secure external links with `rel="noopener noreferrer"`
- Sanitized user inputs
- HTTPS enforcement for external resources

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

- **Email**: adityasuryawanshi4040@gmail.com
- **LinkedIn**: [Aditya Suryawanshi](https://www.linkedin.com/in/aditya-suryawanshi-4783832b3)
- **GitHub**: [adi4040](https://github.com/adi4040)

## 🙏 Acknowledgments

- Three.js community for 3D graphics library
- Font Awesome for beautiful icons
- Google Fonts for typography
- React community for the amazing framework

---

**Built with ❤️ by Aditya Suryawanshi**
