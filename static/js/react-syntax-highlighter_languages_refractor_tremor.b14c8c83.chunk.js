"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3311],{4750:e=>{function n(e){!function(e){e.languages.tremor={comment:{pattern:/(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,lookbehind:!0},"interpolated-string":null,extractor:{pattern:/\b[a-z_]\w*\|(?:[^\r\n\\|]|\\(?:\r\n|[\s\S]))*\|/i,greedy:!0,inside:{regex:{pattern:/(^re)\|[\s\S]+/,lookbehind:!0},function:/^\w+/,value:/\|[\s\S]+/}},identifier:{pattern:/`[^`]*`/,greedy:!0},function:/\b[a-z_]\w*(?=\s*(?:::\s*<|\())\b/,keyword:/\b(?:args|as|by|case|config|connect|connector|const|copy|create|default|define|deploy|drop|each|emit|end|erase|event|flow|fn|for|from|group|having|insert|into|intrinsic|let|links|match|merge|mod|move|of|operator|patch|pipeline|recur|script|select|set|sliding|state|stream|to|tumbling|update|use|when|where|window|with)\b/,boolean:/\b(?:false|null|true)\b/i,number:/\b(?:0b[01_]*|0x[0-9a-fA-F_]*|\d[\d_]*(?:\.\d[\d_]*)?(?:[Ee][+-]?[\d_]+)?)\b/,"pattern-punctuation":{pattern:/%(?=[({[])/,alias:"punctuation"},operator:/[-+*\/%~!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?>?=?|(?:absent|and|not|or|present|xor)\b/,punctuation:/::|[;\[\]()\{\},.:]/};var n=/#\{(?:[^"{}]|\{[^{}]*\}|"(?:[^"\\\r\n]|\\(?:\r\n|[\s\S]))*")*\}/.source;e.languages.tremor["interpolated-string"]={pattern:RegExp(/(^|[^\\])/.source+'(?:"""(?:'+/[^"\\#]|\\[\s\S]|"(?!"")|#(?!\{)/.source+"|"+n+')*"""|"(?:'+/[^"\\\r\n#]|\\(?:\r\n|[\s\S])|#(?!\{)/.source+"|"+n+')*")'),lookbehind:!0,greedy:!0,inside:{interpolation:{pattern:RegExp(n),inside:{punctuation:/^#\{|\}$/,expression:{pattern:/[\s\S]+/,inside:e.languages.tremor}}},string:/[\s\S]+/}},e.languages.troy=e.languages.tremor,e.languages.trickle=e.languages.tremor}(e)}e.exports=n,n.displayName="tremor",n.aliases=[]}}]);
//# sourceMappingURL=react-syntax-highlighter_languages_refractor_tremor.b14c8c83.chunk.js.map