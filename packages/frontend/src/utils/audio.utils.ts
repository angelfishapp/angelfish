/**
 * AudioPlayer Constructor Options
 */
export interface AudioPlayerOptions {
  /**
   * Whether to fade in the audio when playing.
   * @default false
   */
  fadeIn?: boolean
  /**
   * Whether to fade out the audio when stopping.
   * @default false
   */
  fadeOut?: boolean
  /**
   * Duration of fade-in effect in seconds.
   * @default 1
   */
  fadeDuration?: number
  /**
   * Whether to loop the audio playback.
   * @default false
   */
  loop?: boolean
}

/**
 * A class for playing audio files with optional fade-in and fade-out effects.
 */
export class AudioPlayer {
  private audioElement: HTMLAudioElement
  private audioContext: AudioContext
  private gainNode: GainNode
  private isPlaying: boolean
  // Track fade-out timeout for stop()
  private stopTimeout: NodeJS.Timeout | null = null

  // Current audio player options
  private options: AudioPlayerOptions

  /**
   * Create a new AudioPlayer instance with the given audio URL and options.
   *
   * @param audioUrl    URL of the audio file to play
   * @param options     Options for the audio player @see AudioPlayerOptions
   */
  private constructor(
    audioUrl: string,
    { fadeIn = false, fadeOut = false, fadeDuration = 1, loop = false }: AudioPlayerOptions,
  ) {
    this.options = { fadeIn, fadeOut, fadeDuration, loop }

    // Load the audio file
    this.audioElement = new Audio(audioUrl)
    this.audioContext = new window.AudioContext()
    // Create a gain node for volume control
    this.gainNode = this.audioContext.createGain()
    this.isPlaying = false

    // Enable looping
    if (loop) {
      this.audioElement.loop = true
    }

    // Connect the audio element to the Web Audio API
    const sourceNode = this.audioContext.createMediaElementSource(this.audioElement)
    sourceNode.connect(this.gainNode)
    this.gainNode.connect(this.audioContext.destination)
  }

  /**
   * Create a new AudioPlayer instance with the given audio URL and options.
   *
   * @param audioUrl    URL of the audio file to play
   * @param options     Options for the audio player @see AudioPlayerOptions
   * @returns           A promise that resolves to the created AudioPlayer instance
   */
  static async create(audioUrl: string, options: AudioPlayerOptions = {}): Promise<AudioPlayer> {
    const response = await fetch(audioUrl)
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    return new AudioPlayer(objectUrl, options)
  }

  // Play the audio with fade-in effect
  async play() {
    // Cancel any pending fade-out
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout)
      this.stopTimeout = null
      this.audioElement.pause()
      this.audioElement.currentTime = 0 // Reset playback to the beginning
      this.isPlaying = false
    }

    if (this.isPlaying) return

    // Ensure the audio context is resumed (required in modern browsers)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }

    // Start the audio playback
    this.audioElement.play()

    // Fade in the volume
    if (this.options.fadeIn) {
      this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime) // Start at volume 0
      this.gainNode.gain.linearRampToValueAtTime(
        1,
        this.audioContext.currentTime + (this.options.fadeDuration ?? 1),
      ) // Fade in to full volume
    } else {
      this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime) // Start at full volume
    }

    this.isPlaying = true
  }

  // Stop the audio with fade-out effect
  stop() {
    if (!this.isPlaying) return

    // Fade out the volume
    if (this.options.fadeOut) {
      const fadeDuration = this.options.fadeDuration ?? 1 // Duration of fade-out in seconds
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.audioContext.currentTime) // Start from current volume
      this.gainNode.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + (this.options.fadeDuration ?? 1),
      ) // Fade out to volume 0

      // Stop the audio after the fade-out
      this.stopTimeout = setTimeout(() => {
        this.audioElement.pause()
        this.audioElement.currentTime = 0 // Reset playback to the beginning
        this.isPlaying = false
      }, fadeDuration * 1000) // Match the fade-out duration
    } else {
      this.audioElement.pause()
      this.audioElement.currentTime = 0 // Reset playback to the beginning
      this.isPlaying = false
    }
  }
}
