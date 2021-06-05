class Player {
  constructor() {
    // 创建audio
    const audio = new Audio();

    this.audio = audio;
  }

  setSource(url) {
    this.audio.src = url;
    this.play();
  }

  play() {
    this.audio.paused ? this.audio.play() : this.audio.pause();
  }
}

export default Player;
