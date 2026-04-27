"use client";

import { useEffect } from "react";

export default function ChatbotWidget() {
    useEffect(() => {
        // Mencegah script dimuat ganda
        if (document.getElementById('redforge-widget-script')) return;

        const script = document.createElement("script");
        script.id = "redforge-widget-script";
        script.src = "https://red-forge.vercel.app/widget.js";
        script.setAttribute("data-bot-id", "4baee5b6-cb6d-4f82-938a-334eb40413b7");
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return null;
}
