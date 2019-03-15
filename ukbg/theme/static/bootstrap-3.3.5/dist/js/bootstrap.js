/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2019 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.5'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.5
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.5'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.5
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.5'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.5
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.5'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.5
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.5'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/*!
 * IE10 viewport hack for Surface/desktop Windows 8 bug
 * Copyright 2014-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

// See the Getting Started docs for more information:
// http://getbootstrap.com/getting-started/#support-ie10-width

(function () {
  'use strict';

  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style')
    msViewportStyle.appendChild(
      document.createTextNode(
        '@-ms-viewport{width:auto!important}'
      )
    )
    document.querySelector('head').appendChild(msViewportStyle)
  }

})();

$(document).ready(function () {
  $('[data-toggle="offcanvas"]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
});

// Use this for a navbar sticky after scrolling down 
//$('#stickyNav').affix({
//});
/* ***********************************************************
   ******************** CODETABS SCRIPT **********************
   *********************************************************** */

!function(e){"use strict";window.csPLUGIN||(window.csPLUGIN={}),window.csVAR||(window.csVAR={codeName:"codetabs",codeData:"tabs",codeClass:"ct",namespace:"ct-"}),e[csVAR.codeName]=function(t,a){var i,n,s,r,o,l,d,c,u,p,f,h,g,v,w,C,y,x,b=t,I=e(window),$=e(document),N={},T={},L={},k={},R={},A={},D=Math,S=void 0,P=D.ceil(1e9*D.random()),E="<div></div>",O=e.extend(!0,{},a),M={cs:N,o:a,oo:O,va:T,is:R,ti:A,ds:L},B=csVAR.num;B=B==S?0:B+1,T.codeID=csVAR.num=B,csVAR["one"+B]=M;var F={check:function(){N.ev.trigger("init"),X.setupFirst(),X.browser(),X.cssName(),H.get(),it.prop(),V.check()?F.pre():b.remove()},pre:function(){b.children().length&&(J.get(),R.show?(!!a.showFrom&&J.check(),R.awake?F.ready():J.resizeON()):b.remove())},ready:function(){U.structure(),H.code(),R.pag&&U.pag(),R.nav&&U.nav(),a.isCap&&U.cap(),!T.$playpause&&a.slideshow.isPlayPause&&a.isSlideshow&&U.play(),mt&&ct.render(),H.slide(),U.other(),H.deepLinkCookie(),G.way(),G.next(T.$s.eq(N.idCur))},load:function(){R.initLoaded=1,b.addClass(a.ns+"ready").removeClass(a.ns+"init"),R.pag&&!R.pagList&&j.sizeItem(),W.general(),0==N.idCur&&N.ev.trigger("start"),"dash"==a.layout?X.toggleDash():X.toggle(),R.nav&&K.nav(),R.pag&&K.pag(),K.resize(),K.swipe(),K.click(),K.keyboard(),K.mousewheel(),pt&&rt.events(),a.isSlideshow&&gt&&dt.init(),H.initEnd()}},X={setupFirst:function(){T.codekey=P,T.$cs=b,null==a.ns&&(a.ns=csVAR.namespace),A.layer=[],T.nVideoOpen=T.nMapOpen=0,R.click=1,T.fxLast=T.fxCur="none",T.classAdd=[]},browser:function(){var e=navigator.userAgent;R.ie=!1||document.documentMode,R.safari=/Constructor/i.test(Object.prototype.toString.call(window.HTMLElement)),R.opera=!!window.opera||/\sOPR\//i.test(e),R.chrome=!!window.chrome&&!R.opera,R.firefox=window.InstallTrigger!==S,R.ie11=!(!R.ie||new Function("/*@cc_on return @_jscript_version; @*/")()),R.ie7=!(!R.ie||!/MSIE\s7\./i.test(e));var t=["ie","safari","opera","chrome","firefox"];for(x=t.length;x>=0;x--)if(R[t[x]]){R.browser=t[x];break}R.e="object"==typeof console,R.canvas2d=function(){var e=document.createElement("canvas");return!(!e.getContext||!e.getContext("2d"))}(),R.msGesture=!!(window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture),R.evTouch=!!("ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch),R.evPointer=!!window.PointerEvent,R.evMSPointer=!!window.MSPointerEvent,R.touchSupport=R.evTouch||R.evPointer||R.evMSPointer,R.mobile=R.touchSupport&&/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera|Windows\sPhone|Chrome|PSP|Dolphin|Silk/i.test(e),R.androidNative=R.mobile&&/Mozilla\/5\.0/i.test(e)&&/Android/i.test(e)&&/AppleWebKit/i.test(e)&&!/Chrome/i.test(e)&&!/Android\s+4\.4/i.test(e);var a=".code"+P,i=["","",""];R.evTouch?i=["touchstart","touchmove","touchend"]:R.evPointer?i=["pointerdown","pointermove","pointerup"]:R.evMSPointer&&(i=["MSPointerDown","MSPointerMove","MSPointerUp"]),T.ev={click:"click"+a,drag:"dragstart"+a+" selectstart"+a,resize:"resize"+a,scroll:"scroll"+a,key:"keyup"+a,wheel:"mousewheel"+a,hash:"hashchange"+a,touch:{start:i[0]+a,move:i[1]+a,end:i[2]+a,type:"touch"},mouse:{start:"mousedown"+a,move:"mousemove"+a,end:"mouseup"+a,type:"mouse"}}},cssName:function(){var e=function(){var e,t=document.createElement("p"),a={webkitTransform:"-webkit-transform",MozTransform:"-moz-transform",transform:"transform"};document.body.insertBefore(t,null);for(var i in a)t.style[i]!==S&&(t.style[i]="translate3d(1px,1px,1px)",e=window.getComputedStyle(t).getPropertyValue(a[i]));return document.body.removeChild(t),e!==S&&e.length>0&&"none"!==e};csVAR.isTf3D==S&&(csVAR.isTf3D=e());var t=function(e,t){var a=document.createElement("p").style,i=["Webkit","Moz","ms","O"],n=["-webkit-","-moz-","-ms-","-o-"];if(""===a[e])return"is"==t?1:"pre"==t?"":e;for(e=e.charAt(0).toUpperCase()+e.slice(1),x=i.length;x--;)if(""===a[i[x]+e])return"is"==t?1:"pre"==t?n[x]:i[x]+e;return 0},a="transform",i="transition";if(R.ts=t(i,"is"),R.ts){var n=T.prefix=t(a,"pre"),s="-timing-function";g=T.cssTf=n+a,v=t(i,"pre")+i,T.cssD=v+"-duration",w=v+s,C=n+"animation-duration",y=n+"animation"+s}var r="translate3d(",o=csVAR.isTf3D;T.tl0=o?r:"translate(",T.tl1=o?",0)":")",T.tlx0=o?r:"translateX(",T.tlx1=o?",0,0)":")",T.tly0=o?r+"0,":"translateY(",T.tly1=o?",0)":")"},easeName:function(t){if("linear"==t)return"linear";if(R.ts){if("swing"==t)return"ease";var a;switch(t=t.replace("ease","")){case"InSine":a=".47,0,.745,.715";break;case"OutSine":a=".39,.575,.565,1";break;case"InOutSine":a=".445,.05,.55,.95";break;case"InQuad":a=".55,.085,.68,.53";break;case"OutQuad":a=".25,.46,.45,.94";break;case"InOutQuad":a=".455,.03,.515,.955";break;case"InCubic":a=".55,.055,.675,.19";break;case"OutCubic":a=".215,.61,.355,1";break;case"InOutCubic":a=".645,.045,.355,1";break;case"InQuart":a=".895,.03,.685,.22";break;case"OutQuart":a=".165,.84,.44,1";break;case"InOutQuart":a=".77,0,.175,1";break;case"InQuint":a=".755,.05,.855,.06";break;case"OutQuint":a=".23,1,.32,1";break;case"InOutQuint":a=".86,0,.07,1";break;case"InExpo":a=".95,.05,.795,.035";break;case"OutExpo":a=".19,1,.22,1";break;case"InOutExpo":a="1,0,0,1";break;case"InCirc":a=".6,.04,.98,.335";break;case"OutCirc":a=".075,.82,.165,1";break;case"InOutCirc":a=".785,.135,.15,.86";break;case"InBack":a=".6,-.28,.735,.045";break;case"OutBack":a=".175,.885,.32,1.275";break;case"InOutBack":a=".68,-.55,.265,1.55";break;case"InElastic":case"OutElastic":case"InOutElastic":case"InBounce":case"OutBounce":case"InOutBounce":default:a=".25,.1,.25,1"}return"cubic-bezier("+a+")"}return e.easing&&e.easing[t]?t:"swing"},toggle:function(){var e=N.idCur,t=N.idLast,i=T.$s.eq(e),n=T.$s.eq(t),s=a.ns+a.current;if(n.removeClass(s),i.addClass(s),t!=S&&N.ev.trigger("deselectID",t),N.ev.trigger("selectID",e),R.pag&&(T.$pagItem.eq(t).removeClass(s),T.$pagItem.eq(e).addClass(s)),R.nav){var l=a.ns+a.inActived;a.isLoop?(r.hasClass(l)&&r.removeClass(l),o.hasClass(l)&&o.removeClass(l)):(0==e&&r.addClass(l),e==u-1&&o.addClass(l),0!=e&&r.hasClass(l)&&r.removeClass(l),e!=u-1&&o.hasClass(l)&&o.removeClass(l))}a.isCap&&Z.toggle(i,n),G.add(i),"auto"==a.height&&_.swapHNative(),nt.toggle(),t!=S&&(a.isDeeplinking&&pt&&rt.write(),a.isCookie&&ft&&ot.write())},toggleDash:function(){if(R.pag){for(var e=L.pagNum-1,t=a.ns+a.current;L.nEnd<L.pagID[e];)e--;var i=T.$pagItem.eq(L.pagID[e]);T.$pagItem.not(i).removeClass(t),i.addClass(t)}if(R.nav&&!a.isLoop){var n=a.ns+a.inActived;0==L.nBegin&&r.addClass(n),L.nEnd==u-1&&o.addClass(n),0!=L.nBegin&&r.hasClass(n)&&r.removeClass(n),L.nEnd!=u-1&&o.hasClass(n)&&o.removeClass(n)}},toggleFree:function(){var e=a.fName+"-out",t=a.fName+"-in",i=T.$s.eq(N.idCur),n=T.$s.eq(N.idLast);i.hasClass(e)&&i.removeClass(e),i.hasClass(t)||i.addClass(t),n.hasClass(e)||n.addClass(e),n.hasClass(t)&&n.removeClass(t)},toggleClass:function(e,t){if("grab"!=e||!R.mobile){var i=a.className[e],n=a.ns+i[0],s=a.ns+i[1],r=t?n:s,o=t?s:n,l=X.sSwap().viewport;-1==t?(l.hasClass(n)&&l.removeClass(n),l.hasClass(s)&&l.removeClass(s)):(!l.hasClass(r)&&l.addClass(r),l.hasClass(o)&&l.removeClass(o))}},valueX:function(e){var t=e.substr(7,e.length-8).split(", ");return parseInt(t[4])},valueName:function(e,t,a,i,n){var s,r,o="#[0-9a-f]{3}([0-9a-f]{3})?",l="(\\s*(1|0?\\.?\\d*))?\\s*",d="(rgba|rgb)\\(\\s*((\\d{1,2}|1\\d+\\d|2([0-4]\\d|5[0-5]))\\s*,?){3}"+l+"\\)",c="(hsla|hsl)\\(\\s*(\\d{1,2}|[1-2]\\d{2}|3[0-5]\\d)\\s*,(\\s*(\\d{1,2}|100)\\%\\s*,?){2}"+l+"\\)",u="((\"|').*(\"|')\\-?){1,3}",p="(\\u005B.*\\u005D\\-?){1,3}",f="(\\u007B.*\\u007D\\-?){1,3}",h="((\\d*\\.?\\d+)|\\w*)(\\-+((\\d*\\.?\\d+)|\\w*)){0,3}",g=t+"\\-+("+o+"|"+d+"|"+c+"|"+f+"|"+p+"|"+u+"|"+h+")",m=/^(\u0022|\u0027).*(\u0022|\u0027)$/g,v=/^\u005B.*\u005D$/g,w=/^\u007B.*\u007D$/g,C="csStoreStr",y=function(e){if(e=e.replace(t+"-",""),"object"==typeof i){if(-1!=i.indexOf(e))return e;var n="[ "+csVAR.codeName+": no value name '"+e+"' ]";return R.e&&console.log(n),a}return X.pFloat(e)},b=function(t){if(/\w+\-+\w+/g.test(t)){var a=e.match(/\-+\d*\.?\d*/g);if("-"!=a[0]&&"-"!=a[1])for(var i=a.length-1;i>=0;i--)a[i]=a[i].replace(/^\-/g,""),a[i]=parseFloat(a[i]);else{a=e.match(/\-+\w+/g);for(var i=a.length-1;i>=0;i--)a[i]=a[i].replace(/^\-/g,""),a[i]=X.pFloat(a[i])}t=a}return X.pFloat(t)},I=function(e){return w.test(e)?e=N(e):v.test(e)?e=T(e):m.test(e)&&(e=L(e)),e},$=function(e){for(var t=[],a=1,i=e.indexOf("'");-1!=i;){if(a)e=e.replaceAt("«",i),a=0;else{e=e.replaceAt("»",i),a=1;var n=e.indexOf("«"),s=e.indexOf("»"),r=e.substr(n+1,s-n-1);t.push(r),e=e.replaceAt(C,n,s-n+1)}i=e.indexOf("'")}return{array:t,value:e}},N=function(e){e=e.substr(0,e.indexOf("}")).replace(/^\u007B/g,"");for(var t=$(e),a=t.value.replace(/\s+/g,"").split(","),i={},n=0,s=a.length;s>n;n++){var r=a[n].split(":");1==r.length&&(r[1]=null),r[0]==C&&(r[0]=t.array.shift()),r[1]==C&&(r[1]=t.array.shift()),i[r[0]]=X.pFloat(r[1])}return i},T=function(e){e=e.substr(0,e.indexOf("]")).replace(/^\u005B/g,"");for(var t=$(e),a=t.value.replace(/\s+/g,"").split(","),i=[],n=0,s=a.length;s>n;n++)a[n]==C&&(a[n]=t.array.shift()),a[n]=X.pFloat(a[n]),i.push(a[n]);return i},L=function(e){e=e.replace(/(^\u0027|\u0027$)/g,"");var t=e.split(/\u0027\-\u0027/g);return 1==t.length&&(t=t[0]),t};if(s=new RegExp(g,"g"),r=e.match(s),null!=r){var k=r.length,A=[];for(x=0;k>x;x++)A[x]=y(r[x]),""==A[x]&&a!=S&&(A[x]=a),A[x]=X.pFloat(A[x]),n&&(A[x]=b(A[x]));return 1==k&&(A=A[0]),A=I(A)}return a!=S?a:!1},valueMax:function(e,t,a){var i,n=0;for(x=e.length-1;x>=0;x--)i=a?e.eq(x)[t](a):e.eq(x)[t](),i=X.pInt(i),i>n&&(n=i);return n},proto:{arrayIndex:function(){Array.prototype.indexOf=function(e){for(var t=this.length>>>0,a=0;t>a;a++)if(a in this&&this[a]===e)return a;return-1}},replaceAt:function(){String.prototype.replaceAt=function(e,t,a){return a==S&&(a=1),this.substr(0,t)+e+this.substr(t+a)}},ajax:function(){if(!e.support.cors&&e.ajaxTransport&&window.XDomainRequest){var t=new RegExp("^"+location.protocol,"i");e.ajaxTransport("* text html xml json",function(a,i){if(a.crossDomain&&a.async&&/^get|post$/i.test(a.type)&&/^https?:\/\//i.test(a.url)&&t.test(a.url)){var n=null,s=(i.dataType||"").toLowerCase();return window.isXDomainRequest=1,{send:function(t,r){n=new XDomainRequest,/^\d+$/.test(i.timeout)&&(n.timeout=i.timeout),n.ontimeout=function(){r(500,"timeout")},n.onload=function(){var t="Content-Length: "+n.responseText.length+"\r\nContent-Type: "+n.contentType,a={code:200,message:"success"},i={text:n.responseText};try{if("html"===s||/text\/html/i.test(n.contentType))i.html=n.responseText;else if("json"===s||"text"!==s&&/\/json/i.test(n.contentType))try{i.json=e.parseJSON(n.responseText)}catch(o){a.code=500,a.message="parseerror"}else if("xml"===s||"text"!==s&&/\/xml/i.test(n.contentType)){var l=new ActiveXObject("Microsoft.XMLDOM");l.async=!1;try{l.loadXML(n.responseText)}catch(o){l=S}if(!l||!l.documentElement||l.getElementsByTagName("parsererror").length)throw a.code=500,a.message="parseerror","Invalid XML: "+n.responseText;i.xml=l}}catch(d){throw d}finally{r(a.code,a.message,i,t)}},n.onprogress=function(){},n.onerror=function(){r(500,"error",{text:n.responseText})};var o="";i.data&&(o="string"===e.type(i.data)?i.data:e.param(i.data)),n.open(a.type,a.url),n.send(o)},abort:function(){n&&n.abort()}}}})}}},scroll:{setup:function(){if(a.slideshow.isRunInto){R.into=0,X.scroll.check();var e=200;I.off(T.ev.scroll),I.on(T.ev.scroll,function(){clearTimeout(A.scroll),A.scroll=setTimeout(function(){!R.pauseActive&&X.scroll.check()},e)})}else R.into=1,gt&&dt.go()},check:function(e){X.scroll.position();var t=T.topW<=T.topCS+100&&T.botW>=T.botCS-100||p>=T.hWin&&T.botW-50>=T.topCS&&T.topW-50<=T.botCS;t?R.into||(R.into=1,!e&&gt&&dt.go()):R.into&&(R.into=0,!e&&gt&&dt.go())},position:function(){T.topW=I.scrollTop(),T.botW=T.hWin+T.topW,T.topCS=b.offset().top,T.botCS=T.topCS+p}},a:function(e){return D.abs(e)},r:function(e){return D.round(e)},c:function(e){return D.ceil(e)},ra:function(){return D.random()},rm:function(e,t){return X.ra()*(t-e)+e},raExcept:function(e,t,a){var i;if(a==e)i=X.rm(e+1,t);else if(a==t)i=X.rm(e,t-1);else{var n=e,s=a-1,r=a+1,o=t;i=X.ra()>=.5?n==s?n:X.ra(n,s):r==o?o:X.ra(r,o)}return X.r(i)},cssD1:function(){T.cssD1[T.cssD]=T.speed[N.idCur]+"ms"},tl:function(e,t,a){var a=a?a:"px";return T.tl0+e+a+", "+t+a+T.tl1},tlx:function(e,t){var t=t?t:"px";return R.ts?T.tlx0+e+t+T.tlx1:e+t},tly:function(e,t){var t=t?t:"px";return R.ts?T.tly0+e+t+T.tly1:e+t},tsAdd:function(e,t,a){var i={};a||(a=T.ease),i[v]=g+" "+t+"ms "+a,e.css(i)},tsRemove:function(e){var t={};t[v]="none",e.css(t),setTimeout(function(){t[v]="",e.css(t)},0)},tfRemove:function(e){var t={};t[g]="",e.css(t)},ts:function(e,t,a,i){a=a?" "+a:"",i=i?" "+i+"ms":"";var n={};return n[v]=e+" "+t+"ms"+a+i,n},pFloat:function(e){if(/^\-?\d*\.?\d+$/g.test(e)){var t=parseFloat(e);if(9007199254740992>t)return t}else/(^false$)|(^off$)/g.test(e)&&(e=!1);return e},pInt:function(e){return/^\-?\d+/g.test(e)?parseInt(e):0},shift:function(e,t){t?e.shift():e.pop()},push:function(e,t,a){a?e.push(t):e.unshift(t)},sSwap:function(){var e=i.is(T.swipeCur)?T.can:T.pag;return e}},H={get:function(){!Array.prototype.indexOf&&X.proto.arrayIndex(),!String.prototype.replaceAt&&X.proto.replaceAt();var t={layout:["line","dot","dash","free"],view:["basic","coverflow","scale","mask"],height:["auto","fixed"],imgWidth:["none","autofit","smallfit","largefit"],imgHeight:["none","autofit","smallfit","largefit"],img:["autofit","autofill","smallfit","largefit","smallfill","largefill"],timer:["none","bar","arc","number"],dirs:["hor","ver"]},i={};H.split(i,b.attr("data-"+csVAR.codeData),t),a=e.extend(!0,a,i)},split:function(e,t,a,i){if(t!=S&&""!=t){for(var n=t.replace(/\s*\n+\s*/g," "),s=t.replace(/\s+/g," ").replace(/^\s*|\s*$/g,"").split(" "),r=0,o=s.length;o>r;r++){var l=s[r].match(/^\w*/g)[0],d=s[r].indexOf("-"),c=s[r].replace(l+"-","");if(-1!=d&&""!=c){var u=a[l],p=i?s[r]:n;"is"==l.substr(0,2)?-1!=="ontrue1".indexOf(c)?e[l]=1:-1!=="offalse0".indexOf(c)&&(e[l]=0):(u=u?u:0,e[l]=X.valueName(p,l,e[l],u,i))}}i||(e.strData=n)}},chain3:function(e,t){"number"==typeof e?e=[e+"-0-100000"]:"string"==typeof e&&(e=[e]);var a={num:e.length},i=0,n=t?t:"value";for(x=a.num-1;x>=0;x--){"number"==typeof e[x]&&(e[x]+="-0-100000");var s=e[x].split("-");a[x]={from:parseInt(s[1]),to:parseInt(s[2])},a[x][n]=parseFloat(s[0]),i=i<parseInt(s[2])?s[2]:i}return a.wMax=parseInt(i),a},chain4:function(e){"number"==typeof e?e=[e+"-"+e+"-0-100000"]:"string"==typeof e&&(e=[e]);var t={num:e.length},a=0;for(x=t.num-1;x>=0;x--){"number"==typeof e[x]&&(e[x]+="-"+e[x]+"-0-100000");var i=e[x].split("-");2==i.length?(i[2]=0,i[3]=1e5):3==i.length&&i.unshift(i[0]),t[x]={left:parseInt(i[0]),right:parseInt(i[1]),from:parseInt(i[2]),to:parseInt(i[3])},a=a<parseInt(i[3])?i[3]:a}return t.wMax=parseInt(a),t},setupBegin:function(){if(!R.setupInit){a.height0=a.height,T.swipeCur=i,T.can={viewport:n},T.pag={},R.swipeLimit=0;var e=" "+a.ns,t="";"firefox"==R.browser&&(t+=e+"firefox"),R.ie7&&(t+=e+"ie7"),R.mobile&&(t+=e+"mobile"),R.androidNative&&(t+=e+"androidNative"),b.addClass(t)}},swipeEvent:function(){if(R.setupInit||(R.move=0,R.swipeTypeCur=null),!a.isSwipe||R.mobile&&!a.swipe.isMobile)R.swipePag=R.swipeBody=0;else{R.swipePag=1;var e=a.swipe;R.swipeBody=R.mobile&&e.isBodyOnMobile&&!e.isBody?1:!!e.isBody}},deepLinkCookie:function(){a.isDeeplinking?pt&&rt.read():a.isCookie&&ft&&ot.read()},idNum:function(){var e=a.idBegin;"begin"==e?e=0:"center"==e?e=~~(u/2-.5):"centerRight"==e?e=~~(u/2):"end"==e?e=u-1:0>=e?e=0:e>=u&&(e=u-1),N.idCur||(N.idCur=a.idBegin=e),R.nav=a.isNav,R.pag=a.isPag,R.center=a.isCenter,1==u&&(R.nav=R.center=0,"tab"!=a.pag.type&&(R.pag=0)),2==u&&"line"==a.layout&&(R.center=0)},center:function(){if(R.cenLoop=R.center&&a.isLoop,R.cenLoop){T.center={};var t=T.center;t.isNum=X.c(u/2)>u/2?"odd":"even",q.centerIdMap(),!!T.sClone&&T.sClone.remove(),T.sClone=e("");var i=~~((u-1)/2),n="odd"==t.isNum?i:i+1;t.n={left:i,right:n}}else T.center=null,a.isLoop=0},slideshow:function(){var e=a.slideshow;R.timer=!(!a.isSlideshow||!e.isTimer),T.timer="arc"!=e.timer||R.canvas2d?e.timer:"bar",R.autoRun=!(e.isPlayPause&&!e.isAutoRun),R.pauseActive=!R.autoRun},transform:function(){T.cssD0={},T.cssD1={},T.cssD0[T.cssD]="",T.xTimer=100,"free"!=a.layout&&(T.ease=X.easeName(a.easeTouch),R.ease=R.easeLast="touch")},layout:function(){var e=a.layout;"line"==e&&(a.fx||a.fxIn||a.fxOne)?a.layout="dot":"free"!=e||R.ts||(a.layout=a.layoutFall),"line"==a.fx&&(a.layout="line"),"dash"==e?(R.thumb=0,L.nBegin=0,L.nEnd=0,L.pMax=0,R.setupInit||(L.height=[]),a.isLoop=0):(a.stepNav=1,a.stepPlay=1)},fullscreen:function(){a.isFullscreen&&(a.height="fixed",null!=a.offsetBy&&("string"==typeof a.offsetBy?T.offsetBy={top:a.offsetBy,bottom:null}:"object"==typeof a.offsetBy&&(T.offsetBy={top:a.offsetBy[0],bottom:a.offsetBy[1]})))},res:function(){var e=a.responsive;if(e){if("number"==typeof e)T.wRes=e,T.hRes=0;else if("string"==typeof e){var t=e.split("-");T.wRes=parseInt(t[0]),T.hRes=parseInt(t[1]),T.hRes&&(a.height="fixed")}a.isFullscreen&&(0==T.hRes&&(T.hRes=T.wRes),T.rRes=T.wRes/T.hRes)}R.res=!!e,T.media=a.media?H.chain3(a.media):null,T.pa={left:a.padding,top:0},T.paRange=0!=a.padding?H.chain3(a.padding):null,T.maRange=0!=a.margin?H.chain4(a.margin):null,R.setupInit||(R.res?(f=n.width(),tt.varible(),T.rateLast=T.rate):T.rate=1),R.setupInit&&!R.res&&(T.rate=1)},grab:function(){R.swipeBody?X.toggleClass("grab",1):X.toggleClass("grab",-1),a.isViewGrabStop?n.addClass(a.ns+"grabstop"):n.removeClass(a.ns+"grabstop")},direction:function(e){T.can.dirs="ver"!=a.dirs||R.mobile?"hor":"ver",e&&e.pagDirs||(T.pag.dirs=a.pag.dirs),R.ts||(g=T.cssTf="hor"==T.can.dirs?"left":"top");var t=function(e){var t="hor"==T[e].dirs;T[e].cssTf=R.ts?g:t?"left":"top",T[e].pageX=t?"pageX":"pageY"};t("can"),t("pag");var i={left:"",top:""};T.$s.css(i)},pagination:function(){R.pagList="list"==a.pag.type,R.pagList&&(R.swipePag=0);var e=function(e,t){return!R.pagOutside&&!R.pagList&&e.isPag&&"tab"==t.type&&"ver"==t.dirs};R.tabVer=e(a,a.pag)&&"ver"==T.pag.dirs?"top"==a.pag.pos?"top":"bottom":null,R.setupInit&&e(O,O.pag)&&n.css({"margin-left":"","margin-right":""})},setupEnd:function(){R.setupInit&&"fixed"==a.height&&n.css("height",""),"eerf"==a.rev[0]&&V.eerf()},setup:function(e){H.setupBegin(),u=N.num=T.$s.length,T.wRange=H.chain3(a.wSlide,"width"),H.swipeEvent(),H.idNum(),H.center(),H.slideshow(),R.thumb="thumb"===a.pag.type||"hover"===a.pag.type,a.speed<200&&(a.speed=200),a.slideshow.delay<500&&(a.slideshow.delay=500),H.transform(),H.layout(),a.hCode&&(a.height="fixed"),H.fullscreen(),H.res(),H.grab(),H.direction(e),H.pagination(),H.setupEnd()},code:function(e){H.setup(e),!R.setupInit&&b.removeAttr("data-"+csVAR.codeData).removeData(csVAR.codeData),R.setupInit==S&&(R.setupInit=1),Y.addClass(e)},slide:function(){var t=0,i=[],n=[],s=[],r=[],o=[],l=[],d="line"==a.layout,c=d?null:a.fx||a.fxDefault,p="js";T.aIDtext=[],R.aIDtext=0,null!=a.fxOne?(c=a.fxOne,p="cssOne"):null!=a.fxIn&&(c=[a.fxIn,a.fxOut],p="css"),T.$s.each(function(){var d=e(this),f=d.attr("data-"+a.dataSlide),h=d.data("slideLast")||{},g=c,m=p;f!=S&&""!=f&&H.split(h,f,{},0),(1==R.setupInit||R.apiAdd||R.apiRemove)&&(0==t&&(T.$s0=d),1==t&&(T.$s1=d),2==t&&(T.$s2=d),t==u-1&&(T.$sn=d)),d.data({id:t,media:h.media}),R.pag&&T.$pagItem.eq(t).data("id",t),h.fxOne?(g=h.fxOne,m="cssOne"):h.fxIn?(g=[h.fxIn,h.fxOut],m="css"):h.fx&&(g=h.fx,m="js"),s.push(g),r.push(m);var v=h.fxEasing||a.fxEasing;v&&(v=X.easeName(v)),o.push(v),l.push(h.slot||a.slot),i.push(h.delay||a.slideshow.delay),n.push("none"==g?0:h.speed||a.speed),T.classAdd[t]=nt.filter(h);var w=d.attr("id");a.deeplinking.isIDConvert&&w!=S&&!R.aIDtext&&(R.aIDtext=1),T.aIDtext.push(w),ht&&lt.check(h,d),d.removeAttr("data-"+a.dataSlide).data("slideLast",h),t++}),"free"==a.layout&&H.slideAddon(),T.fx=s,T.fxType=r,T.fxEase=o,T.slot=l,T.fxNum=a.fxName.length,T.speed=n,T.delay=i,T.tDelay=T.delay[N.idCur],1==R.setupInit&&(R.setupInit=2)},slideAddon:function(){var t=0,i=a.fLoop>1?a.fLoop:u,n=0,s=0,r=function(){n=s,s=X.r(X.ra()*(i-1))};for(x=0;u>x;x++){var o=T.$s.eq(x);if(o.addClass(a.fName+x),a.isInOutBegin&&o.addClass(x==N.idCur?a.fName+"-in":a.fName+"-out"),a.isClassRandom){do r();while(s==n&&a.fLoop>2);o.addClass("fx"+s)}else a.fLoop>1&&(o.addClass("fx"+t),t++,t>=a.fLoop&&(t=0))}if(a.isSlAsPag){for(R.pag||(T.$pagItem=e("")),x=0;u>x;x++)T.$pagItem=T.$pagItem.add(T.$s.eq(x));!R.pag&&K.pag(),b.addClass("slide-as-pag")}},initEnd:function(){"auto"==a.height&&n.addClass(a.ns+"hNative")}},V={check:function(){var e=a.rev[0],t=!1;if("erp"==e||"eerf"==e)t=!0;else if("omed"==e){var i=a.rev[1].split("").reverse().join("");-1!=document.URL.indexOf(i)&&(t=!0)}return t},eerf:function(){var t={fxOne:null,fxIn:null,fxOut:null,fxEasing:null,isSlideshow:!1,name:null};a=e.extend(!0,a,t),null==a.fx&&(a.fx=a.layout="line"),a.pag.dirs="hor"}},U={viewport:function(){var t=a.ns+a.viewportName,i=b.children("."+t);i.length?n=i:(b.wrapInner(e(E,{"class":t})),n=b.children("."+t)),T.$viewport=n},canvas:function(){var t=a.ns+a.canvasName,s=a.canvasTag,r=n.children("."+t);if(r.length)s=r[0].tagName.toLowerCase();else{"div"==s&&"li"==n.children()[0].tagName.toLowerCase()&&(s="ul");var o="ul"==s?"<ul></ul>":E;n.children().wrapAll(e(o,{"class":t}))}i=T.$canvas=n.children("."+t),i.data({tagName:s,pos:{x:0}})},slide:function(t){var n=a.ns+a.slideName,s=t[0].tagName.toLowerCase();if("li"==s||"div"==s||t.hasClass(n))!t.children().length&&t.removeClass(n);else{var r=i.data("tagName"),o="ul"==r?"<li></li>":E,l=e(o,{"class":n});t.wrap(l),t=t.closest("."+n)}return t.addClass(n).addClass(a.ns+"sleep"),t.data({is:{loading:0,loaded:0,imgback:0,layer:0,video:0,ajax:0,pagEmpty:0,loadBy:"normal"},$:{},html:{},item:{}}),U.icon.add(t,t,"slLoader"),T.$s=T.$s.add(t),t},capPagHTML:function(t){var i="",n=t.find("img, a."+a.ns+a.imgName);n.length&&n.each(function(){var n=e(this);if(n.data(a.layerName)==S&&n.parent("."+a.ns+a.slideName).length){var s=this.tagName.toLowerCase();"img"==s?i=n.attr("alt"):"a"==s&&(i=n.html()),t.data("is").imgback=1}});var s=t.children("."+a.ns+"capitem");s.length&&(i=s.html(),s.remove()),t.data("html").cap=i;var r=t.children("."+a.ns+"pagitem");r.length||(r=e(E,{"class":a.ns+"pagitem"}),t.data("is").pagEmpty=1),t.data("$").pagItem=r,r.remove()},structure:function(){U.viewport(),U.canvas(),T.$s=e(""),i.children().each(function(){U.slide(e(this))}),T.$s.each(function(){U.capPagHTML(e(this))})},searchDOM:function(t){var i=e(),n=a.name;if(n||n>=0&&null!=n){var s=e(t);s.length&&s.each(function(){var t,a=e(this).attr("data-"+csVAR.codeData);a!=S&&""!=a&&(t=X.valueName(a,"name")),t==n&&(i=e(this))})}if(i.length)return i;var r=b.find(t);return r.length&&r.each(function(){var t=e(this);return 0==t.closest("."+a.ns+a.viewportName).length?t:void 0}),e()},into:function(t,i){var n;switch(t){case"nav":s||(s=e(E,{"class":a.ns+a.navName}).appendTo(b)),n=s;break;case"media":l||(l=e(E,{"class":a.ns+"media"}).appendTo(b)),n=l;break;case"none":n=b}n.append(i)},nav:function(){var t="."+a.ns+a.navName,i=U.searchDOM(t);if(i.length){s=i;var n=b.find("."+a.ns+a.nextName),l=b.find("."+a.ns+a.prevName),d=b.find("."+a.ns+a.playName);n.length&&(o=n),l.length&&(r=l),d.length&&(T.$playpause=d,a.slideshow.isPlayPause=1)}s==S&&(s=e(E,{"class":a.ns+a.navName})),r==S&&(r=e(E,{"class":a.ns+a.prevName,text:"prev"}),s.append(r)),o==S&&(o=e(E,{"class":a.ns+a.nextName,text:"next"}),s.append(o)),i.length||b.append(s)},play:function(){var t="."+a.ns+a.playName,i=U.searchDOM(t);i.length?T.$playpause=i:(T.$playpause=e(E,{"class":a.ns+a.playName,text:"play/pause"}),U.into(a.markup.playInto,T.$playpause)),R.autoRun||(R.pauseActive=1,T.$playpause.addClass(a.ns+a.actived))},pagitem:function(e){var t=e.data("$").pagItem;return R.thumb&&j.preThumb(e,t),T.$pagItem=T.$pagItem.add(t),t},pag:function(){var t=" "+a.ns,i=t+"pag-",n=a.pag,s=t+"outside",r=n.dirs,o=t+a.pagName+t+n.type+i+r+i+n.pos,l=U.searchDOM("."+a.ns+a.pagName);R.pagOutside=!!l.length,T.$pag=l.length?l.addClass(o+s):e(E,{"class":o}),T.$pagInner=e(E,{"class":a.ns+"paginner"}),T.$pagItem=e(""),d=e(""),T.$s.each(function(){U.pagitem(e(this))}),"dash"!=a.layout&&T.$pagInner.append(T.$pagItem),T.$pag.append(T.$pagInner),l.length||("top"==n.pos?b.prepend(T.$pag):b.append(T.$pag)),T.pag.viewport=T.$pag;var c="";"tab"==n.type&&(c+=i+r+i+n.pos,R.pagOutside&&(c+=s),b.addClass(c))},cap:function(){var t="."+a.ns+a.capName,i=U.searchDOM(t);c=i.length?i:e(E,{"class":a.ns+a.capName}),T.$capCur=e(E,{"class":a.ns+"cap-cur"}),T.$capLast=e(E,{"class":a.ns+"cap-last"}),T.$capInner=e(E,{"class":a.ns+"capinner"}),T.$capInner.append(T.$capCur,T.$capLast).appendTo(c),i.length||b.append(c)},divImg:function(t,i,n){var s=a.ns+a[t+"Name"],r=t.charAt(0).toUpperCase()+t.slice(1);if(T[t]=b.find("."+s),a["is"+r]){if(!T[t].length){var o=b.data("img"+t),l=o?'<div class="'+s+'"><img src="'+o+'" alt="['+t+']"></div>':'<div class="'+s+'"></div>';n&&i.after(e(l))||i.before(e(l))}}else T[t].length&&T[t].remove()},refresh:function(){O.isOverlay!=a.isOverlay&&U.divImg("overlay",i,1),O.isShadow!=a.isShadow&&U.divImg("shadow",n,0)},icon:{add:function(t,i,n){var s=e(E,{"class":a.ns+"loader",text:"loading"});t.data("$")[n]=s,i.append(s)},remove:function(e,t){var a=e.data("$")[t];a&&a.remove()}},other:function(){U.refresh()}},G={way:function(){T.nAddLoad=0,T.nLoaded=0,R.preloaded=0;var e=[],t=N.idCur,i=a.load,n=function(){for(x=0;u>x;)e[x]=x++},s=function(){var t=T.idMap,a=X.c(u/2-1),i=a,n=1,s=1,r=1;for(e[0]=t[i],x=1;u>x;x++)r?(i=a+s,s++,r=0):(i=a-n,n++,r=1),e[x]=t[i]},r=function(){var i=1,n=1,s=0,r=0;for(e[0]=a.idBegin,x=1;u>x;x++)t!=u-1&&(i||s)?(e[x]=t+n,s?n++:i=0,e[x]>=u-1&&(r=1)):(e[x]=t-n,n++,i=!r,e[x]<=0&&(s=1))};T.nPaLoaded=i.amountEachLoad+1,"all"==i.preload&&(i.preload=u),i.preload<=0&&(i.preload=1),!R.cenLoop||a.isPag&&"tab"==a.pag.type?0==t?n():r():s(),ht&&(e=lt.removeAutoLoad(e)),T.aLoad=e},next:function(e){e.data("is").ajax&&ht?lt.get(e):G.slideBegin(e)},setupBegin:function(){var e=T.aLoad;null!=e&&e.shift(),T.nAddLoad++,T.nAddLoad<a.load.preload&&null!=e&&G.slideBegin(T.$s.eq(e[0]))},setupEnd:function(e){var t=T.aLoad,i=a.load;if(T.nLoaded++,R.preloaded||T.nLoaded!=a.load.preload||(R.preloaded=1),!i.isNearby&&(R.preloaded&&(T.nPaLoaded--,T.nPaLoaded||(T.nPaLoaded=a.load.amountEachLoad)),null!=t&&R.preloaded&&T.nPaLoaded>=i.amountEachLoad&&!e.data("is").loadAdd))for(x=T.nPaLoaded;x>0&&null!=t&&t.length;x--)G.next(T.$s.eq(t[0]))},add:function(e){var t=e.data("is");if(!t.loading){R.loadAll=0;var a=T.aLoad;if(null!=a)for(x=a.length-1;x>=0;x--)a[x]==N.idCur&&(a.splice(0,0,a.splice(x,1)[0]),x=-1);t.loadAdd=1,G.next(e)}},slideBegin:function(t){var i=t.data("id"),n=t.data("is");N.ev.trigger("loadBegin",[t,i]),"normal"==n.loadBy&&G.setupBegin(),t.removeClass(a.ns+"sleep");var s=a.ns+a.imgName,r=t.find("img, a."+s),o=t.find("."+csVAR.codeClass+" img, ."+csVAR.codeClass+" a."+s);r=r.not(o);var l=r.length;n.loading=1,t.data({imgNum:l,nCur:0}),i==a.idBegin&&b.addClass(a.ns+"init"),"fixed"==a.height&&i==a.idBegin&&W.codeHeightFix(),R.res&&a.isFullscreen&&at.varible(),l?r.each(function(){var i=e(this),n=i.data(a.layerName)==S&&i.parent("."+a.ns+a.slideName).length&&"dash"!=a.layout?1:0;"a"==this.tagName.toLowerCase()&&(i=z.tagSwap(i)),i.data({$:{slide:t},is:{imgback:n,srcOutside:0,loaded:0},src:[]}),n&&(t.data("$").imgback=i,t.data("is").imgback=1,z.wrap(i));var s=i.data("src"),r=i.attr("src"),o=/^data\:image\//g.test(r);!o&&s.push(r);var l=i.attr("data-"+a.lazyName);l!=S&&(s.push(l),i.removeAttr("data-"+a.lazyName)),z.data(i);i.data();z.load(i)}):G.slideEnd(t)},slideEnd:function(e){var t=e.height(),i=e.data("id");e.data("height",t),e.data("is").loaded=1,R.initLoaded||(W.initHeight(t),F.load()),z.backCenterHor(e),"fixed"==a.height&&z.backCenter.setup(e),"dash"==a.layout&&(L.height[i]=e.outerHeight(!0),W.codeHeight()),e.addClass(a.ns+"ready"),U.icon.remove(e,"slLoader"),!!e.data("isPlayNext")&&N.play();var n="loadSlide."+i;N.ev.trigger(n),N.ev.trigger("loadEnd",[e,i]),null!=T.aLoad&&0==T.aLoad.length&&(R.loadAll=1,T.aLoad=null,N.ev.trigger("loadAll")),R.apiAdd&&(N.refresh(),R.apiAdd=0),G.setupEnd(e)}},z={data:function(e){var t=e.data("image");if(t!=S&&""!=t){var a={};H.split(a,t,{}),e.data(a),e.removeAttr("data-image")}},load:function(e){var t=function(){var t=e.data("$").slide;t.data("nCur",t.data("nCur")+1),t.data("nCur")==t.data("imgNum")&&setTimeout(function(){G.slideEnd(t)},10);var a=t.data("is").addThumb,i=e.data("is").imgback;if(R.pag&&a&&i){var n=t.data("$").thumb,s=e.clone(!0);j.addThumb(s,n,t)}},a=new Image,i=e.data("src"),n=i.pop();a.onload=function(){z.prop(e,this),t()},a.onerror=function(){i.length?z.load(e):(e.attr("alt","[ image load failed ]"),R.e&&console.warn("["+csVAR.codeName+": image load failed] -> "+n),t())},e.attr("src",n),a.src=n},prop:function(e,t){var a=t.width,i=t.height,n=a/i;e.data({width:a,height:i,rate:n}),e.data("is").loaded=1,R.res&&T.rate<1&&e.css({width:X.r(a*T.rate),height:X.r(i*T.rate)}),e.data("is").imgback&&z._fit(e)},tagSwap:function(t){var i={};i["data-"+a.lazyName]=t.attr("href");var n,s=t.attr("class"),r=t.attr("id"),o=t.attr("style"),l=t.attr("data-image"),d=t.attr("data-"+a.dataVideo),c=t.attr("data-"+a.dataMap),u=t.attr("data-imgthumb"),p=a.isCap?"[img]":t.text(),f=a.ns+a.imgName,h="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",g=e("<img>",{src:h,alt:p}).attr(i),m="data-"+a.layerName,v=t.attr(m),w=t.attr("data-"+a.dataVideo),C=t.attr("data-"+a.dataMap);if(v&&(w||C)){var y=e(E);y.append(g),n=y}else n=g;if(v){var i={};i[m]=v,n.attr(i)}return s!=f&&n.addClass(s).removeClass(f),r&&n.attr("id",r),o&&n.attr("style",o),l&&n.attr("data-image",l),d&&n.attr("data-"+a.dataVideo,d),c&&n.attr("data-"+a.dataMap,c),u&&n.attr("data-imgthumb",u),R.ie&&g.removeAttr("width height"),t.after(n).remove(),g},wrap:function(t){var i=a.ns+"imgback",n=e(E,{"class":i});"dash"!=a.layout&&t.wrap(n).removeClass(i)},_fit:function(e){var t=e.data("rate"),i=e.data("width"),n=e.data("height"),s=function(){e.css({width:f,height:X.r(f/t)})},r=function(){e.css({width:X.r(p*t),height:p})},o=function(){z.updateSize(e)};"autofit"==a.imgWidth||"smallfit"==a.imgWidth&&f>i||"largefit"==a.imgWidth&&i>f?s(e):"fixed"==a.height?"autofit"==a.imgHeight||"smallfit"==a.imgHeight&&p>n||"largefit"==a.imgHeight&&n>p?r(e):"autofit"==a.img?t>h?s(e):r(e):"smallfit"==a.img&&f>i&&p>n?t>h?s(e):r(e):"largefit"==a.img&&i>f&&n>p?t>h?s(e):r(e):"autofill"==a.img?t>h?r(e):s(e):"smallfill"==a.img&&f>i&&p>n?t>h?r(e):s(e):"largefill"==a.img&&i>f&&n>p?t>h?r(e):s(e):o(e):o(e)},updateSize:function(e){e.css(T.rate<1?{width:X.r(e.data("width")*T.rate),height:X.r(e.data("height")*T.rate)}:{width:"",height:""})},backCenter:{get:function(e){var t=e.data("$");return t&&t.imgback?t.imgback.parent("."+a.ns+"imgback"):null},setup:function(e){var t=z.backCenter.get(e);if(null!=t){T.top=X.r((p-t.height())/2);var a=0==T.top?"":T.top;t.css("top",a)}},reset:function(e){var t=z.backCenter.get(e);null!=t&&t.css("top","")}},backCenterHor:function(t){var a=function(e){var t=e.data("$").imgback;if(t!=S){var a=X.pInt(t.css("left")),i=~~(-(t.width()-T.wCanvas)/2);a!==i&&t.css("left",i)}};t==S?T.$s.each(function(){a(e(this))}):a(t)},backUpdate:function(){var t=i.find("."+a.ns+"imgback > img");t.length&&t.each(function(){var t=e(this);t.data("is").imgback&&("none"!=a.imgWidth||"fixed"==a.height&&("none"!=a.imgHeight||"none"!=a.img)?z._fit(t):z.updateSize(t))})},autoShow:function(e){var t=T.$s.eq(e?e:N.idCur).data("$").imgback;t&&(t.css("position","static"),setTimeout(function(){t.css("position","")},2))}},j={preThumb:function(t,i){var n=e(E,{"class":a.ns+a.thumbWrap});i.append(n),t.data("$").thumb=n,U.icon.add(t,i,"thumbLoader");var s=t.data("imgthumb");if(s||(s=t.find("[data-imgthumb]").data("imgthumb")),s){var r=new Image;r.onload=function(){var a=e("<img></img>",{src:s}).data("rate",r.width/r.height);j.addThumb(a,n,t)},r.onerror=function(){R.e&&console.warn("["+csVAR.codeName+"thumb load fail] -> "+s)},r.src=s}else t.data("is").addThumb=1},addThumb:function(e,t,i){var n=a.pag.width,s=a.pag.height,r="number"==typeof n?n:t.width(),o="number"==typeof s?s:t.height(),l=r/o,d=e.data("rate"),c="",u={width:"",height:""};
r&&o&&(d>l?(c=a.ns+"hfit",u.left=-m.r((d*o-r)/2)):(c=a.ns+"wfit",u.top=-m.r((r/d-o)/2))),e.css(u),t.addClass(c).append(e),U.icon.remove(i,"thumbLoader")},sizeItem:function(){var e=T.pag,t=a.pag,i="number"==typeof t.width?t.width:"",s="number"==typeof t.height?t.height:"";T.$pagInner.css({width:i,height:s,"margin-right":"","margin-bottom":""});var r=a.ns+"wfit",o=a.ns+"hfit";""==i?T.$pagInner.removeClass(r):T.$pagInner.addClass(r),""==s?T.$pagInner.removeClass(o):T.$pagInner.addClass(o);var l=T.$pagItem,d=X.valueMax,c=""!=i?i:d(l,"width"),u=""!=s?s:d(l,"height");e.wCon=d(l,"outerWidth",!0),e.hCon=d(l,"outerHeight",!0);var p=e.maRight=e.wCon-c,f=e.maBottom=e.hCon-u;T.$pagInner.css({width:R.pagOutside&&"ver"==e.dirs?"":c,height:u,"margin-right":p,"margin-bottom":f}),"tab"==t.type&&T.$pagInner.addClass(r+" "+o);var h="padding-",g="border-",m=function(e){var t=0,a=0;for(x=e.length-1;x>=0;x--)t+=X.pInt(n.css(e[x])),a+=X.pInt(T.$pag.css(e[x]));return t-a};T.viewSpace={hor:m([h+"left",h+"right",g+"left-width",g+"right-width"]),ver:m([h+"top",h+"bottom",g+"top-width",g+"bottom-width"])}},prop:function(e){var t,i=T.pag,n="hor"==i.dirs;i.width=T.$pag.width(),i.height=T.$pag.height();var s,r=R.pagOutside&&!n?"self":a.pag.sizeAuto,o={width:"",height:""};if(null==r?s=n?i.width:i.height:"full"==r?s=n?o.width=f+T.viewSpace.hor:o.height=p+T.viewSpace.ver:"self"==r&&(s=n?o.width=i.wCon*u:o.height=i.hCon*u),i.wSwap=s,T.$pag.css(o),n&&!R.pagOutside&&"justified"==a.pag.align&&(null==r||"full"==r)){var l,d,c=X.r(s/u),h=0;n&&i.wCon<c?(i.wCon=c,l=c-i.maRight,h=1):!n&&i.hCon<c&&(i.hCon=c,d=c-i.maBottom,h=1),h&&T.$pagInner.css({width:l,height:d})}i.wTranslate=n?i.wCon:i.hCon,t=i.wSwap-i.wTranslate*u,i.xMin=0,i.xMax=0>t?t:0,i.wEdge=(i.wSwap-i.wTranslate)/2,i.xCanvas=0,i.isViewLarge=t>0,i.align=a.pag.align,("justified"==i.align||!i.isViewLarge&&"begin"!=i.align)&&(i.align="begin"),"center"==i.align?(i.xPull=i.xCanvas=X.r(t/2),i.xMax=i.xPull+i.wTranslate*u,q.translateX(T.$pagInner,i.xCanvas,1,1)):"end"==i.align&&(i.xPull=i.xCanvas=t,i.xMax=i.wSwap,q.translateX(T.$pagInner,i.xCanvas,1,1)),e&&q.translateX(T.$pagInner,i.xCanvas,0,1)},size:function(){var e=T.pag,t="hor"==e.dirs;for(e.pBegin=[],x=0;u>x;x++)e.pBegin[x]=e.wTranslate*x;var a=t?"tlx":"tly",i={};for(x=0;u>x;x++)i[e.cssTf]=X[a](e.pBegin[x]),T.$pagItem.eq(x).css(i)},itemCenter:function(){var e=T.pag;if(!e.isViewLarge){var t=-(N.idCur*e.wTranslate)+e.wEdge;if(t>0?t=0:t<e.xMax&&(t=e.xMax),t!=e.xCanvas||0==t){var i={},n=a.pag.speed,s=a.pag.ease,r="hor"==e.dirs?"tlx":"tly";if(i[e.cssTf]=X[r](X.r(t)),R.ts){var o=X.ts(g,n,X.easeName(s));T.$pagInner.css(o),setTimeout(function(){T.$pagInner.css(i)},2),clearTimeout(A.pagCenter),A.pagCenter=setTimeout(function(){X.tsRemove(T.$pagInner)},n)}else T.$pagInner.animate(i,{duration:n,queue:!1,easing:s});e.xCanvas=t}}},tabVer:function(){R.pag&&("top"==R.tabVer?n.css("margin-left",T.pag.wCon):"bottom"==R.tabVer&&n.css("margin-right",T.pag.wCon))},toHor:function(){var e=a.pag,t=null;if("tab"==e.type&&"ver"==e.dirs){var n=T.pag,s=("hor"==n.dirs,e.wMinToHor),r=b.width();"ver"==n.dirs&&s>r?(t=n.dirs="hor",!!T.$pag&&T.$pag.stop(!0).css("height","")):"hor"==n.dirs&&r>=s&&(t=n.dirs="ver")}t&&(i.css("width",""),N.prop({},0,{pagDirs:t}))},buffer:function(){}},q={translateX:function(e,t,a,n,s,r){var o=null!=e?e:T.swipeCur,l=i.is(o)?T.can:T.pag,d=n?t:-t*l.wTranslate+l.xCanvas,c=s?s:T.speed[N.idCur],u=r?X.easeName(r):T.ease;l.xCanvas=d;var p={};if(R.ts){clearTimeout(o.data("timer")),a||X.tsAdd(o,c,u);var f="hor"==l.dirs?"tlx":"tly";p[l.cssTf]=T[f+0]+d+"px"+T[f+1],o.css(p),o.data("timer",setTimeout(function(){X.tsRemove(o)},c))}else p[l.cssTf]=d,a?o.stop(!0,!0).css(p):o.animate(p,{duration:c,queue:!1,easing:u})},objTranslateX:function(e,t,i,n){var s;s=i?t:"dash"==a.layout?L.pBegin[t]:t*T.can.wTranslate,"number"==typeof n&&(s+=n);var r={},o="hor"==T.can.dirs?"tlx":"tly";r[g]=R.ts?X[o](s):s,e.css(r)},bufferX:function(e){var t=a.layout,n=N.idCur,s=R.swipeNav,r="right"==s,o="left"==s,l=i.is(T.swipeCur),d=l?T.can:T.pag,c=d.wTranslate,p=d.xCanvas,f=k.offset<0?1:-1,h=k.pageX1-k.pageX0;if((!l||a.isLoop||"line"!=t&&"dash"!=t)&&l){if(l&&("dot"==t||"free"==t)){var g=R.mobile?2:4;h/=g,!a.isLoop&&(0>=n&&r||n>=u-1&&o)&&(h/=4)}}else{if(k.buffer>d.xMin&&r||k.buffer<d.xMax&&o){var m=R.mobile?4:8;h/=m}a.isViewGrabStop&&(k.buffer>0&&r?X.toggleClass("stop",1):k.buffer<d.xMax&&o&&X.toggleClass("stop",0))}if("free"!=t){k.buffer+=!l||"coverflow"!=a.view&&"scale"!=a.view?h:h*c/T.wCon;var v="hor"==d.dirs?"tlx":"tly",w=R.mobile?0:1,C=k.buffer.toFixed(w),y={};y[d.cssTf]=X[v](C),T.swipeCur.css(y),l&&Q.buffer[a.view](f)}if(l&&"line"==t){var x=p-c*f;k.buffer*f<x*f&&(R.swipeBegin=1,k.x0=e,d.xCanvas-=c*f,T.nSwipe+=f,_.run(f,0,1))}R.swipeBegin&&(R.swipeBegin=0)},nearX:function(){var e=i.is(T.swipeCur),t=e?T.can:T.pag,n=k.offset;if(R.ease="touch",e)if("dash"==a.layout){var s=L.nBegin;if(0>n)for(;L.pBegin[s]<-k.buffer;)s++;else if(n>0)for(;L.pBegin[s]>-k.buffer;)s--;var r=s!=L.nBegin;_.run(s,r)}else{var o=T.pa.left?T.wCon-2*T.pa.left:T.wCon,l=R.mobile?600:400,d=T.tDrag1-T.tDrag0<l,c=X.r(o/3),p=X.r(o/4),f=X.r(o/20),h=d?f:"dot"==a.layout?p:c,g=100,m=T.speed[N.idCur]/2,v=!1,w=0;-h>n&&(a.isLoop||!a.isLoop&&N.idCur<u-1)&&u-1?("dot"==a.layout&&q.translateX(null,0,0,0,g),_.run(w+1,0)):n>h&&(a.isLoop||!a.isLoop&&N.idCur>0)&&u-1?("dot"==a.layout&&q.translateX(null,0,0,0,g),_.run(w-1)):v?_.run(w):(q.translateX(i,0,0,0,m),R.center&&Q.restore[a.view]()),(-h>n||n>h)&&a.isSlideshow&&(R.hoverAction=1)}else if(0!=n){t.xCanvas=k.buffer;var C=a.pag.speed;"center"==t.align||"end"==t.align?t.xCanvas!=t.xPull&&q.translateX(T.$pagInner,t.xPull,0,1,C):t.xCanvas>0?q.translateX(T.$pagInner,0,0,1,C):t.xCanvas<t.xMax&&q.translateX(T.$pagInner,t.xMax,0,1,C)}q.flywheel()},centerIdMap:function(){var e=[],t=X.c(u/2)+N.idCur;for("even"==T.center.isNum&&t++,t>=u&&(t-=u),x=0;u>x;x++)t>=u&&(t=0),e[x]=t++;T.idMap=e},balance:function(e,t,i){var n=T.nMove>0,s=n?{is:1,s:1,id0:0,idN:u-1}:{is:0,s:-1,id0:u-1,idN:0},r=t?1:X.a(T.nMove);s.sp=i==S?T.speed[N.idCur]:i,s.isLive=e;var o,l,d,c=T.can.wTranslate;for(x=0;r>x;x++){o=T.idMap[s.id0],l=T.pBegin[s.idN]+c*s.s;var d={};if("basic"==a.view||"mask"==a.view){var p="hor"==T.can.dirs?"tlx":"tly";d[g]=X[p](l)}else"coverflow"==a.view?(d=Q.tf1(l,-a.coverflow.rotate*s.s),d["z-index"]=T.zMap[s.idN]-1):"scale"==a.view&&(d=Q.tf2(l,a.scale.intensity/100));var f=s.is;X.shift(T.idMap,f),X.push(T.idMap,o,f),X.shift(T.pBegin,f),X.push(T.pBegin,l,f),X.shift(T.tfMap,f),X.push(T.tfMap,d,f);var h={},m=T.$s.eq(o);"basic"!=a.view&&3==u?(clearTimeout(m.data("timer")),h=X.ts(g,s.sp,T.ease),m.data("timer",setTimeout(function(){X.tsRemove(m)},s.sp))):h[v]="",m.css(h).css(d),Q.balance[a.view](s)}},fillHole:function(){if("basic"==a.view){T.sClone.length&&T.sClone.remove();var e=T.center.n,t=T.nMove>0?e.left:e.right;t-=e.edge;var n=X.a(T.nMove);if(n>t){for(x=t;n>x;x++){var s=T.nMove>0?T.idMap[x]:T.idMap[u-1-x],r=T.$s.eq(s).clone().appendTo(i);T.sClone=T.sClone.add(r)}clearTimeout(A.fillHole),A.fillHole=setTimeout(function(){T.wSlide*u<f?T.sClone.animate({opacity:0},{duration:200,complete:function(){T.sClone.remove()}}):T.sClone.remove()},T.speed[N.idCur])}}},animRebound:function(e){if(a.isAnimRebound){var t=T.can,n=(a.layout,"next"==e),s=n?-1:1,r=150,o=30,l=n?t.xMax:t.xMin,d=130*s+l,c=i.css(g);c=R.ts?"none"==c?l:X.valueX(c):"auto"==c?l:parseInt(c);var u=o*s+c,p=function(){q.translateX(null,u,0,1,r)},f=function(){q.translateX(null,l,0,1)};u/s>d/s?f():(p(),clearTimeout(A.rebound),A.rebound=setTimeout(f,r))}},flywheel:function(){var e=(T.swipeCur,i.is(T.swipeCur)),t=e?T.can:T.pag;if(e){var n=T.tDrag1-T.tDrag0;s=200>n&&X.a(T.nSwipe)>0}else{var n=T.tDrag1-T.tDrag0,s=k.buffer<0&&k.buffer>t.xMax&&200>n&&X.a(k.offset)>10;if(s){var r=k.pageX1-k.x0Fix,o=k.buffer+r,l=a.pag.speed;if(o>0||o<t.xMax){var d=[];o>0?d[0]=0:o<t.xMax&&(d[0]=t.xMax),d[1]=(o-d[0])/8+d[0],d[2]=d[0];var c=a.pag.ease;q.translateX(T.$pagInner,d[0],0,1,l/4,"linear"),clearTimeout(A.flywheel1),clearTimeout(A.flywheel2),A.flywheel1=setTimeout(function(){q.translateX(T.$pagInner,d[1],0,1,l/2,c)},l/4),A.flywheel2=setTimeout(function(){q.translateX(T.$pagInner,d[2],0,1,l,c)},l/4+l/2)}else q.translateX(T.$pagInner,o,0,1,l)}}}},W={general:function(){if(!R.res&&W.margin(),"line"==a.layout||"dot"==a.layout||"free"==a.layout){var e;R.center?(e=tt.valueGet(T.wRange,"width"),e>0&&1>=e&&(e*=T.wSwap)):e=f,T.wSlide=parseInt(e),T.wCanvas="hor"==T.can.dirs?T.wSlide:f,i.css("width",T.wCanvas)}R.loadAll&&z.backCenterHor(),W.translateW(),"line"==a.layout&&W._lineWidth(),"dash"==a.layout&&W._dashWidth(),R.pag&&!R.pagList&&(j.size(),j.itemCenter())},_lineWidth:function(){if(R.cenLoop){for(var e=0,t=0;f>e;)e=(T.wSlide+T.ma[0]+T.ma[1])*(2*t+1),t++;var n=t-1;2*n>=u&&(n=~~((u-1)/2)),T.center.n.edge=n}Q.size[a.view](),T.swipeCur=i,X.tsRemove(i),a.isLoop?q.translateX(null,T.can.xCanvas,1,1):q.translateX(null,N.idCur,1)},_dashWidth:function(){L.pBegin=[],L.pEnd=[],L.width=[],L.mCanvas=parseInt(i.css("margin-left")),R.canvasEnd=0;var e=T.$s.length,t=0;for(l=0;e>l;l++){var a=T.$s.eq(l),n=a.attr("style");n!=S&&n.indexOf("width")&&a.css("width","");var s=a.outerWidth(!0);if(s>f){a.css("width",f);var r=parseInt(a.css("margin-left")),o=parseInt(a.css("margin-right"));s=f+r+o}L.width[l]=s,L.pBegin[l]=t,t+=s,L.pEnd[l]=t,q.objTranslateX(a,l)}if(R.loadAll)for(L.height=[],l=0;e>l;l++)L.height[l]=T.$s.eq(l).outerHeight(!0);if(R.pag){L.pagID=[0],T.$pagItem.detach(),T.$pag.append(T.$pagItem.eq(0));for(var l=0,d=0;e>l;l++)d+=L.width[l],d>f-L.mCanvas&&0!=l&&(T.$pag.append(T.$pagItem.eq(l)),L.pagID.push(l),d=L.width[l]);L.pagNum=L.pagID.length,K.pag()}var c=parseInt(T.$s.eq(u-1).css("margin-right"));L.pMax=-(L.pEnd[e-1]-c-f+L.mCanvas),L.lastBegin=L.nBegin,L.nBegin=0,_.run(L.lastBegin,0)},translateW:function(){var e=T.ma[0],t=T.ma[1];T.maRange||f==n.innerWidth()||(e=T.ma[0]=X.pInt(n.css("padding-left")),t=T.ma[0]=X.pInt(n.css("padding-right"))),T.wCon=T.wSlide+e+t;var i,s=a.layout;i="line"==s&&R.center?X.r((T.wSwap-T.wSlide)/2):0;var r=T.can;r.wTranslate=T.wCon,r.xCanvas=i,"line"==s?(r.xMin=i,r.xMax=-(T.wCon*u-f)-i):"dot"==s&&(r.xMin=r.xMax=0),R.pag&&!R.pagList&&j.prop()},margin:function(){var e=0;if(T.maRange){var t=T.maRange,a=$.width();for(x=t.num-1;x>=0;x--)t[x].from<=a&&a<=t[x].to&&(T.ma=[t[x].left,t[x].right],e=1)}e||(T.ma=[0,0])},codeHeight:function(e){var t=function(t,i,n){var s=e?0:a.speedHeight-10;n&&(p=T.hCode=t),R.mobile?i.css("height",t):i.delay(2).animate({height:t},{duration:s,queue:!1,complete:function(){i.css("overflow","")}})},i=function(){var i=T.$s.eq(N.idCur).outerHeight(!0);"auto"==a.height&&(p!=i&&i>0||e)&&(t(i,n,1),!R.pag||R.pagList||"ver"!=T.pag.dirs||R.pagOutside||"full"!=a.pag.sizeAuto||(j.prop(1),t(i+T.viewSpace.ver,T.$pag,0)))},s=function(){{var e=0;L.nEnd-L.nBegin}for(x=L.nBegin;x<=L.nEnd;x++){var a=L.height[x];a!=S&&a>e&&(e=a)}e>0&&e!=p&&t(e,n,1)};clearTimeout(A.codeHeight),A.codeHeight=setTimeout(function(){"dash"==a.layout?s():i()},30)},codeHeightFix:function(){var t=function(e){n.css("height",e)};if(a.isFullscreen){var i=I.height();if(null!=a.offsetBy){var s=0,r=0,o=0,l=e(T.offsetBy.top);l.length&&(l.each(function(){s+=e(this).outerHeight(!0)}),l.find("img").length&&(o=1));var d=e(null==T.offsetBy.bottom?"":T.offsetBy.bottom);d.length&&(d.each(function(){r+=e(this).outerHeight(!0)}),d.find("img").length&&(o=1)),i-=s+r,o&&I.load(function(){N.refresh()})}p=T.hCode=i,t(p)}else if(T.hRes)p=T.hCode=X.r(T.hRes*T.rate),t(p);else{var i=n.height();null!=a.hCode&&i!=a.hCode&&(i=a.hCode,t(i)),i||(i=0),p=T.hCode=i}W.wCode(),h=f/p},slideHeight:function(){T.$s.each(function(){var t=e(this);z.backCenter.reset(t),"fixed"==a.height&&z.backCenter.setup(t)})},initHeight:function(e){e=X.pInt(e),p=T.hCode=e,n.css("height",e),null==R.tabVer&&this.wCode()},wCode:function(){R.pag&&j.tabVer(),f=n.width(),T.wSwap="hor"==T.can.dirs?f:p}},Q={tf1:function(e,t){var a="translate3d("+e.toFixed(1)+"px, 0, 0)";t!=S&&(a+=" rotateY("+t.toFixed(1)+"deg)");var i={};return i[g]=a,i},tf2:function(e,t){var a="translate3d("+e.toFixed(1)+"px, 0, 0)";t!=S&&(a+=" scale("+t+")");var i={};return i[g]=a,i},size:{basic:function(){T.pBegin=[];var e=T.pBegin,t=R.cenLoop?T.center.n.left:0,a=T.can;for(x=0;u>x;x++)e[x]=a.wTranslate*(-t+x);var i,n="hor"==a.dirs,s=n?"tlx":"tly",r={};for(T.tfMap=[],x=0;u>x;x++)i=R.cenLoop?T.idMap[x]:x,r[a.cssTf]=X[s](e[x]),T.tfMap.push(r),T.$s.eq(i).css(r)}},buffer:{basic:function(){}},balance:{basic:function(){}},restore:{basic:function(){}}},_={line:function(e){R.ts&&X.tsRemove(T.swipeCur),_.idCur(e),W.codeHeight(),clearTimeout(A.lineEnd),A.lineEnd=setTimeout(_.end,T.speed[N.idCur]),R.cenLoop?(e.isID&&q.fillHole(),setTimeout(function(){_.lineTrans(e)},e.isID?10:0)):setTimeout(function(){!e.isLive&&q.translateX(i,e.num)},0)},lineTrans:function(e){var t=X.a(e.num);if("basic"!=a.view&&t>1){var n=X.r(speed[N.idCur]/t),s=0,r=e.num>0?1:-1,o=function(t,a){setTimeout(function(){T.ease=X.easeName(a),R.easeLast="multi",q.balance(e.isLive,r,n+100),!e.isLive&&q.translateX(i,r,0,0,n+100)},t-100)};for(x=0;t>x;x++,s+=n){var l=x==t-1?a.easeMove:"linear";o(s,l)}R.lockSwipe=R.lockNav=1,setTimeout(function(){R.lockSwipe=R.lockNav=0},T.speed[N.idCur])}else q.balance(e.isLive),e.isLive||q.translateX(i,e.num)},dash:function(e){R.ts&&X.tsRemove(T.swipeCur),_.idCurDash(e),X.toggleDash(),!a.isLoop&&e.num>0&&L.nEnd==u-1?(q.translateX(null,L.pMax,0,1),R.canvasEnd=1):!a.isLoop&&e.num<0&&R.canvasEnd?(q.translateX(null,-L.pBegin[L.nBegin],0,1),R.canvasEnd=0):q.translateX(null,-L.pBegin[L.nBegin],0,1),W.codeHeight(),setTimeout(_.end,T.speed[0]+10)},dot:function(e){_.idCur(e);var t={};t.$sCur=T.$s.eq(N.idCur),t.$sLast=T.$s.eq(N.idLast),t.direct=e.num>0?"in":"out",et.init(t),W.codeHeight()},free:function(e){_.idCur(e),X.toggleFree()},idCur:function(e){var t=N.idCur,i=T.nMove=e.num;N.idLast2=N.idLast,N.idLast=t,t+=i,a.isLoop&&(0>i&&0>t?t=u-1:i>0&&t>=u&&(t=0)),N.idCur=t,X.toggle(),R.pag&&!R.pagList&&e.isPagCenter&&"touch"==R.ease&&setTimeout(j.itemCenter,10)},idCurDash:function(e){var t=L.nBegin,i=t+e.num;!a.isLoop&&e.num<0&&0>i?(e.num=-t,L.nBegin=0):!a.isLoop&&e.num>0&&i>=u?(e.num=u-1-t,L.nBegin=u-1):L.nBegin+=e.num;for(var n=L.nBegin,s=L.pBegin[n]+f;L.pEnd[n]<s;)n++;if(L.pEnd[n]>s&&n--,n>=u&&(n=u-1),n<L.nBegin&&(n=L.nBegin),L.nEnd=n,L.nEnd==u-1){for(var r=L.pEnd[u-1]-f+L.mCanvas,o=u-1;L.pBegin[o]>=r;)o--;L.nBegin=o+1}N.idCur=e.num>0?L.nEnd:L.nBegin},run:function(e,t,i,n){var s="dash"==a.layout?L.nBegin:N.idCur;if(!R.lockNav&&(!t||t&&s!=e)){R.fxRun=1,b.addClass(a.ns+"fxRun"),N.ev.trigger("fxBegin");var r={num:e,isID:!!t,isLive:i,isPagCenter:n==S?1:!!n},o=function(){if(r.isID?0==r.num&&N.ev.trigger("start"):(s+r.num==0||s+r.num-u==0)&&N.ev.trigger("start"),N.ev.trigger("before"),r.isID&&(r.num-=s),"free"!=a.layout){var e;"touch"==R.ease&&"touch"!=R.easeLast?e=a.easeTouch:"move"==R.ease&&"move"!=R.easeLast&&(e=a.easeMove),e&&(T.ease=X.easeName(e),R.easeLast=R.ease)}switch(a.layout){case"dot":_.dot(r);break;case"line":_.line(r);break;case"dash":_.dash(r);break;case"free":_.free(r)}};"dash"!=a.layout&&T.$s.eq(s).data("is"),a.isSlideshow&&gt&&dt.go(),o()}},end:function(){R.fxRun=0,b.removeClass(a.ns+"fxRun"),N.ev.trigger("fxEnd"),"dash"!=a.layout&&(N.ev.trigger("after"),N.idCur==u-1&&N.ev.trigger("end")),a.isSlideshow&&(R.hoverAction=1,gt&&dt.go())},swapHNative:function(){var e=N.idCur,t=a.ns+"hNative",i=R.ts||"css"!=T.fxType[e]?T.speed[e]:400;n.hasClass(t)&&n.removeClass(t),clearTimeout(A.dotHNative),A.dotHNative=setTimeout(function(){n.addClass(t)},i+10)}},K={prevFn:function(e){R.ease="move",a.isLoop||!a.isLoop&&N.idCur>0?_.run(-e):q.animRebound("prev")},nextFn:function(e){R.ease="move",a.isLoop||!a.isLoop&&N.idCur<u-1?_.run(e):q.animRebound("next")},prev:function(){var e;if("visible"==a.stepNav&&"dash"==a.layout){var t=L.nBegin-1,i=f-L.mCanvas,n=0;if(L.pEnd[t]<i)e=L.nBegin;else{for(;i>=n;)n+=L.width[t--];e=L.nBegin-(t+2)}}else e=a.stepNav;return K.prevFn(e),!1},next:function(e){var t=e?a.stepPlay:a.stepNav,i="visible"==t&&"dash"==a.layout?L.nEnd-L.nBegin+1:t;return K.nextFn(i),!1},nav:function(){var e=T.ev.touch.end+" "+T.ev.click;r.add(o).off(e),r.on(e,function(e){K.prev(),e.preventDefault()}),o.on(e,function(e){K.next(),e.preventDefault()})},pag:function(){var t=T.ev.touch.end+" "+T.ev.click;T.$pagItem.off(t),T.$pagItem.on(t,function(t){R.click&&(R.ease="move",_.run(e(this).data("id"),1,0,1)),t.preventDefault()})},swipe:function(e){var t=R.touchSupport,s=T.ev.mouse,r=T.ev.touch,o={offSwipe:function(e){e.removeClass(a.ns+"swipe-on").off(T.ev.mouse.start+" "+T.ev.touch.start)},offOnDoc:function(){$.off(T.ev.mouse.move+" "+T.ev.mouse.end+" "+T.ev.touch.move+" "+T.ev.touch.end),K.swipeDocON(s),t&&K.swipeDocON(r)},offBody:function(){K._swipeEnd({},R.swipeTypeCur,1),this.offSwipe(n),R.nestedParent&&this.offSwipe(T.$nestedChild)},offPag:function(){K._swipeEnd({},R.swipeTypeCur,1),R.pag&&this.offSwipe(T.$pag)},onBody:function(){if(R.swipeBody&&(this.offOnDoc(),this.offBody(),K.swipeON(n,i,s),t&&K.swipeON(n,i,r),R.nestedParent)){var e=t?r.start+" "+s.start:s.start;T.$nestedChild.on(e,function(){R.nestedInner=1})}},onPag:function(){R.swipePag&&R.pag&&(this.offOnDoc(),this.offPag(),K.swipeON(T.$pag,T.$pagInner,s),t&&K.swipeON(T.$pag,T.$pagInner,r))}};void 0==e?(o.onBody(),o.onPag()):o[e]()},swipeON:function(e,t,n){e.addClass(a.ns+"swipe-on");var s=e.find("img");e.add(s).off(T.ev.drag);var r=a.swipe.isStopSelectText||e.is(T.$pag),o=r?e:s;o.on(T.ev.drag,function(){return!1}),e.on(n.start,{swipeType:n.type},function(e){T.touchmove=null;var a=e.data.swipeType;if(null==R.swipeTypeCur&&(R.swipeTypeCur=a),!R.move&&!R.lockSwipe&&R.swipeTypeCur==a){T.tDrag0=T.tDrag1=+new Date,T.swipeCur=t,X.tsRemove(t);var n=X.sSwap(),s="mouse"==a?e:R.msGesture?e.originalEvent:e.originalEvent.touches[0];k.x0=k.x0Fix=k.pageX1=s[n.pageX],k.y0=s.pageY,k.offset=k.buffer=0,k.buffer=n.xCanvas,R.move=1,R.swipeBegin=1,T.nSwipe=0,T.nMoveEvent=0,i.is(T.swipeCur)&&X.toggleClass("grab",0),"mouse"==a&&r&&e.preventDefault()}})},_swipeEnd:function(e,t,n){R.move&&!R.lockSwipe&&R.swipeTypeCur==t&&(!R.swipeBegin&&N.ev.trigger("swipeEnd"),T.tDrag1=+new Date,R.move=0,setTimeout(function(){R.click=1},10),q.nearX(),i.is(T.swipeCur)?X.toggleClass("grab",1):X.toggleClass("grab",-1),a.isViewGrabStop&&X.toggleClass("stop",-1),"touch"!=t||n||e.preventDefault()),R.nestedParent&&(R.nestedInner=0),R.swipeTypeCur==t&&(R.swipeTypeCur=null)},swipeDocON:function(e){$.on(e.move,{swipeType:e.type},function(e){var t=e.data.swipeType;if(!(!R.move||R.lockSwipe||R.nestedParent&&R.nestedInner||R.swipeTypeCur!=t)){!T.nMoveEvent&&N.ev.trigger("swipeBegin"),T.nMoveEvent++;var a="mouse"==t?e:R.msGesture?e.originalEvent:e.originalEvent.touches[0],n=X.sSwap();k.pageX0=k.pageX1,k.pageX1=a[n.pageX],k.pageX0!=k.pageX1&&(k.offset=k.pageX1-k.x0,R.swipeNav=k.pageX1>k.pageX0?"right":"left","touch"==t?(k.y=X.a(k.y0-a.pageY),null==T.touchmove&&X.a(k.offset)>=k.y&&(T.touchmove="chieuX"),null==T.touchmove&&k.y>5&&(T.touchmove="chieuY"),null==T.touchmove||"chieuX"==T.touchmove?(e.preventDefault(),q.bufferX(k.pageX1)):(R.androidNative||R.ie)&&K._swipeEnd(e,t,1)):q.bufferX(k.pageX1)),!i.is(T.swipeCur)&&X.toggleClass("grab",0),X.a(k.offset)>10&&R.click&&(R.click=0)}}),$.on(e.end,{swipeType:e.type},function(e){K._swipeEnd(e,e.data.swipeType,0)})},click:function(){a.isPosReport&&"dash"!=a.layout?n.on(T.ev.click+"Dev",function(e){var t=e.pageX,a=e.pageY,i=T.$s.eq(N.idCur),n=i.offset().left,s=i.offset().top,r=T.pa.left?T.pa.left:0,o=t-n,l=a-s,d=(o-r)/T.rate,c=l/T.rate,u="[ "+csVAR.codeName+": x/y position ("+parseInt(o-r)+" ,"+parseInt(l)+")";u+=T.rate<1?" | x/y responsive ("+parseInt(d)+" ,"+parseInt(c)+")]":"]",R.e&&console.log(u)}):n.off(T.ev.click+"Dev")},keyboard:function(){$.off(T.ev.key),a.isKeyboard&&$.on(T.ev.key,function(e){if(X.scroll.check(1),R.into){var t=e.keyCode;37==t?K.prevFn(1):39==t&&K.nextFn(1)}})},mousewheel:function(){var t;n.off(T.ev.wheel),T.wheelDelta=0,e.fn.mousewheel&&a.isMousewheel&&n.on(T.ev.wheel,function(e,a){return t=T.wheelDelta,t+=a/2,-1==a&&-1>=t?(K.prevFn(1),t=0):1==a&&t>=1&&(K.nextFn(1),t=0),T.wheelDelta=t,!1})},resize:function(){var e=function(){clearTimeout(A.resize),A.resize=setTimeout(function(){N.ev.trigger("resize"),!!a.showFrom&&J.toggle(),a.isFullscreen&&(p=T.hCode=I.height()),!R.showFrom||n.width()==f&&n.height()==p||Y.resize()},100)};T.hWin=I.height(),I.off(T.ev.resize),I.on(T.ev.resize,e),clearInterval(A.resizeLoop),A.resizeLoop=setInterval(function(){var e=T.$s.eq(N.idCur).height(),t=n.width();(t!=f||!R.fxRun&&e!=p)&&Y.resize()},200)}},Y={pagToggleFn:function(e,t){if(R.pag&&T.$pag){var i=e?a:O,n=i.pag,s=" "+a.ns,r=s+"pag-",o="",l="";a.pag.moreClass!=O.pag.moreClass&&(o+=" "+n.moreClass),a.pag.type!=O.pag.type&&(o+=s+n.type),a.pag.pos!=O.pag.pos&&(l+=r+n.pos),a.pag.dirs!=O.pag.dirs&&n.dirs?l+=r+n.dirs:t&&(l+="hor"==t.pagDirs?e?r+"hor":r+"ver":e?r+"ver":r+"hor"),o+=" "+l,e?T.$pag.addClass(o):T.$pag.removeClass(o),"tab"==n.type&&(e?b.addClass(l):b.removeClass(l))}},removeClass:function(e){var t=" "+a.ns,i=t+"one"+t+"multi";i+=t+"line"+t+"dot"+t+"dash",i+=t+"height-auto"+t+"height-fixed",b.removeClass(i),Y.pagToggleFn(0,e)},addClass:function(e){var t=" "+a.ns,i=t+a.layout+t+"height-"+a.height;R.ts||(i+=t+"old"),R.showFrom||(i+=t+"hide"),b.addClass(i),Y.pagToggleFn(1,e)},reset:function(){if("dot"==a.layout){var t={};t[g]="",T.$s.css(t),q.translateX(i,0,1,1)}a.height0!=a.height&&T.$s.each(function(){z.backCenter.reset(e(this))})},resize:function(){R.pag&&!R.pagList&&j.sizeItem(),W.wCode(),R.res&&tt.varible(),"fixed"==a.height&&W.codeHeightFix(),R.res&&a.isFullscreen&&at.varible(),z.backUpdate(),W.slideHeight(),W.general(),W.codeHeight(1),setTimeout(j.toHor,40)}},J={get:function(){if(a.showFrom){if("string"==typeof a.showFrom){var e=a.showFrom;a.showFrom=[e]}else if("number"==typeof a.showFrom){var e=a.showFrom;a.showFrom=[e+"-100000"]}for(T.showFrom={},T.showFrom.num=a.showFrom.length,x=T.showFrom.num-1;x>=0;x--){var t=[],i=a.showFrom[x];"number"==typeof i&&(i+="-100000"),t=i.split("-"),T.showFrom[x]={from:parseInt(t[0]),to:parseInt(t[1])}}J.check()}else R.showFrom=1,R.awake=1;R.show=R.mobile&&"desktop"==a.show||!R.mobile&&"mobile"==a.show?0:1},check:function(){var e=T.showFrom,t=I.width();for(R.showFrom=0,x=e.num-1;x>=0;x--)if(t>=e[x].from&&t<=e[x].to){R.showFrom=1;break}R.awake==S&&R.showFrom&&(R.awake=1)},toggle:function(){J.check();var e=a.ns+"hide";R.showFrom||b.hasClass(e)||b.addClass(e),R.showFrom&&b.hasClass(e)&&b.removeClass(e)},resizeON:function(){var e=200;b.addClass(a.ns+"hide"),I.on("resize.codeShow"+P,function(){clearTimeout(A.showResize),A.showResize=setTimeout(function(){J.check(),R.awake&&J.resizeOFF()},e)})},resizeOFF:function(){I.off("resize.codeShow"+P),b.removeClass(a.ns+"hide"),F.ready()}},Z={toggle:function(t,i){var n=t.data("html").cap,s=i.length?i.data("html").cap:"",r={duration:a.speedHeight,complete:function(){var t=e(this);t.is(T.$capLast)?t.css("visibility",""):t.is(T.$capInner)&&t.css("height","")}};T.$capCur.html(n);var o=T.$capCur.outerHeight(!0),l=T.$capLast.outerHeight(!0)||o;R.mobile||R.ie7||(T.$capLast.html(s),T.$capCur.stop(!0).css("opacity",0).animate({opacity:1},r),T.$capLast.stop(!0).css({opacity:1,visibility:"visible"}).animate({opacity:0},r),o!=l&&T.$capInner.stop(!0).css("height",l).animate({height:o},r))}},et={array:function(e){return"object"==typeof e?e[X.r(X.rm(0,e.length-1))]:e},init:function(e){var t,i=N.idCur,n=T.fx[i],s=T.fxType[i];"js"==s?(t="random"==n?a.fxName[X.r(X.rm(1,T.fxNum-1))]:n,t=et.array(t),"fade"==t?et[t](e):(e.$tar=e.$sCur.find("."+a.ns+"imgback"),e.$tar.length&&et[t]?et[t](e):et.end())):R.ts?et.css():et.jFade(0)},end:function(e){clearTimeout(A.fxEnd),A.fxEnd=setTimeout(function(){e&&(e.d.is&&e.$tar.find("img").css("visibility",""),e.$fxOver.remove()),_.end()},T.speed[N.idCur])},css:function(){var e="code",t=N.idCur,i=N.idLast,s="cssOne"==T.fxType[t],r=" "+e+"-animated",o=a.ns+"noclip",l=s?"tiRemoveCSSOne":"tiRemoveCSS",d="fxAdded",c=T.speed[t],u={},p={},f=T.fxEase[t],h=T.prefix+"animation-timing-function",g={},m=e+"-slide",v=m+"In",w=m+"Out";u[C]=c+"ms",g[h]=f?f:"",p[C]="",p[h]="";var y=function(e,t){var a,i,n=T.$s.eq(e);s?(a=t?v:w,i=t?w:v):(a=T.fx[e][t?0:1]||"",i=n.data(d)||"",a=et.array(a),n.data("fxAdded",a)),clearTimeout(n.data(l)),n.css(u),n.removeClass(i).css(g).addClass(a+r),n.data(l,setTimeout(function(){n.removeClass(a+r).css(p)},c))};y(i,0),y(t,1);var x,b;if(s){var I=e+"fx-",x=I+et.array(T.fx[t]),b=n.data(d),$=T.nMove>0,L=$?m+"Next":m+"Prev",k=$?m+"Prev":m+"Next";x=o+" "+x+" "+L,b=b+" "+k,n.data("fxAdded",x)}else x=o,b="";clearTimeout(n.data(l)),n.removeClass(b).addClass(x),n.data(l,setTimeout(function(){n.removeClass(x)},c));var R=N.idLast2;if(R!=S&&R!=t){var A=T.$s.eq(R),D=s?w:A.data(d)||"";clearTimeout(A.data(l)),A.removeClass(D+r).css(p)}et.end()},jFade:function(e){var t=N.idCur,a={visibility:""},i=function(i,n){var s=T.$s.eq(i),r=n?0:1,o=n?1:0;s.stop(!0).css({opacity:r,visibility:"visible"}).animate({opacity:o},{duration:e?T.speed[t]:250,complete:function(){s.css(a)}})};i(N.idLast,0),i(t,1);var n=N.idLast2;n!=S&&n!=t&&T.$s.eq(n).stop(!0).css(a),et.end()},fade:function(){et.jFade(1)}},tt={valueGet:function(e,t){var a=$.width(),i=t?t:"value",n=1e5,s=-1;for(x=e.num-1;x>=0;x--)e[x].from<=a&&a<=e[x].to&&n>=e[x].to&&(n=e[x].to,s=x);return s>-1?e[s][i]:null},varible:function(){var e=function(){var e;return T.paRange?(e=tt.valueGet(T.paRange),null==e&&(e=0)):e=0,e};if(a.media){var t=T.media.wMax,i=t>T.wRes?t>=f:T.wRes>f;if(i){var n=T.media,s=tt.valueGet(n);T.pa.left=null==s?e():(f-s)/2}else T.pa.left=(f-T.wRes)/2}else T.pa.left=T.wRes>f?e():(f-T.wRes)/2;T.pa.left=~~T.pa.left,W.margin(),T.rateLast=T.rate;var r=(f-2*T.pa.left)/T.wRes;T.rate=r>1?1:r}},at={varible:function(){T.wContent=f-2*T.pa.left,T.hContent=X.r(T.wContent/T.rRes),T.hContent<p?T.pa.top=X.r((p-T.hContent)/2):(T.pa.top=0,T.hContent=p,T.wContent=X.r(T.hContent*T.rRes),T.rate=T.wContent/T.wRes,T.pa.left=X.r((f-T.wContent)/2))}},it={prop:function(){var e="[data-"+csVAR.codeData+"]",t=T.$nestedChild=b.find(e),a=T.$nestedParent=b.parent().closest(e);R.nestedParent=!!t.length,R.nestedChild=!!a.length},autoInit:function(e){var t=e.find("."+csVAR.codeClass);csPLUGIN.AUTORUN(t)},destroy:function(e){var t=e.find("."+csVAR.codeClass);if(t.length){var a=t.data(csVAR.codeName);"object"==typeof a&&a.destroy(!0)}}},nt={filter:function(e){var t="";return e.classAdd!=S&&(t=e.classAdd.toString()),t},toggle:function(){var e=T.classAdd[N.idLast],t=T.classAdd[N.idCur];e!=S&&""!=e&&b.removeClass(e),t!=S&&""!=t&&b.addClass(t)}},st={prev:function(){K.prev()},next:function(){K.next()},first:function(){_.run(0,1)},last:function(){_.run(u-1,1)},goTo:function(e){e>=0&&u>e&&_.run(e,1)},play:function(){gt&&(a.isSlideshow?!R.stop||R.playing||R.fxRun?dt.play():(R.stop=0,dt.reset()):(a.isSlideshow=1,dt.init()))},pause:function(){gt&&(dt.pause(),a.slideshow.isPlayPause&&T.$playpause.addClass(a.ns+a.actived))},stop:function(){gt&&(R.stop||(R.stop=1,dt.pause(1)))},prop:function(t,i,n){O=e.extend(!0,{},a),a=e.extend(!0,a,t),!!R.awake&&!i&&N.refresh(n)},refresh:function(e){Y.removeClass(e),H.code(e),H.slide(),X.toggle(),Y.reset(),Y.resize(),U.refresh(),K.swipe(),K.keyboard(),K.mousewheel(),pt&&rt.events(),gt&&dt.update()},destroy:function(e){K.swipe("offBody"),K.swipe("offPag");var t=T.ev.touch.end+" "+T.ev.click;a.isNav&&r.add(o).off(t),a.isPag&&T.$pagItem.off(t),$.off(T.ev.key),n.off(T.ev.wheel),clearInterval(A.resizeLoop),I.off(T.ev.resize),clearInterval(A.timer),I.off(T.ev.scroll),this.stop(),b.removeData(csVAR.codeName),e&&(a.isNav&&s.remove(),a.isPag&&T.$pag.remove(),a.isCap&&c.remove(),a.isSlideshow&&(R.timer&&T.$timer.remove(),a.slideshow.isPlayPause&&T.$playpause.remove(),!!l&&l.remove()),b.remove())},width:function(){return f},height:function(){return p},curId:function(){return N.idCur},slideLength:function(){return u},slideCur:function(){return T.$s.eq(N.idCur)},slideAll:function(){return $s},opts:function(){return a},varible:function(){return T},browser:function(){return R.browser},isMobile:function(){return R.mobile},ev:e(E,{"class":"code-event"})};M.M=X,M.PROP=H,M.RENDER=U,M.LOAD=G,M.EVENTS=K,M.SLIDETO=_,M.NESTED=it;var rt=e.extend({},csPLUGIN.DEEPLINKING,M),ot=e.extend({},csPLUGIN.COOKIE,M),lt=e.extend({},csPLUGIN.AJAX,M),dt=e.extend({},csPLUGIN.SLIDESHOW,M),ct=e.extend({},csPLUGIN.TIMER,M),ut=e.extend({},csPLUGIN.APImore,M),pt=!!csPLUGIN.DEEPLINKING,ft=!!csPLUGIN.COOKIE,ht=!!csPLUGIN.AJAX,gt=!!csPLUGIN.SLIDESHOW,mt=!!csPLUGIN.TIMER;N=e.extend(N,st,ut),e.data(t[0],csVAR.codeName,N),F.check()},e.fn[csVAR.codeName]=function(){var t=arguments,a=csVAR.codeName;return e(this).each(function(){var i=e(this),n=i.data(a);if(void 0===t[0]&&(t[0]={}),"object"==typeof t[0])if(n)n.prop(t[0]);else{var s=e.extend(!0,{},e.fn[a].defaults,t[0]);new e[a](i,s)}else try{n[t[0]](t[1])}catch(r){"object"==typeof console&&console.warn("["+a+": function not exist!]")}})},window[csVAR.codeName]=function(){var t=arguments,a=csVAR.codeName,i=e(t[0]);if(1===i.length){t[1]===UNDEFINED&&(t[1]={});var n=e.extend(!0,{},e.fn[a].defaults,t[1]);return i.data(a)||new e[a](i,n),i.data(a)}},csPLUGIN.AUTORUN=function(t){t.length&&t.each(function(){var t=e(this),a=t.data(csVAR.codeData),i="isAutoRun-";void 0!=a&&""!==a&&(-1!=a.indexOf(i+"true")||-1!=a.indexOf(i+"on")||-1!=a.indexOf(i+"1"))&&!t.data(csVAR.codeName)&&t[csVAR.codeName]()})},e(document).ready(function(){csPLUGIN.AUTORUN(e("."+csVAR.codeClass))}),e.fn[csVAR.codeName].defaults={ns:null,canvasName:"canvas",canvasTag:"div",viewportName:"viewport",slideName:"slide",navName:"nav",nextName:"next",prevName:"prev",playName:"playpause",pagName:"pag",capName:"cap",timerName:"timer",layerName:"layer",overlayName:"overlay",shadowName:"shadow",imgName:"img",lazyName:"src",name:null,dataSlide:"slide",current:"cur",thumbWrap:"thumbitem",actived:"actived",inActived:"inactived",layout:"dot",view:"basic",fx:null,fxDefault:"rectRun",fxOne:null,fxIn:null,fxOut:null,fxEasing:null,fxMobile:null,height:"auto",imgWidth:"none",imgHeight:"none",img:"none",dirs:"hor",easeTouch:"easeOutQuint",easeMove:"easeOutCubic",speed:400,speedHeight:400,speedMobile:null,layerSpeed:400,layerStart:400,perspective:800,slot:"auto",stepNav:"visible",stepPlay:1,responsive:null,media:null,padding:0,margin:0,hCode:null,wSlide:1,idBegin:0,show:"all",showFrom:0,offsetBy:null,isCenter:1,isNav:0,isPag:1,isCap:0,isLayerRaUp:1,isSlideshow:0,isSwipe:1,isMousewheel:0,isLoop:1,isAnimRebound:1,isKeyboard:0,isOverlay:0,isShadow:0,isViewGrabStop:0,isMarginCut:1,isPagSmooth:1,isFullscreen:0,isDeeplinking:0,isCookie:0,combine:{},load:{preload:1,amountEachLoad:2,isNearby:0,nNearby:0},swipe:{isMobile:1,isBody:0,isBodyOnMobile:0,isStopSelectText:1},className:{grab:["grab","grabbing"],swipe:["","swiping"],stop:["left","right"]},fxName:["random","fade","move","rectMove","rectRun","rectSlice","rubyFade","rubyMove","rubyRun","rubyScale","zigzagRun"],pag:{type:"tab",width:null,height:null,dirs:"hor",pos:"top",align:"begin",speed:300,ease:"easeOutCubic",sizeAuto:null,moreClass:null,isActivedCenter:0,wMinToHor:0,mediaToHor:null},slideshow:{delay:8e3,timer:"arc",isAutoRun:1,isPlayPause:1,isTimer:1,isHoverPause:0,isRunInto:1,isRandom:0},arc:{width:null,height:null,fps:24,rotate:0,radius:14,weight:2,stroke:"#fff",fill:"transparent",oRadius:14,oWeight:2,oStroke:"hsla(0,0%,0%,.2)",oFill:"transparent"},markup:{timerInto:"media",playInto:"media"},deeplinking:{prefixDefault:["code","slide"],prefix:null,isIDConvert:1},cookie:{name:"",days:7},layoutFall:"line",fName:"sl",fLoop:1,isInOutBegin:0,isClassRandom:0,isSlAsPag:0,isPosReport:0,rev:["erp"]},e.extend(jQuery.easing,{easeOutQuad:function(e,t,a,i,n){return-i*(t/=n)*(t-2)+a},easeOutQuint:function(e,t,a,i,n){return i*((t=t/n-1)*t*t*t*t+1)+a},easeInCubic:function(e,t,a,i,n){return i*(t/=n)*t*t+a},easeOutCubic:function(e,t,a,i,n){return i*((t=t/n-1)*t*t+1)+a}})}(jQuery),function(e){window.csPLUGIN||(window.csPLUGIN={}),csPLUGIN.DEEPLINKING={check:function(e){var t,a=this.va,n=this.is,s=this.o.deeplinking,r=s.prefixDefault[0]+a.codeID+s.prefixDefault[1],o=null!=s.prefix?s.prefix:r,l=o+"\\d+",d=new RegExp(l,"g"),c=window.location.hash,u=c.match(d),p=function(){if(n.aIDtext)for(i=0;i<a.aIDtext.length;i++){var e=a.aIDtext[i];
if(void 0!=e&&-1!=c.indexOf(e.toString()))return i}return null};if(e)return t=p(),null!=t?t:null!=u&&(t=this.M.pInt(u[0].substr(o.length)),t<this.cs.num)?t:null;var f=null,h=null;t=p(),null!=t&&(h=a.aIDtext[t]),null==h&&null!=u&&(h=u[0]);var g=a.aIDtext[this.cs.idCur];if(n.aIDtext&&void 0!=g&&(f=g),null==f&&(f=o+this.cs.idCur),null!=h){var m=c.split(h);c=m[0]+f+m[1]}else""===c?c="#"+f:c+=/\-$/.test(c)?f:"-"+f;return c},read:function(){var e=this.check(1);null!=e&&(this.cs.idCur=this.o.idBegin=e,this.PROP.setup())},write:function(){var e=this,t=e.ti,a=e.check(0),i=function(){clearTimeout(t.hashReset),t.hashReset=setTimeout(function(){csVAR.stopHashChange=0},100)};clearTimeout(t.hashChange),t.hashChange=setTimeout(function(){csVAR.stopHashChange=1,history.pushState?history.pushState(null,null,a):window.location.hash=a,i()},e.va.speed[e.cs.idCur])},events:function(){var t=this;e(window).off(t.va.ev.hash),t.o.isDeeplinking&&e(window).on(t.va.ev.hash,function(e){if(e.preventDefault(),!csVAR.stopHashChange){var a=t.check(1);null!=a&&t.SLIDETO.run(a,1,0,1)}})}}}(jQuery),function(){window.csPLUGIN||(window.csPLUGIN={}),csPLUGIN.COOKIE={write:function(){var e=new Date,t="code"+this.va.codeID+this.o.cookie.name+window.location.host;e.setTime(e.getTime()+24*this.o.cookie.days*60*60*1e3);var a="; expires="+e.toGMTString();document.cookie=t+"="+this.cs.idCur+a+"; path=/"},read:function(){var e=document.cookie.replace(/\s+/g,"").split(";"),t="code"+this.va.codeID+this.o.cookie.name+window.location.host+"=",a=null;for(i=0;i<e.length;i++)0==e[i].indexOf(t)&&(a=this.M.pInt(e[i].substr(t.length)));null!=a&&(this.cs.idCur=this.o.idBegin=a)}}}(jQuery),function(e){window.csPLUGIN||(window.csPLUGIN={}),csPLUGIN.SLIDESHOW={init:function(){this.cs.num>1&&(this.is.hoverAction=0,this.focus(),this.M.scroll.setup(),this.hover(),this.o.slideshow.isPlayPause&&this.toggle(),this.is.stop=0,this.go())},go:function(){var e=this,t=e.is;t.stop||(t.pauseActive?e.pause():!t.focus||!t.into||t.hover||e.va.nVideoOpen||e.va.nMapOpen||!e.o.slideshow.isHoverPause&&t.fxRun?t.playing&&e.pause():t.fxRun||(t.hoverAction?e.reset():e.play()))},update:function(){var t=this.oo,a=this.o,i=this.va,n=this.is,s=this.ti,r=e.extend({},csPLUGIN.TIMER,this),o=t.slideshow,l=a.slideshow;if(o.timer!=l.timer&&(clearInterval(s.timer),this.RENDER.timer(),!!i.tTimer0&&this.pause(),this.play()),n.timer&&"arc"==i.timer&&!!csPLUGIN.TIMER&&r.arcProp(),t.isSlideshow!=a.isSlideshow)if(a.isSlideshow)this.init();else{this.pause(1);var d=" focus.code"+i.codekey+" blur.code"+i.codekey+" scroll.code"+i.codekey;e(window).off(d),i.$cs.off("mouseenter.code mouseleave.code")}o.isHoverPause!=l.isHoverPause&&this.hover()},play:function(){var t=this,a=t.va,i=t.is,n=t.ti,s=t.cs,r=t.o,o=e.extend({},csPLUGIN.TIMER,t),l=function(){clearTimeout(n.play),n.play=setTimeout(function(){t.reset()},a.speed[s.idCur]-10)};i.playing=1,a.tTimer0=+new Date,i.timer&&!!csPLUGIN.TIMER&&o[a.timer+"Update"](),clearTimeout(n.play),n.play=setTimeout(function(){var e=s.num,i=r.slideshow.isRandom&&e>2,n="dash"==r.layout?t.ds.nEnd:s.idCur,o=i?t.M.raExcept(0,e-1,n):n>=e-1?0:n+1,d=a.$s.eq(o);d.data("is").loaded?(i?t.SLIDETO.run(o,1):r.isLoop||n!=e-1?t.EVENTS.next(1):t.SLIDETO.run(0,1),l()):(d.data({isPlayNext:1}),s.stop())},a.tDelay)},reset:function(){var e=this.va;e.tDelay!=e.delay[this.cs.idCur]&&(e.tDelay=e.delay[this.cs.idCur]),"bar"==e.timer&&100!=e.xTimer?e.xTimer=100:"number"==e.timer&&0!=e.xTimer?e.xTimer=0:"arc"==e.timer&&(e.arc.angCur=0),this.play()},pause:function(t){var a=this,i=a.va,n=a.is,s=a.cs.idCur,r=!!csPLUGIN.TIMER,o=e.extend({},csPLUGIN.TIMER,a);if(n.playing=0,n.hoverAction=0,t)i.tDelay=i.delay[s],r&&o[i.timer+"Setup"];else{var l=i.tDelay;i.tTimer1=+new Date,i.tDelay=i.delay[s]-(i.tTimer1-i.tTimer0),i.delay[s]!=l&&(i.tDelay-=i.delay[s]-l),i.tDelay<0&&(i.tDelay=0,n.hoverAction=1)}this.stop(),clearTimeout(a.ti.play)},stop:function(){var e=this.va,t=this.ti;switch(e.timer){case"bar":e.xTimer=e.tDelay/e.delay[this.cs.idCur]*100;var a={};a[e.cssTf]=this.M.tlx(-e.xTimer,"%"),this.is.ts?e.$timerItem.css(e.cssD0).css(a):e.$timerItem.stop(!0).css(a);break;case"arc":e.arc.angCur=360-e.tDelay/e.delay[this.cs.idCur]*360,clearInterval(t.timer);break;case"number":clearInterval(t.timer)}},focus:function(){var t=this,a=t.is,i=".code"+t.va.codekey;a.focus=1,e(window).on("focus"+i,function(){a.focus||(a.focus=1,t.go())}).on("blur"+i,function(){a.focus&&(a.focus=0,t.go())})},hover:function(){var e=this,t=e.va.$cs;e.o.slideshow.isHoverPause?(e.is.hover=0,t.off("mouseenter.code mouseleave.code").on("mouseenter.code",function(){e.hover1()}).on("mouseleave.code",function(){e.hover0()})):t.off("mouseenter.code mouseleave.code")},hover0:function(){this.is.hover=0,this.go()},hover1:function(){this.is.hover=1,this.go()},toggle:function(){var e=this,t=e.o,a=e.va,i=t.ns+t.actived,n=a.ev.click;a.$playpause.off(n),a.$playpause.on(n,function(){return a.$playpause.hasClass(i)?(e.is.pauseActive=0,a.$playpause.removeClass(i)):(e.is.pauseActive=1,a.$playpause.addClass(i)),e.go(),!1})}}}(jQuery),function(e){window.csPLUGIN||(window.csPLUGIN={}),csPLUGIN.TIMER={render:function(){var t=this.o,a=this.va,i=this.is;if(!!a.$timer&&a.$timer.remove(),i.timer){var n=t.ns+t.timerName,s=n+"-"+a.timer,r="<div></div>",o=this.RENDER.searchDOM("."+n);o.length?a.$timer=o.addClass(s):(a.$timer=e(r,{"class":n+" "+s}),this.RENDER.into(t.markup.timerInto,a.$timer)),"bar"==a.timer?(a.$timerItem=e(r,{"class":n+"item"}),a.$timer.append(a.$timerItem),this.barSetup()):"arc"==a.timer?(a.$timerItem=e("<canvas></canvas>"),a.$timer.append(a.$timerItem),this.arcProp()):"number"==a.timer&&(a.$timerItem=e("<span></span>",{"class":n+"item","data-num":0,text:0}),a.$timer.append(a.$timerItem))}},barSetup:function(){var e=this.va,t={};if(t[e.cssTf]=this.M.tlx(-100,"%"),this.is.ts){var a={};a=this.M.ts(e.cssTf,0,"linear"),e.$timerItem.css(a).css(t)}else e.$timerItem.css(t)},arcSetup:function(){},numberSetup:function(){this.va.$timerItem.attr("data-num",0).text(0)},noneSetup:function(){},barUpdate:function(){var e=this,t=e.va,a=e.is,i=function(){var i={};i[t.cssTf]=e.M.tlx(-t.xTimer,"%"),a.ts?(t.$timerItem.hide().show(),t.$timerItem.css(t.cssD0).css(i)):t.$timerItem.css(i)},n=function(){var i={};if(i[t.cssTf]=e.M.tlx(0),a.ts){var n={};n[t.cssD]=t.tDelay+"ms",t.$timerItem.hide().show(),t.$timerItem.css(n),setTimeout(function(){t.$timerItem.css(i)},50)}else t.$timerItem.animate(i,{duration:t.tDelay,easing:"linear"})};i(),setTimeout(n,20)},arcUpdate:function(){var e=this.va,t=this.ti,a=Math.ceil(360*e.arc.speed/e.delay[this.cs.idCur]),i=function(){var i=e.tContext,n=e.arc,s=Math.ceil((n.radius-n.weight)/2);i.clearRect(-n.width/2,-n.height/2,n.width,n.height),i.beginPath(),i.arc(0,0,n.oRadius,0,360*n.pi,!1),i.lineWidth=n.oWeight,i.strokeStyle=n.oStroke,i.fillStyle=n.oFill,i.stroke(),i.fill(),i.beginPath(),i.arc(0,0,s+1,0,n.pi*Math.ceil(10*n.angCur)/10,!1),i.lineWidth=2*s+2,i.strokeStyle=n.fill,i.stroke(),i.beginPath(),i.arc(0,0,n.radius,0,n.pi*n.angCur,!1),i.lineWidth=n.weight,i.strokeStyle=n.stroke,i.stroke(),e.arc.angCur+=a,e.arc.angCur>370&&clearInterval(t.timer)};i(),clearInterval(t.timer),t.timer=setInterval(i,e.arc.speed)},numberUpdate:function(){var e=this,t=e.va,a=100,i=function(){t.tDelay-=a,t.xTimer0=t.xTimer,t.xTimer=100-t.tDelay/t.delay[e.cs.idCur]*100,t.xTimer=Math.round(t.xTimer),t.xTimer>100&&(t.xTimer=0),t.xTimer0!=t.xTimer&&t.$timerItem.attr("data-num",t.xTimer).text(t.xTimer)};clearInterval(e.ti.timer),e.ti.timer=setInterval(i,a)},noneUpdate:function(){},arcProp:function(){var t=this.va,a=this.o,i={angCur:t.arc&&t.arc.angCur?t.arc.angCur:0,pi:Math.PI/180,width:null==a.arc.width?t.$timer.width():a.arc.width,height:null==a.arc.height?t.$timer.height():a.arc.height,speed:~~(1e3/a.arc.fps)};t.arc=e.extend(a.arc,i),t.$timerItem.attr({width:t.arc.width,height:t.arc.height}),t.tContext=t.$timerItem[0].getContext("2d");var n=function(){var e=t.tContext;e.setTransform(1,0,0,1,0,0),e.translate(t.arc.width/2,t.arc.height/2),e.rotate(-t.arc.pi*(90-t.arc.rotate)),e.strokeStyle=t.arc.stroke,e.fillStyle=t.arc.fill,e.lineWidth=t.arc.weight};n()}}}(jQuery),function(e){window.csPLUGIN||(window.csPLUGIN={}),csPLUGIN.AJAX={check:function(e,t){var a=t.data("is");e.media&&"string"==typeof e.media.ajax&&(a.ajax=1)},removeAutoLoad:function(e){var t=[];for(i=0;i<e.length;i++){var a=this.va.$s.eq(i).data("is");a.ajax||t.push(e[i])}return t},get:function(t){var a=this,i=t.data("media").ajax,n=t.data("is"),s=function(){n.loadBy="ajax",a.LOAD.slideBegin(t)},r={type:"GET",cache:!1,beforeSend:function(){n.loading=1},success:function(e){t.html(t.html()+e);var i=t.find("."+a.o.ns+"loader");i.length&&(t.data("$").slLoader=i),s()},error:function(){n.loaded=0,s()}};e.ajax(i,r)}}}(jQuery),function(e){window.csPLUGIN||(window.csPLUGIN={}),csPLUGIN.APImore={indexParse:function(e,t){var a=this.num;return/^\-?\d+/g.test(e)&&(e=parseInt(e)),"number"==typeof e&&e>=0&&a>e||(e=t?a:a-1),e},fnAddSlide:function(t,a){var i=this,n=i,s=i.o,r=i.va,o=i.is,l=e(t),d=1==l.length&&"div"==l[0].tagName.toLowerCase(),c=d?l:e("<div></div>",{html:t});c=i.RENDER.slide(c),a=i.indexParse(a,1);var u=a==n.num;if(u?r.$canvas.append(c):(r.$s.eq(a).before(c),r.$s=r.$canvas.children("."+s.ns+s.slideName)),o.pag){i.RENDER.capPagHTML(c);var p=i.RENDER.pagitem(c);u?r.$pagInner.append(p):(r.$pagItem.eq(a).before(p),r.$pagItem=r.$pagInner.children("."+s.ns+"pagitem")),i.EVENTS.pag()}a==n.idCur&&(n.idLast=n.idCur+1),s.load.isNearby?n.refresh():(o.apiAdd=1,i.PROP.code(),i.PROP.slide(),c.data("is").loadBy="apiAdd",i.LOAD.slideBegin(c)),i.NESTED.autoInit(c)},getFromURL:function(t,a){var i=this,n={type:"GET",cache:!1,crossDomain:!0,success:function(e){i.fnAddSlide(e,a)},error:function(){i.is.e&&console.warn("["+csVAR.codeName+": ajax load failed] -> "+t)}};e.ajax(t,n)},addSlide:function(t,a){var i=this,n=function(e){i.fnAddSlide(e,a)};"string"==typeof t&&""!=t?n(t):"object"==typeof t&&(void 0!=t.ajax&&"string"==typeof t.ajax?i.getFromURL(t.ajax,a):void 0!=t.selector&&"object"==typeof t.selector?n(t.selector):void 0!=t.html&&"string"==typeof t.html&&n(e(html)))},removeSlide:function(e){var t=this,a=this.o,i=this.va,n=this.is;if(t.num>1){e=this.indexParse(e,0);var s=i.$s.eq(e);t.idCur==t.num-1&&(t.idCur=t.num-2),this.NESTED.destroy(s),s.remove(),i.$s=i.$canvas.children("."+a.ns+a.slideName),n.pag&&(i.$pagItem.eq(e).remove(),i.$pagItem=i.$pag.find("."+a.ns+"pagitem")),n.apiRemove=1,t.prop(),n.apiRemove=0}},swipeEvent:function(e){"string"==typeof e&&-1!="onBody onPag offBody offPag".indexOf(e)&&this.EVENTS.swipe(e)}}}(jQuery);
/*! 
 * Master Slider – Responsive Touch Swipe Slider
 * Copyright © 2015 All Rights Reserved. 
 *
 * @author Averta [www.averta.net]
 * @version 2.16.3
 * @date Dec 2015
 */
window.averta={},function($){function getVendorPrefix(){if("result"in arguments.callee)return arguments.callee.result;var regex=/^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,someScript=document.getElementsByTagName("script")[0];for(var prop in someScript.style)if(regex.test(prop))return arguments.callee.result=prop.match(regex)[0];return arguments.callee.result="WebkitOpacity"in someScript.style?"Webkit":"KhtmlOpacity"in someScript.style?"Khtml":""}function checkStyleValue(prop){var b=document.body||document.documentElement,s=b.style,p=prop;if("string"==typeof s[p])return!0;v=["Moz","Webkit","Khtml","O","ms"],p=p.charAt(0).toUpperCase()+p.substr(1);for(var i=0;i<v.length;i++)if("string"==typeof s[v[i]+p])return!0;return!1}function supportsTransitions(){return checkStyleValue("transition")}function supportsTransforms(){return checkStyleValue("transform")}function supports3DTransforms(){if(!supportsTransforms())return!1;var has3d,el=document.createElement("i"),transforms={WebkitTransform:"-webkit-transform",OTransform:"-o-transform",MSTransform:"-ms-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",Transform:"transform",transform:"transform"};el.style.display="block",document.body.insertBefore(el,null);for(var t in transforms)void 0!==el.style[t]&&(el.style[t]="translate3d(1px,1px,1px)",has3d=window.getComputedStyle(el).getPropertyValue(transforms[t]));return document.body.removeChild(el),null!=has3d&&has3d.length>0&&"none"!==has3d}window["package"]=function(name){window[name]||(window[name]={})};var extend=function(target,object){for(var key in object)target[key]=object[key]};Function.prototype.extend=function(superclass){"function"==typeof superclass.prototype.constructor?(extend(this.prototype,superclass.prototype),this.prototype.constructor=this):(this.prototype.extend(superclass),this.prototype.constructor=this)};var trans={Moz:"-moz-",Webkit:"-webkit-",Khtml:"-khtml-",O:"-o-",ms:"-ms-",Icab:"-icab-"};window._mobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),window._touch="ontouchstart"in document,$(document).ready(function(){window._jcsspfx=getVendorPrefix(),window._csspfx=trans[window._jcsspfx],window._cssanim=supportsTransitions(),window._css3d=supports3DTransforms(),window._css2d=supportsTransforms()}),window.parseQueryString=function(url){var queryString={};return url.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function($0,$1,$2,$3){queryString[$1]=$3}),queryString};var fps60=50/3;if(window.requestAnimationFrame||(window.requestAnimationFrame=function(){return window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(callback){window.setTimeout(callback,fps60)}}()),window.getComputedStyle||(window.getComputedStyle=function(el){return this.el=el,this.getPropertyValue=function(prop){var re=/(\-([a-z]){1})/g;return"float"==prop&&(prop="styleFloat"),re.test(prop)&&(prop=prop.replace(re,function(){return arguments[2].toUpperCase()})),el.currentStyle[prop]?el.currentStyle[prop]:null},el.currentStyle}),Array.prototype.indexOf||(Array.prototype.indexOf=function(elt){var len=this.length>>>0,from=Number(arguments[1])||0;for(from=0>from?Math.ceil(from):Math.floor(from),0>from&&(from+=len);len>from;from++)if(from in this&&this[from]===elt)return from;return-1}),window.isMSIE=function(version){if(!$.browser.msie)return!1;if(!version)return!0;var ieVer=$.browser.version.slice(0,$.browser.version.indexOf("."));return"string"==typeof version?eval(-1!==version.indexOf("<")||-1!==version.indexOf(">")?ieVer+version:version+"=="+ieVer):version==ieVer},$.removeDataAttrs=function($target,exclude){var i,attrName,dataAttrsToDelete=[],dataAttrs=$target[0].attributes,dataAttrsLen=dataAttrs.length;for(exclude=exclude||[],i=0;dataAttrsLen>i;i++)attrName=dataAttrs[i].name,"data-"===attrName.substring(0,5)&&-1===exclude.indexOf(attrName)&&dataAttrsToDelete.push(dataAttrs[i].name);$.each(dataAttrsToDelete,function(index,attrName){$target.removeAttr(attrName)})},jQuery){$.jqLoadFix=function(){if(this.complete){var that=this;setTimeout(function(){$(that).load()},1)}},jQuery.uaMatch=jQuery.uaMatch||function(ua){ua=ua.toLowerCase();var match=/(chrome)[ \/]([\w.]+)/.exec(ua)||/(webkit)[ \/]([\w.]+)/.exec(ua)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua)||/(msie) ([\w.]+)/.exec(ua)||ua.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)||[];return{browser:match[1]||"",version:match[2]||"0"}},matched=jQuery.uaMatch(navigator.userAgent),browser={},matched.browser&&(browser[matched.browser]=!0,browser.version=matched.version),browser.chrome?browser.webkit=!0:browser.webkit&&(browser.safari=!0);var isIE11=!!navigator.userAgent.match(/Trident\/7\./);isIE11&&(browser.msie="true",delete browser.mozilla),jQuery.browser=browser,$.fn.preloadImg=function(src,_event){return this.each(function(){var $this=$(this),self=this,img=new Image;img.onload=function(event){null==event&&(event={}),$this.attr("src",src),event.width=img.width,event.height=img.height,$this.data("width",img.width),$this.data("height",img.height),setTimeout(function(){_event.call(self,event)},50),img=null},img.src=src}),this}}}(jQuery),function(){"use strict";averta.EventDispatcher=function(){this.listeners={}},averta.EventDispatcher.extend=function(_proto){var instance=new averta.EventDispatcher;for(var key in instance)"constructor"!=key&&(_proto[key]=averta.EventDispatcher.prototype[key])},averta.EventDispatcher.prototype={constructor:averta.EventDispatcher,addEventListener:function(event,listener,ref){this.listeners[event]||(this.listeners[event]=[]),this.listeners[event].push({listener:listener,ref:ref})},removeEventListener:function(event,listener,ref){if(this.listeners[event]){for(var i=0;i<this.listeners[event].length;++i)listener===this.listeners[event][i].listener&&ref===this.listeners[event][i].ref&&this.listeners[event].splice(i--,1);0===this.listeners[event].length&&(this.listeners[event]=null)}},dispatchEvent:function(event){if(event.target=this,this.listeners[event.type])for(var i=0,l=this.listeners[event.type].length;l>i;++i)this.listeners[event.type][i].listener.call(this.listeners[event.type][i].ref,event)}}}(),function($){"use strict";var isTouch="ontouchstart"in document,isPointer=window.navigator.pointerEnabled,isMSPoiner=!isPointer&&window.navigator.msPointerEnabled,usePointer=isPointer||isMSPoiner,ev_start=(isPointer?"pointerdown ":"")+(isMSPoiner?"MSPointerDown ":"")+(isTouch?"touchstart ":"")+"mousedown",ev_move=(isPointer?"pointermove ":"")+(isMSPoiner?"MSPointerMove ":"")+(isTouch?"touchmove ":"")+"mousemove",ev_end=(isPointer?"pointerup ":"")+(isMSPoiner?"MSPointerUp ":"")+(isTouch?"touchend ":"")+"mouseup",ev_cancel=(isPointer?"pointercancel ":"")+(isMSPoiner?"MSPointerCancel ":"")+"touchcancel";averta.TouchSwipe=function($element){this.$element=$element,this.enabled=!0,$element.bind(ev_start,{target:this},this.__touchStart),$element[0].swipe=this,this.onSwipe=null,this.swipeType="horizontal",this.noSwipeSelector="input, textarea, button, .no-swipe, .ms-no-swipe",this.lastStatus={}};var p=averta.TouchSwipe.prototype;p.getDirection=function(new_x,new_y){switch(this.swipeType){case"horizontal":return new_x<=this.start_x?"left":"right";case"vertical":return new_y<=this.start_y?"up":"down";case"all":return Math.abs(new_x-this.start_x)>Math.abs(new_y-this.start_y)?new_x<=this.start_x?"left":"right":new_y<=this.start_y?"up":"down"}},p.priventDefultEvent=function(new_x,new_y){var dx=Math.abs(new_x-this.start_x),dy=Math.abs(new_y-this.start_y),horiz=dx>dy;return"horizontal"===this.swipeType&&horiz||"vertical"===this.swipeType&&!horiz},p.createStatusObject=function(evt){var temp_x,temp_y,status_data={};return temp_x=this.lastStatus.distanceX||0,temp_y=this.lastStatus.distanceY||0,status_data.distanceX=evt.pageX-this.start_x,status_data.distanceY=evt.pageY-this.start_y,status_data.moveX=status_data.distanceX-temp_x,status_data.moveY=status_data.distanceY-temp_y,status_data.distance=parseInt(Math.sqrt(Math.pow(status_data.distanceX,2)+Math.pow(status_data.distanceY,2))),status_data.duration=(new Date).getTime()-this.start_time,status_data.direction=this.getDirection(evt.pageX,evt.pageY),status_data},p.__reset=function(event,jqevt){this.reset=!1,this.lastStatus={},this.start_time=(new Date).getTime();var point=this.__getPoint(event,jqevt);this.start_x=point.pageX,this.start_y=point.pageY},p.__touchStart=function(event){var swipe=event.data.target,jqevt=event;if(swipe.enabled&&!($(event.target).closest(swipe.noSwipeSelector,swipe.$element).length>0)){if(event=event.originalEvent,usePointer&&$(this).css("-ms-touch-action","horizontal"===swipe.swipeType?"pan-y":"pan-x"),!swipe.onSwipe)return void $.error("Swipe listener is undefined");if(!(swipe.touchStarted||isTouch&&swipe.start_time&&"mousedown"===event.type&&(new Date).getTime()-swipe.start_time<600)){var point=swipe.__getPoint(event,jqevt);swipe.start_x=point.pageX,swipe.start_y=point.pageY,swipe.start_time=(new Date).getTime(),$(document).bind(ev_end,{target:swipe},swipe.__touchEnd).bind(ev_move,{target:swipe},swipe.__touchMove).bind(ev_cancel,{target:swipe},swipe.__touchCancel);var status=swipe.createStatusObject(point);status.phase="start",swipe.onSwipe.call(null,status),isTouch||jqevt.preventDefault(),swipe.lastStatus=status,swipe.touchStarted=!0}}},p.__touchMove=function(event){var swipe=event.data.target,jqevt=event;if(event=event.originalEvent,swipe.touchStarted){clearTimeout(swipe.timo),swipe.timo=setTimeout(function(){swipe.__reset(event,jqevt)},60);var point=swipe.__getPoint(event,jqevt),status=swipe.createStatusObject(point);swipe.priventDefultEvent(point.pageX,point.pageY)&&jqevt.preventDefault(),status.phase="move",swipe.lastStatus=status,swipe.onSwipe.call(null,status)}},p.__touchEnd=function(event){var swipe=event.data.target,jqevt=event;event=event.originalEvent,clearTimeout(swipe.timo);var status=swipe.lastStatus;isTouch||jqevt.preventDefault(),status.phase="end",swipe.touchStarted=!1,swipe.priventEvt=null,$(document).unbind(ev_end,swipe.__touchEnd).unbind(ev_move,swipe.__touchMove).unbind(ev_cancel,swipe.__touchCancel),status.speed=status.distance/status.duration,swipe.onSwipe.call(null,status)},p.__touchCancel=function(event){var swipe=event.data.target;swipe.__touchEnd(event)},p.__getPoint=function(event,jqEvent){return isTouch&&-1===event.type.indexOf("mouse")?event.touches[0]:usePointer?event:jqEvent},p.enable=function(){this.enabled||(this.enabled=!0)},p.disable=function(){this.enabled&&(this.enabled=!1)}}(jQuery),function(){"use strict";averta.Ticker=function(){};var st=averta.Ticker,list=[],len=0,__stopped=!0;st.add=function(listener,ref){return list.push([listener,ref]),1===list.length&&st.start(),len=list.length},st.remove=function(listener,ref){for(var i=0,l=list.length;l>i;++i)list[i]&&list[i][0]===listener&&list[i][1]===ref&&list.splice(i,1);len=list.length,0===len&&st.stop()},st.start=function(){__stopped&&(__stopped=!1,__tick())},st.stop=function(){__stopped=!0};var __tick=function(){if(!st.__stopped){for(var item,i=0;i!==len;i++)item=list[i],item[0].call(item[1]);requestAnimationFrame(__tick)}}}(),function(){"use strict";Date.now||(Date.now=function(){return(new Date).getTime()}),averta.Timer=function(delay,autoStart){this.delay=delay,this.currentCount=0,this.paused=!1,this.onTimer=null,this.refrence=null,autoStart&&this.start()},averta.Timer.prototype={constructor:averta.Timer,start:function(){this.paused=!1,this.lastTime=Date.now(),averta.Ticker.add(this.update,this)},stop:function(){this.paused=!0,averta.Ticker.remove(this.update,this)},reset:function(){this.currentCount=0,this.paused=!0,this.lastTime=Date.now()},update:function(){this.paused||Date.now()-this.lastTime<this.delay||(this.currentCount++,this.lastTime=Date.now(),this.onTimer&&this.onTimer.call(this.refrence,this.getTime()))},getTime:function(){return this.delay*this.currentCount}}}(),function(){"use strict";window.CSSTween=function(element,duration,delay,ease){this.$element=element,this.duration=duration||1e3,this.delay=delay||0,this.ease=ease||"linear"};var p=CSSTween.prototype;p.to=function(callback,target){return this.to_cb=callback,this.to_cb_target=target,this},p.from=function(callback,target){return this.fr_cb=callback,this.fr_cb_target=target,this},p.onComplete=function(callback,target){return this.oc_fb=callback,this.oc_fb_target=target,this},p.chain=function(csstween){return this.chained_tween=csstween,this},p.reset=function(){clearTimeout(this.start_to),clearTimeout(this.end_to)},p.start=function(){var element=this.$element[0];clearTimeout(this.start_to),clearTimeout(this.end_to),this.fresh=!0,this.fr_cb&&(element.style[window._jcsspfx+"TransitionDuration"]="0ms",this.fr_cb.call(this.fr_cb_target));var that=this;return this.onTransComplete=function(){that.fresh&&(that.reset(),element.style[window._jcsspfx+"TransitionDuration"]="",element.style[window._jcsspfx+"TransitionProperty"]="",element.style[window._jcsspfx+"TransitionTimingFunction"]="",element.style[window._jcsspfx+"TransitionDelay"]="",that.fresh=!1,that.chained_tween&&that.chained_tween.start(),that.oc_fb&&that.oc_fb.call(that.oc_fb_target))},this.start_to=setTimeout(function(){that.$element&&(element.style[window._jcsspfx+"TransitionDuration"]=that.duration+"ms",element.style[window._jcsspfx+"TransitionProperty"]=that.transProperty||"all",element.style[window._jcsspfx+"TransitionDelay"]=that.delay>0?that.delay+"ms":"",element.style[window._jcsspfx+"TransitionTimingFunction"]=that.ease,that.to_cb&&that.to_cb.call(that.to_cb_target),that.end_to=setTimeout(function(){that.onTransComplete()},that.duration+(that.delay||0)))},100),this}}(),function(){"use strict";function transPos(element,properties){if(void 0!==properties.x||void 0!==properties.y)if(_cssanim){var trans=window._jcsspfx+"Transform";void 0!==properties.x&&(properties[trans]=(properties[trans]||"")+" translateX("+properties.x+"px)",delete properties.x),void 0!==properties.y&&(properties[trans]=(properties[trans]||"")+" translateY("+properties.y+"px)",delete properties.y)}else{if(void 0!==properties.x){var posx="auto"!==element.css("right")?"right":"left";properties[posx]=properties.x+"px",delete properties.x}if(void 0!==properties.y){var posy="auto"!==element.css("bottom")?"bottom":"top";properties[posy]=properties.y+"px",delete properties.y}}return properties}var _cssanim=null;window.CTween={},CTween.setPos=function(element,pos){element.css(transPos(element,pos))},CTween.animate=function(element,duration,properties,options){if(null==_cssanim&&(_cssanim=window._cssanim),options=options||{},transPos(element,properties),_cssanim){var tween=new CSSTween(element,duration,options.delay,EaseDic[options.ease]);return options.transProperty&&(tween.transProperty=options.transProperty),tween.to(function(){element.css(properties)}),options.complete&&tween.onComplete(options.complete,options.target),tween.start(),tween.stop=tween.reset,tween}var onCl;return options.delay&&element.delay(options.delay),options.complete&&(onCl=function(){options.complete.call(options.target)}),element.stop(!0).animate(properties,duration,options.ease||"linear",onCl),element},CTween.fadeOut=function(target,duration,remove){var options={};remove===!0?options.complete=function(){target.remove()}:2===remove&&(options.complete=function(){target.css("display","none")}),CTween.animate(target,duration||1e3,{opacity:0},options)},CTween.fadeIn=function(target,duration,reset){reset!==!1&&target.css("opacity",0).css("display",""),CTween.animate(target,duration||1e3,{opacity:1})}}(),function(){window.EaseDic={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",easeInCubic:"cubic-bezier(.55,.055,.675,.19)",easeOutCubic:"cubic-bezier(.215,.61,.355,1)",easeInOutCubic:"cubic-bezier(.645,.045,.355,1)",easeInCirc:"cubic-bezier(.6,.04,.98,.335)",easeOutCirc:"cubic-bezier(.075,.82,.165,1)",easeInOutCirc:"cubic-bezier(.785,.135,.15,.86)",easeInExpo:"cubic-bezier(.95,.05,.795,.035)",easeOutExpo:"cubic-bezier(.19,1,.22,1)",easeInOutExpo:"cubic-bezier(1,0,0,1)",easeInQuad:"cubic-bezier(.55,.085,.68,.53)",easeOutQuad:"cubic-bezier(.25,.46,.45,.94)",easeInOutQuad:"cubic-bezier(.455,.03,.515,.955)",easeInQuart:"cubic-bezier(.895,.03,.685,.22)",easeOutQuart:"cubic-bezier(.165,.84,.44,1)",easeInOutQuart:"cubic-bezier(.77,0,.175,1)",easeInQuint:"cubic-bezier(.755,.05,.855,.06)",easeOutQuint:"cubic-bezier(.23,1,.32,1)",easeInOutQuint:"cubic-bezier(.86,0,.07,1)",easeInSine:"cubic-bezier(.47,0,.745,.715)",easeOutSine:"cubic-bezier(.39,.575,.565,1)",easeInOutSine:"cubic-bezier(.445,.05,.55,.95)",easeInBack:"cubic-bezier(.6,-.28,.735,.045)",easeOutBack:"cubic-bezier(.175, .885,.32,1.275)",easeInOutBack:"cubic-bezier(.68,-.55,.265,1.55)"}}(),function(){"use strict";window.MSAligner=function(type,$container,$img){this.$container=$container,this.$img=$img,this.type=type||"stretch",this.widthOnly=!1,this.heightOnly=!1};var p=MSAligner.prototype;p.init=function(w,h){switch(this.baseWidth=w,this.baseHeight=h,this.imgRatio=w/h,this.imgRatio2=h/w,this.type){case"tile":this.$container.css("background-image","url("+this.$img.attr("src")+")"),this.$img.remove();break;case"center":this.$container.css("background-image","url("+this.$img.attr("src")+")"),this.$container.css({backgroundPosition:"center center",backgroundRepeat:"no-repeat"}),this.$img.remove();break;case"stretch":this.$img.css({width:"100%",height:"100%"});break;case"fill":case"fit":this.needAlign=!0,this.align()}},p.align=function(){if(this.needAlign){var cont_w=this.$container.width(),cont_h=this.$container.height(),contRatio=cont_w/cont_h;"fill"==this.type?this.imgRatio<contRatio?(this.$img.width(cont_w),this.$img.height(cont_w*this.imgRatio2)):(this.$img.height(cont_h),this.$img.width(cont_h*this.imgRatio)):"fit"==this.type&&(this.imgRatio<contRatio?(this.$img.height(cont_h),this.$img.width(cont_h*this.imgRatio)):(this.$img.width(cont_w),this.$img.height(cont_w*this.imgRatio2))),this.setMargin()}},p.setMargin=function(){var cont_w=this.$container.width(),cont_h=this.$container.height();this.$img.css("margin-top",(cont_h-this.$img[0].offsetHeight)/2+"px"),this.$img.css("margin-left",(cont_w-this.$img[0].offsetWidth)/2+"px")}}(),function(){"use strict";var _options={bouncing:!0,snapping:!1,snapsize:null,friction:.05,outFriction:.05,outAcceleration:.09,minValidDist:.3,snappingMinSpeed:2,paging:!1,endless:!1,maxSpeed:160},Controller=function(min,max,options){if(null===max||null===min)throw new Error("Max and Min values are required.");this.options=options||{};for(var key in _options)key in this.options||(this.options[key]=_options[key]);this._max_value=max,this._min_value=min,this.value=min,this.end_loc=min,this.current_snap=this.getSnapNum(min),this.__extrStep=0,this.__extraMove=0,this.__animID=-1},p=Controller.prototype;p.changeTo=function(value,animate,speed,snap_num,dispatch){if(this.stopped=!1,this._internalStop(),value=this._checkLimits(value),speed=Math.abs(speed||0),this.options.snapping&&(snap_num=snap_num||this.getSnapNum(value),dispatch!==!1&&this._callsnapChange(snap_num),this.current_snap=snap_num),animate){this.animating=!0;var self=this,active_id=++self.__animID,amplitude=value-self.value,timeStep=0,targetPosition=value,animFrict=1-self.options.friction,timeconst=animFrict+(speed-20)*animFrict*1.3/self.options.maxSpeed,tick=function(){if(active_id===self.__animID){var dis=value-self.value;if(!(Math.abs(dis)>self.options.minValidDist&&self.animating))return self.animating&&(self.value=value,self._callrenderer()),self.animating=!1,active_id!==self.__animID&&(self.__animID=-1),void self._callonComplete("anim");window.requestAnimationFrame(tick),self.value=targetPosition-amplitude*Math.exp(-++timeStep*timeconst),self._callrenderer()}};return void tick()}this.value=value,this._callrenderer()},p.drag=function(move){this.start_drag&&(this.drag_start_loc=this.value,this.start_drag=!1),this.animating=!1,this._deceleration=!1,this.value-=move,!this.options.endless&&(this.value>this._max_value||this.value<0)?this.options.bouncing?(this.__isout=!0,this.value+=.6*move):this.value=this.value>this._max_value?this._max_value:0:!this.options.endless&&this.options.bouncing&&(this.__isout=!1),this._callrenderer()},p.push=function(speed){if(this.stopped=!1,this.options.snapping&&Math.abs(speed)<=this.options.snappingMinSpeed)return void this.cancel();if(this.__speed=speed,this.__startSpeed=speed,this.end_loc=this._calculateEnd(),this.options.snapping){var snap_loc=this.getSnapNum(this.value),end_snap=this.getSnapNum(this.end_loc);if(this.options.paging)return snap_loc=this.getSnapNum(this.drag_start_loc),this.__isout=!1,void(speed>0?this.gotoSnap(snap_loc+1,!0,speed):this.gotoSnap(snap_loc-1,!0,speed));if(snap_loc===end_snap)return void this.cancel();this._callsnapChange(end_snap),this.current_snap=end_snap}this.animating=!1,this.__needsSnap=this.options.endless||this.end_loc>this._min_value&&this.end_loc<this._max_value,this.options.snapping&&this.__needsSnap&&(this.__extraMove=this._calculateExtraMove(this.end_loc)),this._startDecelaration()},p.bounce=function(speed){this.animating||(this.stopped=!1,this.animating=!1,this.__speed=speed,this.__startSpeed=speed,this.end_loc=this._calculateEnd(),this._startDecelaration())},p.stop=function(){this.stopped=!0,this._internalStop()},p.cancel=function(){this.start_drag=!0,this.__isout?(this.__speed=4e-4,this._startDecelaration()):this.options.snapping&&this.gotoSnap(this.getSnapNum(this.value),!0)},p.renderCallback=function(listener,ref){this.__renderHook={fun:listener,ref:ref}},p.snappingCallback=function(listener,ref){this.__snapHook={fun:listener,ref:ref}},p.snapCompleteCallback=function(listener,ref){this.__compHook={fun:listener,ref:ref}},p.getSnapNum=function(value){return Math.floor((value+this.options.snapsize/2)/this.options.snapsize)},p.nextSnap=function(){this._internalStop();var curr_snap=this.getSnapNum(this.value);!this.options.endless&&(curr_snap+1)*this.options.snapsize>this._max_value?(this.__speed=8,this.__needsSnap=!1,this._startDecelaration()):this.gotoSnap(curr_snap+1,!0)},p.prevSnap=function(){this._internalStop();var curr_snap=this.getSnapNum(this.value);!this.options.endless&&(curr_snap-1)*this.options.snapsize<this._min_value?(this.__speed=-8,this.__needsSnap=!1,this._startDecelaration()):this.gotoSnap(curr_snap-1,!0)},p.gotoSnap=function(snap_num,animate,speed){this.changeTo(snap_num*this.options.snapsize,animate,speed,snap_num)},p.destroy=function(){this._internalStop(),this.__renderHook=null,this.__snapHook=null,this.__compHook=null},p._internalStop=function(){this.start_drag=!0,this.animating=!1,this._deceleration=!1,this.__extrStep=0},p._calculateExtraMove=function(value){var m=value%this.options.snapsize;return m<this.options.snapsize/2?-m:this.options.snapsize-m},p._calculateEnd=function(step){for(var temp_speed=this.__speed,temp_value=this.value,i=0;Math.abs(temp_speed)>this.options.minValidDist;)temp_value+=temp_speed,temp_speed*=this.options.friction,i++;return step?i:temp_value},p._checkLimits=function(value){return this.options.endless?value:value<this._min_value?this._min_value:value>this._max_value?this._max_value:value},p._callrenderer=function(){this.__renderHook&&this.__renderHook.fun.call(this.__renderHook.ref,this,this.value)},p._callsnapChange=function(targetSnap){this.__snapHook&&targetSnap!==this.current_snap&&this.__snapHook.fun.call(this.__snapHook.ref,this,targetSnap,targetSnap-this.current_snap)},p._callonComplete=function(type){this.__compHook&&!this.stopped&&this.__compHook.fun.call(this.__compHook.ref,this,this.current_snap,type)},p._computeDeceleration=function(){if(this.options.snapping&&this.__needsSnap){var xtr_move=(this.__startSpeed-this.__speed)/this.__startSpeed*this.__extraMove;this.value+=this.__speed+xtr_move-this.__extrStep,this.__extrStep=xtr_move}else this.value+=this.__speed;if(this.__speed*=this.options.friction,this.options.endless||this.options.bouncing||(this.value<=this._min_value?(this.value=this._min_value,this.__speed=0):this.value>=this._max_value&&(this.value=this._max_value,this.__speed=0)),this._callrenderer(),!this.options.endless&&this.options.bouncing){var out_value=0;this.value<this._min_value?out_value=this._min_value-this.value:this.value>this._max_value&&(out_value=this._max_value-this.value),this.__isout=Math.abs(out_value)>=this.options.minValidDist,this.__isout&&(this.__speed*out_value<=0?this.__speed+=out_value*this.options.outFriction:this.__speed=out_value*this.options.outAcceleration)}},p._startDecelaration=function(){if(!this._deceleration){this._deceleration=!0;var self=this,tick=function(){self._deceleration&&(self._computeDeceleration(),Math.abs(self.__speed)>self.options.minValidDist||self.__isout?window.requestAnimationFrame(tick):(self._deceleration=!1,self.__isout=!1,self.value=self.__needsSnap&&self.options.snapping&&!self.options.paging?self._checkLimits(self.end_loc+self.__extraMove):Math.round(self.value),self._callrenderer(),self._callonComplete("decel")))};tick()}},window.Controller=Controller}(),function(window,document,$){window.MSLayerController=function(slide){this.slide=slide,this.slider=slide.slider,this.layers=[],this.layersCount=0,this.preloadCount=0,this.$layers=$("<div></div>").addClass("ms-slide-layers"),this.$staticLayers=$("<div></div>").addClass("ms-static-layers"),this.$fixedLayers=$("<div></div>").addClass("ms-fixed-layers"),this.$animLayers=$("<div></div>").addClass("ms-anim-layers")};var p=MSLayerController.prototype;p.addLayer=function(layer){switch(layer.slide=this.slide,layer.controller=this,layer.$element.data("position")){case"static":this.hasStaticLayer=!0,layer.$element.appendTo(this.$staticLayers);break;case"fixed":this.hasFixedLayer=!0,layer.$element.appendTo(this.$fixedLayers);break;default:layer.$element.appendTo(this.$animLayers)}layer.create(),this.layers.push(layer),this.layersCount++,layer.parallax&&(this.hasParallaxLayer=!0),layer.needPreload&&this.preloadCount++},p.create=function(){this.slide.$element.append(this.$layers),this.$layers.append(this.$animLayers),this.hasStaticLayer&&this.$layers.append(this.$staticLayers),"center"==this.slider.options.layersMode&&(this.$layers.css("max-width",this.slider.options.width+"px"),this.hasFixedLayer&&this.$fixedLayers.css("max-width",this.slider.options.width+"px"))},p.loadLayers=function(callback){if(this._onReadyCallback=callback,0===this.preloadCount)return void this._onlayersReady();for(var i=0;i!==this.layersCount;++i)this.layers[i].needPreload&&this.layers[i].loadImage()},p.prepareToShow=function(){this.hasParallaxLayer&&this._enableParallaxEffect(),this.hasFixedLayer&&this.$fixedLayers.prependTo(this.slide.view.$element)},p.showLayers=function(){this.layersHideTween&&this.layersHideTween.stop(!0),this.fixedLayersHideTween&&this.fixedLayersHideTween.stop(!0),this._resetLayers(),this.$animLayers.css("opacity","").css("display",""),this.hasFixedLayer&&this.$fixedLayers.css("opacity","").css("display",""),this.ready&&(this._initLayers(),this._locateLayers(),this._startLayers())},p.hideLayers=function(){if(this.slide.selected||this.slider.options.instantStartLayers){var that=this;that.layersHideTween=CTween.animate(this.$animLayers,500,{opacity:0},{complete:function(){that._resetLayers()}}),this.hasFixedLayer&&(this.fixedLayersHideTween=CTween.animate(this.$fixedLayers,500,{opacity:0},{complete:function(){that.$fixedLayers.detach()}})),this.hasParallaxLayer&&this._disableParallaxEffect()}},p.animHideLayers=function(){if(this.ready)for(var i=0;i!==this.layersCount;++i)this.layers[i].hide()},p.setSize=function(width,height,hard){if(this.ready&&(this.slide.selected||this.hasStaticLayer)&&(hard&&this._initLayers(!0),this._locateLayers(!this.slide.selected)),this.slider.options.autoHeight&&this.updateHeight(),"center"==this.slider.options.layersMode){var left=Math.max(0,(width-this.slider.options.width)/2)+"px";this.$layers[0].style.left=left,this.$fixedLayers[0].style.left=left}},p.updateHeight=function(){var h=this.slide.getHeight()+"px";this.$layers[0].style.height=h,this.$fixedLayers[0].style.height=h},p._onlayersReady=function(){this.ready=!0,this.hasStaticLayer&&!this.slide.isSleeping&&this._initLayers(!1,!0),this._onReadyCallback.call(this.slide)},p.onSlideSleep=function(){},p.onSlideWakeup=function(){this.hasStaticLayer&&this.ready&&this._initLayers(!1,!0)},p.destroy=function(){this.slide.selected&&this.hasParallaxLayer&&this._disableParallaxEffect();for(var i=0;i<this.layersCount;++i)this.layers[i].$element.stop(!0).remove();this.$layers.remove(),this.$staticLayers.remove(),this.$fixedLayers.remove(),this.$animLayers.remove()},p._startLayers=function(){for(var i=0;i!==this.layersCount;++i)this.layers[i].start()},p._initLayers=function(force,onlyStatics){if(!(this.init&&!force||this.slider.init_safemode)){this.init=onlyStatics!==!0;var i=0;if(onlyStatics&&!this.staticsInit)for(this.staticsInit=!0;i!==this.layersCount;++i)this.layers[i].staticLayer&&this.layers[i].init();else if(this.staticsInit&&!force)for(;i!==this.layersCount;++i)this.layers[i].staticLayer||this.layers[i].init();else for(;i!==this.layersCount;++i)this.layers[i].init()}},p._locateLayers=function(onlyStatics){var i=0;if(onlyStatics)for(;i!==this.layersCount;++i)this.layers[i].staticLayer&&this.layers[i].locate();else for(;i!==this.layersCount;++i)this.layers[i].locate()},p._resetLayers=function(){this.$animLayers.css("display","none").css("opacity",1);for(var i=0;i!==this.layersCount;++i)this.layers[i].reset()},p._applyParallax=function(x,y,fast){for(var i=0;i!==this.layersCount;++i)null!=this.layers[i].parallax&&this.layers[i].moveParallax(x,y,fast)},p._enableParallaxEffect=function(){"swipe"===this.slider.options.parallaxMode?this.slide.view.addEventListener(MSViewEvents.SCROLL,this._swipeParallaxMove,this):this.slide.$element.on("mousemove",{that:this},this._mouseParallaxMove).on("mouseleave",{that:this},this._resetParalax)},p._disableParallaxEffect=function(){"swipe"===this.slider.options.parallaxMode?this.slide.view.removeEventListener(MSViewEvents.SCROLL,this._swipeParallaxMove,this):this.slide.$element.off("mousemove",this._mouseParallaxMove).off("mouseleave",this._resetParalax)},p._resetParalax=function(e){var that=e.data.that;that._applyParallax(0,0)},p._mouseParallaxMove=function(e){var that=e.data.that,os=that.slide.$element.offset(),slider=that.slider;if("mouse:y-only"!==slider.options.parallaxMode)var x=e.pageX-os.left-that.slide.__width/2;else var x=0;if("mouse:x-only"!==slider.options.parallaxMode)var y=e.pageY-os.top-that.slide.__height/2;else var y=0;that._applyParallax(-x,-y)},p._swipeParallaxMove=function(){var value=this.slide.position-this.slide.view.__contPos;"v"===this.slider.options.dir?this._applyParallax(0,value,!0):this._applyParallax(value,0,!0)}}(window,document,jQuery),function($){window.MSLayerEffects={};var installed,_fade={opacity:0};MSLayerEffects.setup=function(){if(!installed){installed=!0;var st=MSLayerEffects,transform_css=window._jcsspfx+"Transform",transform_orig_css=window._jcsspfx+"TransformOrigin",o=$.browser.opera;_2d=window._css2d&&window._cssanim&&!o,st.defaultValues={left:0,top:0,opacity:isMSIE("<=9")?1:"",right:0,bottom:0},st.defaultValues[transform_css]="",st.rf=1,st.presetEffParams={random:"30|300","long":300,"short":30,"false":!1,"true":!0,tl:"top left",bl:"bottom left",tr:"top right",br:"bottom right",rt:"top right",lb:"bottom left",lt:"top left",rb:"bottom right",t:"top",b:"bottom",r:"right",l:"left",c:"center"},st.fade=function(){return _fade},st.left=_2d?function(dist,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]="translateX("+-dist*st.rf+"px)",r}:function(dist,fade){var r=fade===!1?{}:{opacity:0};return r.left=-dist*st.rf+"px",r},st.right=_2d?function(dist,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]="translateX("+dist*st.rf+"px)",r}:function(dist,fade){var r=fade===!1?{}:{opacity:0};return r.left=dist*st.rf+"px",r
},st.top=_2d?function(dist,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]="translateY("+-dist*st.rf+"px)",r}:function(dist,fade){var r=fade===!1?{}:{opacity:0};return r.top=-dist*st.rf+"px",r},st.bottom=_2d?function(dist,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]="translateY("+dist*st.rf+"px)",r}:function(dist,fade){var r=fade===!1?{}:{opacity:0};return r.top=dist*st.rf+"px",r},st.from=_2d?function(leftdis,topdis,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]="translateX("+leftdis*st.rf+"px) translateY("+topdis*st.rf+"px)",r}:function(leftdis,topdis,fade){var r=fade===!1?{}:{opacity:0};return r.top=topdis*st.rf+"px",r.left=leftdis*st.rf+"px",r},st.rotate=_2d?function(deg,orig){var r={opacity:0};return r[transform_css]=" rotate("+deg+"deg)",orig&&(r[transform_orig_css]=orig),r}:function(){return _fade},st.rotateleft=_2d?function(deg,dist,orig,fade){var r=st.left(dist,fade);return r[transform_css]+=" rotate("+deg+"deg)",orig&&(r[transform_orig_css]=orig),r}:function(deg,dist,orig,fade){return st.left(dist,fade)},st.rotateright=_2d?function(deg,dist,orig,fade){var r=st.right(dist,fade);return r[transform_css]+=" rotate("+deg+"deg)",orig&&(r[transform_orig_css]=orig),r}:function(deg,dist,orig,fade){return st.right(dist,fade)},st.rotatetop=_2d?function(deg,dist,orig,fade){var r=st.top(dist,fade);return r[transform_css]+=" rotate("+deg+"deg)",orig&&(r[transform_orig_css]=orig),r}:function(deg,dist,orig,fade){return st.top(dist,fade)},st.rotatebottom=_2d?function(deg,dist,orig,fade){var r=st.bottom(dist,fade);return r[transform_css]+=" rotate("+deg+"deg)",orig&&(r[transform_orig_css]=orig),r}:function(deg,dist,orig,fade){return st.bottom(dist,fade)},st.rotatefrom=_2d?function(deg,leftdis,topdis,orig,fade){var r=st.from(leftdis,topdis,fade);return r[transform_css]+=" rotate("+deg+"deg)",orig&&(r[transform_orig_css]=orig),r}:function(deg,leftdis,topdis,orig,fade){return st.from(leftdis,topdis,fade)},st.skewleft=_2d?function(deg,dist,fade){var r=st.left(dist,fade);return r[transform_css]+=" skewX("+deg+"deg)",r}:function(deg,dist,fade){return st.left(dist,fade)},st.skewright=_2d?function(deg,dist,fade){var r=st.right(dist,fade);return r[transform_css]+=" skewX("+-deg+"deg)",r}:function(deg,dist,fade){return st.right(dist,fade)},st.skewtop=_2d?function(deg,dist,fade){var r=st.top(dist,fade);return r[transform_css]+=" skewY("+deg+"deg)",r}:function(deg,dist,fade){return st.top(dist,fade)},st.skewbottom=_2d?function(deg,dist,fade){var r=st.bottom(dist,fade);return r[transform_css]+=" skewY("+-deg+"deg)",r}:function(deg,dist,fade){return st.bottom(dist,fade)},st.scale=_2d?function(x,y,orig,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]=" scaleX("+x+") scaleY("+y+")",orig&&(r[transform_orig_css]=orig),r}:function(x,y,orig,fade){return fade===!1?{}:{opacity:0}},st.scaleleft=_2d?function(x,y,dist,orig,fade){var r=st.left(dist,fade);return r[transform_css]=" scaleX("+x+") scaleY("+y+")",orig&&(r[transform_orig_css]=orig),r}:function(x,y,dist,orig,fade){return st.left(dist,fade)},st.scaleright=_2d?function(x,y,dist,orig,fade){var r=st.right(dist,fade);return r[transform_css]=" scaleX("+x+") scaleY("+y+")",orig&&(r[transform_orig_css]=orig),r}:function(x,y,dist,orig,fade){return st.right(dist,fade)},st.scaletop=_2d?function(x,y,dist,orig,fade){var r=st.top(dist,fade);return r[transform_css]=" scaleX("+x+") scaleY("+y+")",orig&&(r[transform_orig_css]=orig),r}:function(x,y,dist,orig,fade){return st.top(dist,fade)},st.scalebottom=_2d?function(x,y,dist,orig,fade){var r=st.bottom(dist,fade);return r[transform_css]=" scaleX("+x+") scaleY("+y+")",orig&&(r[transform_orig_css]=orig),r}:function(x,y,dist,orig,fade){return st.bottom(dist,fade)},st.scalefrom=_2d?function(x,y,leftdis,topdis,orig,fade){var r=st.from(leftdis,topdis,fade);return r[transform_css]+=" scaleX("+x+") scaleY("+y+")",orig&&(r[transform_orig_css]=orig),r}:function(x,y,leftdis,topdis,orig,fade){return st.from(leftdis,topdis,fade)},st.rotatescale=_2d?function(deg,x,y,orig,fade){var r=st.scale(x,y,orig,fade);return r[transform_css]+=" rotate("+deg+"deg)",orig&&(r[transform_orig_css]=orig),r}:function(deg,x,y,orig,fade){return st.scale(x,y,orig,fade)},st.front=window._css3d?function(dist,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]="perspective(2000px) translate3d(0 , 0 ,"+dist+"px ) rotate(0.001deg)",r}:function(){return _fade},st.back=window._css3d?function(dist,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]="perspective(2000px) translate3d(0 , 0 ,"+-dist+"px ) rotate(0.001deg)",r}:function(){return _fade},st.rotatefront=window._css3d?function(deg,dist,orig,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]="perspective(2000px) translate3d(0 , 0 ,"+dist+"px ) rotate("+(deg||.001)+"deg)",orig&&(r[transform_orig_css]=orig),r}:function(){return _fade},st.rotateback=window._css3d?function(deg,dist,orig,fade){var r=fade===!1?{}:{opacity:0};return r[transform_css]="perspective(2000px) translate3d(0 , 0 ,"+-dist+"px ) rotate("+(deg||.001)+"deg)",orig&&(r[transform_orig_css]=orig),r}:function(){return _fade},st.rotate3dleft=window._css3d?function(x,y,z,dist,orig,fade){var r=st.left(dist,fade);return r[transform_css]+=(x?" rotateX("+x+"deg)":" ")+(y?" rotateY("+y+"deg)":"")+(z?" rotateZ("+z+"deg)":""),orig&&(r[transform_orig_css]=orig),r}:function(x,y,z,dist,orig,fade){return st.left(dist,fade)},st.rotate3dright=window._css3d?function(x,y,z,dist,orig,fade){var r=st.right(dist,fade);return r[transform_css]+=(x?" rotateX("+x+"deg)":" ")+(y?" rotateY("+y+"deg)":"")+(z?" rotateZ("+z+"deg)":""),orig&&(r[transform_orig_css]=orig),r}:function(x,y,z,dist,orig,fade){return st.right(dist,fade)},st.rotate3dtop=window._css3d?function(x,y,z,dist,orig,fade){var r=st.top(dist,fade);return r[transform_css]+=(x?" rotateX("+x+"deg)":" ")+(y?" rotateY("+y+"deg)":"")+(z?" rotateZ("+z+"deg)":""),orig&&(r[transform_orig_css]=orig),r}:function(x,y,z,dist,orig,fade){return st.top(dist,fade)},st.rotate3dbottom=window._css3d?function(x,y,z,dist,orig,fade){var r=st.bottom(dist,fade);return r[transform_css]+=(x?" rotateX("+x+"deg)":" ")+(y?" rotateY("+y+"deg)":"")+(z?" rotateZ("+z+"deg)":""),orig&&(r[transform_orig_css]=orig),r}:function(x,y,z,dist,orig,fade){return st.bottom(dist,fade)},st.rotate3dfront=window._css3d?function(x,y,z,dist,orig,fade){var r=st.front(dist,fade);return r[transform_css]+=(x?" rotateX("+x+"deg)":" ")+(y?" rotateY("+y+"deg)":"")+(z?" rotateZ("+z+"deg)":""),orig&&(r[transform_orig_css]=orig),r}:function(x,y,z,dist,orig,fade){return st.front(dist,fade)},st.rotate3dback=window._css3d?function(x,y,z,dist,orig,fade){var r=st.back(dist,fade);return r[transform_css]+=(x?" rotateX("+x+"deg)":" ")+(y?" rotateY("+y+"deg)":"")+(z?" rotateZ("+z+"deg)":""),orig&&(r[transform_orig_css]=orig),r}:function(x,y,z,dist,orig,fade){return st.back(dist,fade)},st.t=window._css3d?function(fade,tx,ty,tz,r,rx,ry,rz,scx,scy,skx,sky,ox,oy,oz){var _r=fade===!1?{}:{opacity:0},transform="perspective(2000px) ";"n"!==tx&&(transform+="translateX("+tx*st.rf+"px) "),"n"!==ty&&(transform+="translateY("+ty*st.rf+"px) "),"n"!==tz&&(transform+="translateZ("+tz*st.rf+"px) "),"n"!==r&&(transform+="rotate("+r+"deg) "),"n"!==rx&&(transform+="rotateX("+rx+"deg) "),"n"!==ry&&(transform+="rotateY("+ry+"deg) "),"n"!==rz&&(transform+="rotateZ("+rz+"deg) "),"n"!==skx&&(transform+="skewX("+skx+"deg) "),"n"!==sky&&(transform+="skewY("+sky+"deg) "),"n"!==scx&&(transform+="scaleX("+scx+") "),"n"!==scy&&(transform+="scaleY("+scy+")"),_r[transform_css]=transform;var trans_origin="";return trans_origin+="n"!==ox?ox+"% ":"50% ",trans_origin+="n"!==oy?oy+"% ":"50% ",trans_origin+="n"!==oz?oz+"px":"",_r[transform_orig_css]=trans_origin,_r}:function(fade,tx,ty,tz,r){var r=fade===!1?{}:{opacity:0};return"n"!==tx&&(r.left=tx*st.rf+"px"),"n"!==ty&&(r.top=ty*st.rf+"px"),r}}}}(jQuery),function($){window.MSLayerElement=function(){this.start_anim={name:"fade",duration:1e3,ease:"linear",delay:0},this.end_anim={duration:1e3,ease:"linear"},this.type="text",this.resizable=!0,this.minWidth=-1,this.isVisible=!0,this.__cssConfig=["margin-top","padding-top","margin-bottom","padding-left","margin-right","padding-right","margin-left","padding-bottom","font-size","line-height","width","left","right","top","bottom"],this.baseStyle={}};var p=MSLayerElement.prototype;p.setStartAnim=function(anim){$.extend(this.start_anim,anim),$.extend(this.start_anim,this._parseEff(this.start_anim.name)),this.$element.css("visibility","hidden")},p.setEndAnim=function(anim){$.extend(this.end_anim,anim)},p.create=function(){if(this.$element.css("display","none"),this.resizable=this.$element.data("resize")!==!1,this.fixed=this.$element.data("fixed")===!0,void 0!==this.$element.data("widthlimit")&&(this.minWidth=this.$element.data("widthlimit")),this.end_anim.name||(this.end_anim.name=this.start_anim.name),this.end_anim.time&&(this.autoHide=!0),this.staticLayer="static"===this.$element.data("position"),this.fixedLayer="fixed"===this.$element.data("position"),this.layersCont=this.controller.$layers,this.staticLayer&&this.$element.css("display","").css("visibility",""),void 0!==this.$element.data("action")){var slideController=this.slide.slider.slideController;this.$element.on("click",function(event){slideController.runAction($(this).data("action")),event.preventDefault()}).addClass("ms-action-layer")}$.extend(this.end_anim,this._parseEff(this.end_anim.name)),this.slider=this.slide.slider;var layerOrigin=this.layerOrigin=this.$element.data("origin");if(layerOrigin){var vOrigin=layerOrigin.charAt(0),hOrigin=layerOrigin.charAt(1),offsetX=this.$element.data("offset-x"),offsetY=this.$element.data("offset-y");switch(void 0===offsetY&&(offsetY=0),vOrigin){case"t":this.$element[0].style.top=offsetY+"px";break;case"b":this.$element[0].style.bottom=offsetY+"px";break;case"m":this.$element[0].style.top=offsetY+"px",this.middleAlign=!0}switch(void 0===offsetX&&(offsetX=0),hOrigin){case"l":this.$element[0].style.left=offsetX+"px";break;case"r":this.$element[0].style.right=offsetX+"px";break;case"c":this.$element[0].style.left=offsetX+"px",this.centerAlign=!0}}this.parallax=this.$element.data("parallax"),null!=this.parallax&&(this.parallax/=100,this.$parallaxElement=$("<div></div>").addClass("ms-parallax-layer"),this.link?(this.link.wrap(this.$parallaxElement),this.$parallaxElement=this.link.parent()):(this.$element.wrap(this.$parallaxElement),this.$parallaxElement=this.$element.parent()),this._lastParaX=0,this._lastParaY=0,this._paraX=0,this._paraY=0,this.alignedToBot=this.layerOrigin&&-1!==this.layerOrigin.indexOf("b"),this.alignedToBot&&this.$parallaxElement.css("bottom",0),this.parallaxRender=window._css3d?this._parallaxCSS3DRenderer:window._css2d?this._parallaxCSS2DRenderer:this._parallax2DRenderer,"swipe"!==this.slider.options.parallaxMode&&averta.Ticker.add(this.parallaxRender,this)),$.removeDataAttrs(this.$element,["data-src"])},p.init=function(){this.initialized=!0;var value;this.$element.css("visibility","");for(var i=0,l=this.__cssConfig.length;l>i;i++){var key=this.__cssConfig[i];"text"===this.type&&"width"===key?value=this.$element[0].style.width:(value=this.$element.css(key),"width"!==key&&"height"!==key||"0px"!==value||(value=this.$element.data(key)+"px")),"auto"!=value&&""!=value&&"normal"!=value&&(this.baseStyle[key]=parseInt(value))}this.middleAlign&&(this.baseHeight=this.$element.outerHeight(!1)),this.centerAlign&&(this.baseWidth=this.$element.outerWidth(!1))},p.locate=function(){if(this.slide.ready){var factor,isPosition,width=parseFloat(this.layersCont.css("width")),height=parseFloat(this.layersCont.css("height"));!this.staticLayer&&"none"===this.$element.css("display")&&this.isVisible&&this.$element.css("display","").css("visibility","hidden"),factor=this.resizeFactor=width/this.slide.slider.options.width;for(var key in this.baseStyle)isPosition="top"===key||"left"===key||"bottom"===key||"right"===key,factor=this.fixed&&isPosition?1:this.resizeFactor,(this.resizable||isPosition)&&("top"===key&&this.middleAlign?(this.$element[0].style.top="0px",this.baseHeight=this.$element.outerHeight(!1),this.$element[0].style.top=this.baseStyle.top*factor+(height-this.baseHeight)/2+"px"):"left"===key&&this.centerAlign?(this.$element[0].style.left="0px",this.baseWidth=this.$element.outerWidth(!1),this.$element[0].style.left=this.baseStyle.left*factor+(width-this.baseWidth)/2+"px"):this.$element.css(key,this.baseStyle[key]*factor+"px"));this.visible(this.minWidth<width)}},p.start=function(){if(!this.isShowing&&!this.staticLayer){this.isShowing=!0;var key,base;MSLayerEffects.rf=this.resizeFactor;var effect_css=MSLayerEffects[this.start_anim.eff_name].apply(null,this._parseEffParams(this.start_anim.eff_params)),start_css_eff={};for(key in effect_css)this._checkPosKey(key,effect_css)||(null!=MSLayerEffects.defaultValues[key]&&(start_css_eff[key]=MSLayerEffects.defaultValues[key]),key in this.baseStyle&&(base=this.baseStyle[key],this.middleAlign&&"top"===key&&(base+=(parseInt(this.layersCont.height())-this.$element.outerHeight(!1))/2),this.centerAlign&&"left"===key&&(base+=(parseInt(this.layersCont.width())-this.$element.outerWidth(!1))/2),effect_css[key]=base+parseFloat(effect_css[key])+"px",start_css_eff[key]=base+"px"),this.$element.css(key,effect_css[key]));var that=this;clearTimeout(this.to),this.to=setTimeout(function(){that.$element.css("visibility",""),that._playAnimation(that.start_anim,start_css_eff)},that.start_anim.delay||.01),this.clTo=setTimeout(function(){that.show_cl=!0},(this.start_anim.delay||.01)+this.start_anim.duration),this.autoHide&&(clearTimeout(this.hto),this.hto=setTimeout(function(){that.hide()},that.end_anim.time))}},p.hide=function(){if(!this.staticLayer){this.isShowing=!1;var effect_css=MSLayerEffects[this.end_anim.eff_name].apply(null,this._parseEffParams(this.end_anim.eff_params));for(key in effect_css)this._checkPosKey(key,effect_css)||(key===window._jcsspfx+"TransformOrigin"&&this.$element.css(key,effect_css[key]),key in this.baseStyle&&(effect_css[key]=this.baseStyle[key]+parseFloat(effect_css[key])+"px"));this._playAnimation(this.end_anim,effect_css),clearTimeout(this.to),clearTimeout(this.hto),clearTimeout(this.clTo)}},p.reset=function(){this.staticLayer||(this.isShowing=!1,this.$element[0].style.display="none",this.$element.css("opacity",""),this.$element[0].style.transitionDuration="",this.show_tween&&this.show_tween.stop(!0),clearTimeout(this.to),clearTimeout(this.hto))},p.destroy=function(){this.reset(),this.$element.remove()},p.visible=function(value){this.isVisible!=value&&(this.isVisible=value,this.$element.css("display",value?"":"none"))},p.moveParallax=function(x,y,fast){this._paraX=x,this._paraY=y,fast&&(this._lastParaX=x,this._lastParaY=y,this.parallaxRender())},p._playAnimation=function(animation,css){var options={};animation.ease&&(options.ease=animation.ease),options.transProperty=window._csspfx+"transform,opacity",this.show_tween=CTween.animate(this.$element,animation.duration,css,options)},p._randomParam=function(value){var min=Number(value.slice(0,value.indexOf("|"))),max=Number(value.slice(value.indexOf("|")+1));return min+Math.random()*(max-min)},p._parseEff=function(eff_name){var eff_params=[];if(-1!==eff_name.indexOf("(")){var value,temp=eff_name.slice(0,eff_name.indexOf("(")).toLowerCase();eff_params=eff_name.slice(eff_name.indexOf("(")+1,-1).replace(/\"|\'|\s/g,"").split(","),eff_name=temp;for(var i=0,l=eff_params.length;l>i;++i)value=eff_params[i],value in MSLayerEffects.presetEffParams&&(value=MSLayerEffects.presetEffParams[value]),eff_params[i]=value}return{eff_name:eff_name,eff_params:eff_params}},p._parseEffParams=function(params){for(var eff_params=[],i=0,l=params.length;l>i;++i){var value=params[i];"string"==typeof value&&-1!==value.indexOf("|")&&(value=this._randomParam(value)),eff_params[i]=value}return eff_params},p._checkPosKey=function(key,style){return"left"===key&&!(key in this.baseStyle)&&"right"in this.baseStyle?(style.right=-parseInt(style.left)+"px",delete style.left,!0):"top"===key&&!(key in this.baseStyle)&&"bottom"in this.baseStyle?(style.bottom=-parseInt(style.top)+"px",delete style.top,!0):!1},p._parallaxCalc=function(){var x_def=this._paraX-this._lastParaX,y_def=this._paraY-this._lastParaY;this._lastParaX+=x_def/12,this._lastParaY+=y_def/12,Math.abs(x_def)<.019&&(this._lastParaX=this._paraX),Math.abs(y_def)<.019&&(this._lastParaY=this._paraY)},p._parallaxCSS3DRenderer=function(){this._parallaxCalc(),this.$parallaxElement[0].style[window._jcsspfx+"Transform"]="translateX("+this._lastParaX*this.parallax+"px) translateY("+this._lastParaY*this.parallax+"px) translateZ(0)"},p._parallaxCSS2DRenderer=function(){this._parallaxCalc(),this.$parallaxElement[0].style[window._jcsspfx+"Transform"]="translateX("+this._lastParaX*this.parallax+"px) translateY("+this._lastParaY*this.parallax+"px)"},p._parallax2DRenderer=function(){this._parallaxCalc(),this.alignedToBot?this.$parallaxElement[0].style.bottom=this._lastParaY*this.parallax+"px":this.$parallaxElement[0].style.top=this._lastParaY*this.parallax+"px",this.$parallaxElement[0].style.left=this._lastParaX*this.parallax+"px"}}(jQuery),function($){window.MSImageLayerElement=function(){MSLayerElement.call(this),this.needPreload=!0,this.__cssConfig=["width","height","margin-top","padding-top","margin-bottom","padding-left","margin-right","padding-right","margin-left","padding-bottom","left","right","top","bottom"],this.type="image"},MSImageLayerElement.extend(MSLayerElement);var p=MSImageLayerElement.prototype,_super=MSLayerElement.prototype;p.create=function(){if(this.link){var p=this.$element.parent();p.append(this.link),this.link.append(this.$element),this.link.removeClass("ms-layer"),this.$element.addClass("ms-layer"),p=null}if(_super.create.call(this),void 0!=this.$element.data("src"))this.img_src=this.$element.data("src"),this.$element.removeAttr("data-src");else{var that=this;this.$element.on("load",function(){that.controller.preloadCount--,0===that.controller.preloadCount&&that.controller._onlayersReady()}).each($.jqLoadFix)}$.browser.msie&&this.$element.on("dragstart",function(event){event.preventDefault()})},p.loadImage=function(){var that=this;this.$element.preloadImg(this.img_src,function(){that.controller.preloadCount--,0===that.controller.preloadCount&&that.controller._onlayersReady()})}}(jQuery),function($){window.MSVideoLayerElement=function(){MSLayerElement.call(this),this.__cssConfig.push("height"),this.type="video"},MSVideoLayerElement.extend(MSLayerElement);var p=MSVideoLayerElement.prototype,_super=MSLayerElement.prototype;p.__playVideo=function(){this.img&&CTween.fadeOut(this.img,500,2),CTween.fadeOut(this.video_btn,500,2),this.video_frame.attr("src","about:blank").css("display","block"),-1==this.video_url.indexOf("?")&&(this.video_url+="?"),this.video_frame.attr("src",this.video_url+"&autoplay=1")},p.start=function(){_super.start.call(this),this.$element.data("autoplay")&&this.__playVideo()},p.reset=function(){return _super.reset.call(this),(this.needPreload||this.$element.data("btn"))&&(this.video_btn.css("opacity",1).css("display","block"),this.video_frame.attr("src","about:blank").css("display","none")),this.needPreload?void this.img.css("opacity",1).css("display","block"):void this.video_frame.attr("src",this.video_url)},p.create=function(){_super.create.call(this),this.video_frame=this.$element.find("iframe").css({width:"100%",height:"100%"}),this.video_url=this.video_frame.attr("src");var has_img=0!=this.$element.has("img").length;if(has_img||this.$element.data("btn")){this.video_frame.attr("src","about:blank").css("display","none");var that=this;if(this.video_btn=$("<div></div>").appendTo(this.$element).addClass("ms-video-btn").click(function(){that.__playVideo()}),has_img){if(this.needPreload=!0,this.img=this.$element.find("img:first").addClass("ms-video-img"),void 0!==this.img.data("src"))this.img_src=this.img.data("src"),this.img.removeAttr("data-src");else{var that=this;this.img.attr("src",this.img_src).on("load",function(){that.controller.preloadCount--,0===that.controller.preloadCount&&that.controller._onlayersReady()}).each($.jqLoadFix)}$.browser.msie&&this.img.on("dragstart",function(event){event.preventDefault()})}}},p.loadImage=function(){var that=this;this.img.preloadImg(this.img_src,function(){that.controller.preloadCount--,0===that.controller.preloadCount&&that.controller._onlayersReady()})}}(jQuery),function($){"use strict";window.MSHotspotLayer=function(){MSLayerElement.call(this),this.__cssConfig=["margin-top","padding-top","margin-bottom","padding-left","margin-right","padding-right","margin-left","padding-bottom","left","right","top","bottom"],this.ease="Expo",this.hide_start=!0,this.type="hotspot"},MSHotspotLayer.extend(MSLayerElement);var p=MSHotspotLayer.prototype,_super=MSLayerElement.prototype;p._showTT=function(){this.show_cl&&(clearTimeout(this.hto),this._tween&&this._tween.stop(!0),this.hide_start&&(this.align=this._orgAlign,this._locateTT(),this.tt.css({display:"block"}),this._tween=CTween.animate(this.tt,900,this.to,{ease:"easeOut"+this.ease}),this.hide_start=!1))},p._hideTT=function(){if(this.show_cl){this._tween&&this._tween.stop(!0);var that=this;clearTimeout(this.hto),this.hto=setTimeout(function(){that.hide_start=!0,that._tween=CTween.animate(that.tt,900,that.from,{ease:"easeOut"+that.ease,complete:function(){that.tt.css("display","none")}})},200)}},p._updateClassName=function(name){this._lastClass&&this.tt.removeClass(this._lastClass),this.tt.addClass(name),this._lastClass=name},p._alignPolicy=function(){{var w=(this.tt.outerHeight(!1),Math.max(this.tt.outerWidth(!1),parseInt(this.tt.css("max-width")))),ww=window.innerWidth;window.innerHeight}switch(this.align){case"top":if(this.base_t<0)return"bottom";break;case"right":if(this.base_l+w>ww||this.base_t<0)return"bottom";break;case"left":if(this.base_l<0||this.base_t<0)return"bottom"}return null},p._locateTT=function(){var os=this.$element.offset(),os2=this.slide.slider.$element.offset(),dist=50,space=15;this.pos_x=os.left-os2.left-this.slide.slider.$element.scrollLeft(),this.pos_y=os.top-os2.top-this.slide.slider.$element.scrollTop(),this.from={opacity:0},this.to={opacity:1},this._updateClassName("ms-tooltip-"+this.align),this.tt_arrow.css("margin-left","");var arrow_w=15,arrow_h=15;switch(this.align){case"top":var w=Math.min(this.tt.outerWidth(!1),parseInt(this.tt.css("max-width")));this.base_t=this.pos_y-this.tt.outerHeight(!1)-arrow_h-space,this.base_l=this.pos_x-w/2,this.base_l+w>window.innerWidth&&(this.tt_arrow.css("margin-left",-arrow_w/2+this.base_l+w-window.innerWidth+"px"),this.base_l=window.innerWidth-w),this.base_l<0&&(this.base_l=0,this.tt_arrow.css("margin-left",-arrow_w/2+this.pos_x-this.tt.outerWidth(!1)/2+"px")),window._css3d?(this.from[window._jcsspfx+"Transform"]="translateY(-"+dist+"px)",this.to[window._jcsspfx+"Transform"]=""):(this.from.top=this.base_t-dist+"px",this.to.top=this.base_t+"px");break;case"bottom":var w=Math.min(this.tt.outerWidth(!1),parseInt(this.tt.css("max-width")));this.base_t=this.pos_y+arrow_h+space,this.base_l=this.pos_x-w/2,this.base_l+w>window.innerWidth&&(this.tt_arrow.css("margin-left",-arrow_w/2+this.base_l+w-window.innerWidth+"px"),this.base_l=window.innerWidth-w),this.base_l<0&&(this.base_l=0,this.tt_arrow.css("margin-left",-arrow_w/2+this.pos_x-this.tt.outerWidth(!1)/2+"px")),window._css3d?(this.from[window._jcsspfx+"Transform"]="translateY("+dist+"px)",this.to[window._jcsspfx+"Transform"]=""):(this.from.top=this.base_t+dist+"px",this.to.top=this.base_t+"px");break;case"right":this.base_l=this.pos_x+arrow_w+space,this.base_t=this.pos_y-this.tt.outerHeight(!1)/2,window._css3d?(this.from[window._jcsspfx+"Transform"]="translateX("+dist+"px)",this.to[window._jcsspfx+"Transform"]=""):(this.from.left=this.base_l+dist+"px",this.to.left=this.base_l+"px");break;case"left":this.base_l=this.pos_x-arrow_w-this.tt.outerWidth(!1)-space,this.base_t=this.pos_y-this.tt.outerHeight(!1)/2,window._css3d?(this.from[window._jcsspfx+"Transform"]="translateX(-"+dist+"px)",this.to[window._jcsspfx+"Transform"]=""):(this.from.left=this.base_l-dist+"px",this.to.left=this.base_l+"px")}var policyAlign=this._alignPolicy();return null!==policyAlign?(this.align=policyAlign,void this._locateTT()):(this.tt.css("top",parseInt(this.base_t)+"px").css("left",parseInt(this.base_l)+"px"),void this.tt.css(this.from))},p.start=function(){_super.start.call(this),this.tt.appendTo(this.slide.slider.$element),this.tt.css("display","none")},p.reset=function(){_super.reset.call(this),this.tt.detach()},p.create=function(){var that=this;this._orgAlign=this.align=void 0!==this.$element.data("align")?this.$element.data("align"):"top",this.data=this.$element.html(),this.$element.html("").on("mouseenter",function(){that._showTT()}).on("mouseleave",function(){that._hideTT()}),this.point=$('<div><div class="ms-point-center"></div><div class="ms-point-border"></div></div>').addClass("ms-tooltip-point").appendTo(this.$element);var link=this.$element.data("link"),target=this.$element.data("target");link&&this.point.on("click",function(){window.open(link,target||"_self")}),this.tt=$("<div></div>").addClass("ms-tooltip").css("display","hidden").css("opacity",0),void 0!==this.$element.data("width")&&this.tt.css("width",this.$element.data("width")).css("max-width",this.$element.data("width")),this.tt_arrow=$("<div></div>").addClass("ms-tooltip-arrow").appendTo(this.tt),this._updateClassName("ms-tooltip-"+this.align),this.ttcont=$("<div></div>").addClass("ms-tooltip-cont").html(this.data).appendTo(this.tt),this.$element.data("stay-hover")===!0&&this.tt.on("mouseenter",function(){that.hide_start||(clearTimeout(that.hto),that._tween.stop(!0),that._showTT())}).on("mouseleave",function(){that._hideTT()}),_super.create.call(this)}}(jQuery),function(){window.MSButtonLayer=function(){MSLayerElement.call(this),this.type="button"},MSButtonLayer.extend(MSLayerElement);var p=MSButtonLayer.prototype,_super=MSLayerElement.prototype,positionKies=["top","left","bottom","right"];p.create=function(){_super.create.call(this),this.$element.wrap('<div class="ms-btn-container"></div>').css("position","relative"),this.$container=this.$element.parent()},p.locate=function(){_super.locate.call(this);for(var key,tempValue,i=0;4>i;i++)key=positionKies[i],key in this.baseStyle&&(tempValue=this.$element.css(key),this.$element.css(key,""),this.$container.css(key,tempValue));this.$container.width(this.$element.outerWidth(!0)).height(this.$element.outerHeight(!0))}}(jQuery),window.MSSliderEvent=function(type){this.type=type},MSSliderEvent.CHANGE_START="ms_changestart",MSSliderEvent.CHANGE_END="ms_changeend",MSSliderEvent.WAITING="ms_waiting",MSSliderEvent.AUTOPLAY_CHANGE="ms_autoplaychange",MSSliderEvent.VIDEO_PLAY="ms_videoPlay",MSSliderEvent.VIDEO_CLOSE="ms_videoclose",MSSliderEvent.INIT="ms_init",MSSliderEvent.HARD_UPDATE="ms_hard_update",MSSliderEvent.RESIZE="ms_resize",MSSliderEvent.RESERVED_SPACE_CHANGE="ms_rsc",MSSliderEvent.DESTROY="ms_destroy",function(window,document,$){"use strict";window.MSSlide=function(){this.$element=null,this.$loading=$("<div></div>").addClass("ms-slide-loading"),this.view=null,this.index=-1,this.__width=0,this.__height=0,this.fillMode="fill",this.selected=!1,this.pselected=!1,this.autoAppend=!0,this.isSleeping=!0,this.moz=$.browser.mozilla};var p=MSSlide.prototype;p.onSwipeStart=function(){this.link&&(this.linkdis=!0),this.video&&(this.videodis=!0)},p.onSwipeMove=function(e){var move=Math.max(Math.abs(e.data.distanceX),Math.abs(e.data.distanceY));this.swipeMoved=move>4},p.onSwipeCancel=function(){return this.swipeMoved?void(this.swipeMoved=!1):(this.link&&(this.linkdis=!1),void(this.video&&(this.videodis=!1)))},p.setupLayerController=function(){this.hasLayers=!0,this.layerController=new MSLayerController(this)},p.assetsLoaded=function(){this.ready=!0,this.slider.api._startTimer(),(this.selected||this.pselected&&this.slider.options.instantStartLayers)&&(this.hasLayers&&this.layerController.showLayers(),this.vinit&&(this.bgvideo.play(),this.autoPauseBgVid||(this.bgvideo.currentTime=0))),this.isSleeping||this.setupBG(),CTween.fadeOut(this.$loading,300,!0),(0===this.slider.options.preload||"all"===this.slider.options.preload)&&this.index<this.view.slideList.length-1?this.view.slideList[this.index+1].loadImages():"all"===this.slider.options.preload&&this.index===this.view.slideList.length-1&&this.slider._removeLoading()},p.setBG=function(img){this.hasBG=!0;var that=this;this.$imgcont=$("<div></div>").addClass("ms-slide-bgcont"),this.$element.append(this.$loading).append(this.$imgcont),this.$bg_img=$(img).css("visibility","hidden"),this.$imgcont.append(this.$bg_img),this.bgAligner=new MSAligner(that.fillMode,that.$imgcont,that.$bg_img),this.bgAligner.widthOnly=this.slider.options.autoHeight,that.slider.options.autoHeight&&(that.pselected||that.selected)&&that.slider.setHeight(that.slider.options.height),void 0!==this.$bg_img.data("src")?(this.bg_src=this.$bg_img.data("src"),this.$bg_img.removeAttr("data-src")):this.$bg_img.one("load",function(event){that._onBGLoad(event)}).each($.jqLoadFix)},p.setupBG=function(){!this.initBG&&this.bgLoaded&&(this.initBG=!0,this.$bg_img.css("visibility",""),this.bgWidth=this.bgNatrualWidth||this.$bg_img.width(),this.bgHeight=this.bgNatrualHeight||this.$bg_img.height(),CTween.fadeIn(this.$imgcont,300),this.slider.options.autoHeight&&this.$imgcont.height(this.bgHeight*this.ratio),this.bgAligner.init(this.bgWidth,this.bgHeight),this.setSize(this.__width,this.__height),this.slider.options.autoHeight&&(this.pselected||this.selected)&&this.slider.setHeight(this.getHeight()))},p.loadImages=function(){if(!this.ls){if(this.ls=!0,this.bgvideo&&this.bgvideo.load(),this.hasBG&&this.bg_src){var that=this;this.$bg_img.preloadImg(this.bg_src,function(event){that._onBGLoad(event)})}this.hasLayers&&this.layerController.loadLayers(this._onLayersLoad),this.hasBG||this.hasLayers||this.assetsLoaded()}},p._onLayersLoad=function(){this.layersLoaded=!0,(!this.hasBG||this.bgLoaded)&&this.assetsLoaded()},p._onBGLoad=function(event){this.bgNatrualWidth=event.width,this.bgNatrualHeight=event.height,this.bgLoaded=!0,$.browser.msie&&this.$bg_img.on("dragstart",function(event){event.preventDefault()}),(!this.hasLayers||this.layerController.ready)&&this.assetsLoaded()},p.setBGVideo=function($video){if($video[0].play){if(window._mobile)return void $video.remove();this.bgvideo=$video[0];var that=this;$video.addClass("ms-slide-bgvideo"),$video.data("loop")!==!1&&this.bgvideo.addEventListener("ended",function(){that.bgvideo.play()}),$video.data("mute")!==!1&&(this.bgvideo.muted=!0),$video.data("autopause")===!0&&(this.autoPauseBgVid=!0),this.bgvideo_fillmode=$video.data("fill-mode")||"fill","none"!==this.bgvideo_fillmode&&(this.bgVideoAligner=new MSAligner(this.bgvideo_fillmode,this.$element,$video),this.bgvideo.addEventListener("loadedmetadata",function(){that.vinit||(that.vinit=!0,that.video_aspect=that.bgVideoAligner.baseHeight/that.bgVideoAligner.baseWidth,that.bgVideoAligner.init(that.bgvideo.videoWidth,that.bgvideo.videoHeight),that._alignBGVideo(),CTween.fadeIn($(that.bgvideo),200),that.selected&&that.bgvideo.play())})),$video.css("opacity",0),this.$bgvideocont=$("<div></div>").addClass("ms-slide-bgvideocont").append($video),this.hasBG?this.$imgcont.before(this.$bgvideocont):this.$bgvideocont.appendTo(this.$element)}},p._alignBGVideo=function(){this.bgvideo_fillmode&&"none"!==this.bgvideo_fillmode&&this.bgVideoAligner.align()},p.setSize=function(width,height,hard){this.__width=width,this.slider.options.autoHeight&&(this.bgLoaded?(this.ratio=this.__width/this.bgWidth,height=Math.floor(this.ratio*this.bgHeight),this.$imgcont.height(height)):(this.ratio=width/this.slider.options.width,height=this.slider.options.height*this.ratio)),this.__height=height,this.$element.width(width).height(height),this.hasBG&&this.bgLoaded&&this.bgAligner.align(),this._alignBGVideo(),this.hasLayers&&this.layerController.setSize(width,height,hard)
},p.getHeight=function(){return this.hasBG&&this.bgLoaded?this.bgHeight*this.ratio:Math.max(this.$element[0].clientHeight,this.slider.options.height*this.ratio)},p.__playVideo=function(){this.vplayed||this.videodis||(this.vplayed=!0,this.slider.api.paused||(this.slider.api.pause(),this.roc=!0),this.vcbtn.css("display",""),CTween.fadeOut(this.vpbtn,500,!1),CTween.fadeIn(this.vcbtn,500),CTween.fadeIn(this.vframe,500),this.vframe.css("display","block").attr("src",this.video+"&autoplay=1"),this.view.$element.addClass("ms-def-cursor"),this.moz&&this.view.$element.css("perspective","none"),this.view.swipeControl&&this.view.swipeControl.disable(),this.slider.slideController.dispatchEvent(new MSSliderEvent(MSSliderEvent.VIDEO_PLAY)))},p.__closeVideo=function(){if(this.vplayed){this.vplayed=!1,this.roc&&this.slider.api.resume();var that=this;CTween.fadeIn(this.vpbtn,500),CTween.animate(this.vcbtn,500,{opacity:0},{complete:function(){that.vcbtn.css("display","none")}}),CTween.animate(this.vframe,500,{opacity:0},{complete:function(){that.vframe.attr("src","about:blank").css("display","none")}}),this.moz&&this.view.$element.css("perspective",""),this.view.swipeControl&&this.view.swipeControl.enable(),this.view.$element.removeClass("ms-def-cursor"),this.slider.slideController.dispatchEvent(new MSSliderEvent(MSSliderEvent.VIDEO_CLOSE))}},p.create=function(){var that=this;this.hasLayers&&this.layerController.create(),this.link&&this.link.addClass("ms-slide-link").html("").click(function(e){that.linkdis&&e.preventDefault()}),this.video&&(-1===this.video.indexOf("?")&&(this.video+="?"),this.vframe=$("<iframe></iframe>").addClass("ms-slide-video").css({width:"100%",height:"100%",display:"none"}).attr("src","about:blank").attr("allowfullscreen","true").appendTo(this.$element),this.vpbtn=$("<div></div>").addClass("ms-slide-vpbtn").click(function(){that.__playVideo()}).appendTo(this.$element),this.vcbtn=$("<div></div>").addClass("ms-slide-vcbtn").click(function(){that.__closeVideo()}).appendTo(this.$element).css("display","none"),window._touch&&this.vcbtn.removeClass("ms-slide-vcbtn").addClass("ms-slide-vcbtn-mobile").append('<div class="ms-vcbtn-txt">Close video</div>').appendTo(this.view.$element.parent())),!this.slider.options.autoHeight&&this.hasBG&&(this.$imgcont.css("height","100%"),("center"===this.fillMode||"stretch"===this.fillMode)&&(this.fillMode="fill")),this.slider.options.autoHeight&&this.$element.addClass("ms-slide-auto-height"),this.sleep(!0)},p.destroy=function(){this.hasLayers&&(this.layerController.destroy(),this.layerController=null),this.$element.remove(),this.$element=null},p.prepareToSelect=function(){this.pselected||this.selected||(this.pselected=!0,(this.link||this.video)&&(this.view.addEventListener(MSViewEvents.SWIPE_START,this.onSwipeStart,this),this.view.addEventListener(MSViewEvents.SWIPE_MOVE,this.onSwipeMove,this),this.view.addEventListener(MSViewEvents.SWIPE_CANCEL,this.onSwipeCancel,this),this.linkdis=!1,this.swipeMoved=!1),this.loadImages(),this.hasLayers&&this.layerController.prepareToShow(),this.ready&&(this.bgvideo&&this.bgvideo.play(),this.hasLayers&&this.slider.options.instantStartLayers&&this.layerController.showLayers()),this.moz&&this.$element.css("margin-top",""))},p.select=function(){this.selected||(this.selected=!0,this.pselected=!1,this.$element.addClass("ms-sl-selected"),this.hasLayers&&(this.slider.options.autoHeight&&this.layerController.updateHeight(),this.slider.options.instantStartLayers||this.layerController.showLayers()),this.ready&&this.bgvideo&&this.bgvideo.play(),this.videoAutoPlay&&(this.videodis=!1,this.vpbtn.trigger("click")))},p.unselect=function(){this.pselected=!1,this.moz&&this.$element.css("margin-top","0.1px"),(this.link||this.video)&&(this.view.removeEventListener(MSViewEvents.SWIPE_START,this.onSwipeStart,this),this.view.removeEventListener(MSViewEvents.SWIPE_MOVE,this.onSwipeMove,this),this.view.removeEventListener(MSViewEvents.SWIPE_CANCEL,this.onSwipeCancel,this)),this.bgvideo&&(this.bgvideo.pause(),!this.autoPauseBgVid&&this.vinit&&(this.bgvideo.currentTime=0)),this.hasLayers&&this.layerController.hideLayers(),this.selected&&(this.selected=!1,this.$element.removeClass("ms-sl-selected"),this.video&&this.vplayed&&(this.__closeVideo(),this.roc=!1))},p.sleep=function(force){(!this.isSleeping||force)&&(this.isSleeping=!0,this.autoAppend&&this.$element.detach(),this.hasLayers&&this.layerController.onSlideSleep())},p.wakeup=function(){this.isSleeping&&(this.isSleeping=!1,this.autoAppend&&this.view.$slideCont.append(this.$element),this.moz&&this.$element.css("margin-top","0.1px"),this.setupBG(),this.hasBG&&this.bgAligner.align(),this.hasLayers&&this.layerController.onSlideWakeup())}}(window,document,jQuery),function($){"use strict";var SliderViewList={};window.MSSlideController=function(slider){this._delayProgress=0,this._timer=new averta.Timer(100),this._timer.onTimer=this.onTimer,this._timer.refrence=this,this.currentSlide=null,this.slider=slider,this.so=slider.options,averta.EventDispatcher.call(this)},MSSlideController.registerView=function(name,_class){if(name in SliderViewList)throw new Error(name+", is already registered.");SliderViewList[name]=_class},MSSlideController.SliderControlList={},MSSlideController.registerControl=function(name,_class){if(name in MSSlideController.SliderControlList)throw new Error(name+", is already registered.");MSSlideController.SliderControlList[name]=_class};var p=MSSlideController.prototype;p.setupView=function(){var that=this;this.resize_listener=function(){that.__resize()};var viewOptions={spacing:this.so.space,mouseSwipe:this.so.mouse,loop:this.so.loop,autoHeight:this.so.autoHeight,swipe:this.so.swipe,speed:this.so.speed,dir:this.so.dir,viewNum:this.so.inView,critMargin:this.so.critMargin};this.so.viewOptions&&$.extend(viewOptions,this.so.viewOptions),this.so.autoHeight&&(this.so.heightLimit=!1);var viewClass=SliderViewList[this.slider.options.view]||MSBasicView;if(!viewClass._3dreq||window._css3d&&!$.browser.msie||(viewClass=viewClass._fallback||MSBasicView),this.view=new viewClass(viewOptions),this.so.overPause){var that=this;this.slider.$element.mouseenter(function(){that.is_over=!0,that._stopTimer()}).mouseleave(function(){that.is_over=!1,that._startTimer()})}},p.onChangeStart=function(){this.change_started=!0,this.currentSlide&&this.currentSlide.unselect(),this.currentSlide=this.view.currentSlide,this.currentSlide.prepareToSelect(),this.so.endPause&&this.currentSlide.index===this.slider.slides.length-1&&(this.pause(),this.skipTimer()),this.so.autoHeight&&this.slider.setHeight(this.currentSlide.getHeight()),this.so.deepLink&&this.__updateWindowHash(),this.dispatchEvent(new MSSliderEvent(MSSliderEvent.CHANGE_START))},p.onChangeEnd=function(){if(this.change_started=!1,this._startTimer(),this.currentSlide.select(),this.so.preload>1){var loc,i,slide,l=this.so.preload-1;for(i=1;l>=i;++i){if(loc=this.view.index+i,loc>=this.view.slideList.length){if(!this.so.loop){i=l;continue}loc-=this.view.slideList.length}slide=this.view.slideList[loc],slide&&slide.loadImages()}for(l>this.view.slideList.length/2&&(l=Math.floor(this.view.slideList.length/2)),i=1;l>=i;++i){if(loc=this.view.index-i,0>loc){if(!this.so.loop){i=l;continue}loc=this.view.slideList.length+loc}slide=this.view.slideList[loc],slide&&slide.loadImages()}}this.dispatchEvent(new MSSliderEvent(MSSliderEvent.CHANGE_END))},p.onSwipeStart=function(){this.skipTimer()},p.skipTimer=function(){this._timer.reset(),this._delayProgress=0,this.dispatchEvent(new MSSliderEvent(MSSliderEvent.WAITING))},p.onTimer=function(){if(this._timer.getTime()>=1e3*this.view.currentSlide.delay&&(this.skipTimer(),this.view.next(),this.hideCalled=!1),this._delayProgress=this._timer.getTime()/(10*this.view.currentSlide.delay),this.so.hideLayers&&!this.hideCalled&&1e3*this.view.currentSlide.delay-this._timer.getTime()<=300){var currentSlide=this.view.currentSlide;currentSlide.hasLayers&&currentSlide.layerController.animHideLayers(),this.hideCalled=!0}this.dispatchEvent(new MSSliderEvent(MSSliderEvent.WAITING))},p._stopTimer=function(){this._timer&&this._timer.stop()},p._startTimer=function(){this.paused||this.is_over||!this.currentSlide||!this.currentSlide.ready||this.change_started||this._timer.start()},p.__appendSlides=function(){var slide,loc,i=0,l=this.view.slideList.length-1;for(i;l>i;++i)slide=this.view.slideList[i],slide.detached||(slide.$element.detach(),slide.detached=!0);for(this.view.appendSlide(this.view.slideList[this.view.index]),l=3,i=1;l>=i;++i){if(loc=this.view.index+i,loc>=this.view.slideList.length){if(!this.so.loop){i=l;continue}loc-=this.view.slideList.length}slide=this.view.slideList[loc],slide.detached=!1,this.view.appendSlide(slide)}for(l>this.view.slideList.length/2&&(l=Math.floor(this.view.slideList.length/2)),i=1;l>=i;++i){if(loc=this.view.index-i,0>loc){if(!this.so.loop){i=l;continue}loc=this.view.slideList.length+loc}slide=this.view.slideList[loc],slide.detached=!1,this.view.appendSlide(slide)}},p.__resize=function(hard){this.created&&(this.width=this.slider.$element[0].clientWidth||this.so.width,this.so.fullwidth||(this.width=Math.min(this.width,this.so.width)),this.so.fullheight?(this.so.heightLimit=!1,this.so.autoHeight=!1,this.height=this.slider.$element[0].clientHeight):this.height=this.width/this.slider.aspect,this.so.autoHeight?(this.currentSlide.setSize(this.width,null,hard),this.view.setSize(this.width,this.currentSlide.getHeight(),hard)):this.view.setSize(this.width,Math.max(this.so.minHeight,this.so.heightLimit?Math.min(this.height,this.so.height):this.height),hard),this.slider.$controlsCont&&this.so.centerControls&&this.so.fullwidth&&this.view.$element.css("left",Math.min(0,-(this.slider.$element[0].clientWidth-this.so.width)/2)+"px"),this.dispatchEvent(new MSSliderEvent(MSSliderEvent.RESIZE)))},p.__dispatchInit=function(){this.dispatchEvent(new MSSliderEvent(MSSliderEvent.INIT))},p.__updateWindowHash=function(){var hash=window.location.hash,dl=this.so.deepLink,dlt=this.so.deepLinkType,eq="path"===dlt?"/":"=",sep="path"===dlt?"/":"&",sliderHash=dl+eq+(this.view.index+1),regTest=new RegExp(dl+eq+"[0-9]+","g");window.location.hash=""===hash?sep+sliderHash:regTest.test(hash)?hash.replace(regTest,sliderHash):hash+sep+sliderHash},p.__curentSlideInHash=function(){var hash=window.location.hash,dl=this.so.deepLink,dlt=this.so.deepLinkType,eq="path"===dlt?"/":"=",regTest=new RegExp(dl+eq+"[0-9]+","g");if(regTest.test(hash)){var index=Number(hash.match(regTest)[0].match(/[0-9]+/g).pop());if(!isNaN(index))return index-1}return-1},p.__onHashChanged=function(){var index=this.__curentSlideInHash();-1!==index&&this.gotoSlide(index)},p.setup=function(){this.created=!0,this.paused=!this.so.autoplay,this.view.addEventListener(MSViewEvents.CHANGE_START,this.onChangeStart,this),this.view.addEventListener(MSViewEvents.CHANGE_END,this.onChangeEnd,this),this.view.addEventListener(MSViewEvents.SWIPE_START,this.onSwipeStart,this),this.currentSlide=this.view.slideList[this.so.start-1],this.__resize();var slideInHash=this.__curentSlideInHash(),startSlide=-1!==slideInHash?slideInHash:this.so.start-1;if(this.view.create(startSlide),0===this.so.preload&&this.view.slideList[0].loadImages(),this.scroller=this.view.controller,this.so.wheel){var that=this,last_time=(new Date).getTime();this.wheellistener=function(event){var e=window.event||event.orginalEvent||event;e.preventDefault();var current_time=(new Date).getTime();if(!(400>current_time-last_time)){last_time=current_time;var delta=Math.abs(e.detail||e.wheelDelta);$.browser.mozilla&&(delta*=100);var scrollThreshold=15;return e.detail<0||e.wheelDelta>0?delta>=scrollThreshold&&that.previous(!0):delta>=scrollThreshold&&that.next(!0),!1}},$.browser.mozilla?this.slider.$element[0].addEventListener("DOMMouseScroll",this.wheellistener):this.slider.$element.bind("mousewheel",this.wheellistener)}0===this.slider.$element[0].clientWidth&&(this.slider.init_safemode=!0),this.__resize();var that=this;this.so.deepLink&&$(window).on("hashchange",function(){that.__onHashChanged()})},p.index=function(){return this.view.index},p.count=function(){return this.view.slidesCount},p.next=function(checkLoop){this.skipTimer(),this.view.next(checkLoop)},p.previous=function(checkLoop){this.skipTimer(),this.view.previous(checkLoop)},p.gotoSlide=function(index){index=Math.min(index,this.count()-1),this.skipTimer(),this.view.gotoSlide(index)},p.destroy=function(reset){this.dispatchEvent(new MSSliderEvent(MSSliderEvent.DESTROY)),this.slider.destroy(reset)},p._destroy=function(){this._timer.reset(),this._timer=null,$(window).unbind("resize",this.resize_listener),this.view.destroy(),this.view=null,this.so.wheel&&($.browser.mozilla?this.slider.$element[0].removeEventListener("DOMMouseScroll",this.wheellistener):this.slider.$element.unbind("mousewheel",this.wheellistener),this.wheellistener=null),this.so=null},p.runAction=function(action){var actionParams=[];if(-1!==action.indexOf("(")){var temp=action.slice(0,action.indexOf("("));actionParams=action.slice(action.indexOf("(")+1,-1).replace(/\"|\'|\s/g,"").split(","),action=temp}action in this?this[action].apply(this,actionParams):console},p.update=function(hard){this.slider.init_safemode&&hard&&(this.slider.init_safemode=!1),this.__resize(hard),hard&&this.dispatchEvent(new MSSliderEvent(MSSliderEvent.HARD_UPDATE))},p.locate=function(){this.__resize()},p.resume=function(){this.paused&&(this.paused=!1,this._startTimer())},p.pause=function(){this.paused||(this.paused=!0,this._stopTimer())},p.currentTime=function(){return this._delayProgress},averta.EventDispatcher.extend(p)}(jQuery),function($){"use strict";var LayerTypes={image:MSImageLayerElement,text:MSLayerElement,video:MSVideoLayerElement,hotspot:MSHotspotLayer,button:MSButtonLayer};window.MasterSlider=function(){this.options={forceInit:!0,autoplay:!1,loop:!1,mouse:!0,swipe:!0,grabCursor:!0,space:0,fillMode:"fill",start:1,view:"basic",width:300,height:150,inView:15,critMargin:1,heightLimit:!0,smoothHeight:!0,autoHeight:!1,minHeight:-1,fullwidth:!1,fullheight:!1,autofill:!1,layersMode:"center",hideLayers:!1,endPause:!1,centerControls:!0,overPause:!0,shuffle:!1,speed:17,dir:"h",preload:0,wheel:!1,layout:"boxed",autofillTarget:null,fullscreenMargin:0,instantStartLayers:!1,parallaxMode:"mouse",rtl:!1,deepLink:null,deepLinkType:"path",disablePlugins:[]},this.slides=[],this.activePlugins=[],this.$element=null,this.lastMargin=0,this.leftSpace=0,this.topSpace=0,this.rightSpace=0,this.bottomSpace=0,this._holdOn=0;var that=this;this.resize_listener=function(){that._resize()},$(window).bind("resize",this.resize_listener)},MasterSlider.author="Averta Ltd. (www.averta.net)",MasterSlider.version="2.16.3",MasterSlider.releaseDate="Dec 2015",MasterSlider._plugins=[];var MS=MasterSlider;MS.registerPlugin=function(plugin){-1===MS._plugins.indexOf(plugin)&&MS._plugins.push(plugin)};var p=MasterSlider.prototype;p.__setupSlides=function(){var new_slide,that=this,ind=0;this.$element.children(".ms-slide").each(function(){var $slide_ele=$(this);new_slide=new MSSlide,new_slide.$element=$slide_ele,new_slide.slider=that,new_slide.delay=void 0!==$slide_ele.data("delay")?$slide_ele.data("delay"):3,new_slide.fillMode=void 0!==$slide_ele.data("fill-mode")?$slide_ele.data("fill-mode"):that.options.fillMode,new_slide.index=ind++;var slide_img=$slide_ele.children("img:not(.ms-layer)");slide_img.length>0&&new_slide.setBG(slide_img[0]);var slide_video=$slide_ele.children("video");if(slide_video.length>0&&new_slide.setBGVideo(slide_video),that.controls)for(var i=0,l=that.controls.length;l>i;++i)that.controls[i].slideAction(new_slide);$slide_ele.children("a").each(function(){var $this=$(this);"video"===this.getAttribute("data-type")?(new_slide.video=this.getAttribute("href"),new_slide.videoAutoPlay=$this.data("autoplay"),$this.remove()):$this.hasClass("ms-layer")||(new_slide.link=$(this))});that.__createSlideLayers(new_slide,$slide_ele.find(".ms-layer")),that.slides.push(new_slide),that.slideController.view.addSlide(new_slide)})},p.__createSlideLayers=function(slide,layers){0!=layers.length&&(slide.setupLayerController(),layers.each(function(index,domEle){var $parent_ele,$layer_element=$(this);"A"===domEle.nodeName&&"image"===$layer_element.find(">img").data("type")&&($parent_ele=$(this),$layer_element=$parent_ele.find("img"));var layer=new(LayerTypes[$layer_element.data("type")||"text"]);layer.$element=$layer_element,layer.link=$parent_ele;var eff_parameters={},end_eff_parameters={};void 0!==$layer_element.data("effect")&&(eff_parameters.name=$layer_element.data("effect")),void 0!==$layer_element.data("ease")&&(eff_parameters.ease=$layer_element.data("ease")),void 0!==$layer_element.data("duration")&&(eff_parameters.duration=$layer_element.data("duration")),void 0!==$layer_element.data("delay")&&(eff_parameters.delay=$layer_element.data("delay")),$layer_element.data("hide-effect")&&(end_eff_parameters.name=$layer_element.data("hide-effect")),$layer_element.data("hide-ease")&&(end_eff_parameters.ease=$layer_element.data("hide-ease")),void 0!==$layer_element.data("hide-duration")&&(end_eff_parameters.duration=$layer_element.data("hide-duration")),void 0!==$layer_element.data("hide-time")&&(end_eff_parameters.time=$layer_element.data("hide-time")),layer.setStartAnim(eff_parameters),layer.setEndAnim(end_eff_parameters),slide.layerController.addLayer(layer)}))},p._removeLoading=function(){$(window).unbind("resize",this.resize_listener),this.$element.removeClass("before-init").css("visibility","visible").css("height","").css("opacity",0),CTween.fadeIn(this.$element),this.$loading.remove(),this.slideController&&this.slideController.__resize()},p._resize=function(){if(this.$loading){var h=this.$loading[0].clientWidth/this.aspect;h=this.options.heightLimit?Math.min(h,this.options.height):h,this.$loading.height(h),this.$element.height(h)}},p._shuffleSlides=function(){for(var r,slides=this.$element.children(".ms-slide"),i=0,l=slides.length;l>i;++i)r=Math.floor(Math.random()*(l-1)),i!=r&&(this.$element[0].insertBefore(slides[i],slides[r]),slides=this.$element.children(".ms-slide"))},p._setupSliderLayout=function(){this._updateSideMargins(),this.lastMargin=this.leftSpace;var lo=this.options.layout;"boxed"!==lo&&"partialview"!==lo&&(this.options.fullwidth=!0),("fullscreen"===lo||"autofill"===lo)&&(this.options.fullheight=!0,"autofill"===lo&&(this.$autofillTarget=$(this.options.autofillTarget),0===this.$autofillTarget.length&&(this.$autofillTarget=this.$element.parent()))),"partialview"===lo&&this.$element.addClass("ms-layout-partialview"),("fullscreen"===lo||"fullwidth"===lo||"autofill"===lo)&&($(window).bind("resize",{that:this},this._updateLayout),this._updateLayout()),$(window).bind("resize",this.slideController.resize_listener)},p._updateLayout=function(event){var that=event?event.data.that:this,lo=that.options.layout,$element=that.$element,$win=$(window);if("fullscreen"===lo)document.body.style.overflow="hidden",$element.height($win.height()-that.options.fullscreenMargin-that.topSpace-that.bottomSpace),document.body.style.overflow="";else if("autofill"===lo)return void $element.height(that.$autofillTarget.height()-that.options.fullscreenMargin-that.topSpace-that.bottomSpace).width(that.$autofillTarget.width()-that.leftSpace-that.rightSpace);$element.width($win.width()-that.leftSpace-that.rightSpace);var margin=-$element.offset().left+that.leftSpace+that.lastMargin;$element.css("margin-left",margin),that.lastMargin=margin},p._init=function(){if(!(this._holdOn>0)&&this._docReady){if(this.initialized=!0,"all"!==this.options.preload&&this._removeLoading(),this.options.shuffle&&this._shuffleSlides(),MSLayerEffects.setup(),this.slideController.setupView(),this.view=this.slideController.view,this.$controlsCont=$("<div></div>").addClass("ms-inner-controls-cont"),this.options.centerControls&&this.$controlsCont.css("max-width",this.options.width+"px"),this.$controlsCont.prepend(this.view.$element),this.$msContainer=$("<div></div>").addClass("ms-container").prependTo(this.$element).append(this.$controlsCont),this.controls)for(var i=0,l=this.controls.length;l>i;++i)this.controls[i].setup();if(this._setupSliderLayout(),this.__setupSlides(),this.slideController.setup(),this.controls)for(i=0,l=this.controls.length;l>i;++i)this.controls[i].create();if(this.options.autoHeight&&this.slideController.view.$element.height(this.slideController.currentSlide.getHeight()),this.options.swipe&&!window._touch&&this.options.grabCursor&&this.options.mouse){var $view=this.view.$element;$view.mousedown(function(){$view.removeClass("ms-grab-cursor"),$view.addClass("ms-grabbing-cursor"),$.browser.msie&&window.ms_grabbing_curosr&&($view[0].style.cursor="url("+window.ms_grabbing_curosr+"), move")}).addClass("ms-grab-cursor"),$(document).mouseup(function(){$view.removeClass("ms-grabbing-cursor"),$view.addClass("ms-grab-cursor"),$.browser.msie&&window.ms_grab_curosr&&($view[0].style.cursor="url("+window.ms_grab_curosr+"), move")})}this.slideController.__dispatchInit()}},p.setHeight=function(value){this.options.smoothHeight?(this.htween&&(this.htween.reset?this.htween.reset():this.htween.stop(!0)),this.htween=CTween.animate(this.slideController.view.$element,500,{height:value},{ease:"easeOutQuart"})):this.slideController.view.$element.height(value)},p.reserveSpace=function(side,space){var sideSpace=side+"Space",pos=this[sideSpace];return this[sideSpace]+=space,this._updateSideMargins(),pos},p._updateSideMargins=function(){this.$element.css("margin",this.topSpace+"px "+this.rightSpace+"px "+this.bottomSpace+"px "+this.leftSpace+"px")},p._realignControls=function(){this.rightSpace=this.leftSpace=this.topSpace=this.bottomSpace=0,this._updateSideMargins(),this.api.dispatchEvent(new MSSliderEvent(MSSliderEvent.RESERVED_SPACE_CHANGE))},p.control=function(control,options){if(control in MSSlideController.SliderControlList){this.controls||(this.controls=[]);var ins=new MSSlideController.SliderControlList[control](options);return ins.slider=this,this.controls.push(ins),this}},p.holdOn=function(){this._holdOn++},p.release=function(){this._holdOn--,this._init()},p.setup=function(target,options){if(this.$element="string"==typeof target?$("#"+target):target.eq(0),this.setupMarkup=this.$element.html(),0!==this.$element.length){this.$element.addClass("master-slider").addClass("before-init"),$.browser.msie?this.$element.addClass("ms-ie").addClass("ms-ie"+$.browser.version.slice(0,$.browser.version.indexOf("."))):$.browser.webkit?this.$element.addClass("ms-wk"):$.browser.mozilla&&this.$element.addClass("ms-moz");var ua=navigator.userAgent.toLowerCase(),isAndroid=ua.indexOf("android")>-1;isAndroid&&this.$element.addClass("ms-android");var that=this;$.extend(this.options,options),this.aspect=this.options.width/this.options.height,this.$loading=$("<div></div>").addClass("ms-loading-container").insertBefore(this.$element).append($("<div></div>").addClass("ms-loading")),this.$loading.parent().css("position","relative"),this.options.autofill&&(this.options.fullwidth=!0,this.options.fullheight=!0),this.options.fullheight&&this.$element.addClass("ms-fullheight"),this._resize(),this.slideController=new MSSlideController(this),this.api=this.slideController;for(var i=0,l=MS._plugins.length;i!==l;i++){var plugin=MS._plugins[i];-1===this.options.disablePlugins.indexOf(plugin.name)&&this.activePlugins.push(new plugin(this))}return this.options.forceInit&&MasterSlider.addJQReadyErrorCheck(this),$(document).ready(function(){that.initialize||(that._docReady=!0,that._init())}),this}},p.destroy=function(insertMarkup){for(var i=0,l=this.activePlugins.length;i!==l;i++)this.activePlugins[i].destroy();if(this.controls)for(i=0,l=this.controls.length;i!==l;i++)this.controls[i].destroy();this.slideController&&this.slideController._destroy(),this.$loading&&this.$loading.remove(),insertMarkup?this.$element.html(this.setupMarkup).css("visibility","hidden"):this.$element.remove();var lo=this.options.layout;("fullscreen"===lo||"fullwidth"===lo)&&$(window).unbind("resize",this._updateLayout),this.view=null,this.slides=null,this.options=null,this.slideController=null,this.api=null,this.resize_listener=null,this.activePlugins=null}}(jQuery),function($,window,document,undefined){function MasterSliderPlugin(element,options){this.element=element,this.$element=$(element),this.settings=$.extend({},defaults,options),this._defaults=defaults,this._name=pluginName,this.init()}var pluginName="masterslider",defaults={controls:{}};$.extend(MasterSliderPlugin.prototype,{init:function(){var self=this;this._slider=new MasterSlider;for(var control in this.settings.controls)this._slider.control(control,this.settings.controls[control]);this._slider.setup(this.$element,this.settings);var _superDispatch=this._slider.api.dispatchEvent;this._slider.api.dispatchEvent=function(event){self.$element.trigger(event.type),_superDispatch.call(this,event)}},api:function(){return this._slider.api},slider:function(){return this._slider}}),$.fn[pluginName]=function(options){var args=arguments,plugin="plugin_"+pluginName;if(options===undefined||"object"==typeof options)return this.each(function(){$.data(this,plugin)||$.data(this,plugin,new MasterSliderPlugin(this,options))});if("string"==typeof options&&"_"!==options[0]&&"init"!==options){var returns;return this.each(function(){var instance=$.data(this,plugin);instance instanceof MasterSliderPlugin&&"function"==typeof instance[options]&&(returns=instance[options].apply(instance,Array.prototype.slice.call(args,1))),instance instanceof MasterSliderPlugin&&"function"==typeof instance._slider.api[options]&&(returns=instance._slider.api[options].apply(instance._slider.api,Array.prototype.slice.call(args,1))),"destroy"===options&&$.data(this,plugin,null)}),returns!==undefined?returns:this}}}(jQuery,window,document),function($,window){"use strict";var sliderInstances=[];MasterSlider.addJQReadyErrorCheck=function(slider){sliderInstances.push(slider)};var _ready=$.fn.ready,_onerror=window.onerror;$.fn.ready=function(){window.onerror=function(){if(0!==sliderInstances.length)for(var i=0,l=sliderInstances.length;i!==l;i++){var slider=sliderInstances[i];slider.initialized||(slider._docReady=!0,slider._init())}return _onerror?_onerror.apply(this,arguments):!1},_ready.apply(this,arguments)}}(jQuery,window,document),window.MSViewEvents=function(type,data){this.type=type,this.data=data},MSViewEvents.SWIPE_START="swipeStart",MSViewEvents.SWIPE_END="swipeEnd",MSViewEvents.SWIPE_MOVE="swipeMove",MSViewEvents.SWIPE_CANCEL="swipeCancel",MSViewEvents.SCROLL="scroll",MSViewEvents.CHANGE_START="slideChangeStart",MSViewEvents.CHANGE_END="slideChangeEnd",function($){"use strict";window.MSBasicView=function(options){this.options={loop:!1,dir:"h",autoHeight:!1,spacing:5,mouseSwipe:!0,swipe:!0,speed:17,minSlideSpeed:2,viewNum:20,critMargin:1},$.extend(this.options,options),this.dir=this.options.dir,this.loop=this.options.loop,this.spacing=this.options.spacing,this.__width=0,this.__height=0,this.__cssProb="h"===this.dir?"left":"top",this.__offset="h"===this.dir?"offsetLeft":"offsetTop",this.__dimension="h"===this.dir?"__width":"__height",this.__translate_end=window._css3d?" translateZ(0px)":"",this.$slideCont=$("<div></div>").addClass("ms-slide-container"),this.$element=$("<div></div>").addClass("ms-view").addClass("ms-basic-view").append(this.$slideCont),this.currentSlide=null,this.index=-1,this.slidesCount=0,this.slides=[],this.slideList=[],this.viewSlidesList=[],this.css3=window._cssanim,this.start_buffer=0,this.firstslide_snap=0,this.slideChanged=!1,this.controller=new Controller(0,0,{snapping:!0,snapsize:100,paging:!0,snappingMinSpeed:this.options.minSlideSpeed,friction:(100-.5*this.options.speed)/100,endless:this.loop}),this.controller.renderCallback("h"===this.dir?this._horizUpdate:this._vertiUpdate,this),this.controller.snappingCallback(this.__snapUpdate,this),this.controller.snapCompleteCallback(this.__snapCompelet,this),averta.EventDispatcher.call(this)};var p=MSBasicView.prototype;p.__snapCompelet=function(){this.slideChanged&&(this.slideChanged=!1,this.__locateSlides(),this.start_buffer=0,this.dispatchEvent(new MSViewEvents(MSViewEvents.CHANGE_END)))},p.__snapUpdate=function(controller,snap,change){if(this.loop){var target_index=this.index+change;this.updateLoop(target_index),target_index>=this.slidesCount&&(target_index-=this.slidesCount),0>target_index&&(target_index=this.slidesCount+target_index),this.index=target_index}else{if(0>snap||snap>=this.slidesCount)return;this.index=snap}this._checkCritMargins(),$.browser.mozilla&&(this.slideList[this.index].$element[0].style.marginTop="0.1px",this.currentSlide&&(this.currentSlide.$element[0].style.marginTop=""));var new_slide=this.slideList[this.index];new_slide!==this.currentSlide&&(this.currentSlide=new_slide,this.autoUpdateZIndex&&this.__updateSlidesZindex(),this.slideChanged=!0,this.dispatchEvent(new MSViewEvents(MSViewEvents.CHANGE_START)))},p._checkCritMargins=function(){if(!this.normalMode){var hlf=Math.floor(this.options.viewNum/2),inView=this.viewSlidesList.indexOf(this.slideList[this.index]),size=this[this.__dimension]+this.spacing,cm=this.options.critMargin;return this.loop?void((cm>=inView||inView>=this.viewSlidesList.length-cm)&&(size*=inView-hlf,this.__locateSlides(!1,size+this.start_buffer),this.start_buffer+=size)):void((cm>inView&&this.index>=cm||inView>=this.viewSlidesList.length-cm&&this.index<this.slidesCount-cm)&&this.__locateSlides(!1))}},p._vertiUpdate=function(controller,value){return this.__contPos=value,this.dispatchEvent(new MSViewEvents(MSViewEvents.SCROLL)),this.css3?void(this.$slideCont[0].style[window._jcsspfx+"Transform"]="translateY("+-value+"px)"+this.__translate_end):void(this.$slideCont[0].style.top=-value+"px")},p._horizUpdate=function(controller,value){return this.__contPos=value,this.dispatchEvent(new MSViewEvents(MSViewEvents.SCROLL)),this.css3?void(this.$slideCont[0].style[window._jcsspfx+"Transform"]="translateX("+-value+"px)"+this.__translate_end):void(this.$slideCont[0].style.left=-value+"px")},p.__updateViewList=function(){if(this.normalMode)return void(this.viewSlidesList=this.slides);var temp=this.viewSlidesList.slice();this.viewSlidesList=[];var l,i=0,hlf=Math.floor(this.options.viewNum/2);if(this.loop)for(;i!==this.options.viewNum;i++)this.viewSlidesList.push(this.slides[this.currentSlideLoc-hlf+i]);else{for(i=0;i!==hlf&&this.index-i!==-1;i++)this.viewSlidesList.unshift(this.slideList[this.index-i]);for(i=1;i!==hlf&&this.index+i!==this.slidesCount;i++)this.viewSlidesList.push(this.slideList[this.index+i])}for(i=0,l=temp.length;i!==l;i++)-1===this.viewSlidesList.indexOf(temp[i])&&temp[i].sleep();temp=null,this.currentSlide&&this.__updateSlidesZindex()},p.__locateSlides=function(move,start){this.__updateViewList(),start=this.loop?start||0:this.slides.indexOf(this.viewSlidesList[0])*(this[this.__dimension]+this.spacing);for(var slide,l=this.viewSlidesList.length,i=0;i!==l;i++){var pos=start+i*(this[this.__dimension]+this.spacing);slide=this.viewSlidesList[i],slide.wakeup(),slide.position=pos,slide.$element[0].style[this.__cssProb]=pos+"px"}move!==!1&&this.controller.changeTo(this.slideList[this.index].position,!1,null,null,!1)},p.__createLoopList=function(){var return_arr=[],i=0,count=this.slidesCount/2,before_count=this.slidesCount%2===0?count-1:Math.floor(count),after_count=this.slidesCount%2===0?count:Math.floor(count);for(this.currentSlideLoc=before_count,i=1;before_count>=i;++i)return_arr.unshift(this.slideList[this.index-i<0?this.slidesCount-i+this.index:this.index-i]);for(return_arr.push(this.slideList[this.index]),i=1;after_count>=i;++i)return_arr.push(this.slideList[this.index+i>=this.slidesCount?this.index+i-this.slidesCount:this.index+i]);return return_arr},p.__getSteps=function(index,target){var right=index>target?this.slidesCount-index+target:target-index,left=Math.abs(this.slidesCount-right);return left>right?right:-left},p.__pushEnd=function(){var first_slide=this.slides.shift(),last_slide=this.slides[this.slidesCount-2];
if(this.slides.push(first_slide),this.normalMode){var pos=last_slide.$element[0][this.__offset]+this.spacing+this[this.__dimension];first_slide.$element[0].style[this.__cssProb]=pos+"px",first_slide.position=pos}},p.__pushStart=function(){var last_slide=this.slides.pop(),first_slide=this.slides[0];if(this.slides.unshift(last_slide),this.normalMode){var pos=first_slide.$element[0][this.__offset]-this.spacing-this[this.__dimension];last_slide.$element[0].style[this.__cssProb]=pos+"px",last_slide.position=pos}},p.__updateSlidesZindex=function(){{var slide,l=this.viewSlidesList.length;Math.floor(l/2)}if(this.loop)for(var loc=this.viewSlidesList.indexOf(this.currentSlide),i=0;i!==l;i++)slide=this.viewSlidesList[i],this.viewSlidesList[i].$element.css("z-index",loc>=i?i+1:l-i);else{for(var beforeNum=this.currentSlide.index-this.viewSlidesList[0].index,i=0;i!==l;i++)this.viewSlidesList[i].$element.css("z-index",beforeNum>=i?i+1:l-i);this.currentSlide.$element.css("z-index",l)}},p.addSlide=function(slide){slide.view=this,this.slides.push(slide),this.slideList.push(slide),this.slidesCount++},p.appendSlide=function(slide){this.$slideCont.append(slide.$element)},p.updateLoop=function(index){if(this.loop)for(var steps=this.__getSteps(this.index,index),i=0,l=Math.abs(steps);l>i;++i)0>steps?this.__pushStart():this.__pushEnd()},p.gotoSlide=function(index,fast){this.updateLoop(index),this.index=index;var target_slide=this.slideList[index];this._checkCritMargins(),this.controller.changeTo(target_slide.position,!fast,null,null,!1),target_slide!==this.currentSlide&&(this.slideChanged=!0,this.currentSlide=target_slide,this.autoUpdateZIndex&&this.__updateSlidesZindex(),this.dispatchEvent(new MSViewEvents(MSViewEvents.CHANGE_START)),fast&&this.dispatchEvent(new MSViewEvents(MSViewEvents.CHANGE_END)))},p.next=function(checkLoop){return checkLoop&&!this.loop&&this.index+1>=this.slidesCount?void this.controller.bounce(10):void this.gotoSlide(this.index+1>=this.slidesCount?0:this.index+1)},p.previous=function(checkLoop){return checkLoop&&!this.loop&&this.index-1<0?void this.controller.bounce(-10):void this.gotoSlide(this.index-1<0?this.slidesCount-1:this.index-1)},p.setupSwipe=function(){this.swipeControl=new averta.TouchSwipe(this.$element),this.swipeControl.swipeType="h"===this.dir?"horizontal":"vertical";var that=this;this.swipeControl.onSwipe="h"===this.dir?function(status){that.horizSwipeMove(status)}:function(status){that.vertSwipeMove(status)}},p.vertSwipeMove=function(status){var phase=status.phase;if("start"===phase)this.controller.stop(),this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_START,status));else if("move"===phase&&(!this.loop||Math.abs(this.currentSlide.position-this.controller.value+status.moveY)<this.cont_size/2))this.controller.drag(status.moveY),this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_MOVE,status));else if("end"===phase||"cancel"===phase){var speed=status.distanceY/status.duration*50/3,speedh=Math.abs(status.distanceY/status.duration*50/3);Math.abs(speed)>.1&&Math.abs(speed)>=speedh?(this.controller.push(-speed),speed>this.controller.options.snappingMinSpeed&&this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_END,status))):(this.controller.cancel(),this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_CANCEL,status)))}},p.horizSwipeMove=function(status){var phase=status.phase;if("start"===phase)this.controller.stop(),this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_START,status));else if("move"===phase&&(!this.loop||Math.abs(this.currentSlide.position-this.controller.value+status.moveX)<this.cont_size/2))this.controller.drag(status.moveX),this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_MOVE,status));else if("end"===phase||"cancel"===phase){var speed=status.distanceX/status.duration*50/3,speedv=Math.abs(status.distanceY/status.duration*50/3);Math.abs(speed)>.1&&Math.abs(speed)>=speedv?(this.controller.push(-speed),speed>this.controller.options.snappingMinSpeed&&this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_END,status))):(this.controller.cancel(),this.dispatchEvent(new MSViewEvents(MSViewEvents.SWIPE_CANCEL,status)))}},p.setSize=function(width,height,hard){if(this.lastWidth!==width||height!==this.lastHeight||hard){this.$element.width(width).height(height);for(var i=0;i<this.slidesCount;++i)this.slides[i].setSize(width,height,hard);this.__width=width,this.__height=height,this.__created&&(this.__locateSlides(),this.cont_size=(this.slidesCount-1)*(this[this.__dimension]+this.spacing),this.loop||(this.controller._max_value=this.cont_size),this.controller.options.snapsize=this[this.__dimension]+this.spacing,this.controller.changeTo(this.currentSlide.position,!1,null,null,!1),this.controller.cancel(),this.lastWidth=width,this.lastHeight=height)}},p.create=function(index){this.__created=!0,this.index=Math.min(index||0,this.slidesCount-1),this.lastSnap=this.index,this.loop&&(this.slides=this.__createLoopList()),this.normalMode=this.slidesCount<=this.options.viewNum;for(var i=0;i<this.slidesCount;++i)this.slides[i].create();this.__locateSlides(),this.controller.options.snapsize=this[this.__dimension]+this.spacing,this.loop||(this.controller._max_value=(this.slidesCount-1)*(this[this.__dimension]+this.spacing)),this.gotoSlide(this.index,!0),this.options.swipe&&(window._touch||this.options.mouseSwipe)&&this.setupSwipe()},p.destroy=function(){if(this.__created){for(var i=0;i<this.slidesCount;++i)this.slides[i].destroy();this.slides=null,this.slideList=null,this.$element.remove(),this.controller.destroy(),this.controller=null}},averta.EventDispatcher.extend(p),MSSlideController.registerView("basic",MSBasicView)}(jQuery),function(){"use strict";window.MSWaveView=function(options){MSBasicView.call(this,options),this.$element.removeClass("ms-basic-view").addClass("ms-wave-view"),this.$slideCont.css(window._csspfx+"transform-style","preserve-3d"),this.autoUpdateZIndex=!0},MSWaveView.extend(MSBasicView),MSWaveView._3dreq=!0,MSWaveView._fallback=MSBasicView;var p=MSWaveView.prototype,_super=MSBasicView.prototype;p._horizUpdate=function(controller,value){_super._horizUpdate.call(this,controller,value);for(var slide,distance,cont_scroll=-value,i=0;i<this.slidesCount;++i)slide=this.slideList[i],distance=-cont_scroll-slide.position,this.__updateSlidesHoriz(slide,distance)},p._vertiUpdate=function(controller,value){_super._vertiUpdate.call(this,controller,value);for(var slide,distance,cont_scroll=-value,i=0;i<this.slidesCount;++i)slide=this.slideList[i],distance=-cont_scroll-slide.position,this.__updateSlidesVertic(slide,distance)},p.__updateSlidesHoriz=function(slide,distance){var value=Math.abs(100*distance/this.__width);slide.$element.css(window._csspfx+"transform","translateZ("+3*-value+"px) rotateY(0.01deg)")},p.__updateSlidesVertic=function(slide,distance){this.__updateSlidesHoriz(slide,distance)},MSSlideController.registerView("wave",MSWaveView)}(jQuery),function(){window.MSFadeBasicView=function(options){MSWaveView.call(this,options),this.$element.removeClass("ms-wave-view").addClass("ms-fade-basic-view")},MSFadeBasicView.extend(MSWaveView);{var p=MSFadeBasicView.prototype;MSFadeBasicView.prototype}p.__updateSlidesHoriz=function(slide,distance){var value=Math.abs(.6*distance/this.__width);value=1-Math.min(value,.6),slide.$element.css("opacity",value)},p.__updateSlidesVertic=function(slide,distance){this.__updateSlidesHoriz(slide,distance)},MSSlideController.registerView("fadeBasic",MSFadeBasicView),MSWaveView._fallback=MSFadeBasicView}(),function(){window.MSFadeWaveView=function(options){MSWaveView.call(this,options),this.$element.removeClass("ms-wave-view").addClass("ms-fade-wave-view")},MSFadeWaveView.extend(MSWaveView),MSFadeWaveView._3dreq=!0,MSFadeWaveView._fallback=MSFadeBasicView;{var p=MSFadeWaveView.prototype;MSWaveView.prototype}p.__updateSlidesHoriz=function(slide,distance){var value=Math.abs(100*distance/this.__width);value=Math.min(value,100),slide.$element.css("opacity",1-value/300),slide.$element[0].style[window._jcsspfx+"Transform"]="scale("+(1-value/800)+") rotateY(0.01deg) "},p.__updateSlidesVertic=function(slide,distance){this.__updateSlidesHoriz(slide,distance)},MSSlideController.registerView("fadeWave",MSFadeWaveView)}(),function(){"use strict";window.MSFlowView=function(options){MSWaveView.call(this,options),this.$element.removeClass("ms-wave-view").addClass("ms-flow-view")},MSFlowView.extend(MSWaveView),MSFlowView._3dreq=!0,MSFlowView._fallback=MSFadeBasicView;{var p=MSFlowView.prototype;MSWaveView.prototype}p.__updateSlidesHoriz=function(slide,distance){var value=Math.abs(100*distance/this.__width),rvalue=Math.min(.3*value,30)*(0>distance?-1:1),zvalue=1.2*value;slide.$element[0].style[window._jcsspfx+"Transform"]="translateZ("+5*-zvalue+"px) rotateY("+rvalue+"deg) "},p.__updateSlidesVertic=function(slide,distance){var value=Math.abs(100*distance/this.__width),rvalue=Math.min(.3*value,30)*(0>distance?-1:1),zvalue=1.2*value;slide.$element[0].style[window._jcsspfx+"Transform"]="translateZ("+5*-zvalue+"px) rotateX("+-rvalue+"deg) "},MSSlideController.registerView("flow",MSFlowView)}(jQuery),function(){window.MSFadeFlowView=function(options){MSWaveView.call(this,options),this.$element.removeClass("ms-wave-view").addClass("ms-fade-flow-view")},MSFadeFlowView.extend(MSWaveView),MSFadeFlowView._3dreq=!0;{var p=MSFadeFlowView.prototype;MSWaveView.prototype}p.__calculate=function(distance){var value=Math.min(Math.abs(100*distance/this.__width),100),rvalue=Math.min(.5*value,50)*(0>distance?-1:1);return{value:value,rvalue:rvalue}},p.__updateSlidesHoriz=function(slide,distance){var clc=this.__calculate(distance);slide.$element.css("opacity",1-clc.value/300),slide.$element[0].style[window._jcsspfx+"Transform"]="translateZ("+-clc.value+"px) rotateY("+clc.rvalue+"deg) "},p.__updateSlidesVertic=function(slide,distance){var clc=this.__calculate(distance);slide.$element.css("opacity",1-clc.value/300),slide.$element[0].style[window._jcsspfx+"Transform"]="translateZ("+-clc.value+"px) rotateX("+-clc.rvalue+"deg) "},MSSlideController.registerView("fadeFlow",MSFadeFlowView)}(),function($){"use strict";window.MSMaskView=function(options){MSBasicView.call(this,options),this.$element.removeClass("ms-basic-view").addClass("ms-mask-view")},MSMaskView.extend(MSBasicView);var p=MSMaskView.prototype,_super=MSBasicView.prototype;p.addSlide=function(slide){slide.view=this,slide.$frame=$("<div></div>").addClass("ms-mask-frame").append(slide.$element),slide.$element[0].style.position="relative",slide.autoAppend=!1,this.slides.push(slide),this.slideList.push(slide),this.slidesCount++},p.setSize=function(width,height){for(var slider=this.slides[0].slider,i=0;i<this.slidesCount;++i)this.slides[i].$frame[0].style.width=width+"px",slider.options.autoHeight||(this.slides[i].$frame[0].style.height=height+"px");_super.setSize.call(this,width,height)},p._horizUpdate=function(controller,value){_super._horizUpdate.call(this,controller,value);var i=0;if(this.css3)for(i=0;i<this.slidesCount;++i)this.slideList[i].$element[0].style[window._jcsspfx+"Transform"]="translateX("+(value-this.slideList[i].position)+"px)"+this.__translate_end;else for(i=0;i<this.slidesCount;++i)this.slideList[i].$element[0].style.left=value-this.slideList[i].position+"px"},p._vertiUpdate=function(controller,value){_super._vertiUpdate.call(this,controller,value);var i=0;if(this.css3)for(i=0;i<this.slidesCount;++i)this.slideList[i].$element[0].style[window._jcsspfx+"Transform"]="translateY("+(value-this.slideList[i].position)+"px)"+this.__translate_end;else for(i=0;i<this.slidesCount;++i)this.slideList[i].$element[0].style.top=value-this.slideList[i].position+"px"},p.__pushEnd=function(){var first_slide=this.slides.shift(),last_slide=this.slides[this.slidesCount-2];if(this.slides.push(first_slide),this.normalMode){var pos=last_slide.$frame[0][this.__offset]+this.spacing+this[this.__dimension];first_slide.$frame[0].style[this.__cssProb]=pos+"px",first_slide.position=pos}},p.__pushStart=function(){var last_slide=this.slides.pop(),first_slide=this.slides[0];if(this.slides.unshift(last_slide),this.normalMode){var pos=first_slide.$frame[0][this.__offset]-this.spacing-this[this.__dimension];last_slide.$frame[0].style[this.__cssProb]=pos+"px",last_slide.position=pos}},p.__updateViewList=function(){if(this.normalMode)return void(this.viewSlidesList=this.slides);var temp=this.viewSlidesList.slice();this.viewSlidesList=[];var l,i=0,hlf=Math.floor(this.options.viewNum/2);if(this.loop)for(;i!==this.options.viewNum;i++)this.viewSlidesList.push(this.slides[this.currentSlideLoc-hlf+i]);else{for(i=0;i!==hlf&&this.index-i!==-1;i++)this.viewSlidesList.unshift(this.slideList[this.index-i]);for(i=1;i!==hlf&&this.index+i!==this.slidesCount;i++)this.viewSlidesList.push(this.slideList[this.index+i])}for(i=0,l=temp.length;i!==l;i++)-1===this.viewSlidesList.indexOf(temp[i])&&(temp[i].sleep(),temp[i].$frame.detach());temp=null},p.__locateSlides=function(move,start){this.__updateViewList(),start=this.loop?start||0:this.slides.indexOf(this.viewSlidesList[0])*(this[this.__dimension]+this.spacing);for(var slide,l=this.viewSlidesList.length,i=0;i!==l;i++){var pos=start+i*(this[this.__dimension]+this.spacing);if(slide=this.viewSlidesList[i],this.$slideCont.append(slide.$frame),slide.wakeup(!1),slide.position=pos,slide.selected&&slide.bgvideo)try{slide.bgvideo.play()}catch(e){}slide.$frame[0].style[this.__cssProb]=pos+"px"}move!==!1&&this.controller.changeTo(this.slideList[this.index].position,!1,null,null,!1)},MSSlideController.registerView("mask",MSMaskView)}(jQuery),function(){"use strict";window.MSParallaxMaskView=function(options){MSMaskView.call(this,options),this.$element.removeClass("ms-basic-view").addClass("ms-parallax-mask-view")},MSParallaxMaskView.extend(MSMaskView),MSParallaxMaskView.parallaxAmount=.5;var p=MSParallaxMaskView.prototype,_super=MSBasicView.prototype;p._horizUpdate=function(controller,value){_super._horizUpdate.call(this,controller,value);var i=0;if(this.css3)for(i=0;i<this.slidesCount;++i)this.slideList[i].$element[0].style[window._jcsspfx+"Transform"]="translateX("+(value-this.slideList[i].position)*MSParallaxMaskView.parallaxAmount+"px)"+this.__translate_end;else for(i=0;i<this.slidesCount;++i)this.slideList[i].$element[0].style.left=(value-this.slideList[i].position)*MSParallaxMaskView.parallaxAmount+"px"},p._vertiUpdate=function(controller,value){_super._vertiUpdate.call(this,controller,value);var i=0;if(this.css3)for(i=0;i<this.slidesCount;++i)this.slideList[i].$element[0].style[window._jcsspfx+"Transform"]="translateY("+(value-this.slideList[i].position)*MSParallaxMaskView.parallaxAmount+"px)"+this.__translate_end;else for(i=0;i<this.slidesCount;++i)this.slideList[i].$element[0].style.top=(value-this.slideList[i].position)*MSParallaxMaskView.parallaxAmount+"px"},MSSlideController.registerView("parallaxMask",MSParallaxMaskView)}(jQuery),function(){"use strict";window.MSFadeView=function(options){MSBasicView.call(this,options),this.$element.removeClass("ms-basic-view").addClass("ms-fade-view"),this.controller.renderCallback(this.__update,this)},MSFadeView.extend(MSBasicView);var p=MSFadeView.prototype,_super=MSBasicView.prototype;p.__update=function(controller,value){for(var slide,distance,cont_scroll=-value,i=0;i<this.slidesCount;++i)slide=this.slideList[i],distance=-cont_scroll-slide.position,this.__updateSlides(slide,distance)},p.__updateSlides=function(slide,distance){var value=Math.abs(distance/this[this.__dimension]);0>=1-value?slide.$element.fadeTo(0,0).css("visibility","hidden"):slide.$element.fadeTo(0,1-value).css("visibility","")},p.__locateSlides=function(move,start){this.__updateViewList(),start=this.loop?start||0:this.slides.indexOf(this.viewSlidesList[0])*(this[this.__dimension]+this.spacing);for(var slide,l=this.viewSlidesList.length,i=0;i!==l;i++){var pos=start+i*this[this.__dimension];slide=this.viewSlidesList[i],slide.wakeup(),slide.position=pos}move!==!1&&this.controller.changeTo(this.slideList[this.index].position,!1,null,null,!1)},p.__pushEnd=function(){var first_slide=this.slides.shift(),last_slide=this.slides[this.slidesCount-2];this.slides.push(first_slide),first_slide.position=last_slide.position+this[this.__dimension]},p.__pushStart=function(){var last_slide=this.slides.pop(),first_slide=this.slides[0];this.slides.unshift(last_slide),last_slide.position=first_slide.position-this[this.__dimension]},p.create=function(index){_super.create.call(this,index),this.spacing=0,this.controller.options.minValidDist=10},MSSlideController.registerView("fade",MSFadeView)}(jQuery),function(){"use strict";window.MSScaleView=function(options){MSBasicView.call(this,options),this.$element.removeClass("ms-basic-view").addClass("ms-scale-view"),this.controller.renderCallback(this.__update,this)},MSScaleView.extend(MSFadeView);var p=MSScaleView.prototype,_super=MSFadeView.prototype;p.__updateSlides=function(slide,distance){var value=Math.abs(distance/this[this.__dimension]),element=slide.$element[0];0>=1-value?(element.style.opacity=0,element.style.visibility="hidden",element.style[window._jcsspfx+"Transform"]=""):(element.style.opacity=1-value,element.style.visibility="",element.style[window._jcsspfx+"Transform"]="perspective(2000px) translateZ("+value*(0>distance?-.5:.5)*300+"px)")},p.create=function(index){_super.create.call(this,index),this.controller.options.minValidDist=.03},MSSlideController.registerView("scale",MSScaleView)}(jQuery),function(){"use strict";window.MSStackView=function(options){MSBasicView.call(this,options),this.$element.removeClass("ms-basic-view").addClass("ms-stack-view"),this.controller.renderCallback(this.__update,this),this.autoUpdateZIndex=!0},MSStackView.extend(MSFadeView),MSStackView._3dreq=!0,MSStackView._fallback=MSFadeView;var p=MSStackView.prototype,_super=MSFadeView.prototype;p.__updateSlidesZindex=function(){for(var slide,l=this.viewSlidesList.length,i=0;i!==l;i++)slide=this.viewSlidesList[i],this.viewSlidesList[i].$element.css("z-index",l-i)},p.__updateSlides=function(slide,distance){var value=Math.abs(distance/this[this.__dimension]),element=slide.$element[0];0>=1-value?(element.style.opacity=1,element.style.visibility="hidden",element.style[window._jcsspfx+"Transform"]=""):(element.style.visibility="",element.style[window._jcsspfx+"Transform"]=0>distance?"perspective(2000px) translateZ("+-300*value+"px)":this.__translate+"("+-value*this[this.__dimension]+"px)")},p.create=function(index){_super.create.call(this,index),this.controller.options.minValidDist=.03,this.__translate="h"===this.dir?"translateX":"translateY"},MSSlideController.registerView("stack",MSStackView)}(jQuery),function(){"use strict";var perspective=2e3;window.MSFocusView=function(options){MSWaveView.call(this,options),this.$element.removeClass("ms-wave-view").addClass("ms-focus-view"),this.options.centerSpace=this.options.centerSpace||1},MSFocusView.extend(MSWaveView),MSFocusView._3dreq=!0,MSFocusView._fallback=MSFadeBasicView;{var p=MSFocusView.prototype;MSWaveView.prototype}p.__calcview=function(z,w){var a=w/2*z/(z+perspective);return a*(z+perspective)/perspective},p.__updateSlidesHoriz=function(slide,distance){var value=Math.abs(100*distance/this.__width);value=15*-Math.min(value,100),slide.$element.css(window._csspfx+"transform","translateZ("+(value+1)+"px) rotateY(0.01deg) translateX("+(0>distance?1:-1)*-this.__calcview(value,this.__width)*this.options.centerSpace+"px)")},p.__updateSlidesVertic=function(slide,distance){var value=Math.abs(100*distance/this.__width);value=15*-Math.min(value,100),slide.$element.css(window._csspfx+"transform","translateZ("+(value+1)+"px) rotateY(0.01deg) translateY("+(0>distance?1:-1)*-this.__calcview(value,this.__width)*this.options.centerSpace+"px)")},MSSlideController.registerView("focus",MSFocusView)}(),function(){window.MSPartialWaveView=function(options){MSWaveView.call(this,options),this.$element.removeClass("ms-wave-view").addClass("ms-partial-wave-view")},MSPartialWaveView.extend(MSWaveView),MSPartialWaveView._3dreq=!0,MSPartialWaveView._fallback=MSFadeBasicView;{var p=MSPartialWaveView.prototype;MSWaveView.prototype}p.__updateSlidesHoriz=function(slide,distance){var value=Math.abs(100*distance/this.__width);slide.hasBG&&slide.$bg_img.css("opacity",(100-Math.abs(120*distance/this.__width/3))/100),slide.$element.css(window._csspfx+"transform","translateZ("+3*-value+"px) rotateY(0.01deg) translateX("+.75*distance+"px)")},p.__updateSlidesVertic=function(slide,distance){var value=Math.abs(100*distance/this.__width);slide.hasBG&&slide.$bg_img.css("opacity",(100-Math.abs(120*distance/this.__width/3))/100),slide.$element.css(window._csspfx+"transform","translateZ("+3*-value+"px) rotateY(0.01deg) translateY("+.75*distance+"px)")},MSSlideController.registerView("partialWave",MSPartialWaveView)}(),function(){"use strict";window.MSBoxView=function(options){MSBasicView.call(this,options),this.$element.removeClass("ms-basic-view").addClass("ms-box-view"),this.controller.renderCallback(this.__update,this)},MSBoxView.extend(MSFadeView),MSBoxView._3dreq=!0;var p=MSBoxView.prototype,_super=MSFadeView.prototype;p.__updateSlides=function(slide,distance){var value=Math.abs(distance/this[this.__dimension]),element=slide.$element[0];0>=1-value?(element.style.visibility="hidden",element.style[window._jcsspfx+"Transform"]=""):(element.style.visibility="",element.style[window._jcsspfx+"Transform"]="rotate"+this._rotateDir+"("+value*(0>distance?1:-1)*90*this._calcFactor+"deg)",element.style[window._jcsspfx+"TransformOrigin"]="50% 50% -"+slide[this.__dimension]/2+"px",element.style.zIndex=Math.ceil(2*(1-value)))},p.create=function(index){_super.create.call(this,index),this.controller.options.minValidDist=.03,this._rotateDir="h"===this.options.dir?"Y":"X",this._calcFactor="h"===this.options.dir?1:-1},MSSlideController.registerView("box",MSBoxView)}(jQuery),function($){"use strict";var BaseControl=function(){this.options={prefix:"ms-",autohide:!0,overVideo:!0,customClass:null}},p=BaseControl.prototype;p.slideAction=function(){},p.setup=function(){this.cont=this.options.insertTo?$(this.options.insertTo):this.slider.$controlsCont,this.options.overVideo||this._hideOnvideoStarts()},p.checkHideUnder=function(){this.options.hideUnder&&(this.needsRealign=!this.options.insetTo&&("left"===this.options.align||"right"===this.options.align)&&this.options.inset===!1,$(window).bind("resize",{that:this},this.onResize),this.onResize())},p.onResize=function(event){var that=event&&event.data.that||this,w=window.innerWidth;w<=that.options.hideUnder&&!that.detached?(that.hide(!0),that.detached=!0,that.onDetach()):w>=that.options.hideUnder&&that.detached&&(that.detached=!1,that.visible(),that.onAppend())},p.create=function(){this.options.autohide&&(this.hide(!0),this.slider.$controlsCont.mouseenter($.proxy(this._onMouseEnter,this)).mouseleave($.proxy(this._onMouseLeave,this)).mousedown($.proxy(this._onMouseDown,this)),this.$element&&this.$element.mouseenter($.proxy(this._onMouseEnter,this)).mouseleave($.proxy(this._onMouseLeave,this)).mousedown($.proxy(this._onMouseDown,this)),$(document).mouseup($.proxy(this._onMouseUp,this))),this.options.align&&this.$element.addClass("ms-align-"+this.options.align),this.options.customClass&&this.$element&&this.$element.addClass(this.options.customClass)},p._onMouseEnter=function(){this._disableAH||this.mdown||this.visible(),this.mleave=!1},p._onMouseLeave=function(){this.mdown||this.hide(),this.mleave=!0},p._onMouseDown=function(){this.mdown=!0},p._onMouseUp=function(){this.mdown&&this.mleave&&this.hide(),this.mdown=!1},p.onAppend=function(){this.needsRealign&&this.slider._realignControls()},p.onDetach=function(){this.needsRealign&&this.slider._realignControls()},p._hideOnvideoStarts=function(){var that=this;this.slider.api.addEventListener(MSSliderEvent.VIDEO_PLAY,function(){that._disableAH=!0,that.hide()}),this.slider.api.addEventListener(MSSliderEvent.VIDEO_CLOSE,function(){that._disableAH=!1,that.visible()})},p.hide=function(fast){if(fast)this.$element.css("opacity",0),this.$element.css("display","none");else{clearTimeout(this.hideTo);var $element=this.$element;this.hideTo=setTimeout(function(){CTween.fadeOut($element,400,!1)},20)}this.$element.addClass("ms-ctrl-hide")},p.visible=function(){this.detached||(clearTimeout(this.hideTo),this.$element.css("display",""),CTween.fadeIn(this.$element,400,!1),this.$element.removeClass("ms-ctrl-hide"))},p.destroy=function(){this.options&&this.options.hideUnder&&$(window).unbind("resize",this.onResize)},window.BaseControl=BaseControl}(jQuery),function($){"use strict";var MSArrows=function(options){BaseControl.call(this),$.extend(this.options,options)};MSArrows.extend(BaseControl);var p=MSArrows.prototype,_super=BaseControl.prototype;p.setup=function(){var that=this;this.$next=$("<div></div>").addClass(this.options.prefix+"nav-next").bind("click",function(){that.slider.api.next(!0)}),this.$prev=$("<div></div>").addClass(this.options.prefix+"nav-prev").bind("click",function(){that.slider.api.previous(!0)}),_super.setup.call(this),this.cont.append(this.$next),this.cont.append(this.$prev),this.checkHideUnder()},p.hide=function(fast){return fast?(this.$prev.css("opacity",0).css("display","none"),void this.$next.css("opacity",0).css("display","none")):(CTween.fadeOut(this.$prev,400,!1),CTween.fadeOut(this.$next,400,!1),this.$prev.addClass("ms-ctrl-hide"),void this.$next.addClass("ms-ctrl-hide"))},p.visible=function(){this.detached||(CTween.fadeIn(this.$prev,400),CTween.fadeIn(this.$next,400),this.$prev.removeClass("ms-ctrl-hide").css("display",""),this.$next.removeClass("ms-ctrl-hide").css("display",""))},p.destroy=function(){_super.destroy(),this.$next.remove(),this.$prev.remove()},window.MSArrows=MSArrows,MSSlideController.registerControl("arrows",MSArrows)}(jQuery),function($){"use strict";var MSThumblist=function(options){BaseControl.call(this),this.options.dir="h",this.options.wheel="v"===options.dir,this.options.arrows=!1,this.options.speed=17,this.options.align=null,this.options.inset=!1,this.options.margin=10,this.options.space=10,this.options.width=100,this.options.height=100,this.options.type="thumbs",this.options.hover=!1,$.extend(this.options,options),this.thumbs=[],this.index_count=0,this.__dimen="h"===this.options.dir?"width":"height",this.__alignsize="h"===this.options.dir?"height":"width",this.__jdimen="h"===this.options.dir?"outerWidth":"outerHeight",this.__pos="h"===this.options.dir?"left":"top",this.click_enable=!0};MSThumblist.extend(BaseControl);var p=MSThumblist.prototype,_super=BaseControl.prototype;p.setup=function(){if(this.$element=$("<div></div>").addClass(this.options.prefix+"thumb-list"),"tabs"===this.options.type&&this.$element.addClass(this.options.prefix+"tabs"),this.$element.addClass("ms-dir-"+this.options.dir),_super.setup.call(this),this.$element.appendTo(this.slider.$controlsCont===this.cont?this.slider.$element:this.cont),this.$thumbscont=$("<div></div>").addClass("ms-thumbs-cont").appendTo(this.$element),this.options.arrows){var that=this;this.$fwd=$("<div></div>").addClass("ms-thumblist-fwd").appendTo(this.$element).click(function(){that.controller.push(-15)}),this.$bwd=$("<div></div>").addClass("ms-thumblist-bwd").appendTo(this.$element).click(function(){that.controller.push(15)})}if(!this.options.insetTo&&this.options.align){var align=this.options.align;this.options.inset?this.$element.css(align,this.options.margin):"top"===align?this.$element.detach().prependTo(this.slider.$element).css({"margin-bottom":this.options.margin,position:"relative"}):"bottom"===align?this.$element.css({"margin-top":this.options.margin,position:"relative"}):(this.slider.api.addEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE,this.align,this),this.align()),"v"===this.options.dir?this.$element.width(this.options.width):this.$element.height(this.options.height)}this.checkHideUnder()},p.align=function(){if(!this.detached){var align=this.options.align,pos=this.slider.reserveSpace(align,this.options[this.__alignsize]+2*this.options.margin);this.$element.css(align,-pos-this.options[this.__alignsize]-this.options.margin)}},p.slideAction=function(slide){var thumb_ele=slide.$element.find(".ms-thumb"),that=this,thumb_frame=$("<div></div>").addClass("ms-thumb-frame").append(thumb_ele).append($('<div class="ms-thumb-ol"></div>')).bind(this.options.hover?"hover":"click",function(){that.changeSlide(thumb_frame)});if(this.options.align&&thumb_frame.width(this.options.width-("v"===this.options.dir&&"tabs"===this.options.type?12:0)).height(this.options.height).css("margin-"+("v"===this.options.dir?"bottom":"right"),this.options.space),thumb_frame[0].index=this.index_count++,this.$thumbscont.append(thumb_frame),this.options.fillMode&&thumb_ele.is("img")){var aligner=new window.MSAligner(this.options.fillMode,thumb_frame,thumb_ele);thumb_ele[0].aligner=aligner,thumb_ele.one("load",function(){var $this=$(this);$this[0].aligner.init($this.width(),$this.height()),$this[0].aligner.align()}).each($.jqLoadFix)}$.browser.msie&&thumb_ele.on("dragstart",function(event){event.preventDefault()}),this.thumbs.push(thumb_frame)},p.create=function(){_super.create.call(this),this.__translate_end=window._css3d?" translateZ(0px)":"",this.controller=new Controller(0,0,{snappingMinSpeed:2,friction:(100-.5*this.options.speed)/100}),this.controller.renderCallback("h"===this.options.dir?this._hMove:this._vMove,this);var that=this;this.resize_listener=function(){that.__resize()},$(window).bind("resize",this.resize_listener),this.thumbSize=this.thumbs[0][this.__jdimen](!0),this.setupSwipe(),this.__resize();var that=this;this.options.wheel&&(this.wheellistener=function(event){var e=window.event||event.orginalEvent||event,delta=Math.max(-1,Math.min(1,e.wheelDelta||-e.detail));return that.controller.push(10*-delta),!1},$.browser.mozilla?this.$element[0].addEventListener("DOMMouseScroll",this.wheellistener):this.$element.bind("mousewheel",this.wheellistener)),this.slider.api.addEventListener(MSSliderEvent.CHANGE_START,this.update,this),this.slider.api.addEventListener(MSSliderEvent.HARD_UPDATE,this.realignThumbs,this),this.cindex=this.slider.api.index(),this.select(this.thumbs[this.cindex])},p._hMove=function(controller,value){return this.__contPos=value,window._cssanim?void(this.$thumbscont[0].style[window._jcsspfx+"Transform"]="translateX("+-value+"px)"+this.__translate_end):void(this.$thumbscont[0].style.left=-value+"px")},p._vMove=function(controller,value){return this.__contPos=value,window._cssanim?void(this.$thumbscont[0].style[window._jcsspfx+"Transform"]="translateY("+-value+"px)"+this.__translate_end):void(this.$thumbscont[0].style.top=-value+"px")},p.setupSwipe=function(){this.swipeControl=new averta.TouchSwipe(this.$element),this.swipeControl.swipeType="h"===this.options.dir?"horizontal":"vertical";var that=this;this.swipeControl.onSwipe="h"===this.options.dir?function(status){that.horizSwipeMove(status)}:function(status){that.vertSwipeMove(status)}},p.vertSwipeMove=function(status){if(!this.dTouch){var phase=status.phase;if("start"===phase)this.controller.stop();else if("move"===phase)this.controller.drag(status.moveY);else if("end"===phase||"cancel"===phase){var speed=Math.abs(status.distanceY/status.duration*50/3);speed>.1?this.controller.push(-status.distanceY/status.duration*50/3):(this.click_enable=!0,this.controller.cancel())}}},p.horizSwipeMove=function(status){if(!this.dTouch){var phase=status.phase;if("start"===phase)this.controller.stop(),this.click_enable=!1;else if("move"===phase)this.controller.drag(status.moveX);else if("end"===phase||"cancel"===phase){var speed=Math.abs(status.distanceX/status.duration*50/3);speed>.1?this.controller.push(-status.distanceX/status.duration*50/3):(this.click_enable=!0,this.controller.cancel())}}},p.update=function(){var nindex=this.slider.api.index();this.cindex!==nindex&&(null!=this.cindex&&this.unselect(this.thumbs[this.cindex]),this.cindex=nindex,this.select(this.thumbs[this.cindex]),this.dTouch||this.updateThumbscroll())
},p.realignThumbs=function(){this.$element.find(".ms-thumb").each(function(index,thumb){thumb.aligner&&thumb.aligner.align()})},p.updateThumbscroll=function(){var pos=this.thumbSize*this.cindex;if(0/0==this.controller.value&&(this.controller.value=0),pos-this.controller.value<0)return void this.controller.gotoSnap(this.cindex,!0);if(pos+this.thumbSize-this.controller.value>this.$element[this.__dimen]()){var first_snap=this.cindex-Math.floor(this.$element[this.__dimen]()/this.thumbSize)+1;return void this.controller.gotoSnap(first_snap,!0)}},p.changeSlide=function(thumb){this.click_enable&&this.cindex!==thumb[0].index&&this.slider.api.gotoSlide(thumb[0].index)},p.unselect=function(ele){ele.removeClass("ms-thumb-frame-selected")},p.select=function(ele){ele.addClass("ms-thumb-frame-selected")},p.__resize=function(){var size=this.$element[this.__dimen]();if(this.ls!==size){this.ls=size,this.thumbSize=this.thumbs[0][this.__jdimen](!0);var len=this.slider.api.count()*this.thumbSize;this.$thumbscont[0].style[this.__dimen]=len+"px",size>=len?(this.dTouch=!0,this.controller.stop(),this.$thumbscont[0].style[this.__pos]=.5*(size-len)+"px",this.$thumbscont[0].style[window._jcsspfx+"Transform"]=""):(this.dTouch=!1,this.click_enable=!0,this.$thumbscont[0].style[this.__pos]="",this.controller._max_value=len-size,this.controller.options.snapsize=this.thumbSize,this.updateThumbscroll())}},p.destroy=function(){_super.destroy(),this.options.wheel&&($.browser.mozilla?this.$element[0].removeEventListener("DOMMouseScroll",this.wheellistener):this.$element.unbind("mousewheel",this.wheellistener),this.wheellistener=null),$(window).unbind("resize",this.resize_listener),this.$element.remove(),this.slider.api.removeEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE,this.align,this),this.slider.api.removeEventListener(MSSliderEvent.CHANGE_START,this.update,this)},window.MSThumblist=MSThumblist,MSSlideController.registerControl("thumblist",MSThumblist)}(jQuery),function($){"use strict";var MSBulltes=function(options){BaseControl.call(this),this.options.dir="h",this.options.inset=!0,this.options.margin=10,this.options.space=10,$.extend(this.options,options),this.bullets=[]};MSBulltes.extend(BaseControl);var p=MSBulltes.prototype,_super=BaseControl.prototype;p.setup=function(){if(_super.setup.call(this),this.$element=$("<div></div>").addClass(this.options.prefix+"bullets").addClass("ms-dir-"+this.options.dir).appendTo(this.cont),this.$bullet_cont=$("<div></div>").addClass("ms-bullets-count").appendTo(this.$element),!this.options.insetTo&&this.options.align){var align=this.options.align;this.options.inset&&this.$element.css(align,this.options.margin)}this.checkHideUnder()},p.create=function(){_super.create.call(this);var that=this;this.slider.api.addEventListener(MSSliderEvent.CHANGE_START,this.update,this),this.cindex=this.slider.api.index();for(var i=0;i<this.slider.api.count();++i){var bullet=$("<div></div>").addClass("ms-bullet");bullet[0].index=i,bullet.on("click",function(){that.changeSlide(this.index)}),this.$bullet_cont.append(bullet),this.bullets.push(bullet),"h"===this.options.dir?bullet.css("margin",this.options.space/2):bullet.css("margin",this.options.space)}"h"===this.options.dir?this.$element.width(bullet.outerWidth(!0)*this.slider.api.count()):this.$element.css("margin-top",-this.$element.outerHeight(!0)/2),this.select(this.bullets[this.cindex])},p.update=function(){var nindex=this.slider.api.index();this.cindex!==nindex&&(null!=this.cindex&&this.unselect(this.bullets[this.cindex]),this.cindex=nindex,this.select(this.bullets[this.cindex]))},p.changeSlide=function(index){this.cindex!==index&&this.slider.api.gotoSlide(index)},p.unselect=function(ele){ele.removeClass("ms-bullet-selected")},p.select=function(ele){ele.addClass("ms-bullet-selected")},p.destroy=function(){_super.destroy(),this.slider.api.removeEventListener(MSSliderEvent.CHANGE_START,this.update,this),this.$element.remove()},window.MSBulltes=MSBulltes,MSSlideController.registerControl("bullets",MSBulltes)}(jQuery),function($){"use strict";var MSScrollbar=function(options){BaseControl.call(this),this.options.dir="h",this.options.autohide=!0,this.options.width=4,this.options.color="#3D3D3D",this.options.margin=10,$.extend(this.options,options),this.__dimen="h"===this.options.dir?"width":"height",this.__jdimen="h"===this.options.dir?"outerWidth":"outerHeight",this.__pos="h"===this.options.dir?"left":"top",this.__translate_end=window._css3d?" translateZ(0px)":"",this.__translate_start="h"===this.options.dir?" translateX(":"translateY("};MSScrollbar.extend(BaseControl);var p=MSScrollbar.prototype,_super=BaseControl.prototype;p.setup=function(){if(this.$element=$("<div></div>").addClass(this.options.prefix+"sbar").addClass("ms-dir-"+this.options.dir),_super.setup.call(this),this.$element.appendTo(this.slider.$controlsCont===this.cont?this.slider.$element:this.cont),this.$bar=$("<div></div>").addClass(this.options.prefix+"bar").appendTo(this.$element),this.slider.options.loop&&(this.disable=!0,this.$element.remove()),"v"===this.options.dir?this.$bar.width(this.options.width):this.$bar.height(this.options.width),this.$bar.css("background-color",this.options.color),!this.options.insetTo&&this.options.align){this.$element.css("v"===this.options.dir?{right:"auto",left:"auto"}:{top:"auto",bottom:"auto"});var align=this.options.align;this.options.inset?this.$element.css(align,this.options.margin):"top"===align?this.$element.prependTo(this.slider.$element).css({"margin-bottom":this.options.margin,position:"relative"}):"bottom"===align?this.$element.css({"margin-top":this.options.margin,position:"relative"}):(this.slider.api.addEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE,this.align,this),this.align())}this.checkHideUnder()},p.align=function(){if(!this.detached){var align=this.options.align,pos=this.slider.reserveSpace(align,2*this.options.margin+this.options.width);this.$element.css(align,-pos-this.options.margin-this.options.width)}},p.create=function(){if(!this.disable){this.scroller=this.slider.api.scroller,this.slider.api.view.addEventListener(MSViewEvents.SCROLL,this._update,this),this.slider.api.addEventListener(MSSliderEvent.RESIZE,this._resize,this),this._resize(),this.options.autohide&&this.$bar.css("opacity","0")}},p._resize=function(){this.vdimen=this.$element[this.__dimen](),this.bar_dimen=this.slider.api.view["__"+this.__dimen]*this.vdimen/this.scroller._max_value,this.$bar[this.__dimen](this.bar_dimen)},p._update=function(){var value=this.scroller.value*(this.vdimen-this.bar_dimen)/this.scroller._max_value;if(this.lvalue!==value){if(this.lvalue=value,this.options.autohide){clearTimeout(this.hto),this.$bar.css("opacity","1");var that=this;this.hto=setTimeout(function(){that.$bar.css("opacity","0")},150)}return 0>value?void(this.$bar[0].style[this.__dimen]=this.bar_dimen+value+"px"):(value>this.vdimen-this.bar_dimen&&(this.$bar[0].style[this.__dimen]=this.vdimen-value+"px"),window._cssanim?void(this.$bar[0].style[window._jcsspfx+"Transform"]=this.__translate_start+value+"px)"+this.__translate_end):void(this.$bar[0].style[this.__pos]=value+"px"))}},p.destroy=function(){_super.destroy(),this.slider.api.view.removeEventListener(MSViewEvents.SCROLL,this._update,this),this.slider.api.removeEventListener(MSSliderEvent.RESIZE,this._resize,this),this.slider.api.removeEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE,this.align,this),this.$element.remove()},window.MSScrollbar=MSScrollbar,MSSlideController.registerControl("scrollbar",MSScrollbar)}(jQuery),function($){"use strict";var MSTimerbar=function(options){BaseControl.call(this),this.options.autohide=!1,this.options.width=4,this.options.color="#FFFFFF",this.options.inset=!0,this.options.margin=0,$.extend(this.options,options)};MSTimerbar.extend(BaseControl);var p=MSTimerbar.prototype,_super=BaseControl.prototype;p.setup=function(){if(_super.setup.call(this),this.$element=$("<div></div>").addClass(this.options.prefix+"timerbar"),_super.setup.call(this),this.$element.appendTo(this.slider.$controlsCont===this.cont?this.slider.$element:this.cont),this.$bar=$("<div></div>").addClass("ms-time-bar").appendTo(this.$element),"v"===this.options.dir?(this.$bar.width(this.options.width),this.$element.width(this.options.width)):(this.$bar.height(this.options.width),this.$element.height(this.options.width)),this.$bar.css("background-color",this.options.color),!this.options.insetTo&&this.options.align){this.$element.css({top:"auto",bottom:"auto"});var align=this.options.align;this.options.inset?this.$element.css(align,this.options.margin):"top"===align?this.$element.prependTo(this.slider.$element).css({"margin-bottom":this.options.margin,position:"relative"}):"bottom"===align?this.$element.css({"margin-top":this.options.margin,position:"relative"}):(this.slider.api.addEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE,this.align,this),this.align())}this.checkHideUnder()},p.align=function(){if(!this.detached){var align=this.options.align,pos=this.slider.reserveSpace(align,2*this.options.margin+this.options.width);this.$element.css(align,-pos-this.options.margin-this.options.width)}},p.create=function(){_super.create.call(this),this.slider.api.addEventListener(MSSliderEvent.WAITING,this._update,this),this._update()},p._update=function(){this.$bar[0].style.width=this.slider.api._delayProgress+"%"},p.destroy=function(){_super.destroy(),this.slider.api.removeEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE,this.align,this),this.slider.api.removeEventListener(MSSliderEvent.WAITING,this._update,this),this.$element.remove()},window.MSTimerbar=MSTimerbar,MSSlideController.registerControl("timebar",MSTimerbar)}(jQuery),function($){"use strict";var MSCircleTimer=function(options){BaseControl.call(this),this.options.color="#A2A2A2",this.options.stroke=10,this.options.radius=4,this.options.autohide=!1,$.extend(this.options,options)};MSCircleTimer.extend(BaseControl);var p=MSCircleTimer.prototype,_super=BaseControl.prototype;p.setup=function(){return _super.setup.call(this),this.$element=$("<div></div>").addClass(this.options.prefix+"ctimer").appendTo(this.cont),this.$canvas=$("<canvas></canvas>").addClass("ms-ctimer-canvas").appendTo(this.$element),this.$bar=$("<div></div>").addClass("ms-ctimer-bullet").appendTo(this.$element),this.$canvas[0].getContext?(this.ctx=this.$canvas[0].getContext("2d"),this.prog=0,this.__w=2*(this.options.radius+this.options.stroke/2),this.$canvas[0].width=this.__w,this.$canvas[0].height=this.__w,void this.checkHideUnder()):(this.destroy(),void(this.disable=!0))},p.create=function(){if(!this.disable){_super.create.call(this),this.slider.api.addEventListener(MSSliderEvent.WAITING,this._update,this);var that=this;this.$element.click(function(){that.slider.api.paused?that.slider.api.resume():that.slider.api.pause()}),this._update()}},p._update=function(){var that=this;$(this).stop(!0).animate({prog:.01*this.slider.api._delayProgress},{duration:200,step:function(){that._draw()}})},p._draw=function(){this.ctx.clearRect(0,0,this.__w,this.__w),this.ctx.beginPath(),this.ctx.arc(.5*this.__w,.5*this.__w,this.options.radius,1.5*Math.PI,1.5*Math.PI+2*Math.PI*this.prog,!1),this.ctx.strokeStyle=this.options.color,this.ctx.lineWidth=this.options.stroke,this.ctx.stroke()},p.destroy=function(){_super.destroy(),this.disable||($(this).stop(!0),this.slider.api.removeEventListener(MSSliderEvent.WAITING,this._update,this),this.$element.remove())},window.MSCircleTimer=MSCircleTimer,MSSlideController.registerControl("circletimer",MSCircleTimer)}(jQuery),function($){"use strict";window.MSLightbox=function(options){BaseControl.call(this,options),this.options.autohide=!1,$.extend(this.options,options),this.data_list=[]},MSLightbox.fadeDuratation=400,MSLightbox.extend(BaseControl);var p=MSLightbox.prototype,_super=BaseControl.prototype;p.setup=function(){_super.setup.call(this),this.$element=$("<div></div>").addClass(this.options.prefix+"lightbox-btn").appendTo(this.cont),this.checkHideUnder()},p.slideAction=function(slide){$("<div></div>").addClass(this.options.prefix+"lightbox-btn").appendTo(slide.$element).append($(slide.$element.find(".ms-lightbox")))},p.create=function(){_super.create.call(this)},MSSlideController.registerControl("lightbox",MSLightbox)}(jQuery),function($){"use strict";window.MSSlideInfo=function(options){BaseControl.call(this,options),this.options.autohide=!1,this.options.align=null,this.options.inset=!1,this.options.margin=10,this.options.size=100,this.options.dir="h",$.extend(this.options,options),this.data_list=[]},MSSlideInfo.fadeDuratation=400,MSSlideInfo.extend(BaseControl);var p=MSSlideInfo.prototype,_super=BaseControl.prototype;p.setup=function(){if(this.$element=$("<div></div>").addClass(this.options.prefix+"slide-info").addClass("ms-dir-"+this.options.dir),_super.setup.call(this),this.$element.appendTo(this.slider.$controlsCont===this.cont?this.slider.$element:this.cont),!this.options.insetTo&&this.options.align){var align=this.options.align;this.options.inset?this.$element.css(align,this.options.margin):"top"===align?this.$element.prependTo(this.slider.$element).css({"margin-bottom":this.options.margin,position:"relative"}):"bottom"===align?this.$element.css({"margin-top":this.options.margin,position:"relative"}):(this.slider.api.addEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE,this.align,this),this.align()),"v"===this.options.dir?this.$element.width(this.options.size):this.$element.css("min-height",this.options.size)}this.checkHideUnder()},p.align=function(){if(!this.detached){var align=this.options.align,pos=this.slider.reserveSpace(align,this.options.size+2*this.options.margin);this.$element.css(align,-pos-this.options.size-this.options.margin)}},p.slideAction=function(slide){var info_ele=$(slide.$element.find(".ms-info"));info_ele.detach(),this.data_list[slide.index]=info_ele},p.create=function(){_super.create.call(this),this.slider.api.addEventListener(MSSliderEvent.CHANGE_START,this.update,this),this.cindex=this.slider.api.index(),this.switchEle(this.data_list[this.cindex])},p.update=function(){var nindex=this.slider.api.index();this.switchEle(this.data_list[nindex]),this.cindex=nindex},p.switchEle=function(ele){if(this.current_ele){this.current_ele[0].tween&&this.current_ele[0].tween.stop(!0),this.current_ele[0].tween=CTween.animate(this.current_ele,MSSlideInfo.fadeDuratation,{opacity:0},{complete:function(){this.detach(),this[0].tween=null,ele.css("position","relative")},target:this.current_ele}),ele.css("position","absolute")}this.__show(ele)},p.__show=function(ele){ele.appendTo(this.$element).css("opacity","0"),this.current_ele&&ele.height(Math.max(ele.height(),this.current_ele.height())),clearTimeout(this.tou),this.tou=setTimeout(function(){CTween.fadeIn(ele,MSSlideInfo.fadeDuratation),ele.css("height","")},MSSlideInfo.fadeDuratation),ele[0].tween&&ele[0].tween.stop(!0),this.current_ele=ele},p.destroy=function(){_super.destroy(),clearTimeout(this.tou),this.current_ele&&this.current_ele[0].tween&&this.current_ele[0].tween.stop("true"),this.$element.remove(),this.slider.api.removeEventListener(MSSliderEvent.RESERVED_SPACE_CHANGE,this.align,this),this.slider.api.removeEventListener(MSSliderEvent.CHANGE_START,this.update,this)},MSSlideController.registerControl("slideinfo",MSSlideInfo)}(jQuery),function($){window.MSGallery=function(id,slider){this.id=id,this.slider=slider,this.telement=$("#"+id),this.botcont=$("<div></div>").addClass("ms-gallery-botcont").appendTo(this.telement),this.thumbcont=$("<div></div>").addClass("ms-gal-thumbcont hide-thumbs").appendTo(this.botcont),this.playbtn=$("<div></div>").addClass("ms-gal-playbtn").appendTo(this.botcont),this.thumbtoggle=$("<div></div>").addClass("ms-gal-thumbtoggle").appendTo(this.botcont),slider.control("thumblist",{insertTo:this.thumbcont,autohide:!1,dir:"h"}),slider.control("slidenum",{insertTo:this.botcont,autohide:!1}),slider.control("slideinfo",{insertTo:this.botcont,autohide:!1}),slider.control("timebar",{insertTo:this.botcont,autohide:!1}),slider.control("bullets",{insertTo:this.botcont,autohide:!1})};var p=MSGallery.prototype;p._init=function(){var that=this;this.slider.api.paused||this.playbtn.addClass("btn-pause"),this.playbtn.click(function(){that.slider.api.paused?(that.slider.api.resume(),that.playbtn.addClass("btn-pause")):(that.slider.api.pause(),that.playbtn.removeClass("btn-pause"))}),this.thumbtoggle.click(function(){that.vthumbs?(that.thumbtoggle.removeClass("btn-hide"),that.vthumbs=!1,that.thumbcont.addClass("hide-thumbs")):(that.thumbtoggle.addClass("btn-hide"),that.thumbcont.removeClass("hide-thumbs"),that.vthumbs=!0)})},p.setup=function(){var that=this;$(document).ready(function(){that._init()})}}(jQuery),function($){var getPhotosetURL=function(key,id,count){return"https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key="+key+"&photoset_id="+id+"&per_page="+count+"&extras=url_o,description,date_taken,owner_name,views&format=json&jsoncallback=?"},getUserPublicURL=function(key,id,count){return"https://api.flickr.com/services/rest/?&method=flickr.people.getPublicPhotos&api_key="+key+"&user_id="+id+"&per_page="+count+"&extras=url_o,description,date_taken,owner_name,views&format=json&jsoncallback=?"},getImageSource=function(fid,server,id,secret,size,data){return"_o"===size&&data?data.url_o:"https://farm"+fid+".staticflickr.com/"+server+"/"+id+"_"+secret+size+".jpg"};window.MSFlickrV2=function(slider,options){var _options={count:10,type:"photoset",thumbSize:"q",imgSize:"c"};if(this.slider=slider,this.slider.holdOn(),!options.key)return void this.errMsg("Flickr API Key required. Please add it in settings.");$.extend(_options,options),this.options=_options;var that=this;"photoset"===this.options.type?$.getJSON(getPhotosetURL(this.options.key,this.options.id,this.options.count),function(data){that._photosData(data)}):$.getJSON(getUserPublicURL(this.options.key,this.options.id,this.options.count),function(data){that.options.type="photos",that._photosData(data)}),""!==this.options.imgSize&&"-"!==this.options.imgSize&&(this.options.imgSize="_"+this.options.imgSize),this.options.thumbSize="_"+this.options.thumbSize,this.slideTemplate=this.slider.$element.find(".ms-slide")[0].outerHTML,this.slider.$element.find(".ms-slide").remove()};var p=MSFlickrV2.prototype;p._photosData=function(data){if("fail"===data.stat)return void this.errMsg("Flickr API ERROR#"+data.code+": "+data.message);{var that=this;this.options.author||this.options.desc}$.each(data[this.options.type].photo,function(i,item){var slide_cont=that.slideTemplate.replace(/{{[\w-]+}}/g,function(match){return match=match.replace(/{{|}}/g,""),shortCodes[match]?shortCodes[match](item,that):"{{"+match+"}}"});$(slide_cont).appendTo(that.slider.$element)}),that._initSlider()},p.errMsg=function(msg){this.slider.$element.css("display","block"),this.errEle||(this.errEle=$('<div style="font-family:Arial; color:red; font-size:12px; position:absolute; top:10px; left:10px"></div>').appendTo(this.slider.$loading)),this.errEle.html(msg)},p._initSlider=function(){this.slider.release()};var shortCodes={image:function(data,that){return getImageSource(data.farm,data.server,data.id,data.secret,that.options.imgSize,data)},thumb:function(data,that){return getImageSource(data.farm,data.server,data.id,data.secret,that.options.thumbSize)},title:function(data){return data.title},"owner-name":function(data){return data.ownername},"date-taken":function(data){return data.datetaken},views:function(data){return data.views},description:function(data){return data.description._content}}}(jQuery),function($){window.MSFacebookGallery=function(slider,options){var _options={count:10,type:"photostream",thumbSize:"320",imgSize:"orginal",https:!1,token:""};this.slider=slider,this.slider.holdOn(),$.extend(_options,options),this.options=_options,this.graph="https://graph.facebook.com";var that=this;"photostream"===this.options.type?$.getJSON(this.graph+"/"+this.options.username+"/photos/uploaded/?fields=source,name,link,images,from&limit="+this.options.count+"&access_token="+this.options.token,function(data){that._photosData(data)}):$.getJSON(this.graph+"/"+this.options.albumId+"/photos?fields=source,name,link,images,from&limit="+this.options.count+"&access_token="+this.options.token,function(data){that._photosData(data)}),this.slideTemplate=this.slider.$element.find(".ms-slide")[0].outerHTML,this.slider.$element.find(".ms-slide").remove()};var p=MSFacebookGallery.prototype;p._photosData=function(content){if(content.error)return void this.errMsg("Facebook API ERROR#"+content.error.code+"("+content.error.type+"): "+content.error.message);for(var that=this,i=(this.options.author||this.options.desc,0),l=content.data.length;i!==l;i++){var slide_cont=that.slideTemplate.replace(/{{[\w-]+}}/g,function(match){return match=match.replace(/{{|}}/g,""),shortCodes[match]?shortCodes[match](content.data[i],that):"{{"+match+"}}"});$(slide_cont).appendTo(that.slider.$element)}that._initSlider()},p.errMsg=function(msg){this.slider.$element.css("display","block"),this.errEle||(this.errEle=$('<div style="font-family:Arial; color:red; font-size:12px; position:absolute; top:10px; left:10px"></div>').appendTo(this.slider.$loading)),this.errEle.html(msg)},p._initSlider=function(){this.slider.release()};var getImageSource=function(images,size){if("orginal"===size)return images[0].source;for(var i=0,l=images.length;i!==l;i++)if(-1!==images[i].source.indexOf(size+"x"+size))return images[i].source;return images[0].source},shortCodes={image:function(data,that){return getImageSource(data.images,that.options.imgSize)},thumb:function(data,that){return getImageSource(data.images,that.options.thumbSize)},name:function(data){return data.name},"owner-name":function(data){return data.from.name},link:function(data){return data.link}}}(jQuery),function($){"use strict";window.MSScrollParallax=function(slider,parallax,bgparallax,fade){this.fade=fade,this.slider=slider,this.parallax=parallax/100,this.bgparallax=bgparallax/100,slider.api.addEventListener(MSSliderEvent.INIT,this.init,this),slider.api.addEventListener(MSSliderEvent.DESTROY,this.destory,this),slider.api.addEventListener(MSSliderEvent.CHANGE_END,this.resetLayers,this),slider.api.addEventListener(MSSliderEvent.CHANGE_START,this.updateCurrentSlide,this)},window.MSScrollParallax.setup=function(slider,parallax,bgparallax,fade){return window._mobile?void 0:(null==parallax&&(parallax=50),null==bgparallax&&(bgparallax=40),new MSScrollParallax(slider,parallax,bgparallax,fade))};var p=window.MSScrollParallax.prototype;p.init=function(){this.slider.$element.addClass("ms-scroll-parallax"),this.sliderOffset=this.slider.$element.offset().top,this.updateCurrentSlide();for(var slide,slides=this.slider.api.view.slideList,i=0,l=slides.length;i!==l;i++)slide=slides[i],slide.hasLayers&&(slide.layerController.$layers.wrap('<div class="ms-scroll-parallax-cont"></div>'),slide.$scrollParallaxCont=slide.layerController.$layers.parent());$(window).on("scroll",{that:this},this.moveParallax).trigger("scroll")},p.resetLayers=function(){if(this.lastSlide){var layers=this.lastSlide.$scrollParallaxCont;window._css2d?(layers&&(layers[0].style[window._jcsspfx+"Transform"]=""),this.lastSlide.hasBG&&(this.lastSlide.$imgcont[0].style[window._jcsspfx+"Transform"]="")):(layers&&(layers[0].style.top=""),this.lastSlide.hasBG&&(this.lastSlide.$imgcont[0].style.top="0px"))}},p.updateCurrentSlide=function(){this.lastSlide=this.currentSlide,this.currentSlide=this.slider.api.currentSlide,this.moveParallax({data:{that:this}})},p.moveParallax=function(e){var that=e.data.that,slider=that.slider,offset=that.sliderOffset,scrollTop=$(window).scrollTop(),layers=that.currentSlide.$scrollParallaxCont,out=offset-scrollTop;0>=out?(layers&&(window._css3d?layers[0].style[window._jcsspfx+"Transform"]="translateY("+-out*that.parallax+"px) translateZ(0.4px)":window._css2d?layers[0].style[window._jcsspfx+"Transform"]="translateY("+-out*that.parallax+"px)":layers[0].style.top=-out*that.parallax+"px"),that.updateSlidesBG(-out*that.bgparallax+"px",!0),layers&&that.fade&&layers.css("opacity",1-Math.min(1,-out/slider.api.height))):(layers&&(window._css2d?layers[0].style[window._jcsspfx+"Transform"]="":layers[0].style.top=""),that.updateSlidesBG("0px",!1),layers&&that.fade&&layers.css("opacity",1))},p.updateSlidesBG=function(pos,fixed){for(var slides=this.slider.api.view.slideList,position=!fixed||$.browser.msie||$.browser.opera?"":"fixed",i=0,l=slides.length;i!==l;i++)slides[i].hasBG&&(slides[i].$imgcont[0].style.position=position,slides[i].$imgcont[0].style.top=pos),slides[i].$bgvideocont&&(slides[i].$bgvideocont[0].style.position=position,slides[i].$bgvideocont[0].style.top=pos)},p.destory=function(){slider.api.removeEventListener(MSSliderEvent.INIT,this.init,this),slider.api.removeEventListener(MSSliderEvent.DESTROY,this.destory,this),slider.api.removeEventListener(MSSliderEvent.CHANGE_END,this.resetLayers,this),slider.api.removeEventListener(MSSliderEvent.CHANGE_START,this.updateCurrentSlide,this),$(window).off("scroll",this.moveParallax)}}(jQuery),function($,document,window){var PId=0;if(window.MasterSlider){var KeyboardNav=function(slider){this.slider=slider,this.PId=PId++,this.slider.options.keyboard&&slider.api.addEventListener(MSSliderEvent.INIT,this.init,this)};KeyboardNav.name="MSKeyboardNav";var p=KeyboardNav.prototype;p.init=function(){var api=this.slider.api;$(document).on("keydown.kbnav"+this.PId,function(event){var which=event.which;37===which||40===which?api.previous(!0):(38===which||39===which)&&api.next(!0)})},p.destroy=function(){$(document).off("keydown.kbnav"+this.PId),this.slider.api.removeEventListener(MSSliderEvent.INIT,this.init,this)},MasterSlider.registerPlugin(KeyboardNav)}}(jQuery,document,window),function($,document,window){var PId=0,$window=$(window),$doc=$(document);if(window.MasterSlider){var StartOnAppear=function(slider){this.PId=PId++,this.slider=slider,this.$slider=slider.$element,this.slider.options.startOnAppear&&(slider.holdOn(),$doc.ready($.proxy(this.init,this)))};StartOnAppear.name="MSStartOnAppear";var p=StartOnAppear.prototype;p.init=function(){this.slider.api;$window.on("scroll.soa"+this.PId,$.proxy(this._onScroll,this)).trigger("scroll")},p._onScroll=function(){var vpBottom=$window.scrollTop()+$window.height(),top=this.$slider.offset().top;vpBottom>top&&($window.off("scroll.soa"+this.PId),this.slider.release())},p.destroy=function(){},MasterSlider.registerPlugin(StartOnAppear)}}(jQuery,document,window),function(document,window){var filterUnits={"hue-rotate":"deg",blur:"px"},initialValues={opacity:1,contrast:1,brightness:1,saturate:1,"hue-rotate":0,invert:0,sepia:0,blur:0,grayscale:0};if(window.MasterSlider){var Filters=function(slider){this.slider=slider,this.slider.options.filters&&slider.api.addEventListener(MSSliderEvent.INIT,this.init,this)};Filters.name="MSFilters";var p=Filters.prototype;p.init=function(){var api=this.slider.api,view=api.view;this.filters=this.slider.options.filters,this.slideList=view.slideList,this.slidesCount=view.slidesCount,this.dimension=view[view.__dimension],this.target="slide"===this.slider.options.filterTarget?"$element":"$bg_img",this.filterName=$.browser.webkit?"WebkitFilter":"filter";var superFun=view.controller.__renderHook.fun,superRef=view.controller.__renderHook.ref;view.controller.renderCallback(function(controller,value){superFun.call(superRef,controller,value),this.applyEffect(value)},this),this.applyEffect(view.controller.value)},p.applyEffect=function(value){for(var factor,slide,i=0;i<this.slidesCount;++i)slide=this.slideList[i],factor=Math.min(1,Math.abs(value-slide.position)/this.dimension),slide[this.target]&&($.browser.msie?null!=this.filters.opacity&&slide[this.target].opacity(1-this.filters.opacity*factor):slide[this.target][0].style[this.filterName]=this.generateStyle(factor))},p.generateStyle=function(factor){var unit,style="";for(var filter in this.filters)unit=filterUnits[filter]||"",style+=filter+"("+(initialValues[filter]+(this.filters[filter]-initialValues[filter])*factor)+") ";return style},p.destroy=function(){this.slider.api.removeEventListener(MSSliderEvent.INIT,this.init,this)},MasterSlider.registerPlugin(Filters)}}(document,window,jQuery),function($,document,window){if(window.MasterSlider){var ScrollToAction=function(slider){this.slider=slider,slider.api.addEventListener(MSSliderEvent.INIT,this.init,this)};ScrollToAction.name="MSScrollToAction";var p=ScrollToAction.prototype;p.init=function(){var api=this.slider.api;api.scrollToEnd=_scrollToEnd,api.scrollTo=_scrollTo},p.destroy=function(){};var _scrollTo=function(target,duration){var target=(this.slider.$element,$(target).eq(0));0!==target.length&&(null==duration&&(duration=1.4),$("html, body").animate({scrollTop:target.offset().top},1e3*duration,"easeInOutQuad"))},_scrollToEnd=function(duration){var sliderEle=this.slider.$element;null==duration&&(duration=1.4),$("html, body").animate({scrollTop:sliderEle.offset().top+sliderEle.outerHeight(!1)},1e3*duration,"easeInOutQuad")};MasterSlider.registerPlugin(ScrollToAction)}}(jQuery,document,window);
//# sourceMappingURL=masterslider.min.js.map
var slider = new MasterSlider();
     
slider.control('arrows');  
slider.control('circletimer' , {color:"#FFFFFF" , stroke:9});
slider.control('thumblist' , {autohide:false ,dir:'v',type:'tabs', align:'right', arrows: true, margin:-12, space:0, width:229, height:100, hideUnder:550});
 
slider.setup('masterslider' , {
    width:941,
    height:430,
    space:0,
    view:'wave'
});
     
