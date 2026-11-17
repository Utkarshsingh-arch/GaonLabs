/**
 * GaonLab Experiment Studio — Authoritative Chemistry Simulation Engine
 * Scientifically validated sample-testing model and indicator equilibria.
 * Covers Class 8 NCERT Acid-Base-Salt indicators and representative reference values.
 */

export type IndicatorForm = 'PAPER_STRIP' | 'LIQUID_REAGENT';

export interface IndicatorMetadata {
  id: string;
  name: string;
  form: IndicatorForm;
  transitionPhRange: string;
}

export const INDICATOR_METADATA: Record<string, IndicatorMetadata> = {
  TURMERIC: {
    id: 'TURMERIC',
    name: 'Turmeric Natural Indicator',
    form: 'LIQUID_REAGENT',
    transitionPhRange: 'pH > 7.5 (Yellow in acid/neutral, deep reddish-brown in alkali)',
  },
  RED_LITMUS: {
    id: 'RED_LITMUS',
    name: 'Red Litmus Paper',
    form: 'PAPER_STRIP',
    transitionPhRange: 'pH > 7.0 (Stays red in acid/neutral, turns blue in alkali)',
  },
  BLUE_LITMUS: {
    id: 'BLUE_LITMUS',
    name: 'Blue Litmus Paper',
    form: 'PAPER_STRIP',
    transitionPhRange: 'pH < 7.0 (Turns red in acid, stays blue in neutral/alkali)',
  },
  PHENOLPHTHALEIN: {
    id: 'PHENOLPHTHALEIN',
    name: 'Phenolphthalein Reagent',
    form: 'LIQUID_REAGENT',
    transitionPhRange: 'pH 8.2–10.0 (Colorless in acid/neutral, faint pink in mild base, vivid magenta in strong alkali)',
  },
  CHINA_ROSE: {
    id: 'CHINA_ROSE',
    name: 'China Rose (Hibiscus) Extract',
    form: 'LIQUID_REAGENT',
    transitionPhRange: 'pH < 6.0 (Dark magenta/pink), pH 6.0–8.0 (Pink), pH > 8.0 (Emerald green)',
  },
};

export interface IndicatorObservation {
  colorHex: string;
  colorName: string;
  classification: 'ACID' | 'BASE' | 'NEUTRAL';
  description: string;
  form: IndicatorForm;
}

export class ChemistryEngine {
  /**
   * Returns whether an indicator is dispensed as a liquid reagent or dipped as paper.
   */
  static getIndicatorForm(indicatorId: string): IndicatorForm {
    return INDICATOR_METADATA[indicatorId]?.form || 'LIQUID_REAGENT';
  }

  /**
   * Determine indicator color response based on solution representative pH.
   * Scientifically calibrated for NCERT Class 7/8 benchmarks:
   * - Phenolphthalein transition interval is 8.2 to 10.0.
   *   Weak base (Baking Soda, pH 8.5) produces a delicate pale blush pink (#FBCFE8).
   *   Stronger bases (Soap pH 9.5, Lime Water pH 11.5) produce vivid saturated magenta (#EC4899).
   */
  static getIndicatorColor(indicatorId: string, ph: number): string {
    switch (indicatorId) {
      case 'TURMERIC':
        // Yellow in acid/neutral (pH <= 7.5), Deep Red in base (pH > 7.5)
        return ph > 7.5 ? '#DC2626' : '#FBBF24';

      case 'RED_LITMUS':
        // Stays Red in acid/neutral, Turns Blue in base (pH > 7.0)
        return ph > 7.0 ? '#2563EB' : '#EF4444';

      case 'BLUE_LITMUS':
        // Turns Red in acid (pH < 7.0), Stays Blue in neutral/base (pH >= 7.0)
        return ph < 7.0 ? '#EF4444' : '#3B82F6';

      case 'PHENOLPHTHALEIN':
        // Colorless in acid & neutral (pH <= 8.2)
        if (ph <= 8.2) {
          return 'rgba(255, 255, 255, 0.2)';
        }
        // Subtle pale blush pink in weak alkali (pH 8.2 to 9.0, e.g. Baking Soda pH 8.5)
        if (ph < 9.0) {
          return '#FBCFE8';
        }
        // Vivid magenta/pink in strong alkali (pH >= 9.0, e.g. Soap Water pH 9.5, Lime Water pH 11.5)
        return '#EC4899';

      case 'CHINA_ROSE':
        // Dark magenta in acid (< 6.0), pink in neutral (6.0 - 8.0), emerald green in base (> 8.0)
        if (ph < 6.0) return '#BE185D';
        if (ph > 8.0) return '#059669';
        return '#F472B6';

      default:
        return '#94A3B8';
    }
  }

  /**
   * Get complete scientific observation details including color name and causal explanation.
   */
  static getObservationDetails(
    indicatorId: string,
    ph: number,
    sampleName: string
  ): IndicatorObservation {
    const classification: 'ACID' | 'BASE' | 'NEUTRAL' =
      ph < 7.0 ? 'ACID' : ph > 7.0 ? 'BASE' : 'NEUTRAL';
    const colorHex = this.getIndicatorColor(indicatorId, ph);
    const meta = INDICATOR_METADATA[indicatorId] || {
      id: indicatorId,
      name: indicatorId,
      form: 'LIQUID_REAGENT' as const,
      transitionPhRange: '',
    };

    let colorName = '';
    let description = '';

    switch (indicatorId) {
      case 'TURMERIC':
        if (ph > 7.5) {
          colorName = 'Deep Red';
          description = `${sampleName} turns turmeric deep reddish-brown, confirming an alkaline (basic) sample.`;
        } else {
          colorName = 'Yellow (Unchanged)';
          description = `${sampleName} leaves turmeric yellow, typical of acidic and neutral substances.`;
        }
        break;

      case 'RED_LITMUS':
        if (ph > 7.0) {
          colorName = 'Blue';
          description = `Red litmus paper turns blue in ${sampleName}, confirming an alkaline (basic) sample.`;
        } else {
          colorName = 'Red (Unchanged)';
          description = `Red litmus paper remains red in ${sampleName} (acidic or neutral sample).`;
        }
        break;

      case 'BLUE_LITMUS':
        if (ph < 7.0) {
          colorName = 'Red';
          description = `Blue litmus paper turns red in ${sampleName}, confirming an acidic sample.`;
        } else {
          colorName = 'Blue (Unchanged)';
          description = `Blue litmus paper remains blue in ${sampleName} (neutral or basic sample).`;
        }
        break;

      case 'PHENOLPHTHALEIN':
        if (ph <= 8.2) {
          colorName = 'Colorless (No change)';
          description = `Phenolphthalein remains colorless in ${sampleName} (acidic or neutral sample, pH <= 8.2).`;
        } else if (ph < 9.0) {
          colorName = 'Faint Subtle Pink';
          description = `Phenolphthalein shows a subtle, pale pink tint in ${sampleName} (weakly alkaline sample near transition threshold, pH ~8.5).`;
        } else {
          colorName = 'Vivid Magenta / Deep Pink';
          description = `Phenolphthalein turns vibrant magenta in ${sampleName} (moderately to strongly alkaline sample, pH >= 9.0).`;
        }
        break;

      case 'CHINA_ROSE':
        if (ph < 6.0) {
          colorName = 'Dark Magenta / Pink';
          description = `China Rose extract turns dark magenta in ${sampleName}, identifying an acidic sample.`;
        } else if (ph > 8.0) {
          colorName = 'Emerald Green';
          description = `China Rose extract turns emerald green in ${sampleName}, identifying an alkaline sample.`;
        } else {
          colorName = 'Light Pink (Neutral)';
          description = `China Rose extract retains its natural light pink color in ${sampleName} (neutral sample).`;
        }
        break;

      default:
        colorName = 'Observed';
        description = `Sample tested with ${indicatorId}.`;
    }

    return {
      colorHex,
      colorName,
      classification,
      description,
      form: meta.form,
    };
  }

  /**
   * Compute blended solution color inside the beaker based on indicator addition
   */
  static getBlendedBeakerColor(
    solutionColorHex: string,
    indicatorId: string | null,
    indicatorDrops: number,
    ph: number
  ): string {
    if (!indicatorId || indicatorDrops === 0) {
      return solutionColorHex;
    }

    const indicatorColor = this.getIndicatorColor(indicatorId, ph);

    if (indicatorColor.startsWith('rgba') || indicatorColor === 'transparent') {
      return solutionColorHex;
    }

    // Blend based on number of indicator drops:
    // Delicate pale pink uses lighter saturation; intense magenta/red uses higher saturation
    const maxOpacity = indicatorColor === '#FBCFE8' ? 0.60 : 0.90;
    const opacity = Math.min(0.20 + indicatorDrops * 0.16, maxOpacity);
    return this.hexToRgba(indicatorColor, opacity);
  }

  private static hexToRgba(hex: string, alpha: number): string {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
  }
}
