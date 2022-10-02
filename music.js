/*
*1. render songs
*2. Scroll top
*3. Play/pause/seek
*4. CD rotate
*5. Next/prev
*6. Random
*7. Next / Repeat when ended
*8  Active song
*9. Scroll active song into view
*10. Play song whenc click 


*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playlist = $(".playlist");
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat'); 

const app = {
  currentIndex : 0, //lấy ra chỉ mục đầu tiên của mảng
   isPlaying : false,
   isRandom : false,
   isRepeat : false,

  songs: [
    {
      name: "Tình Yêu Màu Nắng",
      singer: "Đoàn Thúy Trang ft. Big Daddy",
      path: "./musicc/Tình Yêu Màu Nắng - Đạo Diễn Triệu Quang Huy - Đoàn Thúy Trang ft. Big Daddy - (Ninja Official MV).mp3",
      image: "./img/tinhyeumaunang.png"
    },
    {
      name: "Em Còn Nhớ Anh Không?",
      singer: "Hoàng Tôn (Feat. Koo)",
      path: "./musicc/Em Còn Nhớ Anh Không- - Hoàng Tôn (Feat. Koo) - Lyrics Video.mp3",
      image:
        "./img/maxresdefault.jpg"
    },
    {
      name: "Nghe Như Tình Yêu (prod. by Kewtiie)",
      singer: "HIEUTHUHAI ",
      path:
        "./musicc/HIEUTHUHAI - Nghe Như Tình Yêu (prod. by Kewtiie) [Official Lyric Video].mp3",
      image: "./img/nghenhutinhyeu.jpg"
    },
    {
      name: "Đã Lỡ Yêu Em Nhiều (Official MV)",
      singer: "JustaTee",
      path: "./musicc/JustaTee - Đã Lỡ Yêu Em Nhiều (Official MV).mp3",
      image:
        "./img/yeuemnhieu.jpg"
    },
    {
      name: "2AM ",
      singer: "JustaTee feat Big Daddy",
      path: "./musicc/2AM - JustaTee feat Big Daddy Official Audio.mp3",
      image:
        "./img/2am.jpg"
    },
    {
      name: "Từ Ngày Em Đến",
      singer: "Da LAB",
      path: "./musicc/Từ Ngày Em Đến - Da LAB (Official MV).mp3",
      image:
        "./img/tungayemden.jpg"
    },
    {
      name: "EM THÍCH",
      singer: "SEAN X Lửa",
      path: "./musicc/EM THÍCH - SEAN X @Lửa Official [OFFICIAL MV LYRIC].mp3",
      image:
        "./img/emthich.jpg"
    }
  ],

  //1.render ra màn hình
  render: function () {
    //kiểm tra của active, phần thêm index đấy, index =  this.currentIndex thì thêm active còn k thì để nguyên
    const htmls = this.songs.map((song, index) => {
      return `
      
      <div class="song ${index === this.currentIndex ? 'active' : '' }" data-index = "${index}">

      <div class ="thumb" style="background-image: url(${song.image})">
      </div>

      <div class="body">
        <h3 class="title">${song.name}</h3>
        <p class="author">${song.singer}</p>
      </div>

      <div class="option">
        <i class="fas fa-ellipsis-h"></i>
      </div>

      </div>
      `
    })

  playlist.innerHTML = htmls.join('');

  },
   
  //định nghĩa thuộc tính cho object
  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
  })
},
   
  //2. Scroll xử lý sự kiện 
  handleEvents: function() {
    const cd = $('.cd') //lấy ra cd
    const cdWidth = cd.offsetWidth  //lấy ra độ rộng của cd
    
    //phóng to thu nhỏ đĩa cd
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop; //lấy ra độ trượt
      const newCdWidth = cdWidth - scrollTop // kích thước mới bằng thích thước ban đầu trừ đi chiều dài
      
      //chỉnh độ to nhỏ của cd
      if(newCdWidth > 0){
        cd.style.width = newCdWidth + 'px'
      }
      else{
        newCdWidth = 0;
      }
      cd.style.opacity = newCdWidth/cdWidth; // làm cd mờ dần
    }

     //3.Play/pause/seek
     
    ///xử lý khi click play
    playBtn.onclick = function(){
      if(app.isPlaying){
        audio.pause()
      }
      else{
        audio.play()
      }
    };
    //khi bài hát được play
    audio.onplay = function(){
      app.isPlaying = true
      player.classList.add('playing')
      cdThumbAnimate.play();
    };
    //khi bài hát pause
    audio.onpause = function(){
      app.isPlaying = false; 
      player.classList.remove('playing')
      cdThumbAnimate.pause();
    };
    
    //để thanh trượt chạy theo tg bài hát
   audio.ontimeupdate = function () {
    if(audio.duration){
      const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100) // thời gian hiện tại / thời lượng bài hát (currentTime / ducation ) // các hàm trên wschool3
      progress.value = progressPercent;
    }
   }

   // xử lý tua bài hát 
    progress.onchange = function(e) {
    const seekTime = audio.duration / 100 * e.target.value  //(e.target.value) là lấy ra giá trị của thanh trượt , (audio.duration) là thời lượng bài hát
    audio.currentTime = seekTime;
   }

   //Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'}

    ],{
      duration: 20000, //20 giây
      interations : Infinity //quay vô hạn
     // tiếp theo gán vào hàm play và pause đã tạo từ trước
    })
     cdThumbAnimate.pause(); 

     //xử lý sự kiện next bài hát
     nextBtn.onclick = function(){
        app.nextSong();
        audio.play();
        app.render(); //sự kiện đổi màu nền bài hát đang phát so với bài hát chưa phát
     }

     //xử lý sự kiện lùi bài hát
     prevBtn.onclick = function(){
        app.prevSong();
        audio.play();
        app.render(); //sự kiện đổi màu nền bài hát đang phát so với bài hát chưa phát
     }

     //xử lý sự kiện random bài hát
     randomBtn.onclick = function(){
      app.randomSong();
      app.render(); //sự kiện đổi màu nền bài hát đang phát so với bài hát chưa phát
      audio.play();
      app.isRandom = !app.isRandom
      randomBtn.classList.toggle('active',app.isRandom);
     }

     // xử lý sự kiện chạy lại bài hát
     repeatBtn.onclick = function(){
      app.isRepeat = !app.isRepeat
      repeatBtn.classList.toggle('active', app.isRepeat);
     }

     //xử lý sự kiện khi next bài hát kết thúc
     audio.onended  = function(e){
         if(app.isRepeat){
          audio.play();
         }
         else{
          nextBtn.click(); //tương đương với sự kiện mình tự click vào nút next
         }
     }

     //xử lý sự kiện lắng nghe hành vi lick vào bài hát để hiện bài hát (thêm data-index là index trên render)
     playlist.onclick = function(e){
      const songNode = e.target.closest('.song:not(.active)') // bắt sự kiện

      if(songNode || e.target.closest('.option')){
        if(songNode){
          app.currentIndex = Number(songNode.dataset.index)
          app.loadCurrentSong();
          app.render();
          audio.play();
        }
      }
     }

     
    
  },
  
  loadCurrentSong: function(){
   //thay đổi các tên
   heading.textContent = this.currentSong.name
   cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
   audio.src = this.currentSong.path
  },

  nextSong : function () {
    this.currentIndex ++
    if(this.currentIndex >= this.songs.length){
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong : function () {
    this.currentIndex --
    if(this.currentIndex < 0){
      this.currentIndex = this.songs.length - 1; //quay về bài cuối
    }
    this.loadCurrentSong();
  },

  randomSong : function () {
    //mục đích random bài hát nếu trùng với bài hát đang phát thì tiếp tục random
    let newIndex
    do{
       newIndex = Math.floor(Math.random() * this.songs.length);
    }
    while(newIndex === this.currentIndex)
    
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },


  start: function () {
    //lắng nghe xử lý các sự kiện
    this.handleEvents();

    //định nghĩa các thuộc tính cho object
    this.defineProperties();

    //tải thông tin bài hát đầu tiên vào giao diện(UI) khi chạy ứng dụng
    this.loadCurrentSong();

    //render playlist
    this.render()
  }
}

app.start();
