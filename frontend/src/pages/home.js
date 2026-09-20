import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaBook,
  FaFileAlt,
  FaCode,
  FaRobot,
} from "react-icons/fa";
import Scene3D from "../components/Scene3D";

function AnimatedBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    let animationFrameId;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connecting lines
      particles.forEach((p, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (dist < 100) {
            ctx.beginPath();

            ctx.strokeStyle = `rgba(52, 78, 65, ${
              0.1 * (1 - dist / 100)
            })`;

            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      // Draw particles
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(163, 177, 138, ${p.opacity})`;

        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) {
          p.dx *= -1;
        }

        if (p.y < 0 || p.y > canvas.height) {
          p.dy *= -1;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 0.1,
        pointerEvents: "none",
      }}
    />
  );
}

const features = [
  {
    icon: <FaChartBar size={28} />,
    title: "Algorithm Visualizer",
    desc: "Watch algorithms execute in real-time with stunning animations",
    path: "/visualizer",
    gradient: "#3A5A40",
  },
  {
    icon: <FaBook size={28} />,
    title: "Study Notes",
    desc: "Crisp, exam-ready notes for every ADA topic",
    path: "/notes",
    gradient: "#3A5A40",
  },
  {
    icon: <FaFileAlt size={28} />,
    title: "Previous Year Questions",
    desc: "Practice with real RGPV exam questions & solutions",
    path: "/pyq",
    gradient: "#3A5A40",
  },
  {
    icon: <FaCode size={28} />,
    title: "Algorithms",
    desc: "Deep-dive into every algorithm with code & complexity",
    path: "/algorithms",
    gradient: "#3A5A40",
  },
  {
    icon: <FaRobot size={28} />,
    title: "AI Assistant",
    desc: "Your 24/7 doubt-solving AI companion for ADA",
    path: "/ai-assistant",
    gradient: "#3A5A40",
  },
];

const stats = [
  { value: "50+", label: "Algorithms" },
  { value: "200+", label: "PYQs" },
  { value: "10+", label: "Topics" },
  { value: "24/7", label: "AI Support" },
];

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <AnimatedBG />

      {/* HERO */}
      <div style={styles.heroSection}>

        {/* Left side */}
        <div style={styles.heroLeft}>

          <div style={styles.badge}>
            🎓 Built exclusively for RGPV Students
          </div>

          <h1 style={styles.title}>
            Master
            <br />
            <span style={styles.highlight}>ADA</span> Like a
            <br />
            <span style={styles.titleWhite}>Pro.</span>
          </h1>

          <p style={styles.subtitle}>
            Visualize algorithms in 3D, crack PYQs, study smart notes, and get
            instant AI doubt resolution.
          </p>

          {/* Stats */}
          <div style={styles.statsRow}>
            {stats.map((s, i) => (
              <div key={i} style={styles.statBox}>
                <div style={styles.statValue}>{s.value}</div>
                <div style={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={styles.btnGroup}>

            <button
              type="button"
              style={styles.primaryBtn}
              onClick={() => navigate("/algorithms")}
            >
              🚀 Start Learning
            </button>

            {/* IMPORTANT:
                Use Link for Visualizer so React Router handles the
                navigation directly.
            */}
            <Link
              to="/visualizer"
              style={styles.secondaryBtn}
            >
              ▶ Live Visualizer
            </Link>

          </div>
        </div>

        {/* Right side 3D */}
        <div style={styles.heroRight}>
          <Scene3D />

          <div style={styles.dragHint}>
            🖱️ Drag to interact
          </div>
        </div>

      </div>

      {/* Divider */}
      <div style={styles.divider} />

      {/* FEATURES */}
      <div style={styles.sectionTitle}>

        <div style={styles.sectionBadge}>
          ✦ Features
        </div>

        <h2 style={styles.sectionH2}>
          Everything to <span style={styles.highlight}>Ace ADA</span>
        </h2>

        <p style={styles.sectionSub}>
          One platform. All resources. Zero confusion.
        </p>

      </div>

      {/* Feature Cards */}
      <div style={styles.cardGrid}>

        {features.map((f, i) => (
          <div
            key={i}
            style={{
              ...styles.card,
              background: f.gradient,
            }}

            onClick={() => {
              /*
                Explicitly handle the Visualizer route.
                This prevents the Visualizer card from depending
                on any accidental/incorrect path value.
              */
              if (f.path === "/visualizer") {
                navigate("/visualizer");
              } else {
                navigate(f.path);
              }
            }}

            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();

                if (f.path === "/visualizer") {
                  navigate("/visualizer");
                } else {
                  navigate(f.path);
                }
              }
            }}

            role="button"
            tabIndex={0}

            onMouseEnter={(e) => {
              e.currentTarget.style.transform =
                "translateY(-10px) scale(1.03)";

              e.currentTarget.style.boxShadow =
                "0 20px 60px rgba(24, 57, 43, 0.25)";
            }}

            onMouseLeave={(e) => {
              e.currentTarget.style.transform =
                "translateY(0) scale(1)";

              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(24, 57, 43, 0.18)";
            }}
          >

            <div style={styles.cardIconWrap}>
              {f.icon}
            </div>

            <h3 style={styles.cardTitle}>
              {f.title}
            </h3>

            <p style={styles.cardDesc}>
              {f.desc}
            </p>

            <div style={styles.cardArrow}>
              →
            </div>

          </div>
        ))}

      </div>

      {/* Footer CTA */}
      <div style={styles.footerCTA}>

        <h2 style={styles.ctaTitle}>
          Ready to <span style={styles.highlight}>dominate ADA?</span>
        </h2>

        <p style={styles.ctaSubtitle}>
          Join hundreds of RGPV students already learning smarter.
        </p>

        <button
          type="button"
          style={styles.primaryBtn}
          onClick={() => navigate("/algorithms")}
        >
          Get Started Free 🎯
        </button>

      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#E9E5D8",

    backgroundImage:
      "radial-gradient(ellipse 55% 35% at 8% 30%, rgba(163,177,138,0.28) 0%, rgba(163,177,138,0.10) 48%, transparent 72%), radial-gradient(ellipse 48% 34% at 92% 22%, rgba(163,177,138,0.26) 0%, rgba(163,177,138,0.10) 45%, transparent 70%), radial-gradient(ellipse 50% 30% at 48% 95%, rgba(163,177,138,0.16) 0%, transparent 70%)",

    minHeight: "100vh",
    position: "relative",
  },

  heroSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "70px 80px 60px",
    minHeight: "610px",
    position: "relative",
    zIndex: 1,
    gap: "40px",
  },

  heroLeft: {
    flex: 1,
    maxWidth: "620px",
  },

  heroRight: {
    flex: 1,
    maxWidth: "620px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  dragHint: {
    textAlign: "center",
    color: "#344E41",
    fontSize: "13px",
    marginTop: "-20px",
    letterSpacing: "1px",
  },

  badge: {
    display: "inline-block",
    background: "rgba(163, 177, 138, 0.25)",
    border: "1px solid rgba(52, 78, 65, 0.3)",
    color: "#000000",
    padding: "7px 18px",
    borderRadius: "20px",
    fontSize: "13px",
    marginBottom: "28px",
  },

  title: {
    color: "#000000",
    fontSize: "4rem",
    fontWeight: "900",
    lineHeight: "1.05",
    marginBottom: "20px",
  },

  titleWhite: {
    color: "#000000",
  },

  highlight: {
    color: "#344E41",
    textShadow: "none",
  },

  subtitle: {
    color: "#000000",
    fontSize: "1.1rem",
    lineHeight: "1.8",
    marginBottom: "32px",
    maxWidth: "440px",
  },

  statsRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "28px",
    marginBottom: "36px",
    flexWrap: "wrap",

    background: "rgba(255, 255, 255, 0.55)",

    border: "1px solid rgba(52, 78, 65, 0.12)",

    borderRadius: "24px",

    padding: "22px 28px",

    boxShadow:
      "0 10px 30px rgba(52, 78, 65, 0.08)",
  },

  statBox: {
    textAlign: "left",
    flex: 1,
  },

  statValue: {
    fontSize: "2rem",
    fontWeight: "800",
    color: "#344E41",
    textShadow: "none",
  },

  statLabel: {
    color: "#000000",
    fontSize: "0.8rem",
    marginTop: "2px",
  },

  btnGroup: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    alignItems: "center",
  },

  primaryBtn: {
    padding: "13px 32px",
    fontSize: "0.95rem",
    fontWeight: "700",
    background: "#18392B",
    color: "#DAD7CD",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    boxShadow:
      "0 8px 25px rgba(24, 57, 43, 0.25)",
    transition: "all 0.3s",
  },

  /*
    This style is now also used by the <Link>
    for Live Visualizer.
  */
  secondaryBtn: {
    padding: "13px 32px",
    fontSize: "0.95rem",
    fontWeight: "600",
    background: "transparent",
    color: "#000000",
    border: "1px solid #344E41",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "all 0.3s",

    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  divider: {
    height: "1px",

    background:
      "linear-gradient(90deg, transparent, #A3B18A, transparent)",

    margin: "0 80px",

    position: "relative",
    zIndex: 1,
  },

  sectionTitle: {
    textAlign: "center",
    padding: "70px 20px 40px",
    position: "relative",
    zIndex: 1,
  },

  sectionBadge: {
    color: "#344E41",
    fontSize: "13px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    marginBottom: "12px",
  },

  sectionH2: {
    color: "#000000",
    fontSize: "2.4rem",
    fontWeight: "800",
    marginBottom: "12px",
  },

  sectionSub: {
    color: "#000000",
    fontSize: "1rem",
  },

  cardGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "24px",
    padding: "0 80px 80px",
    position: "relative",
    zIndex: 1,
  },

  card: {
    borderRadius: "18px",
    padding: "30px 26px",
    width: "230px",

    cursor: "pointer",

    transition:
      "transform 0.3s ease, box-shadow 0.3s ease",

    border:
      "1px solid rgba(24, 57, 43, 0.18)",

    boxShadow:
      "0 10px 30px rgba(24, 57, 43, 0.16)",
  },

  cardIconWrap: {
    color: "#173A29",
    marginBottom: "16px",
    background: "#DAD7CD",
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: "1rem",
    fontWeight: "700",
    marginBottom: "10px",
  },

  cardDesc: {
    color: "rgba(255,255,255,0.78)",
    fontSize: "0.85rem",
    lineHeight: "1.6",
  },

  cardArrow: {
    color: "#DAD7CD",
    fontSize: "1.3rem",
    marginTop: "16px",
    fontWeight: "700",
  },

  footerCTA: {
    textAlign: "center",

    padding: "80px 20px 100px",

    background:
      "linear-gradient(180deg, transparent, rgba(163, 177, 138, 0.22))",

    position: "relative",
    zIndex: 1,
  },

  ctaTitle: {
    color: "#000000",
    fontSize: "2.2rem",
    marginBottom: "12px",
    fontWeight: "800",
  },

  ctaSubtitle: {
    color: "#000000",
    marginBottom: "28px",
    fontSize: "1rem",
  },
};

export default Home;