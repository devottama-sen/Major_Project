/**
 * arUtils.js
 *
 * AR Vector math, camera transformation, compass bearing, and turn calculations
 * for WebAR / Google ARCore indoor navigation.
 */

export const SCALE_METERS = 0.05; // 1 pixel unit = 0.05 meters (~20 px = 1 meter)

/**
 * Calculates bearing angle in degrees (0 to 360) from node A to node B
 */
export function calculateBearing(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Canvas Y grows downward, so angle calculation accounts for SVG/Canvas orient
  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;
  return angleDeg;
}

/**
 * Transform 2D node coordinates relative to user position & device heading
 * into 3D camera relative coordinates [X, Y, Z] for Three.js
 */
export function nodeTo3DPosition(userNode, targetNode, headingDeg = 0) {
  const dx = (targetNode.x - userNode.x) * SCALE_METERS;
  const dy = (targetNode.y - userNode.y) * SCALE_METERS;

  // Convert heading to radians (0 deg = North / forward)
  const rad = (headingDeg * Math.PI) / 180;
  
  // Rotate world delta by user heading
  const relX = dx * Math.cos(rad) - dy * Math.sin(rad);
  const relZ = -(dx * Math.sin(rad) + dy * Math.cos(rad)); // Z negative is forward in Three.js

  return {
    x: relX,
    y: 0, // Ground level
    z: relZ,
    distanceMeters: Math.hypot(dx, dy),
  };
}

/**
 * Text-to-Speech voice prompt helper for AR guidance
 */
export function speakInstruction(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel(); // stop previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn("Speech synthesis unavailable:", e);
  }
}

/**
 * Formats turn direction icons / labels
 */
export function getActionIconSvg(action) {
  switch (action) {
    case 'TURN_LEFT':
    case 'SLIGHT_LEFT':
    case 'SHARP_LEFT':
      return '⬅️';
    case 'TURN_RIGHT':
    case 'SLIGHT_RIGHT':
    case 'SHARP_RIGHT':
      return '➡️';
    case 'LIFT':
      return '🛗';
    case 'STAIRS':
      return '🪜';
    case 'ARRIVED':
      return '🎯';
    default:
      return '⬆️';
  }
}
