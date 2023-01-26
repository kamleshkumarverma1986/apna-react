# Apna-React

It's My Own React Implementation.
Here i just tried to mimic the React.
So basically in React-16 onward, they have changed the react reconciliation process by using
the React-Fiber Object. I just tried to write the React-Fiber reconciliation process.
It's not fully performant and fully functional like React. You can just think that this is the light-weight version of ReactJS.

# What is the React Fiber:

React Fiber is just a plain JavaScript Object.
which have some properties to manage the links b/w the other react-fiber objects

# What is the React Fiber Tree:

It's again React Fiber Object (JS Object) which have some properties
(like: child, parent, alternate) which denote to other fibers and so on.
So basically React Fiber have some hierarchy (like child, parent, sibling)
and that hierarchy is called Fiber Tree.

# History:

Before React 16, they directly generate all the DOM in synchronous fashion after having React element ready. And its block the CALL-STACK completely. And also it looses the more control in between while rendering.

So Later on (React >= 16) FaceBook Developer, developed some cool stuff.
which is called React-Fiber And each React-Fiber consider as one unit of work at a given point of time.
So for better understanding, you can think of this is an Object which get constructed for each DOM node in asynchronous fashion so that it's not gonna block the CALL-STACK. ......Ahhhh .. COOL Right?

# Challenges:

But Question here is, How we can construct this React-Fiber asynchronously?
There is no Magic here.. All is JUST JavaScript.

There is something called requestIdleCallback.\
Read more about it https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback

requestIdleCallback method queues a function to be called during a browser's idle periods.
[NOTE: But React uses something different other than this. they uses scheduling packages. internally
they are also doing the same thing but that scheduling packages provide more control over the time]

# React-Fiber reconciliation process

There are two phases: Render Phase and Commit Phase

### Render Phase (Processing)
This is asynchronous process

<p align="center">
  <img src="imgs/Screenshot 2023-01-15 at 5.51.15 PM.png" title="Render Phase">
</p>

### Commit Phase (Committing)
This is synchronous process

<p align="center">
  <img src="imgs/Screenshot 2023-01-15 at 6.15.39 PM.png" title="Render Phase">
</p>

And whenever there are any changes occured by React (through props or state changes) than again these both process begin. But this time in Render-Phase, they will compare the currentRoot nodes (which is already rendered in your browser) with wipRoot nodes (on-going changes) by using alternate
( wipRoot.alternate -> currentRoot  ) properties and it will find all those React-Fibers which have the changes and keep the "UPDATE" tag with those nodes. \
And now in Commit Phase, it will just update all the DOM which have the "UPDATE" tags.


# Resources: 

https://youtu.be/0ympFIwQFJw \
https://blog.logrocket.com/deep-dive-react-fiber/ \
https://pomb.us/

