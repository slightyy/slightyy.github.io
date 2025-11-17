var bszCaller, bszTag;

!function () {
    var timer, intervalId, domReady, isReady = false, readyQueue = [];

    domReady = function (fn) {
        if (isReady || document.readyState === "interactive" || document.readyState === "complete") {
            fn.call(document);
        } else {
            readyQueue.push(function () {
                return fn.call(this);
            });
        }
        return this;
    };

    intervalId = function () {
        for (var i = 0, len = readyQueue.length; i < len; i++) {
            readyQueue[i].apply(document);
        }
        readyQueue = [];
    };

    timer = function () {
        if (!isReady) {
            isReady = true;
            intervalId.call(window);

            if (document.removeEventListener) {
                document.removeEventListener("DOMContentLoaded", timer, false);
            } else {
                document.detachEvent("onreadystatechange", timer);
                if (window == window.top) {
                    clearInterval(domReady);
                    domReady = null;
                }
            }
        }
    };

    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", timer, false);
    } else {
        document.attachEvent("onreadystatechange", function () {
            if (/loaded|complete/.test(document.readyState)) timer();
        });

        if (window == window.top) {
            domReady = setInterval(function () {
                try {
                    if (!isReady) document.documentElement.doScroll("left");
                } catch (err) {
                    return;
                }
                timer();
            }, 5);
        }
    }
}();

bszCaller = {
    fetch: function (url, callback) {
        var cbName = "BusuanziCallback_" + Math.floor(1099511627776 * Math.random());
        window[cbName] = this.evalCall(callback);
        url = url.replace("=BusuanziCallback", "=" + cbName);

        scriptTag = document.createElement("SCRIPT");
        scriptTag.type = "text/javascript";
        scriptTag.defer = true;
        scriptTag.src = url;
        scriptTag.referrerPolicy = "no-referrer-when-downgrade";

        document.getElementsByTagName("HEAD")[0].appendChild(scriptTag);
    },

    evalCall: function (callback) {
        return function (result) {
            ready(function () {
                try {
                    callback(result);
                    scriptTag.parentElement.removeChild(scriptTag);
                } catch (err) {
                    bszTag.hides();
                }
            });
        };
    }
};

bszCaller.fetch("//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback", function (data) {
    bszTag.texts(data);
    bszTag.shows();
});

bszTag = {
    bszs: ["site_pv", "page_pv", "site_uv"],

    texts: function (data) {
        this.bszs.map(function (name) {
            var element = document.getElementById("busuanzi_value_" + name);
            if (element) element.innerHTML = data[name];
        });
    },

    hides: function () {
        this.bszs.map(function (name) {
            var container = document.getElementById("busuanzi_container_" + name);
            if (container) container.style.display = "none";
        });
    },

    shows: function () {
        this.bszs.map(function (name) {
            var container = document.getElementById("busuanzi_container_" + name);
            if (container) container.style.display = "inline";
        });
    }
};
