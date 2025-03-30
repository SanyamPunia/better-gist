"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AlertCircle } from "lucide-react"

interface SecurityChallengeProps {
    onVerify: (verified: boolean) => void
}

export function SecurityChallenge({ onVerify }: SecurityChallengeProps) {
    const [num1, setNum1] = useState(0)
    const [num2, setNum2] = useState(0)
    const [answer, setAnswer] = useState("")
    const [error, setError] = useState("")
    const [honeypot, setHoneypot] = useState("")

    useEffect(() => {
        setNum1(Math.floor(Math.random() * 10) + 1)
        setNum2(Math.floor(Math.random() * 10) + 1)
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (honeypot) {
            onVerify(false)
            return
        }

        const expectedAnswer = num1 + num2

        if (Number.parseInt(answer) === expectedAnswer) {
            setError("")
            onVerify(true)
        } else {
            setError("Incorrect answer. Please try again.")
            onVerify(false)
        }
    }

    return (
        <div className="border-t border-zinc-800 p-4">
            <div className="text-center text-zinc-300 text-sm mb-3">Security Check</div>

            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="text"
                    name="website"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                />

                <div className="flex items-center justify-center mb-3">
                    <span className="text-zinc-300 text-sm mr-2">
                        What is {num1} + {num2}?
                    </span>
                    <input
                        type="text"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="bg-zinc-800 text-zinc-300 text-sm rounded px-2 py-1 w-16 focus:outline-none focus:ring-1 focus:ring-zinc-700"
                        placeholder="Answer"
                        required
                    />
                </div>

                {error && (
                    <div className="flex items-center text-red-500 text-xs mb-3">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded px-4 py-2 focus:outline-none"
                >
                    Verify
                </button>
            </form>
        </div>
    )
}

