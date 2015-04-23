function donutClock(options) {

  var CIRCLE = Math.PI * 2;
  var DAY = 24 * 60 * 60 * 1000;

  assert(typeof options === "object", "pass object of options");
  options.change = options.change || Function.prototype;

  var pointerHandlerR = 12.5;

  var el = assert(options.el instanceof Element, "missing element") && options.el;
  template(el);

  var pointerHander = qs(el, "#hand-for-pointer");
  attr(pointerHander,"r", pointerHandlerR);

  var face = el.querySelector("#face");
  attr(face,"r",150)("cx",150)("cy",150);

  var removeMask = qs(el, "#remove-centre circle");
  attr(removeMask, "cx", 150)("cy", 150)("r", 125);


  var r = +attr(face, "r");
  var handCircuitR = r - pointerHandlerR;

  pointerHander.addEventListener("mousedown", mousedown);

  return {
    set: function(v) {
      renderAngle(timeToAngle(v));
    }
  };

  function qs(el, css) {
    return el.querySelector(css);
  }

  // silly dom tool ;)
  function attr(el, k, v) {
    if(v == null)
      return el.getAttribute(k)
    else {
      el.setAttribute(k,v);
      return attr.bind(null, el);
    }
  }

  // event handlers
  function mousedown() {
    document.body.addEventListener("mousemove", update);
    document.body.addEventListener("mouseup", disable);
  }

  function disable() {
    document.body.removeEventListener("mousemove", update);
    document.body.removeEventListener("mouseup", disable);
  }

  // conversion
  function angleToTime(angle) {
    var ratio = angle / CIRCLE;
    ratio = ratio + 0.25;
    ratio = ratio < 0 ? 1 + ratio : ratio;
    return ratio * DAY;
  }

  function timeToAngle(time) {
    var ratio = timeOnly(time) / DAY;
    if(ratio >= 0.75) {
      ratio = -(1 - ratio);
    }
    ratio -= 0.25;
    ratio *= CIRCLE;
    return ratio;
  }

  function timeOnly(date) {
    var mid = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    return date - mid;
  }

  function update(event) {

    var rect = el.getBoundingClientRect();
    var diffX = event.clientX - (rect.left + rect.width / 2);
    var diffY = event.clientY - (rect.top + rect.height / 2);

    var angle = Math.atan2(diffY, diffX);

    options.onInput( new Date(angleToTime(angle)) );
    renderAngle(angle);
  }

  function renderAngle(angle) {
    var x = r + Math.cos(angle) * handCircuitR;
    var y = r + Math.sin(angle) * handCircuitR;

    pointerHander.setAttribute("cx", x);
    pointerHander.setAttribute("cy", y);
  }

  function assert(t, msg) {
    if(!t) throw new Error(msg);
    return t;
  }
  
  function svgEl(name) {
     return document.createElementNS("http://www.w3.org/2000/svg", name);
  }

  function template(root) {
    
    var defs = svgEl("defs");
    
    var mask = svgEl("mask");
    mask.id = "remove-centre";
    var rect = svgEl("rect");
    attr(rect, "width", "100%")
    ("height", "100%")
    ("fill", "#fff");
    
    mask.appendChild(rect);
    mask.appendChild(svgEl("circle"));
    defs.appendChild(mask);
    
    var face = svgEl("circle");
    face.id = "face";
    attr(face, "mask", "url(#remove-centre)");
    
    var hand = svgEl("circle");
    hand.id = "hand-for-pointer";
    
    root.appendChild(defs);
    root.appendChild(face);
    root.appendChild(hand);

  }
}

