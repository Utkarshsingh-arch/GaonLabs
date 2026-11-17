import math
from PIL import Image, ImageDraw, ImageFont

# 1280x720 16:9 Canvas
WIDTH = 1280
HEIGHT = 720

def get_font(size: int, bold: bool = False, lang: str = "en"):
    """
    Load system TrueType font with language awareness (Kannada, Devanagari, Latin)
    and graceful fallback to default bitmap font.
    """
    if lang == "kn":
        font_paths = [
            "/usr/share/fonts/truetype/noto/NotoSansKannada-Bold.ttf" if bold else "/usr/share/fonts/truetype/noto/NotoSansKannada-Regular.ttf",
            "/usr/share/fonts/truetype/noto/NotoSansKannadaUI-Bold.ttf" if bold else "/usr/share/fonts/truetype/noto/NotoSansKannadaUI-Regular.ttf",
            "/usr/share/fonts/truetype/noto/NotoSerifKannada-Bold.ttf" if bold else "/usr/share/fonts/truetype/noto/NotoSerifKannada-Regular.ttf",
        ]
    else:
        font_paths = [
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf" if bold else "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
            "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf" if bold else "/usr/share/fonts/truetype/freefont/FreeSans.ttf",
            "/usr/share/fonts/truetype/noto/NotoSansKannada-Bold.ttf" if bold else "/usr/share/fonts/truetype/noto/NotoSansKannada-Regular.ttf",
        ]
    for path in font_paths:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()

def create_background(topic_title: str, grade: int, scene_title: str, progress: float, lang: str = "en") -> tuple[Image.Image, ImageDraw.ImageDraw]:
    """
    Creates high-contrast, polished background canvas with header, title badge, and progress bar.
    Supports Kannada typography when lang='kn'.
    """
    img = Image.new("RGB", (WIDTH, HEIGHT), color=(15, 23, 42))  # slate-900
    draw = ImageDraw.Draw(img)

    # Subtle radial/gradient mesh
    for y in range(0, 120):
        alpha = int(25 * (1.0 - y / 120))
        draw.line([(0, y), (WIDTH, y)], fill=(30 + alpha, 41 + alpha, 59 + alpha))

    # Top Header Banner
    draw.rectangle([(0, 0), (WIDTH, 70)], fill=(10, 15, 30))
    draw.line([(0, 70), (WIDTH, 70)], fill=(51, 65, 85), width=2)

    # GaonLab Logo Pill
    draw.rounded_rectangle([(30, 16), (150, 54)], radius=8, fill=(16, 185, 129))  # emerald-500
    font_brand = get_font(18, bold=True)
    draw.text((45, 22), "GAONLAB", fill=(255, 255, 255), font=font_brand)

    # Topic & Grade
    font_title = get_font(18, bold=True, lang=lang)
    grade_label = f"ತರಗತಿ {grade} STEM" if lang == "kn" else f"Class {grade} STEM"
    draw.text((170, 22), f"{grade_label} • {topic_title}", fill=(241, 245, 249), font=font_title)

    # Scene Title Badge
    font_badge = get_font(13, bold=True, lang=lang)
    draw.rounded_rectangle([(WIDTH - 360, 18), (WIDTH - 30, 52)], radius=6, fill=(30, 41, 59))
    scene_label = f"ಹಂತ: {scene_title[:32]}" if lang == "kn" else f"Scene: {scene_title[:28]}"
    draw.text((WIDTH - 345, 25), scene_label, fill=(148, 163, 184), font=font_badge)

    # Bottom Progress Bar
    draw.line([(0, HEIGHT - 8), (WIDTH, HEIGHT - 8)], fill=(30, 41, 59), width=8)
    progress_w = int(WIDTH * max(0.0, min(1.0, progress)))
    if progress_w > 0:
        draw.line([(0, HEIGHT - 8), (progress_w, HEIGHT - 8)], fill=(59, 130, 246), width=8)

    return img, draw

def draw_arrow(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int], color: tuple[int, int, int], width: int = 4, label: str = ""):
    """
    Draws a vector arrow with arrowhead and optional text label.
    """
    x1, y1 = start
    x2, y2 = end
    draw.line([start, end], fill=color, width=width)

    # Arrowhead angle
    angle = math.atan2(y2 - y1, x2 - x1)
    head_len = 16
    arrow_angle = math.pi / 6

    p1 = (x2 - head_len * math.cos(angle - arrow_angle), y2 - head_len * math.sin(angle - arrow_angle))
    p2 = (x2 - head_len * math.cos(angle + arrow_angle), y2 - head_len * math.sin(angle + arrow_angle))
    draw.polygon([end, p1, p2], fill=color)

    if label:
        font = get_font(16, bold=True)
        mid_x = (x1 + x2) // 2
        mid_y = (y1 + y2) // 2 - 24
        draw.text((mid_x - 20, mid_y), label, fill=color, font=font)
