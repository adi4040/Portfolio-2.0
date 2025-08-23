import React from 'react';

const Volunteering = () => {
  const volunteerActivities = [
    {
      icon: "fas fa-chalkboard-teacher",
      title: "Hackathon Volunteer",
      organization: "Nirman 2.0, TPO-I2IC, VIIT",
      description: "Co-ordinated with the commitee members to make Nirman 2.0 a huge success"
    },
    {
      icon: "fas fa-users",
      title: "Project Presentation",
      organization: "Innovex, AIT",
      description: "Participated at Innovex Project Presentation Competition held at AIT, Pune"
    },
    {
      icon: "fas fa-users",
      title: "Project Presentation",
      organization: "Innovation, MKSSS'S CUMMINS",
      description: "Participated at Innovation Project Presentation Competition held at MKSSS'S CUMMINS, Pune"
    }
  ];

  return (
    <section id="volunteering" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Volunteering & Participations
        </h2>
        <div className="volunteer-grid">
          {volunteerActivities.map((activity, index) => (
            <div key={index} className="volunteer-card glassmorphism-card p-6">
              <i className={`${activity.icon} text-green-400 text-3xl mb-4`}></i>
              <h3 className="text-xl font-bold text-slate-200">
                {activity.title}
              </h3>
              <p className="text-slate-400 text-sm mb-2">{activity.organization}</p>
              <p className="text-slate-300">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Volunteering;
