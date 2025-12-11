(function($){
  $.fn.highlightToggle = function(opts){
    const settings = $.extend({ duration: 300 }, opts);
    return this.each(function(){
      const $el = $(this);
      if($el.hasClass('highlighted')){
        $el.removeClass('highlighted');
        $el.animate({opacity:0.85}, settings.duration, function(){ $el.css('opacity','1'); });
      } else {
        $el.addClass('highlighted');
        $el.css('opacity',0.85).animate({opacity:1}, settings.duration);
      }
    });
  };
})(jQuery);

$(function(){
  $('#dob').datepicker({ changeMonth:true, changeYear:true, yearRange:'1900:+10' });

  $('#predictBtn').on('click', function(){
    const name = $('#name').val().trim();
    if(!name){
      $('#result').text('Please enter a name.').show();
      $('#result').highlightToggle({duration:200});
      return;
    }

    $('#result').text('Loading...').show();

    $.ajax({
      url: 'https://api.agify.io',
      method: 'GET',
      data: { name: name },
      dataType: 'json',
      success: function(data){
        const html = `<strong>Name:</strong> ${escapeHtml(data.name || '')}<br>
                      <strong>Predicted age:</strong> ${escapeHtml(data.age == null ? 'Unknown' : data.age)}<br>
                      <strong>Dataset count:</strong> ${escapeHtml(data.count || 0)}`;
        $('#result').html(html).show().highlightToggle({duration:400});

        if(!$('#result').data('ui-dialog')){
          $('#result').dialog({ title:'Result', width:360 });
        } else {
          $('#result').dialog('open');
        }
      },
      error: function(){
        $('#result').text('Error fetching data.').show();
        $('#result').highlightToggle({duration:200});
      }
    });
  });

  $('#clearBtn').on('click', function(){
    $('#name').val('');
    $('#result').hide();
    if($('#result').data('ui-dialog')) $('#result').dialog('close');
  });

  function escapeHtml(s){
    if(s == null) return '';
    return String(s).replace(/[&"'<>]/g, c => ({'&':'&amp;','"':'&quot;',"'":'&#39;','<':'&lt;','>':'&gt;'}[c]));
  }
});
