#include <iostream>
#include <sys/stat.h>

using namespace std;

bool pathExists(const std::string &s)
{
  struct stat buffer;
  return (stat(s.c_str(), &buffer) == 0);
}

void startImg(int *exitCode)
{
  bool built = pathExists("./api/image/main");
  *exitCode = system(built ? "./api/image/main" : "./bin/build img && ./api/image/main");
  cout << "Started image api" << endl;
}

void startBot(int *exitCode)
{
  bool built = pathExists("./dist");
  *exitCode = system(built ? "node dist/src/index.js" : "./bin/build bot && node dist/src/index.js");
  cout << "Started bot" << endl;
}

void startClient(int *exitCode)
{
  *exitCode = system("cd client && npm start");
  cout << "Started client" << endl;
}

int main(int argc, char *argv[])
{
  int exitCode = 0;

  if (argc == 2)
  {
    if (*argv[1] == 'b')
    {
      startBot(&exitCode);
    }
    else if (*argv[1] == 'c')
    {
      startClient(&exitCode);
    }
    else if (*argv[1] == 'i')
    {
      startImg(&exitCode);
    }
    else
    {
      cerr << "Invalid build option. [b, i, c]" << endl;
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