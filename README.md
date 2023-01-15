# Apna-React

It's My Own React Implementation
Here i just tried to mimic the React.

# What is the React Fiber:

Fiber is just plain JavaScript Object
which have some properties to manage the links b/w the other fibers

# What is the React Fiber Tree:

It's again React Fiber Object (JS Object) which have some properties
(like: child, parent, alternate) which denote to other fibers and so on.
So basically React Fiber have some hierarchy (like child, parent, sibling)
and that hierarchy is called Fiber Tree.

# History:

Before React 16, they directly generate all the DOM in synchronous fashion after having React element ready. And its block the CALL-STACK completely. And also it looses the more control in between while rendering.

So Later on (React >= 16) FaceBook Developer, developed some cool stuff. which is called React-Fiber
And each React-Fiber consider as one unit of work at a given point of time.
So for better understanding, you can think of this is an Object which get constructed for each dom node in asynchronous fashion so that it not gonna block the CALL-STACK. COOL Right?

# Challenges:

But Question here is, How we can construct this React-Fiber asynchronously?
There is no Magic here.. All is JUST JavaScript.

There is something called requestIdleCallback.
requestIdleCallback method queues a function to be called during a browser's idle periods.
[NOTE: But React uses something different other than this. they uses scheduling packages. internally
they are also doing the same thing but that scheduling packages provide more control]
