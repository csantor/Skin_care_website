# Design System: Skin AI Advisor

This document outlines the design system for the **Skin AI Advisor** project, extracted from its Stitch configuration.

## 1. Core Identity
- **Project Name:** Skin AI Advisor
- **Creative North Star:** "The Dewy Curator"
- **Visual Vibe:** High-end, editorial skincare experience. Mimics luxury skincare (heavy glass, translucency, clarity).

## 2. Typography
The system uses **Manrope** for authoritative and elegant editorial styling.

- **Main Font Family:** Manrope
- **Headline Font:** Manrope
- **Body Font:** Manrope
- **Label Font:** Manrope

### Typography Breakdown:
- **Display (lg/md/sm):** Used for "hero" moments—skin scores or brand statements.
- **Headline (lg/md/sm):** Primary storytelling tool for section titles.
- **Body (lg/md):** Set for softness and readability in ingredient explanations.
- **Labels (md/sm):** Reserved for technical data (pH levels, percentages).

## 3. Color Palette
Rooted in "On-Surface" clarity with teals, greens, and expansive whites.

| Token | Color | Hex Code |
| :--- | :--- | :--- |
| **Primary** | ![](https://via.placeholder.com/15/006a65?text=+) | `#006a65` |
| **Primary Container** | ![](https://via.placeholder.com/15/4ca8a1?text=+) | `#4ca8a1` |
| **Secondary** | ![](https://via.placeholder.com/15/41655f?text=+) | `#41655f` |
| **Tertiary** | ![](https://via.placeholder.com/15/566342?text=+) | `#566342` |
| **Background** | ![](https://via.placeholder.com/15/f8faf9?text=+) | `#f8faf9` |
| **Surface** | ![](https://via.placeholder.com/15/f8faf9?text=+) | `#f8faf9` |
| **Surface (Bright)** | ![](https://via.placeholder.com/15/f8faf9?text=+) | `#f8faf9` |
| **Surface (Dim)** | ![](https://via.placeholder.com/15/d8dad9?text=+) | `#d8dad9` |
| **Error** | ![](https://via.placeholder.com/15/ba1a1a?text=+) | `#ba1a1a` |

### Surface Hierarchy & Layering:
- **Base:** `surface` (#f8faf9)
- **Secondary Sections:** `surface-container-low` (#f2f4f3)
- **Actionable Containers:** `surface-container-lowest` (#ffffff)
- **Elevated Details:** `surface-container-highest` (#e1e3e2)

## 4. Design Guidelines (The "Dewy Curator" Rules)

### The "No-Line" Rule
Designers are prohibited from using 1px solid borders for sectioning. Structural definition must be achieved solely through background color shifts or tonal transitions.

### Glassmorphism & Gradients
- **Floating Elements:** Use 80% opacity with a 16px-24px backdrop blur.
- **Action Buttons:** Use a subtle linear gradient from **Primary** (#006a65) to **Primary Container** (#4ca8a1) at 135°.

### Elevation
Traditional shadows are avoided. Instead:
- Use **Tonal Layering** (placing a lighter card on a slightly darker surface).
- Use **Ambient Shadows** with extremely low opacity (6%) tinted with the `on-secondary-container` color.

## 5. Components & Interactions
- **Buttons:** Primary buttons use the 135° gradient and `9999px` (Full) roundedness.
- **Cards:** Use `xl` (0.75rem) roundedness for a soft feel.
- **Routine Tracker:** Overlapping circles with Glassmorphism to show progress.

---

*Extracted via Stitch MCP on 2026-04-09.*
