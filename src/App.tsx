import { useEffect, useState } from "react";

import { appendParamToUrlIfNotExists, getParamFromUrl } from "utils/url.utils";
import { uuid } from "utils/common.utils";

import CanvasContainer from "containers/CanvasContainer";
import { PubNubContextProvider } from "contexts/PubNubContext";
import { CanvasContextProvider } from "contexts/CanvasContext";

const CHANNEL_ID_KEY = "channelId";

const App = () => {
  const [channelId] = useState(getParamFromUrl(CHANNEL_ID_KEY) ?? uuid());

  useEffect(() => {
    appendParamToUrlIfNotExists(CHANNEL_ID_KEY, channelId);
  }, [channelId]);

  return (
    <PubNubContextProvider channelId={channelId}>
      <CanvasContextProvider>
        <CanvasContainer />
      </CanvasContextProvider>
    </PubNubContextProvider>
  );
};

export default App;
