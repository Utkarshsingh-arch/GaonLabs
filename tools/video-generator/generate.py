#!/usr/bin/env python3
"""
GaonLab Narrated Video Generation Engine
Synthesizes STEM educational concept explainers (1280x720 H.264/AAC MP4)
using Python, Pillow animated vector graphics, TTS narration, and FFmpeg.
"""

import os
import sys
import json
import argparse
import subprocess
import shutil
import tempfile
from pathlib import Path

# Add script directory to sys.path
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
sys.path.insert(0, str(SCRIPT_DIR))

from tts import get_tts_provider
from subtitles import generate_webvtt, generate_transcript
from renderers.shapes_renderer import render_shapes_frame
from renderers.friction_renderer import render_friction_frame
from renderers.rotation_renderer import render_rotation_frame
from renderers.heat_renderer import render_heat_frame

# Locate FFmpeg binary
FFMPEG_BIN = str(PROJECT_ROOT / "tools" / "bin" / "ffmpeg")
FFPROBE_BIN = str(PROJECT_ROOT / "tools" / "bin" / "ffprobe")

if not os.path.exists(FFMPEG_BIN):
    import imageio_ffmpeg
    FFMPEG_BIN = imageio_ffmpeg.get_ffmpeg_exe()

FPS = 24
WIDTH = 1280
HEIGHT = 720

TOPIC_RENDERERS = {
    "topic-shapes-class3": render_shapes_frame,
    "topic-forces-friction-cl8": render_friction_frame,
    "topic-rotational-motion-cl11": render_rotation_frame,
    "topic-ktbs-heat-cl7-kn": render_heat_frame,
}

TOPIC_SCRIPT_MAP = {
    "topic-shapes-class3": "shapes-class3-en.json",
    "shapes-class3": "shapes-class3-en.json",
    "topic-forces-friction-cl8": "friction-class8-en.json",
    "friction-class8": "friction-class8-en.json",
    "topic-rotational-motion-cl11": "rotational-motion-class11-en.json",
    "rotational-motion-class11": "rotational-motion-class11-en.json",
    "topic-ktbs-heat-cl7-kn": "heat-class7-kn.json",
    "ktbs-heat-cl7-kn": "heat-class7-kn.json",
    "heat-class7-kn": "heat-class7-kn.json",
}

def generate_video_for_topic(topic_id: str, language: str = "en", output_dir: str = "public/videos") -> dict:
    canonical_id = topic_id
    if topic_id in TOPIC_SCRIPT_MAP:
        script_file_name = TOPIC_SCRIPT_MAP[topic_id]
        if not canonical_id.startswith("topic-"):
            canonical_id = f"topic-{topic_id}"
    else:
        # Try direct file match
        script_file_name = f"{topic_id}-{language}.json"

    script_path = SCRIPT_DIR / "scripts" / script_file_name
    if not script_path.exists():
        raise FileNotFoundError(f"Script file not found: {script_path}")

    with open(script_path, "r", encoding="utf-8") as f:
        script_data = json.load(f)

    actual_topic_id = script_data.get("topicId", canonical_id)
    renderer_func = TOPIC_RENDERERS.get(actual_topic_id)
    if not renderer_func:
        # Default to friction renderer
        renderer_func = render_friction_frame

    out_path = Path(output_dir)
    out_path.mkdir(parents=True, exist_ok=True)
    captions_dir = out_path / "captions"
    captions_dir.mkdir(parents=True, exist_ok=True)
    transcripts_dir = out_path / "transcripts"
    transcripts_dir.mkdir(parents=True, exist_ok=True)

    if actual_topic_id == "topic-ktbs-heat-cl7-kn":
        video_filename = "video-heat-class7-kn.mp4"
        vtt_filename = "video-heat-class7-kn.vtt"
        txt_filename = "video-heat-class7-kn.txt"
    else:
        video_filename = f"video-{actual_topic_id.replace('topic-', '')}-{language}.mp4"
        vtt_filename = f"video-{actual_topic_id.replace('topic-', '')}-{language}.vtt"
        txt_filename = f"video-{actual_topic_id.replace('topic-', '')}-{language}.txt"

    target_mp4 = out_path / video_filename
    target_vtt = captions_dir / vtt_filename
    target_txt = transcripts_dir / txt_filename

    print(f"\n==================================================================")
    print(f"🎬 Generating GaonLab Video: {script_data.get('title')} ({actual_topic_id})")
    print(f"Output: {target_mp4}")
    print(f"==================================================================")

    # 1. Synthesize audio for each scene
    temp_dir = tempfile.mkdtemp(prefix="gaonlab_vid_")
    tts = get_tts_provider(provider_type="auto", ffmpeg_bin=FFMPEG_BIN)

    timed_scenes = []
    audio_files = []
    current_time = 0.0

    print("🎙️ Synthesizing scene narrations with TTS...")
    for idx, scene in enumerate(script_data.get("scenes", [])):
        narration = scene.get("narration", "")
        audio_clip_path = os.path.join(temp_dir, f"scene_{idx:02d}.mp3")

        duration = tts.generate_audio(narration, audio_clip_path, lang=language)
        # Pad slightly by 0.5s for natural pause
        duration = max(3.5, duration + 0.5)

        timed_scenes.append({
            **scene,
            "startTime": current_time,
            "endTime": current_time + duration,
            "duration": duration,
            "audioPath": audio_clip_path,
        })
        audio_files.append(audio_clip_path)
        current_time += duration
        print(f"  • Scene {idx+1}: '{scene.get('title')}' ({duration:.1f}s)")

    total_duration = current_time
    print(f"Total Video Duration: {total_duration:.1f} seconds")

    # 2. Concatenate audio files into single master audio track using FFmpeg
    concat_list_file = os.path.join(temp_dir, "concat.txt")
    with open(concat_list_file, "w") as f:
        for af in audio_files:
            f.write(f"file '{af}'\n")

    master_audio = os.path.join(temp_dir, "master_audio.aac")
    cmd_audio = [
        FFMPEG_BIN, "-y", "-f", "concat", "-safe", "0",
        "-i", concat_list_file,
        "-c:a", "aac", "-b:a", "128k",
        master_audio
    ]
    subprocess.run(cmd_audio, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 3. Stream Pillow frames directly into FFmpeg video encoder pipe
    print(f"🎨 Rendering {int(total_duration * FPS)} animated frames at 1280x720 ({FPS} fps)...")
    ffmpeg_cmd = [
        FFMPEG_BIN, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",  # Video from stdin pipe
        "-i", master_audio,  # Master audio track
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "22",
        "-c:a", "aac",
        "-b:a", "128k",
        "-shortest",
        "-movflags", "+faststart",
        str(target_mp4)
    ]

    ffmpeg_proc = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

    try:
        global_frame_idx = 0
        total_frames = int(total_duration * FPS)

        for scene in timed_scenes:
            scene_duration = scene["duration"]
            scene_frames = int(scene_duration * FPS)

            for f_idx in range(scene_frames):
                t_local = f_idx / FPS
                progress = min(1.0, f_idx / max(1, scene_frames - 1))

                # Render frame
                frame_img = renderer_func(scene, script_data, progress, t_local)

                # Ensure RGB
                if frame_img.mode != "RGB":
                    frame_img = frame_img.convert("RGB")

                # Pipe raw bytes to ffmpeg
                ffmpeg_proc.stdin.write(frame_img.tobytes())
                global_frame_idx += 1

                if global_frame_idx % (FPS * 5) == 0:
                    pct = (global_frame_idx / total_frames) * 100
                    print(f"  Rendering progress: {pct:.0f}% ({global_frame_idx}/{total_frames} frames)")

        ffmpeg_proc.stdin.close()
        ffmpeg_proc.wait()
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

    # 4. Generate WebVTT captions & text transcript
    generate_webvtt(timed_scenes, str(target_vtt))
    generate_transcript(timed_scenes, str(target_txt))

    # 5. Mirror to web public directory for Vite dev server
    web_videos_dir = PROJECT_ROOT / "apps" / "web" / "public" / "videos"
    web_videos_dir.mkdir(parents=True, exist_ok=True)
    web_captions_dir = web_videos_dir / "captions"
    web_captions_dir.mkdir(parents=True, exist_ok=True)
    web_transcripts_dir = web_videos_dir / "transcripts"
    web_transcripts_dir.mkdir(parents=True, exist_ok=True)

    shutil.copy2(target_mp4, web_videos_dir / video_filename)
    shutil.copy2(target_vtt, web_captions_dir / target_vtt.name)
    shutil.copy2(target_txt, web_transcripts_dir / target_txt.name)

    # 6. Verify via FFprobe
    probe_cmd = [FFPROBE_BIN, "-of", "json", str(target_mp4)]
    probe_proc = subprocess.run(probe_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    probe_info = json.loads(probe_proc.stdout) if probe_proc.returncode == 0 else {}

    file_size_mb = os.path.getsize(target_mp4) / (1024 * 1024)
    print(f"\n✅ SUCCESS: Generated {target_mp4.name} ({file_size_mb:.2f} MB, {total_duration:.1f}s)")
    print(f"   Audio Stream: {'Found' if probe_info.get('has_audio') else 'Missing'}")
    print(f"   Video Stream: {'Found' if probe_info.get('has_video') else 'Missing'}")
    print(f"   Captions: {target_vtt}")
    print(f"   Mirrored to: {web_videos_dir / video_filename}\n")

    return {
        "topicId": actual_topic_id,
        "filename": video_filename,
        "filePath": str(target_mp4),
        "duration": total_duration,
        "fileSizeBytes": os.path.getsize(target_mp4),
        "hasAudio": probe_info.get("has_audio", True),
        "hasVideo": probe_info.get("has_video", True),
        "captionsFile": str(target_vtt),
    }

def main():
    parser = argparse.ArgumentParser(description="GaonLab Narrated Video Generator")
    parser.add_argument("--topic", help="Topic ID or shorthand (e.g. friction-class8, topic-shapes-class3)")
    parser.add_argument("--language", default="en", help="Language code (en, kn, hi)")
    parser.add_argument("--all", action="store_true", help="Generate all 3 demonstration topics")
    parser.add_argument("--output-dir", default="public/videos", help="Target output directory")

    args = parser.parse_args()

    if args.all:
        demo_topics = [
            ("topic-shapes-class3", "en"),
            ("topic-forces-friction-cl8", "en"),
            ("topic-rotational-motion-cl11", "en"),
            ("topic-ktbs-heat-cl7-kn", "kn"),
        ]
        results = []
        for t, lang in demo_topics:
            res = generate_video_for_topic(t, language=lang, output_dir=args.output_dir)
            results.append(res)
        print("\n🎉 ALL DEMONSTRATION VIDEOS (INCLUDING KANNADA) GENERATED SUCCESSFULLY!")
    elif args.topic:
        lang = "kn" if "kn" in args.topic else args.language
        generate_video_for_topic(args.topic, language=lang, output_dir=args.output_dir)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
