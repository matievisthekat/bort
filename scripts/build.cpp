#include <iostream>
using namespace std;

int main(int argc, char *argv[])
{
  int exitCode = 0;

  if (argc == 2)
  {
    if (*argv[1] == 'b')
    {
      exitCode = system("npx tsc");
      cout << "Built to ./dist/src/index.js and ./dist/api/index.js" << endl;
    }
    else if (*argv[1] == 'i')
    {
      exitCode = system("cd api/image && go build -o ../../dist/api/image");
      cout << "Built to ./dist/api/image" << endl;
    }
    else if (*argv[1] == 'c')
    {
      exitCode = system("cd client && npm run build");
      cout << "Built to ./client/public/" << endl;
    }
    else if (*argv[1] == 'a')
    {
      system("npx tsc");
      system("cd api/image && go build main.go");
      system("cd client && npm run build");
      cout << "Built to ./dist/src/index.js, ./dist/api/index.js, ./dist/api/image, ./dist/public" << endl;
    }
    else
    {
      cerr << "Invalid build option. [b, i, c, a]" << endl;
      exitCode = 1;
    }
  }
  else
  {
    cerr << "Invalid amount of args. 1 required" << endl;
    exitCode = 1;
  }

  return exitCode;
}