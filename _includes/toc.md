<script>
// https://github.com/ghiculescu/jekyll-table-of-contents
$(document).ready(function() {
  var no_back_to_top_links = false

  var headers = $('h1, h2, h3, h4, h5, h6').filter(function() {return this.id}), // get all headers with an ID
      output = $('.toc');
  if (!headers.length || headers.length < 3 || !output.length)
    return;

  var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10) }
  var highest_level = headers.map(function(_, ele) { return get_level(ele) }).get().sort()[0]
  var return_to_top = '<i class="icon-arrow-up back-to-top">&uarr;</i>'
  //var return_to_top = ''

  var level = get_level(headers[0]), this_level, html = "<ul>";
  headers.on('click', function() {
    if (!no_back_to_top_links) window.location.hash = this.id
  }).addClass('clickable-header').each(function(_, header) {
    this_level = get_level(header);
    if (!no_back_to_top_links && this_level === highest_level) {
      $(header).addClass('top-level-header').after(return_to_top)
    }
    if (this_level === level) // same level as before; same indenting
      html += "<li><a href='#" + header.id + "'>" + header.innerHTML + "</a></li>";
    else if (this_level < level) // higher level than before; end parent ol
      html += "</ul><li><a href='#" + header.id + "'>" + header.innerHTML + "</a></li>";
    else if (this_level > level) // lower level than before; expand the previous to contain a ol
      html += "<ul><li><a href='#" + header.id + "'>" + header.innerHTML + "</a></li>";
    level = this_level; // update for the next one
  });
  html += "</ul>";
  if (!no_back_to_top_links) {
    $(document).on('click', '.back-to-top', function() {
      $(window).scrollTop(0)
      window.location.hash = ''
    })
  }
  output.hide().html(html).show('slow');
});
</script>
<div class="toc-header">
<div class="toc-title" style="font-weight: bold; font-size: 1.2em; padding:0.5em 15px 0 0; border-bottom:1px #cccccc solid;"> 内容索引 </div>
<div class="toc"></div>
</div>

