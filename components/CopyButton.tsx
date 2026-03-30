"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function CopyButton({ textToCopy, label = "Salin Rekening" }: { textToCopy: string, label?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Gagal menyalin", err);
            // Fallback for older browsers
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Button 
            variant="secondary" 
            onClick={handleCopy}
            type="button"
            className={`text-sm whitespace-nowrap transition-colors ${copied ? 'bg-green-600 border-green-600 text-white shadow-md shadow-green-200' : 'border-gray-300 bg-white text-gray-700 hover:text-black hover:border-black shadow-sm'}`}
        >
            {copied ? "Tersalin! ✓" : label}
        </Button>
    );
}
