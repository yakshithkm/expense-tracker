import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const featureCards = [
  {
    title: 'Dashboard',
    description: 'View your balance, income, and expenses at a glance.',
    image: '/dashboard-page.png',
    alt: 'Dashboard preview screenshot',
  },
  {
    title: 'Transactions',
    description: 'Add, edit, and manage your financial records easily.',
    image: '/transactions-page.png',
    alt: 'Transactions preview screenshot',
  },
  {
    title: 'Analytics',
    description: 'Visualize your spending with interactive charts.',
    image: '/analytics-page.png',
    alt: 'Analytics preview screenshot',
  },
];

const onboardingSteps = [
  {
    icon: '',
    title: 'Add Transactions',
    description: 'Quickly record your income and expenses',
  },
  {
    icon: '',
    title: 'Track Your Spending',
    description: 'View all transactions and filter easily',
  },
  {
    icon: '',
    title: 'Analyze Insights',
    description: 'Understand patterns with charts and analytics',
  },
];

const Landing = () => {
  const logoSrc = `${process.env.PUBLIC_URL}/favicon.png`;

  return (
    <div className="landing-page">
      <header className="landing-navbar">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-brand" aria-label="Expense Tracker Home">
            <img src={logoSrc} alt="" className="landing-logo" aria-hidden="true" />
            <span className="brand-text">Expense Tracker</span>
          </Link>

          <nav className="landing-nav-actions" aria-label="Landing navigation">
            <Link to="/login" className="landing-btn landing-btn-secondary">
              Login
            </Link>
            <Link to="/register" className="landing-btn landing-btn-primary">
              Register
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Take Control of Your Finances</h1>
            <p>
              Track your income and expenses, analyze spending patterns, and make smarter
              financial decisions all in one place.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="landing-btn landing-btn-primary hero-btn">
                Get Started
              </Link>
              <Link to="/login" className="landing-btn landing-btn-outline hero-btn">
                Login
              </Link>
            </div>
          </div>
        </section>

        <section className="features-section section-fade-in">
          <h2>Powerful Features at Your Fingertips</h2>
          <div className="features-grid">
            {featureCards.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-image-wrap">
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    className="feature-image"
                    loading="lazy"
                  />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how-it-works-section section-fade-in">
          <h2>How It Works</h2>
          <div className="how-steps-grid">
            {onboardingSteps.map((step) => (
              <article key={step.title} className="how-step-card">
                <span className="step-icon" aria-hidden="true">{step.icon}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>© 2026 Expense Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;

