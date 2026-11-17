import math
from PIL import Image, ImageDraw
from .base_renderer import create_background, get_font, draw_arrow, WIDTH, HEIGHT

def render_heat_frame(scene_data: dict, topic_data: dict, scene_progress: float, t: float) -> Image.Image:
    """
    Renders vector animation frame for Class 7 Science: 'ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ ವರ್ಗಾವಣೆ' (Heat Transfer).
    Features conduction gradient, convection current loops, and solar radiation with full Kannada typography.
    """
    scene_id = scene_data.get("id", "")
    scene_title = scene_data.get("title", "ಉಷ್ಣ")
    topic_title = "ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ (Heat Transfer)"

    img, draw = create_background(topic_title, 7, scene_title, scene_progress, lang="kn")

    font_title = get_font(24, bold=True, lang="kn")
    font_sub = get_font(18, bold=True, lang="kn")
    font_body = get_font(16, bold=False, lang="kn")
    font_label = get_font(14, bold=True, lang="kn")
    font_formula = get_font(20, bold=True, lang="en")

    # =========================================================================
    # SCENE 1: Introduction to Heat vs Temperature (ಉಷ್ಣ ಮತ್ತು ತಾಪಮಾನ)
    # =========================================================================
    if "intro" in scene_id:
        draw.text((100, 100), "ಉಷ್ಣ: ಶಕ್ತಿಯ ರೂಪ (Heat: Form of Energy)", fill=(245, 158, 11), font=font_title)
        draw.text((100, 135), "ಹೆಚ್ಚು ತಾಪಮಾನದ ವಸ್ತುವಿನಿಂದ ಕಡಿಮೆ ತಾಪಮಾನದ ವಸ್ತುವಿಗೆ ಹರಿಯುವಿಕೆ", fill=(148, 163, 184), font=font_body)

        # Hot Body (Box 1)
        draw.rounded_rectangle([(180, 240), (420, 480)], radius=16, fill=(239, 68, 68), outline=(254, 202, 202), width=3)
        draw.text((230, 280), "ಬಿಸಿ ವಸ್ತು", fill=(255, 255, 255), font=font_sub)
        draw.text((210, 320), "(ಹೆಚ್ಚು ತಾಪಮಾನ)", fill=(254, 226, 226), font=font_label)
        draw.text((260, 390), "80°C", fill=(255, 255, 255), font=font_formula)

        # Cold Body (Box 2)
        draw.rounded_rectangle([(860, 240), (1100, 480)], radius=16, fill=(59, 130, 246), outline=(191, 219, 254), width=3)
        draw.text((910, 280), "ತಂಪಾದ ವಸ್ತು", fill=(255, 255, 255), font=font_sub)
        draw.text((890, 320), "(ಕಡಿಮೆ ತಾಪಮಾನ)", fill=(219, 234, 254), font=font_label)
        draw.text((940, 390), "20°C", fill=(255, 255, 255), font=font_formula)

        # Heat Flow Vector Arrow
        arrow_len = int(340 * scene_progress)
        if arrow_len > 10:
            arrow_color = (251, 191, 36)
            draw_arrow(draw, (440, 360), (440 + arrow_len, 360), color=arrow_color, width=8, label="ಉಷ್ಣ ಶಕ್ತಿ ಹರಿವು (Heat Energy Flow)")

        # Bottom explanatory badge
        draw.rounded_rectangle([(250, 560), (1030, 630)], radius=12, fill=(30, 41, 59), outline=(71, 85, 105))
        draw.text((280, 580), "💡 ಉಷ್ಣ ಯಾವಾಗಲೂ ಬಿಸಿಯಿಂದ ತಂಪಿನ ಕಡೆಗೆ ಹರಿಯುತ್ತದೆ (Heat flows naturally)", fill=(226, 232, 240), font=font_sub)

    # =========================================================================
    # SCENE 2: Conduction (ವಹನ ಕ್ರಿಯೆ)
    # =========================================================================
    elif "conduction" in scene_id:
        draw.text((100, 100), "1. ವಹನ ಕ್ರಿಯೆ (Conduction in Solids)", fill=(239, 68, 68), font=font_title)
        draw.text((100, 135), "ಘನವಸ್ತುಗಳಲ್ಲಿ ಕಣಗಳ ಪರಸ್ಪರ ಕಂಪನದಿಂದ ಉಷ್ಣ ವರ್ಗಾವಣೆ", fill=(148, 163, 184), font=font_body)

        rod_x1, rod_y1 = 300, 340
        rod_w, rod_h = 680, 50

        # Metal Rod with progressive heat gradient
        steps = 40
        step_w = rod_w / steps
        for i in range(steps):
            frac = i / steps
            # Color interpolates from bright red (hot) to steel blue (cold)
            r = int(239 * (1.0 - frac) + 71 * frac)
            g = int(68 * (1.0 - frac) + 85 * frac)
            b = int(68 * (1.0 - frac) + 105 * frac)
            x_start = rod_x1 + i * step_w
            draw.rectangle([(x_start, rod_y1), (x_start + step_w + 1, rod_y1 + rod_h)], fill=(r, g, b))

        draw.rectangle([(rod_x1, rod_y1), (rod_x1 + rod_w, rod_y1 + rod_h)], outline=(203, 213, 225), width=2)

        # Flame at burner end
        flame_x, flame_y = 260, 410
        flame_anim = 8 * math.sin(scene_progress * 15)
        draw.polygon([
            (flame_x, flame_y),
            (flame_x + 35, flame_y - 65 + flame_anim),
            (flame_x + 70, flame_y),
            (flame_x + 55, flame_y + 15),
            (flame_x + 15, flame_y + 15),
        ], fill=(245, 158, 11))
        draw.polygon([
            (flame_x + 12, flame_y),
            (flame_x + 35, flame_y - 45 + flame_anim * 0.7),
            (flame_x + 58, flame_y),
        ], fill=(239, 68, 68))

        draw.text((230, 440), "ಉರಿಯುವ ಜ್ವಾಲೆ", fill=(251, 191, 36), font=font_label)
        draw.text((250, 290), "ಬಿಸಿ ತುದಿ (100°C)", fill=(248, 113, 113), font=font_label)
        draw.text((880, 290), "ತಂಪು ತುದಿ (25°C)", fill=(147, 197, 253), font=font_label)

        # Microscopic vibrating atoms representation
        draw.text((300, 480), "ಕಣಗಳ ಸೂಕ್ಷ್ಮ ನೋಟ (Atoms pass vibration without shifting position):", fill=(203, 213, 225), font=font_label)
        for i in range(12):
            atom_x = 340 + i * 55
            atom_y = 540 + int(4 * math.sin(scene_progress * 20 + i))
            heat_val = max(0.0, 1.0 - (i / 12))
            c_r = int(239 * heat_val + 59 * (1.0 - heat_val))
            c_g = int(68 * heat_val + 130 * (1.0 - heat_val))
            c_b = int(68 * heat_val + 246 * (1.0 - heat_val))
            draw.ellipse([(atom_x - 14, atom_y - 14), (atom_x + 14, atom_y + 14)], fill=(c_r, c_g, c_b), outline=(255, 255, 255))

    # =========================================================================
    # SCENE 3: Convection (ಸಂವಹನ ಕ್ರಿಯೆ)
    # =========================================================================
    elif "convection" in scene_id:
        draw.text((100, 100), "2. ಸಂವಹನ ಕ್ರಿಯೆ (Convection in Fluids)", fill=(59, 130, 246), font=font_title)
        draw.text((100, 135), "ದ್ರವ ಮತ್ತು ಅನಿಲಗಳಲ್ಲಿ ಕಣಗಳ ನೈಜ ಚಲನೆಯಿಂದ ಉಷ್ಣ ವರ್ಗಾವಣೆ", fill=(148, 163, 184), font=font_body)

        # Boiling Beaker
        bx1, by1, bx2, by2 = 460, 240, 820, 520
        # Beaker Glass
        draw.rectangle([(bx1, by1), (bx2, by2)], outline=(203, 213, 225), width=4)
        # Water Fluid inside
        draw.rectangle([(bx1 + 4, by1 + 50), (bx2 - 4, by2 - 4)], fill=(30, 58, 138, 180))

        # Heat source below
        draw.polygon([(610, 580), (640, 530), (670, 580)], fill=(239, 68, 68))
        draw.text((615, 590), "ಶಾಖ (Heat)", fill=(251, 191, 36), font=font_label)

        # Rising Warm Liquid Stream (Center Upwards)
        flow_offset = int((scene_progress * 200) % 180)
        draw_arrow(draw, (640, by2 - 20 - flow_offset), (640, max(by1 + 70, by2 - 120 - flow_offset)), color=(239, 68, 68), width=6)

        # Descending Cool Liquid Streams (Sides Downwards)
        draw_arrow(draw, (520, by1 + 90 + flow_offset), (520, min(by2 - 30, by1 + 190 + flow_offset)), color=(96, 165, 250), width=5)
        draw_arrow(draw, (760, by1 + 90 + flow_offset), (760, min(by2 - 30, by1 + 190 + flow_offset)), color=(96, 165, 250), width=5)

        draw.text((580, 205), "ಬಿಸಿಯಾದ ನೀರು ಮೇಲಕ್ಕೆ", fill=(248, 113, 113), font=font_label)
        draw.text((310, 360), "ತಂಪಾದ ನೀರು ಕೆಳಕ್ಕೆ", fill=(147, 197, 253), font=font_label)
        draw.text((840, 360), "ಸಂವಹನ ಪ್ರವಾಹಗಳು", fill=(147, 197, 253), font=font_label)

    # =========================================================================
    # SCENE 4: Radiation (ವಿಕಿರಣ ಕ್ರಿಯೆ)
    # =========================================================================
    elif "radiation" in scene_id:
        draw.text((100, 100), "3. ವಿಕಿರಣ ಕ್ರಿಯೆ (Radiation)", fill=(234, 179, 8), font=font_title)
        draw.text((100, 135), "ಯಾವುದೇ ಮಾಧ್ಯಮವಿಲ್ಲದೆ ವಿದ್ಯುತ್ಕಾಂತೀಯ ತರಂಗಗಳ ಮೂಲಕ ಉಷ್ಣ ವರ್ಗಾವಣೆ", fill=(148, 163, 184), font=font_body)

        # Sun (Top-Left)
        sun_x, sun_y, sun_r = 240, 320, 65
        draw.ellipse([(sun_x - sun_r, sun_y - sun_r), (sun_x + sun_r, sun_y + sun_r)], fill=(245, 158, 11), outline=(253, 224, 71), width=4)
        draw.text((sun_x - 30, sun_y - 10), "ಸೂರ್ಯ (Sun)", fill=(255, 255, 255), font=font_label)

        # Earth / Ground (Bottom-Right)
        gx1, gy1, gx2, gy2 = 820, 400, 1120, 560
        draw.rectangle([(gx1, gy1), (gx2, gy2)], fill=(16, 185, 129), outline=(52, 211, 153), width=3)
        draw.text((gx1 + 70, gy1 + 60), "ಭೂಮಿ (Earth)", fill=(255, 255, 255), font=font_sub)

        # Radiant Wave Rays in Vacuum
        ray_count = 5
        for i in range(ray_count):
            start_x = sun_x + sun_r + 10
            start_y = sun_y - 40 + i * 25
            target_x = gx1 - 10
            target_y = gy1 - 20 + i * 30
            curr_x = start_x + int((target_x - start_x) * scene_progress)
            curr_y = start_y + int((target_y - start_y) * scene_progress)
            draw_arrow(draw, (start_x, start_y), (curr_x, curr_y), color=(250, 204, 21), width=3)

        draw.rounded_rectangle([(420, 230), (740, 290)], radius=8, fill=(30, 41, 59))
        draw.text((450, 250), "ಶೂನ್ಯ ಪ್ರದೇಶ (Vacuum / Space)", fill=(148, 163, 184), font=font_label)

        draw.rounded_rectangle([(250, 580), (1030, 640)], radius=10, fill=(30, 41, 59), outline=(71, 85, 105))
        draw.text((280, 600), "✨ ವಿಕಿರಣಕ್ಕೆ ಘನ, ದ್ರವ ಅಥವಾ ಅನಿಲ ಮಾಧ್ಯಮದ ಅಗತ್ಯವಿರುವುದಿಲ್ಲ", fill=(253, 224, 71), font=font_label)

    # =========================================================================
    # SCENE 5: Everyday Rural Applications (ಹಳ್ಳಿಯ ದೈನಂದಿನ ಜೀವನದಲ್ಲಿ ಉಷ್ಣ)
    # =========================================================================
    else:
        draw.text((100, 100), "ದೈನಂದಿನ ಗ್ರಾಮೀಣ ಅನ್ವಯಗಳು (Everyday Village Science)", fill=(16, 185, 129), font=font_title)
        draw.text((100, 135), "ಹಳ್ಳಿಯ ಮನೆಗಳಲ್ಲಿ, ಮಡಕೆಗಳಲ್ಲಿ ಮತ್ತು ಅಡುಗೆಯಲ್ಲಿ ಉಷ್ಣದ ಪಾತ್ರ", fill=(148, 163, 184), font=font_body)

        # Card 1: Earthen Clay Pot (ಮಣ್ಣಿನ ಮಡಕೆ)
        draw.rounded_rectangle([(140, 220), (600, 520)], radius=16, fill=(30, 41, 59), outline=(52, 211, 153), width=2)
        draw.text((180, 250), "1. ಮಣ್ಣಿನ ಮಡಕೆಯ ತಂಪು ನೀರು", fill=(52, 211, 153), font=font_sub)
        draw.text((180, 290), "• ಮಡಕೆಯ ಸೂಕ್ಷ್ಮ ರಂಧ್ರಗಳಿಂದ ನೀರು ಆವಿಯಾಗುತ್ತದೆ.", fill=(226, 232, 240), font=font_body)
        draw.text((180, 330), "• ಆವೀಕರಣಕ್ಕೆ ಬೇಕಾದ ಉಷ್ಣವನ್ನು ನೀರಿನಿಂದಲೇ", fill=(226, 232, 240), font=font_body)
        draw.text((180, 370), "  ಪಡೆಯುವುದರಿಂದ ನೀರು ಸದಾ ತಂಪಾಗಿರುತ್ತದೆ.", fill=(226, 232, 240), font=font_body)
        draw.text((180, 430), "🔬 ನೈಸರ್ಗಿಕ ಶೀತಲೀಕರಣ (Evaporative Cooling)", fill=(251, 191, 36), font=font_label)

        # Card 2: Village Tile Houses & Ventilation (ಹಂಚಿನ ಮನೆಗಳು)
        draw.rounded_rectangle([(680, 220), (1140, 520)], radius=16, fill=(30, 41, 59), outline=(96, 165, 250), width=2)
        draw.text((720, 250), "2. ಹಂಚಿನ ಮನೆಗಳಲ್ಲಿ ನೈಸರ್ಗಿಕ ಗಾಳಿ", fill=(96, 165, 250), font=font_sub)
        draw.text((720, 290), "• ಕೋಣೆಯೊಳಗಿನ ಬಿಸಿಯಾದ ಹಗುರ ಗಾಳಿಯು", fill=(226, 232, 240), font=font_body)
        draw.text((720, 330), "  ಹಂಚುಗಳ ಸಂದುಗಳ ಮೂಲಕ ಮೇಲಕ್ಕೆ ಹೋಗುತ್ತದೆ.", fill=(226, 232, 240), font=font_body)
        draw.text((720, 370), "• ಕಿಟಕಿಗಳಿಂದ ತಂಪಾದ ತಾಜಾ ಗಾಳಿ ಒಳಬರುತ್ತದೆ.", fill=(226, 232, 240), font=font_body)
        draw.text((720, 430), "🔬 ನೈಸರ್ಗಿಕ ಸಂವಹನ ಪ್ರವಾಹ (Natural Convection)", fill=(251, 191, 36), font=font_label)

        # Summary takeaway pill
        draw.rounded_rectangle([(240, 560), (1040, 620)], radius=10, fill=(16, 185, 129))
        draw.text((270, 578), "✅ ಉಷ್ಣದ 3 ವಿಧಾನಗಳು: ವಹನ (ಘನ), ಸಂವಹನ (ದ್ರವ/ಅನಿಲ), ವಿಕಿರಣ (ಶೂನ್ಯ)", fill=(15, 23, 42), font=font_sub)

    return img
