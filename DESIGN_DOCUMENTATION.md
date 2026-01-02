# Design Documentation - LegalCaseAI

## Design Philosophy

LegalCaseAI follows a warm, approachable design aesthetic that makes legal technology feel accessible and user-friendly. The design emphasizes clarity, professionalism, and ease of use.

## Color Palette

### Primary Colors
- **Primary Orange**: `oklch(0.7 0.15 55)` - Main brand color, used for CTAs and highlights
- **Background**: `oklch(0.99 0.005 85)` - Soft cream/beige for warmth
- **Foreground**: `oklch(0.2 0.02 250)` - Dark text for readability

### Secondary Colors
- **Accent**: `oklch(0.95 0.03 55)` - Light yellow/cream for subtle highlights
- **Muted**: `oklch(0.96 0.01 85)` - Soft backgrounds
- **Border**: `oklch(0.9 0.01 85)` - Subtle dividers

### Sidebar Colors
- **Sidebar Background**: `oklch(0.985 0.005 85)` - Slightly off-white
- **Sidebar Accent**: `oklch(0.95 0.03 55)` - Hover states

## Typography

### Font Family
- **Primary**: Geist (Sans-serif)
- **Monospace**: Geist Mono (for code/technical content)

### Font Sizes
- **Hero Heading**: 3.75rem (60px) on desktop
- **Section Headings**: 2.25rem (36px)
- **Body Text**: 0.875rem (14px) - 1rem (16px)
- **Small Text**: 0.75rem (12px)

### Font Weights
- **Bold**: 700 (Headings, important text)
- **Medium**: 500 (Subheadings, labels)
- **Regular**: 400 (Body text)

## Spacing System

Based on Tailwind's spacing scale (0.25rem = 4px increments):

- **Extra Small**: 0.5rem (8px) - `gap-2`
- **Small**: 1rem (16px) - `gap-4`
- **Medium**: 1.5rem (24px) - `gap-6`
- **Large**: 2rem (32px) - `gap-8`
- **Extra Large**: 3rem (48px) - `gap-12`

## Component Design

### Buttons

**Primary Button**
- Background: Primary orange
- Text: White
- Padding: 0.5rem 1.5rem
- Border radius: 9999px (fully rounded)
- Hover: Slightly darker shade

**Secondary Button**
- Background: Transparent
- Border: 1px solid border color
- Text: Foreground color
- Same padding and radius as primary

**Ghost Button**
- No background or border
- Text: Muted foreground
- Hover: Subtle background

### Input Fields

- Height: 3.5rem (56px) for large inputs
- Border: 2px solid border color
- Border radius: 9999px (search bars) or 0.625rem (forms)
- Focus: Ring with primary color
- Padding: 1.25rem horizontal

### Cards

- Background: White
- Border: 1px solid border color
- Border radius: 0.625rem (10px)
- Shadow: Subtle `shadow-lg`
- Padding: 1.5rem

### Chat Messages

**User Messages**
- Background: Primary color
- Text: White
- Alignment: Right
- Border radius: 1rem (16px)
- Max width: 80%

**Assistant Messages**
- Background: Card background
- Text: Foreground color
- Border: 1px solid border
- Alignment: Left
- Border radius: 1rem (16px)
- Max width: 80%

### Sidebar

- Width: 18rem (288px)
- Background: Sidebar background color
- Border right: 1px solid sidebar border
- Fixed positioning on mobile with overlay
- Sticky on desktop

## Layout Patterns

### Chat Interface Layout

```
┌─────────────┬──────────────────────────┐
│             │                          │
│   Sidebar   │      Main Chat Area      │
│             │                          │
│   - New     │   - Messages             │
│   - Search  │   - Input                │
│   - History │   - Actions              │
│   - Profile │                          │
│             │                          │
└─────────────┴──────────────────────────┘
```

### Home Page Layout

```
┌──────────────────────────────────────┐
│          Navbar (Sticky)             │
├──────────────────────────────────────┤
│                                      │
│         Hero Section                 │
│    (Search + Quick Prompts)          │
│                                      │
├──────────────────────────────────────┤
│        How It Works (3 Steps)        │
├──────────────────────────────────────┤
│      Features Section (4 Cards)      │
├──────────────────────────────────────┤
│         Trust Section                │
├──────────────────────────────────────┤
│          FAQ Section                 │
├──────────────────────────────────────┤
│            Footer                    │
└──────────────────────────────────────┘
```

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- Sidebar becomes overlay with hamburger menu
- Single column layouts
- Reduced font sizes
- Touch-friendly button sizes (min 44px)
- Stacked navigation

## Iconography

### Icon Library
- Lucide React icons
- Size: 16px (h-4 w-4), 20px (h-5 w-5), 24px (h-6 w-6)
- Stroke width: 2px (default)

### Common Icons
- **Scale**: Brand logo
- **MessageSquarePlus**: New chat
- **Search**: Search functionality
- **Clock**: History
- **Sparkles**: Premium features
- **Send**: Submit message
- **Coins**: Credits

## Animation & Transitions

### Hover States
- Duration: 200ms
- Easing: `ease-in-out`
- Properties: Background, color, transform

### Page Transitions
- Sidebar: `translate-x` with 300ms duration
- Dialogs: Fade in with scale
- Messages: Smooth scroll into view

### Loading States
- Skeleton screens for content
- Spinner for buttons
- Pulsing dots for typing indicator

## Accessibility

### Color Contrast
- Text/background: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Clear focus states

### Keyboard Navigation
- Tab order follows visual flow
- Focus visible on all interactive elements
- Escape closes dialogs
- Enter submits forms

### Screen Readers
- Semantic HTML elements
- ARIA labels where needed
- Alternative text for images
- Hidden labels for icon buttons

## Design Tokens

All design tokens are defined in `app/globals.css`:

```css
:root {
  --background: oklch(0.99 0.005 85);
  --foreground: oklch(0.2 0.02 250);
  --primary: oklch(0.7 0.15 55);
  --radius: 0.625rem;
  /* ... more tokens */
}
```

## Component Library

All UI components follow the design system and are built with:
- Radix UI primitives (for accessibility)
- Tailwind CSS (for styling)
- CVA (for variants)

## Best Practices

1. **Use design tokens**: Never hardcode colors
2. **Consistent spacing**: Use Tailwind's spacing scale
3. **Semantic colors**: Use background, foreground, primary, etc.
4. **Mobile-first**: Design for mobile, enhance for desktop
5. **Accessible**: Test with keyboard and screen readers

---

This design system ensures consistency across all pages and components of LegalCaseAI.
