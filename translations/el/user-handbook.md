# Εγχειρίδιο Χρήσης Babel

Αυτό το κέιμενο καλύπτει οτι θα ήθελε να μάθει κάποιος σχετικά με την χρήση του [Babel](https://babeljs.io) και τα σχετικά εργαλεία.

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Το εγχειρίδιο αυτό είναι διαθέσιμο και σε άλλες γλώσσες, δείτε στο [README](/README.md) τις υπόλοιπες γλώσσες.

# ΠΙΝΑΚΑΣ ΠΕΡΙΕΧΟΜΕΝΩΝ

  * [Εισαγωγή](#toc-introduction)
  * [Ρύθμιση του Babel](#toc-setting-up-babel) 
      * [`babel-cli`](#toc-babel-cli)
      * [Λειτουργία του Babel CLI μέσα από ένα έργο](#toc-running-babel-cli-from-within-a-project)
      * [`babel-register`](#toc-babel-register)
      * [`babel-node`](#toc-babel-node)
      * [`babel-core`](#toc-babel-core)
  * [Ρυθμίζοντας το Babel](#toc-configuring-babel) 
      * [`.babelrc`](#toc-babelrc)
      * [`babel-preset-es2015`](#toc-babel-preset-es2015)
      * [`babel-preset-react`](#toc-babel-preset-react)
      * [`babel-preset-stage-x`](#toc-babel-preset-stage-x)
  * [Εκτέλεση του παραγώμενου κώδικα απο το Babel](#toc-executing-babel-generated-code) 
      * [`babel-polyfill`](#toc-babel-polyfill)
      * [`babel-runtime`](#toc-babel-runtime)
  * [Ρυθμίζοντας το Babel (για προχωρημένους)](#toc-configuring-babel-advanced) 
      * [Χειροκίνητος καθορισμός βυσμάτων (plugins)](#toc-manually-specifying-plugins)
      * [Επιλογές βυσμάτων (plugins)](#toc-plugin-options)
      * [Ρυθμίζοντας το Babel βασιζόμενος στο περιβάλλον](#toc-customizing-babel-based-on-environment)
      * [Φτιάχνοντας τη δική σου προεπιλογή](#toc-making-your-own-preset)
  * [Babel και άλλα εργαλεία](#toc-babel-and-other-tools) 
      * [Εργαλεία στατικής ανάλυσης](#toc-static-analysis-tools)
      * [Linting](#toc-linting)
      * [Στυλ κώδικα](#toc-code-style)
      * [Τεκμηρίωση](#toc-documentation)
      * [Πλαισια (Frameworks)](#toc-frameworks)
      * [React](#toc-react)
      * [Κειμενογράφοι και IDEs](#toc-text-editors-and-ides)
  * [Υποστήριξη του Babel](#toc-babel-support) 
      * [Φόρουμ του Babel](#toc-babel-forum)
      * [Χώρος Συνομιλίας Babel](#toc-babel-chat)
      * [Προβλήματα με το Babel](#toc-babel-issues)
      * [Δημιουργούντας μια καταπληκτική αναφορά σφάλματος για το Babel](#toc-creating-an-awesome-babel-bug-report)

# <a id="toc-introduction"></a>Εισαγωγή

Το Babel είναι ένας γενικός μεταγλωττιστής πολλών χρήσεων για JavaScript. Χρησιμοποιώντας το Babel μπορείς να χρησιμοποιήσεις (και να δημιουργήσεις) την επόμενη γενιά JavaScript καθώς επίσης και την επόμενη γενιά εργαλείων για JavaScript.

Η JavaScript ως γλώσσα εξελίσσεται συνεχώς με νέα χαρακτηριστικά καθώς επισης και προτάσεις χαρακτηριστικών. Χρησιμοποιώντας το Babel θα έχεις την δυνατότητα να χρησιμοποιήσεις πολλά από τα χαρακτηριστικά πριν την καθολική διάθεση τους.

Το Babel το επιτυγχάνει αυτό με την μετάφραση σε κώδικα JavaScript χρησιμοποιώντας τα τελευταία πρότυπα σε μια έκδοση η οποία θα δουλέψει παντού σήμερα. Αυτή η διαδικασία είναι γνωστή ως μεταγλώττιση από πηγαίο κώδικα σε πηγαιό κώδικα, γνωστή και ως transpiling.

Για παράδειγμα, το Babel θα μπορούσε να μετατρέψει την νέα ES2015 συνάρτηση βέλους (arrow function) από αυτή τη μορφή:

```js
const square = n => n * n;
```

στην παρακάτων:

```js
const square = function square(n) {
  return n * n;
};
```

Ωστόσω, το Babel μπορεί να κάνει πολλά περισσότερα από αυτό, αφού το Babel υποστηρίζει την σύνταξη επεκτάσεων (extensions) όπως η σύνταξη JSX που χρησιμοποιηεί το React για τον έλεγχο στατικών τύπων.

Πέρα από αυτό, τα πάντα στο Babel είναι απλά ένα plugin και ο καθένας μπορεί να δημιουργήσει τα δικά του plugins χρησιμοποιώντας την πλήρη δύναμη του Babel.

*Περαιτέρω*, το Babel χωρίζεται σε διάφορες ενότητες πυρήνων που ο καθένας μπορεί να χρησιμοποιήσει για να χτίσει την επόμενη γενεά των εργαλείων JavaScript.

Πολλοί άνθρωποι το κάνουν αυτό και το οικοσύστημα που έχει ξεφυτρώσει γύρω από το Babel είναι τεράστιο και πολύ ετερογενές. Στον οδηγό αυτό θα καλύψω πώς τα ενσωματωμένα εργαλεία στο Babel λειτουργούν καθώς και μερικά χρήσιμα πράγματα που προέρχονται από την Κοινότητα.

> ***Για μελλοντικές ενημερώσεις ακολουθήστε τον [@thejameskyle](https://twitter.com/thejameskyle) στο Twitter.***

* * *

# <a id="toc-setting-up-babel"></a>Ρύθμιση του Babel

Δεδομένου ότι η Κοινότητα JavaScript δεν έχει κανένα single build tool, framework, πλατφόρμα, κ.λπ., το Babel έχει επίσημες ενσωματώσεις για όλα τα σημαντικά εργαλεία. Τα πάντα από το Gulp εως το Browserify, από το Ember μέχρι το Meteor, δεν έχει σημασία πως μοιάζει η εγκατάστασή σας καθώς υπάρχει πιθανώς μια επίσημη ένταξη.

Για τους σκοπούς του παρόντος οδηγού, πρόκειται απλώς να καλύψουμε τους ενσωματωμένους τρόπους για τη δημιουργία Babel, αλλά μπορείτε να επισκεφθείτε τη διαδραστική [σελίδα εγκατάστασης](http://babeljs.io/docs/setup) για όλες τις ενσωματώσεις.

> **Σημείωση:** Αυτός ο οδηγός θα αναφέρεται σε εργαλεία γραμμής εντολών όπως `node` και `npm`. Πριν πάτε παρακάτω θα πρέπει να αισθάνεστε άνετα με αυτά τα εργαλεία.

## <a id="toc-babel-cli"></a>`babel-cli`

Το CLI του Babel είναι ένας απλός τρόπος για τη μεταγλώττιση των αρχείων με Babel από τη γραμμή εντολών.

Ας το εγκαταστήσουμε αρχικά παγκόσμια στον υπολογιστή μας για να δούμε τα βασικά.

```sh
$ npm install --global babel-cli
```

Μπορούμε να συντάξουμε το πρώτο μας αρχείο ως εξής:

```sh
$ babel my-file.js
```

Αυτό θα αποτυπώσει το μεταγλωττισμένο αποτέλεσμα απευθείας στο τερματικό σας. Για να το γράψουμε σε ένα αρχείο θα πρέπει να καθορίσετε ένα `--out-file` ή `-o`.

```sh
$ babel example.js --out-file compiled.js
# ή
$ babel example.js -o compiled.js
```

Αν θέλουμε να μεταγλωττίσουμε έναν ολόκληρο κατάλογο σε έναν νέο κατάλογο, μπορούμε να το κάνουμε χρησιμοποιώντας `--out-dir` ή `-d`.

```sh
$ babel src --out-dir lib
# ή
$ babel src -d lib
```

### <a id="toc-running-babel-cli-from-within-a-project"></a>Λειτουργία του Babel CLI μέσα από ένα project

Ενώ *μπορείτε* να εγκαταστήσετε το Babel CLI παγκοσμίως στο μηχάνημά σας, είναι πολύ καλύτερo να το εγκαταστήσετε **σε τοπικό επίπεδο** σε κάθε σας project.

Υπάρχουν δύο βασικοί λόγοι για αυτό.

  1. Διαφορετικά projects στην ίδια μηχανή μπορεί να εξαρτώνται από διαφορετικές εκδόσεις του Βαβέλ, επιτρέποντάς σας να ενημερώσετε ένα κάθε φορά.
  2. Αυτό σημαίνει ότι δεν έχετε μια έμμεση εξάρτηση από το περιβάλλον σας. Κάνοντας έτσι το project σας πιο φορητό και εύκολο στην εγκατάσταση.

Μπορούμε να εγκαταστήσουμε το Babel CLI τοπικά εκτελώντας:

```sh
$ npm install --save-dev babel-cli
```

> **Σημείωση:** Δεδομένου ότι γενικά είναι κακή ιδέα να εκτελέσετε Βαβέλ σε παγκόσμιο επίπεδο, μπορεί να θέλετε να απεγκαταστήσετε το καθολικό αντίγραφο, εκτελώντας:
> 
> ```sh
$ npm uninstall --global babel-cli
```

Αφού ολοκληρωθεί η εγκατάσταση, το αρχείο `package.json` σας πρέπει να μοιάσει με αυτό:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "devDependencies": {
    "babel-cli": "^6.0.0"
  }
}
```

Τώρα, αντί να εκτελούμε το Babel απευθείας από τη γραμμή εντολών θα πάμε να θέσουμε τις εντολές μας σε **npm scripts** που θα χρησιμοποιούν την τοπική μας έκδοση.

Απλά προσθέστε ένα πεδίο `"scripts"` στο `package.json` και βάλτε την εντολή Babel στο εσωτερικό ως `build`.

```diff
  {
    "name": "my-project",
    "version": "1.0.0",
+   "scripts": {
+     "build": "babel src -d lib"
+   },
    "devDependencies": {
      "babel-cli": "^6.0.0"
    }
  }
```

Τώρα από τον τερματικό μπορούμε να τρέξουμε:

```js
npm run build
```

Αυτό θα εκτελέσει το Babel με τον ίδιο τρόπο όπως πριν, μόνο που τώρα χρησιμοποιούμε ένα τοπικό αντίγραφο.

## <a id="toc-babel-register"></a>`babel-register`

Η επόμενη πιο κοινή μέθοδος λειτουργίας του Babel είναι μέσω του `babel-register`. Αυτή η επιλογή θα σας επιτρέψει να εκτελέσετε το Babel μόνο απαιτώντας αρχεία, το οποίο μπορεί να ενσωματωθεί καλύτερα με τις ρυθμίσεις σας.

Σημειώστε ότι αυτό δεν προορίζεται για χρήση παραγωγής. Θεωρείται κακή πρακτική η ανάπτυξη κώδικα που μεταφράζεται με τον τρόπο αυτό. Είναι πολύ καλύτερο να μεταγλωττίσετε πριν από την ανάπτυξη. Ωστόσο, αυτό λειτουργεί αρκετά καλά για build scripts ή άλλα πράγματα που μπορείτε να εκτελέσετε σε τοπικό επίπεδο.

Ας δημιουργήσουμε αρχικά ένα `index.js` αρχείο στο project μας.

```js
console.log("Hello world!");
```

Εάν επρόκειτο να τρέξουμε αυτό με `node index.js` δεν θα να μεταγλωττιζόταν με Babel. Έτσι, αντί να κάνουμε αυτό, θα στήσουμε `babel-register`.

Πρώτα να εγκαταστήσετε `babel-register`.

```sh
$ npm install --save-dev babel-register
```

Στη συνέχεια, δημιουργήστε ένα αρχείο `register.js` μέσα στο project και γράψτε τον ακόλουθο κώδικα:

```js
require("babel-register");
require("./index.js");
```

Αυτό που κάνει είναι *registers* το Babel στο σύστημα ενότητας του Node και αρχίζει την μεταγλώτισση κάθε αρχείου που είναι `require`'d.

Τώρα, αντί να εκτελούμε `node index.js` μπορούμε να χρησιμοποιήσουμε `register.js`.

```sh
$ node register.js
```

> **Σημείωση:** Δεν μπορείτε να καταχωρήσετε Βαβέλ στο ίδιο αρχείο που θέλετε να μεταγλωττίσετε. Αυτό συμβαίνει επειδή το Node εκτελεί το αρχείο πριν το Babel έχει την ευκαιρία να το μεταγλωττίσεi.
> 
> ```js
require("babel-register");
// not compiled:
console.log("Hello world!");
```

## <a id="toc-babel-node"></a>`babel-node`

Εάν απλά εκτελείτε κώδικα μέσω του `node` CLI ο ευκολότερος τρόπος να ενσωματωθεί το Babel ίσως είναι να χρησιμοποιηθεί το `babel-node` CLI που σε μεγάλο βαθμό είναι αντικαταστάτης για το `node` CLI.

Σημειώστε ότι αυτό δεν προορίζεται για χρήση παραγωγής. Θεωρείται κακή πρακτική η ανάπτυξη κώδικα που μεταφράζεται με τον τρόπο αυτό. Είναι πολύ καλύτερο να μεταγλωττίσετε πριν από την ανάπτυξη. Ωστόσο, αυτό λειτουργεί αρκετά καλά για build scripts ή άλλα πράγματα που μπορείτε να εκτελέσετε σε τοπικό επίπεδο.

Πρώτα, βεβαιωθείτε ότι έχετε το `babel-cli` εγκατεστημένο.

```sh
$ npm install --save-dev babel-cli
```

> **Note:** If you are wondering why we are installing this locally, please read the [Running Babel CLI from within a project](#toc-running-babel-cli-from-within-a-project) section above.

Στη συνέχεια, αντικαταστήστε όπου εκτελείτε `node` με `babel-node`.

Εάν χρησιμοποιείτε npm `scripts`, μπορείτε απλά να κάνετε:

```diff
  {
    "scripts": {
-     "script-name": "node script.js"
+     "script-name": "babel-node script.js"
    }
  }
```

Διαφορετικά θα πρέπει να καταγράψετε τη διαδρομή στο `babel-node`.

```diff
- node script.js
+ ./node_modules/.bin/babel-node script.js
```

> Συμβουλή: Μπορείτε επίσης να χρησιμοποιήσετε [`npm-run`](https://www.npmjs.com/package/npm-run).

## <a id="toc-babel-core"></a>`babel-core`

Εάν χρειάζεστε να χρησιμοποιήσετε Βαβέλ προγραμματιστικά για κάποιο λόγο, μπορείτε να χρησιμοποιήσετε το ίδιο το πακέτο `babel-core`.

Πρώτα να εγκαταστήσετε `babel-core`.

```sh
$ npm install babel-core
```

```js
var babel = require("babel-core");
```

Αν έχετε μια σειρά από JavaScript μπορείτε να τη μεταγλωττίσετε απευθείας χρησιμοποιώντας `babel.transform`.

```js
babel.transform("code();", options);
// => { code, map, ast }
```

Εάν εργάζεστε με αρχεία, μπορείτε να χρησιμοποιήσετε είτε το ασύγχρονο api:

```js
babel.transformFile("filename.js", options, function(err, result) {
  result; // => { code, map, ast }
});
```

Ή το σύγχρονο api:

```js
babel.transformFileSync("filename.js", options);
// => { code, map, ast }
```

Αν έχετε ήδη μια Babel AST για οποιοδήποτε λόγο μπορείτε να τη μετατρέψετε από την AST άμεσα.

```js
babel.transformFromAst(ast, code, options);
// => { code, map, ast }
```

For all of the above methods, `options` refers to https://babeljs.io/docs/usage/api/#options.

* * *

# <a id="toc-configuring-babel"></a>Ρυθμίζοντας το Babel

Μπορεί να έχετε παρατηρήσει από τώρα ότι τρέχοντας Babel από μόνο του δεν φαίνεται να κάνει οτιδήποτε άλλο εκτός από να αντιγράφει JavaScript αρχεία από μία θέση σε άλλη.

Αυτό είναι επειδή δεν το έχουμε πει στο Babel να κάνει τίποτα ακόμα.

> Δεδομένου ότι το Babel είναι γενικής χρήσης μεταγλωττιστής που χρησιμοποιείται σε πληθώρα διαφορετικών τρόπων, δεν κάνει τίποτα από προεπιλογή. Πρέπει να πείτε στο Babel τι έχει να κάνει.

Μπορείτε να δώσετε οδηγίες Βαβέλ για το τι να κάνει με την εγκατάσταση **plugins** ή **presets** (Γκρουπ plugins).

## <a id="toc-babelrc"></a>`.babelrc`

Πριν ξεκινήσουμε να λέμε στο Babel τι να κάνει πρέπει να δημιουργήσουμε ένα αρχείο ρύθμισης παραμέτρων. Το μόνο που χρειάζεται να κάνετε είναι να δημιουργήσετε ένα αρχείο `.babelrc` στη ρίζα του έργου σας. Ξεκινήστε ως εξής:

```js
{
  "presets": [],
  "plugins": []
}
```

Το αρχείο αυτό είναι πώς ρυθμίζετε το Babel για να το κάνεi αυτό που θέλετε.

> **Σημείωση:** Ενώ μπορείτε να περάσετε επίσης επιλογές στο Babel με άλλους τρόπους, το αρχείο `.babelrc` είναι σύμβαση και είναι ο καλύτερος τρόπος.

## <a id="toc-babel-preset-es2015"></a>`babel-preset-es2015`

Ας ξεκινήσουμε λέγοντας στο Babel να μεταγλωττίζει ES2015 (την τελευταία έκδοση του προτύπου JavaScript, επίσης γνωστή ως ES6) σε ES5 (διαθέσιμο στα περισσότερα περιβάλλοντα JavaScript σήμερα).

Θα κάνουμε αυτό εγκαθιστώντας τις "es2015" Babel προκαθορισμένες:

```sh
$ npm install --save-dev babel-preset-es2015
```

Στη συνέχεια θα τροποποιήσουμε το `.babelrc` για να συμπεριλάβει την προκαθορισμένη.

```diff
  {
    "presets": [
+     "es2015"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-react"></a>`babel-preset-react`

Η ρύθμιση React είναι εξίσου εύκολη. Απλά εγκαταστήστε την προκαθορισμένη:

```sh
$ npm install --save-dev babel-preset-react
```

Στη συνέχεια, προσθέστε την προκαθορισμένη στο αρχείο `.babelrc`:

```diff
  {
    "presets": [
      "es2015",
+     "react"
    ],
    "plugins": []
  }
```

## <a id="toc-babel-preset-stage-x"></a>`babel-preset-stage-x`

Η JavaScript έχει επίσης ορισμένες προτάσεις μέσα από την TC39 (η τεχνική επιτροπή πίσω από το ECMAScript πρότυπο) διαδικασία.

Έχουμε σπάσει αυτήν την διαδικασία σε 5 στάδια (0-4). Αφού οι προτάσεις κερδίζουν περισσότερη έλξη και είναι πιο πιθανό να γίνουν δεκτές στο standard, προχωρούν στα διάφορα στάδια, ώσπου τελικά γίνονται δεκτές στο στάδιο 4.

Αυτές ομαδοποιούνται στο Babel ως 4 διαφορετικές προεπιλογές:

  * `babel-preset-stage-0`
  * `babel-preset-stage-1`
  * `babel-preset-stage-2`
  * `babel-preset-stage-3`

> Σημειώστε ότι δεν υπάρχει κανένα στάδιο-4, δεδομένου ότι είναι απλά οι `es2015` προκαθορισμένες παραπάνω.

Κάθε μία από αυτές τις προεπιλογές απαιτεί την προκαθορισμένη ρύθμιση για τα προχωρημένα στάδια. δηλαδή η `babel-preset-stage-1` απαιτεί `babel-preset-stage-2` που απαιτεί `babel-preset-stage-3`.

Απλά εγκαταστήστε το στάδιο το οποίο ενδιαφέρεστε να χρησιμοποιήσετε:

```sh
$ npm install --save-dev babel-preset-stage-2
```

Στη συνέχεια, μπορείτε να το προσθέσετε στο αρχείο config `.babelrc`.

```diff
  {
    "presets": [
      "es2015",
      "react",
+     "stage-2"
    ],
    "plugins": []
  }
```

* * *

# <a id="toc-executing-babel-generated-code"></a>Εκτέλεση του παραγώμενου κώδικα απο το Babel

Έτσι έχετε μεταγλωττίσει τον κωδικό σας με Babel, αλλά αυτό δεν είναι το τέλος της ιστορίας.

## <a id="toc-babel-polyfill"></a>`babel-polyfill`

Σχεδόν όλη η φουτουριστική JavaScript σύνταξη μπορεί να μεταγλωττιστεί με Babel, αλλά το ίδιο δεν ισχύει για τα API.

Για παράδειγμα, ο ακόλουθος κώδικας έχει μια arrow λειτουργία που πρέπει να μεταγλωττιστεί:

```js
function addAll() {
  return Array.from(arguments).reduce((a, b) => a + b);
}
```

Που μετατρέπεται σε αυτό:

```js
function addAll() {
  return Array.from(arguments).reduce(function(a, b) {
    return a + b;
  });
}
```

Ωστόσο, αυτό δεν θα λειτουργεί ακόμα παντού επειδή δεν υπάρχει `Array.from` σε κάθε περιβάλλον JavaScript.

    Uncaught TypeError: Array.from is not a function
    

Για να λύσουμε αυτό το πρόβλημα μπορούμε να χρησιμοποιήσουμε κάτι που ονομάζεται [Polyfill](https://remysharp.com/2010/10/08/what-is-a-polyfill). Με απλά λόγια, ένα polyfill είναι ένα κομμάτι του κώδικα που αναπαράγει ένα native api που δεν υπάρχει στο τρέχον χρόνο εκτέλεσης. Επιτρέποντάς σας να χρησιμοποιήσετε API, όπως `Array.from` πριν να είναι διαθέσιμα.

Το Babel χρησιμοποιεί το εξαιρετικό [core-js](https://github.com/zloirock/core-js) ως polyfill του, μαζί με ένα προσαρμοσμένο [regenerator](https://github.com/facebook/regenerator) για να κάνει γεννήτριες και ασύγχρονες λειτουργίες εργασίας να δουλεύουν.

Για να συμπεριλάβετε το Babel polyfill, πρώτα εγκαταστήστε το με npm:

```sh
$ npm install --save babel-polyfill
```

Στη συνέχεια, απλώς συμπεριλάβετε το polyfill στην κορυφή του κάθε αρχείου που το χρειάζεται:

```js
import "babel-polyfill";
```

## <a id="toc-babel-runtime"></a>`babel-runtime`

Προκειμένου να υλοποιηθούν λεπτομέρειες σχετικά με ECMAScript specs, το Babel θα χρησιμοποιήσει «βοηθητικές» μεθόδους για να κρατήσει καθαρό κώδικα που δημιουργείται.

Δεδομένου ότι αυτές οι βοηθητικές μέθοδοι μπορούν να γίνουν αρκετά εκτενή, και προστίθενται στην κορυφή του κάθε αρχείου, μπορείτε να τα μετακινήσετε σε ένα ενιαίο «χρόνο εκτέλεσης» που παίρνει την απαιτούμενη.

Ξεκινήστε εγκαθιστώντας `babel-plugin-transform-runtime` και `babel-runtime`:

```sh
$ npm install --save-dev babel-plugin-transform-runtime
$ npm install --save babel-runtime
```

Στη συνέχεια να ενημερώσετε το `.babelrc`:

```diff
  {
    "plugins": [
+     "transform-runtime",
      "transform-es2015-classes"
    ]
  }
```

Τώρα το Babel θα μεταγλωττίσει κώδικα ως εξής:

```js
class Foo {
  method() {}
}
```

Σε αυτό:

```js
import _classCallCheck from "babel-runtime/helpers/classCallCheck";
import _createClass from "babel-runtime/helpers/createClass";

let Foo = function () {
  function Foo() {
    _classCallCheck(this, Foo);
  }

  _createClass(Foo, [{
    key: "method",
    value: function method() {}
  }]);

  return Foo;
}();
```

Αντί να βάλουμε τους `_classCallCheck` και `_createClass` βοηθούς σε κάθε ενιαίο αρχείο εκεί που χρειάζονται.

* * *

# <a id="toc-configuring-babel-advanced"></a>Ρυθμίζοντας το Babel (για προχωρημένους)

Οι περισσότεροι άνθρωποι μπορούν να κάνουν τη δουλειά τους χρησιμοποιώντας το Babel μόνο με τις ενσωματωμένες προεπιλογές, αλλά το Babel μπορεί να παρέχει πολλή περισσότερη δύναμη από αυτό.

## <a id="toc-manually-specifying-plugins"></a>Χειροκίνητος καθορισμός βυσμάτων (plugins)

Οι προεπιλογές του Babel είναι απλά συλλογές των προ-ρυθμισμένων plugins, αν θέλετε να κάνετε κάτι διαφορετικό μπορείτε να καθορίσετε οι ίδιοι τα plugins. Αυτό λειτουργεί σχεδόν ακριβώς με τον ίδιο τρόπο όπως οι προκαθορισμένες ρυθμίσεις.

Πρώτα να εγκαταστήσετε ένα plugin:

```sh
$ npm install --save-dev babel-plugin-transform-es2015-classes
```

Στη συνέχεια, προσθέστε το πεδίο `plugins` στο `.babelrc`.

```diff
  {
+   "plugins": [
+     "transform-es2015-classes"
+   ]
  }
```

Αυτό σας δίνει πολύ λεπτομερές έλεγχο πάνω στους μετασχηματισμούς που εκτελείτε.

Για να δείτε μια πλήρη λίστα των επίσημων plugins ανατρέξτε στη [σελίδα Babel Plugins](http://babeljs.io/docs/plugins/).

Επίσης ρίξτε μια ματιά σε όλα τα plugins που έχουν [κατασκευαστεί από την Κοινότητα](https://www.npmjs.com/search?q=babel-plugin). Αν θα θέλατε να μάθετε πώς να γράψετε τα δικά σας plugins διαβάστε το [Εγχειρίδιο Babel Plugin](plugin-handbook.md).

## <a id="toc-plugin-options"></a>Επιλογές βυσμάτων (plugins)

Πολλά plugins, επίσης, έχουν επιλογές ρύθμισης των παραμέτρων τους ώστε να συμπεριφέρονται διαφορετικά. Για παράδειγμα, πολλοί μετασχηματισμοί έχουν ένα «χαλαρό» mode, το οποίο δεν περιέχει κάποια spec, συμπεριφορά που ευνοεί απλούστερο και περισσότερο αποδοτικό κώδικα που δημιουργείται.

Για να προσθέσετε επιλογές σε ένα plugin, απλά κάνετε τις παρακάτω αλλαγές:

```diff
  {
    "plugins": [
-     "transform-es2015-classes"
+     ["transform-es2015-classes", { "loose": true }]
    ]
  }
```

> Θα εργάζομαι σε ενημερωμένες εκδόσεις για τα plugins ώστε να αποδώσω κάθε λεπτομέρεια στις επιλογές που παρέχουν τις επόμενες εβδομάδες. [Ακολουθήστε με για ενημερωμένες εκδόσεις](https://twitter.com/thejameskyle).

## <a id="toc-customizing-babel-based-on-environment"></a>Ρυθμίζοντας το Babel βασιζόμενος στο περιβάλλον

Τα Babel plugins δίνουν λύσεις σε πολλές διαφορετικές εργασίες. Πολλά από αυτά είναι εργαλεία ανάπτυξης που μπορούν να σας βοηθήσουν για τον εντοπισμό σφαλμάτων στον κώδικά σας ή να ενσωματώσετε με εργαλεία. Υπάρχουν επίσης πολλά plugins που προορίζονται για τη βελτιστοποίηση τον κωδικό σας στην παραγωγή.

Για το λόγο αυτό, είναι κοινό να θέλετε ρύθμισης παραμέτρων Babel με βάση το περιβάλλον. Μπορείτε να κάνετε αυτό εύκολα με το αρχείο `.babelrc`.

```diff
  {
    "presets": ["es2015"],
    "plugins": [],
+   "env": {
+     "development": {
+       "plugins": [...]
+     },
+     "production": {
+       "plugins": [...]
+     }
    }
  }
```

Το Babel θα επιτρέψει τη διαμόρφωση στο εσωτερικό `env` με βάση το τρέχον περιβάλλον.

Στο συγκεκριμένο περιβάλλον θα χρησιμοποιήσει `process.env.BABEL_ENV`. Όταν το `BABEL_ENV` δεν είναι διαθέσιμο, θα επιστρέψει στο `NODE_ENV`, και αν αυτό δεν είναι διαθέσιμο θα πάει στην προεπιλογή `"development"`.

**Unix**

```sh
$ BABEL_ENV=production [COMMAND]
$ NODE_ENV=production [COMMAND]
```

**Windows**

```sh
$ SET BABEL_ENV=production
$ [COMMAND]
```

> **Σημείωση:** `[COMMAND]` είναι ό, τι χρησιμοποιείτε για να εκτελέσετε το Babel (πχ. `babel`, `babel-node`, ή ίσως απλά `node` εάν χρησιμοποιείτε το register hook).
> 
> **Συμβουλή:** Αν θέλετε οι εντολές σας να λειτουργούν σε όλες τις πλατφόρμες unix και windows χρησιμοποιήστε [`cross-env`](https://www.npmjs.com/package/cross-env).

## <a id="toc-making-your-own-preset"></a>Φτιάχνοντας τη δική σου προεπιλογή

Χειροκίνητος καθορισμός plugins; Επιλογές plugin; Ρυθμίσεις βασισμένες στο περιβάλλον; Όλη αυτή η ρύθμιση παραμέτρων μπορεί να φαίνεται σαν να δίνει έναν τόνο της επανάληψης σε όλα τα projects σας.

Για το λόγο αυτό, ενθαρρύνουμε την Κοινότητα να δημιουργεί τις δικές της προεπιλογές. Αυτό θα μπορούσε να είναι μια προκαθορισμένη ρύθμιση για τo συγκεκριμένo [node version](https://github.com/leebenson/babel-preset-node5) που εκτελείτε, ή ίσως μια προκαθορισμένη ρύθμιση για [ολόκληρη](https://github.com/cloudflare/babel-preset-cf) την [εταιρεία](https://github.com/airbnb/babel-preset-airbnb).

Είναι εύκολο να δημιουργήσετε μια προκαθορισμένη ρύθμιση. Ας πούμε ότι έχετε αυτό το αρχείο `.babelrc`:

```js
{
  "presets": [
    "es2015",
    "react"
  ],
  "plugins": [
    "transform-flow-strip-types"
  ]
}
```

Το μόνο που χρειάζεται να κάνετε είναι να δημιουργήστε ένα νέο project με τη σύμβαση ονομασίας `babel-preset-*` (παρακαλώ να είστε υπεύθυνοι με αυτόν το χώρο ονομάτων), και να δημιουργήσετε δύο αρχεία.

Πρώτα, μπορείτε να δημιουργήσετε ένα νέο αρχείο `package.json` με τις απαραίτητες `dependencies` για την προκαθορισμένη.

```js
{
  "name": "babel-preset-my-awesome-preset",
  "version": "1.0.0",
  "author": "James Kyle <me@thejameskyle.com>",
  "dependencies": {
    "babel-preset-es2015": "^6.3.13",
    "babel-preset-react": "^6.3.13",
    "babel-plugin-transform-flow-strip-types": "^6.3.15"
  }
}
```

Στη συνέχεια, δημιουργήστε ένα αρχείο `index.js` που εξάγει το περιεχόμενο του αρχείου `.babelrc`, αντικαθιστώντας το plugin/preset strings με `require` κλήσεις.

```js
module.exports = {
  presets: [
    require("babel-preset-es2015"),
    require("babel-preset-react")
  ],
  plugins: [
    require("babel-plugin-transform-flow-strip-types")
  ]
};
```

Στη συνέχεια απλά το δημοσιεύετε στο npm και μπορείτε να το χρησιμοποιήσετε όπως θα κάνατε με οποιοδήποτε προκαθορισμένη.

* * *

# <a id="toc-babel-and-other-tools"></a>Babel και άλλα εργαλεία

Το Babel είναι αρκετά απλό να στήσετε μόλις πάρετε μια ιδέα, αλλά μπορεί να είναι δύσκολη η πλοήγηση στο πώς να το ρυθμίσετε με άλλα εργαλεία. Ωστόσο, προσπαθούμε να συνεργαζόμαστε στενά με άλλα έργα, προκειμένου η εμπειρία να είναι όσο πιο εύκολη γίνεται.

## <a id="toc-static-analysis-tools"></a>Εργαλεία στατικής ανάλυσης

Νεώτερα πρότυπα φέρνουν νέα σύνταξη της γλώσσας και τα εργαλεία στατικής ανάλυσης μόλις τώρα αρχίζουν να επωφελούνται από αυτό.

### <a id="toc-linting"></a>Linting

Ένα από τα πιο δημοφιλή εργαλεία για linting είναι [ESLint](http://eslint.org), για το λόγο αυτό διατηρούμε μια επίσημη [`babel-eslint`](https://github.com/babel/babel-eslint) ολοκλήρωση.

Πρώτα να εγκαταστήσετε `eslint` και `babel-eslint`.

```sh
$ npm install --save-dev eslint babel-eslint
```

Ύστερα να δημιουργήσετε ή να χρησιμοποιήσετε το υπάρχον αρχείο `.eslintrc` στο project σας και να ορίσετε το `parser` ως `babel-eslint` .

```diff
  {
+   "parser": "babel-eslint",
    "rules": {
      ...
    }
  }
```

Τώρα μπορείτε να προσθέσετε μια εργασία `lint` στα npm `package.json` σενάρια:

```diff
  {
    "name": "my-module",
    "scripts": {
+     "lint": "eslint my-files.js"
    },
    "devDependencies": {
      "babel-eslint": "...",
      "eslint": "..."
    }
  }
```

Στη συνέχεια, απλά εκτελέστε την εργασία και θα είναι όλα έτοιμα.

```sh
$ npm run lint
```

Για περισσότερες πληροφορίες συμβουλευτείτε την τεκμηρίωση του [`babel-eslint`](https://github.com/babel/babel-eslint) ή [`eslint`](http://eslint.org).

### <a id="toc-code-style"></a>Στυλ κώδικα

> JSCS has merged with ESLint, so checkout Code Styling with ESLint.

Το JSCS είναι ένα εξαιρετικά δημοφιλές εργαλείο για να πάτε το linting ένα βήμα παραπέρα στον έλεγχο του στυλ του ίδιου του κώδικα. Ένας κύριος συντηρητής του Babel και των JSCS projects ([@hzoo](https://github.com/hzoo)) διατηρεί την επίσημη ενσωμάτωση με JSCS.

Ακόμα καλύτερα, αυτή η ολοκλήρωση τώρα ζει μέσα στο JSCS το ίδιο υπό την `--esnext` επιλογή. Έτσι η ενσωμάτωση του Babel γίνεται τόσο απλά:

    $ jscs . --esnext
    

Από το cli, ή προσθέτοντας την επιλογή `esnext` στο αρχείο `.jscsrc`.

```diff
  {
    "preset": "airbnb",
+   "esnext": true
  }
```

Για περισσότερες πληροφορίες συμβουλευτείτε την τεκμηρίωση του [`babel-eslint`](https://github.com/babel/babel-eslint) ή [`eslint`](http://eslint.org).

<!--
### Code Coverage

> [WIP]
-->

### <a id="toc-documentation"></a>Τεκμηρίωση

Χρησιμοποιώντας Babel, ES2015 και Flow μπορείτε να συμπεράνετε πολλά σχετικά με τον κώδικά σας. Χρησιμοποιώντας το [documentation.js](http://documentation.js.org) μπορείτε να δημιουργήσετε πολύ εύκολα αναλυτική τεκμηρίωση API.

Το documentation.js χρησιμοποιεί το Babel στο παρασκήνιο για την υποστήριξη όλων των την σύνταξεων συμπεριλαμβανομένων Flow annotations για τη δήλωση των τύπων στον κώδικά σας.

## <a id="toc-frameworks"></a>Πλαισια (Frameworks)

Όλα τα μεγάλα JavaScript frameworks εστιάζουν τώρα στην ευθυγράμμιση των APIs γύρω από το μέλλον της γλώσσας. Για το λόγο αυτό, έχει υπάρξει πολλή δουλειά πάνω στο tooling.

Τα φrameworks έχουν την ευκαιρία όχι μόνο να χρησιμοποιούν Babel αλλά να το επεκτείνουν με τρόπους που να βελτιώνουν την εμπειρία των χρηστών τους.

### <a id="toc-react"></a>React

Το React έχει αλλάξει δραματικά τα API του για να ευθυγραμμιστεί με τις ES2015 τάξεις ([Διαβάστε για το ενημερωμένο API εδώ](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)). Ακόμη περισσότερο, το React βασίζεται στο Babel για τη μεταγλώττιση του JSX συντακτικού, αποδοκιμάζοντας τα δικά του εργαλεία σε σχέση με το Babel. Μπορείτε να ξεκινήσετε με τη δημιουργία του πακέτου `babel-preset-react` ακολουθώντας τις [οδηγίες παραπάνω](#babel-preset-react).

Η κοινότητα του React πήρε το Babel και έφτιαξε μια σειρά μετασχηματισμών που μπορείτε να [διαβάσετε εδώ](https://www.npmjs.com/search?q=babel-plugin+react).

Κυρίως το plugin [`babel-plugin-react-transform`](https://github.com/gaearon/babel-plugin-react-transform) που σε συνδυασμό με μια σειρά από [React-specific transforms](https://github.com/gaearon/babel-plugin-react-transform#transforms) μπορεί να ενεργοποιεί πράγματα όπως *hot module reloading* και άλλα βοηθητικά προγράμματα εντοπισμού σφαλμάτων.

<!--
### Ember

> [WIP]
-->

## <a id="toc-text-editors-and-ides"></a>Κειμενογράφοι και IDEs

Η εισαγωγή ES2015, JSX και σύνταξη Flow με Babel μπορεί να είναι χρήσιμη, αλλά αν δεν το υποστηρίζει το πρόγραμμα επεξεργασίας κειμένου μπορεί να είναι μια πραγματικά κακή εμπειρία. Για το λόγο αυτό, θα θέλετε να στήσετε τα πρόγραμμα επεξεργασίας κειμένου ή IDE με ένα Babel plugin.

  * [Sublime Text](https://github.com/babel/babel-sublime)
  * [Atom](https://atom.io/packages/language-babel)
  * [Vim](https://github.com/jbgutierrez/vim-babel)
  * [WebStorm](https://babeljs.io/docs/setup/#webstorm)

<!--
# Debugging Babel

> [WIP]
-->

* * *

# <a id="toc-babel-support"></a>Υποστήριξη του Babel

Το Babel έχει μια πολύ μεγάλη και ταχέως αυξανόμενη κοινότητα, όπως μεγαλώνουμε θέλουμε να εξασφαλίσουμε ότι οι άνθρωποι έχουν όλους τους πόρους που χρειάζονται για να είναι επιτυχής. Για αυτό παρέχουμε έναν αριθμό διαφορετικών καναλιών για να έχετε υποστήριξη.

Να θυμάστε ότι σε όλες αυτές τις κοινότητες μπορούμε να επιβάλουμε έναν [Κώδικα δεοντολογίας](https://github.com/babel/babel/blob/master/CODE_OF_CONDUCT.md). Αν σπάσει ο κώδικας δεοντολογίας, θα ληφθούν μέτρα. Έτσι παρακαλούμε να τον διαβάσετε και να τον θυμάστε κατά την αλληλεπίδραση με άλλους.

Θέλουμε επίσης να χτίσουμε μια self-supporting κοινότητα, για τους ανθρώπους που υπάρχουν καιρό και βοηθάνε τα άλλα μέλη. Αν βρείτε κάποιον να ρωτάει κάτι το οποίο ξέρετε να απαντήσετε, πάρτε μερικά λεπτά και βοηθήστε τον. Προσπαθήστε να είστε όσο πιο ευγενικοί γίνεται.

## <a id="toc-babel-forum"></a>Φόρουμ του Babel

Το [Discourse](http://www.discourse.org) μας έχει εφοδιάσει με ηλεκτρονική έκδοση του λογισμικού τους φόρουμ δωρεάν (και τους αγαπάμε για αυτό!). Αν σας αρέσουν τα φόρουμ παρακαλώ ρίξτε μια ματιά στο [discuss.babeljs.io](https://discuss.babeljs.io).

## <a id="toc-babel-chat"></a>Χώρος Συνομιλίας Babel

Όλοι αγαπούν [Slack](https://slack.com). Αν ψάχνετε για άμεση υποστήριξη από την κοινότητα τότε επικοινωνήστε μαζί μας στο [slack.babeljs.io](https://slack.babeljs.io).

<!--
## Babel Stack Overflow

> [WIP]
-->

## <a id="toc-babel-issues"></a>Προβλήματα με το Babel

Babel uses the issue tracker provided by [Github](http://github.com).

You can see all the open and closed issues on [Github](https://github.com/babel/babel/issues).

Εάν θέλετε να ανοίξετε ένα νέο θέμα:

  * [Αναζήτηση για ένα υπάρχον θέμα](https://github.com/babel/babel/issues)
  * [Create a new bug report](https://github.com/babel/babel/issues/new) or [request a new feature](https://github.com/babel/babel/issues/new)

### <a id="toc-creating-an-awesome-babel-bug-report"></a>Δημιουργούντας μια καταπληκτική αναφορά σφάλματος για το Babel

Τα Babel θέματα μπορεί να είναι μερικές φορές πολύ δύσκολο να εντοπιστούν εξ αποστάσεως, έτσι χρειαζόμαστε όλη τη βοήθεια που μπορούμε να πάρουμε. Δαπανώντας μερικά παραπάνω λεπτά γράφοντας μια καλή αναφορά θέματος μπορεί να βοηθήσει να βρεθεί λύση στο πρόβλημά σας αισθητά πιο γρήγορα.

Πρώτα, δοκιμάστε απομονώνοντας το πρόβλημά σας. Είναι εξαιρετικά απίθανο ότι κάθε τμήμα της εγκατάστασης σας συμβάλλει στο πρόβλημα. Εάν το πρόβλημά σας είναι ένα κομμάτι του κώδικα εισόδου, προσπαθήστε να διαγράψετε όσο κώδικα όσο το δυνατόν που προκαλεί ακόμα ένα θέμα.

> [WIP]

* * *

> ***Για μελλοντικές ενημερώσεις ακολουθήστε τον [@thejameskyle](https://twitter.com/thejameskyle) στο Twitter.***