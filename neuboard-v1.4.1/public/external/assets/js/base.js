/*
JS file for kazume
*/

(function($) {
  $(document).ready(function() {
    $(".circles .circle").hover(function(e) {
      var target = $(this).attr("rel");
      $(".circles .active").removeClass("active");
      $(this).addClass("active");
      $(".steps .active").removeClass("active");
      $(".steps").find("#" + target).addClass('active');
      e.stopPropagation();
    });
    
    $("a.modal").click(function(e) {
      e.preventDefault();
      $("#privacy-modal").modal({
        overlayClose: true,
        autoPosition: true
      });
    });
  });
})(jQuery);
