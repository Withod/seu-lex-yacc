%{
#include <stdlib.h>
#define out(fmt, ...) fprintf(yyout, fmt, ##__VA_ARGS__)
%}

%token SHARP MINUS PLUS MULTIPLY DIVIDE LPAREN RPAREN NUMBER UNKNOWN
%left '+' '-'
%left '*' '/'
%start E

%%

E	: E '+' E	{ out("%s", "r(E+E)"); $$ = itoa(atoi($1) + atoi($3)); }
	| E MINUS E	{ out("%s", "r(E-E)"); $$ = itoa(atoi($1) - atoi($3)); }
	| E '*' E	{ out("%s", "r(E*E)"); $$ = itoa(atoi($1) * atoi($3)); }
	| E DIVIDE E	{ out("%s", "r(E/E)"); $$ = itoa(atoi($1) / atoi($3)); }
	| LPAREN E ')'
	| NUMBER  { $$ = $1; /* default operation in fact */ }
	;

%%

int main(int argc, char** argv) {
  // redirect yyin
  yyin = fopen(argv[1], "r");
	// redirect yyout if you want, or stdout by default
	// yyout = stdout;
	int c;
	// keep calling yyparse
  while (c = yyparse()) {
    if (c != 0) break;
  }
  fclose(yyin);
  return 0;
}

int yywrap() {
  return 1;
}