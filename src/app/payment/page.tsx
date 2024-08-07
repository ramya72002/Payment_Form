'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './payment.scss';

const Payment = () => {
  const [formData, setFormData] = useState({
    playerFirstName: '',
    playerLastName: '',
    parentFirstName: '',
    parentLastName: '',
    phoneNumber: '',
    email: '',
    section: '',
    signupDate: new Date().toISOString() // Initialize with the current date and time
  });
  
  const [tournamentTimings, setTournamentTimings] = useState<string>('');

  useEffect(() => {
    // Fetch tournament timings from the API
    const fetchTournamentTimings = async () => {
      try {
        const response = await axios.get('https://payment-form-backend.vercel.app/tournament-timings');
        setTournamentTimings(response.data);
      } catch (error) {
        console.error('Error fetching tournament timings:', error);
      }
    };

    fetchTournamentTimings();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = event.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      // First, submit the form data
      await axios.post('https://payment-form-backend.vercel.app/signup', formData);
  
      // Prepare the email details
      const emailData = {
        email: formData.email,
        subject: `Thank You for Registering! Tournament Details for ${tournamentTimings}`,
        body: `
          Dear ${formData.parentFirstName} ${formData.parentLastName},
  
          Thank you for registering  in our Kids Chess Tournament.
  
          Tournament Timing: ${tournamentTimings}
  
          We look forward to seeing you there!
  
          Best regards,
          The Chess Tournament Team
        `
      };
  
      // Send the email
      await axios.post('https://payment-form-backend.vercel.app/send-email', emailData);
  
      // Redirect to Stripe payment page
      window.location.href = 'https://buy.stripe.com/3cs4jw8xYePG6Qg9AA';
    } catch (error) {
      console.error('Error during API call:', error);
    }
  };
  

  return (
    <div className="payment-container">
      <div className="tournament-header">
        <img src="/images/logo.png" alt="Chess Tournament Logo" className="tournament-logo" />
        <h1>Kids Chess Tournament: Registration</h1>
        <p>Tournament Timing: {tournamentTimings || 'Loading...'}</p>
      </div>

      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="playerFirstName">Player Name <span className="required">*</span></label>
          <div className="name-fields">
            <input 
              type="text" 
              id="playerFirstName" 
              placeholder="First Name" 
              required 
              value={formData.playerFirstName}
              onChange={handleChange}
            />
            <input 
              type="text" 
              id="playerLastName" 
              placeholder="Last Name" 
              value={formData.playerLastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="parentFirstName">Parent Name <span className="required">*</span></label>
          <div className="name-fields">
            <input 
              type="text" 
              id="parentFirstName" 
              placeholder="First Name" 
              required 
              value={formData.parentFirstName}
              onChange={handleChange}
            />
            <input 
              type="text" 
              id="parentLastName" 
              placeholder="Last Name" 
              value={formData.parentLastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number <span className="required">*</span></label>
          <input 
            type="tel" 
            id="phoneNumber" 
            placeholder="(000) 000-0000" 
            required 
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">E-mail <span className="required">*</span></label>
          <input 
            type="email" 
            id="email" 
            placeholder="example@yahoo.com" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="section">Section <span className="required">*</span></label>
          <select 
            id="section" 
            required 
            value={formData.section}
            onChange={handleChange}
          >
            <option value="">Please Select</option>
            <option value="Championship (K-2; 3rd Grade; 4th Grade; 5th Grade) - $20.00">Championship (K-2; 3rd Grade; 4th Grade; 5th Grade) - $20.00</option>
            <option value="Open - $20.00">Open - $20.00</option>          
          </select>
        </div>

        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default Payment;
