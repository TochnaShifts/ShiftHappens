// Keyboard layout correction utility for Hebrew/English
// Maps QWERTY keys to Hebrew characters and vice versa

const QWERTY_TO_HEBREW: Record<string, string> = {
  'q': 'ש', 'w': 'ו', 'e': 'ע', 'r': 'ר', 't': 'א', 'y': 'ט', 'u': 'ו', 'i': 'י', 'o': 'ם', 'p': 'פ',
  'a': 'ש', 's': 'ד', 'd': 'ג', 'f': 'כ', 'g': 'ע', 'h': 'י', 'j': 'ח', 'k': 'ל', 'l': 'ך', ';': 'ף',
  'z': 'ז', 'x': 'ס', 'c': 'ב', 'v': 'ה', 'b': 'נ', 'n': 'מ', 'm': 'צ', ',': 'ת', '.': 'ץ', '/': '.',
  'Q': 'ש', 'W': 'ו', 'E': 'ע', 'R': 'ר', 'T': 'א', 'Y': 'ט', 'U': 'ו', 'I': 'י', 'O': 'ם', 'P': 'פ',
  'A': 'ש', 'S': 'ד', 'D': 'ג', 'F': 'כ', 'G': 'ע', 'H': 'י', 'J': 'ח', 'K': 'ל', 'L': 'ך',
  'Z': 'ז', 'X': 'ס', 'C': 'ב', 'V': 'ה', 'B': 'נ', 'N': 'מ', 'M': 'צ',
  '`': ';', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  '-': '-', '=': '=', '[': ']', ']': '[', '\\': '\\', "'": "'", '"': '"',
  ' ': ' '
};

const HEBREW_TO_QWERTY: Record<string, string> = {
  'ש': 'a', 'ו': 'w', 'ע': 'e', 'ר': 'r', 'א': 't', 'ט': 'y', 'י': 'i', 'ם': 'o', 'פ': 'p',
  'ד': 's', 'ג': 'd', 'כ': 'f', 'ח': 'j', 'ל': 'k', 'ך': 'l', 'ף': ';',
  'ז': 'z', 'ס': 'x', 'ב': 'c', 'ה': 'v', 'נ': 'b', 'מ': 'n', 'צ': 'm', 'ת': ',', 'ץ': '.',
  ';': '`', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  '-': '-', '=': '=', ']': '[', '[': ']', '\\': '\\', "'": "'", '"': '"',
  ' ': ' '
};

/**
 * Converts text from QWERTY layout to Hebrew layout
 * @param text - The text typed in QWERTY layout
 * @returns The converted Hebrew text
 */
export function qwertyToHebrew(text: string): string {
  return text.split('').map(char => QWERTY_TO_HEBREW[char] || char).join('');
}

/**
 * Converts text from Hebrew layout to QWERTY layout
 * @param text - The text typed in Hebrew layout
 * @returns The converted QWERTY text
 */
export function hebrewToQwerty(text: string): string {
  return text.split('').map(char => HEBREW_TO_QWERTY[char] || char).join('');
}

/**
 * Detects if text appears to be typed with wrong keyboard layout
 * @param text - The text to analyze
 * @returns Object with detection results and corrected versions
 */
export function detectKeyboardLayout(text: string): {
  isLikelyWrongLayout: boolean;
  correctedHebrew: string;
  correctedEnglish: string;
  originalText: string;
} {
  if (!text.trim()) {
    return {
      isLikelyWrongLayout: false,
      correctedHebrew: text,
      correctedEnglish: text,
      originalText: text
    };
  }

  // Check if text contains Hebrew characters
  const hasHebrew = /[\u0590-\u05FF]/.test(text);
  
  // Check if text contains English letters
  const hasEnglish = /[a-zA-Z]/.test(text);
  
  // If text has both Hebrew and English, it's likely correct
  if (hasHebrew && hasEnglish) {
    return {
      isLikelyWrongLayout: false,
      correctedHebrew: text,
      correctedEnglish: text,
      originalText: text
    };
  }

  // If text has only English letters, it might be Hebrew typed in QWERTY
  if (hasEnglish && !hasHebrew) {
    const correctedHebrew = qwertyToHebrew(text);
    const hasCorrectedHebrew = /[\u0590-\u05FF]/.test(correctedHebrew);
    
    if (hasCorrectedHebrew) {
      return {
        isLikelyWrongLayout: true,
        correctedHebrew,
        correctedEnglish: text,
        originalText: text
      };
    }
  }

  // If text has only Hebrew, it might be English typed in Hebrew layout
  if (hasHebrew && !hasEnglish) {
    const correctedEnglish = hebrewToQwerty(text);
    const hasCorrectedEnglish = /[a-zA-Z]/.test(correctedEnglish);
    
    if (hasCorrectedEnglish) {
      return {
        isLikelyWrongLayout: true,
        correctedHebrew: text,
        correctedEnglish,
        originalText: text
      };
    }
  }

  return {
    isLikelyWrongLayout: false,
    correctedHebrew: text,
    correctedEnglish: text,
    originalText: text
  };
}

/**
 * Generates search terms for both original and corrected layouts
 * @param text - The search text
 * @returns Array of search terms to try
 */
export function generateSearchTerms(text: string): string[] {
  const layout = detectKeyboardLayout(text);
  const terms = [text]; // Always include original text
  
  if (layout.isLikelyWrongLayout) {
    // Add the corrected version
    if (layout.correctedHebrew !== text) {
      terms.push(layout.correctedHebrew);
    }
    if (layout.correctedEnglish !== text) {
      terms.push(layout.correctedEnglish);
    }
  }
  
  return [...new Set(terms)]; // Remove duplicates
} 