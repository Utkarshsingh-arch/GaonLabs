import math
from PIL import Image, ImageDraw
from .base_renderer import create_background, get_font, WIDTH, HEIGHT

def render_shapes_frame(scene_spec: dict, topic_data: dict, progress: float, t: float) -> Image.Image:
    """
    Renders moving geometric frames for Class 3 Mathematics 'Fun with Shapes'.
    Features rolling wheels, building roofs from triangles, and stacking bricks.
    """
    scene_id = scene_spec.get("sceneId", "")
    scene_title = scene_spec.get("title", "")
    img, draw = create_background("Fun with Shapes", 3, scene_title, progress)

    font_h1 = get_font(28, bold=True)
    font_body = get_font(20, bold=False)
    font_label = get_font(18, bold=True)

    if scene_id == "scene-1-welcome":
        # Animated geometric welcome burst
        cx, cy = WIDTH // 2, 380
        radius = 90 + int(15 * math.sin(t * 3.0))

        # Central colorful morphing shape
        draw.ellipse([(cx - radius, cy - radius), (cx + radius, cy + radius)], outline=(59, 130, 246), width=6)

        # Surrounding orbiting shapes
        for i in range(4):
            angle = t * 1.5 + i * (math.pi / 2)
            ox = cx + int(220 * math.cos(angle))
            oy = cy + int(140 * math.sin(angle))
            if i == 0:
                # Circle
                draw.ellipse([(ox - 30, oy - 30), (ox + 30, oy + 30)], fill=(236, 72, 153))
            elif i == 1:
                # Triangle
                draw.polygon([(ox, oy - 35), (ox - 30, oy + 25), (ox + 30, oy + 25)], fill=(34, 197, 94))
            elif i == 2:
                # Square
                draw.rectangle([(ox - 28, oy - 28), (ox + 28, oy + 28)], fill=(234, 179, 8))
            else:
                # Diamond / Rectangle
                draw.polygon([(ox, oy - 30), (ox + 40, oy), (ox, oy + 30), (ox - 40, oy)], fill=(168, 85, 247))

        draw.text((WIDTH // 2 - 260, 160), "Discovering Shapes in Our World", fill=(255, 255, 255), font=font_h1)
        draw.text((WIDTH // 2 - 210, 210), "Circles • Triangles • Squares • Rectangles", fill=(148, 163, 184), font=font_body)

    elif scene_id == "scene-2-circle":
        # Animated rolling wheel across the ground
        ground_y = 520
        draw.line([(80, ground_y), (WIDTH - 80, ground_y)], fill=(71, 85, 105), width=4)

        wheel_r = 95
        # Move wheel from x=200 to x=900
        wheel_x = int(220 + (WIDTH - 440) * progress)
        wheel_y = ground_y - wheel_r

        # Wheel rim
        draw.ellipse([(wheel_x - wheel_r, wheel_y - wheel_r), (wheel_x + wheel_r, wheel_y + wheel_r)], outline=(245, 158, 11), width=8, fill=(30, 41, 59))
        draw.ellipse([(wheel_x - 16, wheel_y - 16), (wheel_x + 16, wheel_y + 16)], fill=(245, 158, 11))

        # Rotating spokes
        rot_angle = (wheel_x / wheel_r)
        for i in range(6):
            spoke_angle = rot_angle + i * (math.pi / 3)
            sx = wheel_x + int((wheel_r - 6) * math.cos(spoke_angle))
            sy = wheel_y + int((wheel_r - 6) * math.sin(spoke_angle))
            draw.line([(wheel_x, wheel_y), (sx, sy)], fill=(245, 158, 11), width=3)

        # Labels & properties
        draw.text((80, 130), "The Circle: Perfect Roundness", fill=(245, 158, 11), font=font_h1)
        draw.text((80, 180), "• 1 Continuous Curved Edge", fill=(241, 245, 249), font=font_body)
        draw.text((80, 220), "• 0 Corners / Vertices", fill=(241, 245, 249), font=font_body)
        draw.text((80, 260), "• Rolls smoothly without bumps!", fill=(34, 197, 94), font=font_body)
        draw.text((wheel_x - 70, wheel_y - wheel_r - 35), "Bicycle Wheel", fill=(255, 255, 255), font=font_label)

    elif scene_id == "scene-3-triangle":
        # Animated Triangle building a village roof
        draw.text((80, 130), "The Triangle: Strength in 3 Sides", fill=(34, 197, 94), font=font_h1)
        draw.text((80, 180), "• 3 Straight Line Segments", fill=(241, 245, 249), font=font_body)
        draw.text((80, 220), "• 3 Vertices (Corner Points)", fill=(241, 245, 249), font=font_body)
        draw.text((80, 260), "• Does not deform under load", fill=(59, 130, 246), font=font_body)

        # House base
        hx, hy = 760, 480
        hw, hh = 300, 160
        draw.rectangle([(hx, hy), (hx + hw, hy + hh)], fill=(71, 85, 105), outline=(148, 163, 184), width=3)
        # Door
        draw.rectangle([(hx + 110, hy + 60), (hx + 190, hy + hh)], fill=(30, 41, 59))

        # Animated roof landing
        roof_offset = int(max(0, (1.0 - progress * 2.0) * 120))
        roof_p1 = (hx + hw // 2, hy - 140 - roof_offset)
        roof_p2 = (hx - 30, hy - roof_offset)
        roof_p3 = (hx + hw + 30, hy - roof_offset)

        draw.polygon([roof_p1, roof_p2, roof_p3], fill=(239, 68, 68), outline=(254, 202, 202), width=4)

        # Vertices highlights
        for v in [roof_p1, roof_p2, roof_p3]:
            draw.ellipse([(v[0] - 8, v[1] - 8), (v[0] + 8, v[1] + 8)], fill=(255, 255, 255))

        draw.text((roof_p1[0] - 40, roof_p1[1] - 30), "Vertex 1", fill=(255, 255, 255), font=font_label)
        draw.text((roof_p2[0] - 80, roof_p2[1] + 10), "Vertex 2", fill=(255, 255, 255), font=font_label)
        draw.text((roof_p3[0] + 10, roof_p3[1] + 10), "Vertex 3", fill=(255, 255, 255), font=font_label)

    elif scene_id == "scene-4-square-rectangle":
        # Squares & Rectangles stacking into a sturdy wall
        draw.text((80, 130), "Squares & Rectangles: Stacking Stability", fill=(59, 130, 246), font=font_h1)
        draw.text((80, 180), "• 4 Straight Sides & 4 Right Angles (90°)", fill=(241, 245, 249), font=font_body)
        draw.text((80, 220), "• Square: All 4 sides equal", fill=(241, 245, 249), font=font_body)
        draw.text((80, 260), "• Rectangle: Opposite sides equal", fill=(241, 245, 249), font=font_body)

        # Stacking mud bricks
        base_x = 720
        base_y = 540
        brick_w, brick_h = 130, 50

        # Draw stacked layers based on progress
        num_bricks = min(8, int(progress * 10) + 1)
        coords = [
            (base_x, base_y), (base_x + brick_w + 10, base_y),
            (base_x + brick_w // 2, base_y - brick_h - 10),
            (base_x - brick_w // 2 + 10, base_y - brick_h - 10), (base_x + brick_w + 20, base_y - brick_h - 10),
            (base_x, base_y - 2 * (brick_h + 10)), (base_x + brick_w + 10, base_y - 2 * (brick_h + 10)),
            (base_x + brick_w // 2, base_y - 3 * (brick_h + 10)),
        ]
        for idx in range(min(num_bricks, len(coords))):
            bx, by = coords[idx]
            draw.rectangle([(bx, by), (bx + brick_w, by + brick_h)], fill=(180, 83, 9), outline=(253, 230, 138), width=3)
            draw.text((bx + 35, by + 16), "Brick", fill=(255, 255, 255), font=font_label)

    else:
        # scene-5-summary: Showcase of 2D and 3D shapes
        draw.text((WIDTH // 2 - 200, 120), "Shape Summary Matrix", fill=(255, 255, 255), font=font_h1)

        shapes = [
            ("Circle", (180, 280), "2D", (236, 72, 153)),
            ("Triangle", (460, 280), "2D", (34, 197, 94)),
            ("Square", (740, 280), "2D", (59, 130, 246)),
            ("Rectangle", (1020, 280), "2D", (245, 158, 11)),
            ("Sphere", (320, 500), "3D", (168, 85, 247)),
            ("Cylinder", (600, 500), "3D", (14, 165, 233)),
            ("Cube", (880, 500), "3D", (244, 63, 94)),
        ]

        for name, (sx, sy), dim, color in shapes:
            pulse = int(5 * math.sin(t * 4.0 + sx))
            draw.rounded_rectangle([(sx - 80, sy - 50), (sx + 80, sy + 50)], radius=12, fill=(30, 41, 59), outline=color, width=3)
            draw.text((sx - 35, sy - 20), name, fill=(255, 255, 255), font=font_label)
            draw.text((sx - 12, sy + 15), dim, fill=color, font=font_body)

    return img
