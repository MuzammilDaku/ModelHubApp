#!/bin/bash

# ModelHub - Automated Asset Generator
# This script generates splash screen and app icons from your logo
# Requires: ImageMagick (install with: sudo apt-get install imagemagick)

echo "🎨 ModelHub Asset Generator"
echo "=========================="
echo ""

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick not found. Please install it:"
    echo "   sudo apt-get install imagemagick"
    exit 1
fi

# Colors
DEEP_PURPLE="#3730a3"
PRIMARY_INDIGO="#4f46e5"
WHITE="#ffffff"

# File paths
ASSETS_DIR="./assets"
LOGO_FILE="$ASSETS_DIR/logo.png"
LOGO_WHITE="$ASSETS_DIR/logo-white.png"

# Check if logo exists
if [ ! -f "$LOGO_FILE" ]; then
    echo "❌ Logo file not found: $LOGO_FILE"
    exit 1
fi

echo "📁 Working directory: $(pwd)"
echo "🎯 Assets directory: $ASSETS_DIR"
echo ""

# Step 1: Create white version of logo
echo "1️⃣  Creating white version of logo..."
convert "$LOGO_FILE" -colorspace RGB -fill white -colorize 100 "$LOGO_WHITE"
echo "   ✅ Created: $LOGO_WHITE"
echo ""

# Step 2: Generate Splash Screen (1284x2778)
echo "2️⃣  Generating splash screen (1284x2778)..."

# Create gradient background
convert -size 1284x2778 gradient:"$DEEP_PURPLE"-"$PRIMARY_INDIGO" "$ASSETS_DIR/splash-bg.png"

# Resize white logo to 280x280
convert "$LOGO_WHITE" -resize 280x280 "$ASSETS_DIR/logo-280.png"

# Add glow effect
convert "$ASSETS_DIR/logo-280.png" \
    \( +clone -background white -shadow 80x40+0+0 \) \
    +swap -background none -layers merge +repage \
    "$ASSETS_DIR/logo-glow.png"

# Composite logo onto splash background
convert "$ASSETS_DIR/splash-bg.png" \
    "$ASSETS_DIR/logo-glow.png" \
    -gravity center -composite \
    "$ASSETS_DIR/splash.png"

echo "   ✅ Created: $ASSETS_DIR/splash.png"
echo ""

# Step 3: Generate iOS Icon (1024x1024)
echo "3️⃣  Generating iOS app icon (1024x1024)..."

# Create radial gradient background
convert -size 1024x1024 radial-gradient:"$PRIMARY_INDIGO"-"$DEEP_PURPLE" "$ASSETS_DIR/icon-bg.png"

# Resize white logo to 640x640
convert "$LOGO_WHITE" -resize 640x640 "$ASSETS_DIR/logo-640.png"

# Composite logo onto icon background
convert "$ASSETS_DIR/icon-bg.png" \
    "$ASSETS_DIR/logo-640.png" \
    -gravity center -composite \
    "$ASSETS_DIR/icon.png"

echo "   ✅ Created: $ASSETS_DIR/icon.png"
echo ""

# Step 4: Generate Android Adaptive Icon (1024x1024)
echo "4️⃣  Generating Android adaptive icon (1024x1024)..."

# Resize white logo to 450x450
convert "$LOGO_WHITE" -resize 450x450 "$ASSETS_DIR/logo-450.png"

# Create transparent background with centered logo
convert -size 1024x1024 xc:none \
    "$ASSETS_DIR/logo-450.png" \
    -gravity center -composite \
    "$ASSETS_DIR/adaptive-icon.png"

echo "   ✅ Created: $ASSETS_DIR/adaptive-icon.png"
echo ""

# Cleanup temporary files
echo "🧹 Cleaning up temporary files..."
rm -f "$ASSETS_DIR/splash-bg.png"
rm -f "$ASSETS_DIR/icon-bg.png"
rm -f "$ASSETS_DIR/logo-280.png"
rm -f "$ASSETS_DIR/logo-640.png"
rm -f "$ASSETS_DIR/logo-450.png"
rm -f "$ASSETS_DIR/logo-glow.png"
echo "   ✅ Cleanup complete"
echo ""

echo "✨ SUCCESS! All assets generated!"
echo ""
echo "📦 Generated files:"
echo "   - $ASSETS_DIR/splash.png (1284x2778)"
echo "   - $ASSETS_DIR/icon.png (1024x1024)"
echo "   - $ASSETS_DIR/adaptive-icon.png (1024x1024)"
echo "   - $ASSETS_DIR/logo-white.png (white version of logo)"
echo ""
echo "🚀 Next steps:"
echo "   1. Review the generated assets"
echo "   2. Run: npx expo start --clear"
echo "   3. Test on iOS: npm run ios"
echo "   4. Test on Android: npm run android"
echo ""
echo "💡 Tip: If icons don't update, run: npx expo prebuild --clean"

