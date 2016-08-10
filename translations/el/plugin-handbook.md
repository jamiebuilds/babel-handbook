# Babel: Εγχειρίδιο για νέους χρήστες

Το παρόν έγγραφο καλύπτει πώς να δημιουργήσετε [Babel](https://babeljs.io) [plugins](https://babeljs.io/docs/advanced/plugins/).

[![cc-by-4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](http://creativecommons.org/licenses/by/4.0/)

Το εγχειρίδιο αυτό είναι διαθέσιμο και σε άλλες γλώσσες, δείτε στο [README](/README.md) τις υπόλοιπες γλώσσες.

# ΠΙΝΑΚΑΣ ΠΕΡΙΕΧΟΜΕΝΩΝ

  * [Εισαγωγή](#toc-introduction)
  * [Βασικά](#toc-basics) 
      * [ASTs](#toc-asts)
      * [Στάδια του Babel](#toc-stages-of-babel)
      * [Ανάλυση](#toc-parse) 
          * [Λεξικολογική Ανάλυση](#toc-lexical-analysis)
          * [Συντακτική Ανάλυση](#toc-syntactic-analysis)
      * [Μετατροπή](#toc-transform)
      * [Παραγωγή](#toc-generate)
      * [Διάσχιση](#toc-traversal)
      * [Επισκέπτες](#toc-visitors)
      * [Καθοδήγηση](#toc-paths) 
          * [Καθοδήγηση για τους επισκέπτες](#toc-paths-in-visitors)
      * [Κατάσταση](#toc-state)
      * [Εμβέλειες](#toc-scopes) 
          * [Συνδέσεις](#toc-bindings)
  * [Διασύνδεση Προγραμματισμού Εφαρμογών](#toc-api) 
      * [babylon](#toc-babylon)
      * [babel-traverse](#toc-babel-traverse)
      * [babel-types](#toc-babel-types)
      * [Ορισμοί](#toc-definitions)
      * [Οικοδόμοι](#toc-builders)
      * [Διαδικασίες επικύρωσης](#toc-validators)
      * [Μετατροπείς](#toc-converters)
      * [babel-generator](#toc-babel-generator)
      * [babel-template](#toc-babel-template)
  * [Γράφοντας το πρώτο σας Babel Plugin](#toc-writing-your-first-babel-plugin)
  * [Λειτουργίες μετατροπής](#toc-transformation-operations) 
      * [Επισκεψιμότητα](#toc-visiting)
      * [Ελέγξτε αν ο κόμβος ανήκει σε κάποιο συγκεκριμένο είδος](#toc-check-if-a-node-is-a-certain-type)
      * [Ελέγξτε αν αναφέρεται κάποια άλλη ταυτοποίηση](#toc-check-if-an-identifier-is-referenced)
      * [Χειρισμός](#toc-manipulation)
      * [Αντικατάσταση κόμβου](#toc-replacing-a-node)
      * [Αντικατάσταση κόμβου με πολλούς κόμβους](#toc-replacing-a-node-with-multiple-nodes)
      * [Αντικατάσταση κόμβου με πηγαία στοιχειοσειρά](#toc-replacing-a-node-with-a-source-string)
      * [Εισαγωγή όμοιου κόμβου](#toc-inserting-a-sibling-node)
      * [Αφαίρεση κόμβου](#toc-removing-a-node)
      * [Αντικατάσταση κόμβου](#toc-replacing-a-parent)
      * [Αφαίρεση γονικής μονάδας](#toc-removing-a-parent)
      * [Πλαίσια](#toc-scope)
      * [Έλεγχος σύνδεσης τοπικής μεταβλητής ](#toc-checking-if-a-local-variable-is-bound)
      * [Κατασκευή αναγνωριστικού χρήστη](#toc-generating-a-uid)
      * [Πιέστε τη δήλωση μεταβλητής σε ένα γονικό πεδίο](#toc-pushing-a-variable-declaration-to-a-parent-scope)
      * [Μετονομάσετε μια δέσμευση και τις αναφορές της](#toc-rename-a-binding-and-its-references)
  * [Επιλογές βυσμάτων (plugins)](#toc-plugin-options)
  * [Χτίζοντας Nodes](#toc-building-nodes)
  * [Βέλτιστες πρακτικές](#toc-best-practices) 
      * [Αποφύγετε όσο το δυνατόν την διάσχιση των AST](#toc-avoid-traversing-the-ast-as-much-as-possible)
      * [Συγχωνεύστε τους επισκέπτες οπότε είναι δυνατό](#toc-merge-visitors-whenever-possible)
      * [Μην εκτελείτε την διαδικασία διάσχισης όταν εκτελείται χειροκίνητη αναζήτηση](#toc-do-not-traverse-when-manual-lookup-will-do)
      * [Βελτιστοποίηση των ένθετων επισκέπτών](#toc-optimizing-nested-visitors)
      * [Έχοντας επίγνωση των ένθετων δομών](#toc-being-aware-of-nested-structures)

# <a id="toc-introduction"></a>Εισαγωγή

Το Babel είναι ένας γενικός μεταγλωττιστής πολλών χρήσεων για JavaScript. Πιο συγκεκριμένα, είναι μια συλλογή από ενότητες οι οποίες μπορούν να χρησιμοποιηθούν σε διαφορετικές μορφές στατικής ανάλυσης.

> Στατική ανάλυση είναι η διαδικασία ανάλυσης του κώδικα χωρίς την εκτέλεση του. (Η ανάλυση του κώδικα κατα τη διάρκεια της εκτέλεσης του είναι γνωστή και ως δυναμική ανάλυση). Ο σκοπός της στατικής ανάλυσης ποικίλλει. Μπορεί να χρησιμοποιηθεί για καθάρισμα (linting), μεταγλώττιση, έμφαση (hightlighting), διαμόρφωση, βελτιστοποίηση, σμίκρυνση και πολλά άλλα.

Μπορείτε να χρησιμοποιήσετε το Babel για να κατασκευάσετε πολλούς διαφορετικούς τύπους εργαλείων τα οποία μπορούν να σας βοηθήσουν να γίνετε πιο παραγωγικοί και να γράφετε καλύτερα προγράμματα.

> ***Για μελλοντικές ενημερώσεις μπορείτε να ακολουθήσετε τον [@thejameskyle](https://twitter.com/thejameskyle) στο Twitter.***

* * *

# <a id="toc-basics"></a>Βασικά στοιχεία

Το Babel είναι ένας μεταγλωττιστής για JavaScript, πιο συγκεκριμένα ένας μεταγλωττιστής από πηγαίο κώδικα σε πηγαίο κωδικα, συχνά αποκαλούμενο «transpiler». Αυτό σημαίνει ότι δίνοντας στο Babel κάποιο κώδικα JavaScript, αυτό τροποποιεί τον κώδικα και παράγει ένα νέο κώδικα.

## <a id="toc-asts"></a>AST

Κάθενα από τα βήματα συμπεριλαμβάνουν την δημιουργία ή χρήση μιας [Abstract Syntax Tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) εν συντομία AST.

> Το Babel χρησιμοποιεί ένα AST τροποποιημένο από το [ESTree](https://github.com/estree/estree), για το οποίο οι λεπτομέρειες του βρίσκονται [εδώ](https://github.com/babel/babel/blob/master/doc/ast/spec.md).

```js
function square(n) {
  return n * n;
}
```

> Ρίξτε μια ματιά στο [AST Explorer](http://astexplorer.net/) για να πάρετε μια καλύτερη αίσθηση των AST nodes. [Εδώ](http://astexplorer.net/#/Z1exs6BWMq) θα βρείτε ένα παράδειγμα που περιέχει τον παραπάνω κώδικα.

Το ίδιο πρόγραμμα μπορεί να αναπαρασταθεί ως μια λίστα ως εξής:

```md
- FunctionDeclaration:
  - id:
    - Identifier:
      - name: square
  - params [1]
    - Identifier
      - name: n
  - body:
    - BlockStatement
      - body [1]
        - ReturnStatement
          - argument
            - BinaryExpression
              - operator: *
              - left
                - Identifier
                  - name: n
              - right
                - Identifier
                  - name: n
```

Ή ως ένα αντικείμενο JavaScript όπως αυτό:

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```

Θα παρατηρήσετε ότι κάθε επίπεδο του AST έχει παρόμοια δομή:

```js
{
  type: "FunctionDeclaration",
  id: {...},
  params: [...],
  body: {...}
}
```

```js
{
  type: "Identifier",
  name: ...
}
```

```js
{
  type: "BinaryExpression",
  operator: ...,
  left: {...},
  right: {...}
}
```

> Σημείωση: Ορισμένες ιδιότητες έχουν αφαιρεθεί για απλότητα.

Κάθενα από αυτά είναι γνωστό ως **Node**. Ένα AST μπορεί να σχηματιστεί από ένα μόνο Node ή από εκατοντάδες αν όχι χιλιάδες Nodes. Μαζί είναι σε θέση να περιγράψουν την σύνταξη ενός προγράμματος, το οποίο μπορεί να χρησιμοποιηθεί για στατική ανάλυση.

Κάθε Node έχει αυτή τη μορφή:

```typescript
interface Node {
  type: string;
}
```

To πέδιο `type` είναι τύπου string και αντιπροσωπεύει τον τύπο του Νοδε, δηλαδή `"FunctionDeclaration"`, `"Identifier"`, ή `"BinaryExpression"`). Κάθε τύπος Node ορίζει ένα πρόσθετο σύνολο από ιδιότητες, οι οποίες περιγράφουν το συγκεκριμένο τύπο Node.

Υπάρχουν πρόσθετες ιδιότητες για κάθε Node τις οποίες το Babel παράγει και οι οποίες περιγράφουν την θέση του Node στον αρχικό πηγαίο κώδικα.

```js
{
  type: ...,
  start: 0,
  end: 38,
  loc: {
    start: {
      line: 1,
      column: 0
    },
    end: {
      line: 3,
      column: 1
    }
  },
  ...
}
```

Αυτές οι ιδιότητες `start`, `end`, `loc`, εμφανίζονται σε κάθε Node.

## <a id="toc-stages-of-babel"></a>Στάδια του Babel

Τα τρια αρχικά στάδια του Babel είναι **parse**, **transform**, **generate**.

### <a id="toc-parse"></a>Parse

Το στάδιο **parse**, λαμβάνει τον κώδικα και εξάγει ένα AST. Υπάρχουν 2 φάσεις της ανάλυσης στο Babel: [**Λεξικολογική Ανάλύση**](https://en.wikipedia.org/wiki/Lexical_analysis) και [**Συντακτική Ανάλυση**](https://en.wikipedia.org/wiki/Parsing).

#### <a id="toc-lexical-analysis"></a>Λεξικολογική Ανάλυση

Η λεξικολογική ανάλυση θα λάβει μια συμβολοσειρά κώδικα (string) και θα την μετατρέψει σε ένα ρεύμα **tokens**.

Μπορείτε να σκεφτείτε τα tokens ως μια επίπεδη σειρά από συντακτικά γλωσσικά κομμάτια.

```js
n * n;
```

```js
[
  { type: { ... }, value: "n", start: 0, end: 1, loc: { ... } },
  { type: { ... }, value: "*", start: 2, end: 3, loc: { ... } },
  { type: { ... }, value: "n", start: 4, end: 5, loc: { ... } },
  ...
]
```

Κάθε ένας από τους `τύπους` έχει ένα σύνολο από ιδιότητες, οι οποίες περιγράφουν το κάθε token:

```js
{
  type: {
    label: 'name',
    keyword: undefined,
    beforeExpr: false,
    startsExpr: true,
    rightAssociative: false,
    isLoop: false,
    isAssign: false,
    prefix: false,
    postfix: false,
    binop: null,
    updateContext: null
  },
  ...
}
```

Τα AST nodes επίσης έχουν `start`, `end`, και `loc`.

#### <a id="toc-syntactic-analysis"></a>Συντακτική Ανάλυση

Η συντακτική ανάλυση θα πάρει ένα ρεύμα από tokens και θα τις μετατρέψει σε μια αναπαράσταση ενός AST. Χρησιμοποιώντας τις πληροφορίες από τα tokens, αυτή η φάση θα τις μορφοποιησεί σε ένα AST το οποίο αναπαρηστά την δομή του κώδικα με τέτοιο τρόπο ώστε να γίνεται ευκολότερη η διαδικασία εργασίας με αυτό.

### <a id="toc-transform"></a>Transform

Το στάδιο [transform](https://en.wikipedia.org/wiki/Program_transformation) λαμβάνει ένα AST και διεισδύει μέσω αυτού στην προσθήκη, ενημέρωση και αφαίρεση nodes κατα μήκος της διείσδυσης. Αυτό είναι μακράν το πιο περίπλοκο μέρος του Babel ή οποιουδήποτε μεταγλωττιστή. Αυτό είναι το σημείο όπου τα βύσματα (plugins) λειτουργούν και αυτό θα είναι το μεγαλύτερο θέμα με το οποίο θα ασχοληθούμε σε αυτό το εγχειρίδιο. Για αυτό το λόγο δεν μπορούμε να εμβαθύνουμε αυτή τη στιγμή.

### <a id="toc-generate"></a>Generate

Το στάδιο [παραγωγής κώδικα](https://en.wikipedia.org/wiki/Code_generation_(compiler)) λαμβάνει το τελικό AST και το μετατρέπει σε μια συμβολοσειρά κώδικα δημιουργώντας και [χάρτες προέλευσης](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/).

Η παραγωγή του κώδικα είναι πολύ απλή: η διεισδυση του AST γίνεται με τον αλγόριθμο "βάθος πρώτα" (depth-first) χτίζοντας μια συμβολοσειρά η οποία αναπαρειστά τον μετασχηματισμένο κώδικα.

## <a id="toc-traversal"></a>Διάσχιση

Όταν θέλετε να μετασχηματίσετε ένα AST πρέπει να [διασχίσετε το δέντρο](https://en.wikipedia.org/wiki/Tree_traversal) αναδρομικά.

Ας υποθέσουμε ότι έχουμε τον τύπο `ΔήλωσηΣυνάρτησης`. Έχει μερικές ιδιότητες `id`. `params`, και `body`. Κάθενα από αυτά έχει εμφωλευμένους nodes.

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  params: [{
    type: "Identifier",
    name: "n"
  }],
  body: {
    type: "BlockStatement",
    body: [{
      type: "ReturnStatement",
      argument: {
        type: "BinaryExpression",
        operator: "*",
        left: {
          type: "Identifier",
          name: "n"
        },
        right: {
          type: "Identifier",
          name: "n"
        }
      }
    }]
  }
}
```

Έτσι ξεκινάμε από την `FunctionDeclaration` και γνωρίζουμε τις εσωτερικές ιδιότητες ώστε να επισκευτούμε σε σειρά κάθε μια από αυτές και τα παιδιά τους.

Επείτα πάμε στο `id` το οποίο είναι ένα απλό `identifier`. Τα `identifiers` δεν έχουν ιδιότητες παιδιών node, οπότε μπορούμε να προχωρήσουμε.

Μετέπειτα αυτού έχουμε τις `params` οι οποίες είναι μια σειρά από nodes τους οποίους επισκεπτόμαστε. Σε αυτήν την περίπτωση πρόκειται για ένα μόνο node που είναι ταυτόχρονα και `Identifier` οπότε μπρούμε να προχωρήσουμε.

Μετά βρίσκουμε το `body` το οποίο είναι ένα `BlockStatement` με την ιδιότητα `body` η οποία είναι μια σειρά από nodes έτσι πηγαίνουμε σε καθένα από αυτούς.

Το μόνο στοιχείο εδώ είναι ένα `ReturnStatement` node, το οποίο έχει ένα `argument`. Πηγαίνοντας στο `argument` βρίσκουμε ένα `BinaryExpression`.

Το `BinaryExpression` έχει έναν `operator`, έναν `αριστερά` και έναν `δεξιά`. Ο operator δεν είναι node, αλλά μια μεταβλητή, έτσι δεν χρειάζεται να πάμε σε αυτόν, αντίθετα επισκεπτόμαστε τον `αριστερά` και τον `δεξιά`.

Η διαδικασία αυτή της διάσχισης συμβαίνει σε όλο το στάδιο μετασχηματισμού της Βαβέλ.

### <a id="toc-visitors"></a>Visitors

Όταν λέμε "να πάμε" σε ένα κόμβο, εννοούμε πραγματικά ότι τον **επισκεπτόμαστε**. Ο λόγος που χρησιμοποιούμε αυτόν τον όρο είναι γιατί υπάρχει αυτή η έννοια ενός [**επισκέπτη**](https://en.wikipedia.org/wiki/Visitor_pattern).

Οι visitors είναι ένα μοτίβο που χρησιμοποιείται στην AST traversal διαγλωσσικά. Με απλά λόγια είναι ένα αντικείμενο με μεθόδους που ορίζονται για την αποδοχή συγκεκριμένων τύπων node σε ένα δέντρο. Αυτό είναι λίγο αφηρημένο, οπότε ας δούμε ένα παράδειγμα.

```js
const MyVisitor = {
  Identifier() {
    console.log("Called!");
  }
};
```

> **Σημείωση:** `Identifier() { ... }`είναι συντομογραφία για `Identifier: { enter() { ... } }`.

Αυτός είναι ένας βασικός visitor που όταν χρησιμοποιείται κατά τη διάρκεια μιας traversal θα καλέσει τη μέθοδο `Identifier()` για κάθε `Identifier` στο δέντρο.

Έτσι με αυτόν τον κώδικα η `Identifier()` μέθοδος θα εκτελεστεί τέσσερις φορές με κάθε `Identifier` (περιλαμβάνοντας το `square`).

```js
function square(n) {
  return n * n;
}
```

```js
Called!
Called!
Called!
Called!
```

Αυτές οι εκτελέσεις είναι όλες στο node **enter**. Ωστόσο, υπάρχει επίσης η δυνατότητα κλήση μιας visitor μέθοδο κατά το **exit**.

Φανταστείτε πως έχουμε αυτή τη δομή δέντρου:

```js
- FunctionDeclaration
  - Identifier (id)
  - Identifier (params[0])
  - BlockStatement (body)
    - ReturnStatement (body)
      - BinaryExpression (argument)
        - Identifier (left)
        - Identifier (right)
```

Καθώς διασχίζουμε το κάθε κλαδί του δέντρου από πάνω προς τα κάτω βρίσκουμε εν τέλει ένα τέλος και χρειάζεται να το ξαναδιασχίσουμε προς την άλλη κατεύθυνση για να βρούμε το επόμενο node. Κατεβαίνοντας το δέντρο κάνουμε **enter** το κάθε node και ανεβαίνοντάς το κάνουμε **exit** το κάθε node.

Ας δούμε πως μοιάζει αυτή η διαδικασία για το παραπάνω δέντρο.

  * Enter `FunctionDeclaration` 
      * Enter `Identifier (id)`
      * Hit dead end
      * Exit `Identifier (id)`
      * Enter `Identifier (params[0])`
      * Hit dead end
      * Exit `Identifier (params[0])`
      * Enter `BlockStatement (body)`
      * Enter `ReturnStatement (body)` 
          * Enter `BinaryExpression (argument)`
          * Enter `Identifier (left)` 
              * Hit dead end
          * Exit `Identifier (left)`
          * Enter `Identifier (right)` 
              * Hit dead end
          * Exit `Identifier (right)`
          * Exit `BinaryExpression (argument)`
      * Exit `ReturnStatement (body)`
      * Exit `BlockStatement (body)`
  * Exit `FunctionDeclaration`

Οπότε δημιουργώντας έναν visitor έχετε δυο ευκαιρίες να επισκεφτείτε ένα node.

```js
const MyVisitor = {
  Identifier: {
    enter() {
      console.log("Entered!");
    },
    exit() {
      console.log("Exited!");
    }
  }
};
```

### <a id="toc-paths"></a>Καθοδήγηση

Ένα AST γενικά έχει πολλά nodes, αλλά πώς τα Nodes σχετίζονται το ένα με το άλλο; Θα μπορούσαμε να έχουμε ένα γιγαντιαίο μεταβλητό αντικείμενο που μπορείτε να χειριστείτε και στο οποίο να έχετε πλήρη πρόσβαση, ή μπορούμε να το απλοποιήσουμε αυτό με **Paths**.

Ένα **Path** είναι μια αναπαράσταση του αντικειμένου από τη σύνδεση μεταξύ δύο node.

Για παράδειγμα, αν πάρουμε το ακόλουθο κόμβο και το παιδί του:

```js
{
  type: "FunctionDeclaration",
  id: {
    type: "Identifier",
    name: "square"
  },
  ...
}
```

Και εμφανίζει το παιδί `Identifier` ως ένα path, που φαίνεται κάτι σαν αυτό:

```js
{
  "parent": {
    "type": "FunctionDeclaration",
    "id": {...},
    ....
  },
  "node": {
    "type": "Identifier",
    "name": "square"
  }
}
```

Έχει, επίσης, πρόσθετα μεταδεδομένα σχετικά με τη διαδρομή:

```js
{
  "parent": {...},
  "node": {...},
  "hub": {...},
  "contexts": [],
  "data": {},
  "shouldSkip": false,
  "shouldStop": false,
  "removed": false,
  "state": null,
  "opts": null,
  "skipKeys": null,
  "parentPath": null,
  "context": null,
  "container": null,
  "listKey": null,
  "inList": false,
  "parentKey": null,
  "key": null,
  "scope": null,
  "type": null,
  "typeAnnotation": null
}
```

Καθώς επίσης και τόνοι από μεθόδους που σχετίζονται με την προσθήκη, ενημέρωση, κίνηση, και κατάργηση των nodes, αλλά εμείς θα ασχοληθούμε με αυτά αργότερα.

Κατά μία έννοια, τα paths είναι μια **reactive** αναπαράσταση της θέσης ενός node στο δέντρο και κάθε λογής πληροφορία για τo node. Κάθε φορά που καλείτε μια μέθοδο που τροποποιεί το δέντρο, οι πληροφορίες αυτές ενημερώνονται. Το Babel διαχειρίζεται όλα αυτά για να κάνουν την εργασία με τα nodes εύκολα και όσο το δυνατόν πιο stateless.

#### <a id="toc-paths-in-visitors"></a>Paths στους Visitors

Όταν έχετε έναν visitor που έχει μια `Identifier()` μέθοδο, στην πραγματικότητα επισκέπτεστε τη διαδρομή (path) αντί για το node. Με αυτό τον τρόπο εργάζεστε ως επί το πλείστον με την αντιδραστική αναπαράσταση ενός node αντί με το ίδιο το node.

```js
const MyVisitor = {
  Identifier(path) {
    console.log("Visiting: " + path.node.name);
  }
};
```

```js
a + b + c;
```

```js
Visiting: a
Visiting: b
Visiting: c
```

### <a id="toc-state"></a>State

Το state είναι ο εχθρός του AST μετασχηματισμού. Το state θα σας δαγκώσει ξανά και ξανά και οι υποθέσεις σας σχετικά με το state σχεδόν πάντα θα αποδειχθούν λάθος από κάποια σύνταξη που δεν σκεφτήκατε.

Πάρτε τον ακόλουθο κώδικα:

```js
function square(n) {
  return n * n;
}
```

Ας γράψουμε ένα γρήγορο hacky επισκέπτη που θα μετονομάσει το `n` σε `x`.

```js
let paramName;

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    paramName = param.name;
    param.name = "x";
  },

  Identifier(path) {
    if (path.node.name === paramName) {
      path.node.name = "x";
    }
  }
};
```

Αυτό θα μπορούσε να λειτουργήσει για τον παραπάνω κώδικα, αλλά μπορεί να σπάσει εύκολα με τον τρόπο αυτό:

```js
function square(n) {
  return n * n;
}
n;
```

Ο καλύτερος τρόπος για να το αντιμετωπίσουμε αυτό είναι η αναδρομή (recursion). Οπότε ας κάνουμε σαν μια ταινία του Christopher Nolan και να βάλουμε έναν επισκέπτη στο εσωτερικό ενός άλλου επισκέπτη.

```js
const updateParamNameVisitor = {
  Identifier(path) {
    if (path.node.name === this.paramName) {
      path.node.name = "x";
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    const paramName = param.name;
    param.name = "x";

    path.traverse(updateParamNameVisitor, { paramName });
  }
};
```

Φυσικά, αυτό είναι ένα σκηνοθετημένο παράδειγμα, αλλά δείχνει πώς να εξαλείψουμε την καθολική κατάσταση(state) από τους visitors σας.

### <a id="toc-scopes"></a>Scopes

Επόμενο ας εισαγάγουμε την έννοια ενός [**scope**](https://en.wikipedia.org/wiki/Scope_(computer_science)). Η JavaScript έχει [lexical scoping](https://en.wikipedia.org/wiki/Scope_(computer_science)#Lexical_scoping_vs._dynamic_scoping), που είναι μια δομή δέντρου όπου blocks δημιουργούνε νέο πεδίο.

```js
// global scope

function scopeOne() {
  // scope 1

  function scopeTwo() {
    // scope 2
  }
}
```

Κάθε φορά που δημιουργείτε μια αναφορά σε JavaScript(reference), είτε πρόκειται για μια μεταβλητή, συνάρτηση, class, param, import, label, κλπ., ανήκει στο τρέχον state.

```js
var global = "I am in the global scope";

function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var two = "I am in the scope created by `scopeTwo()`";
  }
}
```

Κώδικας μέσα σε ένα βαθύτερο scope μπορεί να χρησιμοποιήσει μια αναφορά(reference) από ένα ψηλότερο scope.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    one = "I am updating the reference in `scopeOne` inside `scopeTwo`";
  }
}
```

Ένα χαμηλότερο scope μπορεί επίσης να δημιουργήσει μια αναφορά για το ίδιο όνομα χωρίς να το τροποποιήσει.

```js
function scopeOne() {
  var one = "I am in the scope created by `scopeOne()`";

  function scopeTwo() {
    var one = "I am creating a new `one` but leaving reference in `scopeOne()` alone.";
  }
}
```

Όταν γράφετε ένα μετασχηματισμό, θέλουμε να είμαστε επιφυλακτικοί του scope. Θα πρέπει να βεβαιωθούμε ότι δεν χαλάμε υπάρχοντα κώδικα τροποποιώντας διάφορα τμήματά της.

Μπορεί να θέλουμε να προσθέσουμε νέες αναφορές και να βεβαιωθούμε ότι δεν συγκρούονται με τις ήδη υπάρχοντες. Ή ίσως απλά θέλουμε να βρουμε που αναφέρεται μια μεταβλητή. Θέλουμε να είμαστε σε θέση να παρακολουθούμε αυτές τις αναφορές μέσα σε ένα δεδομένο scope.

Ένα scope μπορεί να αντιπροσωπευθεί ως εξής:

```js
{
  path: path,
  block: path.node,
  parentBlock: path.parent,
  parent: parentScope,
  bindings: [...]
}
```

Όταν δημιουργείτε ένα νέο scope το κάνετε προσδίδοντάς του μια διαδρομή(path) και ένα γονικό state. Στη συνέχεια, κατά τη διαδικασία της διάσχισης συλλέγει όλες τις αναφορές («bindings») στο εν λόγω scope.

Μόλις γίνει αυτό, υπάρχει κάθε λογής μεθόδους που μπορείτε να χρησιμοποιήσετε στα scopes. Εμείς θα τα αναλύσουμε αυτά αργότερα όμως.

#### <a id="toc-bindings"></a>Bindings

Οι αναφορές όλες ανήκουν σε ένα συγκεκριμένο scope. H σχέση αυτή είναι γνωστή ως ένα **binding**.

```js
function scopeOnce() {
  var ref = "This is a binding";

  ref; // This is a reference to a binding

  function scopeTwo() {
    ref; // This is a reference to a binding from a lower scope
  }
}
```

Ένα binding μοιάζει με αυτό:

```js
{
  identifier: node,
  scope: scope,
  path: path,
  kind: 'var',

  referenced: true,
  references: 3,
  referencePaths: [path, path, path],

  constant: false,
  constantViolations: [path]
}
```

Με αυτές τις πληροφορίες μπορείτε να βρείτε όλες τις αναφορές(references) σε ένα binding, να δούμε τι είδους binding είναι(παράμετρος, δήλωση, κ.λπ.), αναζητήσουμε σε ποιο scope ανήκει, ή να πάρουμε ένα αντίγραφο του identifier του. Μπορείτε ακόμα να δείτε αν είναι σταθερές ή όχι και ποιες διαδρομές προκαλούν να είναι μη σταθερές.

Το να είναι κανείς σε θέση να πει εάν ένα binding είναι σταθερό είναι χρήσιμο για πολλούς λόγους, ο μεγαλύτερος των οποίων είναι το minification.

```js
function scopeOne() {
  var ref1 = "This is a constant binding";

  becauseNothingEverChangesTheValueOf(ref1);

  function scopeTwo() {
    var ref2 = "This is *not* a constant binding";
    ref2 = "Because this changes the value";
  }
}
```

* * *

# <a id="toc-api"></a>API

Το Babel είναι στην πραγματικότητα μια συλλογή από modules. Σε αυτήν την ενότητα θα δούμε τα μεγαλύτερα από αυτά, εξηγώντας τι κάνουν και πώς να τα χρησιμοποιούμε.

> Σημείωση: Αυτό δεν είναι αντικατάσταση της λεπτομερής τεκμηρίωση του API που θα είναι διαθέσιμο αλλού σύντομα.

## <a id="toc-babylon"></a>[`babylon`](https://github.com/babel/babylon)

Το Babylon είναι το parser του Babel. Ξεκίνησε ως ένα fork του Acorn, είναι γρήγορο, απλό στη χρήση, έχει αρχιτεκτονική βασισμένη σε plugins για μη τυποποιημένα χαρακτηριστικά (καθώς και μελλοντικά πρότυπα).

Κατ ' αρχάς, ας το εγκαταστήσουμε.

```sh
$ npm install --save babylon
```

Ας ξεκινήσουμε απλά με μια συμβολοσειρά κώδικα:

```js
import * as babylon from "babylon";

const code = `function square(n) {
  return n * n;
}`;

babylon.parse(code);
// Node {
//   type: "File",
//   start: 0,
//   end: 38,
//   loc: SourceLocation {...},
//   program: Node {...},
//   comments: [],
//   tokens: [...]
// }
```

Μπορούμε επίσης να περάσουμε επιλογές στο `parse()` με τον εξής τρόπο:

```js
babylon.parse(code, {
  sourceType: "module", // default: "script"
  plugins: ["jsx"] // default: []
});
```

`sourceType` μπορεί να είναι είτε `"module"` ή `"script"` το οποίο είναι ο τρόπος με τον οποίο το Babylon θα πρέπει να το αναλύσει. `"module"` θα αναλύσει σε αυστηρή λειτουργία και θα επιτρέψει δηλώσεις ενοτήτων(modules), πράγμα που δεν θα κάνει το `"script"`.

> **Σημείωση:** Το `sourceType` έχει ως προεπιλογή το `"script"` και θα εμφανίσει σφάλμα όταν βρει `import` ή `export`. Περάστε `sourceType: "module"` για να απαλλαγείτε από αυτά τα σφάλματα.

Δεδομένου ότι το Babylon είναι χτισμένο με αρχιτεκτονική βασισμένη σε plugin, υπάρχει επίσης μια επιλογή `plugins` που θα ενεργοποιήσει τα εσωτερικά plugins. Σημειώστε ότι το Babylon δεν έχει ακόμη ανοίξει αυτό το API σε εξωτερικά plugins, παρόλο που μπορεί να το πράξει στο μέλλον.

Για να δείτε μια πλήρη λίστα των plugins, δείτε το [Αρχείο README του Babylon](https://github.com/babel/babylon/blob/master/README.md#plugins).

## <a id="toc-babel-traverse"></a>[`babel-traverse`](https://github.com/babel/babel/tree/master/packages/babel-traverse)

Η Babel Traverse ενότητα διατηρεί το συνολικό state του δέντρου και είναι υπεύθυνη για την αντικατάσταση, αφαίρεση και προσθήκη node.

Εγκαταστήσετε εκτελώντας:

```sh
$ npm install --save babel-traverse
```

Μπορούμε να το χρησιμοποιήσουμε παράλληλα με το Babylon και να ενημερώσουμε τα nodes:

```js
import * as babylon from "babylon";
import traverse from "babel-traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (
      path.node.type === "Identifier" &&
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
```

## <a id="toc-babel-types"></a>[`babel-types`](https://github.com/babel/babel/tree/master/packages/babel-types)

Τo Babel Types είναι μια Lodash-esque βοηθητική βιβλιοθήκη για τα AST nodes. Περιέχει μεθόδους για την οικοδόμηση, την επικύρωση και τη μετατροπή AST nodes. Είναι χρήσιμο για τον καθαρισμό της AST λογικής με καλά μελετημένες μεθόδους.

Μπορείτε να το εγκαταστήσετε εκτελώντας:

```sh
$ npm install --save babel-types
```

Στη συνέχεια αρχίσετε να το χρησιμοποιείτε:

```js
import traverse from "babel-traverse";
import * as t from "babel-types";

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: "n" })) {
      path.node.name = "x";
    }
  }
});
```

### <a id="toc-definitions"></a>Ορισμοί

Τα Babel Types έχουν ορισμούς για κάθε τύπο node, με πληροφορίες σχετικές με το ποιες ιδιότητες ανήκουν που, τι τιμές είναι έγκυρες, πώς να χτίσει κανείς αυτόν το node, πώς πρέπει να διέλθει το node και ψευδώνυμα του node.

Ένας node type ορισμός μοιάζει με αυτό:

```js
defineType("BinaryExpression", {
  builder: ["operator", "left", "right"],
  fields: {
    operator: {
      validate: assertValueType("string")
    },
    left: {
      validate: assertNodeType("Expression")
    },
    right: {
      validate: assertNodeType("Expression")
    }
  },
  visitor: ["left", "right"],
  aliases: ["Binary", "Expression"]
});
```

### <a id="toc-builders"></a>Builders

Θα παρατηρήσετε στον παραπάνω ορισμό του `BinaryExpression` ότι έχει ένα πεδίο για έναν `builder`.

```js
builder: ["operator", "left", "right"]
```

Αυτό συμβαίνει επειδή κάθε τύπος node παίρνει μια μέθοδο builder, που όταν χρησιμοποιείται μοιάζει με αυτό:

```js
t.binaryExpression("*", t.identifier("a"), t.identifier("b"));
```

Που δημιουργεί ένα AST σαν αυτό:

```js
{
  type: "BinaryExpression",
  operator: "*",
  left: {
    type: "Identifier",
    name: "a"
  },
  right: {
    type: "Identifier",
    name: "b"
  }
}
```

Που όταν εκτυπωθεί μοιάζει με αυτό:

```js
a * b
```

Οι builders επίσης θα επικυρώσουν τα nodes που δημιουργούν και θα στείλουν περιγραφικά σφάλματα εάν δεν χρησιμοποιηθούν σωστά. Το οποίο οδηγεί στην επόμενη μέθοδο node.

### <a id="toc-validators"></a>Διαδικασίες επικύρωσης

Ο ορισμός για το `BinaryExpression` περιλαμβάνει επίσης πληροφορίες σχετικά με τα `fields` ενός node και πώς να τα επικυρώσει.

```js
fields: {
  operator: {
    validate: assertValueType("string")
  },
  left: {
    validate: assertNodeType("Expression")
  },
  right: {
    validate: assertNodeType("Expression")
  }
}
```

Αυτό χρησιμοποιείται για να δημιουργήσουμε δύο τύπους μεθόδων επικύρωσης. Ο πρώτος των οποίων είναι `isX`.

```js
t.isBinaryExpression(maybeBinaryExpressionNode);
```

Αυτό ελέγχει αν το node είναι μια δυαδική παράσταση, αλλά μπορείτε επίσης να περάσετε μια δεύτερη παράμετρο για να βεβαιωθείτε ότι tο νοδε περιέχει ορισμένες ιδιότητες και τιμές.

```js
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
```

Υπάρχει επίσης η περισσότερο, *ehem*, διεκδικητική μορφή αυτών των μεθόδων, η οποία θα επιστρέψει σφάλματα αντί `true` ή `false`.

```js
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: "*" });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

### <a id="toc-converters"></a>Μετατροπείς

> [WIP]

## <a id="toc-babel-generator"></a>[`babel-generator`](https://github.com/babel/babel/tree/master/packages/babel-generator)

Ο Babel μετατροπέας είναι η γεννήτρια κώδικα για το Babel. Παίρνει ένα AST και το μετατρέπει σε κώδικα με sourcemaps.

Εκτελέστε το ακόλουθο για να το εγκαταστήσετε:

```sh
$ npm install --save babel-generator
```

Στη συνέχεια, χρησιμοποιήστε το

```js
import * as babylon from "babylon";
import generate from "babel-generator";

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

generate(ast, null, code);
// {
//   code: "...",
//   map: "..."
// }
```

Μπορείτε να περάσετε επίσης επιλογές για να κάνετε `generate()`.

```js
generate(ast, {
  retainLines: false,
  compact: "auto",
  concise: false,
  quotes: "double",
  // ...
}, code);
```

## <a id="toc-babel-template"></a>[`babel-template`](https://github.com/babel/babel/tree/master/packages/babel-template)

Το Babel Template είναι μια άλλη λειτουργική μονάδα, μικρή αλλά απίστευτα χρήσιμη. Σας επιτρέπει να γράφετε κώδικα με placeholders που μπορείτε να χρησιμοποιήσετε αντί για δημιουργείτε με μη αυτόματο τρόπο ένα τεράστιο AST. Στην επιστήμη των υπολογιστών, η δυνατότητα αυτή ονομάζεται quasiquotes.

```sh
$ npm install --save babel-template
```

```js
import template from "babel-template";
import generate from "babel-generator";
import * as t from "babel-types";

const buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

const ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module")
});

console.log(generate(ast).code);
```

```js
var myModule = require("my-module");
```

# <a id="toc-writing-your-first-babel-plugin"></a>Γράφοντας το πρώτο σας Babel Plugin

Τώρα που είστε εξοικειωμένοι με όλα τα βασικά του Babel, ας το ενώσουμε με το plugin API.

Ξεκινήστε με μια `συνάρτηση` που παίρνει το τρέχον αντικείμενο [`babel`](https://github.com/babel/babel/tree/master/packages/babel-core).

```js
export default function(babel) {
  // plugin contents
}
```

Δεδομένου ότι θα το χρησιμοποιείτε τόσο συχνά, θα θελήσετε πιθανώς να πάρετε μόνο το `babel.types` με αυτόν τον τρόπο:

```js
export default function({ types: t }) {
  // plugin contents
}
```

Στη συνέχεια, μπορείτε να επιστρέψετε ένα αντικείμενο με ιδιότητα `visitor` που είναι ο κύριος visitor για το plugin.

```js
export default function({ types: t }) {
  return {
    visitor: {
      // visitor contents
    }
  };
};
```

Ας γράψουμε ένα γρήγορο plugin για να δούμε πώς λειτουργεί. Ακολουθεί ο πηγαίος κώδικα μας:

```js
foo === bar;
```

Ή σε AST φτιάχνουν:

```js
{
  type: "BinaryExpression",
  operator: "===",
  left: {
    type: "Identifier",
    name: "foo"
  },
  right: {
    type: "Identifier",
    name: "bar"
  }
}
```

Θα ξεκινήσουμε προσθέτοντας μια visitor μέθοδo `BinaryExpression`.

```js
export default function({ types: t }) {
  return {
    visitor: {
      BinaryExpression(path) {
        // ...
      }
    }
  };
}
```

Στη συνέχεια ας τα περιορίσουμε σε μόλις `BinaryExpression` s που χρησιμοποιούν τον τελεστή `===`.

```js
visitor: {
  BinaryExpression(path) {
    if (path.node.operator !== "===") {
      return;
    }

    // ...
  }
}
```

Τώρα ας αντικαταστήσουμε τη `left` ιδιότητα με ένα νέο identifier:

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  // ...
}
```

Ήδη αν τρέξουμε αυτό το plugin θα έχουμε:

```js
sebmck === bar;
```

Τώρα ας αντικαταστήσουμε μόνο την `right` ιδιότητα.

```js
BinaryExpression(path) {
  if (path.node.operator !== "===") {
    return;
  }

  path.node.left = t.identifier("sebmck");
  path.node.right = t.identifier("dork");
}
```

Και τώρα για το τελικό μας αποτέλεσμα:

```js
sebmck === dork;
```

Φοβερό! Το πρώτο μας Babel plugin.

* * *

# <a id="toc-transformation-operations"></a>Λειτουργίες μετατροπής

## <a id="toc-visiting"></a>Visiting

### <a id="toc-check-if-a-node-is-a-certain-type"></a>Ελέγξτε αν το node ανήκει σε κάποιο συγκεκριμένο είδος

Αν θέλετε να ελέγξετε τι τον τύπο node, ο προτιμώμενος τρόπος για να γίνει αυτό είναι:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left)) {
    // ...
  }
}
```

Μπορείτε επίσης να κάνετε ένα ρηχό έλεγχο για ιδιότητες σε αυτό το node:

```js
BinaryExpression(path) {
  if (t.isIdentifier(path.node.left, { name: "n" })) {
    // ...
  }
}
```

Αυτό είναι λειτουργικά ισοδύναμο με:

```js
BinaryExpression(path) {
  if (
    path.node.left != null &&
    path.node.left.type === "Identifier" &&
    path.node.left.name === "n"
  ) {
    // ...
  }
}
```

### <a id="toc-check-if-an-identifier-is-referenced"></a>Ελέγξτε αν αναφέρεται ένας identifier

```js
Identifier(path) {
  if (path.isReferencedIdentifier()) {
    // ...
  }
}
```

Εναλλακτικά:

```js
Identifier(path) {
  if (t.isReferenced(path.node, path.parent)) {
    // ...
  }
}
```

## <a id="toc-manipulation"></a>Manipulation

### <a id="toc-replacing-a-node"></a>Αντικατάσταση ενός node

```js
BinaryExpression(path) {
  path.replaceWith(
    t.binaryExpression("**", path.node.left, t.numberLiteral(2))
  );
}
```

```diff
  function square(n) {
-   return n * n;
+   return n ** 2;
  }
```

### <a id="toc-replacing-a-node-with-multiple-nodes"></a>Αντικατάσταση ενός node με πολλά nodes

```js
ReturnStatement(path) {
  path.replaceWithMultiple([
    t.expressionStatement(t.stringLiteral("Is this the real life?")),
    t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
    t.expressionStatement(t.stringLiteral("(Enjoy singing the rest of the song in your head)")),
  ]);
}
```

```diff
  function square(n) {
-   return n * n;
+   "Is this the real life?";
+   "Is this just fantasy?";
+   "(Enjoy singing the rest of the song in your head)";
  }
```

> **Σημείωση:** Όταν αντικαθιστάτε μια έκφραση (expression) με πολλαπλά nodes, πρέπει να είναι statements. Αυτό συμβαίνει επειδή το Babel χρησιμοποιεί heuristics εκτενώς κατά την αντικατάσταση των nodes που σημαίνει ότι μπορείτε να κάνετε κάποιους αρκετά τρελούς μετασχηματισμούς που διαφορετικά θα ήταν εξαιρετικά δύσκολο.

### <a id="toc-replacing-a-node-with-a-source-string"></a>Αντικατάσταση node με πηγαία στοιχειοσειρά

```js
FunctionDeclaration(path) {
  path.replaceWithSourceString(`function add(a, b) {
    return a + b;
  }`);
}
```

```diff
- function square(n) {
-   return n * n;
+ function add(a, b) {
+   return a + b;
  }
```

> **Σημείωση:** Δεν συνιστάται να χρησιμοποιείτε αυτό το API, εκτός αν ασχολείστε με δυναμικά source strings. Είναι πιο αποτελεσματικό να αναλύετε τον κώδικα έξω από τον visitor.

### <a id="toc-inserting-a-sibling-node"></a>Εισαγωγή sibling node

```js
FunctionDeclaration(path) {
  path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")));
  path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
}
```

```diff
+ "Because I'm easy come, easy go.";
  function square(n) {
    return n * n;
  }
+ "A little high, little low.";
```

> **Σημείωση:** Αυτό πρέπει πάντα να είναι μια δήλωση(statement) ή μια σειρά από δηλώσεις (array of statements). Αυτό χρησιμοποιεί το ίδιο heuristics που αναφέραμε στην [αντικατάσταση ενός node με πολλα nodes](#replacing-a-node-with-multiple-nodes).

### <a id="toc-removing-a-node"></a>Αφαίρεση ενός node

```js
FunctionDeclaration(path) {
  path.remove();
}
```

```diff
- function square(n) {
-   return n * n;
- }
```

### <a id="toc-replacing-a-parent"></a>Αντικατάσταση ενός γονέα

```js
BinaryExpression(path) {
  path.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral("Anyway the wind blows, doesn't really matter to me, to me."))
  );
}
```

```diff
  function square(n) {
-   return n * n;
+   "Anyway the wind blows, doesn't really matter to me, to me.";
  }
```

### <a id="toc-removing-a-parent"></a>Αφαίρεση ενός γονέα

```js
BinaryExpression(path) {
  path.parentPath.remove();
}
```

```diff
  function square(n) {
-   return n * n;
  }
```

## <a id="toc-scope"></a>Scope

### <a id="toc-checking-if-a-local-variable-is-bound"></a>Έλεγχος σύνδεσης τοπικής μεταβλητής 

```js
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
```

Αυτό θα περάσει το scope δέντρο και θα ελέγξει για τη σθγκεκριμένη σύνδεση.

Μπορείτε επίσης να ελέγξετε εάν ένα πεδίο έχει τη **δική** του δεσμευτική:

```js
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}
```

### <a id="toc-generating-a-uid"></a>Κατασκευή ενός UID

Αυτό θα δημιουργήσει ένα identifier που δεν θα έρχεται σε διένεξη με οποιαδήποτε τοπικά καθορισμένη μεταβλητή.

```js
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}
```

### <a id="toc-pushing-a-variable-declaration-to-a-parent-scope"></a>Περνώντας τη δήλωση μεταβλητής σε ένα γονικό state

Μερικές φορές μπορεί να θέλετε να ωθήσετε ένα `VariableDeclaration`, έτσι ώστε να μπορείτε να το αντιστοιχίσετε σε αυτό.

```js
FunctionDeclaration(path) {
  const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
  path.remove();
  path.scope.parent.push({ id, init: path.node });
}
```

```diff
- function square(n) {
+ var _square = function square(n) {
    return n * n;
- }
+ };
```

### <a id="toc-rename-a-binding-and-its-references"></a>Μετονομάσετε μια δέσμευση και τις αναφορές της

```js
FunctionDeclaration(path) {
  path.scope.rename("n", "x");
}
```

```diff
- function square(n) {
-   return n * n;
+ function square(x) {
+   return x * x;
  }
```

Εναλλακτικά, μπορείτε να μετονομάσετε μια σύνδεση σε ένα δημιουργημένο μοναδικό identifier:

```js
FunctionDeclaration(path) {
  path.scope.rename("n");
}
```

```diff
- function square(n) {
-   return n * n;
+ function square(_n) {
+   return _n * _n;
  }
```

* * *

# <a id="toc-plugin-options"></a>Επιλογές βυσμάτων (plugins)

Αν θέλετε να αφήσετε τους χρήστες σας να επηρεάζουν τη συμπεριφορά του Babel plugin σας μπορείτε να αποδεχτείτε συγκεκριμένες επιλογές plugin που οι χρήστες μπορούν να διευκρινίσουν σαν αυτό:

```js
{
  plugins: [
    ["my-plugin", {
      "option1": true,
      "option2": false
    }]
  ]
}
```

Αυτές οι επιλογές στη συνέχεια ππερνάνε plugin visitors μέσω του αντικειμένου του `state`:

```js
export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path, state) {
        console.log(state.opts);
        // { option1: true, option2: false }
      }
    }
  }
}
```

Οι επιλογές αυτές είναι συγκεκριμένες για τα plugin και δεν έχετε πρόσβαση στις επιλογές από άλλα plugins.

* * *

# <a id="toc-building-nodes"></a>Χτίζοντας Nodes

Όταν γράφετε μετασχηματισμούς συχνά θα θέλετε να δημιουργείτε ορισμένα nodes για να τα εισάγετε στο AST. Όπως αναφέρθηκε προηγουμένως, μπορείτε να το κάνετε αυτό χρησιμοποιώντας τις μεθόδους [builder](#builder) στο πακέτο [`babel-types`](#babel-types).

Το όνομα μεθόδου για ένα builder είναι απλώς το όνομα του τύπου του node που θέλετε να χτίσετε εκτός από το πρώτο γράμμα που δεν το βάζετε κεφαλαίο. Για παράδειγμα αν θέλετε να χτίσετε ένα `MemberExpression` μπορείτε να χρησιμοποιήσετε `t.memberExpression(...)`.

Τα arguments αυτών των builders αποφασίζονται από τον ορισμό του node. Υπάρχει κάποια εργασία που γίνεται για τη δημιουργία ευκολοδιάβαστης τεκμηρίωσης σχετικά με τους ορισμούς, αλλά για τώρα μπορούν όλα να βρεθούν [εδώ](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions).

Ένας node ορισμός μοιάζει με το ακόλουθο:

```js
defineType("MemberExpression", {
  builder: ["object", "property", "computed"],
  visitor: ["object", "property"],
  aliases: ["Expression", "LVal"],
  fields: {
    object: {
      validate: assertNodeType("Expression")
    },
    property: {
      validate(node, key, val) {
        let expectedType = node.computed ? "Expression" : "Identifier";
        assertNodeType(expectedType)(node, key, val);
      }
    },
    computed: {
      default: false
    }
  }
});
```

Εδώ μπορείτε να δείτε όλες τις πληροφορίες σχετικά με αυτό το node type, συμπεριλαμβανομένου του πώς να το χτίσετε, να τον διαπεράσετε και να το επικυρώσετε.

Εξετάζοντας τον `builder`, μπορείτε να δείτε 3 arguments που θα χρειαστείτε για να καλέσετε τη builder μέθοδο (`t.memberExpression`).

```js
builder: ["object", "property", "computed"],
```

> Σημειώστε ότι μερικές φορές υπάρχουν περισσότερα propperties που μπορείτε να προσαρμόσετε στο node σε σχέση με αυτά που περιέχει η σειρά `builder`. Αυτό είναι για να κρατήσουμε τον builder μακριά από το να έχει πολλά arguments. Σε αυτές τις περιπτώσεις θα πρέπει να ρυθμίσετε με μη αυτόματο τρόπο τις ιδιότητες. Ένα παράδειγμα αυτού είναι το [`ClassMethod`](https://github.com/babel/babel/blob/bbd14f88c4eea88fa584dd877759dd6b900bf35e/packages/babel-types/src/definitions/es2015.js#L238-L276).

Μπορείτε να δείτε την επικύρωση για τα builder arguments με το `fields` αντικείμενο.

```js
fields: {
  object: {
    validate: assertNodeType("Expression")
  },
  property: {
    validate(node, key, val) {
      let expectedType = node.computed ? "Expression" : "Identifier";
      assertNodeType(expectedType)(node, key, val);
    }
  },
  computed: {
    default: false
  }
}
```

Μπορείτε να δείτε ότι `το αντικείμενο` πρέπει να είναι μια `Expression`, `property` είτε πρέπει να είναι μια `Expression` ή ένα `Identifier` ανάλογα με εάν το μέλος έκφραση είναι `computed` ή όχι και `computed` είναι απλά μια τιμή boolean που έχει από προεπιλογή στην τιμή `false`.

Έτσι μπορούμε να κατασκευάσουμε ένα `MemberExpression`, κάνοντας το εξής:

```js
t.memberExpression(
  t.identifier('object'),
  t.identifier('property')
  // `computed` is optional
);
```

Το οποίο θα οδηγήσει σε:

```js
object.property
```

Ωστόσο, έχουμε πει ότι το `object` έπρεπε να είναι ένα `Expression`, οπότε γιατί είναι το `Identifier` έγκυρο;

Λοιπόν, αν κοιτάξουμε τον ορισμό του `Identifier` μπορούμε να δούμε ότι έχει μια ιδιότητα `aliases` που δηλώνει ότι είναι επίσης ένα expression.

```js
aliases: ["Expression", "LVal"],
```

Έτσι δεδομένου ότι `MemberExpression` είναι ένα είδος `Expression`, μπορούμε να το ρυθμίσουμε ως `object` μιας άλλης `MemberExpression`:

```js
t.memberExpression(
  t.memberExpression(
    t.identifier('member'),
    t.identifier('expression')
  ),
  t.identifier('property')
)
```

Το οποίο θα οδηγήσει σε:

```js
member.expression.property
```

Είναι πολύ απίθανο ότι ποτέ θα απομνημονεύει τις υπογραφές των builder methods για κάθε node type. Έτσι θα πρέπει να πάρετε κάποιο χρόνο και να καταλάβετε πώς δημιουργούνται από τους ορισμούς του node.

Μπορείτε να βρείτε όλους τους [ορισμούς εδώ](https://github.com/babel/babel/tree/master/packages/babel-types/src/definitions) και μπορείτε να τους δείτε [τεκμηριωμένους εδώ](https://github.com/babel/babel/blob/master/doc/ast/spec.md)

* * *

# <a id="toc-best-practices"></a>Βέλτιστες πρακτικές

> Θα εργάζομαι σε αυτό το τμήμα τις επόμενες εβδομάδες.

## <a id="toc-avoid-traversing-the-ast-as-much-as-possible"></a>Αποφύγετε όσο το δυνατόν την διάσχιση των AST

Το να διασχίζουμε το AST είναι ακριβό, και είναι εύκολο να διασχίσει το AST περισσότερο από όσο χρειάζεται. Αυτό θα μπορούσε να είναι χιλιάδες, αν όχι δεκάδες χιλιάδες επιπλέον λειτουργίες.

Το Babel βελτιστοποιεί αυτό όσο πιο πολύ γίνεται, συγχωνεύοντας visitors μαζί αν μπορεί προκειμένου na γίνουν όλα σε μια ενιαία διάσχιση.

### <a id="toc-merge-visitors-whenever-possible"></a>Συγχωνεύετε τους επισκέπτες οπότε είναι δυνατό

Όταν γράφετε visitors, μπορεί να είναι δελεαστικό να καλέσετε `path.traverse` σε πολλά σημεία όπου είναι λογικά απαραίτητο.

```js
path.traverse({
  Identifier(path) {
    // ...
  }
});

path.traverse({
  BinaryExpression(path) {
    // ...
  }
});
```

Ωστόσο, είναι πολύ καλύτερο να τα γράφετε ως έναν ενιαίο επισκέπτη που εκτελείται μόνο μία φορά. Διαφορετικά διασχίζετε το ίδιο δέντρο πολλές φορές χωρίς λόγο.

```js
path.traverse({
  Identifier(path) {
    // ...
  },
  BinaryExpression(path) {
    // ...
  }
});
```

### <a id="toc-do-not-traverse-when-manual-lookup-will-do"></a>Μην εκτελείτε την διαδικασία διάσχισης όταν εκτελείται χειροκίνητη αναζήτηση

Επίσης μπορεί να είναι δελεαστικό να καλέσετε `path.traverse` όταν ψάχνετε για ένα συγκεκριμένο node type.

```js
const visitorOne = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.get('params').traverse(visitorOne);
  }
};
```

Ωστόσο, αν ψάχνετε για κάτι συγκεκριμένο και ρηχά, είναι μια καλή ευκαιρία να κάνετε μη αυτόματο lookup τα nodes που χρειάζεστε χωρίς να εκτελέσετε μια δαπανηρή διάσχιση.

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```

## <a id="toc-optimizing-nested-visitors"></a>Βελτιστοποίηση των ένθετων visitors

Όταν κάνετε ένθεση επισκέπτες, θα μπορούσε να έχει νόημα να τους γράψετε ένθετα στον κώδικά σας.

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse({
      Identifier(path) {
        // ...
      }
    });
  }
};
```

Ωστόσο, αυτό δημιουργεί ένα νέο visitor object κάθε φορά που το `FunctionDeclaration()` καλείται παραπάνω, το οποίο το Babel θα πρέπει να εκραγεί για το να επικυρώνει κάθε φορά. Αυτό μπορεί να είναι δαπανηρό, οπότε είναι καλύτερο να υψώσουμε τον visitor.

```js
const visitorOne = {
  Identifier(path) {
    // ...
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse(visitorOne);
  }
};
```

Εάν χρειάζεστε κάποιο state στο εσωτερικό του ένθετου visitor, όπως:

```js
const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;

    path.traverse({
      Identifier(path) {
        if (path.node.name === exampleState) {
          // ...
        }
      }
    });
  }
};
```

Μπορείτε να το περάσετε ως state με τη μέθοδο `traverse()` και να έχουν πρόσβαση σε αυτό στο `this` στον επισκέπτη.

```js
const visitorOne = {
  Identifier(path) {
    if (path.node.name === this.exampleState) {
      // ...
    }
  }
};

const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;
    path.traverse(visitorOne, { exampleState });
  }
};
```

## <a id="toc-being-aware-of-nested-structures"></a>Έχοντας επίγνωση των ένθετων δομών

Μερικές φορές, όταν σκεφτόμαστε έναν δεδομένο μετασχηματισμό, μπορεί να ξεχνάμε ότι η συγκεκριμένη δομή μπορεί να είναι ένθετη.

Φανταστείτε για παράδειγμα, ότι θέλουμε να κάνουμε lookup του `constructor` `ClassMethod` από το `Foo` `ClassDeclaration`.

```js
class Foo {
  constructor() {
    // ...
  }
}
```

```js
const constructorVisitor = {
  ClassMethod(path) {
    if (path.node.name === 'constructor') {
      // ...
    }
  }
}

const MyVisitor = {
  ClassDeclaration(path) {
    if (path.node.id.name === 'Foo') {
      path.traverse(constructorVisitor);
    }
  }
}
```

Αγνωούμε το γεγονός ότι οι τάξεις μπορούν να είναι ένθετες και χρησιμοποιώντας το παραπάνω traversal θα πέσουμε πάνω σε ένα ένθετο `constructor`:

```js
class Foo {
  constructor() {
    class Bar {
      constructor() {
        // ...
      }
    }
  }
}
```

> ***Για μελλοντικές ενημερώσεις ακολουθήστε τον [@thejameskyle](https://twitter.com/thejameskyle) στο Twitter.***