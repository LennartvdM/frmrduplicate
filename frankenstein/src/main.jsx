import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { startAnalytics } from "./analytics";

const container = document.getElementById("root");

// scripts/prerender.mjs bakes a static copy of the page into #root so crawlers
// and slow connections get real content before the bundle lands. createRoot()
// would discard it on first render anyway; clearing it explicitly keeps that
// contract obvious rather than incidental.
if (container.firstChild) container.replaceChildren();

createRoot(container).render(<App />);

startAnalytics();
