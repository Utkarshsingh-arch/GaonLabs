import os
import subprocess
import re
from .base import BaseTTSProvider

class GoogleTTSProvider(BaseTTSProvider):
    """
    Online Google TTS provider using gTTS library.
    Generates natural human-like narration in English, Hindi, and Kannada.
    """

    def __init__(self, ffmpeg_bin: str = "ffmpeg"):
        self.ffmpeg_bin = ffmpeg_bin

    def generate_audio(self, text: str, output_path: str, lang: str = "en") -> float:
        try:
            from gtts import gTTS

            # Map language codes
            lang_map = {
                "en": "en",
                "kn": "kn",
                "hi": "hi"
            }
            target_lang = lang_map.get(lang, "en")

            tts = gTTS(text=text, lang=target_lang, slow=False)
            tts.save(output_path)

            # Inspect duration via ffmpeg
            duration = self._get_duration(output_path)
            return duration
        except Exception as e:
            print(f"⚠️ Online TTS error ({e}). Using offline synthetic speech synthesizer fallback...")
            from .offline_tts import OfflineSyntheticTTSProvider
            fallback_provider = OfflineSyntheticTTSProvider(ffmpeg_bin=self.ffmpeg_bin)
            return fallback_provider.generate_audio(text, output_path, lang=lang)

    def _get_duration(self, file_path: str) -> float:
        cmd = [self.ffmpeg_bin, "-i", file_path]
        proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        match = re.search(r"Duration:\s*(\d+):(\d+):([\d\.]+)", proc.stderr)
        if match:
            h, m, s = match.groups()
            return int(h) * 3600 + int(m) * 60 + float(s)
        return 3.0  # safe fallback
