(function() {
  $(function() {
    $(document).foundation();
    return $(document).ready(function() {
      return $('.join-click').click(function(e) {
        e.preventDefault();
        return $('.join').slideDown();
      });
    });
  });

}).call(this);
