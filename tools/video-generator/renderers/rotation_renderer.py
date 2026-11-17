import math
from PIL import Image, ImageDraw
from .base_renderer import create_background, draw_arrow, get_font, WIDTH, HEIGHT

def render_rotation_frame(scene_spec: dict, topic_data: dict, progress: float, t: float) -> Image.Image:
    """
    Renders moving physics frames for Class 11 Physics 'Rotational Motion and Moment of Inertia'.
    Explicitly animates:
    1. Fixed-axis spinning disc with uniform angular velocity omega
    2. Torque cross product vector tau = r x F
    3. Moment of inertia comparison (central mass vs outer rim mass)
    4. Rural lever applications (hand pump lever arm and stone chakki rim peg)
    5. Conservation of angular momentum (L = I * omega = const)
    """
    scene_id = scene_spec.get("sceneId", "")
    scene_title = scene_spec.get("title", "")
    img, draw = create_background("Rotational Motion & Inertia", 11, scene_title, progress)

    font_h1 = get_font(28, bold=True)
    font_body = get_font(20, bold=False)
    font_label = get_font(18, bold=True)
    font_formula = get_font(22, bold=True)

    cx, cy = WIDTH // 2 + 180, 410

    if scene_id == "scene-1-rigid-body":
        draw.text((80, 120), "1. Fixed-Axis Rigid Body Rotation", fill=(59, 130, 246), font=font_h1)
        draw.text((80, 170), "Every particle rotates in concentric circles around a common axis.", fill=(241, 245, 249), font=font_body)
        draw.text((80, 210), "Angular displacement θ, Angular velocity ω = dθ/dt.", fill=(148, 163, 184), font=font_body)

        disc_r = 160
        # Spinning disc
        draw.ellipse([(cx - disc_r, cy - disc_r), (cx + disc_r, cy + disc_r)], outline=(59, 130, 246), width=5, fill=(30, 41, 59))
        draw.ellipse([(cx - 8, cy - 8), (cx + 8, cy + 8)], fill=(255, 255, 255))
        draw.text((cx - 65, cy - 25), "Axis (O)", fill=(255, 255, 255), font=font_label)

        # Concentric particle orbits
        for r_orbit in [60, 110, 150]:
            draw.ellipse([(cx - r_orbit, cy - r_orbit), (cx + r_orbit, cy + r_orbit)], outline=(71, 85, 105), width=1)
            # Rotating particles
            angle = t * 3.5 + (r_orbit * 0.1)
            px = cx + int(r_orbit * math.cos(angle))
            py = cy + int(r_orbit * math.sin(angle))
            draw.ellipse([(px - 6, py - 6), (px + 6, py + 6)], fill=(245, 158, 11))
            # Tangential velocity vector
            vx = px - int(35 * math.sin(angle))
            vy = py + int(35 * math.cos(angle))
            draw.line([(px, py), (vx, vy)], fill=(16, 185, 129), width=3)

        # Angular velocity arc
        arc_angle = (t * 4.0) % (2 * math.pi)
        draw.arc([(cx - 80, cy - 80), (cx + 80, cy + 80)], start=0, end=int(math.degrees(arc_angle)), fill=(236, 72, 153), width=4)
        draw.text((cx + 90, cy - 40), "ω (rad/s)", fill=(236, 72, 153), font=font_formula)

    elif scene_id == "scene-2-torque":
        draw.text((80, 120), "2. Torque: The Turning Effect of Force", fill=(245, 158, 11), font=font_h1)
        draw.text((80, 170), "Torque τ = r × F = r · F · sin(θ)", fill=(251, 191, 36), font=font_formula)
        draw.text((80, 215), "Depends directly on lever arm distance r from the axis.", fill=(241, 245, 249), font=font_body)

        pivot_x, pivot_y = 350, 420
        lever_len = 380

        # Pivot point
        draw.ellipse([(pivot_x - 14, pivot_y - 14), (pivot_x + 14, pivot_y + 14)], fill=(239, 68, 68))
        draw.text((pivot_x - 70, pivot_y + 20), "Pivot (Axis)", fill=(239, 68, 68), font=font_label)

        # Lever bar
        lever_angle = -math.pi / 8 + 0.15 * math.sin(t * 2.0)
        end_x = pivot_x + int(lever_len * math.cos(lever_angle))
        end_y = pivot_y + int(lever_len * math.sin(lever_angle))

        draw.line([(pivot_x, pivot_y), (end_x, end_y)], fill=(148, 163, 184), width=10)
        draw.text(((pivot_x + end_x) // 2 - 40, (pivot_y + end_y) // 2 - 25), "Lever Arm (r)", fill=(59, 130, 246), font=font_label)

        # Applied Force vector perpendicular to lever
        force_len = 130
        force_end_x = end_x + int(force_len * math.sin(lever_angle))
        force_end_y = end_y - int(force_len * math.cos(lever_angle))
        draw_arrow(draw, (end_x, end_y), (force_end_x, force_end_y), color=(16, 185, 129), width=6, label="Applied Force (F) →")

        # Resulting Torque Indicator
        draw.text((pivot_x + 60, pivot_y - 110), "Turning Effect: τ = r × F", fill=(245, 158, 11), font=font_formula)

    elif scene_id == "scene-3-moment-of-inertia":
        draw.text((80, 120), "3. Moment of Inertia: Mass Distribution", fill=(168, 85, 247), font=font_h1)
        draw.text((80, 170), "I = Σ mᵢ rᵢ²  — Distance from axis matters quadratically!", fill=(192, 132, 252), font=font_formula)

        # Case A: Mass concentrated near center
        d1_x = 360
        draw.ellipse([(d1_x - 110, cy - 110), (d1_x + 110, cy + 110)], outline=(71, 85, 105), width=3, fill=(30, 41, 59))
        draw.ellipse([(d1_x - 45, cy - 45), (d1_x + 45, cy + 45)], fill=(59, 130, 246))
        draw.text((d1_x - 70, cy + 130), "Low Inertia (I_low)\nSpins easily with light torque", fill=(59, 130, 246), font=font_label)

        # Case B: Mass concentrated at outer rim (Flywheel)
        d2_x = 880
        draw.ellipse([(d2_x - 110, cy - 110), (d2_x + 110, cy + 110)], outline=(239, 68, 68), width=16, fill=(30, 41, 59))
        draw.text((d2_x - 80, cy + 130), "High Inertia (I_high)\nResists speed changes", fill=(239, 68, 68), font=font_label)

    elif scene_id == "scene-4-village-applications":
        draw.text((80, 120), "4. Rural Mechanical Engineering: Maximizing r", fill=(34, 197, 94), font=font_h1)
        draw.text((80, 170), "Placing the turning handle at the outer edge minimizes muscular force required.", fill=(241, 245, 249), font=font_body)

        # Grinding Stone (Chakki) diagram
        ck_x = 420
        ck_r = 130
        draw.ellipse([(ck_x - ck_r, cy - ck_r // 2), (ck_x + ck_r, cy + ck_r // 2)], fill=(100, 116, 139), outline=(203, 213, 225), width=4)
        draw.ellipse([(ck_x - 18, cy - 9), (ck_x + 18, cy + 9)], fill=(15, 23, 42))

        # Handle placed at outer rim!
        peg_angle = t * 2.5
        peg_x = ck_x + int((ck_r - 20) * math.cos(peg_angle))
        peg_y = cy + int((ck_r // 2 - 10) * math.sin(peg_angle))
        draw.rectangle([(peg_x - 8, peg_y - 45), (peg_x + 8, peg_y)], fill=(180, 83, 9), outline=(251, 191, 36), width=2)
        draw.text((ck_x - 110, cy + 95), "Flour Mill (Chakki): Handle at rim (r_max)", fill=(245, 158, 11), font=font_label)

        # Hand Pump diagram
        hp_x = 920
        draw.line([(hp_x, cy + 80), (hp_x, cy - 80)], fill=(71, 85, 105), width=16)
        pump_angle = 0.2 * math.sin(t * 3.0)
        draw.line([(hp_x - 40, cy - 60), (hp_x + int(240 * math.cos(pump_angle)), cy - 60 + int(240 * math.sin(pump_angle)))], fill=(16, 185, 129), width=8)
        draw.text((hp_x - 40, cy + 95), "Hand Pump: Long handle = Huge Torque", fill=(16, 185, 129), font=font_label)

    else:
        # scene-5-angular-momentum: Conservation summary
        draw.text((WIDTH // 2 - 280, 120), "Angular Momentum & Rotational Laws", fill=(255, 255, 255), font=font_h1)

        summary_points = [
            ("Analogy", "Linear F = m a  ↔  Rotational τ = I α", (59, 130, 246)),
            ("Torque", "τ = r × F = r F sin(θ) [Newton-meters]", (245, 158, 11)),
            ("Moment of Inertia", "I = ∫ r² dm — Mass location determines rotational resistance.", (168, 85, 247)),
            ("Conservation Law", "When τ_ext = 0, Angular Momentum L = I ω is conserved.", (34, 197, 94)),
        ]

        cy_box = 200
        for title, formula, col in summary_points:
            draw.rounded_rectangle([(180, cy_box), (WIDTH - 180, cy_box + 90)], radius=12, fill=(30, 41, 59), outline=col, width=3)
            draw.text((210, cy_box + 16), title, fill=col, font=font_h1)
            draw.text((210, cy_box + 54), formula, fill=(241, 245, 249), font=font_formula)
            cy_box += 115

    return img
