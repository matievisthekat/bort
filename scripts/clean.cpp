#include <iostream>
using namespace std;

int main(int argc, char *argv[])
{
  int exitCode = 0;

  if (argc == 2)
  {
    if (*argv[1] == 'b')
    {
      exitCode = system("rm -rf node_modules && rm -rf dist");
      cout << "Cleaned ./node_modules/, ./dist/" << endl;
    }
    else if (*argv[1] == 'i')
    {
      exitCode = system("rm -rf dist/api/image");
      cout << "Cleaned ./dist/api/image" << endl;
    }
    else if (*argv[1] == 'c')
    {
      exitCode = system("cd client && npm run clean && rm -rf node_modules");
      cout << "Cleaned ./client/{public/, .cache/, node_modules/}" << endl;
    }
    else if (*argv[1] == 'a')
    {
      system("rm -rf node_modules && rm -rf dist");
      system("cd client && npm run clean && rm -rf node_modules");
      cout << "Cleaned ./client/{public/, .cache/, node_modules/}, ./dist/" << endl;
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