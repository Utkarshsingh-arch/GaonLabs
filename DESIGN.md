# GaonLab Design System & UI/UX Specification

> **Version**: 1.0.0 (SkillUp Aesthetic Edition)  
> **Status**: Production Reference Standard  
> **Target Platforms**: Web (Desktop, Tablet, Mobile)  
> **Primary Audience**: Monorepo Developers, UI Engineers, PR Authors  

---

## 1. Design System Philosophy & Identity

GaonLab adopts the **SkillUp design aesthetic**: an approachable, warm, human-centered, and joyful visual system tailored for educational excellence. It balances playful, encouraging learning interactions with clean, rigorous, professional information architecture.

### Core Visual Tenets
1. **Warm Parchment Canvas**: Eliminates sterile, cold grays (`slate`, `zinc`). The background is an ultra-soft, warm ivory parchment (`#FBFAF9`) that reduces eye strain during extended study.
2. **Signature Vibrant Orange**: `#FA9C4D` is the energetic, warm heartbeat of the product—used on hero banners, primary action buttons, active navigation states, and progress indicators.
3. **Sunshine Yellow Highlights**: `#FFCF4F` / `#FAC05E` brings positivity to calendar active days, streak indicators, star achievements, and playful vector illustrations.
4. **Mint Green Verification**: `#48AF76` with `#CEECDA` signifies syllabus accuracy, verified curriculum chapters, and completed tasks.
5. **Espresso Charcoal Typography**: `#352F2A` replaces harsh pure black (`#000000`), delivering rich contrast that feels natural and warm.
6. **Generous Radii & Organic Softness**: Primary cards use `rounded-3xl` (`24px` / `1.5rem`), inputs use pill shapes (`rounded-full`), and illustration areas use soft organic shapes.
7. **Whisper-Thin Hairline Borders**: Cards use a delicate 1px border in `#EFECE6` with soft, natural drop shadows (`rgba(53, 47, 42, 0.05)`).

---

## 2. Complete Color Token Specification

All PRs **MUST** strictly adhere to these color tokens. Do **NOT** invent arbitrary hex codes or fall back to generic Tailwind grays (`bg-gray-100`, `text-slate-800`, etc.).

### 2.1 Surfaces & Layout Layers

| Token Name | Hex Code | Tailwind Utility | RGB | Usage |
|---|---|---|---|---|
| **Canvas** | `#FBFAF9` | `bg-[#FBFAF9]` / `bg-canvas` | `251, 250, 249` | Global viewport background, sidebar canvas |
| **Surface Card** | `#FFFFFF` | `bg-white` / `bg-surface-card` | `255, 255, 255` | Primary cards, modals, search inputs, active day cards |
| **Surface Inset** | `#F8F4EE` | `bg-[#F8F4EE]` / `bg-surface-ivory` | `248, 244, 238` | Illustration containers, activity bar tracks, chip containers |
| **Surface Cream** | `#FAF5EF` | `bg-[#FAF5EF]` / `bg-surface-cream` | `250, 245, 239` | Active sidebar nav pill background, subtle hover fills |
| **Border Hairline** | `#EFECE6` | `border-[#EFECE6]` | `239, 236, 230` | Default card borders, dividers, list separators |
| **Border Interactive** | `#D9D6D0` | `border-[#D9D6D0]` | `217, 214, 208` | Form input borders, hover states, scrollbar thumbs |

---

### 2.2 Primary Brand Accent: Warm Orange

| Token Name | Hex Code | Tailwind Utility | RGB | Usage |
|---|---|---|---|---|
| **Orange 50** | `#FFF9F4` | `bg-[#FFF9F4]` | `255, 249, 244` | Subtle card background tints |
| **Orange 100** | `#FFEEDD` | `bg-[#FFEEDD]` | `255, 238, 221` | Badge backgrounds, icon containers, selection highlight |
| **Orange 200** | `#FFD9B8` | `border-[#FFD9B8]` | `255, 217, 184` | Badge borders, focus rings, hover outlines |
| **Orange 400 / 500** | `#FA9C4D` | `bg-[#FA9C4D]` / `text-[#FA9C4D]` | `250, 156, 77` | **Primary Brand Color**: Hero banner, primary CTAs, active icons |
| **Orange 600** | `#EB8833` | `hover:bg-[#EB8833]` | `235, 136, 51` | Primary button hover / active press state |
| **Orange 700** | `#D47220` | `text-[#D47220]` | `212, 114, 32` | Accessible high-contrast text on `#FFEEDD` badges |
| **Orange Glow** | `rgba(250, 156, 77, 0.35)` | `shadow-orange-glow` | — | `box-shadow: 0 8px 20px -4px rgba(250, 156, 77, 0.35)` |

---

### 2.3 Secondary Accent: Sunshine Yellow

| Token Name | Hex Code | Tailwind Utility | RGB | Usage |
|---|---|---|---|---|
| **Yellow 100** | `#FEF7DE` | `bg-[#FEF7DE]` | `254, 247, 222` | Light highlight badge fill |
| **Yellow 200** | `#FDEEB4` | `bg-[#FDEEB4]` | `253, 238, 180` | Achievement badges, star rating tracks |
| **Yellow 400** | `#FFCF4F` | `bg-[#FFCF4F]` / `text-[#FFCF4F]` | `255, 207, 79` | **Active Calendar Day Chip**, illustration background sun blobs |
| **Yellow 500** | `#FAC05E` | `bg-[#FAC05E]` | `250, 192, 94` | Flame fill highlights, streak badges, avatar gradient |

---

### 2.4 Status Accent: Mint Green

| Token Name | Hex Code | Tailwind Utility | RGB | Usage |
|---|---|---|---|---|
| **Green 100** | `#E8F7EE` | `bg-[#E8F7EE]` | `232, 247, 238` | Subtle success fill |
| **Green 200** | `#CEECDA` | `bg-[#CEECDA]` | `206, 236, 218` | Verified pill background, completed checkmark badge container |
| **Green 500** | `#48AF76` | `text-[#48AF76]` / `bg-[#48AF76]` | `72, 175, 118` | **Success / Verified Icon**, completed progress bar fill |
| **Green 600** | `#389461` | `text-[#389461]` | `56, 148, 97` | High-contrast accessible text on `#CEECDA` badges |

---

### 2.5 Typography & Neutral Tones

| Token Name | Hex Code | Tailwind Utility | RGB | Usage |
|---|---|---|---|---|
| **Dark 900** | `#231F1C` | `text-[#231F1C]` | `35, 31, 28` | Heavy display hero text, prominent branding |
| **Dark 800 (Primary)** | `#352F2A` | `text-[#352F2A]` | `53, 47, 42` | **Primary Body Heading & Text**, form labels, navigation text |
| **Dark 600 (Secondary)** | `#636160` | `text-[#636160]` | `99, 97, 96` | Subtitles, card descriptions, timestamps, dates |
| **Dark 400 (Tertiary)** | `#9E9B97` | `text-[#9E9B97]` | `158, 155, 151` | Placeholders, inactive calendar labels, progress fractions |

---

## 3. Typography Standards

The typography hierarchy uses **Plus Jakarta Sans** (Google Fonts). It provides clean geometric forms with soft humanist curves that match the SkillUp reference.

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Font Scale & Hierarchy

| Element | Size | Weight | Tracking | Line Height | Tailwind Classes |
|---|---|---|---|---|---|
| **Hero Display** | 36px–40px (`text-3xl sm:text-4xl`) | `font-extrabold` (800) | `tracking-tight` | `leading-tight` | `text-3xl sm:text-4xl font-extrabold text-white tracking-tight` |
| **Section Title (H2)** | 20px–24px (`text-xl`) | `font-extrabold` (800) | `tracking-tight` | `leading-tight` | `text-xl font-extrabold text-[#352F2A] tracking-tight` |
| **Card Heading (H3)** | 16px (`text-base`) | `font-extrabold` (800) | `tracking-tight` | `leading-tight` | `text-base font-extrabold text-[#352F2A]` |
| **Item Title (H4)** | 14px (`text-sm`) | `font-extrabold` (800) | Normal | `leading-snug` | `text-sm font-extrabold text-[#352F2A]` |
| **Body Primary** | 13px–14px (`text-xs sm:text-sm`) | `font-medium` (500) | Normal | `leading-relaxed` | `text-sm text-[#636160] font-medium leading-relaxed` |
| **Meta / Subtitle** | 12px (`text-xs`) | `font-semibold` (600) | Normal | `leading-normal` | `text-xs text-[#9E9B97] font-semibold` |
| **Micro Badge / Tag** | 10px–11px (`text-[10px]` or `[11px]`) | `font-bold` (700) | `tracking-wider` | `leading-none` | `text-[10px] font-bold uppercase tracking-wider` |

---

## 4. Spacing, Elevation & Corner Radii

### 4.1 Border Radii Hierarchy
- **Card Containers & Hero Banner**: `rounded-3xl` (`24px` / `1.5rem`)
- **Illustration & Inset Containers**: `rounded-2xl` (`16px` / `1rem`)
- **Buttons, Calendar Chips & Badges**: `rounded-xl` (`12px` / `0.75rem`) to `rounded-2xl`
- **Pill Search Bars & Badges**: `rounded-full` (`9999px`)

### 4.2 Elevation & Drop Shadows
```js
// tailwind.config.js extend
boxShadow: {
  'soft-sm': '0 2px 8px -2px rgba(53, 47, 42, 0.05)',
  'soft-md': '0 8px 24px -4px rgba(53, 47, 42, 0.07)',
  'soft-lg': '0 16px 36px -6px rgba(53, 47, 42, 0.10)',
  'orange-glow': '0 8px 20px -4px rgba(250, 156, 77, 0.35)',
}
```

---

## 5. Component Patterns & UI Blueprints

### 5.1 Left Navigation Sidebar (`SkillUpSidebar.tsx`)
```tsx
// Active Nav Item Pattern
<Link
  to="/app/dashboard"
  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold bg-[#FAF5EF] text-[#352F2A] shadow-soft-sm border border-[#EFECE6]"
>
  <div className="flex items-center gap-3">
    <Home className="w-5 h-5 text-[#FA9C4D]" />
    <span>Dashboard</span>
  </div>
</Link>

// Inactive Nav Item Pattern
<Link
  to="/app/dashboard#courses"
  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-[#636160] hover:text-[#352F2A] hover:bg-[#F8F4EE]/60 transition-all"
>
  <div className="flex items-center gap-3">
    <Compass className="w-5 h-5 text-[#9E9B97]" />
    <span>All Courses</span>
  </div>
</Link>
```

### 5.2 Top Pill Search Header (`SkillUpHeader.tsx`)
```tsx
<div className="relative flex-1 max-w-xl">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <Search className="h-4 w-4 text-[#9E9B97]" />
  </div>
  <input
    type="text"
    placeholder="Search textbooks, chapters, STEM experiments..."
    className="w-full pl-11 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EFECE6] rounded-full text-xs sm:text-sm text-[#352F2A] placeholder-[#9E9B97] focus:outline-none focus:ring-2 focus:ring-[#FA9C4D]/30 focus:border-[#FA9C4D] shadow-soft-sm transition-all"
  />
</div>
```

### 5.3 Hero Banner with Rocket Illustration
```tsx
<section className="relative overflow-hidden rounded-3xl bg-[#FA9C4D] p-7 md:p-9 text-white shadow-soft-md">
  {/* Subtle gradient glow */}
  <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />

  <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
    <div className="max-w-md">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
        Hi, {studentName}!
      </h1>
      <p className="mt-2 text-sm sm:text-base font-medium text-white/95 leading-relaxed">
        Welcome back! Let's have some fun today. New knowledge awaits
      </p>
    </div>
    <div className="shrink-0">
      <RocketIllustration className="w-32 h-32 md:w-36 md:h-36 drop-shadow-md" />
    </div>
  </div>
</section>
```

### 5.4 Course Cards ("Coding Quest" & "Code Adventure")
```tsx
<div className="bg-[#FFFFFF] rounded-3xl border border-[#EFECE6] overflow-hidden p-4 flex flex-col justify-between hover:shadow-soft-md transition-all cursor-pointer group">
  <div>
    {/* Soft Ivory Top Illustration Container */}
    <div className="w-full h-32 bg-[#F8F4EE] rounded-2xl flex items-center justify-center p-2 mb-3.5 group-hover:bg-[#FAF5EF] transition-colors">
      <MapIllustration className="w-full h-28" />
    </div>

    <h3 className="font-extrabold text-base text-[#352F2A] group-hover:text-[#FA9C4D] transition-colors leading-tight">
      Coding Quest
    </h3>
    <p className="text-xs text-[#9E9B97] font-semibold mt-1">
      Basic Level: Class 8 Mathematics
    </p>
  </div>

  <div className="mt-5 space-y-2">
    {/* Progress Bar (Mint Green for Completed, Orange for In-Progress) */}
    <div className="w-full h-2 bg-[#F8F4EE] rounded-full overflow-hidden">
      <div className="w-4/5 h-full bg-[#48AF76] rounded-full" />
    </div>

    <div className="flex items-center justify-between text-[11px] font-bold text-[#9E9B97]">
      <span>Completed 10/13</span>
      <span>Achievements 4/5</span>
    </div>
  </div>
</div>
```

### 5.5 Dashed "Add New Course" Card
```tsx
<div className="bg-[#FBFAF9] rounded-3xl border-2 border-dashed border-[#EFECE6] hover:border-[#FFD9B8] p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FAF5EF] transition-all group min-h-[260px]">
  <div className="w-14 h-14 rounded-full bg-[#FFEEDD] border border-[#FFD9B8] flex items-center justify-center text-[#FA9C4D] group-hover:scale-110 transition-transform shadow-soft-sm mb-3">
    <Plus className="w-7 h-7 stroke-[2.5]" />
  </div>
  <h3 className="font-extrabold text-sm text-[#FA9C4D] group-hover:text-[#D47220] transition-colors">
    Add New Course
  </h3>
  <p className="text-[11px] text-[#9E9B97] mt-1 max-w-[180px]">
    Explore CBSE and Karnataka State Board textbooks
  </p>
</div>
```

### 5.6 Weekly Progress Calendar Strip
```tsx
<div className="grid grid-cols-7 gap-1.5 text-center">
  {weekDays.map((d) => (
    <div key={d.label} className="flex flex-col items-center">
      <span className="text-[10px] font-bold text-[#9E9B97] mb-1.5">{d.label}</span>
      <button
        type="button"
        className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
          d.active
            ? 'bg-[#FFCF4F] text-[#352F2A] shadow-soft-sm'
            : 'bg-transparent text-[#636160] hover:bg-[#F8F4EE]'
        }`}
      >
        <span>{d.date}</span>
        {d.active && <span className="w-1.5 h-1.5 rounded-full bg-[#FA9C4D] mt-0.5" />}
      </button>
    </div>
  ))}
</div>
```

### 5.7 Recent Tasks with Category Badges
```tsx
// Task Icon Types:
// 1. Flame: bg-[#FFE6C7] text-[#FA9C4D]
// 2. Document: bg-[#FFEEDD] text-[#EB8833]
// 3. Branch: bg-[#FFF4E6] text-[#FA9C4D]
// 4. Completed: bg-[#CEECDA] text-[#48AF76]
<div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#FAF5EF] transition-all cursor-pointer group border border-transparent hover:border-[#EFECE6]">
  <div className="flex items-center gap-3 min-w-0">
    <div className="w-10 h-10 rounded-2xl bg-[#FFE6C7] flex items-center justify-center shrink-0">
      <Flame className="w-5 h-5 text-[#FA9C4D] fill-[#FA9C4D]" />
    </div>
    <div className="min-w-0">
      <div className="text-xs font-bold text-[#352F2A] truncate">Exceptions and their handling</div>
      <div className="text-[11px] text-[#9E9B97] mt-0.5">Lesson 15 • Deadline: 07/25</div>
    </div>
  </div>
  <ChevronRight className="w-4 h-4 text-[#9E9B97] group-hover:text-[#FA9C4D] group-hover:translate-x-0.5 transition-all" />
</div>
```

### 5.8 Activity Horizontal Bar Breakdown
```tsx
<div className="space-y-1">
  <div className="flex items-center justify-between text-xs">
    <span className="font-semibold text-[#636160]">{label}</span>
    <span className="text-[11px] font-bold text-[#9E9B97]">{percentage}%</span>
  </div>
  <div className="w-full h-2.5 bg-[#F8F4EE] rounded-full overflow-hidden">
    <div
      className="h-full bg-[#FA9C4D] rounded-full transition-all duration-500 ease-out"
      style={{ width: `${percentage}%` }}
    />
  </div>
</div>
```

---

## 6. Illustration Guidelines

All custom illustrations must follow the vector 2D style defined in [`SkillUpIllustrations.tsx`](file:///home/robin/Projects/GaonLabs/apps/web/src/components/SkillUpIllustrations.tsx):
- **Strokes**: Use `#352F2A` for primary outlines with `strokeWidth={2}` or `2.5` and `strokeLinejoin="round"`.
- **Fills**: Combine pure white (`#FFFFFF`) card or object bodies with warm orange (`#FA9C4D`) accents and sunny yellow (`#FFCF4F`) organic backdrop blobs.
- **Background Blobs**: Organic ellipses or circles in `#FFCF4F` (yellow) or `#FA9C4D` (orange) at `fillOpacity="0.25"` to `0.4` behind the central motif.
- **Shadows**: Minimal, flat drop shadows (`fill="#352F2A" fillOpacity="0.15"`). No heavy photographic drop shadows or gradients.

---

## 7. Accessibility (a11y) & Contrast Compliance

1. **Orange on White**: Large text (`font-extrabold`, $\ge 18\text{px}$) in `#FA9C4D` passes WCAG AA. For small body text, use `#D47220` or `#A1510F` to meet 4.5:1 contrast requirements.
2. **Text on Orange Fills**: Always use pure white (`#FFFFFF`) with `font-bold` or `font-extrabold`. Never use muted gray text on orange backgrounds.
3. **Pills & Badges**:
   - Orange Badges: Background `#FFEEDD`, text `#D47220` (Contrast: 5.2:1)
   - Green Badges: Background `#CEECDA`, text `#389461` (Contrast: 4.8:1)
   - Yellow Badges: Background `#FFCF4F`, text `#352F2A` (Contrast: 9.1:1)
4. **Interactive Focus States**: Every clickable element, button, and input must feature visible keyboard focus:
   ```css
   focus:outline-none focus:ring-2 focus:ring-[#FA9C4D]/30 focus:border-[#FA9C4D]
   ```

---

## 8. PR Author Checklist

Before submitting a Pull Request touching `apps/web`:

- [ ] **Color Fidelity**: Did you use ONLY the hex codes specified in this document? (No `slate-500`, `zinc-900`, `blue-600` unless explicitly aliased).
- [ ] **Background Canvas**: Is the root background `#FBFAF9` (not `#F8FAFC` or `#F3F4F6`)?
- [ ] **Corner Radii**: Are cards `rounded-3xl` (`24px`), inset illustration areas `rounded-2xl`, and pills `rounded-full`?
- [ ] **Borders**: Are borders set to `#EFECE6` with 1px width?
- [ ] **Hover & Micro-interactions**: Do buttons and cards have gentle transitions (`transition-all duration-200`, `hover:shadow-soft-md`, `hover:scale-[1.01]`)?
- [ ] **TypeScript Cleanliness**: Does `npm --workspace=@gaonlab/web run build` compile cleanly with **0 errors** under `noUnusedLocals: true` and `noUnusedParameters: true`?
- [ ] **Mobile Responsiveness**: Does the layout collapse gracefully from the 3-column desktop view (`Sidebar` + `Main` + `RightWidgets`) to mobile single-column stacks without horizontal overflow?

