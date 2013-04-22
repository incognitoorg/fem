echo "substituting dev settings"
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/mode='local'/mode='dev'/g ..\war\static-resources\core\envvariables.js
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/\/static-resources\//\/built-static-resources\//g ../war/boilerplate.js
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/'fem.appcache'/'builtfem.appcache'/g ../war/index.html
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/"static-resources\//"built-static-resources\//g ../war/index.html
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/1.0/1.0.1/g ../war/builtfem.appcache






cd ..\r-js-optimizer\
REM call optimize.cmd
cd ..\deployscript\

call "C:\Users\vishwanath\Downloads\appengine-java-sdk-1.7.5\appengine-java-sdk-1.7.5\bin\appcfg.cmd" update ../war


echo "Coming back to local"
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/mode='dev'/mode='local'/g ..\war\static-resources\core\envvariables.js
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/built-static-resources/static-resources/g ../war/boilerplate.js
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/'builtfem.appcache'/'fem.appcache'/g ../war/index.html
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/"built-static-resources\//"static-resources\//g ../war/index.html
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/1.0.1.1.1.1.1/1.0/g ../war/builtfem.appcache

echo "Done"

