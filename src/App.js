import React from 'react';
import MapComponent from './components/MapComponent ';
import ErrorBoundary from './components/ErrorBoundary';
import TestComponent from './components/TestComponent';

const App = () => (
  <ErrorBoundary>
    <MapComponent />
    <TestComponent/>
  </ErrorBoundary>

);

export default App;