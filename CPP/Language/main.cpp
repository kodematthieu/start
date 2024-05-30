#include <iostream>
#include <iomanip>
#include <vector>
#include <signal.h>

#include "funcs.h"

using namespace std;


struct Token {
    string type;
    string value;
};

void stopping(int sig) {
    exit(0);
}

void ask();
void tokenize(vector<Token>&, string);

int main(int argc, char** argv) {
    signal(SIGABRT, stopping);
    signal(SIGTERM, stopping);
    signal(SIGINT, stopping);
    ask();
}

void ask() {
    string input;
    vector<Token> tokens;
    cout << ")=> ";
    getline(cin, input);
    tokenize(tokens, input);
    return ask();
}

void tokenize(vector<Token>& out, string text) {
    out.clear();
    string tid = "";
    string tmp = {};
    for(char chr : text) {
        if(chr == ' ') continue;
        if(chr )
    }
}