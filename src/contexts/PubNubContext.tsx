import React, { useContext, createContext, useCallback } from "react";
import PubNub from "pubnub";

import { uuid } from "utils/common.utils";

const myUuid = uuid();

const pubnub = new PubNub({
  publishKey: process.env.REACT_APP_PUBNUB_PUBLISH_KEY!,
  subscribeKey: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY!,
  uuid: myUuid,
});

interface PubNubContextValues {
  onPublishMessage: (message: any) => Promise<void>;
  onSubscribeToChannel: (callback: (message: any) => void) => void;
  onUnsubscribeFromChannel: () => void;
}

interface CanvasContextProviderProps {
  channelId: string;
}

export const PubNubContextProvider = (
  props: React.PropsWithChildren<CanvasContextProviderProps>
) => {
  const handlePublishMessage = useCallback(
    async (message: any) => {
      const publishPayload = {
        channel: props.channelId,
        message: JSON.stringify(message),
      };

      await pubnub.publish(publishPayload);
    },
    [props.channelId]
  );

  function handleSubscribeToChannel(callback: (message: any) => void) {
    pubnub.subscribe({
      channels: [props.channelId],
    });

    pubnub.addListener({
      message: (event) => {
        if (event.publisher === myUuid) {
          return;
        }

        return callback(JSON.parse(event.message));
      },
    });
  }

  function handleUnsubscribeFromChannel() {
    pubnub.unsubscribeAll();
  }

  return (
    <PubNubContext.Provider
      value={{
        onPublishMessage: handlePublishMessage,
        onSubscribeToChannel: handleSubscribeToChannel,
        onUnsubscribeFromChannel: handleUnsubscribeFromChannel,
      }}
    >
      {props.children}
    </PubNubContext.Provider>
  );
};

const PubNubContext = createContext<PubNubContextValues>(
  {} as PubNubContextValues
);

export const usePubNubContext = () => useContext(PubNubContext);
