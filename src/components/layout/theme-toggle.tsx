"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

import { Switch } from "../ui/switch"

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Switch
      className="drop-shadow"
      checked={theme === "dark"}
      onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
    />
  )
}
