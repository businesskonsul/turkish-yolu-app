// Run after `npx cap add android`: version code, release signing (Codemagic keystore), portrait only.
const fs = require('fs');
const G = 'android/app/build.gradle', M = 'android/app/src/main/AndroidManifest.xml';
let g = fs.readFileSync(G, 'utf8');
const code = 100 + parseInt(process.env.BUILD_NUMBER || '0', 10);
g = g.replace(/versionCode \d+/, 'versionCode ' + code).replace(/versionName "[^"]*"/, 'versionName "' + (process.env.APP_VERSION || '1.0.0') + '"');
if (process.env.CM_KEYSTORE_PATH && !g.includes('signingConfigs')) {
  g = g.replace('    buildTypes {', `    signingConfigs {
        release {
            storeFile file(System.getenv("CM_KEYSTORE_PATH"))
            storePassword System.getenv("CM_KEYSTORE_PASSWORD")
            keyAlias System.getenv("CM_KEY_ALIAS")
            keyPassword System.getenv("CM_KEY_PASSWORD")
        }
    }
    buildTypes {`).replace("            minifyEnabled false\n", "            minifyEnabled false\n            signingConfig signingConfigs.release\n");
  console.log('release signing: Codemagic keystore');
} else console.log('release signing: none (debug APK only)');
fs.writeFileSync(G, g);
let m = fs.readFileSync(M, 'utf8');
if (!m.includes('screenOrientation')) m = m.replace('android:name=".MainActivity"', 'android:name=".MainActivity"\n            android:screenOrientation="portrait"');
fs.writeFileSync(M, m);
console.log('versionCode', code);
