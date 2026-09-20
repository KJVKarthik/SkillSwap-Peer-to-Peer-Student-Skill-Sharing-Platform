import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ================= CURSOR GLOW =================
  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "cursor-glow";
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cursor.remove();
    };
  }, []);

  // ================= SCROLL REVEAL =================
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const skills = [
    {
      icon: "💻",
      title: "Web Development",
      description: "Learn modern frontend and full-stack development.",
      people: "120+ mentors",
    },
    {
      icon: "🎨",
      title: "UI / UX Design",
      description: "Master beautiful interfaces and user experiences.",
      people: "85+ mentors",
    },
    {
      icon: "📊",
      title: "Data Analytics",
      description: "Turn data into insights using modern tools.",
      people: "96+ mentors",
    },
    {
      icon: "🎬",
      title: "Video Editing",
      description: "Learn cinematic editing and motion design.",
      people: "74+ mentors",
    },
    {
      icon: "📱",
      title: "App Development",
      description: "Build powerful mobile applications.",
      people: "68+ mentors",
    },
    {
      icon: "🎤",
      title: "Communication",
      description: "Improve confidence, speaking and presentation.",
      people: "110+ mentors",
    },
  ];

  const mentors = [
    {
      name: "Arjun Kumar",
      skill: "Full Stack Development",
      rating: "4.9",
      price: "₹499/hr",
      avatar: "AK",
    },
    {
      name: "Priya Sharma",
      skill: "UI / UX Design",
      rating: "4.8",
      price: "₹399/hr",
      avatar: "PS",
    },
    {
      name: "Rahul Verma",
      skill: "Data Analytics",
      rating: "4.9",
      price: "₹349/hr",
      avatar: "RV",
    },
    {
      name: "Ananya Rao",
      skill: "Video Editing",
      rating: "5.0",
      price: "₹449/hr",
      avatar: "AR",
    },
  ];

  const handleSearch = () => {
    if (!search.trim()) {
      setShowSearch(false);
      return;
    }

    setShowSearch(true);
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="logo-container">
          <div className="logo-icon">↻</div>
          <span className="logo-text">
            Skill<span>Swap</span>
          </span>
        </div>

        <nav className={`nav-links ${mobileOpen ? "active" : ""}`}>
          <a href="#skills" onClick={() => setMobileOpen(false)}>
            Explore Skills
          </a>

          <a href="#mentors" onClick={() => setMobileOpen(false)}>
            Mentors
          </a>

          <a href="#how" onClick={() => setMobileOpen(false)}>
            How It Works
          </a>

          <a href="#mission" onClick={() => setMobileOpen(false)}>
            Our Mission
          </a>
        </nav>

        <div className="nav-actions">
          <button className="login-btn">Log in</button>

          <button className="primary-btn">
            Get Started
            <span>→</span>
          </button>
        </div>

        <button
          className="mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          ☰
        </button>
      </header>


      {/* ================= HERO ================= */}

      <main>

        <section className="hero">

          <div className="hero-content reveal">

            <div className="badge">
              <span className="badge-dot"></span>
              LEARN • SHARE • GROW
            </div>

            <h1>
              Learn from people.
              <br />
              <span>Share what you know.</span>
            </h1>

            <p className="hero-description">
              SkillSwap connects students with peers who can teach,
              mentor and inspire them to grow together.
            </p>

            <div className="hero-search">

              <div className="search-icon">
                ⌕
              </div>

              <input
                type="text"
                placeholder="What do you want to learn?"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />

              <button onClick={handleSearch}>
                Find a Skill
                <span>→</span>
              </button>

            </div>

            {showSearch && (
              <div className="search-result">
                Searching for{" "}
                <strong>"{search}"</strong>
                <span>✨</span>
              </div>
            )}

            <div className="hero-stats">

              <div>
                <strong>2,500+</strong>
                <span>Students</span>
              </div>

              <div>
                <strong>800+</strong>
                <span>Skills</span>
              </div>

              <div>
                <strong>450+</strong>
                <span>Mentors</span>
              </div>

            </div>

          </div>

          {/* HERO VISUAL */}

          <div className="hero-visual reveal">

            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>

            <div className="floating-card floating-one">
              <div className="mini-avatar">AK</div>
              <div>
                <strong>Arjun</strong>
                <span>Web Developer</span>
              </div>
              <div className="online"></div>
            </div>

            <div className="floating-card floating-two">
              <span className="floating-icon">⚡</span>
              <div>
                <strong>Skill matched!</strong>
                <span>UI / UX Design</span>
              </div>
            </div>

            <div className="hero-orbit">

              <div className="orbit orbit-one"></div>
              <div className="orbit orbit-two"></div>

              <div className="center-logo">
                <span>↗</span>
              </div>

              <div className="orbit-user user-one">
                🎨
              </div>

              <div className="orbit-user user-two">
                💻
              </div>

              <div className="orbit-user user-three">
                📊
              </div>

            </div>

          </div>

        </section>


        {/* ================= SKILLS ================= */}

        <section id="skills" className="section skills-section">

          <div className="section-heading reveal">

            <div className="eyebrow">
              EXPLORE
            </div>

            <h2>
              Find your next
              <span> skill.</span>
            </h2>

            <p>
              Discover skills taught by students who are already
              good at what you want to learn.
            </p>

          </div>

          <div className="skills-grid">

            {skills.map((skill, index) => (

              <article
                className="skill-card reveal"
                key={skill.title}
                style={{ transitionDelay: `${index * 70}ms` }}
              >

                <div className="skill-icon">
                  {skill.icon}
                </div>

                <div className="skill-card-content">

                  <h3>{skill.title}</h3>

                  <p>{skill.description}</p>

                  <div className="skill-bottom">

                    <span>{skill.people}</span>

                    <button>
                      Explore →
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>


        {/* ================= MENTORS ================= */}

        <section id="mentors" className="section mentors-section">

          <div className="section-heading reveal">

            <div className="eyebrow">
              MEET THE COMMUNITY
            </div>

            <h2>
              Learn from
              <span> people like you.</span>
            </h2>

            <p>
              Find students who know the skills you want to learn
              and book a session with them.
            </p>

          </div>

          <div className="mentor-grid">

            {mentors.map((mentor, index) => (

              <article
                className="mentor-card reveal"
                key={mentor.name}
                style={{ transitionDelay: `${index * 80}ms` }}
              >

                <div className="mentor-top">

                  <div className="mentor-avatar">
                    {mentor.avatar}
                  </div>

                  <div className="mentor-status">
                    ● Available
                  </div>

                </div>

                <h3>{mentor.name}</h3>

                <p className="mentor-skill">
                  {mentor.skill}
                </p>

                <div className="mentor-rating">
                  ⭐ {mentor.rating}
                </div>

                <div className="mentor-bottom">

                  <strong>{mentor.price}</strong>

                  <button>
                    View Profile →
                  </button>

                </div>

              </article>

            ))}

          </div>

        </section>


        {/* ================= HOW IT WORKS ================= */}

        <section id="how" className="section process-section">

          <div className="section-heading reveal">

            <div className="eyebrow">
              SIMPLE PROCESS
            </div>

            <h2>
              Learn in
              <span> three steps.</span>
            </h2>

            <p>
              No complicated setup. Find the right person,
              book a session, and start learning.
            </p>

          </div>


          <div className="steps">

            {/* STEP 1 */}

            <div className="step reveal">

              <span className="step-number">
                01
              </span>

              <div className="process-icon search-animation">

                <svg viewBox="0 0 64 64">
                  <circle
                    cx="27"
                    cy="27"
                    r="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                  />

                  <line
                    x1="38"
                    y1="38"
                    x2="51"
                    y2="51"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                </svg>

              </div>

              <h3>Find a Skill</h3>

              <p>
                Search for the skill you want to learn
                and discover the right mentor.
              </p>

            </div>


            {/* STEP 2 */}

            <div className="step reveal">

              <span className="step-number">
                02
              </span>

              <div className="process-icon calendar-animation">

                <svg viewBox="0 0 64 64">

                  <rect
                    x="13"
                    y="17"
                    width="38"
                    height="34"
                    rx="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <line
                    x1="13"
                    y1="27"
                    x2="51"
                    y2="27"
                    stroke="currentColor"
                    strokeWidth="4"
                  />

                  <line
                    x1="23"
                    y1="11"
                    x2="23"
                    y2="21"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <line
                    x1="41"
                    y1="11"
                    x2="41"
                    y2="21"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <path
                    d="M23 38 L29 44 L41 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

              </div>

              <h3>Book a Session</h3>

              <p>
                Choose a time that works for you and
                book a personalized learning session.
              </p>

            </div>


            {/* STEP 3 */}

            <div className="step reveal">

              <span className="step-number">
                03
              </span>

              <div className="process-icon graph-animation">

                <svg viewBox="0 0 64 64">

                  <line
                    x1="12"
                    y1="51"
                    x2="52"
                    y2="51"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />

                  <polyline
                    points="14,43 25,32 34,37 49,18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <polyline
                    points="40,18 49,18 49,27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                </svg>

              </div>

              <h3>Grow Together</h3>

              <p>
                Learn, practice, exchange knowledge and
                keep growing with your mentor.
              </p>

            </div>

          </div>

        </section>


        {/* ================= MISSION ================= */}

        <section id="mission" className="mission-section">

          <div className="mission-card reveal">

            <div className="mission-content">

              <div className="eyebrow">
                OUR MISSION
              </div>

              <h2>
                Everyone has something
                <br />
                <span>worth teaching.</span>
              </h2>

              <p>
                SkillSwap turns students into both learners
                and teachers. Share what you know, discover
                new skills and build meaningful connections.
              </p>

              <button className="primary-btn mission-btn">
                Join SkillSwap
                <span>→</span>
              </button>

            </div>

            <div className="mission-visual">

              <div className="mission-circle circle-one">
                💡
              </div>

              <div className="mission-circle circle-two">
                🚀
              </div>

              <div className="mission-circle circle-three">
                🎓
              </div>

              <div className="mission-center">
                ↗
              </div>

            </div>

          </div>

        </section>


        {/* ================= FOOTER ================= */}

        <footer>

          <div className="footer-logo">
            <div className="logo-icon">↻</div>
            Skill<span>Swap</span>
          </div>

          <p>
            Learn. Share. Grow together.
          </p>

          <span className="copyright">
            © 2026 SkillSwap
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;