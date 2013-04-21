echo "Coming back to local"
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/mode='dev'/mode='local'/g ..\war\static-resources\core\envvariables.js
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/built-static-resources/static-resources/g ../war/boilerplate.js
"C:\Program Files (x86)\GnuWin32\bin\sed" -ci s/'builtfem.appcache'/'fem.appcache'/g ../war/index.html
echo "Done"