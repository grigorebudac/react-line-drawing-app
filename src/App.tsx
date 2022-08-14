import CanvasContainer from "containers/CanvasContainer";
import { PubNubContextProvider } from "contexts/PubNubContext";
import { CanvasContextProvider } from "contexts/CanvasContext";

const App = () => {
  return (
    <PubNubContextProvider>
      <CanvasContextProvider>
        <CanvasContainer />
      </CanvasContextProvider>
    </PubNubContextProvider>
  );
};

export default App;
