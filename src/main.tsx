import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config"; // inicialitza i18next abans de renderitzar
import { apuntaArribada } from "./lib/leads";
import { aplicaConsentimentDesat } from "./lib/galetes";
import { inject } from "@vercel/analytics";

// La primera pàgina de la visita i les UTM: van amb el contacte si en deixa un.
apuntaArribada();
// Google Analytics només si ja va dir que sí al bàner de galetes.
aplicaConsentimentDesat();
// Visites sense galetes ni dades personals (Vercel Web Analytics, 22-10): compta tothom, també qui
// rebutja el bàner, per pàgina i per UTM. No identifica ningú, i per això no demana consentiment.
inject();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
