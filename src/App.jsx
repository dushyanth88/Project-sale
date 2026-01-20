import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  Rocket,
  CheckCircle2,
  Send,
  X,
  Layout,
  Cpu,
  Globe
} from 'lucide-react';
// EmailJS is replaced by Web3Forms per user request
import { projects } from './data/projects';
import logo from './assets/logo.jpeg';
import './App.css';

const WEB3FORMS_ACCESS_KEY = "932c422d-8d3f-42d8-bbcc-7197f869c4de"; // Update this with your key

const App = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formStatus, setFormStatus] = useState(''); // '', 'sending', 'success', 'error'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const openSelection = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormStatus('');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `New Project Selection: ${selectedProject.title}`,
          from_name: "Project Showcase Website",
          project_name: selectedProject.title,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'N/A',
          message: formData.message,
          botcheck: "" // Honeypot
        })
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setFormStatus('error');
        console.error("Submission failed:", data);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus('error');
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar glass">
        <div className="container nav-content">
          <div className="logo">
            <img src={logo} alt="Akvora Logo" className="logo-image" />
            <span>Akvora</span>
          </div>
          <div className="nav-links">
            <a href="#projects">Browse Projects</a>
            <button className="btn btn-primary" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="container hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Choose the Perfect Project for Your Business
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready-to-use, professional software solutions designed to give your business an immediate edge.
            Select a project today and get started in minutes.
          </motion.p>
          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="#projects" className="btn btn-primary btn-lg">View Projects</a>
          </motion.div>
        </div>
        <div className="hero-bg-accent"></div>
      </header>

      {/* Projects Grid */}
      <section id="projects" className="projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Featured Projects</h2>
            <div className="divider"></div>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.div
                className="project-card glass"
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="card-image">
                  <img src={project.image} alt={project.title} />
                  <div className="card-badge">{project.techStack[0]}</div>
                </div>
                <div className="card-content">
                  <h3>{project.title}</h3>
                  <p className="description">{project.description}</p>

                  <div className="features-list">
                    <h4>Key Features:</h4>
                    <ul>
                      {project.features.map((feature, i) => (
                        <li key={i}><CheckCircle2 size={16} className="feature-icon" /> {feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="tech-tags">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>

                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => openSelection(project)}
                  >
                    Select This Project
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Selection Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>

              {formStatus === 'success' ? (
                <div className="success-message">
                  <div className="success-icon">
                    <CheckCircle2 size={64} />
                  </div>
                  <h3>Thank you!</h3>
                  <p>Your interest in <strong>{selectedProject?.title}</strong> has been sent successfully. We'll get back to you soon.</p>
                  <button className="btn btn-primary" onClick={closeModal}>Close</button>
                </div>
              ) : (
                <>
                  <h2>Enquire about {selectedProject?.title}</h2>
                  <p>Provide your details and we'll reach out to discuss the next steps.</p>

                  <form onSubmit={handleSubmit} className="selection-form">
                    {/* Honeypot field */}
                    <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

                    <div className="form-group">
                      <label>Selected Project</label>
                      <input type="text" value={selectedProject?.title || ''} readOnly className="read-only-input" />
                    </div>
                    <div className="form-group">
                      <label>Your Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="e.g. john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number (Optional)</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="e.g. +1 234 567 890"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Message / Requirements</label>
                      <textarea
                        name="message"
                        rows="4"
                        required
                        placeholder="Tell us about your specific needs..."
                        value={formData.message}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className={`btn btn-primary btn-full ${formStatus === 'sending' ? 'loading' : ''}`}
                      disabled={formStatus === 'sending'}
                    >
                      {formStatus === 'sending' ? 'Sending...' : 'Submit Selection'}
                      <Send size={18} style={{ marginLeft: '8px' }} />
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Footer */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-info">
            <div className="logo">
              <img src={logo} alt="Akvora Logo" className="logo-image" />
              <span>Akvora</span>
            </div>
            <p>Providing high-quality software solutions for modern businesses.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#projects">Projects</a>

          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>contactakvora@gmail.com</p>

          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Akvora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
