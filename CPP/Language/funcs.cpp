#include <fstream>

using namespace std;

string parseFile(string path) {
    ifstream ifs(path);
    if(ifs.fail()) throw ("The file doesn't exist: \"" + path + '"');
    string content((istreambuf_iterator<char>(ifs)), (istreambuf_iterator<char>()));
    return content;
}