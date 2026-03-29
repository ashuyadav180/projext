import wave
import math
import struct
import random
import os

def save_wav(filename, samples, sample_rate=44100):
    with wave.open(filename, 'w') as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sample_rate)
        for sample in samples:
            # Clip to 16-bit range
            val = max(-32767, min(32767, int(sample)))
            data = struct.pack('<h', val)
            f.writeframes(data * 2)

def generate_tone(freq, duration, sample_rate=44100, volume=0.5):
    samples = []
    for i in range(int(duration * sample_rate)):
        t = i / sample_rate
        val = math.sin(2 * math.pi * freq * t) * volume * 32767
        samples.append(val)
    return samples

def generate_pad(freqs, duration, sample_rate=44100, volume=0.3):
    samples = [0] * int(duration * sample_rate)
    for freq in freqs:
        for i in range(len(samples)):
            t = i / sample_rate
            # Add slight vibrato/detune
            detune = math.sin(2 * math.pi * 5 * t) * 0.5
            val = math.sin(2 * math.pi * (freq + detune) * t)
            samples[i] += val
    
    # Normalize and fade
    max_val = max(abs(s) for s in samples) or 1
    final_samples = []
    
    fade_len = int(2 * sample_rate)
    total_len = len(samples)
    
    for i, s in enumerate(samples):
        norm_s = (s / max_val) * volume * 32767
        
        # Fade In
        if i < fade_len:
            norm_s *= (i / fade_len)
        # Fade Out
        elif i > total_len - fade_len:
            norm_s *= ((total_len - i) / fade_len)
            
        final_samples.append(norm_s)
        
    return final_samples

def generate_noise_drums(duration, bpm=60, sample_rate=44100):
    # Simple low-frequency noise bursts for "Cinematic Drums"
    samples = [0] * int(duration * sample_rate)
    beat_interval = 60 / bpm
    samples_per_beat = int(beat_interval * sample_rate)
    
    for i in range(0, len(samples), samples_per_beat):
        # Boom length 0.5s
        for j in range(int(0.5 * sample_rate)):
            if i + j < len(samples):
                # Decaying noise
                noise = random.uniform(-1, 1) * ((0.5 * sample_rate - j) / (0.5 * sample_rate))
                samples[i + j] += noise * 0.4 * 32767

    return samples

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

# ---------------- GENERATORS ----------------

def make_hopeful():
    print("Generating Hopeful track...")
    # C Major: C3, E3, G3, C4
    freqs = [130.81, 164.81, 196.00, 261.63]
    samples = generate_pad(freqs, 60, volume=0.25)
    save_wav("backend/storage/music/music_hopeful.wav", samples)

def make_dark():
    print("Generating Dark track...")
    # C Minor with tritone/tension: C2, Eb2, G2, F#2
    freqs = [65.41, 77.78, 98.00, 92.50] 
    samples = generate_pad(freqs, 60, volume=0.3)
    save_wav("backend/storage/music/music_dark.wav", samples)

def make_epic():
    print("Generating Epic track...")
    # Low Drone (A1) + Drums
    freqs = [55.00, 110.00]
    pad = generate_pad(freqs, 60, volume=0.4)
    drums = generate_noise_drums(60, bpm=45)
    
    mixed = []
    for p, d in zip(pad, drums):
        mixed.append(p + d)
        
    save_wav("backend/storage/music/music_epic.wav", mixed)

if __name__ == "__main__":
    ensure_dir("backend/storage/music")
    make_hopeful()
    make_dark()
    make_epic()
    print("✅ Music generation complete!")
