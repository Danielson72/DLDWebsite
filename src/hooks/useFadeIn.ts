import { useEffect, useRef } from 'react'

export function useFadeIn(delay = 0) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduced) return

    el.style.opacity = '0'
    el.style.transform = 'translateY(24px)'
    el.style.transition =
      `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return ref
}