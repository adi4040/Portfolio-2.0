import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <div className="contact-box text-center">
          <h2 className="text-xl font-mono text-green-400 mb-4">
            What's Next?
          </h2>
          <h3 className="font-display text-3xl md:text-5xl font-bold mt-2 mb-6 contact-title">
            Get In Touch
          </h3>
          <p className="text-slate-300 mt-4 max-w-xl mx-auto mb-8 text-base md:text-lg leading-relaxed font-body">
            I'm currently seeking new opportunities and would love to hear
            from you. Whether you have a question or just want to connect,
            feel free to reach out!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="mailto:adityasuryawanshi4040@gmail.com"
              className="contact-button"
            >
              <i className="fas fa-envelope mr-2"></i>Say Hello
            </a>
            <a
              href="https://www.linkedin.com/in/aditya-suryawanshi-4783832b3"
              target="_blank"
              className="contact-button"
            >
              <i className="fab fa-linkedin mr-2"></i>Connect
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
