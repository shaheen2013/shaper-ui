export const hexToRgba = (hex: string, opacity: number) => {
  try {
    if (!hex || typeof hex !== "string") {
      return undefined;
    }

    hex = hex.replace(/^#/, "");

    // Check if it's a valid hex color
    if (!/^([0-9A-F]{3}){1,2}$/i.test(hex)) {
      // Return a default color if invalid
      return `rgba(23, 92, 211, ${opacity})`; // Default blue color
    }

    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch (error) {
    console.error("Error processing color:", error);
    return `rgba(23, 92, 211, ${opacity})`; // Default blue color if any error
  }
};

export const darkenColor = (hex: string, percent: number = 70) => {
  try {
    if (!hex || typeof hex !== "string") {
      return "#000000";
    }

    hex = hex.replace(/^#/, "");

    // Check if it's a valid hex color
    if (!/^([0-9A-F]{3}){1,2}$/i.test(hex)) {
      return "#000000"; // Default black for text if invalid
    }

    // Convert 3-digit hex to 6-digit
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Convert RGB to HSL to better handle saturation
    // RGB to HSL conversion
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    // Increase saturation and decrease lightness
    s = Math.min(1, s * 1.3); // Increase saturation by 30%
    l = Math.max(0, (l * (100 - percent)) / 100); // Decrease lightness

    // Convert back to RGB
    let r1, g1, b1;

    if (s === 0) {
      r1 = g1 = b1 = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r1 = hue2rgb(p, q, h + 1 / 3);
      g1 = hue2rgb(p, q, h);
      b1 = hue2rgb(p, q, h - 1 / 3);
    }

    // Convert back to hex
    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r1)}${toHex(g1)}${toHex(b1)}`;
  } catch (error) {
    console.error("Error processing color:", error);
    return "#000000"; // Default to black if any error
  }
};
