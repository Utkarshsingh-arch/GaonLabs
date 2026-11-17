import math
from PIL import Image, ImageDraw
from .base_renderer import create_background, draw_arrow, get_font, WIDTH, HEIGHT

def render_friction_frame(scene_spec: dict, topic_data: dict, progress: float, t: float) -> Image.Image:
    """
    Renders moving physics frames for Class 8 Science 'Exploring Forces and Friction'.
    Explicitly animates:
    1. Crate moving across ground with velocity v ->
    2. Microscopic surface interlocking ridges
    3. Opposing friction force vector <- f appearing
    4. Gradual deceleration to rest (v -> 0)
    5. Lubricant layer and rolling wheel reduction
    6. Concluding takeaways
    """
    scene_id = scene_spec.get("sceneId", "")
    scene_title = scene_spec.get("title", "")
    img, draw = create_background("Exploring Forces and Friction", 8, scene_title, progress)

    font_h1 = get_font(28, bold=True)
    font_body = get_font(20, bold=False)
    font_label = get_font(18, bold=True)
    font_formula = get_font(22, bold=True)

    ground_y = 520

    # Draw Common Ground
    def draw_ground(surface_label: str = "Rough Ground Surface"):
        draw.rectangle([(80, ground_y), (WIDTH - 80, ground_y + 120)], fill=(30, 41, 59))
        draw.line([(80, ground_y), (WIDTH - 80, ground_y)], fill=(100, 116, 139), width=4)
        for gx in range(100, WIDTH - 100, 40):
            draw.line([(gx, ground_y + 4), (gx - 20, ground_y + 30)], fill=(71, 85, 105), width=2)
        draw.text((WIDTH - 380, ground_y + 40), surface_label, fill=(148, 163, 184), font=font_label)

    if scene_id == "scene-1-moving-object":
        draw_ground()
        draw.text((80, 120), "1. Applied Force & Initial Motion", fill=(59, 130, 246), font=font_h1)
        draw.text((80, 170), "An external push accelerates the crate across the surface.", fill=(241, 245, 249), font=font_body)

        # Crate moves steadily from x=200 to x=600
        crate_x = int(180 + 440 * progress)
        crate_y = ground_y - 120
        crate_w, crate_h = 160, 120

        # Draw wooden crate with woodgrain slats
        draw.rectangle([(crate_x, crate_y), (crate_x + crate_w, crate_y + crate_h)], fill=(180, 83, 9), outline=(251, 191, 36), width=3)
        draw.line([(crate_x, crate_y + 40), (crate_x + crate_w, crate_y + 40)], fill=(146, 64, 14), width=2)
        draw.line([(crate_x, crate_y + 80), (crate_x + crate_w, crate_y + 80)], fill=(146, 64, 14), width=2)
        draw.line([(crate_x, crate_y), (crate_x + crate_w, crate_y + crate_h)], fill=(146, 64, 14), width=2)
        draw.text((crate_x + 35, crate_y + 48), "CRATE (m)", fill=(255, 255, 255), font=font_label)

        # Applied force vector pushing right
        draw_arrow(draw, (crate_x - 140, crate_y + 60), (crate_x - 10, crate_y + 60), color=(16, 185, 129), width=5, label="F_push →")
        # Velocity vector
        draw_arrow(draw, (crate_x + crate_w + 10, crate_y + 60), (crate_x + crate_w + 130, crate_y + 60), color=(59, 130, 246), width=5, label="v →")

    elif scene_id == "scene-2-surface-nature":
        draw.text((80, 120), "2. The Microscopic Cause: Asperities", fill=(245, 158, 11), font=font_h1)
        draw.text((80, 170), "Surfaces are NOT flat; microscopic peaks (asperities) cover both bodies.", fill=(241, 245, 249), font=font_body)

        # Magnified microscopic view window
        zoom_cx, zoom_cy = WIDTH // 2, 420
        zw, zh = 900, 260
        draw.rounded_rectangle([(zoom_cx - zw // 2, zoom_cy - zh // 2), (zoom_cx + zw // 2, zoom_cy + zh // 2)], radius=16, fill=(15, 23, 42), outline=(245, 158, 11), width=4)

        # Top surface (Crate bottom) - moving right
        top_y = zoom_cy - 10
        top_pts = [(zoom_cx - zw // 2 + 10, zoom_cy - zh // 2 + 10)]
        for x in range(zoom_cx - zw // 2 + 10, zoom_cx + zw // 2 - 10, 25):
            wave_y = top_y - 25 - int(20 * math.sin((x - progress * 80) * 0.12))
            top_pts.append((x, wave_y))
        top_pts.append((zoom_cx + zw // 2 - 10, zoom_cy - zh // 2 + 10))
        draw.polygon(top_pts, fill=(180, 83, 9))
        draw.text((zoom_cx - 400, top_y - 70), "Microscopic Bottom of Wooden Crate", fill=(253, 230, 138), font=font_label)

        # Bottom surface (Ground) - static
        bot_pts = [(zoom_cx - zw // 2 + 10, zoom_cy + zh // 2 - 10)]
        for x in range(zoom_cx - zw // 2 + 10, zoom_cx + zw // 2 - 10, 25):
            wave_y = top_y + 25 + int(20 * math.sin(x * 0.12 + 1.2))
            bot_pts.append((x, wave_y))
        bot_pts.append((zoom_cx + zw // 2 - 10, zoom_cy + zh // 2 - 10))
        draw.polygon(bot_pts, fill=(71, 85, 105))
        draw.text((zoom_cx - 400, top_y + 80), "Microscopic Rough Ground Irregularities", fill=(203, 213, 225), font=font_label)

        # Zoom lens indicator
        draw.text((zoom_cx + 260, zoom_cy - zh // 2 + 20), "500× Magnification", fill=(245, 158, 11), font=font_label)

    elif scene_id == "scene-3-opposing-force":
        draw_ground()
        draw.text((80, 120), "3. Frictional Resistance Vector Appears", fill=(239, 68, 68), font=font_h1)
        draw.text((80, 170), "Interlocking teeth create a reaction force pointing in the opposite direction.", fill=(241, 245, 249), font=font_body)

        crate_x = 520
        crate_y = ground_y - 120
        crate_w, crate_h = 160, 120

        # Draw crate
        draw.rectangle([(crate_x, crate_y), (crate_x + crate_w, crate_y + crate_h)], fill=(180, 83, 9), outline=(251, 191, 36), width=3)
        draw.text((crate_x + 35, crate_y + 48), "CRATE (m)", fill=(255, 255, 255), font=font_label)

        # Forward velocity vector
        draw_arrow(draw, (crate_x + crate_w + 10, crate_y + 50), (crate_x + crate_w + 110, crate_y + 50), color=(59, 130, 246), width=4, label="v →")

        # Opposing friction vector (animates expanding leftwards!)
        f_len = int(140 * min(1.0, progress * 1.8))
        draw_arrow(draw, (crate_x - 10, ground_y - 10), (crate_x - 10 - f_len, ground_y - 10), color=(239, 68, 68), width=6, label="← f_friction")

        # Contact interface highlight
        pulse_alpha = int(255 * abs(math.sin(t * 5.0)))
        draw.line([(crate_x - 20, ground_y), (crate_x + crate_w + 20, ground_y)], fill=(248, 113, 113), width=6)
        draw.text((crate_x - 120, ground_y + 40), "Contact Interface: Interlocking Resists Slide", fill=(248, 113, 113), font=font_label)

    elif scene_id == "scene-4-gradual-slowing":
        draw_ground()
        draw.text((80, 120), "4. Deceleration to Rest (Newton's 1st Law)", fill=(168, 85, 247), font=font_h1)
        draw.text((80, 170), "Because the net force f is opposite to motion, acceleration a = -f/m brings v to zero.", fill=(241, 245, 249), font=font_body)

        # Smooth deceleration curve: x(t) = x0 + v0*t - 0.5*a*t^2
        decel_factor = 1.0 - (1.0 - progress) ** 2
        crate_x = int(200 + 620 * decel_factor)
        crate_y = ground_y - 120
        crate_w, crate_h = 160, 120

        # Draw crate
        draw.rectangle([(crate_x, crate_y), (crate_x + crate_w, crate_y + crate_h)], fill=(180, 83, 9), outline=(251, 191, 36), width=3)
        draw.text((crate_x + 35, crate_y + 48), "CRATE (m)", fill=(255, 255, 255), font=font_label)

        # Speed indicator bar
        remaining_v = max(0.0, 1.0 - progress)
        v_arrow_len = int(120 * remaining_v)
        if v_arrow_len > 15:
            draw_arrow(draw, (crate_x + crate_w + 10, crate_y + 60), (crate_x + crate_w + 10 + v_arrow_len, crate_y + 60), color=(59, 130, 246), width=4, label=f"v = {remaining_v * 5:.1f} m/s")
        else:
            draw.text((crate_x + crate_w + 20, crate_y + 50), "STOPPED (v = 0)", fill=(239, 68, 68), font=font_formula)

        # Ongoing friction arrow while moving
        if remaining_v > 0.05:
            draw_arrow(draw, (crate_x - 10, ground_y - 10), (crate_x - 120, ground_y - 10), color=(239, 68, 68), width=5, label="← f")

    elif scene_id == "scene-5-lubrication-wheels":
        draw_ground()
        draw.text((80, 120), "5. Minimizing Friction: Lubricants & Wheels", fill=(34, 197, 94), font=font_h1)
        draw.text((80, 170), "Lubricants create fluid cushions; wheels transform sliding into rolling friction.", fill=(241, 245, 249), font=font_body)

        # Left side: Lubricated sliding
        lx = 220
        draw.rectangle([(lx, ground_y - 90), (lx + 140, ground_y - 10)], fill=(180, 83, 9), outline=(251, 191, 36), width=2)
        # Liquid oil layer (blue/amber glowing line)
        draw.rectangle([(lx - 20, ground_y - 10), (lx + 160, ground_y)], fill=(56, 189, 248))
        draw.text((lx - 10, ground_y - 120), "Oil / Grease Layer", fill=(56, 189, 248), font=font_label)
        draw.text((lx + 15, ground_y - 55), "Smooth Gliding", fill=(255, 255, 255), font=font_label)

        # Right side: Rolling Wheel
        rx = 780
        wheel_r = 60
        rot_angle = t * 6.0
        draw.ellipse([(rx - wheel_r, ground_y - 2 * wheel_r), (rx + wheel_r, ground_y)], outline=(245, 158, 11), width=6, fill=(30, 41, 59))
        for i in range(4):
            sa = rot_angle + i * (math.pi / 2)
            draw.line([(rx, ground_y - wheel_r), (rx + int(wheel_r * math.cos(sa)), ground_y - wheel_r + int(wheel_r * math.sin(sa)))], fill=(245, 158, 11), width=3)
        draw.text((rx - 70, ground_y - 2 * wheel_r - 35), "Rolling Resistance << Sliding", fill=(34, 197, 94), font=font_label)
        draw.text((rx - 85, ground_y + 40), "Bullock Cart Wheels & Bearings", fill=(203, 213, 225), font=font_label)

    else:
        # scene-6-conclusion: Summary
        draw.text((WIDTH // 2 - 250, 120), "Core Principles: Forces and Friction", fill=(255, 255, 255), font=font_h1)

        cards = [
            ("Direction", "Always opposes relative motion parallel to the surface.", (59, 130, 246)),
            ("Cause", "Interlocking of microscopic ridges (surface asperities).", (245, 158, 11)),
            ("Hierarchy", "Static Friction > Sliding Friction > Rolling Friction.", (168, 85, 247)),
            ("Application", "Lubricate machinery to save fuel; maintain tire treads for grip.", (34, 197, 94)),
        ]

        cy = 200
        for title, desc, col in cards:
            draw.rounded_rectangle([(180, cy), (WIDTH - 180, cy + 90)], radius=12, fill=(30, 41, 59), outline=col, width=3)
            draw.text((210, cy + 16), title, fill=col, font=font_h1)
            draw.text((210, cy + 54), desc, fill=(241, 245, 249), font=font_body)
            cy += 115

    return img
