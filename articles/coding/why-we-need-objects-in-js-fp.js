body: |
  Althought functional programming has taken JS by storm - Redux, RxJS, and friends - you'll notice one thing we haven't got rid of: objects. Not `Object`, but full-blown, Alan Kay, "behaviour and state" objects.

  Why?

  Let's agree some definitions. Here I'm using FP to mean a certain set of principles:

  - modelling without the use of mutable datastructures in business logic (i.e normal app code)
  - no reassignment of local, or especially shared, variables in business logic

  So, big no-nos would be:

  ~~~
  let user = {};
  User.authenticate((err, userFromApi) => {
      if(err) {
        // ...
      } else {
        user = userFromApi;
        userView.render();
      }
  })
  ~~~

  Why? Here we're using a shared 'user' variable to model the state.
  
  Equally, we could not use a user 'model' and have it load its own state, as that'd be using mutable datastructures in our business logic:

  ~~~
  class User {
    load() {
      User.authenticate((err, userFromApi) => {
          if(err) {
            // ...
          } else {
            this.set(userFromApi)
          }
      })
    }
  }
  ~~~

  ## Objectless code

  Languages with a compiler can write code like the following, without recourse to objects:

  ~~~
  app = 
    user = load_user

  ~~~


  ## Javascript, at root

  Javascript's execution model has events and asynchronousy at its core. We can't develop any interesting applications without having to hook into this. A compiled language - Haskell for instance - can support effectively any model of execution by concealing the details behind compilation. The compiler takes code in one flow-control idiom and can spit out code in another. 

  If we're writing JS, there is simply no way we can write code in a way that conceals JS's evented nature.

  Okay - why does this force us to use objects?

  Well: let's agree that regardless of how we push state around, all programs will need state. FP simply shoves it out into the cold borders of our program, rather than woven throughout it.

  What kind of state? Not the 'accidental state' that is used by so much OO/producural code, but essential state. Here are some examples of essential state:

  - have we received a response from a server
  - did we open a file, or did we fail?
  - what does the user wish the value of this input box to be?

  Accidental state is simply a side-effect of a certain coding style, things like:

  - state flags like "done loading"
  - using a mutable object to "build up" a result

  ## Handling essential state without objects

  There is one way to handle essential state without objects, but it's fairly hairy: continuation passing. That is, setting up a long chain of callbacks that pass the current essential state around as the program continues.

  ## Redux

  Where are we forced to use objects in Redux? The store. This is our single global store for essential state. We have principled rules around updating the state, but nevertheless we can't do without it.

  ## Promises



  ## RxJS


