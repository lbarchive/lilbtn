// Copyright 2011 Yu-Jie Lin
// New BSD License

// http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
function getTextNodesIn(node, includeWhitespaceNodes) {
    var textNodes = [], whitespace = /^\s*$/;

    function getTextNodes(node) {
        if (node.nodeType == 3) {
            if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
                textNodes.push(node);
            }
        } else {
            for (var i = 0, len = node.childNodes.length; i < len; ++i) {
                getTextNodes(node.childNodes[i]);
            }
        }
    }

    getTextNodes(node);
    return textNodes;
}

function heart_beat(idx, nodes) {
  var node = nodes[idx];
  var text = node.nodeValue.replace(/(.)/g, '<span class="hearts-on-letters">$1</span>');
  $(nodes[idx]).replaceWith($(text));
  if (++idx < nodes.length)
    window.setTimeout(function(){heart_beat(idx, nodes)}, (window.heart_beat_rate != undefined) ? window.heart_beat_rate : 100);
  }

function hearts() {
  // Guess why z-index is set to 5683?
  $('<style>.hearts-on-letters:before{color:red;content: "\\2665";opacity:.2;position:absolute;z-index:5683}</style>').appendTo('head');
  heart_beat(0, getTextNodesIn($('body')[0]));
  }

function init_hearts() {
  // checking for Valentine's Day, turn on automatically.
  if ((new Date()).getMonth() == 1 && (new Date()).getDate() == 14) {
    hearts();
    }
  }

if (window.jQuery) {
  jQuery(init_hearts);
  }
else if (window.google) { // Try Google AJAX Libraries loader
  google.load("jquery", "1");
  google.setOnLoadCallback(init_hearts);
  }
