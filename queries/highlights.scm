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

; calls
(call_expr function: (identifier) @function.call)

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

; generic identifier fallback (keep last, lowest priority)
(identifier) @variable

; method calls
(method_call
  method: (identifier) @function.method.call)

; std library functions — override generic call color for known builtins
(call_expr
  function: (identifier) @function.builtin.call
  (#any-of? @function.builtin.call "clock" "print"))

; std library methods — override generic method color for known builtins
(method_call
  method: (identifier) @function.builtin.method
  (#any-of? @function.builtin.method "to_str"))
