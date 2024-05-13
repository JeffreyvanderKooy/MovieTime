$(".underline").on("click", () => {
        $(".form_slider").toggleClass("form_slider-change");   
});

// home page //

// user settings functions //

$(".account_setting").hide();

$(".account").on("click", () => {
    if ($(".account_setting").is(":hidden")) {
        $(".account_setting").slideDown();
    } else {
        $(".account_setting").slideUp();
    }
});

// carousel functions // 

if ($(".watchcard").length > 3) {
    $(".watchlist_carousel").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
    });
}

if ($(".result").length > 4) {
    $(".result_carousel").slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        autoplay: true,
        infinite: false,
    });
}

$(".coming_soon-carousel").slick({
    slidesToScroll: 4,
    slidesToShow: 4,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 5000,
})

$(".playing_now-carousel").slick({
    slidesToScroll: 4,
    slidesToShow: 4,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 5000,
})
