; keywords
["func" "if" "else" "while" "for" "return"] @keyword
(type) @type
(boolean) @boolean
"null" @constant.builtin

; literals
(number) @number
(string) @string
(comment) @comment

; function declarations
(func_decl name: (identifier) @function)
(param name: (identifier) @variable.parameter)

; declarations (covers decl_stmt AND decl inlined inside for_stmt init)
(decl
  kind: _ @keyword
  name: (identifier) @variable
  type: (type) @type)

; assignments (covers assign_stmt AND assign inlined inside for_stmt init/update)
(assign
  name: (identifier) @variable
  op: _ @operator)

; operators
["=" "+=" "-=" "*=" "/=" "++" "--" "+" "-" "*" "/" "<" "<=" ">" ">=" "==" "!=" "and" "or" "!" "->"] @operator

; punctuation
["(" ")" "{" "}"] @punctuation.bracket
[";" ":" ","] @punctuation.delimiter

; generic identifier fallback (keep last, lowest priority — but calls/methods are listed AFTER this so they win)
(identifier) @variable

; calls — listed after the fallback so these override it for call/method nodes specifically
(call_expr function: (identifier) @function.call)
(method_call method: (identifier) @function.method.call)

; std library overrides — must come last of all
(call_expr
  function: (identifier) @function.builtin.call
  (#any-of? @function.builtin.call "clock" "print"))

(method_call
  method: (identifier) @function.builtin.method
  (#any-of? @function.builtin.method "to_str"))
