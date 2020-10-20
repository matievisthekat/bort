#include <iostream>
#include <sys/stat.h>

using namespace std;

bool pathExists(const std::string &s)
{
  struct stat buffer;
  return (stat(s.c_str(), &buffer) == 0);
}

void installBot(int *exitCode)
{
  bool modulesInstalled = pathExists("./node_modules");
  *exitCode = system(modulesInstalled ? "npm ci" : "npm i");
  cout << "Installed dependencies to ./node_modules" << endl;
}

void intstallClient(int *exitCode)
{
  bool modulesInstalled = pathExists("./client/node_modules");
  *exitCode = system(modulesInstalled ? "cd client && npm ci" : "cd client && npm i");
  cout << "Installed dependencies to ./client/node_modules" << endl;
}

int main(int argc, char *argv[])
{
  int exitCode = 0;

  if (argc == 2)
  {
    if (*argv[1] == 'b')
    {
      installBot(&exitCode);
    }
    else if (*argv[1] == 'c')
    {
      intstallClient(&exitCode);
    }
    else if (*argv[1] == 'a')
    {
      installBot(&exitCode);
      intstallClient(&exitCode);
    }
    else
    {
      cerr << "Invalid build option. [b, c, a]" << endl;
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