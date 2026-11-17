import os
from .base import BaseTTSProvider
from .google_tts import GoogleTTSProvider
from .offline_tts import OfflineSyntheticTTSProvider

def get_tts_provider(provider_type: str = "auto", ffmpeg_bin: str = "ffmpeg") -> BaseTTSProvider:
    if provider_type == "google" or provider_type == "auto":
        try:
            import gtts
            return GoogleTTSProvider(ffmpeg_bin=ffmpeg_bin)
        except Exception:
            return OfflineSyntheticTTSProvider(ffmpeg_bin=ffmpeg_bin)
    elif provider_type == "offline":
        return OfflineSyntheticTTSProvider(ffmpeg_bin=ffmpeg_bin)
    else:
        return OfflineSyntheticTTSProvider(ffmpeg_bin=ffmpeg_bin)
