"use strict";function AngularFire(t,e,i,n){this._q=t,this._parse=e,this._timeout=i,this._initial=!0,this._remoteValue=!1,this._fRef="string"==typeof n?new Firebase(n):n}angular.module("firebase",[]).value("Firebase",Firebase),angular.module("firebase").factory("angularFire",["$q","$parse","$timeout",function(t,e,i){return function(n,s,o,a){var r=new AngularFire(t,e,i,n);return r.associate(s,o,a)}}]),AngularFire.prototype={associate:function(t,e,i){var n=this;void 0==i&&(i=[]);var s=this._q.defer(),o=s.promise;return this._fRef.on("value",function(o){var a=!1;if(s&&(a=s,s=!1),n._remoteValue=i,o&&void 0!=o.val()){var r=o.val();if(typeof r!=typeof i)return n._log("Error: type mismatch"),void 0;var h=Object.prototype.toString;if(h.call(i)!=h.call(r))return n._log("Error: type mismatch"),void 0;if(n._remoteValue=angular.copy(r),angular.equals(r,n._parse(e)(t)))return}n._timeout(function(){n._resolve(t,e,a,n._remoteValue)})}),o},disassociate:function(){var t=this;t._unregister&&t._unregister(),this._fRef.off("value")},_resolve:function(t,e,i,n){var s=this;this._parse(e).assign(t,angular.copy(n)),this._remoteValue=angular.copy(n),i&&(i.resolve(function(){s.disassociate()}),this._watch(t,e))},_watch:function(t,e){var i=this;i._unregister=t.$watch(e,function(){if(i._initial)return i._initial=!1,void 0;var n=JSON.parse(angular.toJson(i._parse(e)(t)));angular.equals(n,i._remoteValue)||i._fRef.ref().set(n)},!0),t.$on("$destroy",function(){i.disassociate()})},_log:function(t){console&&console.log&&console.log(t)}},angular.module("firebase").factory("angularFireCollection",["$timeout",function(t){return function(e,i){function n(t,e){this.$ref=t.ref(),this.$id=t.name(),this.$index=e,angular.extend(this,{priority:t.getPriority()},t.val())}function s(t){return t?u[t]+1:0}function o(t,e){u[e.$id]=t,d.splice(t,0,e)}function a(t){var e=u[t];d.splice(e,1),u[t]=void 0}function r(t,e){d[t]=e}function h(t,e,i){d.splice(t,1),d.splice(e,0,i),l(t,e)}function l(t,e){var i=d.length;e=e||i,e>i&&(e=i);for(var n=t;e>n;n++){var s=d[n];s.$index=u[s.$id]=n}}var c,u={},d=[];return c="string"==typeof e?new Firebase(e):e,i&&"function"==typeof i&&c.once("value",i),c.on("child_added",function(e,i){t(function(){var t=s(i);o(t,new n(e,t)),l(t)})}),c.on("child_removed",function(e){t(function(){var t=e.name(),i=u[t];a(t),l(i)})}),c.on("child_changed",function(e,i){t(function(){var t=u[e.name()],o=s(i),a=new n(e,t);r(t,a),o!==t&&h(t,o,a)})}),c.on("child_moved",function(e,i){t(function(){var t=u[e.name()],n=s(i),o=d[t];h(t,n,o)})}),d.getByName=function(t){return d[u[t]]},d.add=function(t,e){var i;return i=e?c.ref().push(t,e):c.ref().push(t)},d.remove=function(t,e){var i=angular.isString(t)?d[u[t]]:t;e?i.$ref.remove(e):i.$ref.remove()},d.update=function(t,e){var i=angular.isString(t)?d[u[t]]:t,n={};angular.forEach(i,function(t,e){0!==e.indexOf("$")&&(n[e]=t)}),e?i.$ref.set(n,e):i.$ref.set(n)},d}}]),angular.module("firebase").factory("angularFireAuth",["$rootScope","$parse","$timeout","$location","$route",function(t,e,i,n,s){function o(t){var e=t.split(".");if(!e instanceof Array||3!==e.length)throw Error("Invalid JWT");var i=e[1];return JSON.parse(decodeURIComponent(escape(window.atob(i))))}function a(t,n,s,o){n&&i(function(){e(n).assign(t,s),o()})}function r(t,e,i){t.authRequired&&!i._authenticated&&(i._redirectTo=void 0===t.pathTo?n.path():t.pathTo===e?"/":t.pathTo,n.replace(),n.path(e))}return{initialize:function(e,i){var n=this;if(i=i||{},this._scope=t,i.scope&&(this._scope=i.scope),i.name&&(this._name=i.name),this._cb=function(){},i.callback&&"function"==typeof i.callback&&(this._cb=i.callback),this._redirectTo=null,this._authenticated=!1,i.path&&(s.current&&r(s.current,i.path,n),t.$on("$routeChangeStart",function(t,e){r(e,i.path,n)})),this._ref=new Firebase(e),i.simple&&i.simple===!1)return a(this._scope,this._name,null),void 0;if(!window.FirebaseSimpleLogin){var o=Error("FirebaseSimpleLogin undefined, did you include firebase-simple-login.js?");return t.$broadcast("angularFireAuth:error",o),void 0}var h=new FirebaseSimpleLogin(this._ref,function(e,i){n._cb(e,i),e?t.$broadcast("angularFireAuth:error",e):i?n._loggedIn(i):n._loggedOut()});this._authClient=h},login:function(e,i){switch(e){case"github":case"persona":case"twitter":case"facebook":case"password":if(this._authClient)this._authClient.login(e,i);else{var n=Error("Simple Login not initialized");t.$broadcast("angularFireAuth:error",n)}break;default:var s,a=this;try{s=o(e),this._ref.auth(e,function(e){e?t.$broadcast("angularFireAuth:error",e):a._loggedIn(s)})}catch(r){t.$broadcast("angularFireAuth:error",r)}}},logout:function(){this._authClient?this._authClient.logout():(this._ref.unauth(),this._loggedOut())},_loggedIn:function(e){var i=this;this._authenticated=!0,a(this._scope,this._name,e,function(){t.$broadcast("angularFireAuth:login",e),i._redirectTo&&(n.replace(),n.path(i._redirectTo),i._redirectTo=null)})},_loggedOut:function(){this._authenticated=!1,a(this._scope,this._name,null,function(){t.$broadcast("angularFireAuth:logout")})}}}]),!function(t){var e=function(e,i){this.options=t.extend({},t.fn.affix.defaults,i),this.$window=t(window).on("scroll.affix.data-api",t.proxy(this.checkPosition,this)).on("click.affix.data-api",t.proxy(function(){setTimeout(t.proxy(this.checkPosition,this),1)},this)),this.$element=t(e),this.checkPosition()};e.prototype.checkPosition=function(){if(this.$element.is(":visible")){var e,i=t(document).height(),n=this.$window.scrollTop(),s=this.$element.offset(),o=this.options.offset,a=o.bottom,r=o.top,h="affix affix-top affix-bottom";"object"!=typeof o&&(a=r=o),"function"==typeof r&&(r=o.top()),"function"==typeof a&&(a=o.bottom()),e=null!=this.unpin&&n+this.unpin<=s.top?!1:null!=a&&s.top+this.$element.height()>=i-a?"bottom":null!=r&&r>=n?"top":!1,this.affixed!==e&&(this.affixed=e,this.unpin="bottom"==e?s.top-n:null,this.$element.removeClass(h).addClass("affix"+(e?"-"+e:"")))}},t.fn.affix=function(i){return this.each(function(){var n=t(this),s=n.data("affix"),o="object"==typeof i&&i;s||n.data("affix",s=new e(this,o)),"string"==typeof i&&s[i]()})},t.fn.affix.Constructor=e,t.fn.affix.defaults={offset:0},t(window).on("load",function(){t('[data-spy="affix"]').each(function(){var e=t(this),i=e.data();i.offset=i.offset||{},i.offsetBottom&&(i.offset.bottom=i.offsetBottom),i.offsetTop&&(i.offset.top=i.offsetTop),e.affix(i)})})}(window.jQuery),!function(t){var e='[data-dismiss="alert"]',i=function(i){t(i).on("click",e,this.close)};i.prototype.close=function(e){function i(){n.trigger("closed").remove()}var n,s=t(this),o=s.attr("data-target");o||(o=s.attr("href"),o=o&&o.replace(/.*(?=#[^\s]*$)/,"")),n=t(o),e&&e.preventDefault(),n.length||(n=s.hasClass("alert")?s:s.parent()),n.trigger(e=t.Event("close")),e.isDefaultPrevented()||(n.removeClass("in"),t.support.transition&&n.hasClass("fade")?n.on(t.support.transition.end,i):i())},t.fn.alert=function(e){return this.each(function(){var n=t(this),s=n.data("alert");s||n.data("alert",s=new i(this)),"string"==typeof e&&s[e].call(n)})},t.fn.alert.Constructor=i,t(document).on("click.alert.data-api",e,i.prototype.close)}(window.jQuery),!function(t){var e=function(e,i){this.$element=t(e),this.options=t.extend({},t.fn.button.defaults,i)};e.prototype.setState=function(t){var e="disabled",i=this.$element,n=i.data(),s=i.is("input")?"val":"html";t+="Text",n.resetText||i.data("resetText",i[s]()),i[s](n[t]||this.options[t]),setTimeout(function(){"loadingText"==t?i.addClass(e).attr(e,e):i.removeClass(e).removeAttr(e)},0)},e.prototype.toggle=function(){var t=this.$element.closest('[data-toggle="buttons-radio"]');t&&t.find(".active").removeClass("active"),this.$element.toggleClass("active")},t.fn.button=function(i){return this.each(function(){var n=t(this),s=n.data("button"),o="object"==typeof i&&i;s||n.data("button",s=new e(this,o)),"toggle"==i?s.toggle():i&&s.setState(i)})},t.fn.button.defaults={loadingText:"loading..."},t.fn.button.Constructor=e,t(document).on("click.button.data-api","[data-toggle^=button]",function(e){var i=t(e.target);i.hasClass("btn")||(i=i.closest(".btn")),i.button("toggle")})}(window.jQuery),!function(t){var e=function(e,i){this.$element=t(e),this.options=i,this.options.slide&&this.slide(this.options.slide),"hover"==this.options.pause&&this.$element.on("mouseenter",t.proxy(this.pause,this)).on("mouseleave",t.proxy(this.cycle,this))};e.prototype={cycle:function(e){return e||(this.paused=!1),this.options.interval&&!this.paused&&(this.interval=setInterval(t.proxy(this.next,this),this.options.interval)),this},to:function(e){var i=this.$element.find(".item.active"),n=i.parent().children(),s=n.index(i),o=this;if(!(e>n.length-1||0>e))return this.sliding?this.$element.one("slid",function(){o.to(e)}):s==e?this.pause().cycle():this.slide(e>s?"next":"prev",t(n[e]))},pause:function(e){return e||(this.paused=!0),this.$element.find(".next, .prev").length&&t.support.transition.end&&(this.$element.trigger(t.support.transition.end),this.cycle()),clearInterval(this.interval),this.interval=null,this},next:function(){return this.sliding?void 0:this.slide("next")},prev:function(){return this.sliding?void 0:this.slide("prev")},slide:function(e,i){var n,s=this.$element.find(".item.active"),o=i||s[e](),a=this.interval,r="next"==e?"left":"right",h="next"==e?"first":"last",l=this;if(this.sliding=!0,a&&this.pause(),o=o.length?o:this.$element.find(".item")[h](),n=t.Event("slide",{relatedTarget:o[0]}),!o.hasClass("active")){if(t.support.transition&&this.$element.hasClass("slide")){if(this.$element.trigger(n),n.isDefaultPrevented())return;o.addClass(e),o[0].offsetWidth,s.addClass(r),o.addClass(r),this.$element.one(t.support.transition.end,function(){o.removeClass([e,r].join(" ")).addClass("active"),s.removeClass(["active",r].join(" ")),l.sliding=!1,setTimeout(function(){l.$element.trigger("slid")},0)})}else{if(this.$element.trigger(n),n.isDefaultPrevented())return;s.removeClass("active"),o.addClass("active"),this.sliding=!1,this.$element.trigger("slid")}return a&&this.cycle(),this}}},t.fn.carousel=function(i){return this.each(function(){var n=t(this),s=n.data("carousel"),o=t.extend({},t.fn.carousel.defaults,"object"==typeof i&&i),a="string"==typeof i?i:o.slide;s||n.data("carousel",s=new e(this,o)),"number"==typeof i?s.to(i):a?s[a]():o.interval&&s.cycle()})},t.fn.carousel.defaults={interval:5e3,pause:"hover"},t.fn.carousel.Constructor=e,t(document).on("click.carousel.data-api","[data-slide]",function(e){var i,n=t(this),s=t(n.attr("data-target")||(i=n.attr("href"))&&i.replace(/.*(?=#[^\s]+$)/,"")),o=t.extend({},s.data(),n.data());s.carousel(o),e.preventDefault()})}(window.jQuery),!function(t){var e=function(e,i){this.$element=t(e),this.options=t.extend({},t.fn.collapse.defaults,i),this.options.parent&&(this.$parent=t(this.options.parent)),this.options.toggle&&this.toggle()};e.prototype={constructor:e,dimension:function(){var t=this.$element.hasClass("width");return t?"width":"height"},show:function(){var e,i,n,s;if(!this.transitioning){if(e=this.dimension(),i=t.camelCase(["scroll",e].join("-")),n=this.$parent&&this.$parent.find("> .accordion-group > .in"),n&&n.length){if(s=n.data("collapse"),s&&s.transitioning)return;n.collapse("hide"),s||n.data("collapse",null)}this.$element[e](0),this.transition("addClass",t.Event("show"),"shown"),t.support.transition&&this.$element[e](this.$element[0][i])}},hide:function(){var e;this.transitioning||(e=this.dimension(),this.reset(this.$element[e]()),this.transition("removeClass",t.Event("hide"),"hidden"),this.$element[e](0))},reset:function(t){var e=this.dimension();return this.$element.removeClass("collapse")[e](t||"auto")[0].offsetWidth,this.$element[null!==t?"addClass":"removeClass"]("collapse"),this},transition:function(e,i,n){var s=this,o=function(){"show"==i.type&&s.reset(),s.transitioning=0,s.$element.trigger(n)};this.$element.trigger(i),i.isDefaultPrevented()||(this.transitioning=1,this.$element[e]("in"),t.support.transition&&this.$element.hasClass("collapse")?this.$element.one(t.support.transition.end,o):o())},toggle:function(){this[this.$element.hasClass("in")?"hide":"show"]()}},t.fn.collapse=function(i){return this.each(function(){var n=t(this),s=n.data("collapse"),o="object"==typeof i&&i;s||n.data("collapse",s=new e(this,o)),"string"==typeof i&&s[i]()})},t.fn.collapse.defaults={toggle:!0},t.fn.collapse.Constructor=e,t(document).on("click.collapse.data-api","[data-toggle=collapse]",function(e){var i,n=t(this),s=n.attr("data-target")||e.preventDefault()||(i=n.attr("href"))&&i.replace(/.*(?=#[^\s]+$)/,""),o=t(s).data("collapse")?"toggle":n.data();n[t(s).hasClass("in")?"addClass":"removeClass"]("collapsed"),t(s).collapse(o)})}(window.jQuery),!function(t){function e(){t(n).each(function(){i(t(this)).removeClass("open")})}function i(e){var i,n=e.attr("data-target");return n||(n=e.attr("href"),n=n&&/#/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,"")),i=t(n),i.length||(i=e.parent()),i}var n="[data-toggle=dropdown]",s=function(e){var i=t(e).on("click.dropdown.data-api",this.toggle);t("html").on("click.dropdown.data-api",function(){i.parent().removeClass("open")})};s.prototype={constructor:s,toggle:function(){var n,s,o=t(this);if(!o.is(".disabled, :disabled"))return n=i(o),s=n.hasClass("open"),e(),s||(n.toggleClass("open"),o.focus()),!1},keydown:function(e){var n,s,o,a,r;if(/(38|40|27)/.test(e.keyCode)&&(n=t(this),e.preventDefault(),e.stopPropagation(),!n.is(".disabled, :disabled"))){if(o=i(n),a=o.hasClass("open"),!a||a&&27==e.keyCode)return n.click();s=t("[role=menu] li:not(.divider) a",o),s.length&&(r=s.index(s.filter(":focus")),38==e.keyCode&&r>0&&r--,40==e.keyCode&&s.length-1>r&&r++,~r||(r=0),s.eq(r).focus())}}},t.fn.dropdown=function(e){return this.each(function(){var i=t(this),n=i.data("dropdown");n||i.data("dropdown",n=new s(this)),"string"==typeof e&&n[e].call(i)})},t.fn.dropdown.Constructor=s,t(document).on("click.dropdown.data-api touchstart.dropdown.data-api",e).on("click.dropdown touchstart.dropdown.data-api",".dropdown form",function(t){t.stopPropagation()}).on("click.dropdown.data-api touchstart.dropdown.data-api",n,s.prototype.toggle).on("keydown.dropdown.data-api touchstart.dropdown.data-api",n+", [role=menu]",s.prototype.keydown)}(window.jQuery),!function(t){var e=function(e,i){this.options=i,this.$element=t(e).delegate('[data-dismiss="modal"]',"click.dismiss.modal",t.proxy(this.hide,this)),this.options.remote&&this.$element.find(".modal-body").load(this.options.remote)};e.prototype={constructor:e,toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var e=this,i=t.Event("show");this.$element.trigger(i),this.isShown||i.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.backdrop(function(){var i=t.support.transition&&e.$element.hasClass("fade");e.$element.parent().length||e.$element.appendTo(document.body),e.$element.show(),i&&e.$element[0].offsetWidth,e.$element.addClass("in").attr("aria-hidden",!1),e.enforceFocus(),i?e.$element.one(t.support.transition.end,function(){e.$element.focus().trigger("shown")}):e.$element.focus().trigger("shown")}))},hide:function(e){e&&e.preventDefault(),e=t.Event("hide"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.escape(),t(document).off("focusin.modal"),this.$element.removeClass("in").attr("aria-hidden",!0),t.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal())},enforceFocus:function(){var e=this;t(document).on("focusin.modal",function(t){e.$element[0]===t.target||e.$element.has(t.target).length||e.$element.focus()})},escape:function(){var t=this;this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.modal",function(e){27==e.which&&t.hide()}):this.isShown||this.$element.off("keyup.dismiss.modal")},hideWithTransition:function(){var e=this,i=setTimeout(function(){e.$element.off(t.support.transition.end),e.hideModal()},500);this.$element.one(t.support.transition.end,function(){clearTimeout(i),e.hideModal()})},hideModal:function(){this.$element.hide().trigger("hidden"),this.backdrop()},removeBackdrop:function(){this.$backdrop.remove(),this.$backdrop=null},backdrop:function(e){var i=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var n=t.support.transition&&i;this.$backdrop=t('<div class="modal-backdrop '+i+'" />').appendTo(document.body),this.$backdrop.click("static"==this.options.backdrop?t.proxy(this.$element[0].focus,this.$element[0]):t.proxy(this.hide,this)),n&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),n?this.$backdrop.one(t.support.transition.end,e):e()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),t.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(t.support.transition.end,t.proxy(this.removeBackdrop,this)):this.removeBackdrop()):e&&e()}},t.fn.modal=function(i){return this.each(function(){var n=t(this),s=n.data("modal"),o=t.extend({},t.fn.modal.defaults,n.data(),"object"==typeof i&&i);s||n.data("modal",s=new e(this,o)),"string"==typeof i?s[i]():o.show&&s.show()})},t.fn.modal.defaults={backdrop:!0,keyboard:!0,show:!0},t.fn.modal.Constructor=e,t(document).on("click.modal.data-api",'[data-toggle="modal"]',function(e){var i=t(this),n=i.attr("href"),s=t(i.attr("data-target")||n&&n.replace(/.*(?=#[^\s]+$)/,"")),o=s.data("modal")?"toggle":t.extend({remote:!/#/.test(n)&&n},s.data(),i.data());e.preventDefault(),s.modal(o).one("hide",function(){i.focus()})})}(window.jQuery),!function(t){function e(e,i){var n,s=t.proxy(this.process,this),o=t(e).is("body")?t(window):t(e);this.options=t.extend({},t.fn.scrollspy.defaults,i),this.$scrollElement=o.on("scroll.scroll-spy.data-api",s),this.selector=(this.options.target||(n=t(e).attr("href"))&&n.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.$body=t("body"),this.refresh(),this.process()}e.prototype={constructor:e,refresh:function(){var e,i=this;this.offsets=t([]),this.targets=t([]),e=this.$body.find(this.selector).map(function(){var e=t(this),i=e.data("target")||e.attr("href"),n=/^#\w/.test(i)&&t(i);return n&&n.length&&[[n.position().top,i]]||null}).sort(function(t,e){return t[0]-e[0]}).each(function(){i.offsets.push(this[0]),i.targets.push(this[1])})},process:function(){var t,e=this.$scrollElement.scrollTop()+this.options.offset,i=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,n=i-this.$scrollElement.height(),s=this.offsets,o=this.targets,a=this.activeTarget;if(e>=n)return a!=(t=o.last()[0])&&this.activate(t);for(t=s.length;t--;)a!=o[t]&&e>=s[t]&&(!s[t+1]||s[t+1]>=e)&&this.activate(o[t])},activate:function(e){var i,n;this.activeTarget=e,t(this.selector).parent(".active").removeClass("active"),n=this.selector+'[data-target="'+e+'"],'+this.selector+'[href="'+e+'"]',i=t(n).parent("li").addClass("active"),i.parent(".dropdown-menu").length&&(i=i.closest("li.dropdown").addClass("active")),i.trigger("activate")}},t.fn.scrollspy=function(i){return this.each(function(){var n=t(this),s=n.data("scrollspy"),o="object"==typeof i&&i;s||n.data("scrollspy",s=new e(this,o)),"string"==typeof i&&s[i]()})},t.fn.scrollspy.Constructor=e,t.fn.scrollspy.defaults={offset:10},t(window).on("load",function(){t('[data-spy="scroll"]').each(function(){var e=t(this);e.scrollspy(e.data())})})}(window.jQuery),!function(t){var e=function(e){this.element=t(e)};e.prototype={constructor:e,show:function(){var e,i,n,s=this.element,o=s.closest("ul:not(.dropdown-menu)"),a=s.attr("data-target");a||(a=s.attr("href"),a=a&&a.replace(/.*(?=#[^\s]*$)/,"")),s.parent("li").hasClass("active")||(e=o.find(".active:last a")[0],n=t.Event("show",{relatedTarget:e}),s.trigger(n),n.isDefaultPrevented()||(i=t(a),this.activate(s.parent("li"),o),this.activate(i,i.parent(),function(){s.trigger({type:"shown",relatedTarget:e})})))},activate:function(e,i,n){function s(){o.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),e.addClass("active"),a?(e[0].offsetWidth,e.addClass("in")):e.removeClass("fade"),e.parent(".dropdown-menu")&&e.closest("li.dropdown").addClass("active"),n&&n()}var o=i.find("> .active"),a=n&&t.support.transition&&o.hasClass("fade");a?o.one(t.support.transition.end,s):s(),o.removeClass("in")}},t.fn.tab=function(i){return this.each(function(){var n=t(this),s=n.data("tab");s||n.data("tab",s=new e(this)),"string"==typeof i&&s[i]()})},t.fn.tab.Constructor=e,t(document).on("click.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(e){e.preventDefault(),t(this).tab("show")})}(window.jQuery),!function(t){t(function(){t.support.transition=function(){var t=function(){var t,e=document.createElement("bootstrap"),i={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(t in i)if(void 0!==e.style[t])return i[t]}();return t&&{end:t}}()})}(window.jQuery),!function(t){var e=function(e,i){this.$element=t(e),this.options=t.extend({},t.fn.typeahead.defaults,i),this.matcher=this.options.matcher||this.matcher,this.sorter=this.options.sorter||this.sorter,this.highlighter=this.options.highlighter||this.highlighter,this.updater=this.options.updater||this.updater,this.$menu=t(this.options.menu).appendTo("body"),this.source=this.options.source,this.shown=!1,this.listen()};e.prototype={constructor:e,select:function(){var t=this.$menu.find(".active").attr("data-value");return this.$element.val(this.updater(t)).change(),this.hide()},updater:function(t){return t},show:function(){var e=t.extend({},this.$element.offset(),{height:this.$element[0].offsetHeight});return this.$menu.css({top:e.top+e.height,left:e.left}),this.$menu.show(),this.shown=!0,this},hide:function(){return this.$menu.hide(),this.shown=!1,this},lookup:function(){var e;return this.query=this.$element.val(),!this.query||this.query.length<this.options.minLength?this.shown?this.hide():this:(e=t.isFunction(this.source)?this.source(this.query,t.proxy(this.process,this)):this.source,e?this.process(e):this)},process:function(e){var i=this;return e=t.grep(e,function(t){return i.matcher(t)}),e=this.sorter(e),e.length?this.render(e.slice(0,this.options.items)).show():this.shown?this.hide():this},matcher:function(t){return~t.toLowerCase().indexOf(this.query.toLowerCase())},sorter:function(t){for(var e,i=[],n=[],s=[];e=t.shift();)e.toLowerCase().indexOf(this.query.toLowerCase())?~e.indexOf(this.query)?n.push(e):s.push(e):i.push(e);return i.concat(n,s)},highlighter:function(t){var e=this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&");return t.replace(RegExp("("+e+")","ig"),function(t,e){return"<strong>"+e+"</strong>"})},render:function(e){var i=this;return e=t(e).map(function(e,n){return e=t(i.options.item).attr("data-value",n),e.find("a").html(i.highlighter(n)),e[0]}),e.first().addClass("active"),this.$menu.html(e),this},next:function(){var e=this.$menu.find(".active").removeClass("active"),i=e.next();i.length||(i=t(this.$menu.find("li")[0])),i.addClass("active")},prev:function(){var t=this.$menu.find(".active").removeClass("active"),e=t.prev();e.length||(e=this.$menu.find("li").last()),e.addClass("active")},listen:function(){this.$element.on("blur",t.proxy(this.blur,this)).on("keypress",t.proxy(this.keypress,this)).on("keyup",t.proxy(this.keyup,this)),this.eventSupported("keydown")&&this.$element.on("keydown",t.proxy(this.keydown,this)),this.$menu.on("click",t.proxy(this.click,this)).on("mouseenter","li",t.proxy(this.mouseenter,this))},eventSupported:function(t){var e=t in this.$element;return e||(this.$element.setAttribute(t,"return;"),e="function"==typeof this.$element[t]),e},move:function(t){if(this.shown){switch(t.keyCode){case 9:case 13:case 27:t.preventDefault();break;case 38:t.preventDefault(),this.prev();break;case 40:t.preventDefault(),this.next()}t.stopPropagation()}},keydown:function(e){this.suppressKeyPressRepeat=!~t.inArray(e.keyCode,[40,38,9,13,27]),this.move(e)},keypress:function(t){this.suppressKeyPressRepeat||this.move(t)},keyup:function(t){switch(t.keyCode){case 40:case 38:case 16:case 17:case 18:break;case 9:case 13:if(!this.shown)return;this.select();break;case 27:if(!this.shown)return;this.hide();break;default:this.lookup()}t.stopPropagation(),t.preventDefault()},blur:function(){var t=this;setTimeout(function(){t.hide()},150)},click:function(t){t.stopPropagation(),t.preventDefault(),this.select()},mouseenter:function(e){this.$menu.find(".active").removeClass("active"),t(e.currentTarget).addClass("active")}},t.fn.typeahead=function(i){return this.each(function(){var n=t(this),s=n.data("typeahead"),o="object"==typeof i&&i;s||n.data("typeahead",s=new e(this,o)),"string"==typeof i&&s[i]()})},t.fn.typeahead.defaults={source:[],items:8,menu:'<ul class="typeahead dropdown-menu"></ul>',item:'<li><a href="#"></a></li>',minLength:1},t.fn.typeahead.Constructor=e,t(document).on("focus.typeahead.data-api",'[data-provide="typeahead"]',function(e){var i=t(this);i.data("typeahead")||(e.preventDefault(),i.typeahead(i.data()))})}(window.jQuery),function(t){if("function"==typeof bootstrap)bootstrap("jade",t);else if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else if("undefined"!=typeof ses){if(!ses.ok())return;ses.makeJade=t}else"undefined"!=typeof window?window.jade=t():global.jade=t()}(function(){return function t(e,i,n){function s(a,r){if(!i[a]){if(!e[a]){var h="function"==typeof require&&require;if(!r&&h)return h(a,!0);if(o)return o(a,!0);throw Error("Cannot find module '"+a+"'")}var l=i[a]={exports:{}};e[a][0].call(l.exports,function(t){var i=e[a][1][t];return s(i?i:t)},l,l.exports,t,e,i,n)}return i[a].exports}for(var o="function"==typeof require&&require,a=0;n.length>a;a++)s(n[a]);return s}({1:[function(t,e,i){function n(t){return null!=t&&""!==t}function s(t){return Array.isArray(t)?t.map(s).filter(n).join(" "):t}Array.isArray||(Array.isArray=function(t){return"[object Array]"==Object.prototype.toString.call(t)}),Object.keys||(Object.keys=function(t){var e=[];for(var i in t)t.hasOwnProperty(i)&&e.push(i);return e}),i.merge=function(t,e){var i=t["class"],s=e["class"];(i||s)&&(i=i||[],s=s||[],Array.isArray(i)||(i=[i]),Array.isArray(s)||(s=[s]),t["class"]=i.concat(s).filter(n));for(var o in e)"class"!=o&&(t[o]=e[o]);return t},i.attrs=function(t,e){var n=[],o=t.terse;delete t.terse;var a=Object.keys(t),r=a.length;if(r){n.push("");for(var h=0;r>h;++h){var l=a[h],c=t[l];"boolean"==typeof c||null==c?c&&(o?n.push(l):n.push(l+'="'+l+'"')):0==l.indexOf("data")&&"string"!=typeof c?n.push(l+"='"+JSON.stringify(c)+"'"):"class"==l?e&&e[l]?(c=i.escape(s(c)))&&n.push(l+'="'+c+'"'):(c=s(c))&&n.push(l+'="'+c+'"'):e&&e[l]?n.push(l+'="'+i.escape(c)+'"'):n.push(l+'="'+c+'"')}}return n.join(" ")},i.escape=function(t){return(t+"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},i.rethrow=function o(e,i,n,s){if(!(e instanceof Error))throw e;if(!("undefined"==typeof window&&i||s))throw e.message+=" on line "+n,e;try{s=s||t("fs").readFileSync(i,"utf8")}catch(a){o(e,null,n)}var r=3,h=s.split("\n"),l=Math.max(n-r,0),c=Math.min(h.length,n+r),r=h.slice(l,c).map(function(t,e){var i=e+l+1;return(i==n?"  > ":"    ")+i+"| "+t}).join("\n");throw e.path=i,e.message=(i||"Jade")+":"+n+"\n"+r+"\n\n"+e.message,e}},{fs:2}],2:[function(){},{}]},{},[1])(1)});var switchTab=function(t){function e(t){for(var e=t.tabIdArr,i=t.tabClass,n=t.activeClass,s=t.contentId,o=0,a=e.length;a>o;o++)document.getElementById(e[o]).onclick=function(e){var o=e.target.id,a={tab_state:o};history.pushState(a,o,"#"+o),console.log(history),console.log(history.state),t.activeColor(i,n,o),t.fetchContent(t.getUrl(o),s)};window.addEventListener("popstate",function(){var e=t.showFirst;""!==window.location.hash&&(e=window.location.hash.substring(1)),t.activeColor(i,n,e),t.fetchContent(t.getUrl(e),s)},!1)}this.tabClass=t.tabClass||"",this.contentId=t.contentId||"",this.activeClass=t.activeClass||"",this.showFirst=t.showFirst||"",this.tabIdArr=t.tabId||[],this.showFirstFn(this),this.state(this),e(this)};switchTab.prototype.state=function(t){var e=t.contentId,i=t.tabClass,n=t.activeClass,e=t.contentId,s=window.location.hash,o=s.substring(1);s&&(this.activeColor(i,n,o),this.fetchContent(this.getUrl(o),e))},switchTab.prototype.getUrl=function(t){return document.getElementById(t).getAttribute("tab-url")},switchTab.prototype.fetchContent=function(t,e){var i;i=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),i.onreadystatechange=function(){4==i.readyState&&200==i.status&&(document.getElementById(e).innerHTML=i.responseText)},i.open("GET",t,!0),i.send()},switchTab.prototype.activeColor=function(t,e,i){for(var n=document.getElementsByClassName(t),s=0;n.length>s;s++)n[s].className=n[s].className.replace(e,"");document.getElementById(i).className+=" "+e},switchTab.prototype.showFirstFn=function(t){var e=t.showFirst,i=t.tabClass,n=t.activeClass,s=t.contentId;t.activeColor(i,n,e),t.fetchContent(t.getUrl(e),s)};