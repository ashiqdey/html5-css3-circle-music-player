$(document).ready(function() {

    var player = $('#player').get(0);

    PLAYLIST = [];
    SHUFFLE = false;
    REPEAT = false;
    CURRENT = 0;

    player.volume = "0.8";

    $('.action').toggle(function() {
		play();
    }, function() {
		pause();
    });

    $('.action').hover(function() {
        $('.controls').addClass('active');
    });


    function play () {
        player.play();
        $('.icon-play').hide();
        $('.icon-pause').show();
    }

    function pause () {
        player.pause();
        $('.icon-play').show();
        $('.icon-pause').hide();
    }


    $('.volume-show').click(function() {
        $('.volume-holder').show();
    });

    $('#volume').change(function() {
        player.volume = $(this).val();
        $(this).data('val', $(this).val());
        if (player.volume === 0) {
            mute();
        } else {
            unmute();
        }
    });

    $('#mute').click(function() {
        if (player.volume === 0) {
            unmute();
            var previousVolume = $('#volume').data('val');
            if (previousVolume == 0 || !previousVolume) {
                $('#volume').data('val', '0.8');
            }
            player.volume = $('#volume').data('val');
            $('#volume').val(player.volume);
        } else {
            mute();
            $('#volume').val(0);
            player.volume = 0;
        }
    });


    function mute() {
        $('#mute').removeClass('normal').addClass('mute');
    }

    function unmute() {
        $('#mute').removeClass('mute').addClass('normal');
    }


    $('.playlist-show').click(function() {
        $('.playlist-holder').show();
    });


    $('#position').change(function() {
        var position = player.duration * $(this).val() / 100;
        player.currentTime = position;
    });

    player.addEventListener('timeupdate', function(evt) {
        var played = player.currentTime / player.duration * 100;
        $("#played").css("width", played + "%");
        $("#position").val(played);
    });

    player.addEventListener('progress', function(evt) {
        try {
            var loaded = player.buffered.end(0) / player.duration * 100;
            $("#loaded").css("width", loaded + "%");
        } catch (e) {
            console.log('buffer error');
        }
    });

    player.addEventListener('loadedmetadata', function(evt) {
        console.log('load');
        var duration = player.duration + "s";
        $('.spinner').attr("style", "-webkit-animation: rota " + duration + " linear infinite");
        $('.filler').attr("style", "-webkit-animation: opa " + duration + " steps(1,end) infinite reverse");
        $('.mask').attr("style", "-webkit-animation: opa " + duration + " steps(1,end) infinite");
    });

    player.addEventListener('ended', function(evt) {
		pause();
        if (SHUFFLE) {
            CURRENT = parseInt(Math.random() * PLAYLIST.length + 1);
        } else {
            CURRENT++;
        }
        if (CURRENT >= PLAYLIST.length) {
            CURRENT = 0;
        }
        loadSong(CURRENT);
        play();
    });


    $('#fileInput').change(function(e) {
        var files = e.target.files;
        var count = 0;
        $('.playlist').html('');

        PLAYLIST = [];
        for (var i in files) {
            if (files[i].name && files[i].name.indexOf('mp3') != -1) {
                //var text = files[i].webkitRelativePath.split("/");
                //text = text[text.length - 1].replace('.mp3','') + " - " + text[text.length - 2];
                //var text = files[i].name;
                var text = files[i].webkitRelativePath.replace(/\//g,' - ').replace('.mp3','');
                var li = $('<li />').data('id', count).text(text);
                $('.playlist').append(li);
                PLAYLIST.push(files[i]);
                count++;
            }
        }

        loadSong(0);
        play();

    });

    $('.shuffle').toggle ( function () {
        SHUFFLE = true;
        $(this).addClass('active');
    }, function () {
        SHUFFLE = false;
        $(this).removeClass('active');
    });

    $('.repeat').toggle ( function () {
        REPEAT = true;
        $(this).addClass('active');
    }, function () {
        REPEAT = false;
        $(this).removeClass('active');
    });

    $('.playlist').delegate('li', 'click', function() {
        var id = $(this).data('id');
        loadSong(id);
        play();
    });

    function loadSong (id) {
		var file = PLAYLIST[id];
		var url = window.webkitURL.createObjectURL(file);
		player.setAttribute('src', url);
        $('.playlist li').removeClass('active');
        $('.playlist li:nth-child(' + (parseInt(id) + 1) + ')').addClass('active');
    }


});

