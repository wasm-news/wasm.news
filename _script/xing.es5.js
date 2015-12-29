/*!
 * XING
 *
 * @author Stefan Keim (indus)
 * @version 0.1.1
 * @description canvas based line background
 *
 */
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
'use strict';

"use static";
var XING = (function () {
    function XING(el, options) {
        if (options === void 0) {
            options = {};
        }
        this.options = options;
        var canvas = typeof el == 'string' || el instanceof String ? document.getElementById(el) : el;
        if (canvas.tagName != 'CANVAS') throw "no canvas";
        for (var key in XING.options) {
            options[key] = options[key] === undefined ? XING.options[key] : options[key];
        }
        var ctx = canvas.getContext('2d', { alpha: !options.bkgdColor }),
            tilt = { x: 0, y: 0 },
            _,
            l,
            w,
            h,
            random = Math.random,
            p = 0;
        function sort(a, b) {
            return a[1] - b[1];
        }
        ;
        var ray,
            x1,
            y1,
            x2,
            y2,
            s = [],
            sj,
            d,
            fac,
            ray_,
            x,
            y,
            r,
            i,
            j;
        var update = function update(p_) {
            options.bkgdColor ? ctx.fillRect(0, 0, w, h) : ctx.clearRect(0, 0, w, h);
            p = p_ - p || 16;
            for (i = l; i; i--) {
                ray = _[i - 1];
                x1 = ray.x1;
                y1 = ray.y1;
                x2 = ray.x2;
                y2 = ray.y2;
                if (options.parallax) {
                    fac = options.parallax / i;
                    x1 += tilt.x * fac;
                    x2 += tilt.x * fac;
                    y1 += tilt.y * fac;
                    y2 += tilt.y * fac;
                }
                ray.m = (y1 - y2) / (x1 - x2);
                ray.b = y1 - ray.m * x1;
                x1 = ray.x1 += ray.vx1 * p;
                y1 = ray.y1 += ray.vx1 * p;
                x2 = ray.x2 += ray.vx2 * p;
                y2 = ray.y2 += ray.vy2 * p;
                (x1 < 0 || x1 > 1) && (ray.vx1 = -ray.vx1);
                (y1 < 0 || y1 > 1) && (ray.vy1 = -ray.vy1);
                (x2 < 0 || x2 > 1) && (ray.vx2 = -ray.vx2);
                (y2 < 0 || y2 > 1) && (ray.vy2 = -ray.vy2);
                x1 = Math.min(Math.max((+(ray.m < 0) - ray.b) / ray.m, 0), 1), y1 = ray.m * x1 + ray.b;
                x2 = Math.min(Math.max((+(ray.m > 0) - ray.b) / ray.m, 0), 1), y2 = ray.m * x2 + ray.b;
                s[s.length = 0] = [0, x1, y1], d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                for (j = i; j < l; j++) {
                    ray_ = _[j], x = (ray_.b - ray.b) / (ray.m - ray_.m), y = ray.m * x + ray.b;
                    if (x > 0 && x < 1 && y > 0 && y < 1) {
                        r = .01 / Math.abs(Math.atan(ray.m) - Math.atan(ray_.m)) + 0.01;
                        s[s.push([1, x - r * (x2 - x1), y - r * (y2 - y1)])] = [0, x + r * (x2 - x1), y + r * (y2 - y1)];
                    }
                }
                s.push([1, x2, y2]);
                s.sort(sort);
                ctx.beginPath();
                for (j = 0; j < s.length && (sj = s[j]); j++) {
                    if (!j || !sj[0] || s[j - 1][0] != sj[0]) {
                        sj[0] ? ctx.lineTo(sj[1] * w, sj[2] * h) : ctx.moveTo(sj[1] * w, sj[2] * h);
                    }
                }
                ctx.lineWidth = i * .2 + .4;
                ctx.stroke();
            }
            p = p_;
            requestAnimationFrame(update);
        };
        _ = [];
        l = 1;
        while (l++ < Math.max(options.lineNum, 2)) {
            var v = options.velocity * l / 1e5;
            l = _.push({
                x1: random(),
                y1: random(),
                x2: random(),
                y2: random(),
                vx1: random() * v,
                vy1: random() * v,
                vx2: random() * v,
                vy2: random() * v
            });
        }
        l--;
        var mouse;
        function onMousemove(ev) {
            mouse = true;
            tilt.x = ev.pageX / (window.innerWidth / 2) - 1;
            tilt.y = ev.pageY / (window.innerHeight / 2) - 1;
        }
        function onOrientation(ev) {
            if (mouse) return window.removeEventListener('deviceorientation', onOrientation, false);
            tilt.x = Math.min(Math.max(-ev.gamma / 30, -1), 1);
            tilt.y = Math.min(Math.max(-ev.beta / 30, -1), 1);
        }
        function onResize() {
            w = canvas.width = (window.innerWidth || canvas.offsetWidth) / 2;
            h = canvas.height = (window.innerHeight || canvas.offsetHeight) / 2;
            ctx.fillStyle = options.bkgdColor;
            ctx.strokeStyle = options.lineColor;
            ctx.lineCap = "round";
        }
        window.addEventListener('resize', onResize, false);
        document.addEventListener('mousemove', onMousemove, false);
        //window.addEventListener('deviceorientation', onOrientation, false);
        onResize();
        update(0);
    }
    XING.options = {
        velocity: 1,
        parallax: .1,
        lineNum: 8,
        bkgdColor: '#55acee',
        lineColor: 'rgba(255,255,255,.15)'
    };
    return XING;
})();
window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false);
    new XING('xing');
}, false);
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
        }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
    if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
    };
})();

