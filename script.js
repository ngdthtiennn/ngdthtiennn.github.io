$(function()
{
    var playerTrack = $("#player-track");
	var bgArtwork = $('#bg-artwork');
	var bgArtworkUrl;
	var albumName = $('#album-name');
	var trackName = $('#track-name');
	var albumArt = $('#album-art'),
		sArea = $('#s-area'),
		seekBar = $('#seek-bar'),
		trackTime = $('#track-time'),
		insTime = $('#ins-time'),
		sHover = $('#s-hover'),
		playPauseButton = $("#play-pause-button"),
		i = playPauseButton.find('i'),
		tProgress = $('#current-time'),
		tTime = $('#track-length'),
		seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0,
		buffInterval = null, tFlag = false;
	
	var playPreviousTrackButton = $('#play-previous'), playNextTrackButton = $('#play-next'), currIndex = -1;
	
	var songs = [{
		artist: "Cool",
		name: "Aloha",
		url: "Musics/Aloha.m4a",
		picture: "https://i.imgur.com/B6Tyyyx.jpeg"
        },{
                artist: "Đức Phúc",     
                name: "Ánh Nắng Của Anh", 
                url: "Musics/AnhNangCuaAnh.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Huy feat Tùng Viu",     
                name: "Cô Gái M52", 
                url: "Musics/Cogaim52.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "JustaTee",     
                name: "Đã Lỡ Yêu Em Nhiều", 
                url: "Musics/DaLoYeuEmNhieu.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "MIN",     
                name: "Em Mới Là Người Yêu Anh", 
                url: "Musics/EmMoiLaNguoiYeuAnh.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Miu Lê feat DaLAB",     
                name: "Gác Lại Âu Lo", 
                url: "Musics/GacLaiAuLo.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Lee Seung Chul",     
                name: "My Love", 
                url: "Musics/MyLove.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Auburn",     
                name: "Perfect Two", 
                url: "Musics/PerfectTwo.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Jawsh 685",     
                name: "Savage Love", 
                url: "Musics/SavageLove.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Obito feat Seachains",     
                name: "Simple Love", 
                url: "Musics/SimpleLove.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Cinnamons",     
                name: "Summertime", 
                url: "Musics/Summertime.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "IU feat GDragon",     
                name: "Palatte", 
                url: "Musics/Palette.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Chromance",     
                name: "Wrap Me In Plastic", 
                url: "Musics/WrapMeInPlastic.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "MIN",     
                name: "Y.Ê.U", 
                url: "Musics/YEU.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Rhymastic",     
                name: "Yêu 5", 
                url: "Musics/Yeu5.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "DaLAB",     
                name: "Từ Ngày Em Đến", 
                url: "Musics/TuNgayEmDen.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Pharrell Williams",     
                name: "Happy", 
                url: "Musics/Happy.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Powful",     
                name: "DeathBed", 
                url: "Musics/deathbed.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Maroon 5",     
                name: "Maps", 
                url: "Musics/Maps.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
		artist: "Jeremy Zucker",     
                name: "Comethru", 
                url: "Musics/Comethru.m4a",     
                picture:"https://i.imgur.com/B6Tyyyx.jpeg"
        },{
	}];
	
	function shuffle(a) {
		var j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	}
	songs = shuffle(songs);

    function playPause()
    {
        setTimeout(function()
        {
            if(audio.paused)
            {
                playerTrack.addClass('active');
                albumArt.addClass('active');
                checkBuffering();
                i.attr('class','fas fa-pause');
                audio.play();
            }
            else
            {
                playerTrack.removeClass('active');
                albumArt.removeClass('active');
                clearInterval(buffInterval);
                albumArt.removeClass('buffering');
                i.attr('class','fas fa-play');
                audio.pause();
            }
        },300);
    }

    	
	function showHover(event)
	{
		seekBarPos = sArea.offset(); 
		seekT = event.clientX - seekBarPos.left;
		seekLoc = audio.duration * (seekT / sArea.outerWidth());
		
		sHover.width(seekT);
		
		cM = seekLoc / 60;
		
		ctMinutes = Math.floor(cM);
		ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
		
		if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
        if( (ctMinutes < 0) || (ctSeconds < 0) )
			return;
		
		if(ctMinutes < 10)
			ctMinutes = '0'+ctMinutes;
		if(ctSeconds < 10)
			ctSeconds = '0'+ctSeconds;
        
        if( isNaN(ctMinutes) || isNaN(ctSeconds) )
            insTime.text('--:--');
        else
		    insTime.text(ctMinutes+':'+ctSeconds);
            
		insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
		
	}

    function hideHover()
	{
        sHover.width(0);
        insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);		
    }
    
    function playFromClickedPos()
    {
        audio.currentTime = seekLoc;
		seekBar.width(seekT);
		hideHover();
    }

    function updateCurrTime()
	{
        nTime = new Date();
        nTime = nTime.getTime();

        if( !tFlag )
        {
            tFlag = true;
            trackTime.addClass('active');
        }

		curMinutes = Math.floor(audio.currentTime / 60);
		curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
		
		durMinutes = Math.floor(audio.duration / 60);
		durSeconds = Math.floor(audio.duration - durMinutes * 60);
		
		playProgress = (audio.currentTime / audio.duration) * 100;
		
		if(curMinutes < 10)
			curMinutes = '0'+curMinutes;
		if(curSeconds < 10)
			curSeconds = '0'+curSeconds;
		
		if(durMinutes < 10)
			durMinutes = '0'+durMinutes;
		if(durSeconds < 10)
			durSeconds = '0'+durSeconds;
        
        if( isNaN(curMinutes) || isNaN(curSeconds) )
            tProgress.text('00:00');
        else
		    tProgress.text(curMinutes+':'+curSeconds);
        
        if( isNaN(durMinutes) || isNaN(durSeconds) )
            tTime.text('00:00');
        else
		    tTime.text(durMinutes+':'+durSeconds);
        
        if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
            trackTime.removeClass('active');
        else
            trackTime.addClass('active');

        
		seekBar.width(playProgress+'%');
		
		if( playProgress == 100 )
		{
			i.attr('class','fa fa-play');
			seekBar.width(0);
            tProgress.text('00:00');
            albumArt.removeClass('buffering').removeClass('active');
            clearInterval(buffInterval);
			selectTrack(1);
		}
    }
    
    function checkBuffering()
    {
        clearInterval(buffInterval);
        buffInterval = setInterval(function()
        { 
            if( (nTime == 0) || (bTime - nTime) > 1000  )
                albumArt.addClass('buffering');
            else
                albumArt.removeClass('buffering');

            bTime = new Date();
            bTime = bTime.getTime();

        },100);
    }

    function selectTrack(flag)
    {
        if( flag == 0 || flag == 1 )
            ++currIndex;
        else
            --currIndex;

        if( (currIndex > -1) && (currIndex < songs.length) )
        {
            if( flag == 0 )
                i.attr('class','fa fa-play');
            else
            {
                albumArt.removeClass('buffering');
                i.attr('class','fa fa-pause');
            }

            seekBar.width(0);
            trackTime.removeClass('active');
            tProgress.text('00:00');
            tTime.text('00:00');
			
			currAlbum = songs[currIndex].name;
            currTrackName = songs[currIndex].artist;
            currArtwork = songs[currIndex].picture;

            audio.src = songs[currIndex].url;
            
            nTime = 0;
            bTime = new Date();
            bTime = bTime.getTime();

            if(flag != 0)
            {
                audio.play();
                playerTrack.addClass('active');
                albumArt.addClass('active');
            
                clearInterval(buffInterval);
                checkBuffering();
            }

            albumName.text(currAlbum);
            trackName.text(currTrackName);
            $('#album-art img').prop('src', bgArtworkUrl);
        }
        else
        {
            if( flag == 0 || flag == 1 )
                --currIndex;
            else
                ++currIndex;
        }
    }

    function initPlayer()
	{	
        audio = new Audio();

		selectTrack(0);
		
		audio.loop = false;
		
		playPauseButton.on('click',playPause);
		
		sArea.mousemove(function(event){ showHover(event); });
		
        sArea.mouseout(hideHover);
        
        sArea.on('click',playFromClickedPos);
		
        $(audio).on('timeupdate',updateCurrTime);

        playPreviousTrackButton.on('click',function(){ selectTrack(-1);} );
        playNextTrackButton.on('click',function(){ selectTrack(1);});
	}
    
	initPlayer();
});
