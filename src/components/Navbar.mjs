/**
 * Navbar — Animated navigation bar with blob hover effect and view transitions.
 *
 * A standalone React component that provides:
 *   - Animated hover blob that follows the cursor across nav links
 *   - Active route highlighting with teal accent
 *   - Favicon logo with spin-on-click animation
 *   - View Transitions API integration for smooth page navigation
 *   - Spring physics for blob movement (stiffness: 360, damping: 50)
 *
 * Dependencies: React, react-dom, react-router-dom, framer-motion.
 *
 * Usage:
 *   import Navbar from "./components/Navbar.mjs";
 *   <Navbar />
 */
import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { flushSync } from "react-dom";

// ── Customize these ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Neoflix", to: "/neoflix" },
  { label: "Publications", to: "/publications" },
  { label: "Contact", to: "/neoflix#collab" },
  { label: "Toolbox", to: "/toolbox" },
];
const LOGO_SRC = "/favicon.svg";
// ────────────────────────────────────────────────────────────────

const NAV_CELL_HEIGHT = 28;

function useViewTransition() {
  const navigate = useNavigate();
  return (to, opts) => {
    if (!document.startViewTransition) {
      navigate(to, opts);
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => navigate(to, opts));
    });
  };
}

function FaviconLogo({ onClick }) {
  const [spinKey, setSpinKey] = useState(0);
  return (
    <motion.div
      className="cursor-pointer"
      onClick={() => {
        setSpinKey((k) => k + 1);
        onClick?.();
      }}
      whileHover={{ scale: 1.15, rotate: 8 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.img
        key={spinKey}
        src={LOGO_SRC}
        alt="Home"
        width="32"
        height="32"
        initial={spinKey > 0 ? { rotate: 0 } : false}
        animate={spinKey > 0 ? { rotate: 360 } : {}}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />
      <span className="sr-only">Home</span>
    </motion.div>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const transitionNavigate = useViewTransition();

  const handleNavClick = (e, to) => {
    e.preventDefault();
    const targetPath = to.split("#")[0] || "/";
    if (targetPath === location.pathname) {
      navigate(to);
    } else {
      transitionNavigate(to);
    }
  };

  const navRef = useRef(null);
  const blobContainerRef = useRef(null);
  const linkRefs = useRef([]);
  const [blob, setBlob] = useState(null);
  const [blobOpacity, setBlobOpacity] = useState(0.5);
  const [hoverTimer, setHoverTimer] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [traveling, setTraveling] = useState(false);
  const settleTimeout = useRef(null);
  const prevIdx = useRef(null);
  const height = useMotionValue(0);
  const prevBlob = useRef({ left: null, width: null });

  const isActive = (to) => {
    if (to === "/neoflix")
      return location.pathname === "/neoflix" && location.hash !== "#collab";
    if (to === "/neoflix#collab")
      return location.pathname === "/neoflix" && location.hash === "#collab";
    return location.pathname === to;
  };

  const handleMouseEnter = (idx) => {
    const el = linkRefs.current[idx];
    if (el && blobContainerRef.current) {
      const containerRect = blobContainerRef.current.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setBlob({
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height,
      });
      setHoveredIdx(idx);
      setBlobOpacity(1.0);
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
      settleTimeout.current = setTimeout(() => {}, 80);
      if (hoverTimer) clearInterval(hoverTimer);
    }
  };

  const handleMouseLeave = () => {
    setBlob(null);
    setBlobOpacity(0.5);
    setHoveredIdx(null);
    if (hoverTimer) clearInterval(hoverTimer);
    if (settleTimeout.current) clearTimeout(settleTimeout.current);
  };

  useEffect(
    () => () => {
      if (hoverTimer) clearInterval(hoverTimer);
      if (settleTimeout.current) clearTimeout(settleTimeout.current);
    },
    [hoverTimer]
  );

  // Traveling blob shrink/expand
  useEffect(() => {
    if (
      hoveredIdx !== null &&
      prevIdx.current !== null &&
      hoveredIdx !== prevIdx.current
    ) {
      setTraveling(true);
      setTimeout(() => {
        setTimeout(() => setTraveling(false), 90);
      }, 1);
    }
    prevIdx.current = hoveredIdx;
  }, [hoveredIdx]);

  useEffect(() => {
    if (!blob) return;
    if (
      prevBlob.current.left !== null &&
      (prevBlob.current.left !== blob.left ||
        prevBlob.current.width !== blob.width)
    ) {
      animate(height, [blob.height, 0, blob.height], {
        times: [0, 0.5, 1],
        duration: 0.18,
        ease: [0.42, 0, 0.58, 1],
      });
    } else {
      height.set(blob.height);
    }
    prevBlob.current = { left: blob.left, width: blob.width };
  }, [blob?.left, blob?.width, blob?.height]);

  // Expose nav height as CSS variable
  useEffect(() => {
    const updateVar = () => {
      const h = navRef.current?.getBoundingClientRect()?.height || 60;
      document.documentElement.style.setProperty(
        "--nav-h",
        `${Math.round(h)}px`
      );
    };
    updateVar();
    window.addEventListener("resize", updateVar);
    return () => window.removeEventListener("resize", updateVar);
  }, []);

  // Align blob with active route on mount / route change
  useEffect(() => {
    const activeIdx = NAV_LINKS.findIndex((link) => isActive(link.to));
    if (activeIdx === -1) {
      setBlob(null);
      return;
    }
    const el = linkRefs.current[activeIdx];
    const container = blobContainerRef.current;
    if (el && container) {
      const containerRect = container.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      setBlob({
        left: rect.left - containerRect.left,
        width: rect.width,
        height: rect.height,
      });
      setBlobOpacity(0.5);
      setHoveredIdx(null);
    }
  }, [location.pathname, location.hash]);

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-40 bg-white border-b border-[#e7dfd7] flex items-center justify-between shadow-[0_2px_2px_0_rgba(0,0,0,0.08)]"
      style={{ height: 60 }}
    >
      <div className="flex items-center h-full pl-6 pr-4">
        <FaviconLogo
          onClick={() => {
            if (location.pathname === "/")
              window.scrollTo({ top: 0, behavior: "smooth" });
            else transitionNavigate("/");
          }}
        />
      </div>

      <div
        className="flex flex-1 justify-end items-center h-full"
        style={{ paddingRight: 64 }}
      >
        <div
          ref={blobContainerRef}
          className="relative flex items-center"
          onMouseLeave={handleMouseLeave}
          style={{ height: 60, gap: "3.75rem" }}
        >
          {/* Animated hover blob */}
          <AnimatePresence>
            {blob && (
              <motion.div
                key="blob"
                initial={{
                  opacity: 0,
                  x: blob.left,
                  width: blob.width,
                  height: NAV_CELL_HEIGHT,
                }}
                animate={{
                  opacity: blobOpacity,
                  x: blob.left,
                  width: blob.width,
                  height: traveling
                    ? NAV_CELL_HEIGHT * 0.75
                    : NAV_CELL_HEIGHT,
                  transition: {
                    opacity: { duration: 0.18 },
                    x: {
                      type: "spring",
                      stiffness: 360,
                      damping: 50,
                      mass: 1.2,
                      velocity: 6,
                    },
                    width: {
                      type: "spring",
                      stiffness: 360,
                      damping: 50,
                      mass: 1.2,
                      velocity: 6,
                    },
                    height: {
                      duration: 0.18,
                      ease: [0.42, 0, 0.58, 1],
                    },
                  },
                }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
                className="absolute flex items-center"
                style={{
                  left: 0,
                  borderRadius: "9999px",
                  background: "#d1d5db",
                  zIndex: 1,
                  pointerEvents: "none",
                  margin: "auto 0",
                  willChange: "transform, width, opacity",
                }}
              />
            )}
          </AnimatePresence>

          {/* Link items */}
          {NAV_LINKS.map((link, idx) => {
            const active = isActive(link.to);
            const isToolbox = link.label === "Toolbox";
            return (
              <div
                key={link.to}
                ref={(el) => (linkRefs.current[idx] = el)}
                className="relative flex items-center justify-center"
                onMouseEnter={() => handleMouseEnter(idx)}
                onFocus={() => handleMouseEnter(idx)}
                tabIndex={-1}
                style={{
                  minHeight: NAV_CELL_HEIGHT,
                  height: NAV_CELL_HEIGHT,
                  zIndex: 2,
                }}
              >
                {active && (
                  <span
                    className="absolute inset-0 z-20 rounded-full bg-[#4fa6a6]"
                    style={{
                      boxShadow: "0 2px 8px 0 rgba(79,166,166,0.10)",
                      pointerEvents: "none",
                      height: NAV_CELL_HEIGHT,
                    }}
                  />
                )}
                <a
                  href={link.to}
                  onClick={(e) => handleNavClick(e, link.to)}
                  className={`relative z-30 flex items-center justify-center rounded-full transition-colors duration-150 transform-gpu
                    hover:scale-105 focus:scale-105 transition-transform duration-240
                    ${active ? "text-white font-bold" : isToolbox ? "text-white font-semibold" : "text-[#232324] font-semibold"}
                    ${isToolbox && !active ? "bg-[#232324]" : ""}`}
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    fontSize: 18,
                    padding: "8px 24px",
                    height: NAV_CELL_HEIGHT,
                    lineHeight: NAV_CELL_HEIGHT + "px",
                    userSelect: "none",
                  }}
                >
                  {link.label}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
