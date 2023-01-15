import { createTextElement, createRealDomElement, updateDom } from "./utils";

let wipRoot = null; // going to be rendered
let currentRoot = null; // which is already rendered
let nextUnitOfWork = null; // requestIdleCallback will perform some unit of work at a time.

function commitRoot() {
  // Final Rendering in browser.
  commitPhase(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitPhase(fiber) {
  if (!fiber) {
    return;
  }
  let parentFiber = fiber.parent;
  while (!parentFiber.dom) {
    /*
      finding the availble dom in parent
      this is needed because all functional component
      does not have dom.. in case of function component
      value of "type" is "a function".. that why there is
      no dom..
    */
    parentFiber = parentFiber.parent;
  }

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    parentFiber.dom.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  }

  commitPhase(fiber.child);
  commitPhase(fiber.sibling);
}

/* This will run in loop. whenever browser is ideal, they will start doing this work */
function workLoop(deadline) {
  let shouldRun = true;
  while (shouldRun && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldRun = deadline.timeRemaining() >= 1;
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function performUnitOfWork(fiberObj) {
  /* updateFunctionComponent or updateHostComponent  => It will add child */
  if (fiberObj.type instanceof Function) {
    updateFunctionComponent(fiberObj);
  } else {
    updateHostComponent(fiberObj);
  }
  if (fiberObj.child) {
    /*
      returning next unit of work for child
      [Remember]: First we drill down to child at deep depth.
      then we go for sibling.
    */
    return fiberObj.child;
  }

  let tempFiber = fiberObj;
  while (tempFiber) {
    if (tempFiber.sibling) {
      /*
        Now if there is no child of fiberObj
        we have to process [next unit of work] the sibling
      */
      return tempFiber.sibling;
    }
    /*
      Very IMP: At the last, once you done with all sibling
      go to parent and again do the same for sibling
      and at the final you will reach at the root node..
      where you have to stop.
    */
    tempFiber = tempFiber.parent;
  }
}

let rerenderFiber = null; // Whenever props or state change. it will be used
let stateIndex = null;

function updateFunctionComponent(fiber) {
  rerenderFiber = fiber;

  /*
    Hooks managements
    Right now i am only supporting
    useState and useEffect
  */

  rerenderFiber.states = [];
  stateIndex = 0;
  rerenderFiber.effects = [];

  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createRealDomElement(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

/*
  Adding the appropriate LABEL (REPLACEMENT, UPDATE)
  So that we can later in COMMIT_PHASE, simply we can update the DOM
*/
function reconcileChildren(fiberObj, children) {
  if (children.length === 0) return null; // early returned if no child

  let index = 0;
  let oldFiber = fiberObj.alternate?.child;
  let prevNewFiber = null;

  while (index < children.length || oldFiber) {
    const element = children[index];
    const isSameType = oldFiber?.type === element.type;
    let newFiber = null;

    if (isSameType) {
      // TODO
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: fiberObj, // TODO very IMP
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    } else if (element && !isSameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        effectTag: "PLACEMENT",
        alternate: null,
        parent: fiberObj,
        child: null,
      };
    }

    // TODO
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiberObj.child = newFiber;
    } else {
      prevNewFiber.sibling = newFiber;
    }

    prevNewFiber = newFiber;
    index++;
  }
}

const ApnaReact = {
  Fragment: "div",
  createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children: children.map((child) =>
          typeof child === "object" ? child : createTextElement(child)
        ),
      },
    };
  },
  createRoot(container) {
    return {
      render(ApnaReactElementTree) {
        wipRoot = {
          dom: container,
          props: {
            children: [ApnaReactElementTree],
          },
          alternate: currentRoot, // "alternate" refer to older root corresponding to this.
        };
        nextUnitOfWork = wipRoot;
      },
    };
  },
  useState(initial) {
    const oldState = rerenderFiber.alternate?.states?.[stateIndex];
    const state = {
      value: oldState ? oldState.value : initial,
      queue: [],
    };

    const actions = oldState ? oldState.queue : [];
    actions.forEach((action) => {
      state.value = action(state.value);
    });

    const setState = (action) => {
      /*
        We just pushed the action (callback),
        Later when it will re-render, it will call this 
        action and get the latest value
      */
      state.queue.push(action);

      // re-rendering
      wipRoot = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot,
      };
      nextUnitOfWork = wipRoot;
    };

    rerenderFiber.states.push(state);
    stateIndex++;
    return [state.value, setState];
  },
  useEffect(callback, dependenciesArray) {
    // useEffect WIP [TODO]
    rerenderFiber.effects.push({ callback, dependenciesArray });
  },
};

export default ApnaReact;
export const { createRoot, useState, useEffect } = ApnaReact;
