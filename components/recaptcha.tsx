"use client"

import { useEffect, useRef } from "react"
import Script from "next/script"

interface ReCaptchaProps {
    siteKey: string
    onChange: (token: string) => void
}

declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void
            execute: (siteKey: string, options: { action: string }) => Promise<string>
            render: (container: string | HTMLElement, options: any) => number
        }
        onRecaptchaLoad: () => void
    }
}

export function ReCaptcha({ siteKey, onChange }: ReCaptchaProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const widgetIdRef = useRef<number | null>(null)

    useEffect(() => {
        // Define the callback function for when reCAPTCHA is loaded
        window.onRecaptchaLoad = () => {
            if (containerRef.current) {
                widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
                    sitekey: siteKey,
                    callback: onChange,
                    theme: "dark",
                    size: "normal",
                })
            }
        }

        // Clean up
        // return () => {
        //   delete window.onRecaptchaLoad
        // }
    }, [siteKey, onChange])

    return (
        <>
            <Script
                src={`https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`}
                strategy="lazyOnload"
            />
            <div ref={containerRef} className="flex justify-center my-4"></div>
        </>
    )
}

