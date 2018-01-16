draft: true
title: Refactoring from object-oriented to procedural
body: |

Discussion of programming paradigms is often abstact waffle. So here I'd like to present a case-study, of refactoring from an object-based[1] approach to a procedural one.

## JavaScript Garden

Back in 2013 I took over the maintainence of the Javascript Garden. On doing so I decided to rewrite the static site generator code. It was 
173 source lines of code - take a moment to [scan the code](https://github.com/BonsaiDen/JavaScript-Garden/blob/ae291a4002602ad217050fc26032cb81b07b7680/build.js).

At the high level the program is a single function, `main`, and the `Garden` class, with the following instance methods:

1. log
1. loadIndex
1. loadSection
1. parseArticle
1. toMarkdown
1. json
1. md
1. folder
1. render
1. generateAll
1. generate

The flow of control is:

1. `main` instantiates an instance of `Garden`
1. `Garden` calls internal methods, managing the process of generating the static site

What is striking in this flow is that the program is perfectly procedural: we start, do some stuff, and leave. This constrasts with an interactive program, a GUI or CLI for instance, or simulation with multiple agents etc. It is also very much application code: this is a program for a specific job, and thus would gain no benefit from reusability, extensibility, etc.

This clash between form and function led me to decide to do the rewrite.

Let's take a peek at each implementation.

## Classy implementation

We are first presented with the class definition. We see the constructor does some initial parsing of the options, then kicks off other methods, which cause the conversion procedure to run[1].

Following method by method, we see lots of use of the blessed `this` variable to pass state between the methods, rather than passing the state through function arguments. For instance, in the constructor we see the following code setting up the `this.lang` member, which goes on quite the adventure!


    var that = this;
    languages.forEach(function(lang) {
        if (fs.statSync(that.options.dir + '/' + lang).isDirectory()) {
            that.log('Parsing language "{}"...', lang);
            // 👉 here we're setting up a fresh structure
            that.lang = {
                id: lang,
                navigation: [],
                index: []
            };

            // 👉 that loadIndex is mutating
            if (that.loadIndex()) {
                // 👉 which is then stored
                that.languages[lang] = that.lang;
                that.log('    Done.');

            } else {
                that.log('    Error: Could not find "index.json"!');
            }
        }
    });

    delete this.lang;

If we follow the flow, `this.lang` is actually accessed by a number of methods spread throughout the source-file:

    
    // 👉 line 48
    loadIndex: function() {
        // ...
        this.lang.index.sections.forEach(function(section, i) {
            that.loadSection(section);
            // ...
        })
    },
    // 👉 line 71
    loadSection: function(section) {
        var files = fs.readdirSync(this.folder(section.dir));
        // ...
    },
    // ...
    // 👉 line 137
    folder: function(section) {
        return [this.options.dir, this.lang.id, section].join('/');
    }
    
So `this.lang` has been used to implicit passing state through a series of 4 functions: `constructor`, `loadIndex`, `loadSection` and `folder`.  

Another example of mutation across function boundaries, is present between loadIndex and loadSection:

      loadIndex: function() {
        // ...
        this.lang.index.sections.forEach(function(section, i) {
            // 👉 section is parsed in to be processed...
            that.loadSection(section);
            // 👉 nothing returned, and we use section here: suggests mutation
            that.lang.navigation.push({
                title: section.title,
                // ... more use of section
            });
        });
        // ...
    },

    loadSection: function(section) {
        // ...
        section.articles.concat('index').forEach(function(article, e) {
          // ...
          // 👉 and indeed, here we see that the section object is mutated
          section.parsed[article] = parsed;
          // ...
        });
    },

Once you realise that `this.lang` is only used in a short-lived chain of function calls, you realise it could actually be replaced with a module-level variable. This is true even if there were more than one instance of `Garden`, as `this.lang` is initialized, mutated, and overwritten/deleted, synchronously within a single tick of the loop.

### Form and function

The program's behaviour is procedural, but its form doesn't suggest that at a high-level. We have to read through the methods, following the calls around to get an idea of how it works.

Using a class to model this program has, to my eyes, only made it harder to grasp. Nothing about how we use classes makes it a good fit: 

- we have only a single instance
- the object has a short and definined life-span
- its methods are called in a fixed and deterministic sequence, rather than in a random-access fashion (which we'd expect if it were called by collaborating objects, for instance the varies kind calling pattern we'd see for different `Map` instances)
  - indeed, all of its methods and properties could be private!

## Procedural version

[Have a scan](https://github.com/BonsaiDen/JavaScript-Garden/blob/ae291a4002602ad217050fc26032cb81b07b7680/build.js). First we see the program is just over half as long - 92 SLOC.

The program is composed of 8 functions:

1. main
1. loadLanguages
1. loadLanguage
1. loadArticle
1. processArticleBody
1. readJson
1. outputLanguage
1. writeTemplate

The main function provides us a high-level understanding of what's going on, making use of function declaration hoisting:

    function main(opts) {
      loadLanguages(opts.languagesDir)
      .sort(function(a,b) {
        return a.id > b.id ? 1 : -1
      })
      .forEach(function(lang,_,languages) {
        outputLanguage(lang,languages,opts);
      });
    }

We're loading languages, sorting them into a specific order, and ouputting them. The essence of the procedure is made clear, and we can then dig into the implementation of the high-level sub-procedures.

Rather than mutating data-structures, functions that aren't simply side-effects will return a new structure:

    function loadLanguage(path) {
      var index = readJson(path + '/index.json');
      var language = _.extend(index,{
        sections: index.sections.map(function(section) {
          return _.extend(section,{
            link: section.dir,
            isIntro: section.dir == "intro",
            articles: section.articles.map(function(article) {
              return _.extend({
                link: section.dir + "." + article
              },loadArticle(path + "/" + section.dir + "/" + article + ".md"));
            })
          })
        })
      });
      language.navigation = language.sections;
      return language;
    }

Functions that take input and return output are, in my mind, clearer in use than functions involving mutation. When we're analysing them we know that they're not affecting their arguments, and that the values they return are either the original input or a fresh value.

You can see that this program has not separated side-effects from computation: we're invoking other functions rather are clearly going to do some IO, e.g `readJson`. If something went wrong with this program, I might change this to make it a breeze to test. Nothing's gone wrong with it yet though.

## It's not object-oriented enough

It's pretty clear that the original code was not principled object-oriented design. However, I think I would be equally likely to refactor a 'small objects' approach. Smashing up a simple procedure into a number of short-lived collaborating objects would have scattered the logic - which fit on a screen in the procedural solution - over far too many files and lines.

It might be interesting to try out a [GOOSGBT](http://www.growing-object-oriented-software.com/) style principled OO solution though.

## Conclusion

It's a common claim that procedural code is as immature stage we leave once we mature into {functional,OO,XYZ}-programmers. This is as sensible as claiming that it is the mark of a mature actors to deliver every line dramatically, communicating complex emotion and subtext. Just like code whose form doesn't fit the problem at hand, such exaggerated delivery would get in the way of the story.

Sometimes the problem in front of us is just a procedure. When it is, write procedural code.



