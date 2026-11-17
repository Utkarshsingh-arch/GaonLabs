import wave
import struct
import math
import os
import subprocess
import re
from .base import BaseTTSProvider

class OfflineSyntheticTTSProvider(BaseTTSProvider):
    """
    Offline synthetic audio generator using Python standard library (wave + math).
    Generates rhythmic multi-tone speech-cadence audio matching text word count.
    Guarantees video generation works even in isolated offline environments.
    """

    def __init__(self, ffmpeg_bin: str = "ffmpeg"):
        self.ffmpeg_bin = ffmpeg_bin

    def generate_audio(self, text: str, output_path: str, lang: str = "en") -> float:
        words = text.split()
        word_count = max(len(words), 3)

        # Estimate reading time: ~140 words per minute (0.43s per word) + pauses
        duration = max(3.5, word_count * 0.44 + 1.2)
        sample_rate = 24000
        total_samples = int(sample_rate * duration)

        temp_wav = output_path.replace(".mp3", ".wav") if output_path.endswith(".mp3") else output_path + ".wav"

        # Generate harmonic speech cadence
        with wave.open(temp_wav, "w") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(sample_rate)

            samples = []
            syllable_len = int(sample_rate * 0.22)
            for i in range(total_samples):
                t = i / sample_rate
                # Base speech fundamental pitch (140-190 Hz)
                f0 = 160 + 20 * math.sin(2 * math.pi * 0.8 * t)
                # Formant harmonics
                formant1 = 0.4 * math.sin(2 * math.pi * f0 * t)
                formant2 = 0.25 * math.sin(2 * math.pi * (f0 * 2.5) * t)
                formant3 = 0.15 * math.sin(2 * math.pi * (f0 * 4.2) * t)

                # Syllable modulation envelope
                syllable_phase = (i % syllable_len) / syllable_len
                envelope = math.sin(math.pi * syllable_phase)

                # Word boundary pause
                word_pause = 0.2 + 0.8 * max(0, math.sin(2 * math.pi * 1.5 * t))

                val = int((formant1 + formant2 + formant3) * envelope * word_pause * 14000)
                samples.append(struct.pack("<h", max(-32767, min(32767, val))))

            wav_file.writeframes(b"".join(samples))

        # Convert to target output format via ffmpeg if requested
        if output_path != temp_wav:
            cmd = [self.ffmpeg_bin, "-y", "-i", temp_wav, "-c:a", "aac", "-b:a", "128k", output_path]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(temp_wav):
                try:
                    os.remove(temp_wav)
                except OSError:
                    pass

        return duration
