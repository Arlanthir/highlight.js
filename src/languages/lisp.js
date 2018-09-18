/*
Language: Lisp
Description: Generic lisp syntax
Author: Vasily Polovnyov <vast@whiteants.net>
Category: lisp
*/

function(hljs) {
    var KEYWORDS = {
	keyword: 'time eval-when block assert declaim with-input-from-string incf tagbody define-symbol-macro with-hash-table-iterator restart-case handler-bind nth-value do* with-package-iterator define-condition with-output-to-string ccase ecase pushnew defconstant loop flet defstruct define-modify-macro function defpackage pprint-logical-block throw prog2 quote pop catch multiple-value-bind decf psetq defmethod progv unless define-compiler-macro prog locally restart-bind untrace prog1 if lambda push when defun progn or return defclass deftype and labels destructuring-bind prog* defgeneric defmacro in-package defvar do-external-symbols psetf macrolet handler-case let with-standard-io-syntax with-open-stream with-condition-restarts print-unreadable-object defparameter multiple-value-list multiple-value-prog1 check-type ignore-errors setf define-method-combination typecase go case step defsetf loop-finish do-symbols ctypecase etypecase multiple-value-setq load-time-value return-from with-open-file with-simple-restart trace shiftf dolist define-setf-expander with-accessors unwind-protect remf rotatef do with-slots cond formatter multiple-value-call symbol-macrolet the let* setq with-compilation-unit dotimes do-all-symbols'
    };

  var LISP_IDENT_RE = '[a-zA-Z_\\-\\+\\*\\/\\<\\=\\>\\&\\#\\.][a-zA-Z0-9_\\-\\+\\*\\/\\<\\=\\>\\&\\#\\.!]*';
  var MEC_RE = '\\|[^]*?\\|';
  var LISP_SIMPLE_NUMBER_RE = '(\\-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s|D|E|F|L|S)(\\+|\\-)?\\d+)?';
  var SHEBANG = {
    className: 'meta',
    begin: '^#!', end: '$'
  };
  var LITERAL = {
    className: 'literal',
    begin: '\\b(t{1}|nil)\\b'
  };
  var NUMBER = {
    className: 'number',
    variants: [
      {begin: LISP_SIMPLE_NUMBER_RE, relevance: 0},
      {begin: '#(b|B)[0-1]+(/[0-1]+)?'},
      {begin: '#(o|O)[0-7]+(/[0-7]+)?'},
      {begin: '#(x|X)[0-9a-fA-F]+(/[0-9a-fA-F]+)?'},
      {begin: '#(c|C)\\(' + LISP_SIMPLE_NUMBER_RE + ' +' + LISP_SIMPLE_NUMBER_RE, end: '\\)'}
    ]
  };
  var STRING = hljs.inherit(hljs.QUOTE_STRING_MODE, {illegal: null});
  var COMMENT = hljs.COMMENT(
    ';', '$',
    {
      relevance: 0
    }
  );
  var VARIABLE = {
    begin: '\\*', end: '\\*'
  };
  var KEYWORD = {
    className: 'symbol',
    begin: '[:&]' + LISP_IDENT_RE
  };
  var IDENT = {
    begin: LISP_IDENT_RE,
    relevance: 0,
    keywords: KEYWORDS
  };
  var MEC = {
    begin: MEC_RE
  };
  var QUOTED_LIST = {
    begin: '\\(', end: '\\)',
    contains: ['self', LITERAL, STRING, NUMBER, IDENT]
  };
  var QUOTED = {
    contains: [NUMBER, STRING, VARIABLE, KEYWORD, QUOTED_LIST, IDENT],
    variants: [
      {
        begin: '[\'`]\\(', end: '\\)'
      },
      {
        begin: '\\(quote ', end: '\\)',
        keywords: {name: 'quote'}
      },
      {
        begin: '\'' + MEC_RE
      }
    ]
  };
  var QUOTED_ATOM = {
    variants: [
      {begin: '\'' + LISP_IDENT_RE},
      {begin: '#\'' + LISP_IDENT_RE + '(::' + LISP_IDENT_RE + ')*'}
    ]
  };
  var LIST = {
      begin: '\\(\\s*', end: '\\)'
  };
  var BODY = {
    endsWithParent: true,
    relevance: 0
  };
  LIST.contains = [
      /* {
       *   className: 'name',
       *   variants: [
       *     {begin: LISP_IDENT_RE},
       *     {begin: MEC_RE}
       *   ]
       * }, */
    BODY
  ];
  BODY.contains = [QUOTED, QUOTED_ATOM, LIST, LITERAL, NUMBER, STRING, COMMENT, VARIABLE, KEYWORD, MEC, IDENT];

  return {
    illegal: /\S/,
    contains: [
      NUMBER,
      SHEBANG,
      LITERAL,
      STRING,
      COMMENT,
      QUOTED,
      QUOTED_ATOM,
      LIST,
      IDENT
    ]
  };
}
