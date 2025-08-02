import React from 'react';
import { Link } from 'react-router';
import { FaCheck, FaStar, FaCrown, FaUserFriends } from 'react-icons/fa';
import '../../style/homePage/plansSection.css';

const PlansSection = () => {
  const plans = [
    {
      id: 1,
      name: 'Basic Plan',
      price: '$29',
      period: '/month',
      description: 'Perfect for beginners starting their fitness journey',
      features: [
        'Access to basic workout programs',
        'Progress tracking',
        'Email support',
        'Mobile app access'
      ],
      popular: false,
      icon: <FaUserFriends />,
      color: '#4CAF50'
    },
    {
      id: 2,
      name: 'Premium Plan',
      price: '$59',
      period: '/month',
      description: 'Most popular choice for serious fitness enthusiasts',
      features: [
        'All Basic features',
        'Personal trainer consultation',
        'Custom workout plans',
        'Nutrition guidance',
        'Priority support',
        'Video call sessions'
      ],
      popular: true,
      icon: <FaStar />,
      color: '#FFD700'
    },
    {
      id: 3,
      name: 'Elite Plan',
      price: '$99',
      period: '/month',
      description: 'Ultimate fitness experience with maximum benefits',
      features: [
        'All Premium features',
        '1-on-1 personal training',
        'Weekly progress reviews',
        'Meal planning',
        '24/7 support',
        'Exclusive content access',
        'Group training sessions'
      ],
      popular: false,
      icon: <FaCrown />,
      color: '#9C27B0'
    }
  ];

  return (
    <section className="plans-section">
      <div className="container">
        <div className="plans-header">
          <h2>Choose Your Plan</h2>
          <p>Select the perfect plan that fits your fitness goals and budget</p>
        </div>
        
        <div className="plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.popular ? 'popular' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">
                  <span>Most Popular</span>
                </div>
              )}
              
              <div className="plan-header">
                <div className="plan-icon" style={{ color: plan.color }}>
                  {plan.icon}
                </div>
                <h3>{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>
              </div>
              
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <FaCheck className="check-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link to="/register" className="plan-button">
                Get Started
              </Link>
            </div>
          ))}
        </div>
        
        <div className="plans-footer">
          <p>All plans include a 30-day money-back guarantee</p>
          <p>Need help choosing? <Link to="/contact">Contact us</Link></p>
        </div>
      </div>
    </section>
  );
};

export default PlansSection; 