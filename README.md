<div align="center">

# Palette AI

**Extract production-ready color systems from any image with intelligence.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

##  Demo

![App Screenshot](./public/demo-1.png)
![App Screenshot](./public/demo-2.png)


> **Visual proof matters more than text.**

- **Live App:** [palette-ai.lovable.app](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
-  **Demo Video:** [Watch on YouTube](https://youtube.com/...)

---

##  The Problem

Designing a cohesive UI color system is difficult and time-consuming:
-  **Inconsistent Extraction**: Manually picking colors from brand assets often misses the true dominant tones.
-  **Accessibility Gaps**: Most palettes don't account for WCAG contrast standards until it's too late.
-  **Role Ambiguity**: Deciding which color should be "primary," "accent," or "background" involves repetitive guesswork.

---

##  The Solution

**Palette AI** automates the bridge between visual inspiration and production code. By analyzing any image, it instantly generates:

-  **Quantized Swatches**: Dominant colors extracted using the Median Cut algorithm.
-  **Functional Role Assignment**: Intelligently mapped roles (Primary, Secondary, Accent, etc.).
-  **Accessibility Dashboard**: Real-time contrast ratio validation and WCAG compliance flags.
-  **Theme Generators**: Ready-to-copy Tailwind CSS configs and CSS variables.

---

##  Features

- **Smart Color Extraction**: Advanced Median Cut quantization identifying dominant tones.
- **Intelligent Role Mapping**: Automatic assignment of UI roles based on luminance & saturation.
- **Accessibility Checks**: WCAG 2.1 contrast analysis for body text and interactive elements.
- **Mood Profile**: Automatic "mood" detection based on HSL distribution.
- **Production-Ready Hooks**: Export as Tailwind config, CSS variables, or JSX/HTML snippets.
- **100% Client-Side**: Your images are processed entirely in the browser for maximum privacy.

---

##  Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)

### Core
- **Engine**: [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) for image processing
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

##  Quick Start

Get the project running locally in under 60 seconds:

1. **Clone the repository**
   ```bash
   git clone https://github.com/biswajit-sarkar-007/palette-ai.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

---

##  Project Structure

```text
src/
 ├─ components/
 │   ├─ ui/                  # shadcn/ui shared components
 │   ├─ ImageUploadZone.tsx  # Canvas-based image processing zone
 │   ├─ SwatchGrid.tsx      # Palette visualization grid
 │   ├─ MoodBadge.tsx       # AI-driven mood interpretation
 │   └─ ...                 # Accessibility checks and Export tabs
 ├─ lib/
 │   ├─ colorExtractor.ts    # The Core Engine (Quantization & Logic)
 │   └─ utils.ts            # General purpose utility functions
 ├─ hooks/
 │   └─ use-toast.ts        # Global notification system
 ├─ pages/
 │   ├─ Index.tsx           # Primary application view
 │   └─ NotFound.tsx        # 404 Route handling
 ├─ App.tsx                 # Core routing logic
 └─ main.tsx                # Entry point & global styles
```

---

##  How It Works

The engine behind this generator leverages advanced color theory and image processing:

1. **Smart Quantization**: Uses a **Median Cut Algorithm** to recursively subdivide the color space of your image into buckets, ensuring the most dominant and representative colors are extracted.
2. **Intelligent Role Mapping**: Analyzes the luminance and saturation of extracted colors to automatically assign them functional UI roles:
    - **Primary**: The most vibrant, characteristic color.
    - **Accent**: A high-saturation color for CTAs.
    - **Background/Text**: High-contrast pair for readability.
3. **Accessibility Validation**: Real-time calculation of **WCAG Contrast Ratios** between all assigned pairs, flagging combinations that don't meet AA/AAA industry standards.
4. **Mood & Psychology Analysis**: Maps HSL values to a psychological "mood profile," helping you understand the emotional impact of your chosen palette.
5. **Production Export**: Dynamically compiles the palette into production-ready **Tailwind CSS config**, **CSS Variables**, and interactive **JSX/HTML snippets**.

---

##  Roadmap

- [x] Median Cut quantization
- [x] WCAG Contrast analysis
- [x] Tailwind CSS & CSS Var exports
- [ ] Multiple quantization count selection (4, 8, 12 colors)
- [ ] Export as Figma (.fig) or ASE palette files
- [ ] Batch image processing

---

## Contributing

Contributions make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

##  License

Distributed under the MIT License. See `LICENSE` for more information.
