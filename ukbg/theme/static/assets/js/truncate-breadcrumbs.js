$.fn.breadcrumbs = function(options) {
  let el = $(this);

  // truncate individual titles if over set length
  $("a", el).each(function() {
    let crumbTitle = $(this).text();

    if (crumbTitle.length > options.crumbMaxLength) {
      $(crumbTitle).text(
        $.trim(crumbTitle)
          .substring(0, 40)
          .split(" ")
          .slice(0, -1)
          .join(" ") + "…"
      );
    }
  });

  // remove the link from the current page crumb
  $(".active", el).replaceWith($("<span/>").text($(".active", el).text()));

  let crumbs = $.map($("a, span" ,el).toArray(), function(x) {
    return x.outerHTML;
  });

  // if truncation needed
  if (crumbs.length > options.maxLevels) {
    let firstCrumbs = crumbs.slice(1, options.startCrumbs);
    let hideCrumbs = '<a href="#" title="Show all">…</a>';
    let lastCrumbs = crumbs.slice(crumbs.length - options.endCrumbs);
    let newCrumbs = firstCrumbs.concat([hideCrumbs]).concat(lastCrumbs);
    el.html(options.intro + newCrumbs.join(options.separator));
  } else {
    el.html(options.intro + crumbs.join(options.separator));
  }

  // show the hidden breadcrumb when ellipsis is clicked
  $("[title]", el).click(function() {
    el.html(options.intro + crumbs.join(options.separator));
  });
};

// breadcrumb truncation settings
$(".breadcrumb").breadcrumbs({
  intro: "<span>Sie sind hier: </span>",
  separator: " ≫ ",
  maxLevels: 5,
  startCrumbs: 2,
  endCrumbs: 2,
  crumbMaxLength: 40
});
