module.exports = grammar({
  name: 'tall',

  extras: $ => [/\s/, $.comment],

  word: $ => $.identifier,

  rules: {
    source_file: $ => repeat($.func_decl),

    comment: $ => token(choice(
      seq('//', /.*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')
    )),

    // ---------- top level ----------
    func_decl: $ => seq(
      'func', field('name', $.identifier),
      '(', field('params', $.params), ')',
      '->', field('return_type', $.type),
      $.block
    ),

    params: $ => choice(
      'null',
      sep1($.param, ',')
    ),
    param: $ => seq(field('name', $.identifier), ':', field('type', $.type)),

    type: $ => choice('int', 'float', 'bool', 'string', 'void'),

    // ---------- statements ----------
    block: $ => seq('{', repeat($._statement), '}'),

    _statement: $ => choice(
      $.decl_stmt,
      $.assign_stmt,
      $.expr_stmt,
      $.if_stmt,
      $.while_stmt,
      $.for_stmt,
      $.return_stmt,
      $.block,
    ),

    decl_stmt: $ => seq($.decl, ';'),
    decl: $ => seq(
      field('kind', choice('var', 'const')),
      field('name', $.identifier), ':', field('type', $.type),
      '=', field('value', $._expr)
    ),

    assign_stmt: $ => seq($.assign, ';'),
    assign: $ => choice(
      seq(field('name', $.identifier),
          field('op', choice('=', '+=', '-=', '*=', '/=')),
          field('value', $._expr)),
      seq(field('name', $.identifier), field('op', choice('++', '--'))),
    ),

    expr_stmt: $ => seq($._expr, ';'),

    if_stmt: $ => seq(
      'if', '(', field('condition', $._expr), ')', field('then', $.block),
      optional(seq('else', field('else', choice($.block, $.if_stmt))))
    ),

    while_stmt: $ => seq('while', '(', field('condition', $._expr), ')', $.block),

    for_stmt: $ => seq(
      'for', '(',
      field('init', choice($.decl, $.assign)), ';',
      field('condition', $._expr), ';',
      field('update', $.assign),
      ')', $.block
    ),

    return_stmt: $ => seq('return', optional($._expr), ';'),

    // ---------- expressions ----------
    _expr: $ => choice(
      $.call_expr,
      $.binary_expr,
      $.unary_expr,
      $.identifier,
      $.number,
      $.string,
      $.boolean,
      $.paren_expr,
    ),

    paren_expr: $ => seq('(', $._expr, ')'),

    call_expr: $ => seq(
      field('function', $.identifier), '(',
      optional(sep1(field('argument', $._expr), ',')),
      ')'
    ),

    unary_expr: $ => prec(6, seq(choice('-', '!'), $._expr)),

    binary_expr: $ => choice(
      prec.left(5, seq($._expr, choice('*', '/'), $._expr)),
      prec.left(4, seq($._expr, choice('+', '-'), $._expr)),
      prec.left(3, seq($._expr, choice('<', '<=', '>', '>='), $._expr)),
      prec.left(2, seq($._expr, choice('==', '!='), $._expr)),
      prec.left(1, seq($._expr, choice('and', 'or'), $._expr)),
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,
    number: $ => /\d+(\.\d+)?/,
    string: $ => /"([^"\\]|\\.)*"/,
    boolean: $ => choice('true', 'false'),
  }
});

function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
