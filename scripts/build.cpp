#include <iostream>
using namespace std;

void buildBot(int *exitCode)
{
  *exitCode = system("npx tsc");
  cout << "Built to ./dist/src/index.js and ./dist/api/index.js" << endl;
}

void buildClient(int *exitCode)
{
  *exitCode = system("cd client && npm run build");
  cout << "Built to ./client/public/" << endl;
}

void buildImg(int *exitCode)
{
  *exitCode = system("cd api/image && go build main.go");
  cout << "Built to ./api/image/main" << endl;
}

void buildScripts(int *exitCode)
{
  *exitCode = system("cd scripts && g++ clean.cpp -o ../bin/clean && g++ install.cpp -o ../bin/install && g++ start.cpp -o ../bin/start");
  cout << "Built to ./bin/{install, clean, start}" << endl;
}

int main(int argc, char *argv[])
{
  int exitCode = 0;

  if (argc == 2)
  {
    if (*argv[1] == 'b')
    {
      buildBot(&exitCode);
    }
    else if (*argv[1] == 'i')
    {
      buildImg(&exitCode);
    }
    else if (*argv[1] == 'c')
    {
      buildClient(&exitCode);
    }
    else if (*argv[1] == 's')
    {
      buildScripts(&exitCode);
    }
    else if (*argv[1] == 'a')
    {
      buildBot(&exitCode);
      buildImg(&exitCode);
      buildClient(&exitCode);
      buildScripts(&exitCode);
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