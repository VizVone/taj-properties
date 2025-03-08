"use client";

import { useEffect, useState } from "react";

const GoogleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN"); // Default language

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: "en", includedLanguages: "en,hi,mr", autoDisplay: false },
        "google_translate_element"
      );

      // Automatically select English as default
      setTimeout(() => {
        const selectElement = document.querySelector(
          ".goog-te-combo"
        ) as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = "en";
          selectElement.dispatchEvent(new Event("change"));
          setSelectedLang("EN"); // Set default language in state
        }
      }, 1000);
    };

    addGoogleTranslateScript();
  }, []);

  // Function to change language and refresh page
  const changeLanguage = (lang: string, label: string) => {
    const selectElement = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;
    if (selectElement) {
      selectElement.value = lang;
      selectElement.dispatchEvent(new Event("change"));
    }
    setTimeout(() => {
      window.location.reload(); // Refresh page after language selection
    }, 800);
    setSelectedLang(label); // Update displayed language
    setIsOpen(false); // Close dropdown
  };

  return (
    <>
      {/* Floating Button with Current Language */}
      <div
        className="floating-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedLang}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="language-dropdown">
          <p onClick={() => changeLanguage("en", "EN")}>🇬🇧 English</p>
          <p onClick={() => changeLanguage("hi", "HI")}>🇮🇳 हिंदी (Hindi)</p>
          <p onClick={() => changeLanguage("mr", "MR")}>🇮🇳 मराठी (Marathi)</p>
        </div>
      )}

      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" className="translate-widget hidden"></div>
    </>
  );
};

export default GoogleTranslate;
