# Design Guidelines: Grocery Store Product Finder PWA

## Design Approach
**System Selected:** Material Design
**Rationale:** Utility-focused application requiring consistent, mobile-first patterns with strong emphasis on quick task completion and accessibility. Material Design provides excellent touch-optimized components and clear hierarchy for information-dense interfaces.

## Core Design Principles
1. **Speed First:** Minimize steps between opening app and finding product location
2. **Thumb-Zone Optimization:** All critical interactions within easy thumb reach on mobile
3. **Clarity Over Decoration:** Clean, high-contrast layouts for quick scanning in store lighting
4. **Offline Reliability:** Visual feedback showing app works without connection

## Typography System
- **Primary Font:** Roboto (Material Design standard)
- **Hierarchy:**
  - Tab Labels: 14px, medium weight, uppercase
  - Product Names: 18px, medium weight
  - EAN Numbers: 16px, regular weight, monospace font for digits
  - Map Labels/Aisles: 14px, bold
  - Auxiliary Info: 12px, regular weight
  - Input Fields: 16px (prevents mobile zoom on focus)

## Layout & Spacing System
**Spacing Units:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4
- Section spacing: space-y-4 or gap-4
- Generous tap targets: min-height of h-12 (48px)
- Tab bar height: h-14
- Map container: Remaining viewport after tabs/header

**Viewport Strategy:**
- Full-height app (100vh) with fixed header and tabs
- Scrollable content areas within tabs
- Map takes full remaining height in results view

## Component Library

### Navigation & Tabs
- **Tab Bar:** Fixed bottom navigation with 2 tabs (Scan | Finder)
- Active tab indicated with bottom border (h-1) and medium weight text
- Icon + label combination for each tab (camera icon for Scan, keyboard icon for Finder)
- Tab height: h-14 with p-4 internal padding

### Scan Tab Components
- **Camera Viewfinder:** Full-width rectangle with rounded corners (rounded-lg), aspect-ratio-video
- **Scan Instruction Text:** Below viewfinder, text-sm with minimal spacing
- **Manual Switch Link:** Subtle text link "Enter code manually" leading to Finder tab

### Finder Tab Components
- **EAN Input Field:**
  - Full-width with rounded-lg borders
  - Height: h-12 for comfortable touch
  - Type: number input with pattern for EAN validation
  - Placeholder: "Enter 13-digit EAN barcode"
  - Persistent floating label above when focused
  
- **Search Button:** 
  - Full-width, h-12
  - Medium weight text "Find Product"
  - Positioned with mt-4 spacing

### Product Results Display
- **Product Card:**
  - Full-width card with rounded-lg, p-4 padding
  - Product name: text-lg, medium weight at top
  - EAN number: text-sm, monospace below name with subtle styling
  - Price: text-xl, medium weight, prominent placement
  - Location info: Aisle and shelf in grid layout (grid-cols-2, gap-2)
  
- **Map Toggle Button:** 
  - Prominent button with map icon
  - Fixed or sticky position for easy access
  - Text: "Show on Map"

### Store Map View
- **Map Container:**
  - Full remaining viewport height
  - Product location marked with pulsing indicator
  - Aisle labels clearly visible
  - Zoom controls in corner (bottom-right)
  
- **Map Legend:**
  - Fixed overlay (top-4, left-4)
  - Small card with rounded corners
  - Shows: Current location, Product location, Aisles

- **Back to Product Button:**
  - Floating action button style (bottom-6, right-6)
  - Circular with close/back icon
  - Size: w-14 h-14

### Search History
- **History List Items:**
  - Compact cards in vertical stack (space-y-2)
  - Each item: h-16 with p-3
  - Left: Product name truncated, EAN below
  - Right: Timestamp, small text
  - Tap to repeat search

### Loading & Error States
- **Scanning Indicator:** Animated scanning line overlay on camera view
- **Loading Spinner:** Center-screen, medium size during product lookup
- **Error Messages:** Alert cards with rounded-lg, p-4, icon + message
- **Offline Indicator:** Persistent banner at top when offline

## Interaction Patterns
- **Tap Targets:** Minimum 48px (h-12) for all interactive elements
- **Feedback:** Immediate visual response on tap (subtle scale or opacity shift)
- **Keyboard:** Auto-focus EAN input in Finder tab, numeric keyboard
- **Camera Permission:** Clear prompt with explanation on first Scan tab visit

## PWA-Specific Elements
- **Install Prompt:** Bottom sheet modal, dismissible, shown on second visit
- **Offline Mode Badge:** Small indicator in header showing connection status
- **Update Available:** Toast notification with "Refresh" action

## Images
No hero images or decorative imagery. All visual elements are functional:
- Product placeholder icons if product image unavailable
- Aisle/section icons for map legend
- Tab icons (camera, keyboard/search)
- Map markers/indicators

This is a utility application - every pixel serves the function of helping shoppers find products quickly.