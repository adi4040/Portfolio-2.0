const Certifications = () => {
  const certifications = [
    {
      icon: " ",
      title: "Machine Learning- Linear Regression",
      provider: "Nasscom"
    },
    {
      icon: " ",
      title: "CCNAv7-Introduction to Networks",
      provider: "Cisco"
    },
    {
      icon: " ",
      title: "SQL Training",
      provider: "Data Flair"
    }
    // {
    //   icon: " ",
    //   title: "Azure Developer",
    //   provider: "Microsoft"
    // }
  ];

  return (
    <section id="certifications" className="section-content py-20 animate-on-scroll slide-up">
      <div className="container mx-auto px-6">
        <h2 className="section-title text-3xl font-bold mb-12 font-display">
          Certifications
        </h2>
        <div className="certifications-grid">
          {certifications.map((cert, index) => (
            <div key={index} className="cert-card glassmorphism-card">
              <div className="cert-header">
                <i className={cert.icon}></i>
                <div>
                  <h3 className="font-bold text-slate-200">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-slate-400">{cert.provider}</p>
                </div>
              </div>
              {/* <div className="cert-badge">Verified</div> */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
