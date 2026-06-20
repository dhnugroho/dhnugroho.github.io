const esbuild = require('esbuild');

async function build() {
  console.log('--- Starting Minification & Bundling ---');

  // 1. Bundle and minify CSS
  try {
    console.log('Bundling & minifying CSS (css/main.css -> css/main.min.css)...');
    await esbuild.build({
      entryPoints: ['css/main.css'],
      bundle: true,
      minify: true,
      outfile: 'css/main.min.css',
      logLevel: 'info',
    });
    console.log('  ✅ CSS done!');
  } catch (err) {
    console.error('  ❌ CSS failed:', err);
  }

  // 2. Bundle and minify main.js (which imports all modules)
  try {
    console.log('Bundling & minifying JS (js/main.js -> js/main.min.js)...');
    await esbuild.build({
      entryPoints: ['js/main.js'],
      bundle: true,
      minify: true,
      outfile: 'js/main.min.js',
      logLevel: 'info',
    });
    console.log('  ✅ JS done!');
  } catch (err) {
    console.error('  ❌ JS failed:', err);
  }

  // 3. Minify chatbot.js (no bundle needed, but we write to minified)
  try {
    console.log('Minifying chatbot.js -> chatbot.min.js...');
    await esbuild.build({
      entryPoints: ['chatbot.js'],
      bundle: false,
      minify: true,
      outfile: 'chatbot.min.js',
      logLevel: 'info',
    });
    console.log('  ✅ Chatbot JS done!');
  } catch (err) {
    console.error('  ❌ Chatbot JS failed:', err);
  }

  console.log('--- Build Finished ---');
}

build();
