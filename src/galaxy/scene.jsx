import React from 'react';
import HoverInfo from './hoverInfo.jsx';
import NodeDetails from './nodeDetails/nodeDetailsView.jsx';

import SteeringIndicator from './steeringIndicator.jsx';
import SearchBox from './search/searchBoxView.jsx';
import WindowCollection from './windows/windowCollectionView.jsx';
import createNativeRenderer from './native/renderer.js';
import createKeyboardBindings from './native/sceneKeyboardBinding.js';

import appEvents from './service/appEvents.js';

module.exports = require('maco')(scene);

function scene(x) {
  var nativeRenderer, keyboard;
  var hoverModel, delegateClickHandler;

  x.render = function() {
    return (
      <div>
        <div ref='graphContainer' className='graph-full-size'/>
        <HoverInfo />
        <NodeDetails />
        <SteeringIndicator />
        <SearchBox />
        <WindowCollection />
      </div>
    );
  };

  x.componentDidMount = function() {
    var container = React.findDOMNode(x.refs.graphContainer);
    nativeRenderer = createNativeRenderer(container);
    keyboard = createKeyboardBindings(container);
    delegateClickHandler = container.parentNode;
    delegateClickHandler.addEventListener('click', handleDelegateClick);
  };

  x.componentWillUnmount = function() {
    if (nativeRenderer) nativeRenderer.destroy();
    if (keyboard) keyboard.destroy();
    if (delegateClickHandler) delegateClickHandler.removeEventListener('click', handleDelegateClick);
  };

  function handleDelegateClick(e) {
      var clickedEl = e.target;

      // since we are handling all clicks, we should avoid excessive work and
      // talk with DOM only when absolutely necessary:
      var classList = clickedEl.classList;
      var isInDegree = classList.contains('in-degree');
      var isOutDegree = !isInDegree && classList.contains('out-degree');
      var nodeId;
      if (isInDegree || isOutDegree) {
        nodeId = parseInt(clickedEl.id, 10);
        var connectionType = isInDegree ? 'in' : 'out';

        appEvents.showDegree.fire(nodeId, connectionType);
      }
      if (classList.contains('node-focus')) {
        nodeId = parseInt(clickedEl.id, 10);
        appEvents.focusOnNode.fire(nodeId);
      }
    }
}
