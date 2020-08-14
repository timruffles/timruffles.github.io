The object compromise

I’ve observed and explored a pattern which I call the ‘object compromise’. It’s a style of writing applications in a non-functional (TypeScript/JS, Go[1]) language while narrowing the use of objects. This compromise style emerges when you need to use objects (you’re not using a fully functional language, and don’t wish to emulate one), while believing parts of traditional OO approaches problematic.

The ’rules’ that define the style are as follows:

1. model application data as values, not objects
2. use objects for code which performs side-effects[2]
3. pass object dependencies in constructors
4. use functions for code without side-effects (which includes method calls on objects)
5. never use inheritance in application code

Systems written in this style have some interesting characteristics. There are almost no mutable fields on objects. 99% of object fields are set in constructors and simply capture dependencies. Methods orchestrate stateful processes with the help of multiple collaborators, and runtime state is handled by variables (or parameter passing). The 1% are fields in cases with runtime state so complex it’s easiest to handle using state machines, constructed by factories and passed between methods.

There are fewer objects relative to size of the system vs traditional OO style - both in number of constructors/classes but also in the number of instances. Behaviour that would traditionally be implemented using many objects will be handled by a single object orchestrating values returned from and passed into many collaborating objects (representing remote services, databases, etc).

Rule 5 means you have no object hierarchy. That naturally forces you to structure you code via collaboration. Rule 3 means you wire up your graph of collaborators at application startup time. That makes it clear what is a runtime and what is a startup/config time dependency. I find for 95% of use-cases (e.g for only 1/20th of your apps API endpoints) there is no need to create objects at runtime. The last 5% of cases are where you’ll need runtime polymorphism, so one of your constructor-injected objects will be a factory. Factories are also required for runtime state too complex to be handled by local variables and parameter passing.

Rule 4 - early on this rule is easy to follow. Due to rule 1 much of your application logic can be performed on values. If your app grows to support a lot of use-cases in a single code-path you may find yourself ending up with fewer parts of the codebase that don’t need one of feature-flags, metrics, logs or tracing. That’s a growth of essential complexity, and naturally more of your code will end up in objects to handle it.

This pattern completely rules out the active-record pattern. Your application data are values, they do not have behaviour attached. The benefit is that code which writes persistent application state becomes explicit - especially if you prefer `const` in TypeScript or avoid reassignment in Go. This is more work than having powerful (which must mean implicit) entity objects which can manage their own state. This style is also more amenable to the extraction of services when necessary. Your logic doesn’t get written with assumptions about how data is persisted and retrieved. Attempting to add services to complex logic in - for instance - a Rails app which makes heavy use of reads and writes via model relationships will require a rewrite of that use-case. Here, you’ll change the implementation of some object collaborators to be remote, and only have to add RPC error-handling logic to callers.

## But objects mean ${otherThing}

When I say object I have in mind Alan Kay’s original conception: code that communicates via messages, not by exposing internals for reading or mutation. I don’t mean JavaScript (or Java’s) `Object`, or a mutable hash-map. I am referring to the ‘communicate via messages’ pattern which can be implemented in many ways in many languages (e.g Erlang has real messages with an inbox, JavaScript emulates it simply by functions which refer to `this`, Ruby has a distinct dispatch step for message/method sends).

Objects do not have value semantics - the instance you have matters, regardless of whether its replies to messages are currently the same as another object. This is essential to object behaviour - two objects with ‘the same’ value now may be in the midst of two very different stateful processes talking to different collaborators, and treating them as interchangeable would be disastrous.

Mutable fields violate the clarity of communication via messages in Kay’s vision. Setters and getters are symptoms of a procedural style of OO, which is likely to be using objects as mutable data-structures not collaborators.

Inheritance - most perniciously when combined with mutable fields - makes analysing and extending object-oriented systems much harder due to the intimate but implicit coupling it compromises. Collaboration has proved to be the better approach.

## What are values?

Values are data which are equal if their component parts are equal. For instance, `let a = 1; let b = 1; a == b` is a simple example of value semantics: data in different memory locations is equal. Complex data can also have value semantics - for instance two address structs with the same street, town and country. Value semantics can also be thought of as the opposite of object semantics: object equality semantics mean objects are only equal to themselves, i.e comparison of two references to the same place in memory.

## Is this just the functional core, imperative shell?

Somewhat, except there isn’t much of a functional core, i.e I haven’t observed a meaningful amount of application logic implemented as functions and values which is then manipulated by objects. Here application logic is interwoven in methods on objects. I’ve not seen a large functional-core imperative-shell application so I’ll not comment on whether that would be ‘better’, I’d imagine it’d be domain-specific.

## Is it just good object-oriented style?

There is no general definition of good object-oriented style 😁. This pattern is largely equivalent to the style in Growing Object-Oriented Software Guided by Tests (and certainly the definition of objects vs values is identical). However, there it’s defined in top-down, abstract terms (“Compose objects to describe system behaviour”); I find a strict, bottom-up, focus on language features provides a more precise (and easy to follow) definition.

- [1] I’ve had most experience of this style writing Go at GitHub and Plaid, and TypeScript for my own projects. Both JavaScript and Go have functional features, but compared to, say, Haskell or Clojure, they clearly lack core primitives for handling state in a functional way (monads or atoms etc respectively), and aren’t idiomatically functional ‘in the large’ (i.e beyond Array.reduce)
- [2] including method calls on objects. Aside from that, the usual: network, logging, metrics, disk, databases, randomness, etc.
