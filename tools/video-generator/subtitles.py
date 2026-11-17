def format_vtt_timestamp(seconds: float) -> str:
    """
    Formats seconds as HH:MM:SS.mmm for WebVTT.
    """
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    return f"{hrs:02d}:{mins:02d}:{secs:02d}.{millis:03d}"

def generate_webvtt(timed_scenes: list[dict], output_path: str):
    """
    Generates a standards-compliant WebVTT subtitle file.
    """
    lines = ["WEBVTT", ""]
    for idx, scene in enumerate(timed_scenes):
        start = format_vtt_timestamp(scene["startTime"])
        end = format_vtt_timestamp(scene["endTime"])
        sub_text = scene.get("subtitles") or scene.get("narration") or ""

        lines.append(f"{idx + 1}")
        lines.append(f"{start} --> {end}")
        lines.append(sub_text.strip())
        lines.append("")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

def generate_transcript(timed_scenes: list[dict], output_path: str):
    """
    Generates a clean text transcript file.
    """
    lines = []
    for scene in timed_scenes:
        title = scene.get("title", "")
        narration = scene.get("narration", "")
        lines.append(f"[{format_vtt_timestamp(scene['startTime'])}] {title}")
        lines.append(f"{narration}\n")

    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
