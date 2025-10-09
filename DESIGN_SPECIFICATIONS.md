# ModelHub - Design Specifications for Splash Screen & App Icons

## 🎨 Brand Colors
- **Primary Indigo**: `#4f46e5`
- **Deep Purple**: `#3730a3`
- **Black**: `#000000`
- **White**: `#ffffff`
- **Background**: `#ececff`

---

## 📱 Asset Requirements

### 1. Splash Screen (`splash.png`)

**Dimensions:** 1284 x 2778 pixels (iPhone 14 Pro Max resolution)

**Design Specifications:**
- **Background**: Vertical gradient
  - Top color: `#3730a3` (Deep Purple)
  - Bottom color: `#4f46e5` (Primary Indigo)
  - Gradient direction: Top to bottom
  
- **Logo**:
  - Use the existing network logo (white version)
  - Size: 280x280 pixels
  - Position: Centered both horizontally and vertically
  - Color: White (`#ffffff`)
  - Effect: Add subtle glow with 40px blur, white at 30% opacity
  
- **Text (Optional)**:
  - App name "ModelHub" below logo
  - Font: Urbanist SemiBold, 42px
  - Color: White
  - Position: 60px below logo center

**Export Settings:**
- Format: PNG
- Color mode: RGB
- Bit depth: 8-bit
- No transparency (solid background)

---

### 2. iOS App Icon (`icon.png`)

**Dimensions:** 1024 x 1024 pixels

**Design Specifications:**
- **Background**: Radial gradient
  - Center color: `#4f46e5` (Primary Indigo)
  - Edge color: `#3730a3` (Deep Purple)
  - OR solid: `#4f46e5`
  
- **Logo**:
  - White network logo
  - Size: 640x640 pixels (centered in safe area)
  - Position: Centered with 192px margin on all sides (20% safe area)
  - Color: White (`#ffffff`)
  - No shadow/glow (iOS applies its own effects)

**Important Notes:**
- iOS automatically applies rounded corners (you provide square image)
- Leave at least 20% margin from edges for safe display area
- Test on dark/light home screens

**Export Settings:**
- Format: PNG
- Color mode: RGB
- Bit depth: 8-bit
- No transparency

---

### 3. Android Adaptive Icon (`adaptive-icon.png`)

**Dimensions:** 1024 x 1024 pixels

**Design Specifications:**
- **Background**: TRANSPARENT (background color set in app.json)
  
- **Foreground Logo**:
  - White network logo
  - Size: 450x450 pixels
  - Position: Centered in the safe zone (center 66% of canvas)
  - Safe zone: Circle with 512px diameter from center
  - Color: White (`#ffffff`)
  - Logo must fit within central 675x675px area for proper display

**Android Background Color** (set in app.json):
- Primary option: `#4f46e5` (Indigo)
- Alternative: `#000000` (Black)

**Important Notes:**
- Android masks icons with different shapes (circle, square, rounded square)
- Keep all important elements within the center 66% safe zone
- Foreground layer can have transparency

**Export Settings:**
- Format: PNG
- Color mode: RGBA (with alpha channel)
- Bit depth: 8-bit
- WITH transparency

---

## 🛠️ How to Create These Assets

### Option 1: Using AI Image Generators

#### For Splash Screen:
```
Create a mobile app splash screen, 1284x2778 pixels. Vertical gradient background from deep purple (#3730a3) at top to indigo (#4f46e5) at bottom. In the center, a minimalist white network/node connection icon (abstract geometric circles connected by lines forming an M shape), 280x280 pixels with a subtle white glow. Clean, modern, tech aesthetic. Below the icon, "ModelHub" text in white, modern sans-serif font.
```

#### For App Icons:
```
Create an app icon, 1024x1024 pixels, square format. Radial gradient background from indigo (#4f46e5) center to deep purple (#3730a3) edges. Centered white minimalist network icon (abstract geometric circles connected by lines forming M shape), 640x640 pixels. Modern, clean, professional AI/tech aesthetic. Leave 192px margin from all edges.
```

#### For Android Adaptive Icon:
```
Create a transparent app icon foreground layer, 1024x1024 pixels. White minimalist network/node connection icon (abstract geometric circles connected by lines forming M shape), 450x450 pixels, centered. Completely transparent background. Icon must fit within center safe zone circle.
```

**Recommended AI Tools:**
- DALL-E 3 (ChatGPT Plus)
- Midjourney
- Leonardo.ai
- Adobe Firefly

---

### Option 2: Using Online Icon Generators

**Recommended Tools:**

1. **[App Icon Generator](https://www.appicon.co/)** ✨ Best option
   - Upload your base design
   - Automatically generates all required sizes
   - Supports iOS and Android formats

2. **[MakeAppIcon](https://makeappicon.com/)**
   - Free tool
   - Generates all platform sizes
   - Good for quick prototyping

3. **[IconKitchen](https://icon.kitchen/)**
   - Android adaptive icon specialist
   - Live preview of different shapes
   - Export foreground/background separately

---

### Option 3: Using Design Tools (Figma/Canva)

#### Figma Steps:
1. Create frame with exact dimensions (1284x2778 for splash)
2. Add gradient background (use gradient tool)
3. Import your logo.png as white version
4. Add blur effect for glow (Effects → Layer Blur → Gaussian Blur)
5. Export as PNG at 1x (actual size)

#### Canva Steps:
1. Custom size: 1284 x 2778 pixels
2. Add gradient background (Elements → Gradients)
3. Upload your white logo
4. Add glow effect (Effects → Glow)
5. Download as PNG

---

## 📐 Quick Reference Sizes

| Asset | Dimensions | Background | Logo Size | Transparency |
|-------|------------|------------|-----------|--------------|
| splash.png | 1284×2778 | Gradient | 280×280 | No |
| icon.png | 1024×1024 | Gradient/Solid | 640×640 | No |
| adaptive-icon.png | 1024×1024 | Transparent | 450×450 | Yes |

---

## 🎯 Logo Extraction

Your current logo is in `/assets/logo.png` - you'll need to create a WHITE version:

### In image editor:
1. Open logo.png
2. Select all non-transparent pixels
3. Fill with white (#ffffff)
4. Save as logo-white.png (temporary working file)

### Or use this simple approach:
- Your logo appears to be line-based network nodes
- Redraw in white in any design tool based on the structure
- Save as SVG for scalability, then export to required PNG sizes

---

## ✅ Validation Checklist

Before finalizing:
- [ ] Splash screen is 1284×2778 pixels
- [ ] App icon is 1024×1024 pixels
- [ ] Android adaptive icon is 1024×1024 with transparency
- [ ] All logos are white on colored backgrounds
- [ ] Safe margins are respected (20% for iOS, 66% center for Android)
- [ ] Colors match brand palette
- [ ] Files are named correctly: splash.png, icon.png, adaptive-icon.png
- [ ] Test on both light and dark device backgrounds

