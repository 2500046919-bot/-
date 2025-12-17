document.addEventListener('DOMContentLoaded', function() {
    // 初始化音频播放器
    const audioPlayer = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progress = document.getElementById('progress');
    const progressSlider = document.getElementById('progressSlider');
    const currentTime = document.getElementById('currentTime');
    const duration = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeLevel = document.getElementById('volumeLevel');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const playlist = document.getElementById('playlist');
    const albumArt = document.querySelector('.album-art');
    const currentSongTitle = document.getElementById('currentSongTitle');
    const currentArtist = document.getElementById('currentArtist');
    const albumCover = document.getElementById('albumCover');
    const songCount = document.getElementById('songCount');
    const clearPlaylistBtn = document.getElementById('clearPlaylist');
    const addSongBtn = document.getElementById('addSongBtn');
    const jumpBtn = document.getElementById('jumpBtn');
    const notification = document.getElementById('notification');

    // 默认播放列表
    let songs = [
        {
            title: "恭喜哈财",
            artist: "哈基咪",
            src: "assets/music/music1.mp3",
            cover: "assets/images/图4.png",
            duration: "0:31"
        },
        {
            title: "Pressure",
            artist: "哈基咪",
            src: "assets/music/music2.mp3",
            cover: "assets/images/图1.webp",
            duration: "0:41"
        },
        {
            title: "基咪说",
            artist: "哈基咪",
            src: "assets/music/music3.mp3",
            cover: "assets/images/图2.webp",
            duration: "0:42"
        },
        {
            title: "蓝莲哈",
            artist: "哈基咪",
            src: "assets/music/music4.mp3",
            cover: "assets/images/图6.jpg",
            duration: "1:28"
        },
        {
            title: "哈沫",
            artist: "哈基咪",
            src: "assets/music/music5.mp3",
            cover: "assets/images/图5.png",
            duration: "2:42"
        }
    ];

    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    let shuffledIndices = [];

    // 初始化播放列表
    function initPlaylist() {
        playlist.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = 'playlist-item';
            li.dataset.index = index;
            
            li.innerHTML = `
                <span class="song-number">${index + 1}</span>
                <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <span class="song-duration">${song.duration}</span>
                <button class="delete-song" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            li.addEventListener('click', (e) => {
                if (!e.target.classList.contains('delete-song')) {
                    playSong(index);
                }
            });
            
            playlist.appendChild(li);
        });
        
        updateSongCount();
        loadSong(currentSongIndex);
    }

    // 播放歌曲
    function playSong(index) {
        currentSongIndex = index;
        const song = songs[index];
        
        audioPlayer.src = song.src;
        currentSongTitle.textContent = song.title;
        currentArtist.textContent = song.artist;
        albumCover.src = song.cover;
        
        play();
        
        // 更新播放列表中的当前歌曲
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('playing');
            } else {
                item.classList.remove('playing');
            }
        });
    }

    // 播放/暂停
    function play() {
        if (audioPlayer.src) {
            audioPlayer.play();
            isPlaying = true;
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            albumArt.classList.add('playing');
        }
    }

    function pause() {
        audioPlayer.pause();
        isPlaying = false;
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        albumArt.classList.remove('playing');
    }

    // 下一首
    function nextSong() {
        if (isShuffle && shuffledIndices.length > 0) {
            const currentShuffleIndex = shuffledIndices.indexOf(currentSongIndex);
            let nextIndex = (currentShuffleIndex + 1) % shuffledIndices.length;
            playSong(shuffledIndices[nextIndex]);
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            playSong(currentSongIndex);
        }
    }

    // 上一首
    function prevSong() {
        if (isShuffle && shuffledIndices.length > 0) {
            const currentShuffleIndex = shuffledIndices.indexOf(currentSongIndex);
            let prevIndex = (currentShuffleIndex - 1 + shuffledIndices.length) % shuffledIndices.length;
            playSong(shuffledIndices[prevIndex]);
        } else {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            playSong(currentSongIndex);
        }
    }

    // 更新进度条
    function updateProgress() {
        const { currentTime: time, duration: dur } = audioPlayer;
        
        if (dur) {
            const progressPercent = (time / dur) * 100;
            progress.style.width = `${progressPercent}%`;
            progressSlider.value = progressPercent;
            
            currentTime.textContent = formatTime(time);
            duration.textContent = formatTime(dur);
        }
    }

    // 格式化时间
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 设置进度
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    // 设置音量
    function setVolume() {
        const volume = volumeSlider.value / 100;
        audioPlayer.volume = volume;
        volumeLevel.style.width = `${volumeSlider.value}%`;
    }

    // 随机播放
    function toggleShuffle() {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
        
        if (isShuffle) {
            shuffledIndices = [...Array(songs.length).keys()];
            for (let i = shuffledIndices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
            }
            showNotification('随机播放已开启');
        } else {
            showNotification('随机播放已关闭');
        }
    }

    // 循环播放
    function toggleRepeat() {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
        audioPlayer.loop = isRepeat;
        showNotification(isRepeat ? '循环播放已开启' : '循环播放已关闭');
    }

    // 跳转到指定时间
    function jumpToTime() {
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        const totalSeconds = minutes * 60 + seconds;
        
        if (audioPlayer.duration && totalSeconds < audioPlayer.duration) {
            audioPlayer.currentTime = totalSeconds;
            showNotification(`已跳转到 ${minutes}:${seconds.toString().padStart(2, '0')}`);
        } else {
            showNotification('无效的时间设置');
        }
    }

    // 添加歌曲
    function addSong() {
        const title = document.getElementById('songName').value.trim();
        const artist = document.getElementById('artistName').value.trim();
        const url = document.getElementById('songUrl').value.trim();
        
        if (!title || !artist) {
            showNotification('请填写歌曲名称和歌手');
            return;
        }
        
        const newSong = {
            title,
            artist,
            src: url || `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${songs.length + 1}.mp3`,
            cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            duration: "3:30"
        };
        
        songs.push(newSong);
        initPlaylist();
        
        // 清空表单
        document.getElementById('songName').value = '';
        document.getElementById('artistName').value = '';
        document.getElementById('songUrl').value = '';
        
        showNotification('歌曲已添加到播放列表');
    }

    // 删除歌曲
    function deleteSong(index) {
        if (songs.length <= 1) {
            showNotification('至少需要保留一首歌曲');
            return;
        }
        
        songs.splice(index, 1);
        
        if (currentSongIndex >= index && currentSongIndex > 0) {
            currentSongIndex--;
        }
        
        initPlaylist();
        if (currentSongIndex < songs.length) {
            playSong(currentSongIndex);
        }
    }

    // 清空播放列表
    function clearPlaylist() {
        if (songs.length > 0) {
            songs = [songs[0]]; // 保留第一首歌
            currentSongIndex = 0;
            initPlaylist();
            showNotification('播放列表已清空，保留了一首歌曲');
        }
    }

    // 更新歌曲数量
    function updateSongCount() {
        songCount.textContent = `${songs.length} 首歌曲`;
    }

    // 显示通知
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // 加载歌曲
    function loadSong(index) {
        const song = songs[index];
        audioPlayer.src = song.src;
        audioPlayer.load();
    }

    // 事件监听器
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        if (isRepeat) {
            audioPlayer.currentTime = 0;
            play();
        } else {
            nextSong();
        }
    });

    progressSlider.addEventListener('input', function() {
        const progressPercent = this.value;
        progress.style.width = `${progressPercent}%`;
        
        if (audioPlayer.duration) {
            audioPlayer.currentTime = (progressPercent / 100) * audioPlayer.duration;
        }
    });

    document.querySelector('.progress-bar').addEventListener('click', setProgress);

    volumeSlider.addEventListener('input', setVolume);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    jumpBtn.addEventListener('click', jumpToTime);
    addSongBtn.addEventListener('click', addSong);
    clearPlaylistBtn.addEventListener('click', clearPlaylist);

    // 删除歌曲事件委托
    playlist.addEventListener('click', (e) => {
        if (e.target.closest('.delete-song')) {
            const index = parseInt(e.target.closest('.delete-song').dataset.index);
            e.stopPropagation();
            deleteSong(index);
        }
    });

    // 允许输入框的Enter键提交
    ['songName', 'artistName', 'songUrl'].forEach(id => {
        document.getElementById(id).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addSong();
        });
    });

    // 时间输入框的Enter键跳转
    ['minutes', 'seconds'].forEach(id => {
        document.getElementById(id).addEventListener('keypress', (e) => {
            if (e.key === 'Enter') jumpToTime();
        });
    });

    // 初始化
    initPlaylist();
    setVolume(); // 设置初始音量

    // 显示初始化完成消息
    setTimeout(() => {
        showNotification('音乐播放器已准备就绪！欢迎使用');
    }, 1000);
});