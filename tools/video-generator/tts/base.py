from abc import ABC, abstractmethod

class BaseTTSProvider(ABC):
    """
    Abstract interface for Text-to-Speech generation.
    Supports switching between Google TTS, local neural TTS, or synthetic offline engines.
    """

    @abstractmethod
    def generate_audio(self, text: str, output_path: str, lang: str = "en") -> float:
        """
        Synthesizes speech audio from text and saves to output_path.
        Returns the duration of the audio in seconds.
        """
        pass
